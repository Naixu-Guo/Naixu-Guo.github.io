import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { loadSiteData } from "./content.mjs";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const controller = await readFile(new URL("../assets/site.js", import.meta.url), "utf8");
const bootstrap = html.match(/<script>(\{const legacy=.*?)<\/script>/s)[1];
const appearanceConfig = html.match(/<script type="application\/json" id="appearance-config">(.*?)<\/script>/s)[1];

function environment({ saved = null, legacySaved = null, blocked = false, reduced = false, motion = null } = {}) {
  const styles = {};
  const root = { dataset: {}, style: { setProperty(k,v) { styles[k]=v; }, removeProperty(k) { delete styles[k]; } } };
  const elements = { "[data-ink-theme]": {media:""}, "[data-game-theme]": {media:""} };
  const meta = { content: "" };
  const buttonEvents = {};
  const button = { attrs:{}, addEventListener(k,fn) {buttonEvents[k]=fn;}, setAttribute(k,v) {this.attrs[k]=v;} };
  elements["[data-motion-toggle]"] = button;
  const documentEvents = {}, windowEvents = {}, mediaEvents = {};
  const reducedMedia = { matches: reduced, addEventListener(k,fn) {mediaEvents[k]=fn;} };
  const values = new Map([["ng-appearance",saved],["ng-theme",legacySaved],["ng-motion",motion]]);
  const context = vm.createContext({
    document: { documentElement:root, getElementById(id) {return id === "appearance-config" ? {textContent:appearanceConfig} : null;}, querySelector(s) {return s.includes("meta[") ? meta : elements[s] ?? null;}, querySelectorAll(s) {return s.includes("meta[") ? [meta] : [];}, addEventListener(k,fn) {documentEvents[k]=fn;} },
    window: {addEventListener(k,fn) {windowEvents[k]=fn;}},
    location: {hash:"", replace(){}},
    localStorage: {getItem(k) {if(blocked) throw new Error("unavailable");return values.get(k);},setItem(k,v) {if(blocked) throw new Error("unavailable");values.set(k,v);}},
    matchMedia(q) {return q.includes("reduced-motion") ? reducedMedia : {matches:true};},
    innerWidth:1440,innerHeight:900,setTimeout,clearTimeout,atob,
  });
  return {context,root,elements,button,buttonEvents,documentEvents,windowEvents,reducedMedia,mediaEvents,values,styles};
}

test("theme bootstrap preserves saved choices and falls back safely",()=>{
  for(const saved of [null,"ink","black","normal","light","dark","invalid"]){
    const env=environment({saved}); vm.runInContext(bootstrap,env.context);
    const expected=["ink","black","dark"].includes(saved)?saved:"ink";
    assert.equal(env.root.dataset.theme,expected);
    assert.equal(env.elements["[data-ink-theme]"].media,["ink","black"].includes(expected)?"all":"not all");
    assert.equal(env.elements["[data-game-theme]"].media,expected==="dark"?"all":"not all");
    vm.runInContext(controller,env.context);
    assert.equal(env.root.dataset.theme,expected);
    assert.equal(env.elements["[data-game-theme]"].media,expected==="dark"?"all":"not all");
  }
  const env=environment({blocked:true}); vm.runInContext(bootstrap,env.context); vm.runInContext(controller,env.context);
  assert.equal(env.root.dataset.theme,"ink");
});

test("every route opens in Light despite a legacy Game preference", async () => {
  for (const route of ["index.html", "research/index.html", "publications/index.html", "library/index.html", "cv/index.html", "404.html"]) {
    const source = await readFile(new URL(`../${route}`, import.meta.url), "utf8");
    const start = source.match(/<script>(\{const legacy=.*?)<\/script>/s)[1];
    const env = environment({legacySaved: "dark"});
    vm.runInContext(start, env.context);
    assert.equal(env.root.dataset.theme, "ink", `${route}: first paint must be Light`);
    assert.equal(env.elements["[data-game-theme]"].media, "not all");
    vm.runInContext(controller, env.context);
    env.windowEvents.storage({key:"ng-theme", newValue:"dark"});
    assert.equal(env.root.dataset.theme, "ink", `${route}: old tabs cannot restore Game`);
    assert.equal(env.values.get("ng-appearance"), null, "only an explicit choice should be saved");
  }
});

test("Email controls reveal the configured contact only on activation", async () => {
  const { SITE } = await loadSiteData();
  const address = `${SITE.email.local}@${SITE.email.domain}`;
  for (const route of ["index.html", "cv/index.html"]) {
    const source = await readFile(new URL(`../${route}`, import.meta.url), "utf8");
    assert.ok(!source.includes(address), 'Do not expose the complete address in HTML or structured data');
    assert.doesNotMatch(source, /mailto:|@u\.nus\.edu/);
    const encoded = source.match(/data-email="([^"]+)"/)?.[1];
    assert.equal(atob(encoded), address);
    const handlers = {};
    const button = {dataset:{email:encoded},hidden:true,addEventListener(name,fn){handlers[name]=fn;}};
    const env = environment();
    env.context.document.querySelectorAll = selector => selector === '[data-email]' ? [button] : [];
    vm.runInContext(bootstrap, env.context);
    vm.runInContext(controller, env.context);
    assert.equal(button.hidden, false);
    assert.equal(env.context.location.href, undefined, 'Loading the page must not open a mail client');
    handlers.click();
    assert.equal(env.context.location.href, `mailto:${address}`);
    assert.ok(source.includes(`${SITE.email.local} [at] ${SITE.email.domain.replaceAll('.', ' [dot] ')}`), 'No-JavaScript visitors retain a readable contact');
  }
  const record = await readFile(new URL('../content/site.json', import.meta.url), 'utf8');
  assert.ok(!record.includes(address), 'The public content record stores separate editable parts');
});

test("motion is opt-in, bounded, persistent, and overridden by reduced motion",()=>{
  const env=environment();vm.runInContext(bootstrap,env.context);vm.runInContext(controller,env.context);
  assert.equal(env.root.dataset.motion,"off");
  env.buttonEvents.click();assert.equal(env.root.dataset.motion,"on");assert.equal(env.values.get("ng-motion"),"on");
  env.documentEvents.pointermove({clientX:1440,clientY:900});
  assert.equal(env.styles["--world-x"],"-5px");assert.equal(env.styles["--world-y"],"-3px");
  env.reducedMedia.matches=true;env.mediaEvents.change();
  assert.equal(env.root.dataset.motion,"off");assert.equal(env.button.disabled,true);assert.equal(Object.keys(env.styles).length,0);
  const reduced=environment({reduced:true,motion:"on"});vm.runInContext(bootstrap,reduced.context);vm.runInContext(controller,reduced.context);
  assert.equal(reduced.root.dataset.motion,"off");
});

test("cross-tab appearance changes preserve current choices and retire P3 safely",()=>{
  const env=environment();vm.runInContext(bootstrap,env.context);vm.runInContext(controller,env.context);
  env.windowEvents.storage({key:"ng-appearance",newValue:"dark"});
  assert.equal(env.root.dataset.theme,"dark");assert.equal(env.elements["[data-ink-theme]"].media,"not all");
  assert.equal(env.elements["[data-game-theme]"].media,"all");
  env.windowEvents.storage({key:"ng-appearance",newValue:"black"});
  assert.equal(env.root.dataset.theme,"black");assert.equal(env.elements["[data-ink-theme]"].media,"all");
  assert.equal(env.elements["[data-game-theme]"].media,"not all");
  env.windowEvents.storage({key:"ng-appearance",newValue:"light"});
  assert.equal(env.root.dataset.theme,"ink");assert.equal(env.elements["[data-ink-theme]"].media,"all");
  env.windowEvents.storage({key:null,newValue:null});assert.equal(env.root.dataset.theme,"ink");
});

test("appearance picker selects themes, restores focus and cooperates with mobile navigation", () => {
  const env = environment();
  let focused;
  const node = () => ({
    events: {}, attrs: {}, hidden: true,
    addEventListener(name, fn) { (this.events[name] ||= []).push(fn); },
    emit(name, detail = {}) { for (const fn of this.events[name] || []) fn({preventDefault() {}, ...detail}); },
    setAttribute(name, value) { this.attrs[name] = value; },
    focus() { focused = this; },
    matches() { return false; }
  });
  const trigger = node(), options = node(), picker = node(), menu = node(), summary = node();
  const labelText = {textContent: ""};
  const radios = ["ink", "black", "dark"].map(value => ({...node(), value, checked: false, matches: s => s === 'input[name="theme"]'}));
  trigger.querySelector = () => labelText;
  options.querySelector = () => radios.find(input => input.checked);
  picker.querySelector = selector => selector === ".theme-picker__trigger" ? trigger : options;
  picker.querySelectorAll = () => radios;
  picker.contains = target => target === picker || target === trigger || radios.includes(target);
  menu.querySelector = () => summary;
  menu.contains = target => target === menu || target === summary;
  env.elements["[data-theme-picker]"] = picker;
  env.elements[".ink-menu"] = menu;
  const doc = node();
  env.context.document.addEventListener = doc.addEventListener.bind(doc);
  vm.runInContext(bootstrap, env.context);
  vm.runInContext(controller, env.context);
  assert.equal(picker.hidden, false);
  menu.open = true;
  trigger.emit("click");
  assert.equal(menu.open, false);
  assert.equal(options.hidden, false);
  assert.equal(focused, radios[0]);
  radios[2].checked = true;
  picker.emit("change", {target: radios[2]});
  picker.emit("keydown", {target: radios[2], key: "Enter"});
  assert.equal(env.root.dataset.theme, "dark");
  assert.equal(env.elements["[data-game-theme]"].media, "all");
  assert.equal(env.values.get("ng-appearance"), "dark");
  assert.equal(labelText.textContent, "Game");
  assert.equal(options.hidden, true);
  assert.equal(focused, trigger);
  trigger.emit("click");
  const label = {querySelector: () => radios[1]};
  options.emit("click", {target: {closest: () => label, matches: () => false}});
  assert.equal(env.root.dataset.theme, "black");
  assert.equal(env.elements["[data-game-theme]"].media, "not all");
  assert.equal(options.hidden, true);
  trigger.emit("click");
  picker.emit("keydown", {key: "Escape"});
  assert.equal(options.hidden, true);
  assert.equal(focused, trigger);
  trigger.emit("click");
  doc.emit("pointerdown", {target: {}});
  assert.equal(options.hidden, true);
  assert.equal(trigger.attrs["aria-expanded"], "false");
  trigger.emit("click");
  menu.open = true;
  menu.emit("toggle");
  assert.equal(options.hidden, true);
});

test("real pages keep unique headings and resolve local fragment links", async () => {
  const pages = ["", "research/", "publications/", "cv/", "library/"];
  for (const page of pages) {
    const source = await readFile(new URL(`../${page}index.html`, import.meta.url), "utf8");
    assert.doesNotMatch(source, /persona3\.css|data-light-theme|White dragon|Black dragon|>P[35]</);
    const appearances = JSON.parse(source.match(/id="appearance-config">(.*?)<\/script>/s)[1]);
    assert.deepEqual(appearances.map(item=>item.name), ["Light", "Dark", "Game"]);
    assert.deepEqual([...source.matchAll(/name="theme" value="([^"]+)"/g)].map(match=>match[1]), appearances.map(item=>item.id));
    const ids = [...source.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
    assert.equal(new Set(ids).size, ids.length, `Duplicate IDs in ${page}`);
    assert.equal((source.match(/<h1\b/g) || []).length, 1);
    for (const match of source.matchAll(/href="((?:\/(?:(?:research|publications|cv|library)\/)?)?)#([^"]+)"/g)) {
      const target = match[1] ? await readFile(new URL(`..${match[1]}index.html`, import.meta.url), "utf8") : source;
      assert.ok(target.includes(`id="${match[2]}"`), `Unresolved ${page}: ${match[0]}`);
    }
    if (page) assert.doesNotMatch(source, /class="ink-only ink-world"|ink-reader|ink-room-template/);
  }
  assert.match(html, /href="\/research\/">Explore research/);
  assert.doesNotMatch(html, /data-ink-open|ink-room-template|PhD candidate|Forthcoming: QIQCBench/);
});

test("Research curates themes; Publications retains every paper; home avoids repeated information", async () => {
  const { SITE, NEWS, INTERESTS, PUBLICATIONS, RESEARCH, CV, LIBRARY } = await loadSiteData();
  const text = value => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  const page = async name => readFile(new URL(`../${name}/index.html`, import.meta.url), "utf8");
  const publications = await page("publications"), research = await page("research"), library = await page("library"), cv = await page("cv");
  assert.equal((publications.match(/<li class="pub[ "-]/g) || []).length, PUBLICATIONS.length);
  const sections = new Map([...publications.matchAll(/<section class="pub-year" aria-labelledby="year-(\d+)">([\s\S]*?)<\/section>/g)].map(match => [match[1],match[2]]));
  assert.ok(sections.get('2026').includes('Near-Optimal Learning of Local Lindbladians'));
  assert.match(sections.get('2026'), /SODA 2027.*accepted/);
  assert.ok(sections.get('2023').includes('Provable learning of quantum states with graphical models'));
  assert.ok(sections.get('2021').includes('Nonlinear transformation of complex amplitudes'));
  const paperActions = [...publications.matchAll(/<p class="pub__links">(.*?)<\/p>/gs)].map(match => match[1]);
  assert.equal(paperActions.length, PUBLICATIONS.length);
  assert.doesNotMatch(publications, /class="ink-only pub__figure"|class="pub__note ink-only"/);
  assert.match(publications, /data-figure-surface="slate"[^>]*quantum-harbor-framework/);
  for (const actions of paperActions) {
    assert.equal((actions.match(/>Paper<\/a>/g) || []).length, 1);
    assert.doesNotMatch(actions, />arXiv<|>Journal<|Figure credit/);
  }
  for (const paper of PUBLICATIONS) {
    for (const field of [paper.title, paper.summary, ...(paper.figure ? [paper.figure] : [])]) assert.ok(publications.includes(text(field)), `Missing paper content: ${field}`);
    if (paper.figure) await readFile(new URL(`..${paper.figure}`, import.meta.url));
  }
  assert.equal((research.match(/class="research-feature"/g) || []).length, RESEARCH.directions.length);
  assert.doesNotMatch(research, /Current (?:<em>)?interests|class="current-interests"|class="research-topic"|href="#interests"/);
  assert.equal((research.match(/>Read paper<\/a>/g) || []).length, RESEARCH.directions.length);
  assert.doesNotMatch(research, /class="results"|Explore \d+ papers|About my research/);
  for (const direction of RESEARCH.directions) {
    for (const field of [direction.title, direction.question, direction.visualSummary || direction.summary]) assert.ok(research.includes(text(field)), `Missing research theme: ${field}`);
    // Original detailed notes remain in source, and every underlying paper stays on Publications.
    for (const result of direction.results) assert.ok(publications.includes(text(PUBLICATIONS.find(p=>p.id===result.publicationId).title)));
  }
  assert.doesNotMatch(html, /Classic|data-classic-theme|ink-hero-description|home-biography__research|home-research|home-afterword/);
  assert.doesNotMatch(html, /class="profile-menu"|class="profile__description"/);
  assert.equal((html.match(/>Google Scholar<\/a>/g) || []).length, 1);
  assert.equal((html.match(/>GitHub<\/a>/g) || []).length, 1);
  assert.ok(!html.includes(text(SITE.hero.question)), 'Do not restore the retired homepage reflection');
  if (INTERESTS.perspective) {
    assert.ok(!html.includes(text(INTERESTS.perspective.text)), 'The long-term perspective belongs on Research');
    assert.equal(research.split(text(INTERESTS.perspective.text)).length - 1, 1);
    const introduction = research.match(/<section class="wrap page-head">(.*?)<nav class="page-head__nav"/s)?.[1];
    assert.ok(introduction?.includes('id="quantumagi"'), 'The outlook introduces Research before its topic navigation');
    assert.equal((introduction.match(/<p\b/g) || []).length, 1, 'Research needs one introduction, not stacked summaries');
    assert.doesNotMatch(introduction, /<h2|Toward QuantumAGI|Quantum algorithms, learning from physical systems/);
    assert.ok(research.indexOf('id="quantumagi"') < research.indexOf('class="research-feature"'));
  }
  assert.match(html, /class="home-current__invitation"/);
  assert.ok(html.includes(`<a href="#contact">${text(INTERESTS.contactLabel)}</a>`));
  assert.equal((html.match(/<span class="news-date">/g) || []).length, Math.min(5, NEWS.length));
  assert.ok(NEWS.length > 5, "Historic news remains in source");
  assert.ok(html.includes(text(SITE.biography)));
  assert.match(html,/id="current-interests"/);
  assert.doesNotMatch(html,/ink-space-nav|ink-hero-index|A few questions I’d like to work on/);
  assert.equal(html.split(text(INTERESTS.heading)).length - 1, 1);
  assert.doesNotMatch(html, /home-current__lead|home-current__context|home-current__evidence/);
  if (INTERESTS.community) {
    const communityParagraph = html.match(/<p class="home-community">(.*?)<\/p>/s)?.[1];
    assert.ok(communityParagraph, 'community work is a supporting paragraph, not a peer topic heading');
    assert.equal(communityParagraph.replace(/<[^>]*>/g, ''), text(INTERESTS.community.text));
    assert.equal(html.split(`href="${text(INTERESTS.community.href)}"`).length - 1, 1, 'community project is not repeated among topic links');
    assert.ok(html.indexOf('class="home-community"') > html.indexOf('class="home-current__topics"'));
    assert.ok(html.indexOf('class="home-community"') < html.indexOf('class="home-current__invitation"'));
  }
  const featuredTopics = INTERESTS.topics.filter(topic => topic.showOnHome !== false);
  assert.equal((html.match(/class="home-current__topic"/g) || []).length, featuredTopics.length);
  for(const topic of featuredTopics) {
    assert.ok(html.includes(text(topic.homeSummary || topic.description)), `Missing homepage topic: ${topic.id}`);

    assert.ok(html.includes(`href="${topic.researchHref || "/research/"}"`));
    assert.ok(html.includes(`id="${topic.id}"`));
  }
  assert.match(html, /class="email-link home-contact__email"/);
  const aboutText = html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ");
  for (const item of NEWS.slice(0, 5)) {
    assert.ok(html.includes(text(item.dateLabel)));
    const content = item.content.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replaceAll("**", "");
    assert.ok(aboutText.includes(text(content)), `Missing news text: ${content}`);
    for (const match of item.content.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)) assert.ok(html.includes(`href="${text(match[2])}"`));
  }
  for (const category of LIBRARY.categories) for (const group of category.groups) for (const item of group.items) assert.ok(library.includes(text(item.title)), `Missing library item: ${item.title}`);
  for (const section of CV.sections) for (const item of section.items) assert.ok(cv.includes(text(item.title)), `Missing CV item: ${item.title}`);
});

