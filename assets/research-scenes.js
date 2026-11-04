// Three explanatory scenes in one shared axonometric view. Geometry is computed here; colour comes from CSS.
// They illustrate ideas, never measured results, numerical simulations or the author's own hardware.
const R=Math.PI/180,YAW=26*R,PITCH=30*R,ZOOM=1.1;
const CY=Math.cos(YAW),SY=Math.sin(YAW),SP=Math.sin(PITCH),CP=Math.cos(PITCH);
const VIEW=[-SY*CP,CY*CP,-SP];
const unit=v=>{const l=Math.hypot(v[0],v[1],v[2])||1;return[v[0]/l,v[1]/l,v[2]/l];};
const LIGHT=unit([-.3,-.62,.78]);
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const add=(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]];
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
const mul=(a,s)=>[a[0]*s,a[1]*s,a[2]*s];
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const ids=n=>[...Array(n).keys()];
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
const span=(t,a,b)=>clamp((t-a)/(b-a));
const ease=u=>u*u*(3-2*u);
const lerp=(a,b,u)=>a+(b-a)*u;
const pulse=(t,a,b,edge=.02)=>Math.min(span(t,a,a+edge),1-span(t,b-edge,b));
const f=n=>{const r=Math.round(n*10)/10;return r===0?0:r;};
const S=p=>[ZOOM*(p[0]*CY+p[1]*SY),ZOOM*(p[0]*SY*SP-p[1]*CY*SP-p[2]*CP)];
const xy=p=>{const q=S(p);return f(q[0])+' '+f(q[1]);};
const loop=ps=>'M'+ps.map(xy).join('L')+'Z';
const line=ps=>'M'+ps.map(xy).join('L');
const el=(cls,d,extra='')=>`<path class="${cls}" d="${d}"${extra}/>`;
const op=n=>` opacity="${f(clamp(n)*100)/100}"`;
const dotAt=(p,r,cls,o)=>{const [x,y]=S(p);return `<circle class="${cls}" cx="${f(x)}" cy="${f(y)}" r="${r}"${op(o)}/>`;};
// A moved group: orthographic projection turns every world translation into one screen translation.
const moved=(p,body,o=1)=>{const q=S(p);return `<g class="mv" style="transform:translate(${f(q[0])}px,${f(q[1])}px)"${op(o)}>${body}</g>`;};
const lengths=ps=>ps.reduce((L,p,i)=>(i&&L.push(L[i-1]+Math.hypot(...sub(p,ps[i-1]))),L),[0]);
function along(ps,u){const L=lengths(ps),T=L.at(-1)*clamp(u);let i=1;while(i<ps.length-1&&L[i]<T)i++;const k=(T-L[i-1])/((L[i]-L[i-1])||1);return ps[i-1].map((c,j)=>lerp(c,ps[i][j],k));}
// The first fraction u of a world polyline, for marks that are drawn in.
function partial(ps,u){const L=lengths(ps),T=L.at(-1)*clamp(u),out=[ps[0]];for(let i=1;i<ps.length;i++){if(L[i]<=T)out.push(ps[i]);else{out.push(along([ps[i-1],ps[i]],(T-L[i-1])/((L[i]-L[i-1])||1)));break;}}if(out.length<2)out.push(ps[0]);return line(out);}

