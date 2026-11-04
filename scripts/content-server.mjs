import http from 'node:http';
import { randomBytes } from 'node:crypto';
import { readFile, readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { root, readContent, snapshot, prepareCandidate, applyCandidate, collections } from './content.mjs';
import { newRecord } from './content-cli.mjs';
const exec=promisify(execFile);
const editor=path.join(root,'scripts/editor');
const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.woff2':'font/woff2','.ico':'image/x-icon'};

export async function createContentServer({base=root,rebuild=true}={}) {
  const token=randomBytes(32).toString('hex');let saving=false;
  await mkdir(path.join(base,'.content-work/inbox'),{recursive:true});
  const server=http.createServer(async(req,res)=>{
    const send=(code,value)=>{res.writeHead(code,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(value));};
    try {
      const address=server.address(),origin=`http://127.0.0.1:${address.port}`;
      if(req.headers.host!==`127.0.0.1:${address.port}` || (req.headers.origin&&req.headers.origin!==origin))return send(403,{error:'Use the local editor URL printed in the terminal.'});
      const url=new URL(req.url,origin),pathname=url.pathname;
      if(pathname==='/edit'&&req.method==='GET') {
        res.writeHead(200,{'Content-Type':mime['.html'],'Cache-Control':'no-store','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'"});
        return res.end((await readFile(path.join(editor,'index.html'),'utf8')).replace('CONTENT_TOKEN',token));
      }
      if(pathname.startsWith('/api/')) {
        if(req.headers['x-content-token']!==token)return send(403,{error:'Editor session expired. Reload this page.'});
        if(pathname==='/api/list'&&req.method==='GET') {
          const data=await readContent(base),inbox=[];
          for(const file of (await readdir(path.join(base,'.content-work/inbox'))).filter(f=>f.endsWith('.json'))) {
            try {const d=JSON.parse(await readFile(path.join(base,'.content-work/inbox',file),'utf8'));inbox.push({file,title:d.record?.title||d.record?.content||file});}catch{/* Invalid drafts remain on disk for repair. */}
          }
          return send(200,{collections:Object.fromEntries(collections.map(c=>[c,Array.isArray(data[c])?data[c].map(r=>({id:r.id,title:r.title||r.content,date:r.date||r.year})): [{id:c,title:({site:'Profile & homepage',interests:'Collaboration topics',research:'Research directions',cv:'CV',library:'Reading library'})[c]}]])),inbox});
        }
        if(pathname==='/api/record'&&req.method==='GET')return send(200,await snapshot(url.searchParams.get('collection'),url.searchParams.get('id'),base));
        if(pathname==='/api/new'&&req.method==='GET')return send(200,{record:newRecord(url.searchParams.get('collection'),url.searchParams.get('id')),hash:null});
        if(pathname==='/api/draft'&&req.method==='GET') {
          const file=url.searchParams.get('file');if(!/^[a-z0-9.-]+\.json$/.test(file))throw new Error('Invalid draft filename.');
          return send(200,JSON.parse(await readFile(path.join(base,'.content-work/inbox',file),'utf8')));
        }
        if(req.method==='POST'&&['/api/validate','/api/save'].includes(pathname)) {
          let body='';for await(const chunk of req){body+=chunk;if(Buffer.byteLength(body)>1e6)return send(413,{error:'Record exceeds 1 MB.'});}
          const candidate=JSON.parse(body);
          if(pathname==='/api/validate')return send(200,await prepareCandidate(candidate,base));
          if(saving)return send(409,{error:'A save is in progress. Please retry.'});
          saving=true;
          try {
            const result=await applyCandidate(candidate,base);let buildError=null;
            if(rebuild&&result.changed)try{await exec(process.execPath,['scripts/build.mjs'],{cwd:base,timeout:30000});await exec(process.execPath,['scripts/check.mjs'],{cwd:base,timeout:30000});}catch(e){buildError=e.stderr||e.message;}
            return send(200,{changed:result.changed,...await snapshot(candidate.collection,candidate.id,base),buildError});
          }finally{saving=false;}
        }
        return send(404,{error:'Unknown endpoint.'});
      }
      if(req.method!=='GET'&&req.method!=='HEAD')return send(405,{error:'Method not allowed.'});
      let file;
      if(['/editor.css','/editor.js'].includes(pathname))file=path.join(editor,pathname.slice(1));
      else if(/^\/(assets|figure)\/[a-zA-Z0-9_./-]+$/.test(pathname)&&!pathname.includes('..'))file=path.join(base,pathname);
      else if(/^\/(research\/|publications\/|library\/|cv\/|about\/)?$/.test(pathname))file=path.join(base,pathname,'index.html');
      else return send(404,{error:'Not found.'});
      const bytes=await readFile(file);res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(req.method==='HEAD'?undefined:bytes);
    }catch(error){send(error.code==='ENOENT'?404:400,{error:error.message});}
  });
  return {server,token};
}
if(process.argv[1]===new URL(import.meta.url).pathname) {
  const {server}=await createContentServer();
  server.on('error',error=>{console.error(error.message);process.exitCode=1;});
  server.listen(Number(process.env.CONTENT_PORT||4174),'127.0.0.1',()=>console.log(`Content editor: http://127.0.0.1:${server.address().port}/edit\nLocal files only. Saving rebuilds the preview; nothing is published.`));
}