test("saved interest links reach the homepage agenda and existing anchors stay native", async () => {
  const script = await readFile(new URL("../assets/ink-explorer.js", import.meta.url), "utf8");
  for (const [hash, expected] of [["#interests", "/#current-interests"], ["#scientific-agents", "/#scientific-agents"], ["#ai-quantum-design", "/#scientific-agents"], ["#quantum-algorithms-learning", "/#quantum-algorithms-learning"], ["#papers", "/publications/"], ["#reading", "/library/"], ["#about", null], ["#contact", null], ["#news", null], ["#content", null], ["#%E0%A4%A", null]]) {
    let destination = null;
    vm.runInNewContext(script, { location: { hash, replace(value) { destination = value; } }, document:{getElementById:()=>null},window:{addEventListener(){}} });
    assert.equal(destination, expected);
    if(expected?.startsWith('/#')) assert.ok(html.includes(`id="${expected.slice(2)}"`),'redirect target exists on Home');
  }
  for(const id of ['scientific-agents','quantum-algorithms-learning','current-interests']) {
    let destination=null;
    vm.runInNewContext(script,{location:{hash:`#${id}`,replace(value){destination=value;}},document:{getElementById:key=>key===id?{}:null},window:{addEventListener(){}}});
    assert.equal(destination,null,'native homepage anchors must not cause a redirect loop');
  }
});