// Solids: visible faces take one of five tones from a fixed light; silhouettes and creases are inked.
function newell(ps){const n=[0,0,0];ps.forEach((a,i)=>{const b=ps[(i+1)%ps.length];n[0]+=(a[1]-b[1])*(a[2]+b[2]);n[1]+=(a[2]-b[2])*(a[0]+b[0]);n[2]+=(a[0]-b[0])*(a[1]+b[1]);});return unit(n);}
const tone=n=>{const l=dot(n,LIGHT);return l>.72?0:l>.42?1:l>.1?2:l>-.32?3:4;};
const EDGE={w:'e',s:'e',b:'eb',k:'ek'};
function mesh(V,F,m='w'){
 const P=V.map(S),N=F.map(fc=>newell(fc.map(i=>V[i]))),front=N.map(n=>dot(n,VIEW)<-1e-6),bands=['','','','',''],edges=new Map();
 const pt=i=>f(P[i][0])+' '+f(P[i][1]);
 F.forEach((fc,i)=>{
  if(front[i])bands[tone(N[i])]+='M'+fc.map(pt).join('L')+'Z';
  fc.forEach((a,k)=>{const b=fc[(k+1)%fc.length],key=a<b?a+' '+b:b+' '+a;edges.has(key)?edges.get(key).push(i):edges.set(key,[i]);});
 });
 let ink='';
 for(const [key,[i,j]] of edges)if(j===undefined?front[i]:front[i]!==front[j]||front[i]&&dot(N[i],N[j])<.8){const [a,b]=key.split(' ');ink+='M'+pt(+a)+'L'+pt(+b);}
 return bands.map((d,t)=>d?el(m+t,d):'').join('')+(ink?el(EDGE[m],ink):'');
}
function orient(V,F){const c=mul(V.reduce(add,[0,0,0]),1/V.length);return F.map(fc=>{const m=mul(fc.map(i=>V[i]).reduce(add,[0,0,0]),1/fc.length);return dot(newell(fc.map(i=>V[i])),sub(m,c))<0?[...fc].reverse():fc;});}
function extrude(poly,v,m='w'){const n=poly.length,V=[...poly,...poly.map(p=>add(p,v))],F=[ids(n),ids(n).map(i=>i+n)];for(let i=0;i<n;i++){const j=(i+1)%n;F.push([i,j,j+n,i+n]);}return mesh(V,orient(V,F),m);}
const prism=(base,z,h,m='w')=>extrude(base.map(([x,y])=>[x,y,z]),[0,0,h],m);
const rect=(x,y,w,d)=>[[x,y],[x+w,y],[x+w,y+d],[x,y+d]];
const box=(x,y,z,w,d,h,m='w')=>prism(rect(x,y,w,d),z,h,m);
function rrect(x,y,w,d,r,n=4){const ps=[];[[x+w-r,y+r,-90],[x+w-r,y+d-r,0],[x+r,y+d-r,90],[x+r,y+r,180]].forEach(([cx,cy,a])=>{for(let k=0;k<=n;k++){const b=(a+90*k/n)*R;ps.push([cx+r*Math.cos(b),cy+r*Math.sin(b)]);}});return ps;}
const circ=(cx,cy,r,n=28)=>ids(n).map(i=>[cx+r*Math.cos(i/n*2*Math.PI),cy+r*Math.sin(i/n*2*Math.PI)]);
// A turned part around a vertical axis; the profile lists [radius, height] from bottom to top.
function lathe(cx,cy,z,profile,m='w',n=28){const V=[],F=[];profile.forEach(([r,h])=>circ(cx,cy,r,n).forEach(([x,y])=>V.push([x,y,z+h])));for(let k=0;k+1<profile.length;k++)for(let i=0;i<n;i++){const j=(i+1)%n;F.push([k*n+i,k*n+j,(k+1)*n+j,(k+1)*n+i]);}const top=(profile.length-1)*n;F.push(ids(n).reverse(),ids(n).map(i=>top+i));return mesh(V,F,m);}
function tube(a,b,r,m='w',n=12){const ax=unit(sub(b,a)),u=unit(cross(ax,Math.abs(ax[2])<.9?[0,0,1]:[1,0,0])),w=cross(ax,u);return extrude(ids(n).map(i=>{const t=i/n*2*Math.PI;return add(a,add(mul(u,r*Math.cos(t)),mul(w,r*Math.sin(t))));}),sub(b,a),m);}
// Flat marks on a face: plane(o,a,b) maps face coordinates (u,v) to the world.
const plane=(o,a,b)=>(u,v)=>[o[0]+u*a[0]+v*b[0],o[1]+u*a[1]+v*b[1],o[2]+u*a[2]+v*b[2]];
const FRONT=y=>plane([0,y,0],[1,0,0],[0,0,1]);
const SIDE=x=>plane([x,0,0],[0,1,0],[0,0,1]);
const TOP=z=>plane([0,0,z],[1,0,0],[0,1,0]);
const quad=(pl,u,v,w,h)=>loop([pl(u,v),pl(u+w,v),pl(u+w,v+h),pl(u,v+h)]);
const rquad=(pl,u,v,w,h,r)=>loop(rrect(u,v,w,h,r,3).map(([a,b])=>pl(a,b)));
const oval=(pl,u,v,r,n=20)=>loop(circ(u,v,r,n).map(([a,b])=>pl(a,b)));
const marks=(pl,segs)=>segs.map(s=>'M'+s.map(([u,v])=>xy(pl(u,v))).join('L')).join('');
// A horizontal circle projects to an axis-aligned ellipse.
const ellipse=(p,r,cls,extra='')=>{const [x,y]=S(p);return `<ellipse class="${cls}" cx="${f(x)}" cy="${f(y)}" rx="${f(r*ZOOM)}" ry="${f(r*SP*ZOOM)}"${extra}/>`;};
// The visible half of a vertical cylinder wall between two heights.
function wall(cx,cy,r,z1,z2,n=16){const a0=Math.atan2(-CY,SY)-Math.PI/2,arc=z=>ids(n+1).map(i=>{const a=a0+Math.PI*i/n;return[cx+r*Math.cos(a),cy+r*Math.sin(a),z];});return loop([...arc(z1),...arc(z2).reverse()]);}
// A wave packet in screen space along unit direction (dx,dy), centred on the origin.
function packet(len,amp,cycles,[dx,dy]){let d='';for(let i=0;i<=28;i++){const s=i/28-.5,w=Math.sin(s*cycles*2*Math.PI)*amp*Math.cos(s*Math.PI)**2;d+=(i?'L':'M')+f(s*len*dx-w*dy)+' '+f(s*len*dy+w*dx);}return d;}
const toward=(a,b)=>{const p=S(a),q=S(b),l=Math.hypot(q[0]-p[0],q[1]-p[1])||1;return[(q[0]-p[0])/l,(q[1]-p[1])/l];};

// Shared furniture: filters, a soft halo, the bench and numbered callouts that match the HTML steps.
const defs=id=>`<defs><filter id="${id}-blur" x="-10%" y="-40%" width="120%" height="180%"><feGaussianBlur stdDeviation="9"/></filter><filter id="${id}-soft" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="2.6"/></filter><radialGradient id="${id}-glow"><stop offset="0" class="gl0"/><stop offset=".5" class="gl1"/><stop offset="1" class="gl2"/></radialGradient><radialGradient id="${id}-warm"><stop offset="0" class="gw0"/><stop offset=".5" class="gw1"/><stop offset="1" class="gw2"/></radialGradient><radialGradient id="${id}-ok"><stop offset="0" class="go0"/><stop offset=".5" class="go1"/><stop offset="1" class="go2"/></radialGradient></defs>`;
const VW=962,VH=486;
// Every scene shares the scale; each is centred on its own bench and tallest parts.
function frame(points){const P=points.map(S),xs=P.map(p=>p[0]),ys=P.map(p=>p[1]),cx=(Math.min(...xs)+Math.max(...xs))/2,cy=(Math.min(...ys)+Math.max(...ys))/2;return `${f(cx-VW/2)} ${f(cy-VH/2)} ${VW} ${VH}`;}
function bench(id,W,D,holes=false){
 let s=`<g class="sh" filter="url(#${id}-blur)">${el('',loop(rrect(12,-8,W-6,D,18).map(([x,y])=>[x,y,-22])))}</g>`;
 s+=prism(rrect(7,7,W-14,D-14,13),-18,12)+prism(rrect(0,0,W,D,16),-6,6);
 s+=el('dt',marks(FRONT(0),[[[30,-3.6],[88,-3.6]],[[30,-2.2],[64,-2.2]]]));
 for(const [x,y] of [[19,19],[W-19,19],[W-19,D-19],[19,D-19]])s+=ellipse([x,y,0],4.2,'screw')+el('dt',line([[x-2.6,y+1.1,0],[x+2.6,y-1.1,0]]));
 if(holes){let d='';const r=2.2*ZOOM,q=r*SP;for(let x=44;x<W-30;x+=34)for(let y=30;y<D-22;y+=34){const [u,v]=S([x,y,0]);d+=`M${f(u-r)} ${f(v)}a${f(r)} ${f(q)} 0 1 0 ${f(2*r)} 0a${f(r)} ${f(q)} 0 1 0 ${f(-2*r)} 0`;}s+=el('hole',d);}
 return s;
}
const contact=(id,polys)=>`<g class="sh sh-near" filter="url(#${id}-soft)">${polys.map(p=>el('',loop(p.map(([x,y])=>[x+5,y+7,0])))).join('')}</g>`;
const DIGITS=['M-1.6 -2.4L.9 -4.3V4.3','M-2.7 -2.1C-2.5 -4.6 2.7 -4.9 2.7 -1.6C2.7 .6 -2.6 2.2 -2.9 4.3H2.9','M-2.6 -4.3H2.5L-.2 -.9C2.6 -1.2 3.4 1.2 2.6 2.8C1.6 4.9 -1.8 4.8 -2.9 3.1'];
function callout(i,anchor,[dx,dy],on){const [ax,ay]=S(anchor),x=ax+dx,y=ay+dy;return `<path class="lead" d="M${f(ax)} ${f(ay)}L${f(x)} ${f(y)}"/><circle class="pin" cx="${f(ax)}" cy="${f(ay)}" r="1.9"/><g class="${on?'mk on':'mk'}" transform="translate(${f(x)} ${f(y)})"><g class="mk-s"><circle r="9.5"/><path d="${DIGITS[i]}"/></g></g>`;}

