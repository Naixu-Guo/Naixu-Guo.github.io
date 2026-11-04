// All state remains local. These illustrations explain concepts, not measured results.
const moduleURL=document.querySelector('script[data-scene-module]').dataset.sceneModule;
const {renderScene,sceneSpecs}=await import(moduleURL);
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
document.querySelectorAll('[data-research-diagram]').forEach(figure=>{
 const kind=figure.dataset.kind,spec=sceneSpecs[kind];
 const play=figure.querySelector('[data-diagram-play]'),controls=figure.querySelector('.diagram-controls');
 const input=controls.querySelector('input'),output=controls.querySelector('output'),art=figure.querySelector('.diagram-art');
 let paused=reduced.matches,visible=false,printing=false,started=false,timer,endHold=0;
 play.hidden=false;controls.hidden=false;
 function render(value){
  input.value=value;output.value=spec.readout(Number(value));
  input.setAttribute('aria-valuetext',output.value);
  // Only the animated layers and the step list are rebuilt. Their attributes are copied onto the existing
  // nodes, so the static artwork is never re-parsed and focus and DOM size are preserved. Markup without
  // live markers falls back to comparing every node, and any mismatch replaces the scene once.
  const draft=document.createElement('template');draft.innerHTML=renderScene(kind,Number(value),true);
  const nodes=root=>{const live=root.querySelectorAll('[data-live],[data-live] *');return live.length?live:root.querySelectorAll('*');};
  const oldNodes=nodes(art);
  const newNodes=nodes(draft.content);
  if(oldNodes.length!==newNodes.length) art.innerHTML=renderScene(kind,Number(value));
  else newNodes.forEach((node,i)=>{
   for(const attr of node.attributes)if(oldNodes[i].getAttribute(attr.name)!==attr.value)oldNodes[i].setAttribute(attr.name,attr.value);
  });
 }
 function sync(){
  clearInterval(timer);
  const running=!paused&&visible&&!document.hidden&&!reduced.matches&&!printing;
  figure.dataset.running=String(running);
  play.disabled=reduced.matches;
  play.textContent=reduced.matches?'Motion off':paused?'Play':'Pause';
  play.setAttribute('aria-label',`${reduced.matches?'Reduced motion enabled':paused?'Play animation':'Pause animation'}: ${spec.title}`);
  if(running){
   // The static preview stays informative; the first actual playback begins at the start.
   if(!started){started=true;render(spec.min);}
   timer=setInterval(()=>{
   const value=Number(input.value);
   // Hold the final state, then restart. Never run dissipative evolution backwards.
   if(value>=spec.max){if(++endHold>=20){endHold=0;render(spec.min);}}
   else {endHold=0;render(Math.min(spec.max,value+spec.step));}
   },100);
  }
 }
 input.addEventListener('input',()=>{paused=true;started=true;endHold=0;render(Number(input.value));sync();});
 play.addEventListener('click',()=>{paused=!paused;sync();});
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting&&entries[0].intersectionRatio>=.15;sync();},{threshold:.15});observer.observe(art.querySelector('svg'));
 document.addEventListener('visibilitychange',sync);
 reduced.addEventListener('change',()=>{if(reduced.matches)paused=true;sync();});
 window.addEventListener('beforeprint',()=>{printing=true;sync();});
 window.addEventListener('afterprint',()=>{printing=false;sync();});
 render(spec.value);sync();
});