test("legacy interest bookmarks also resolve after hash navigation", async () => {
  const script = await readFile(new URL('../assets/ink-explorer.js', import.meta.url), 'utf8');
  const handlers={},location={hash:'#agents-for-science',replace(value){this.destination=value;}};
  vm.runInNewContext(script,{location,document:{getElementById:()=>null},window:{addEventListener:(event,callback)=>{handlers[event]=callback;}}});
  assert.equal(location.destination,undefined,'current Research anchors stay on Research');
  location.hash='#interests';handlers.hashchange();assert.equal(location.destination,'/#current-interests');
  location.hash='#%E0%A4%A';assert.doesNotThrow(handlers.hashchange);
});


test("navigation shares destinations and About redirects preserve home anchors", async () => {
  const expected = ["/research/", "/publications/", "/library/", "/cv/", "/#contact"];
  for (const page of ["", "research/", "publications/", "library/", "cv/"]) {
    const source = await readFile(new URL(`../${page}index.html`, import.meta.url), "utf8");
    for (const pattern of [/class="ink-nav"[^>]*>(.*?)<\/nav>/s, /aria-label="Mobile navigation">(.*?)<\/nav>/s]) {
      const nav = source.match(pattern)[1];
      assert.deepEqual([...nav.matchAll(/href="([^"]+)"/g)].map(match => match[1]), expected);
    }
    assert.doesNotMatch(source, /href="\/about\//);
  }
  const redirect = await readFile(new URL("../about/index.html", import.meta.url), "utf8");
  const script = redirect.match(/<script>(.*?)<\/script>/s)[1];
  for (const [hash, target] of [["", "/#about"], ["#background", "/#about"], ["#contact", "/#contact"], ["#news", "/#news"]]) {
    let destination;
    vm.runInNewContext(script, {location: {hash, replace(url) {destination = url;}}});
    assert.equal(destination, target);
  }
});

// The same original scene renderer is used at build time and by range controls.
test('research scenes react to the parameter and remain accessible without scripts', async () => {
  const {renderScene,sceneSpecs}=await import('../assets/research-scenes.js');
  for (const [kind,spec] of Object.entries(sceneSpecs)) {
    const first=renderScene(kind,spec.min),last=renderScene(kind,spec.max);
    assert.notEqual(first,last,`${kind} parameter must change its illustration`);
    assert.match(first,/role="img" aria-label="[^"]+"/);
    assert.doesNotMatch(first,/NaN|undefined|Infinity|<script|<text\b|<foreignObject\b/);
    // Animation morphs attributes without replacing the SVG or changing its topology.
    for(const value of Array.from({length:101},(_,i)=>i)) {
      const frame=renderScene(kind,value);
      assert.deepEqual(frame.match(/<\w+/g),first.match(/<\w+/g),`${kind}: stable SVG topology at ${value}`);
      assert.doesNotMatch(frame,/NaN|undefined|Infinity/);
    }
  }
  const research=await readFile(new URL('../research/index.html',import.meta.url),'utf8');
  assert.equal((research.match(/data-research-diagram/g)||[]).length,3);
  assert.equal((research.match(/<svg class="research-scene-svg"/g)||[]).length,3,'one coherent scene per topic');
  assert.equal((research.match(/type="range"/g)||[]).length,3);
  assert.equal((research.match(/class="explain-step"/g)||[]).length,9);
  for(const spec of Object.values(sceneSpecs)) for(const [label,description] of spec.steps) {
    assert.ok(research.includes(label));
    assert.ok(research.includes(description));
  }
});

test('research motion starts on entry, preserves manual choices and respects visibility and reduced motion', async () => {
  const {renderScene,sceneSpecs}=await import('../assets/research-scenes.js');
  const source=(await readFile(new URL('../assets/research-diagrams.js',import.meta.url),'utf8')).replace('const {renderScene,sceneSpecs}=await import(moduleURL);','');
  function harness(kind='quantum', reducedMotion=false) {
    const events={},windowEvents={},buttonEvents={},inputEvents={},mediaEvents={};
    let tick=null,observe,observed;
    const input={value:0,setAttribute(){},addEventListener(k,fn){inputEvents[k]=fn;}};
    const output={value:''};
    const play={hidden:true,setAttribute(){},addEventListener(k,fn){buttonEvents[k]=fn;}};
    const controls={hidden:true,querySelector:s=>s==='input'?input:output};
    const stepNodes=Array.from({length:3},()=>({active:'false',getAttribute(){return this.active;},setAttribute(name,value){if(name==='data-active')this.active=value;}}));
    const svg={};
    const art={querySelector:()=>svg,querySelectorAll:selector=>['*','[data-live],[data-live] *'].includes(selector)?stepNodes:[]};
    const figure={dataset:{kind},querySelector:s=>({'[data-diagram-play]':play,'.diagram-controls':controls,'.diagram-art':art})[s]};
    const reduced={matches:reducedMotion,addEventListener(k,fn){mediaEvents[k]=fn;}};
    const document={hidden:false,querySelector:()=>({dataset:{sceneModule:'fixture'}}),querySelectorAll:()=>[figure],createElement:()=>{let markup='';return {set innerHTML(value){markup=value;},content:{querySelectorAll:selector=>['*','[data-live],[data-live] *'].includes(selector)?[...markup.matchAll(/class="explain-step" data-active="(true|false)"/g)].map(m=>({attributes:[{name:'data-active',value:m[1]}]})):[]}};},addEventListener(k,fn){events[k]=fn;}};
    vm.runInNewContext(source,{renderScene,sceneSpecs,document,matchMedia:()=>reduced,window:{addEventListener(k,fn){windowEvents[k]=fn;}},IntersectionObserver:class{constructor(fn){observe=fn;}observe(target){observed=target;}},setInterval(fn){tick=fn;return 1;},clearInterval(){tick=null;}});
    assert.equal(observed,svg,'observe the artwork, rather than captions below it');
    return {input,output,play,controls,stepNodes,document,reduced,events,windowEvents,mediaEvents,
      get tick(){return tick;},
      enter(ratio=1){observe([{isIntersecting:ratio>0,intersectionRatio:ratio}]);},
      scrub(value){input.value=value;inputEvents.input();},
      toggle(){buttonEvents.click();}
    };
  }
  for(const [kind,spec] of Object.entries(sceneSpecs)) {
    const h=harness(kind);
    assert.equal(Number(h.input.value),spec.value,'meaningful static preview before first playback');
    assert.equal(h.tick,null,'offscreen scenes do not run');
    h.enter(.1);assert.equal(h.tick,null,'a sliver of visible artwork is not enough');
    h.enter();assert.equal(Number(h.input.value),spec.min,'first playback begins at the first stage');
    h.tick();assert.equal(Number(h.input.value),spec.min+spec.step);
    h.enter(.14);assert.equal(h.tick,null,'pause below the visibility threshold');
    h.enter();assert.equal(Number(h.input.value),spec.min+spec.step,'returning resumes in place');
  }
  const h=harness();
  h.enter();
  h.scrub(100);assert.equal(h.tick,null,'manual input pauses autoplay');
  assert.deepEqual(h.stepNodes.map(n=>n.active),['false','false','true'],'the outside caption follows the scene stage');
  h.toggle();for(let i=0;i<19;i++)h.tick();assert.equal(Number(h.input.value),100);
  h.tick();assert.equal(Number(h.input.value),0,'restart, rather than reverse dissipative time');
  assert.deepEqual(h.stepNodes.map(n=>n.active),['true','false','false'],'restart also restores the first caption');
  h.tick();assert.equal(Number(h.input.value),1);
  h.toggle();assert.equal(h.tick,null,'explicit pause stops playback');
  h.enter(0);h.enter();assert.equal(h.tick,null,'scrolling does not override explicit pause');
  h.toggle();assert.equal(Number(h.input.value),1,'Play resumes the chosen point');
  h.document.hidden=true;h.events.visibilitychange();assert.equal(h.tick,null);
  h.document.hidden=false;h.events.visibilitychange();assert.ok(h.tick);
  h.windowEvents.beforeprint();assert.equal(h.tick,null);h.windowEvents.afterprint();assert.ok(h.tick);
  h.reduced.matches=true;h.mediaEvents.change();assert.equal(h.tick,null);assert.equal(h.play.disabled,true);
  h.scrub(70);assert.equal(h.output.value,'Read out the answer','manual exploration still works with reduced motion');
  const manual=harness();manual.scrub(64);manual.enter();
  assert.equal(manual.tick,null,'scrubbing before first entry keeps playback paused');
  manual.toggle();assert.equal(Number(manual.input.value),64,'first Play respects a manually chosen point');
  manual.tick();assert.equal(Number(manual.input.value),65);
  const still=harness('learning',true);still.enter();
  assert.equal(still.tick,null);assert.equal(still.play.disabled,true);
  assert.equal(Number(still.input.value),sceneSpecs.learning.value,'reduced motion keeps the informative static preview');
});