// 1. Agents for Science: an agent, a virtual tool console and an independent inspection gate on one loop.
function agentScene([b1,b2]){
 const id='agents',W=720,D=240,L=[defs(id),bench(id,W,D)];
 let grid='';for(let y=120;y<=222;y+=17)grid+=line([[18,y,0],[702,y,0]]);for(let x=22;x<=698;x+=20)grid+=line([[x,116,0],[x,224,0]]);
 L.push(el('grid',grid));
 // The loop track: out past the stations, through the gate and back along the front edge.
 const xa=160,xb=600,yc=66,r=30,Ls=xb-xa,arc=Math.PI*r,total=2*Ls+2*arc;
 const stad=rad=>[...ids(19).map(i=>{const a=-Math.PI/2+Math.PI*i/18;return[xb+rad*Math.cos(a),yc+rad*Math.sin(a),0];}),...ids(19).map(i=>{const a=Math.PI/2+Math.PI*i/18;return[xa+rad*Math.cos(a),yc+rad*Math.sin(a),0];})];
 const trackAt=s=>{s=((s%total)+total)%total;if(s<Ls)return[xa+s,yc+r,0];s-=Ls;if(s<arc){const a=Math.PI/2-s/r;return[xb+r*Math.cos(a),yc+r*Math.sin(a),0];}s-=arc;if(s<Ls)return[xb-s,yc-r,0];s-=Ls;const a=-Math.PI/2-s/r;return[xa+r*Math.cos(a),yc+r*Math.sin(a),0];};
 L.push(el('lane',loop(stad(r+9))+loop(stad(r-9).reverse()),' fill-rule="evenodd"')+el('e',loop(stad(r+9))+loop(stad(r-9))));
 let chev='';for(let s=40;s<total;s+=62){const p=trackAt(s),q=trackAt(s+1),t=unit(sub(q,p)),n=[-t[1],t[0],0];chev+=line([add(p,add(mul(t,-3),mul(n,4.4))),add(p,mul(t,2)),add(p,add(mul(t,-3),mul(n,-4.4)))]);}
 L.push(el('chev',chev));
 L.push(contact(id,[rect(196,132,280,90),rect(512,140,100,82),rect(132,132,42,24),rect(30,168,72,8),rect(598,59,14,14),rect(648,59,14,14)]));
 // Planning board: a pinned question and the plan the agent writes beside it.
 const pb=plane([26,168,60],[1,0,0],[0,0,1]);
 L.push(box(28,164,0,12,12,3)+box(92,164,0,12,12,3)+tube([34,172,0],[34,172,60],2.2)+tube([98,172,0],[98,172,60],2.2)+box(26,168,60,80,8,66));
 L.push(el('dt',quad(pb,4,4,72,58))+el('paper',quad(pb,8,25,28,33))+el('e',quad(pb,8,25,28,33)));
 L.push(el('qmark',marks(pb,[[...ids(13).map(i=>{const a=(160-i*19)*R;return[22+5.6*Math.cos(a),47.5+5.6*Math.sin(a)];}),[22,38.6]]]))+el('qdot',oval(pb,22,33.6,1.5,10))+el('pinhead',oval(pb,22,55.5,2,10)));
 const rows=[51,41,31];
 L.push(el('dt',rows.map(v=>quad(pb,42,v-2.2,4.4,4.4)).join('')));
 L.push(t=>rows.map((v,k)=>{const u=ease(span(t,.05+.07*k,.13+.07*k));return el('plan',partial([pb(50,v),pb(k===2?64:72,v)],u),op(u>0?1:0));}).join(''));
 // The agent.
 const cx=152,cy=146;
 L.push(box(cx-21,cy-14,0,15,22,6)+box(cx+6,cy-14,0,15,22,6));
 L.push(lathe(cx-13,cy,6,[[4.6,0],[4.6,17]],'w',16)+lathe(cx+13,cy,6,[[4.6,0],[4.6,17]],'w',16));
 L.push(tube([cx-22,cy,62],[cx-42,cy-2,78],4.4)+lathe(cx-43,cy-2,73,[[0,0],[4.2,2],[5.2,5],[4.2,8.5],[0,10]],'s',16));
 L.push(prism(rrect(cx-22,cy-16,44,32,8),22,44));
 const chest=FRONT(cy-16);
 L.push(el('scr',rquad(chest,cx-12,32,24,22,3))+el('e',rquad(chest,cx-12,32,24,22,3)));
 L.push(t=>{const busy=t>.37&&t<.6;return ids(6).map(i=>{const on=busy?Math.floor(t*140+i*2)%4<2:(i===1||i===4)&&t<.3;return el('led',quad(chest,cx-9+(i%3)*6.6,36+Math.floor(i/3)*8,4,4),op(on?1:.18));}).join('');});
 L.push(lathe(cx,cy,66,[[6.5,0],[6.5,7]],'w',16));
 L.push(prism(rrect(cx-25,cy-19,50,38,10),72,36));
 const face=FRONT(cy-19),side=SIDE(cx+25);
 L.push(el('scr',rquad(face,cx-19,80,38,21,6))+el('ek',rquad(face,cx-19,80,38,21,6)));
 L.push(el('w2',oval(side,cy,91,6.2))+el('e',oval(side,cy,91,6.2))+el('w0',oval(side,cy,91,3))+el('e',oval(side,cy,91,3)));
 L.push(t=>{const look=t<.3?-1:t<.6?.6:t<.84?1:lerp(1,-1,span(t,.84,1));return moved([look*3.2,0,0],el('eye',rquad(face,cx-12.5,85,7,10,2.5))+el('eye',rquad(face,cx+5.5,85,7,10,2.5)));});
 L.push(tube([cx,cy,108],[cx,cy,124],1.3,'w',8)+lathe(cx,cy,123,[[0,0],[3.4,1.6],[4.3,4.3],[3.4,7],[0,8.6]],'s',16));
 L.push(t=>ellipse([cx,cy,127.5],13,'',` fill="url(#${id}-glow)"`+op(t<.3?.55+.45*Math.sin(t*90):t>.92?span(t,.92,.97):.12)));
 L.push(tube([cx+22,cy,62],[cx+52,cy-6,66],4.4)+lathe(cx+53,cy-6,61,[[0,0],[4.2,2],[5.2,5],[4.2,8.5],[0,10]],'s',16));
 // Tool console: deck, monitor and a rack of three tool modules.
 L.push(box(196,132,0,280,90,58));
 const cf=FRONT(132);
 L.push(el('dt',marks(cf,[[[290,5],[290,53]],[[384,5],[384,53]],...[20,25,30,35].map(v=>[[210,v],[264,v]]),[[398,36],[466,36]],[[414,45],[442,45]],[[414,26],[442,26]],[[318,13],[354,13]]])));
 L.push(el('scr',quad(cf,322,16,28,9))+el('e',quad(cf,322,16,28,9)));
 L.push(t=>el('led',oval(cf,336,37,2.2,10),op(t>.37&&t<.6?1:.18)));
 L.push(extrude([[204,132,58],[204,170,58],[204,170,67],[204,132,62]],[264,0,0]));
 const deck=plane([204,132,62],[1,0,0],unit([0,38,5]));
 L.push(el('dt',marks(deck,[[[204,24],[252,24]],[[110,4],[110,34]]])));
 for(let k=0;k<4;k++)L.push(lathe(226+26*k,152,64.6,[[5.4,0],[5.4,3.4],[4,5.8],[0,6.2]],'w',16));
 const keys=ids(10).map(k=>quad(deck,122+15*(k%5),7+11*Math.floor(k/5),11,8)).join('');
 L.push(el('w0',keys)+el('e',keys));
 L.push(t=>{const g=t>.38&&t<.6?Math.floor((t-.38)*60)%10:-1;return ids(10).map(k=>el('led',quad(deck,122+15*(k%5),7+11*Math.floor(k/5),11,8),op(g===k?.55:0))).join('');});
 L.push(box(298,196,58,20,10,20)+box(214,188,78,188,12,98));
 const mf=FRONT(188);
 L.push(el('scr',quad(mf,221,85,174,84))+el('ek',quad(mf,221,85,174,84)));
 L.push(el('sl',marks(mf,[[[228,154],[296,154]],[[228,140],[296,140]],[[228,126],[296,126]],[[304,93],[390,93]],[[304,93],[304,163]],[[270,154],[270,126]]])+quad(mf,238,149.5,9,9)+quad(mf,256,135.5,9,9)+quad(mf,238,121.5,9,9)+quad(mf,282,135.5,9,9)+oval(mf,270,126,3.4,12)));
 L.push(el('sl-fill',oval(mf,270,154,1.9,8)));
 const curve=ids(36).map(i=>{const x=i/35;return mf(308+80*x,97+54*(1-Math.exp(-3.2*x))+4.5*Math.sin(x*10)*Math.exp(-2.5*x));});
 L.push(t=>{const u=ease(span(t,.39,.58));return el('trace',partial(curve,u),op(u>0?1:0))+ids(6).map(k=>dotAt(along(curve,(k+.5)/6),1.6,'dotp',u>(k+.5)/6?1:0)).join('');});
 L.push(t=>{const g=t>.39&&t<.6?Math.floor((t-.39)*40)%4:-1;return [[238,149.5],[256,135.5],[238,121.5],[282,135.5]].map(([u,v],k)=>el('gate-on',quad(mf,u,v,9,9),op(g===k?.9:0))).join('');});
 L.push(box(422,176,58,48,46,108));
 const rf=FRONT(176),slots=[132,97,62];
 L.push(slots.map(v=>el('w1',quad(rf,426,v,40,31))+el('e',quad(rf,426,v,40,31))+el('dt',marks(rf,[[[428,v+2.5],[464,v+2.5]]]))).join(''));
 L.push(el('pic',marks(rf,[ids(13).map(i=>[430+i*1.6,147.5+5*Math.sin(i/12*2*Math.PI)]),[[430,108],[450,108]],[[430,116],[450,116]],[[434,104],[434,120]],[[444,104],[444,120]],[[430,82],[450,82]],[[430,72],[450,72]],[[443,72],[443,82]]])+quad(rf,433,79,5,6)+oval(rf,443,72,1.8,8)));
 L.push(t=>slots.map((v,k)=>el('led',oval(rf,459,v+15.5,2.2,10),op(t>.39+.07*k&&t<.47+.07*k?1:.18))).join(''));
 // Independent check: a cabinet of reference evidence wired to an inspection gate across the track.
 L.push(box(512,140,0,100,82,76));
 const ef=FRONT(140),labels=[9,34,59].map(v=>quad(ef,524,v,20,8)).join('');
 L.push(el('dt',marks(ef,[[[516,26],[608,26]],[[516,51],[608,51]],[[552,14],[572,14]],[[552,39],[572,39]],[[552,64],[572,64]]]))+el('w0',labels)+el('e',labels));
 // Reference binders: brass covers around pale page blocks.
 for(const [x,y,z,w,d] of [[522,154,76,74,52],[526,150,82,70,52],[520,156,88,74,48]])L.push(box(x,y,z,w,d,6,'b')+el('w0',quad(FRONT(y),x+2,z+1.6,w-4,2.8))+el('eb',quad(FRONT(y),x+2,z+1.6,w-4,2.8))+el('w0',quad(SIDE(x+w),y+2,z+1.6,d-4,2.8)));
 // A cable carries the evidence to the gate; the gate never connects to the console.
 const bez=(a,b,c,d)=>ids(25).map(i=>{const s=i/24,u=1-s;return [0,1,2].map(j=>u*u*u*a[j]+3*u*u*s*b[j]+3*u*s*s*c[j]+s*s*s*d[j]);});
 const cable=bez([612,200,24],[650,200,2],[676,118,1],[660,68,8]);
 L.push(tube([612,200,24],[617,200,24],3.2,'s',10)+el('cable',line(cable))+el('cable-hi',line(cable)));
 const gateFront=plane([612,66,0],[1,0,0],[0,0,1]);
 const card=FRONT(-1.5);
 const token=t=>{const q=1-span(t,.55,.59),p=span(t,.55,.59)*(1-span(t,.8,.84)),k=span(t,.8,.84);return `<ellipse class="sh-token" cx="2" cy="4" rx="${f(21*ZOOM)}" ry="${f(9*ZOOM)}"/>`+prism(rrect(-15,-11,30,22,6),0,7,'s')+box(-11,-1.5,7,22,3,28)+el('qmark',marks(card,[[...ids(9).map(i=>{const a=(160-i*27)*R;return[3.6*Math.cos(a),26+3.6*Math.sin(a)];}),[0,20.5]]]),op(q))+el('qdot',oval(card,0,16.5,1,8),op(q))+el('plan thin',marks(card,[[[-7,13],[-7,30]],[[-7,13],[7,13]],ids(8).map(i=>[-6+i*1.8,15+12*(1-Math.exp(-i/2.6))])]),op(p))+el('tick',marks(card,[[[-5,22],[-1.5,17.5],[6,27]]]),op(k));};
 const dock=[0,176,Ls+arc/2];
 const sAt=t=>t<.3?dock[0]:t<.37?lerp(dock[0],dock[1],ease(span(t,.3,.37))):t<.6?dock[1]:t<.68?lerp(dock[1],dock[2],ease(span(t,.6,.68))):t<.84?dock[2]:lerp(dock[2],total,ease(span(t,.84,1)));
 // The carrier is drawn in one of three depth slots: behind the gate, inside it, or in front of everything.
 const slot=t=>{const s=sAt(t)%total,p=trackAt(s);return s<Ls||s>Ls+arc?2:p[1]>72?0:p[1]>=58?1:2;};
 const carrier=k=>t=>moved(trackAt(sAt(t)),token(t),slot(t)===k?1:0);
 L.push(carrier(0));
 L.push(box(598,59,0,14,14,84)+el('dt',marks(FRONT(59),[[[603,10],[603,74]],[[607,10],[607,74]]])));
 L.push(carrier(1));
 L.push(t=>{const on=pulse(t,.68,.81,.02),z=72-66*span(t,.69,.79);return el('beam',loop([gateFront(10,74),gateFront(26,74),gateFront(36,3),gateFront(0,3)]),op(on*.34))+el('scan',line([gateFront(1,z),gateFront(35,z)]),op(on));});
 // Inspection head under the crossbar, signal lamp on top.
 L.push(box(648,59,0,14,14,84)+el('dt',marks(FRONT(59),[[[653,10],[653,74]],[[657,10],[657,74]]]))+box(594,56,84,72,20,11)+box(618,60,75,24,12,9,'s')+el('scr',quad(FRONT(60),622,77,16,3.4)));
 L.push(el('dt',marks(FRONT(56),[[[600,89.5],[614,89.5]],[[646,89.5],[660,89.5]]]))+lathe(630,66,95,[[8,0],[8,3],[6,3],[6,25],[4.2,28],[0,28.6]],'w',22));
 L.push(t=>{const wait=pulse(t,.68,.81,.02),pass=span(t,.8,.82),[x,y]=S([630,66,112]);return el('lamp-wait',wall(630,66,6.2,100,108),op(.22+.78*wait))+el('lamp-ok',wall(630,66,6.2,110,118),op(.22+.78*pass))+`<circle cx="${f(x)}" cy="${f(y)}" r="30" fill="url(#${id}-ok)"${op(pass*.9)}/>`;});
 L.push(carrier(2));
 const step=t=>t<b1?0:t<b2?1:2;
 L.push(t=>callout(0,[66,172,126],[-12,-30],step(t)===0)+callout(1,[308,194,176],[0,-28],step(t)===1)+callout(2,[636,66,123],[40,-12],step(t)===2));
 return {id,layers:L,view:frame([[0,0,-24],[W,0,-24],[W,D,0],[0,D,0],[26,176,160],[214,200,206],[630,66,130]]),label:'An illustrated virtual research bench. On the left, a small robot agent stands beside a board holding a research question and the plan it writes. Its hand rests on a console of simulation and analysis tools, whose screen draws a result while three tool modules light in turn. A work card travels on a loop track from the agent to the console, then into an inspection gate wired to a separate cabinet of reference evidence; a lamp on the gate lights when the check passes, and the card returns to the agent. A schematic illustration, not a real system or result.'};
}

