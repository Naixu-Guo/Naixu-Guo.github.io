import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { loadSiteData, publicationYear } from "./content.mjs";
import { homeInterests } from "./ink-home.mjs";
import { researchDiagram } from "./research-diagrams.mjs";
import { buildIcons } from "./build-icons.mjs";

const root = process.cwd();
await buildIcons(root);
const baseUrl = "https://naixu-guo.github.io";
const APPEARANCES = JSON.parse(await readFile(path.join(root, "assets/appearances.json"), "utf8"));
const assetUrls = Object.fromEntries(await Promise.all(
  ["style.css", "ink.css", "game.css", "appearance.css", "site.js", "ink-explorer.js", "research-diagrams.css", "research-diagrams.js", "research-scenes.js", "home-interests.css", "mark.svg", "favicon-32.png", "apple-touch-icon.png"].map(async (name) => {
    const content = await readFile(path.join(root, "assets", name));
    const version = createHash("sha256").update(content).digest("hex").slice(0, 12);
    return [name, `/assets/${name}?v=${version}`];
  }),
));
const faviconVersion = createHash("sha256").update(await readFile(path.join(root, "favicon.ico"))).digest("hex").slice(0, 12);

const { SITE, NEWS, INTERESTS, PUBLICATIONS, RESEARCH, CV, LIBRARY, POLICY } = await loadSiteData(root);
const year = new Date().getFullYear();

/* ---------- helpers ---------- */

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function slugify(value = "") {
  return String(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function safeHref(value = "") {
  return /^(https?:|mailto:)/.test(value) ? escapeHtml(value) : "#";
}

function ext(label, href, className = "") {
  const cls = className ? ` class="${escapeHtml(className)}"` : "";
  return `<a${cls} href="${safeHref(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`;
}

/** Inline markup for data strings: **bold** and [text](url). */
function renderInline(value = "") {
  const pattern = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  let cursor = 0;
  let output = "";
  for (const match of value.matchAll(pattern)) {
    output += escapeHtml(value.slice(cursor, match.index));
    const token = match[0];
    if (token.startsWith("**")) {
      output += `<strong>${escapeHtml(token.slice(2, -2))}</strong>`;
    } else {
      const parts = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (parts) output += ext(parts[1], parts[2]);
    }
    cursor = match.index + token.length;
  }
  return output + escapeHtml(value.slice(cursor));
}

function findPublication(id) {
  const publication = PUBLICATIONS.find((item) => item.id === id);
  if (!publication) throw new Error(`Unknown publication referenced: ${id}`);
  return publication;
}

function paperHref(publication) {
  if (publication.arxiv) return `https://arxiv.org/abs/${publication.arxiv}`;
  if (publication.journalLink) return publication.journalLink;
  throw new Error(`Publication has no link: ${publication.title}`);
}

function venueLine(publication) {
  const venue = publication.venue || "";
  return venue.includes(String(publication.year)) ? venue : `${venue}, ${publication.year}`;
}

/* ---------- motifs: thin-line figures drawn from the research itself ---------- */

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const f = (n) => Number(n.toFixed(1));

function svgWrap(width, height, inner, className = "motif") {
  return `<svg class="${className}" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" aria-hidden="true" focusable="false">${inner}</svg>`;
}

/** A soft halo behind a node: the one luminous detail in the figures. */
function glowDefs(id) {
  return `<defs><radialGradient id="${id}"><stop offset="0" style="stop-color:var(--glow)" stop-opacity="0.5"/><stop offset="0.55" style="stop-color:var(--glow)" stop-opacity="0.12"/><stop offset="1" style="stop-color:var(--glow)" stop-opacity="0"/></radialGradient></defs>`;
}
function glowNode(x, y, id, { halo = 16, core = 2.2 } = {}) {
  return `<circle cx="${x}" cy="${y}" r="${halo}" fill="url(#${id})"/><circle cx="${x}" cy="${y}" r="${core}" fill="currentColor"/>`;
}


/** A lattice with local couplings. Marked sites are the ones a learner probes. */
function latticeMotif({ cols = 8, rows = 6, step = 30, bonds = 0.6, marked = [], seed = 11, pad = 10, className, glow = "" } = {}) {
  const rand = rng(seed);
  const width = pad * 2 + (cols - 1) * step;
  const height = pad * 2 + (rows - 1) * step;
  const at = (c, r) => [pad + c * step, pad + r * step];
  let lines = "";
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const [x, y] = at(c, r);
      if (c + 1 < cols && rand() < bonds) lines += `<line x1="${x}" y1="${y}" x2="${x + step}" y2="${y}"/>`;
      if (r + 1 < rows && rand() < bonds) lines += `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + step}"/>`;
    }
  }
  let dots = "";
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const [x, y] = at(c, r);
      dots += `<circle cx="${x}" cy="${y}" r="1.5"/>`;
    }
  }
  const marks = marked
    .map(([c, r]) => {
      const [x, y] = at(c, r);
      return glow
        ? glowNode(x, y, glow, { halo: 14, core: 2.4 })
        : `<circle cx="${x}" cy="${y}" r="5" fill="none" stroke="currentColor" stroke-width="1"/><circle cx="${x}" cy="${y}" r="2.4"/>`;
    })
    .join("");
  const inner = `${glow ? glowDefs(glow) : ""}<g stroke="currentColor" stroke-width="0.8" stroke-opacity="0.55" fill="none">${lines}</g><g fill="currentColor" fill-opacity="0.85">${dots}</g><g fill="currentColor">${marks}</g>`;
  return svgWrap(width, height, inner, className);
}

