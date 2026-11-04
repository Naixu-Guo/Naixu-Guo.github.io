import { renderScene, sceneSpecs } from '../assets/research-scenes.js';
export function researchDiagram(id,escapeHtml){
 const kind={'agents-for-science':'agents','quantum-learning':'quantum','system-learning':'learning'}[id];
 const spec=sceneSpecs[kind];
 return `<div class="research-diagram" data-research-diagram data-kind="${kind}" data-running="false" role="group" aria-labelledby="${id}-diagram-title">
  <div class="diagram-heading"><h3 id="${id}-diagram-title">${spec.title}</h3></div>
  <div class="diagram-controls" hidden><button class="diagram-play" data-diagram-play type="button" hidden aria-label="Play animation: ${spec.title}">Play</button><label class="visually-hidden" for="${id}-parameter">${spec.label}</label><input id="${id}-parameter" type="range" min="${spec.min}" max="${spec.max}" step="${spec.step}" value="${spec.value}"><output for="${id}-parameter" aria-live="off">${spec.readout(spec.value)}</output></div>
  <div class="diagram-art">${renderScene(kind,spec.value)}</div>
 </div>`;
}