// 2. Quantum Computing: a problem is encoded, engineered couplings release energy to a cold reservoir, and population settles in a target.
function quantumScene([b1,b2]){
 const id='quantum',W=720,D=240,L=[defs(id),bench(id,W,D)];
 L.push(contact(id,[rect(22,74,112,92),rect(150,44,380,164),rect(164,212,352,24),rect(566,60,124,68)]));
 const w1=[76,109,142,175].map(y=>[214,y,85.4]),w2=[[340,92.5,63.4],[340,158.5,63.4]],tgt=[466,126,41.4];
 const routes1=w1.map((p,i)=>[p,[280,p[1],85.4],[280,p[1],62],[300,p[1],63.4],w2[i>>1]]);
 const routes2=w2.map(p=>[p,[400,p[1],63.4],[400,p[1],40],[420,p[1],41.4],tgt]);
 // Each transition starts at a set time; its quantum leaves the coupler shortly after.
 const trips=[...routes1.map((r,i)=>[r,.31+.035*i]),...routes1.map((r,i)=>[r,.45+.03*i]),...routes2.map((r,i)=>[r,.4+.06*i]),...routes2.map((r,i)=>[r,.53+.05*i])];
 const inFlight=(t,k)=>{const u=span(t,trips[k][1]+.032,trips[k][1]+.11);return u>0&&u<1?Math.sin(u*Math.PI):0;};
 const flux=t=>trips.reduce((n,_,k)=>n+inFlight(t,k),0);
 // Cold reservoir: a finned heat sink behind the module, the engineered environment.
 L.push(box(164,212,0,352,24,22,'s'));
 L.push(t=>{const [x,y]=S([334,236,70]);return `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(190*ZOOM)}" ry="${f(46*ZOOM)}" fill="url(#${id}-glow)"${op(clamp(flux(t)/1.4)*.75)}/>`;});
 L.push(ids(16).map(i=>box(170+21.5*i,213,22,4,22,82,'s')).join(''));
 // Encoder and the problem card: a sparse matrix and a vector.
 L.push(el('cord',line([[134,120,22],[162,120,22]])));
 L.push(t=>ids(3).map(k=>{const u=span(t,.18+.03*k,.28+.03*k);return dotAt(along([[134,120,22],[162,120,22]],u),2.6,'bead',u>0&&u<1?1:0);}).join(''));
 L.push(box(22,74,0,112,92,46)+box(28,80,46,100,80,4));
 const ef=FRONT(74),vents=[84,90,96,102,108,114].map(u=>[[u,10],[u,36]]);
 L.push(el('w0',quad(ef,32,20,36,12))+el('e',quad(ef,32,20,36,12))+el('dt',marks(ef,[[[35,26],[60,26]],...vents])));
 L.push(t=>ids(3).map(k=>el('led',oval(ef,124,12+9*k,2.2,10),op(t>.05+.05*k&&t<.32?1:.18))).join(''));
 L.push(box(40,88,50,78,62,2.4));
 const top=TOP(52.4),A=[[3,1,0,0],[1,3,1,0],[0,1,3,1],[0,0,1,3]],bvec=[2,1,1,2],tiles=['','','',''];
 A.forEach((row,i)=>row.forEach((a,j)=>{tiles[a]+=quad(top,45+j*12.6,140-i*12.6-11,11,11);}));bvec.forEach((b,i)=>{tiles[b]+=quad(top,102,140-i*12.6-11,11,11);});
 L.push(tiles.map((d,k)=>el('cell'+k,d)).join('')+el('dt',marks(top,[[[44,141.5],[42.5,141.5],[42.5,90],[44,90]],[[94.5,141.5],[96,141.5],[96,90],[94.5,90]],[[101,141.5],[99.5,141.5],[99.5,90],[101,90]],[[114,141.5],[115.5,141.5],[115.5,90],[114,90]]])));
 L.push(t=>{const u=ease(span(t,.04,.2));return moved([lerp(30,124,u),0,0],box(-3,81,52.4,6,78,5,'s')+el('scanbar',line([[0,81,52.6],[0,159,52.6]]),op(u>0&&u<1?1:0)));});
 // Stepped module: a machined housing whose dark chip plates step down in energy; wells hold population.
 L.push(box(150,44,0,380,164,8,'s'));
 for(const [x,y] of [[158,50],[522,50],[522,202],[158,202]])L.push(ellipse([x,y,8],2.8,'screw'));
 const T=[[160,280,84],[280,400,62],[400,520,40]];
 T.forEach(([x0,x1,z])=>L.push(box(x0,52,8,x1-x0,148,z-8)+prism(rrect(x0+7,59,x1-x0-14,134,5),z,1.4,'k')+[[x0+12,64],[x1-12,64],[x1-12,188],[x0+12,188]].map(([x,y])=>ellipse([x,y,z+1.4],1.7,'chip-screw')).join('')));
 L.push(el('dt',marks(FRONT(52),[[[172,74],[208,74]],[[172,68],[194,68]],[[292,52],[320,52]],[[412,30],[432,30]]])));
 // Waveguide traces on the chip plates, grooves down the risers.
 L.push(el('chipline',[...routes1,...routes2].map(r=>line(r.slice(0,2))+line(r.slice(3))).join(''))+el('groove',[...routes1,...routes2].map(r=>line([add(r[1],[0,0,-1.4]),r[2]])).join('')));
 L.push(t=>{const on=span(t,.3,.34)*(1-span(t,.66,.72));return el('flow',[...routes1,...routes2].map(line).join(''),` style="stroke-dashoffset:${f(-t*900)}px"`+op(on));});
 const pad=(p,r)=>ellipse(p,r,'b0 eb-s')+ellipse([p[0]+.6,p[1]+1.2,p[2]],r*.7,'well-k');
 L.push(w1.map(p=>pad(p,10.5)).join('')+w2.map(p=>pad(p,12)).join(''));
 L.push(el('b2',wall(466,126,19,41.4,45.4))+el('eb',wall(466,126,19,41.4,45.4))+ellipse([466,126,45.4],19,'b0 eb-s')+ellipse([466.7,127.4,45.4],14,'well-k'));
 L.push(w1.map(p=>box(275,p[1]-5.5,81,10,11,6,'b')).join('')+w2.map(p=>box(395,p[1]-5.5,59,10,11,6,'b')).join(''));
 // Population: a fixed encoded distribution flowing down a cascade; the target fills.
 const share=[.32,.14,.36,.18];
 const pops=t=>{const e=span(t,.18,.3),s=Math.max(0,(t-.3)/.4),a=Math.exp(-4.4*s),b=4.4/1.2*(Math.exp(-3.2*s)-Math.exp(-4.4*s));return {p:share.map(w=>w*a*e),q:[(share[0]+share[1])*b,(share[2]+share[3])*b],r:1-a-b};};
 const amount=(p,v,ref,r,g='glow')=>{const k=Math.sqrt(clamp(v/ref));return ellipse([p[0],p[1],p[2]+.3],r*(1.3+.9*k),'',` fill="url(#${id}-${g})"`+op(k*1.2))+ellipse([p[0]+.6,p[1]+1.2,p[2]+.3],Math.max(.4,r*.62*k),g==='warm'?'pop warm':'pop',op(k>.02?1:0));};
 L.push(t=>{const P=pops(t);return w1.map((p,i)=>amount(p,P.p[i],.36,10.5)).join('')+w2.map((p,i)=>amount(p,P.q[i],.46,12)).join('')+amount([466,126,45.4],P.r,1,14,'warm');});
 // Beads in transit, and the quantum each transition emits into the cold reservoir.
 const flights=trips.map(([r])=>{const c=add(r[1],[0,0,8]),end=[c[0]+26,222,Math.min(c[2]+30,98)];return {c,end,d:packet(46,5,2.5,toward(c,end))};});
 L.push(t=>flights.map(({c,end,d},k)=>{const u=span(t,trips[k][1]+.032,trips[k][1]+.11);return moved(along([c,end],ease(u)),el('quantum',d),inFlight(t,k)*1.4);}).join(''));
 L.push(t=>trips.map(([r,t0])=>{const u=span(t,t0,t0+.07);return dotAt(along(r,u),3.4,'bead',u>0&&u<1?1:0);}).join(''));
 // Readout: the target well feeds a meter.
 const port=[[486,126,40],[520,126,40]],lead=[[527,126,24],[544,126,24],[548,126,8],[566,100,8]];
 L.push(el('groove',line(port))+tube([520,126,24],[527,126,24],4,'b',12)+el('cord',line(lead)));
 L.push(box(566,60,0,124,68,52));
 const mf=FRONT(60),dial=[606,27];
 L.push(el('w0',oval(mf,...dial,16.5,28))+el('e',oval(mf,...dial,16.5,28))+el('dt',marks(mf,ids(8).map(i=>{const a=(160-20*i)*R;return[[dial[0]+11.5*Math.cos(a),dial[1]+11.5*Math.sin(a)],[dial[0]+14.5*Math.cos(a),dial[1]+14.5*Math.sin(a)]];})))+el('arc-warm',marks(mf,[ids(7).map(i=>{const a=(48-i*5)*R;return[dial[0]+13*Math.cos(a),dial[1]+13*Math.sin(a)];})])));
 L.push(el('dt',marks(mf,[[[632,44],[676,44]],[[632,38],[660,38]]]))+tube([662,60,18],[662,54,18],5,'w',16)+tube([662,54,18],[662,52,18],3.4,'w',12));
 L.push(t=>{const P=pops(t),u=span(t,.7,.82),a=(160-140*clamp(P.r*u+.02))*R,c=mf(...dial);return el('needle',line([c,mf(dial[0]+12.5*Math.cos(a),dial[1]+12.5*Math.sin(a))]))+el('led-warm',oval(mf,640,22,2.6,12),op(span(t,.82,.86)))+ids(3).map(k=>{const v=span(t,.7+.03*k,.8+.03*k);return dotAt(along([...port,...lead],v),2.6,'bead warm',v>0&&v<1?1:0);}).join('');});
 L.push(el('pin-hub',oval(mf,...dial,1.9,10)));
 const step=t=>t<b1?0:t<b2?1:2;
 L.push(t=>callout(0,[79,119,53],[-22,-38],step(t)===0)+callout(1,[280,76,74],[30,44],step(t)===1)+callout(2,[466,126,44],[34,-42],step(t)===2));
 return {id,layers:L,view:frame([[0,0,-24],[W,0,-24],[W,D,0],[0,D,0],[170,236,150],[214,76,130]]),label:'A quantum module drawn as a stepped block on a bench. On the left, a card carrying a sparse matrix and a vector is scanned by an encoder, which loads the problem as population in four wells on the top step. Brass couplers let the population pass along grooves from step to step toward a single brass target well; each transition releases a small quantum of energy toward a finned cold reservoir behind the module. A meter wired to the target well reads out the final state. A conceptual analogy, not measured physics or a result.'};
}

