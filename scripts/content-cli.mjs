import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { root, collections, readContent, validateContent, snapshot, prepareCandidate, applyCandidate, serialize, excluded, normalizedTitle } from './content.mjs';

export function newRecord(collection,id) {
  const common={$schema:`../schemas/${collection==='news'?'news':'publication'}.schema.json`,schemaVersion:1,id,verification:'author-confirmed',sources:[{kind:'author',note:'Confirmed by Naixu Guo.'}]};
  if(collection==='news')return {...common,date:new Date().toISOString().slice(0,10),content:'',publicationIds:[]};
  if(collection==='publications')return {...common,title:'',authors:'',year:new Date().getFullYear(),category:'preprint',venue:'arXiv preprint',short:'arXiv',arxiv:'',summary:''};
  throw new Error('Use export to edit an existing document. New records are supported for publications and news.');
}

export async function importArxiv(entries,base=root) {
  const data=await readContent(base),drafts=[],skipped=[];
  const inbox=path.join(base,'.content-work/inbox');await mkdir(inbox,{recursive:true});
  for(const entry of entries) {
    if(!/^\d{4}\.\d{4,5}$/.test(entry.arxiv)||!entry.authors.some(a=>data.policy.ownerNames.map(normalizedTitle).includes(normalizedTitle(a)))) {skipped.push({title:entry.title,reason:'Author or arXiv ID did not match'});continue;}
    if(excluded(entry,data.policy)){skipped.push({title:entry.title,reason:'Excluded by author'});continue;}
    const old=data.publications.find(p=>p.arxiv===entry.arxiv||normalizedTitle(p.title)===normalizedTitle(entry.title));
    if(old){skipped.push({title:entry.title,reason:'Already in catalog; existing editorial copy preserved'});continue;}
    const id='arxiv-'+entry.arxiv.replace('.','-');
    const record={...newRecord('publications',id),title:entry.title,authors:entry.authors.map(a=>normalizedTitle(a)===normalizedTitle('Naixu Guo')?`**${a}**`:a).join(', '),year:Number(entry.published.slice(0,4)),arxiv:entry.arxiv,short:`arXiv ${entry.published.slice(0,4)}`,verification:'source-checked',sources:[{kind:'arxiv',url:`https://arxiv.org/abs/${entry.arxiv}`,note:`Metadata retrieved from the arXiv API. Check author identity and write a concise summary before applying. Published ${entry.published}; updated ${entry.updated}.`}]};
    const candidate={schemaVersion:1,collection:'publications',id,baseHash:null,reason:'arXiv discovery; summary needs editorial review.',record};
    const file=path.join(inbox,`${id}.json`);
    // Never overwrite a candidate that a person or agent has already edited.
    try{await writeFile(file,serialize(candidate),{flag:'wx'});drafts.push(file);}catch(e){if(e.code!=='EEXIST')throw e;skipped.push({title:entry.title,reason:'Candidate already exists'});}
  }
  return {drafts,skipped};
}
async function main() {
  const [command,...args]=process.argv.slice(2);
  if(command==='check'){const data=await validateContent(await readContent());console.log(`Content valid: ${data.publications.length} publications, ${data.news.length} news items; home shows at most ${data.policy.homeNewsLimit}.`);return;}
  if(command==='list'){const data=await readContent();console.log(serialize(Object.fromEntries(collections.map(c=>[c,Array.isArray(data[c])?data[c].map(r=>({id:r.id,title:r.title||r.content,date:r.date})):c]))));return;}
  if(['new','export'].includes(command)) {
    const [collection,id]=args;
    const current=await snapshot(collection,id);
    if(command==='new'&&current.record)throw new Error('Record already exists; use export.');
    if(command==='export'&&!current.record)throw new Error('Record not found.');
    console.log(serialize({schemaVersion:1,collection,id,baseHash:current.hash,reason:command==='new'?'New record':'Content update',record:current.record||newRecord(collection,id)}));return;
  }
  if(['diff','apply'].includes(command)) {
    const draft=JSON.parse(await readFile(args[0],'utf8'));
    const result=command==='diff'?await prepareCandidate(draft):await applyCandidate(draft);
    console.log(serialize({changed:result.changed,changes:result.changes,file:result.file}));return;
  }
  if(command==='collect-arxiv') {
    const result=spawnSync('python3',[path.join(root,'scripts/collect-arxiv.py'),...args],{encoding:'utf8',maxBuffer:5e6,timeout:45000});
    if(result.error)throw result.error;if(result.status!==0)throw new Error(result.stderr);
    console.log(serialize(await importArxiv(JSON.parse(result.stdout))));return;
  }
  console.log(`Content tools (local only; never commit, push or publish):
  npm run content -- check
  npm run content -- list
  npm run content -- new news <stable-id> > .content-work/draft.json
  npm run content -- export publications <id> > .content-work/draft.json
  npm run content -- diff .content-work/draft.json
  npm run content -- apply .content-work/draft.json
  npm run content -- collect-arxiv [--input saved-atom.xml]
  npm run content:edit
Use npm run --silent content when redirecting JSON output. See content/README.md.`);
}
if(process.argv[1]===new URL(import.meta.url).pathname)main().catch(error=>{console.error(error.message);process.exitCode=1;});