/** Trajectories of a dissipative linear flow spiralling into its fixed point. */
function flowMotif({ width = 220, height = 170 } = {}) {
  const cx = width / 2;
  const cy = height / 2;
  const scale = Math.min(width, height) / 2 - 12;
  const damping = 0.3;
  const rotation = 1.2;
  const count = 7;
  let paths = "";
  for (let k = 0; k < count; k += 1) {
    const theta = (k / count) * Math.PI * 2;
    let x = Math.cos(theta);
    let y = Math.sin(theta);
    const points = [];
    for (let t = 0; t < 7.5; t += 0.04) {
      points.push(`${f(cx + x * scale)},${f(cy + y * scale)}`);
      const dx = -damping * x - rotation * y;
      const dy = rotation * x - damping * y;
      x += dx * 0.04;
      y += dy * 0.04;
    }
    paths += `<polyline points="${points.join(" ")}"/>`;
  }
  const inner = `${glowDefs("flow-glow")}<g fill="none" stroke="currentColor" stroke-width="0.8" stroke-opacity="0.7" stroke-linejoin="round">${paths}</g>${glowNode(cx, cy, "flow-glow", { halo: 18, core: 2.4 })}`;
  return svgWrap(width, height, inner);
}

/** A polynomial approximation to a step, the shape behind singular value transformation. */
function polynomialMotif({ width = 220, height = 150 } = {}) {
  const pad = 16;
  const cx = width / 2;
  const cy = height / 2;
  const sx = (width - 2 * pad) / 2;
  const sy = (height - 2 * pad) / 2;
  const points = [];
  for (let x = -1; x <= 1.0001; x += 0.01) {
    const y = Math.tanh(6 * x) + 0.06 * Math.sin(14 * x) * Math.exp(-4 * x * x);
    points.push(`${f(cx + x * sx)},${f(cy - y * sy)}`);
  }
  const step = `<polyline points="${f(cx - sx)},${f(cy + sy)} ${cx},${f(cy + sy)} ${cx},${f(cy - sy)} ${f(cx + sx)},${f(cy - sy)}" stroke-dasharray="2 3" stroke-opacity="0.5"/>`;
  const ticks = [-0.86, -0.62, -0.4, -0.18, 0.12, 0.34, 0.58, 0.8, 0.94]
    .map((x) => `<line x1="${f(cx + x * sx)}" y1="${cy - 3}" x2="${f(cx + x * sx)}" y2="${cy + 3}"/>`)
    .join("");
  const axis = `<line x1="${f(cx - sx)}" y1="${cy}" x2="${f(cx + sx)}" y2="${cy}" stroke-opacity="0.35"/>`;
  const inner = `<g fill="none" stroke="currentColor" stroke-width="0.8">${axis}${step}<g stroke-opacity="0.8">${ticks}</g><polyline points="${points.join(" ")}" stroke-width="1.1" stroke-linejoin="round"/></g>`;
  return svgWrap(width, height, inner);
}