// 3. Learning Quantum Systems: a lattice with hidden couplings is probed patch by patch until a model emerges.
function learningScene([b1,b2]){
 const id='learning',W=664,D=240,L=[defs(id),bench(id,W,D,true)];
 const X=[138,222,306,390,474],Y=[61,117,173],site=(i,j)=>[X[i],Y[j],30];
 const bonds=[];for(let j=0;j<3;j++)for(let i=0;i<5;i++){if(i<4)bonds.push([i,j,i+1,j]);if(j<2)bonds.push([i,j,i,j+1]);}
 const J=bonds.map((b,k)=>.25+.75*((k*7+3)%11)/10);
 const leaky=[[1,0],[3,1],[0,2]];
 const wins=[[3,0],[2,0],[1,0],[0,0],[0,1],[1,1],[2,1],[3,1]];
 const home=[578,110];
 const dwell=k=>[.31+.064*k,.31+.064*k+.048];
 const centre=k=>[X[wins[k][0]]+42,Y[wins[k][1]]+28];
 const probeAt=t=>{
  if(t<.26||t>=.9)return home;if(t<.31)return home.map((v,i)=>lerp(v,centre(0)[i],ease(span(t,.26,.31))));
  for(let k=0;k<8;k++){const [a,b]=dwell(k);if(t<b)return centre(k);if(k<7&&t<a+.064)return centre(k).map((v,i)=>lerp(v,centre(k+1)[i],ease(span(t,b,a+.064))));}
  return centre(7).map((v,i)=>lerp(v,home[i],ease(span(t,.814,.9))));
 };
 const probing=t=>wins.findIndex((_,k)=>t>=dwell(k)[0]&&t<dwell(k)[1]);
 // Rail with a ruled scale, then the column that rides it (drawn before the stage it stands behind).
 L.push(box(66,220,0,546,14,10,'s'));
 L.push(el('dt',ids(39).map(i=>line([[72+14*i,221,10],[72+14*i,i%5?224:228,10]])).join('')));
 L.push(t=>moved([probeAt(t)[0]-home[0],0,0],box(home[0]-15,216,10,30,22,8)+box(home[0]-9,220,18,18,14,106)));
 L.push(contact(id,[rrect(88,22,436,190,10),rect(556,88,44,44)]));
 L.push(prism(rrect(88,22,436,190,10),0,24)+prism(rrect(102,34,408,166,6),24,6,'s'));
 L.push(el('dt',marks(FRONT(22),[[[104,12],[150,12]],[[104,7],[128,7]]])+[[108,40],[504,40],[504,194],[108,194]].map(([x,y],k)=>line([[x+(k%3?-8:8),y,30],[x,y,30],[x,y+(k<2?8:-8),30]])).join('')));
 L.push(box(556,88,0,44,44,4)+ellipse([578,110,4],12,'e-s')+el('dt',line([[568,110,4],[588,110,4]])+line([[578,100,4],[578,120,4]])));
 // Controller: one lamp per completed local experiment, cabled to the rail.
 L.push(el('cord',line([[612,182,10],[612,234,10],[612,234,4]]))+box(592,150,0,56,30,46)+el('dt',marks(FRONT(150),[[[598,38],[640,38]],[[598,33],[626,33]]])));
 L.push(t=>ids(8).map(k=>el('led',oval(FRONT(150),598+5.6*k,20,1.9,8),op(t>=dwell(k)[1]&&t<.97?1:.18))).join(''));
 const ends=b=>[site(b[0],b[1]),site(b[2],b[3])].map(p=>add(p,[0,0,.4]));
 L.push(el('hid',bonds.map(b=>line(ends(b))).join('')));
 // Evidence per coupling: every probed patch that contains it adds one observation.
 const inWin=(b,[i,j])=>b[0]>=i&&b[2]<=i+1&&b[1]>=j&&b[3]<=j+1;
 const evidence=(b,t)=>wins.reduce((n,w,k)=>n+(inWin(b,w)?span(t,...dwell(k)):0),0);
 L.push(t=>{const done=span(t,.84,.95);return bonds.map(b=>{const n=evidence(b,t),w=(18/(1+1.6*n))*(1-done);return el('unc',line(ends(b)),` style="stroke-width:${f(w+.01)}px"`+op((.16+.12*Math.min(1,n))*(1-done)));}).join('');});
 L.push(t=>{const done=span(t,.84,.95);return bonds.map((b,k)=>{const n=Math.min(1,evidence(b,t));return el('inf',line(ends(b)),` style="stroke-width:${f((1+3.4*J[k])*(.5+.5*Math.max(n,done)))}px"`+op(Math.max(n*.9,done)));}).join('');});
 // Sites, the leak of dissipative sites and the excitations of the unseen dynamics.
 L.push(ids(15).map(k=>lathe(...site(k%5,Math.floor(k/5)),[[7.4,0],[7.4,4.6],[5.4,7.2],[0,7.6]],'w',16)).join(''));
 L.push(t=>{const w=probing(t),hop=(t*14)%1;return ids(15).map(k=>{const i=k%5,j=Math.floor(k/5),lit=w>=0&&i>=wins[w][0]&&i<=wins[w][0]+1&&j>=wins[w][1]&&j<=wins[w][1]+1,free=t<.26?Math.max(0,Math.sin((t*9+i*.37+j*.61)*Math.PI*2))**2:0;return ellipse([X[i],Y[j],37],16,'',` fill="url(#${id}-glow)"`+op(lit?.6+.4*Math.sin(hop*Math.PI):free*.9));}).join('');});
 L.push(t=>{const seen=span(t,.86,.94);return leaky.map(([i,j])=>ellipse(site(i,j),11.5,'dis',op(seen))).join('');});
 L.push(t=>leaky.map(([i,j],k)=>{const u=(t*3.2+k*.33)%1;return moved(add(site(i,j),[0,0,12+30*u]),el(t>.86?'quantum warm':'leak',packet(22,3.4,2,[0,-1])),Math.sin(u*Math.PI)*.9);}).join(''));
 // Scanning probe: the light that defines a local patch, then arm, carriage and objective.
 const patch=[[-58,-44],[58,-44],[58,44],[-58,44]].map(([a,b])=>[home[0]+a,home[1]+b,30.4]),tip=[home[0],home[1],60];
 L.push(t=>{const [x,y]=probeAt(t),w=probing(t),u=w>=0?span(t,...dwell(w)):0;return moved([x-home[0],y-home[1],0],el('patch',loop(patch))+el('patch-e',loop(patch))+ellipse([home[0],home[1],30.6],16+36*u,'ripple',op(w>=0?1-u:0)),w>=0?1:0);});
 L.push(t=>moved([probeAt(t)[0]-home[0],0,0],box(home[0]-7,28,114,14,206,10)));
 L.push(t=>{const [x,y]=probeAt(t),on=probing(t)>=0;return moved([x-home[0],y-home[1],0],el('cone',loop([tip,patch[0],patch[1]])+loop([tip,patch[1],patch[2]]),op(on?.9:0))+box(home[0]-12,home[1]-13,106,24,26,24)+lathe(...home,60,[[0,0],[3,5],[6.6,12],[6.6,30],[8.4,32],[8.4,46]],'w',20)+lathe(...home,84,[[7,0],[7,5]],'b',20));});
 const step=t=>t<b1?0:t<b2?1:2;
 L.push(t=>{const [x,y]=probeAt(t);return callout(0,[432,173,31],[26,-36],step(t)===0)+callout(1,[x,y,130],[28,-26],step(t)===1)+callout(2,[264,61,31],[-34,34],step(t)===2);});
 return {id,layers:L,view:frame([[0,0,-24],[W,0,-24],[W,D,0],[0,D,0],[180,234,150],[578,234,150]]),label:'A sample stage holding a five-by-three lattice of sites. The couplings between neighboring sites are hidden and appear only as dashed lines inside soft bands of uncertainty, and a few sites leak energy. A probe on a scanning arm visits two-by-two patches in turn and lights each one. With every local observation the bands around the nearby couplings narrow, until each coupling is drawn with an inferred strength and the leaking sites are ringed. A schematic illustration, not data or a reported accuracy.'};
}

