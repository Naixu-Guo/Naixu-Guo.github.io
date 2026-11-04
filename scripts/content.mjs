import { readFile, readdir, mkdir, writeFile, rename, unlink, open, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';

export const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
export const collections = ['publications','news','site','interests','research','cv','library'];
const singletons = ['site','interests','research','cv','library','policy'];
const ajv = new Ajv({allErrors:true, strict:false});
const validators = new Map();
export const serialize = value => JSON.stringify(value,null,2)+'\n';
export const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
export const normalizedTitle = value => value.normalize('NFKC').toLowerCase().replace(/[^a-z0-9]/g,'');
export function recordPath(collection,id,base=root) {
  if(!collections.includes(collection) || !/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/.test(id)) throw new Error('Invalid collection or ID.');
  if(singletons.includes(collection) && id!==collection) throw new Error('Document ID must equal its collection.');
  return path.join(base,'content',singletons.includes(collection)?`${collection}.json`:`${collection}/${id}.json`);
}
export async function validateSchema(name,record) {
  if(!validators.has(name)) validators.set(name,ajv.compile(JSON.parse(await readFile(path.join(root,'content/schemas',`${name}.schema.json`),'utf8'))));
  const check=validators.get(name);
  if(!check(record)) throw new Error(check.errors.map(e=>`${e.instancePath||'/'} ${e.message}${e.params.additionalProperty?`: ${e.params.additionalProperty}`:''}`).join('\n'));
}
export async function readContent(base=root) {
  const data={};
  for(const name of singletons) data[name]=JSON.parse(await readFile(path.join(base,'content',`${name}.json`),'utf8'));
  for(const name of ['publications','news']) {
    data[name]=[];
    for(const file of (await readdir(path.join(base,'content',name))).filter(f=>f.endsWith('.json')).sort()) {
      const record=JSON.parse(await readFile(path.join(base,'content',name,file),'utf8'));
      if(file!==`${record.id}.json`)throw new Error(`${name}/${file}: filename must match record ID.`);
      data[name].push(record);
    }
  }
  data.publications.sort((a,b)=>b.year-a.year||(a.order??9999)-(b.order??9999)||a.id.localeCompare(b.id));
  data.news.sort((a,b)=>b.date.localeCompare(a.date)||(a.order??9999)-(b.order??9999)||a.id.localeCompare(b.id));
  return data;
}
export function isValidDate(value) {
  if(!/^\d{4}-\d{2}(-\d{2})?$/.test(value))return false;
  const full=value.length===7?`${value}-01`:value;
  const date=new Date(`${full}T12:00:00Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0,10)===full;
}
export function excluded(record,policy) {
  return policy.excludedTitles.some(title=>normalizedTitle(record.title||'').includes(normalizedTitle(title)));
}
function unique(records,field) {
  const seen=new Set();
  for(const record of records)if(record[field]) {
    const value=field==='title'?normalizedTitle(record[field]):record[field].toLowerCase();
    if(seen.has(value))throw new Error(`Duplicate ${field}: ${record[field]}`);
    seen.add(value);
  }
}
function walk(value,visit) {
  if(Array.isArray(value))value.forEach(v=>walk(v,visit));
  else if(value&&typeof value==='object')for(const [key,item]of Object.entries(value)){visit(key,item);walk(item,visit);}
}
export async function validateContent(data,base=root) {
  for(const name of singletons)await validateSchema(name,data[name]);
  for(const [collection,schema]of [['publications','publication'],['news','news']]) {
    unique(data[collection],'id');
    for(const record of data[collection]) {
      try {await validateSchema(schema,record);}catch(error){throw new Error(`${collection}/${record.id}: ${error.message}`);}
    }
  }
  for(const field of ['title','arxiv','doi'])unique(data.publications,field);
  const ids=new Set(data.publications.map(p=>p.id));
  for(const p of data.publications) {
    if(excluded(p,data.policy))throw new Error(`Excluded by author: ${p.title}`);
    if(!p.arxiv&&!p.journalLink)throw new Error(`${p.id}: provide an arXiv ID or publication link.`);
  }
  for(const n of data.news) {
    if(!isValidDate(n.date))throw new Error(`${n.id}: invalid calendar date ${n.date}`);
    if(excluded({title:n.content},data.policy))throw new Error(`News mentions a paper excluded by the author: ${n.id}`);
    for(const id of n.publicationIds||[])if(!ids.has(id))throw new Error(`${n.id}: unknown publication ${id}`);
  }
  const files=[];
  walk(data,(key,value)=>{
    if(key==='publicationId'&&!ids.has(value))throw new Error(`Unknown publication reference: ${value}`);
    if(['href','url','link','journalLink','code','demoLink'].includes(key) && typeof value==='string') {
      if(/^\/(?!\/)[a-zA-Z0-9/#?&=._-]*$/.test(value)&&!value.includes('..'))return;
      const u=new URL(value);
      if(!['https:','http:','mailto:'].includes(u.protocol))throw new Error(`Unsupported link: ${value}`);
    }
    if(key==='figure'&&value) {
      if(!/^\/(assets|figure)\/[a-zA-Z0-9_./-]+$/.test(value)||value.includes('..'))throw new Error(`Unsafe figure path: ${value}`);
      files.push(value);
    }
  });
  for(const file of files)if(!(await stat(path.join(base,file))).isFile())throw new Error(`Missing figure: ${file}`);
  return data;
}
export const formatNewsDate = date => new Intl.DateTimeFormat('en',{month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(`${date.slice(0,7)}-01T12:00:00Z`));
export async function loadSiteData(base=root) {
  const d=await validateContent(await readContent(base),base);
  return {SITE:d.site,NEWS:d.news.map(n=>({...n,dateLabel:formatNewsDate(n.date)})),PUBLICATIONS:d.publications,RESEARCH:d.research,INTERESTS:d.interests,CV:d.cv,LIBRARY:d.library,POLICY:d.policy};
}
export async function snapshot(collection,id,base=root) {
  try {const record=JSON.parse(await readFile(recordPath(collection,id,base),'utf8'));return {record,hash:hash(record)};}
  catch(e){if(e.code==='ENOENT')return {record:null,hash:null};throw e;}
}
export async function prepareCandidate(candidate,base=root) {
  await validateSchema('candidate',candidate);
  const {collection,id,record,baseHash}=candidate;
  const current=await snapshot(collection,id,base);
  if(hash(record)===current.hash){await validateContent(await readContent(base),base);return {changed:false,current,changes:[]};}
  if(current.hash!==baseHash)throw new Error('Content changed since this draft was opened. Reload the latest record and merge your edits.');
  if(!singletons.includes(collection)&&record.id!==id)throw new Error('Record ID cannot be changed.');
  // Inherited is for migrated content, never an assertion a new candidate may introduce.
  if(['publications','news'].includes(collection)&&record.verification==='inherited'&&hash(record)!==current.hash)
    throw new Error('Confirm the source or choose author-confirmed before saving changed content.');
  const data=await readContent(base);
  if(singletons.includes(collection))data[collection]=record;
  else {data[collection]=data[collection].filter(r=>r.id!==id);data[collection].push(record);}
  await validateContent(data,base);
  const changes=[...new Set([...Object.keys(current.record||{}),...Object.keys(record)])].filter(key=>JSON.stringify(current.record?.[key])!==JSON.stringify(record[key])).map(field=>({field,before:current.record?.[field]??null,after:record[field]??null}));
  return {changed:true,current,changes};
}
export async function applyCandidate(candidate,base=root) {
  const work=path.join(base,'.content-work');await mkdir(work,{recursive:true});
  const lockPath=path.join(work,'write.lock');let lock;
  try{lock=await open(lockPath,'wx');}catch(e){if(e.code==='EEXIST')throw new Error('Another content write is active. Retry after it finishes.');throw e;}
  const file=recordPath(candidate.collection,candidate.id,base),temp=`${file}.${process.pid}.tmp`;
  try {
    const result=await prepareCandidate(candidate,base);
    if(!result.changed)return {...result,file};
    // Check again immediately before replacing the file, including changes from a text editor.
    if((await snapshot(candidate.collection,candidate.id,base)).hash!==result.current.hash)throw new Error('Content changed during validation. Reload and merge.');
    await mkdir(path.dirname(file),{recursive:true});
    await writeFile(temp,serialize(candidate.record),{flag:'wx'});await rename(temp,file);
    return {...result,file};
  } finally {await unlink(temp).catch(()=>{});await lock.close();await unlink(lockPath);}
}
