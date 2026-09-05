import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const baseUrl = "https://naixu-guo.github.io";
const dataFiles = ["home.js", "publications.js", "research.js", "cv.js", "library.js"];

globalThis.window = {};
for (const file of dataFiles) {
  const url = pathToFileURL(path.join(root, "src", "data", file));
  await import(`${url.href}?build=${Date.now()}`);
}

const { SITE, NEWS, PUBLICATIONS, RESEARCH, CV, LIBRARY } = globalThis.window;
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

function findPublication(title) {
  const publication = PUBLICATIONS.find((item) => item.title === title);
  if (!publication) throw new Error(`Unknown publication referenced: ${title}`);
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

/** The homepage field: structure that thickens from left to right, a few luminous sites, one faint circle. */
function heroField({ cols = 17, rows = 11, step = 40, seed = 5, pad = 8 } = {}) {
  const rand = rng(seed);
  const width = pad * 2 + (cols - 1) * step;
  const height = pad * 2 + (rows - 1) * step;
  const at = (c, r) => [pad + c * step, pad + r * step];
  const density = (c) => 0.08 + 0.92 * Math.pow(c / (cols - 1), 1.6);
  let lines = "";
  let dots = "";
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const [x, y] = at(c, r);
      const d = density(c);
      if (rand() < d) dots += `<circle cx="${x}" cy="${y}" r="1.4" fill-opacity="${f(0.35 + 0.55 * d)}"/>`;
      if (c + 1 < cols && rand() < d * 0.75) lines += `<line x1="${x}" y1="${y}" x2="${x + step}" y2="${y}" stroke-opacity="${f(0.25 + 0.45 * d)}"/>`;
      if (r + 1 < rows && rand() < d * 0.75) lines += `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + step}" stroke-opacity="${f(0.25 + 0.45 * d)}"/>`;
    }
  }
  const glows = [[9, 4], [12, 7], [14, 3], [11, 9], [15, 6], [7, 6]]
    .map(([c, r]) => glowNode(...at(c, r), "hero-glow", { halo: 22, core: 2 }))
    .join("");
  const [ox, oy] = at(11, 5);
  const circle = `<circle cx="${ox}" cy="${oy}" r="${step * 4.5}" fill="none" stroke="currentColor" stroke-width="0.7" stroke-opacity="0.28"/><circle cx="${ox}" cy="${oy}" r="${step * 2.2}" fill="none" stroke="currentColor" stroke-width="0.7" stroke-opacity="0.2"/>`;
  const inner = `${glowDefs("hero-glow")}${circle}<g stroke="currentColor" stroke-width="0.8" fill="none">${lines}</g><g fill="currentColor">${dots}</g>${glows}`;
  return svgWrap(width, height, inner, "hero__field");
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

const themeIcon = `<svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M8 1.75a6.25 6.25 0 0 1 0 12.5z" fill="currentColor"/></svg>`;

function header(active) {
  const links = routes
    .filter((route) => route.key !== "home")
    .map((route) => `<a href="${route.href}"${route.key === active ? ' aria-current="page"' : ""}>${route.label}</a>`)
    .join("");
  return `
  <header class="site-head">
    <div class="wrap site-head__row">
      <a class="site-name" href="/">${escapeHtml(SITE.name)}</a>
      <nav class="site-nav" aria-label="Primary">${links}</nav>
      <button class="theme-toggle" type="button" aria-label="Switch to dark theme" data-theme-toggle>${themeIcon}</button>
    </div>
  </header>`;
}

function contactLinks(className) {
  const items = [{ label: "Email", href: `mailto:${SITE.email}` }, ...SITE.links];
  return `<ul class="${className}">${items
    .map((item) => `<li>${item.href.startsWith("mailto:") ? `<a href="${safeHref(item.href)}">${escapeHtml(item.label)}</a>` : ext(item.label, item.href)}</li>`)
    .join("")}</ul>`;
}

function footer() {
  return `
  <footer class="site-foot">
    <div class="wrap">
      <div class="site-foot__row">
        <p><strong>${escapeHtml(SITE.name)}</strong> <span lang="zh">${escapeHtml(SITE.nameZh)}</span><br>${escapeHtml(SITE.identity)}<br>${escapeHtml(SITE.institution)}</p>
        ${contactLinks("site-foot__links")}
      </div>
      <p class="site-foot__meta">© ${year} ${escapeHtml(SITE.name)}</p>
    </div>
  </footer>`;
}

