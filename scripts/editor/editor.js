const $=s=>document.querySelector(s),token=$('meta[name=content-token]').content;
let catalog,current=null,dirty=false,jsonDirty=false,selected='';
const labels={publications:'publication',news:'news item'};
async function api(route,body){const response=await fetch(`/api/${route}`,{method:body?'POST':'GET',headers:{'x-content-token':token,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});const result=await response.json();if(!response.ok)throw new Error(result.error);return result;}
function status(message,error=false){$('#status').textContent=message;$('#status').dataset.error=String(error);}
function changed(){dirty=true;$('#changes').replaceChildren();status('Unsaved changes.');}
function keepGoing(){return !dirty||confirm('Discard unsaved changes to this record?');}
const get=(o,k)=>k.split('.').reduce((x,p)=>x?.[p],o);
const set=(o,k,v)=>{const keys=k.split('.'),last=keys.pop();let obj=o;for(const key of keys)obj=obj[key]??={};obj[last]=v;};
function field(label,key,{wide=false,area=false,type='text',options,help}={}){
 const box=document.createElement('div');box.className=`field${wide?' wide':''}`;
 const caption=document.createElement('label');caption.htmlFor=`field-${key}`;caption.textContent=label;
 const input=document.createElement(options?'select':area?'textarea':'input');input.id=caption.htmlFor;
 if(options)for(const value of options){const option=document.createElement('option');option.value=value;option.textContent=value;input.append(option);}else if(area)input.rows=key==='summary'||key==='content'?4:3;else input.type=type;
 input.value=get(current.record,key)??'';
 if(key==='id'&&current.baseHash)input.readOnly=true;
 input.addEventListener('input',()=>{if(!input.value&&['journalLink','figure','doi','arxiv','order'].includes(key))delete current.record[key];else set(current.record,key,type==='number'?Number(input.value):input.value);if(key==='id')current.id=input.value;changed();syncJSON();});
 box.append(caption,input);if(help){const p=document.createElement('p');p.textContent=help;box.append(p);}$('#fields').append(box);return input;
}
function syncJSON(){$('#json').value=JSON.stringify(current.record,null,2);jsonDirty=false;}
function renderForm(){
 $('.intro').hidden=true;$('#editor').hidden=false;$('#fields').replaceChildren();$('#changes').replaceChildren();
 $('#heading').textContent=current.collection==='site'?'Profile & homepage':current.record.title|| (current.collection==='news'?'News item':'Edit '+current.collection);
 $('#location').textContent=`content/${['publications','news'].includes(current.collection)?current.collection+'/'+current.id:current.collection}.json`;
 $('#preview').href=current.collection==='news'||current.collection==='site'?'/#about':`/${['interests','research'].includes(current.collection)?'research':current.collection}/`;
 if(['publications','news'].includes(current.collection)){
  if(current.collection==='news') {field('Date','date',{help:'YYYY-MM or YYYY-MM-DD. Do not invent a day.'});field('Tie-break order (optional)','order',{type:'number'});field('News text','content',{wide:true,area:true,help:'For a paper release: New paper: [Title](https://…). Use New papers: for a joint announcement. Other updates keep their own wording.'});}
  else {field('Title','title',{wide:true});field('Authors','authors',{wide:true,area:true,help:'Mark your name with **Naixu Guo**.'});field('Year','year',{type:'number'});field('Type','category',{options:['preprint','journal','conference','book']});field('Venue / acceptance status','venue',{wide:true});field('Short venue label','short');field('arXiv ID','arxiv',{help:'For example 2609.17439, without a version suffix.'});field('Journal link','journalLink',{type:'url'});field('Figure path (optional)','figure',{help:'For example /assets/research/figure.webp'});field('Short summary','summary',{wide:true,area:true});}
  field('Verification','verification',{options:['author-confirmed','source-checked','inherited'],help:'Use source-checked after reading the source; author-confirmed for your own announcements.'});
  const sourceInput=field('Source URLs','_sourceUrls',{wide:true,area:true,help:'One URL per line. Existing source notes are retained. Leave empty for your own author-confirmed news.'});
  sourceInput.value=(current.record.sources||[]).filter(s=>s.url).map(s=>s.url).join('\n');
  sourceInput.addEventListener('input',()=>{delete current.record._sourceUrls;const old=current.record.sources||[];current.record.sources=sourceInput.value.split('\n').map(s=>s.trim()).filter(Boolean).map(url=>old.find(s=>s.url===url)||{kind:'web',url});if(!current.record.sources.length)current.record.sources=[{kind:'author',note:'Confirmed by Naixu Guo.'}];syncJSON();});
 }else if(current.collection==='site'){
  for(const [label,key]of [['Name','name'],['Chinese name','nameZh'],['Role','role'],['Institution','institution'],['Short institution','institutionShort'],['Location','location'],['Footer identity','identity']])field(label,key);
  field('Email name','email.local',{help:'The part before @. The public page shows an Email button.'});field('Email domain','email.domain',{help:'For example gmail.com. Stored separately to avoid a complete address in the public source.'});
  field('Biography','biography',{wide:true,area:true});field('Research introduction','hero.intro',{wide:true,area:true});field('Personal question','hero.question',{wide:true,area:true});
 }
 $('#advanced').open=!['publications','news','site'].includes(current.collection);syncJSON();
}
function list(){if(!catalog)return;const c=$('#collection').value,q=$('#search').value.toLowerCase();$('#records').replaceChildren();$('#new').hidden=!labels[c];$('#new').textContent=`Add ${labels[c]||'record'}`;
 for(const row of c==='inbox'?catalog.inbox:catalog.collections[c]){if(!row.title.toLowerCase().includes(q)&&!(row.id||'').includes(q))continue;const button=document.createElement('button');button.type='button';button.textContent=row.title.replace(/\[([^\]]+)\]\([^)]+\)/g,'$1').replaceAll('**','');button.setAttribute('aria-current',String(selected===(row.id||row.file)));if(row.date){const small=document.createElement('small');small.textContent=row.date;button.append(small);}button.onclick=()=>load(c,row).catch(e=>status(e.message,true));$('#records').append(button);}
 if(!$('#records').children.length){const p=document.createElement('p');p.textContent=c==='inbox'?'No import drafts. Use the collector or place a candidate in .content-work/inbox/.':'No matching records.';$('#records').append(p);}
}
async function load(collection,row){if(!keepGoing())return;status('Loading…');if(collection==='inbox')current=await api(`draft?file=${encodeURIComponent(row.file)}`);else {const r=await api(`record?collection=${collection}&id=${encodeURIComponent(row.id)}`);current={schemaVersion:1,collection,id:row.id,baseHash:r.hash,record:r.record,reason:'Edited in the local content desk.'};}selected=row.id||row.file;dirty=false;renderForm();list();status('');}
$('#collection').onchange=list;$('#search').oninput=list;
$('#new').onclick=async()=>{try{if(!keepGoing())return;const collection=$('#collection').value,id=`${collection==='news'?new Date().toISOString().slice(0,10):'paper'}-${crypto.randomUUID().slice(0,8)}`;const r=await api(`new?collection=${collection}&id=${id}`);current={schemaVersion:1,collection,id,baseHash:null,record:r.record,reason:'Added in the local content desk.'};selected='';dirty=true;renderForm();list();status('Fill in the record, then review and save.');}catch(e){status(e.message,true);}};
$('#json').oninput=()=>{jsonDirty=true;changed();};
function useJSON(){if(jsonDirty){const record=JSON.parse($('#json').value);if(current.baseHash&&record.id&&record.id!==current.id)throw new Error('An existing record’s ID cannot change.');current.record=record;if(record.id)current.id=record.id;renderForm();}}
$('#use-json').onclick=()=>{try{useJSON();status('Fields updated; not saved yet.');}catch(e){status(e.message,true);}};
$('#validate').onclick=async()=>{try{useJSON();const result=await api('validate',current);$('#changes').replaceChildren();for(const change of result.changes){const section=document.createElement('section'),h=document.createElement('h2'),before=document.createElement('pre'),after=document.createElement('pre');h.textContent=change.field;before.textContent='Before: '+(typeof change.before==='string'?change.before:JSON.stringify(change.before,null,2));after.textContent='After: '+(typeof change.after==='string'?change.after:JSON.stringify(change.after,null,2));section.append(h,before,after);$('#changes').append(section);}status(result.changed?'Validation passed. Review the changes below, then save.':'No changes.');}catch(e){status(e.message,true);}};
$('#editor').onsubmit=async event=>{event.preventDefault();const button=$('#save');try{useJSON();button.disabled=true;status('Saving and rebuilding preview…');const result=await api('save',current);current.record=result.record;current.baseHash=result.hash;dirty=false;renderForm();catalog=await api('list');list();status(result.buildError?`Saved locally, but the preview build needs attention:\n${result.buildError}`:result.changed?'Saved and rebuilt. Open the page preview to see the change.':'No changes to save.',Boolean(result.buildError));}catch(e){status(e.message,true);}finally{button.disabled=false;}};
window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
try{status('Loading the content library…');catalog=await api('list');for(const selector of ['#collection','#search','#new'])$(selector).disabled=false;list();status('');}catch(e){status(e.message+' Reload to try again.',true);}