/** An evidence graph: a claim, its sources, and the checks that were run. */
function evidenceMotif({ width = 220, height = 160 } = {}) {
  const claim = [110, 26];
  const sources = [[42, 82], [110, 90], [178, 78]];
  const checks = [[76, 138], [146, 138]];
  const edges = [
    [sources[0], claim, false],
    [sources[1], claim, false],
    [sources[2], claim, true],
    [checks[0], sources[0], false],
    [checks[0], sources[1], false],
    [checks[1], sources[2], true],
    [checks[1], sources[1], false],
  ];
  const lines = edges
    .map(([a, b, strong]) => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"${strong ? ' stroke-opacity="1" stroke-width="1.2"' : ' stroke-opacity="0.5"'}/>`)
    .join("");
  const nodes =
    glowNode(claim[0], claim[1], "evidence-glow", { halo: 18, core: 4 }) +
    sources.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.8" fill="none" stroke="currentColor" stroke-width="1"/>`).join("") +
    checks.map(([x, y]) => `<rect x="${x - 3.5}" y="${y - 3.5}" width="7" height="7" fill="currentColor"/>`).join("");
  const inner = `${glowDefs("evidence-glow")}<g stroke="currentColor" stroke-width="0.8" fill="none">${lines}</g>${nodes}`;
  return svgWrap(width, height, inner);
}

const motifs = {
  flow: () => flowMotif(),
  lattice: () => latticeMotif({ cols: 7, rows: 5, step: 32, bonds: 1, marked: [[1, 1], [4, 3], [5, 1]], pad: 12, glow: "lattice-glow" }),
  polynomial: () => polynomialMotif(),
  evidence: () => evidenceMotif(),
};

/* ---------- shared chrome ---------- */

const routes = [
  { href: "/", label: "Home", key: "home" },
  { href: "/research/", label: "Research", key: "research" },
  { href: "/publications/", label: "Publications", key: "publications" },
  { href: "/cv/", label: "CV", key: "cv" },
  { href: "/library/", label: "Library", key: "library" },
];

const primaryNavigation = [
  ...["research", "publications", "library"].map(key => routes.find(route => route.key === key)),
  routes.find(route => route.key === "cv"),
  { href: "/#contact", label: "Contact", key: "contact" },
];

function header(active) {
  return `
  <header class="site-head">
    <div class="wrap site-head__row">
      <a class="site-name" href="/"${active === "home" ? ' aria-current="page"' : ""}>${escapeHtml(SITE.name)}<span class="ink-only ink-name-zh" lang="zh">${escapeHtml(SITE.nameZh)}</span></a>
      <nav class="ink-nav" aria-label="Primary">${primaryNavigation.map(route => `<a href="${route.href}"${route.key === active ? ' aria-current="page"' : ''}>${route.label}</a>`).join("")}</nav>
      <button class="ink-only ink-motion" type="button" data-motion-toggle aria-pressed="false" hidden>Motion off</button>
      <div class="theme-picker" data-theme-picker hidden>
        <button class="theme-picker__trigger" type="button" aria-label="Appearance: ${APPEARANCES[0].name}" title="Appearance: ${APPEARANCES[0].name}" aria-expanded="false" aria-controls="appearance-options">
          <svg class="appearance-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor" stroke="none"/></svg>
          <span class="visually-hidden" data-theme-name>${APPEARANCES[0].name}</span>
        </button>
        <fieldset class="theme-picker__options" id="appearance-options" hidden>
          <legend class="visually-hidden">Website appearance</legend>
          ${APPEARANCES.map(({id, name}) => `<label><input class="visually-hidden" type="radio" name="theme" value="${id}"${id === "ink" ? " checked" : ""}><span><span class="theme-picker__swatch theme-picker__swatch--${id}" aria-hidden="true">Aa</span><span class="theme-picker__label">${name}</span><svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m3 8 3 3 7-7"/></svg></span></label>`).join("")}
        </fieldset>
      </div>
      <details class="ink-menu"><summary><svg class="ink-menu-lines" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M4 8h16M4 16h16"/></svg><svg class="ink-menu-close-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>Menu</summary><nav aria-label="Mobile navigation">${primaryNavigation.map(({ href, label, key }) => `<a href="${escapeHtml(href)}"${key === active ? ' aria-current="page"' : ""}>${label}<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></a>`).join("")}</nav></details>
    </div>
  </header>`;
}

function emailControl(className = "") {
  const { local, domain } = SITE.email;
  const encoded = Buffer.from(`${local}@${domain}`, "utf8").toString("base64");
  const fallback = `${local} [at] ${domain.replaceAll(".", " [dot] ")}`;
  return `<button class="email-link ${className}" type="button" data-email="${encoded}" aria-label="Email Naixu Guo" hidden>Email</button><noscript><span class="email-fallback">${escapeHtml(fallback)}</span></noscript>`;
}

function contactLinks(className, labels = []) {
  const allItems = [{ label: "Email", isEmail: true }, ...SITE.links];
  const items = labels.length ? allItems.filter((item) => labels.includes(item.label)) : allItems;
  return `<ul class="${className}">${items
    .map((item) => `<li>${item.isEmail ? emailControl() : ext(item.label, item.href)}</li>`)
    .join("")}</ul>`;
}

function footer() {
  return `<footer class="site-foot"><div class="wrap site-foot__closing"><p>© ${year} ${escapeHtml(SITE.name)}</p><a href="#content">Back to top</a></div></footer>`;
}

const pageMeta = {
  home: {
    title: `${SITE.name}`,
    description: `${SITE.name} studies quantum computing and explores agents for science, including scientific reasoning, experiments, and verifiable results. PhD, National University of Singapore.`,
    path: "/",
  },
  research: {
    title: `Research · ${SITE.name}`,
    description: `Research interests of ${SITE.name}: quantum computing and agents for science, from quantum algorithms and learning to scientific investigation and evaluation.`,
    path: "/research/",
  },
  publications: {
    title: `Publications · ${SITE.name}`,
    description: `Papers and preprints by ${SITE.name} on quantum algorithms, learning quantum systems, open-system dynamics, and quantum machine learning.`,
    path: "/publications/",
  },
  cv: {
    title: `CV · ${SITE.name}`,
    description: `Education, awards, research visits, talks, and service of ${SITE.name}.`,
    path: "/cv/",
  },
  library: {
    title: `Library · ${SITE.name}`,
    description: `Books, lecture notes, and surveys ${SITE.name} returns to in quantum computing, machine learning, and mathematics.`,
    path: "/library/",
  },
  notFound: {
    title: `Page not found · ${SITE.name}`,
    description: "The requested page could not be found.",
    path: "/404.html",
  },
};

function layout({ active, body, meta, noindex = false, schema = "", bodyClass = "" }) {
  const canonical = `${baseUrl}${meta.path}`;
  return `<!doctype html>
<html lang="en" data-theme="ink">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(meta.title)}</title>
  <meta name="description" content="${escapeHtml(meta.description)}">
  ${noindex ? '<meta name="robots" content="noindex">' : ""}
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="${active === "home" ? "profile" : "website"}">
  <meta property="og:title" content="${escapeHtml(meta.title)}">
  <meta property="og:description" content="${escapeHtml(meta.description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${baseUrl}/assets/social-card.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${escapeHtml(SITE.name)}: ${escapeHtml(SITE.hero.title)} ${escapeHtml(SITE.institutionShort)}.">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="${APPEARANCES[0].color}">
  <link rel="icon" href="/favicon.ico?v=${faviconVersion}" type="image/x-icon" sizes="16x16 32x32 48x48">
  <link rel="icon" href="${assetUrls["favicon-32.png"]}" type="image/png" sizes="32x32">
  <link rel="icon" href="${assetUrls["mark.svg"]}" type="image/svg+xml" sizes="any">
  <link rel="apple-touch-icon" href="${assetUrls["apple-touch-icon.png"]}" sizes="180x180">
  <link rel="preload" href="/assets/fonts/hanken-grotesk-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/fonts/eb-garamond-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="${assetUrls["style.css"]}">
  <link rel="stylesheet" href="${assetUrls["ink.css"]}" data-ink-theme>
  <link rel="stylesheet" href="${assetUrls["game.css"]}" data-game-theme media="not all">
  <link rel="stylesheet" href="${assetUrls["appearance.css"]}">
  <script type="application/json" id="appearance-config">${JSON.stringify(APPEARANCES).replaceAll("<", "\\u003c")}</script>
  <script>{const legacy={"#/research":"/research/","#/publications":"/publications/","#/cv":"/cv/","#/library":"/library/"};if(legacy[location.hash])location.replace(legacy[location.hash]);const themes=JSON.parse(document.getElementById("appearance-config").textContent);let appearance=themes[0];try{const saved=localStorage.getItem("ng-appearance");appearance=themes.find(theme=>theme.id===saved)||themes[0]}catch(e){}document.documentElement.dataset.theme=appearance.id;document.querySelector("[data-ink-theme]").media=appearance.stylesheet==="ink"?"all":"not all";document.querySelector("[data-game-theme]").media=appearance.stylesheet==="base"?"all":"not all";document.querySelector('meta[name="theme-color"]').content=appearance.color}</script>
  ${schema}
  <script src="${assetUrls["site.js"]}" defer></script>
  ${["home", "research"].includes(active) ? `<script src="${assetUrls["ink-explorer.js"]}" defer></script>` : ""}
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ""}>
  <a class="skip-link" href="#content">Skip to content</a>
  ${header(active)}
  <main id="content">${body}</main>
  ${footer()}
