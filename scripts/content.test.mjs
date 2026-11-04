import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, cp, rm, readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { once } from 'node:events';
import { spawnSync } from 'node:child_process';
import { root, readContent, validateContent, snapshot, prepareCandidate, applyCandidate, hash, serialize, isValidDate, recordPath } from './content.mjs';
import { importArxiv } from './content-cli.mjs';
import { createContentServer } from './content-server.mjs';

async function fixture(t){
 const folder=path.join(root,'.content-work/tests');await mkdir(folder,{recursive:true});
 const base=await mkdtemp(path.join(folder,'case-'));t.after(()=>rm(base,{recursive:true,force:true}));
 await cp(path.join(root,'content'),path.join(base,'content'),{recursive:true});
 // Asset paths are validated; link to the read-only source trees instead of duplicating them.
 const {symlink}=await import('node:fs/promises');
 for(const name of ['assets','figure'])await symlink(path.join(root,name),path.join(base,name));
 return base;
}
async function draft(base){const data=await readContent(base),record=structuredClone(data.news[0]);record.content+=' Test update.';return {schemaVersion:1,collection:'news',id:record.id,baseHash:hash(data.news[0]),reason:'Test',record};}

test('content contracts validate the catalog, precise dates and resolvable references',async()=>{
 const data=await readContent();await validateContent(data);
 assert.ok(data.publications.length>=14);assert.ok(data.news.length>=25);
 assert.equal(data.policy.homeNewsLimit,5);assert.ok(isValidDate('2024-02-29'));assert.ok(!isValidDate('2025-02-29'));assert.ok(!isValidDate('2026-13'));
 const renamed=structuredClone(data);renamed.publications.find(p=>p.arxiv==='2609.17439').title='A corrected paper title';await validateContent(renamed);
 for(const mutate of [d=>d.publications.push({...d.publications[0],id:'duplicate'}),d=>d.research.directions[0].visuals[0].publicationId='missing',d=>d.news[0].date='2026-02-30',d=>d.publications[0].figure='/../secret',d=>d.publications[0].journalLink='javascript:alert(1)',d=>d.site.unusedField='typo',d=>d.site.email.local='invalid@name',d=>d.site.email.domain='gmail.com?bcc=someone']){
  const invalid=structuredClone(data);mutate(invalid);await assert.rejects(validateContent(invalid));
 }
 for(const title of data.policy.excludedTitles){const invalid=structuredClone(data);invalid.publications[0].title=title;await assert.rejects(validateContent(invalid),/Excluded/);}
});

test('candidate preview is read-only; apply is atomic, idempotent and rejects stale edits',async t=>{
 const base=await fixture(t),candidate=await draft(base),file=recordPath('news',candidate.id,base),before=await readFile(file,'utf8');
 assert.ok((await prepareCandidate(candidate,base)).changed);assert.equal(await readFile(file,'utf8'),before);
 assert.ok((await applyCandidate(candidate,base)).changed);assert.equal((await applyCandidate(candidate,base)).changed,false);
 const stale=structuredClone(candidate);stale.record.content+=' Stale draft.';await assert.rejects(applyCandidate(stale,base),/changed since/);
 assert.equal((await snapshot('news',candidate.id,base)).record.content,candidate.record.content);
 assert.throws(()=>recordPath('news','../../outside',base),/Invalid/);
 const invalid=await draft(base);invalid.record.verification='inherited';await assert.rejects(applyCandidate(invalid,base),/Confirm the source/);
 assert.equal((await readdir(path.join(base,'.content-work'))).includes('write.lock'),false);
});

test('parallel writers cannot silently replace each other',async t=>{
 const base=await fixture(t),a=await draft(base),b=structuredClone(a);b.record.content+=' Another writer.';
 const outcomes=await Promise.allSettled([applyCandidate(a,base),applyCandidate(b,base)]);
 assert.equal(outcomes.filter(r=>r.status==='fulfilled').length,1);assert.equal(outcomes.filter(r=>r.status==='rejected').length,1);
});

test('arXiv import filters identity and exclusions, never mutates live content or overwrites drafts',async t=>{
 const base=await fixture(t),before=serialize(await readContent(base));
 const entry={arxiv:'2611.12345',title:'An example paper',authors:['Naixu Guo','A. Collaborator'],published:'2026-11-01',updated:'2026-11-02'};
 const entries=[entry,{...entry,arxiv:'2611.12346',authors:['Someone Else']},{...entry,arxiv:'2611.12347',title:'COMPOSITE-STEM: example'},{...entry,arxiv:'2609.17439'}];
 const result=await importArxiv(entries,base);assert.equal(result.drafts.length,1);assert.equal(result.skipped.length,3);assert.equal(serialize(await readContent(base)),before);
 const candidate=JSON.parse(await readFile(result.drafts[0],'utf8'));assert.equal(candidate.baseHash,null);assert.equal(candidate.record.summary,'');await assert.rejects(prepareCandidate(candidate,base),/summary/);
 const edited=serialize({...candidate,reason:'Human edits in progress'});await writeFile(result.drafts[0],edited);await importArxiv([entry],base);assert.equal(await readFile(result.drafts[0],'utf8'),edited);
});

test('offline Atom parsing removes revision suffixes and preserves metadata',async t=>{
 const base=await fixture(t),file=path.join(base,'feed.xml');await writeFile(file,'<feed xmlns="http://www.w3.org/2005/Atom"><entry><id>http://arxiv.org/abs/2611.12345v2</id><title> A new\n paper </title><published>2026-11-01T00:00:00Z</published><updated>2026-11-02T00:00:00Z</updated><author><name>Naixu Guo</name></author></entry></feed>');
 const result=spawnSync('python3',[path.join(root,'scripts/collect-arxiv.py'),'--input',file],{encoding:'utf8'});assert.equal(result.status,0);const [record]=JSON.parse(result.stdout);assert.equal(record.arxiv,'2611.12345');assert.equal(record.title,'A new paper');assert.deepEqual(record.authors,['Naixu Guo']);
});

test('local editor validates writes, rejects foreign origins and refuses private paths',async t=>{
 const base=await fixture(t),{server,token}=await createContentServer({base,rebuild:false});server.listen(0,'127.0.0.1');await once(server,'listening');t.after(()=>new Promise(resolve=>server.close(resolve)));
 const url=`http://127.0.0.1:${server.address().port}`,headers={'x-content-token':token,'Content-Type':'application/json'};
 assert.equal((await fetch(url+'/edit')).status,200);
 assert.equal((await fetch(url+'/api/list')).status,403);
 assert.equal((await fetch(url+'/api/list',{headers:{...headers,Origin:'https://example.com'}})).status,403);
 assert.equal((await fetch(url+'/content/site.json')).status,404);
 assert.equal((await fetch(url+'/.content-work/inbox/test.json')).status,404);
 const candidate=await draft(base),preview=await fetch(url+'/api/validate',{method:'POST',headers,body:JSON.stringify(candidate)});assert.equal(preview.status,200);
 assert.notEqual((await snapshot('news',candidate.id,base)).record.content,candidate.record.content);
 const saved=await fetch(url+'/api/save',{method:'POST',headers,body:JSON.stringify(candidate)});assert.equal(saved.status,200);assert.equal((await saved.json()).record.content,candidate.record.content);
});