const pageMeta = {
  home: {
    title: `${SITE.name}`,
    description: `${SITE.name} designs quantum algorithms that use open-system dynamics as a computational resource and studies learning quantum systems from limited access. ${SITE.institutionShort}.`,
    path: "/",
  },
  research: {
    title: `Research · ${SITE.name}`,
    description: `The research program of ${SITE.name}: open-system dynamics as a computational resource, learning quantum systems from limited access, quantum linear algebra for machine learning, and verifiable AI for research.`,
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
<html lang="en">
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
  <meta property="og:image" content="${baseUrl}/assets/portrait-800.jpg">
  <meta property="og:image:alt" content="Portrait of ${escapeHtml(SITE.name)}">
  <meta name="twitter:card" content="summary">
  <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fafbfc">
  <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0f1215">
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,400;0,500;0,600;1,400&amp;display=swap">
  <link rel="stylesheet" href="/assets/style.css">
  <script>try{const legacy={"#/research":"/research/","#/publications":"/publications/","#/cv":"/cv/","#/library":"/library/"};if(legacy[location.hash])location.replace(legacy[location.hash]);const t=localStorage.getItem("ng-theme")||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.dataset.theme=t}catch(e){}</script>
  ${schema}
  <script src="/assets/site.js" defer></script>
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

function directionRefs(direction, limit = 3) {
  const refs = direction.results.slice(0, limit).map((result) => findPublication(result.publication));
  if (!refs.length) return "";
  return `<p class="direction-item__refs">${refs
    .map((publication) => `<a href="${safeHref(paperHref(publication))}" target="_blank" rel="noopener noreferrer" title="${escapeHtml(publication.title)}">${escapeHtml(publication.short)}</a>`)
    .join("")}</p>`;
}

function homePage() {
  const recent = NEWS.slice(0, SITE.recentCount);
  const earlier = NEWS.slice(SITE.recentCount);

  const personSchema = `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.name,
    alternateName: SITE.nameZh,
    url: `${baseUrl}/`,
    email: `mailto:${SITE.email}`,
    jobTitle: SITE.role,
    affiliation: { "@type": "Organization", name: SITE.institution },
    knowsAbout: ["Quantum algorithms", "Open quantum systems", "Quantum learning theory", "Quantum machine learning", "AI for science"],
    sameAs: SITE.links.map((link) => link.href),
  })}</script>`;

  const streamItem = (item) => `<li><time>${escapeHtml(item.date)}</time><p>${renderInline(item.content)}</p></li>`;

  const body = `
    <section class="wrap hero">
      <h1 class="hero__statement">${escapeHtml(SITE.hero.statement)}</h1>
      <div class="hero__lead">${SITE.hero.lead.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}</div>
      <div class="hero__who">
        <p class="hero__name">${escapeHtml(SITE.name)} <span lang="zh">${escapeHtml(SITE.nameZh)}</span></p>
        <p class="hero__role">${escapeHtml(SITE.role)}, ${escapeHtml(SITE.institution)}. Advised by ${escapeHtml(SITE.advisors)}.</p>
        ${contactLinks("hero__links")}
      </div>
      <figure class="hero__portrait">
        <img src="/assets/portrait-800.jpg" srcset="/assets/portrait-400.jpg 400w, /assets/portrait-800.jpg 800w" sizes="(max-width: 720px) 88px, (max-width: 1024px) 220px, 300px" width="800" height="999" alt="Portrait of ${escapeHtml(SITE.name)}" fetchpriority="high" decoding="async">
      </figure>
      ${heroField()}
    </section>

    <section class="wrap cols section" aria-labelledby="research-title">
      <div class="cols__aside">
        <h2 id="research-title">Research</h2>
        <p>${escapeHtml(RESEARCH.homeFrame)}</p>
        <a class="more" href="/research/">The research program</a>
      </div>
      <ol class="directions">
        ${RESEARCH.directions
          .map(
            (direction) => `
        <li class="direction-item">
          <h3><a href="/research/#${escapeHtml(direction.id)}">${escapeHtml(direction.title)}</a></h3>
          <p>${escapeHtml(direction.summary)}</p>
          ${directionRefs(direction)}
        </li>`,
          )
          .join("")}
      </ol>
    </section>

    <section class="wrap cols section section--last" aria-labelledby="recent-title">
      <div class="cols__aside">
        <h2 id="recent-title">Recent</h2>
        <p>Papers, talks, and visits, most recent first.</p>
      </div>
      <div>
        <ol class="stream">${recent.map(streamItem).join("")}</ol>
        ${
          earlier.length
            ? `<details class="stream-more">
          <summary>Earlier</summary>
          <ol class="stream">${earlier.map(streamItem).join("")}</ol>
        </details>`
            : ""
        }
      </div>
    </section>`;

  return layout({ active: "home", body, meta: pageMeta.home, schema: personSchema, bodyClass: "is-home" });
}

/* ---------- research ---------- */

function researchPage() {
  const byId = new Map(RESEARCH.directions.map((direction, index) => [direction.id, { ...direction, number: index + 1 }]));

  const map = `
      <ol class="direction-map">
        ${RESEARCH.directions
          .map(
            (direction, index) => `
        <li><a href="#${escapeHtml(direction.id)}"><span class="direction-map__n">${index + 1}</span><span class="direction-map__t">${escapeHtml(direction.title)}</span><span class="direction-map__q">${escapeHtml(direction.question)}</span></a></li>`,
          )
          .join("")}
      </ol>`;

  const directions = RESEARCH.directions
    .map((direction, index) => {
      const results = direction.results.length
        ? `
          <ol class="results">
            ${direction.results
              .map((result) => {
                const publication = findPublication(result.publication);
                return `
            <li>
              <p class="results__claim">${escapeHtml(result.claim)}</p>
              <p class="results__detail">${escapeHtml(result.detail)}</p>
              <p class="results__ref"><a href="${safeHref(paperHref(publication))}" target="_blank" rel="noopener noreferrer">${escapeHtml(publication.title)}</a> · ${escapeHtml(venueLine(publication))}</p>
            </li>`;
              })
              .join("")}
          </ol>`
        : "";

      const related = direction.related.length
        ? `<p class="direction__related">Related: ${direction.related
            .map((link) => {
              const target = byId.get(link.id);
              if (!target) throw new Error(`Unknown related direction: ${link.id}`);
              return `<a href="#${escapeHtml(target.id)}">${escapeHtml(target.title)}</a>, ${escapeHtml(link.note)}`;
            })
            .join("; ")}.</p>`
        : "";

      return `
      <article class="wrap direction" id="${escapeHtml(direction.id)}" aria-labelledby="${escapeHtml(direction.id)}-title">
        <div class="direction__aside">
          <p class="direction__n">${index + 1}</p>
          ${motifs[direction.motif] ? motifs[direction.motif]() : ""}
        </div>
        <div class="direction__main">
          <h2 class="direction__title" id="${escapeHtml(direction.id)}-title">${escapeHtml(direction.title)}</h2>
          <p class="direction__q">${escapeHtml(direction.question)}${direction.status ? ` <span class="direction__status">${escapeHtml(direction.status)}</span>` : ""}</p>
          <div class="prose">${direction.body.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}</div>
          ${results}
          ${direction.outlook ? `<p class="direction__outlook"><strong>Where it goes.</strong> ${escapeHtml(direction.outlook)}</p>` : ""}
          ${related}
        </div>
      </article>`;
    })
    .join("");

  const body = `
    <section class="wrap cols research-open">
      <div class="cols__aside"><h1>Research</h1></div>
      <div>
        <p class="research-open__statement">${escapeHtml(RESEARCH.statement)}</p>
        <div class="prose">${RESEARCH.intro.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}</div>
        ${map}
      </div>
    </section>
    ${directions}
    <section class="wrap cols section section--last">
      <div class="cols__aside"></div>
      <p class="research-close">Papers, preprints, and links for every result above are collected on the <a href="/publications/">publications page</a>.</p>
    </section>`;

  return layout({ active: "research", body, meta: pageMeta.research });
}

/* ---------- publications ---------- */

function publicationLinks(publication) {
  const links = [];
  if (publication.arxiv) links.push(ext("arXiv", `https://arxiv.org/abs/${publication.arxiv}`));
  if (publication.journalLink) links.push(ext("Journal", publication.journalLink));
  if (publication.code) links.push(ext("Code", publication.code));
  if (publication.media) links.push(ext(publication.media.label, publication.media.href));
  return `<p class="pub__links">${links.join("")}</p>`;
}

function publicationsPage() {
  const byYear = new Map();
  for (const publication of PUBLICATIONS) {
    if (!byYear.has(publication.year)) byYear.set(publication.year, []);
    byYear.get(publication.year).push(publication);
  }
  const years = Array.from(byYear.keys()).sort((a, b) => b - a);
  const scholar = SITE.links.find((link) => link.label === "Google Scholar");
  const arxiv = SITE.links.find((link) => link.label === "arXiv");

  const body = `
    <section class="wrap page-head">
      <h1>Publications</h1>
      <p>Papers and preprints, newest first. The record is also kept on ${ext("arXiv", arxiv.href)} and ${ext("Google Scholar", scholar.href)}.</p>
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
          <li class="pub${publication.selected ? " pub--selected" : ""}">
            <h3><a href="${safeHref(paperHref(publication))}" target="_blank" rel="noopener noreferrer">${escapeHtml(publication.title)}</a></h3>
            ${publication.formerTitle ? `<p class="pub__former">Earlier title: ${escapeHtml(publication.formerTitle)}</p>` : ""}
            <p class="pub__authors">${renderInline(publication.authors)}</p>
            <p class="pub__venue">${escapeHtml(venueLine(publication))}</p>
            ${publication.selected ? `<p class="pub__note">${escapeHtml(publication.summary)}</p>` : ""}
            ${publicationLinks(publication)}
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
        <p>${escapeHtml(SITE.name)}, ${escapeHtml(SITE.role)}, ${escapeHtml(SITE.institution)}.</p>
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
            <span class="cv-row__date">${escapeHtml(item.date || "")}</span>
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
  write("404.html", notFoundPage()),
  write("mini_lib/index.html", legacyLibraryRedirect()),
  write("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${baseUrl}/sitemap.xml\n`),
  write(
    "sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((route) => `  <url><loc>${baseUrl}${route.href}</loc></url>`).join("\n")}\n</urlset>\n`,
  ),
]);

console.log(`Built ${routes.length} pages and a 404 page from src/data/.`);