</body>
</html>`;
}

/* ---------- home ---------- */

function homePage() {
  const personSchema = `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.name,
    alternateName: SITE.nameZh,
    url: `${baseUrl}/`,
    jobTitle: SITE.role,
    alumniOf: { "@type": "Organization", name: SITE.institution },
    knowsAbout: ["Quantum computing", "Agents for science", "Quantum algorithms", "Quantum learning theory", "Quantum machine learning", "Open quantum systems"],
    sameAs: SITE.links.map((link) => link.href),
  })}</script>`;

  const body = `
    <div class="home-intro">
    <section class="profile" aria-labelledby="home-title">
      <div class="ink-only ink-world" aria-hidden="true"></div>
      <div class="profile__geometry" aria-hidden="true"><span class="profile__star"></span><span class="profile__star profile__star--small"></span></div>
      <div class="wrap profile__stage">
        <div class="profile__identity">
          <h1 class="profile__name" id="home-title" aria-label="${escapeHtml(SITE.name)}">${SITE.name.split(" ").map((word) => `<span class="name-word" aria-hidden="true">${Array.from(word).map((letter) => `<span class="name-letter">${escapeHtml(letter)}</span>`).join("")}</span>`).join(" ")}</h1>
          <p class="profile__name-zh" lang="zh">${escapeHtml(SITE.nameZh)}</p>
        </div>
        <figure class="profile__portrait">
          <div class="profile__photo">
            <img src="/assets/portrait-800.jpg" srcset="/assets/portrait-400.jpg 400w, /assets/portrait-800.jpg 800w" sizes="(max-width: 640px) 42vw, (max-width: 1024px) 40vw, 380px" width="800" height="999" alt="Portrait of ${escapeHtml(SITE.name)}" fetchpriority="high" decoding="async">
          </div>
          <figcaption><strong>${escapeHtml(SITE.role)}</strong></figcaption>
        </figure>
        <p class="profile__subject">${SITE.hero.titleLines.map((line) => `<span>${escapeHtml(line)}</span>`).join("")}</p>
        <div class="profile__dialogue">
          <p class="ink-only ink-hero-intro">Quantum computing and AI<br><em>for scientific discovery.</em></p>
          <nav class="ink-hero-actions" aria-label="Research and academic profile"><a href="/research/">Explore research <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></a></nav>
        </div>
        <aside class="ink-only ink-inscription" lang="zh" aria-label="题句"><p>${SITE.hero.inscription.map(line => `<span>${escapeHtml(line)}</span>`).join("")}</p></aside>

      </div>
    </section>

    </div>

    <link rel="stylesheet" href="${assetUrls['home-interests.css']}">
    ${homeInterests({ INTERESTS, escapeHtml, ext })}
    <div class="home-personal">
      <div class="wrap home-personal__grid">
        <section class="home-biography" id="about" aria-labelledby="home-about-title">
          <h2 id="home-about-title">About <em>me</em></h2>
          <div class="home-biography__intro">
            <figure class="home-portrait"><img src="/assets/portrait-400.jpg" srcset="/assets/portrait-400.jpg 400w, /assets/portrait-800.jpg 800w" sizes="(max-width: 540px) 128px, 160px" width="800" height="999" alt="Portrait of Naixu Guo" loading="lazy" decoding="async"></figure>
            <div><p>${escapeHtml(SITE.biography)}</p></div>
          </div>
          <section class="home-contact" id="contact" aria-labelledby="home-contact-title">
            <h3 class="visually-hidden" id="home-contact-title">Contact</h3>
            ${emailControl("home-contact__email")}
            ${contactLinks("home-contact__links", ["Google Scholar", "arXiv", "GitHub", "LinkedIn"])}
          </section>
        </section>
        <section class="home-news" id="news" aria-labelledby="home-news-title">
          <h2 id="home-news-title">Recent <em>news</em></h2>
          <ol class="home-news__list">${NEWS.slice(0, POLICY.homeNewsLimit).map(item => `<li><span class="news-date">${escapeHtml(item.dateLabel)}</span><p>${renderInline(item.content)}</p></li>`).join("")}</ol>
        </section>
      </div>
    </div>

    `;

  return layout({ active: "home", body, meta: pageMeta.home, schema: personSchema, bodyClass: "is-home" });
}

/* ---------- research ---------- */

function researchPage() {
  const directions = RESEARCH.directions.map((direction, index) => {
    // A theme is illustrated by one representative work; Publications owns the full record.
    const visual = direction.visuals[0];
    const paper = findPublication(visual.publicationId);
    return `<article class="research-feature" id="${escapeHtml(direction.id)}" aria-labelledby="${escapeHtml(direction.id)}-title">
      <div class="research-feature__text"${direction.legacyId ? ` id="${escapeHtml(direction.legacyId)}"` : ''}>
        <h2 id="${escapeHtml(direction.id)}-title">${escapeHtml(direction.title)}</h2>
        <p>${escapeHtml(direction.visualSummary || direction.summary)}</p>
      </div>
      <figure class="research-feature__figure">
        ${researchDiagram(direction.id, escapeHtml)}
        <figcaption><span>${escapeHtml(direction.question)}</span></figcaption>
      </figure>
      <p class="research-feature__sources"><span>${escapeHtml(visual.label)}</span>${ext('Read paper', paperHref(paper))}${visual.demoLink ? ext('Explore QIQCBench demos', visual.demoLink) : ''}${paper.figure ? `<a href="${escapeHtml(paper.figure)}" target="_blank" rel="noopener noreferrer">Original figure</a>` : ""}</p>
    </article>`;
  }).join('');
  const body = `
    <link rel="stylesheet" href="${assetUrls['research-diagrams.css']}">
    <section class="wrap page-head">
      <h1>Research</h1>
      ${INTERESTS.perspective ? `<p class="research-summary" id="quantumagi">${escapeHtml(INTERESTS.perspective.text)}</p>` : ''}
      <nav class="page-head__nav" aria-label="Research directions">${RESEARCH.directions.map(direction => `<a href="#${escapeHtml(direction.id)}">${escapeHtml(direction.title)}</a>`).join('')}</nav>
    </section>
    <div class="wrap research-body">${directions}
      <p class="research-close"><a href="/publications/">All publications &amp; preprints</a></p>
    </div>
    <script type="module" src="${assetUrls['research-diagrams.js']}" data-scene-module="${assetUrls['research-scenes.js']}"></script>`;
  return layout({ active: "research", body, meta: pageMeta.research, bodyClass: "is-research" });
}

/* ---------- publications ---------- */

function publicationLinks(publication) {
  const links = [ext("Paper", paperHref(publication))];
  if (publication.code) links.push(ext("Code", publication.code));
  if (publication.media) links.push(ext(publication.media.label, publication.media.href));
  return `<p class="pub__links">${links.join("")}</p>`;
}

function publicationsPage() {
  const byYear = new Map();
  for (const publication of PUBLICATIONS) {
    const firstYear = publicationYear(publication);
    if (!byYear.has(firstYear)) byYear.set(firstYear, []);
    byYear.get(firstYear).push(publication);
  }
  const years = Array.from(byYear.keys()).sort((a, b) => b - a);
  const scholar = SITE.links.find((link) => link.label === "Google Scholar");
  const arxiv = SITE.links.find((link) => link.label === "arXiv");

  const body = `
    <section class="wrap page-head">
      <h1>Publications</h1>
      <p>Papers and preprints, ordered by first arXiv submission. Also on ${ext("arXiv", arxiv.href)} and ${ext("Google Scholar", scholar.href)}.</p>
      <nav class="page-head__nav" aria-label="Publication years">${years.map(y => `<a href="#year-${y}">${y}</a>`).join("")}</nav>
    </section>
    <section class="wrap">
      ${years
        .map(
          (y) => `
      <section class="pub-year" aria-labelledby="year-${y}">
        <h2 id="year-${y}">${y}</h2>
        <ol class="pubs">
          ${byYear
            .get(y)
            .map(
              (publication) => `
          <li class="pub${publication.selected ? " pub--selected" : ""}${publication.figure ? " pub--illustrated" : ""}">
            ${publication.figure ? `<a class="pub__figure" data-figure-surface="${publication.figureSurface || "paper"}" href="${escapeHtml(publication.figure)}" target="_blank" rel="noopener noreferrer" aria-label="View figure for ${escapeHtml(publication.title)}"><img src="${escapeHtml(publication.figure)}" alt="Figure from ${escapeHtml(publication.title)}" loading="lazy" decoding="async"></a>` : ""}<div class="pub__body">
            <h3><a href="${safeHref(paperHref(publication))}" target="_blank" rel="noopener noreferrer">${escapeHtml(publication.title)}</a></h3>
            ${publication.formerTitle ? `<p class="pub__former">Earlier title: ${escapeHtml(publication.formerTitle)}</p>` : ""}
            <p class="pub__authors">${renderInline(publication.authors)}</p>
            <p class="pub__venue">${escapeHtml(venueLine(publication))}</p>
            ${publication.summary ? `<p class="pub__note">${escapeHtml(publication.summary)}</p>` : ""}
            ${publicationLinks(publication)}</div>
          </li>`,
            )
            .join("")}
        </ol>
      </section>`,
        )
        .join("")}
    </section>`;

  return layout({ active: "publications", body, meta: pageMeta.publications });
}

/* ---------- cv ---------- */

function cvPage() {
  const body = `
    <section class="wrap page-head cv-head">
      <div>
        <h1>Curriculum vitae</h1>
        <p>${escapeHtml(SITE.name)}, ${escapeHtml(SITE.role)}.</p>
        ${contactLinks("page-head__links")}
      </div>
      <button class="text-button" type="button" data-print>Print or save as PDF</button>
    </section>
    <section class="wrap">
      ${CV.sections
        .map(
          (section) => `
      <section class="cv-section" aria-labelledby="cv-${slugify(section.title)}">
        <h2 id="cv-${slugify(section.title)}">${escapeHtml(section.title)}</h2>
        <ol class="cv-rows">
          ${section.items
            .map(
              (item) => `
          <li class="cv-row">
            <span class="cv-row__date">${escapeHtml((item.date || "").replaceAll(" — ", "–"))}</span>
            <div>
              <p class="cv-row__title">${item.link ? ext(item.title, item.link) : escapeHtml(item.title)}</p>
              ${item.org ? `<p class="cv-row__org">${escapeHtml(item.org)}</p>` : ""}
              ${item.detail ? `<p class="cv-row__detail">${escapeHtml(item.detail)}</p>` : ""}
            </div>
          </li>`,
            )
            .join("")}
        </ol>
      </section>`,
        )
        .join("")}
    </section>`;

  return layout({ active: "cv", body, meta: pageMeta.cv, bodyClass: "is-cv" });
}

/* ---------- library ---------- */

const typeLabels = { book: "Book", notes: "Lecture notes", survey: "Survey", collection: "Collection", paper: "Paper" };

function libraryItem(item) {
  const label = typeLabels[item.type] || item.type || "";
  return `
            <li class="lib-item">
              <a href="${safeHref(item.link)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.title)}</a>
              <span class="lib-item__meta">${item.author ? `${escapeHtml(item.author)}` : ""}${item.author && label ? " · " : ""}${escapeHtml(label)}</span>
              ${item.note ? `<p class="lib-item__note">${escapeHtml(item.note)}</p>` : ""}
            </li>`;
}

function libraryPage() {
  const body = `
    <section class="wrap page-head">
      <h1>Library</h1>
      <p>${escapeHtml(LIBRARY.intro)}</p>
      <nav class="page-head__nav" aria-label="Sections">${LIBRARY.categories
        .map((category) => `<a href="#library-${slugify(category.title)}">${escapeHtml(category.title)}</a>`)
        .join("")}</nav>
    </section>
    <section class="wrap">
      ${LIBRARY.categories
        .map((category) => {
          const id = `library-${slugify(category.title)}`;
          return `
      <section class="lib-cat" id="${id}" aria-labelledby="${id}-title">
        <div class="lib-cat__aside">
          <h2 id="${id}-title">${escapeHtml(category.title)}</h2>
          <p>${escapeHtml(category.description)}</p>
        </div>
        <div class="lib-groups">
          ${category.groups
            .map(
              (group) => `
          <section class="lib-group">
            <h3>${escapeHtml(group.title)}</h3>
            <ul>${group.items.map(libraryItem).join("")}</ul>
          </section>`,
            )
            .join("")}
        </div>
      </section>`;
        })
        .join("")}
    </section>`;

  return layout({ active: "library", body, meta: pageMeta.library });
}

/* ---------- about and complete news archive ---------- */

function aboutRedirect() {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>About · ${escapeHtml(SITE.name)}</title><link rel="canonical" href="${baseUrl}/#about">
<meta http-equiv="refresh" content="0; url=/#about">
<script>location.replace(["#contact", "#news"].includes(location.hash) ? "/" + location.hash : "/#about")</script>
</head><body><h1>About ${escapeHtml(SITE.name)}</h1><p><a href="/#about">About me</a> is now on the homepage.</p></body></html>`;
}