const scenes={agents:agentScene,quantum:quantumScene,learning:learningScene},built={};
const scene=kind=>{
 if(built[kind])return built[kind];
 // Callouts follow the same step boundaries as the readout and the HTML step list.
 const s=scenes[kind](specs[kind].bounds.map(b=>b/100)),layers=[];
 // Adjacent static layers are joined once; only functions of the parameter run per frame.
 for(const layer of s.layers)typeof layer==='string'&&typeof layers.at(-1)==='string'?layers[layers.length-1]+=layer:layers.push(layer);
 return built[kind]={...s,layers};
};
const specs={
 agents:{title:'From a question to a checked result',label:'Explore the investigation',value:50,bounds:[30,60],description:'An agent turns a research question into a plan, runs it with tools in a virtual laboratory, and sends its conclusion through an independent check.',steps:[['Ask a question','The agent turns a research question into a plan.'],['Use scientific tools','It runs calculations in a virtual laboratory and revises as results return.'],['Check the conclusion','A separate check compares the result with independent evidence.']]},
 quantum:{title:'Computing through open-system evolution',label:'Explore the computation',value:45,bounds:[30,70],description:'A problem is encoded in a quantum state; engineered couplings to a cold environment carry the state toward a target that encodes the answer. A conceptual analogy for dissipative quantum algorithms.',steps:[['Encode the problem','The problem sets the initial quantum state.'],['Compute with dissipation','Engineered couplings release energy to a cold environment and steer the state toward a target.'],['Read out the answer','Measuring the final state recovers the solution.']]},
 learning:{title:'From local observations to a model',label:'Explore the learning process',value:72,bounds:[26,82],description:'Couplings and dissipation in a quantum system are hidden; short local experiments narrow the uncertainty until a model of the dynamics emerges.',steps:[['Unknown interactions','Couplings and dissipation inside the system are hidden.'],['Measure locally','A probe runs short experiments on small patches; each observation narrows the uncertainty.'],['Infer the dynamics','The local evidence combines into a model of couplings and dissipation.']]},
};
export const sceneSpecs=Object.fromEntries(Object.entries(specs).map(([kind,spec])=>[kind,{...spec,min:0,max:100,step:1,readout:v=>spec.steps[v<spec.bounds[0]?0:v<spec.bounds[1]?1:2][0]}]));
// The full markup is the static page artwork. With live=true only the animated layers and the step list are
// returned, in the same order, so the controller can update attributes without re-reading the static artwork.
export function renderScene(kind,value,live=false){
 const spec=sceneSpecs[kind],s=scene(kind),v=Number(value),t=clamp((Number.isFinite(v)?v:spec.value)/100),k=t*100<spec.bounds[0]?0:t*100<spec.bounds[1]?1:2;
 const art=s.layers.map(l=>typeof l==='string'?live?'':l:`<g data-live="">${l(t)}</g>`).join('');
 const open=live?'<svg xmlns="http://www.w3.org/2000/svg">':`<svg class="research-scene-svg" data-scene="${kind}" viewBox="${s.view}" role="img" aria-label="${s.label}" xmlns="http://www.w3.org/2000/svg">`;
 return `${open}${art}</svg><ol class="scene-steps">${spec.steps.map(([label,description],i)=>`<li class="explain-step" data-active="${i===k}" data-live=""><span class="scene-step__n" aria-hidden="true">${i+1}</span><div><h4>${label}</h4><p>${description}</p></div></li>`).join('')}</ol>`;
}
