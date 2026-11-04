# Naixu Guo’s homepage

A static academic website with a shared content layer for people and agents. The public site needs no server or client framework. Node builds the pages; JSON Schema validation uses the pinned development dependency in `package-lock.json`.

## Edit information

```sh
npm ci
npm run content:edit
```

Open **http://127.0.0.1:4174/edit** for publication, News and profile forms, a JSON editor for structured documents, change previews and local rebuilding. Saving does not publish.

For direct file or agent edits, start with **[content/README.md](content/README.md)**. Content lives in `content/`: one JSON file per publication and news item, plus profile, research, collaboration topics, CV and library documents. Stable IDs connect records. The CLI supports export, candidate preview, conflict-checked apply and arXiv discovery into a local inbox. Human and AI edits use the same source and validation.

```sh
npm run verify        # build, content/asset/link checks and functional tests
npm run preview       # static preview at http://127.0.0.1:4173/
npm run content -- check
npm run content -- collect-arxiv   # candidates only; never changes live content
```

Node 22 or newer is required. Python 3 is used only for the optional arXiv collector and the simple static preview. No scheduler, social scraper, automatic publication or external account connection is configured.

## Website structure

| Responsibility | Source |
| --- | --- |
| Editable information and policy | `content/` |
| Content contracts | `content/schemas/`, `scripts/content.mjs` |
| Agent CLI and optional arXiv adapter | `scripts/content-cli.mjs`, `scripts/collect-arxiv.py` |
| Local editing UI | `scripts/content-server.mjs`, `scripts/editor/` |
| Shared navigation, pages and metadata | `scripts/build.mjs` |
| Homepage research agenda and legacy links | `scripts/ink-home.mjs`, `assets/ink-explorer.js` |
| Research diagrams and controls | `assets/research-scenes.js`, `assets/research-diagrams.{js,css}`, `scripts/research-diagrams.mjs` |
| Shared styles and appearances | `assets/style.css`, `assets/ink.css`, `assets/appearances.json` |
| Appearance picker, menu and optional painting motion | `assets/site.js` |
| Favicon source and generated PNG/ICO variants | `assets/mark.svg`, `scripts/build-icons.mjs` |
| Artwork, portraits, fonts and original figures | `assets/`, `figure/` |
| Functional checks | `scripts/test.mjs`, `scripts/content.test.mjs`, `scripts/check.mjs` |
| Design decisions and retained provenance | `PRODUCT.md`, `DESIGN.md`, `.impeccable/` |

The five canonical pages are Home, Research, Publications, Library and CV. About is on the homepage; `/about/` preserves earlier links through a redirect. Generated HTML, `sitemap.xml`, `robots.txt`, the 404 page and the old Library redirect are tracked for static hosting. Do not edit these outputs by hand.

## Content and design boundaries

- Home has the painting, exact right-side vertical poem, research entry points, one biography/contact area and the latest **five** news entries. The full news history remains in content.
- Research is vertical and image-led, with **three topics**, short descriptions, an interactive illustration per topic, one representative paper. The research agenda appears only in Home’s What I’m working on section. Publications owns the complete catalog; detailed research notes remain in source.
- The Agents illustration follows the public QIQCBench surrogate-learning case and links to the full GaugeForge case studies. All generated bitstrings, scatter points, column heights and toy curves are illustrative, not reported measurements or recorded agent runs. Static SVG is present without JavaScript; motion pauses offscreen, in hidden tabs, during print and for reduced-motion preferences.
- Light (`ink`, default), Dark (`black`) and Game (`dark`) are the three appearances. P3 and Classic are retired; their saved values fall back to Light. Names and state come from `assets/appearances.json`. Light/Dark share aligned watercolor reading pages, with the dragon only on Home.
- The interface is English except for the name and selected poem. The real portrait and original paper figures retain their provenance. Social-card artwork is a separate asset and is not regenerated when content changes.

The current content contains 14 papers and 25 news records. The author explicitly excluded COMPOSITE-STEM, AgentIF-OneDay and DeepMath-Creative; the content policy enforces that choice. Do not infer affiliations, acceptances or publication dates from uncertain evidence.

## Site icon

Edit `assets/mark.svg`, then run `npm run build`. The build uses the locked `@resvg/resvg-js` development dependency to export16/32/48px PNGs, a multi-size `favicon.ico`, and an opaque180px Apple touch icon. HTML icon URLs include content hashes. Keep one mark across appearances; do not edit the generated raster files independently. Preserve `rect#icon-background` and its six-digit hex fill: the touch-icon background is read from it. This tooling runs only at build time, with no extra browser JavaScript.

## Verification and publication

`npm run verify` is the common human/agent check. CI runs the same command and checks that generated pages are current; it does not deploy. Tests cover content contracts, references, duplicate/excluded records, date precision, stale/concurrent edits, idempotency, offline arXiv ingestion, local-editor boundaries and existing website behavior. Browser checks cover the touched desktop/mobile interfaces; tests do not certify a full screen-reader or cross-browser audit.

Commit, push and publish only when authorized. Local editor saves and CLI applies change files only. See `AGENTS.md` for agent-specific rules and `content/README.md` for the update contract and recovery steps.