/* ---------- 404 and redirects ---------- */

function notFoundPage() {
  const body = `
    <section class="wrap page-head not-found">
      <h1>Page not found</h1>
      <p>Nothing lives at this address. The <a href="/">homepage</a> and the <a href="/publications/">publications page</a> are the places to start.</p>
    </section>`;
  return layout({ active: "", body, meta: pageMeta.notFound, noindex: true });
}

function legacyLibraryRedirect() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="refresh" content="0; url=/library/">
  <link rel="canonical" href="${baseUrl}/library/">
  <title>Library · ${escapeHtml(SITE.name)}</title>
  <script>location.replace("/library/")</script>
</head>
<body><p>This page moved to <a href="/library/">the library</a>.</p></body>
</html>`;
}

/* ---------- write ---------- */

async function write(relativePath, contents) {
  const destination = path.join(root, relativePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, contents.replace(/^[\t ]+$/gm, "").replace(/\n{3,}/g, "\n\n"), "utf8");
}

await Promise.all([
  write("index.html", homePage()),
  write("research/index.html", researchPage()),
  write("publications/index.html", publicationsPage()),
  write("cv/index.html", cvPage()),
  write("library/index.html", libraryPage()),
  write("about/index.html", aboutRedirect()),
  write("404.html", notFoundPage()),
  write("mini_lib/index.html", legacyLibraryRedirect()),
  write("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${baseUrl}/sitemap.xml\n`),
  write(
    "sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((route) => `  <url><loc>${baseUrl}${route.href}</loc></url>`).join("\n")}\n</urlset>\n`,
  ),
]);

console.log(`Built ${routes.length} pages and a 404 page from content/.`);
