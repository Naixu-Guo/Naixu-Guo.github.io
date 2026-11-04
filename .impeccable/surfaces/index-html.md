---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: ["assets/ink.css", "assets/site.js", "assets/ink-explorer.js", "assets/research.js", "assets/home-interests.css", "assets/research-scenes.js", "assets/research-diagrams.css", "assets/research-diagrams.js", "scripts/research-diagrams.mjs", "scripts/build.mjs", "scripts/ink-home.mjs", "content/interests.json", "content/research.json"]
---

# Homepage and reading pages

Mode: Experience in the dragon-theme hero; Read in home current interests/About/news and on Research, Publications, Library and CV. Audience: quantum-information researchers and potential collaborators. The latest 2026-11-03 correction rejects the repeated homepage jump/preamble and the generated research objects as incomprehensible. White dragon (`ink`, default) and Black dragon (`black`) share the revised composition; P3 (`light`) and P5 (`dark`) remain available. Classic is removed and saved `normal` falls back to White.

## Direction contract

THESIS: An academic personal space with a distinctive watercolor-dragon opening and comfortable, predictably aligned reading pages.

OWN-WORLD: White uses cool pale paper, navy ink and a blue-gray dragon; Black uses near-black blue paper, light ink and a graphite/silver dragon. EB Garamond headings and genuine italic questions sit beside restrained Hanken prose. The exact right-side poem and small Ma Shan Zheng name stay on home; the authentic portrait belongs to About below the hero. Shared quiet paper continues through the lower home and inner pages. Text and controls remain live HTML; the rest of the interface stays English.

STORY: One short home lead and Explore research action, one Currently exploring heading with three existing topic introductions, biography/photo, up to five news entries, one contact cluster and one English reflection. Research introduces three themes through cohesive animated scientific scenes with short HTML captions, a question and short summary each, followed by full collaboration-interest disclosures. Publications owns the complete 14-paper catalog. Library keeps 27 resources and CV 18 records; 11 detailed result notes and all 25 news records remain in source.

FIRST VIEWPORT: Home keeps the identity/lead/action left, unobstructed dragon and two-column vertical poem right. Inner Research/Publications/Library/CV titles share their left edge and page-head boundary. Narrow home layouts compose the dragon and poem below the introduction; narrow Research retains title → summary → artwork and controls → question → source links. No Selected Works or repeated paper catalog.

FORM: White/Black share `assets/ink.css`, a 1280px maximum shell, 72px sticky header (64px at ≤760px) and 19px EB Garamond desktop navigation. `--reading` equals `--shell`; the old 1120px/960px per-route split is superseded. All inner heads have 320px minimum height and 56px/40px padding, switching to automatic height and 40px/32px at ≤760px. Historical 1440×900 DOM evidence gives h1 y=128 and a common head bottom y=392 on all four routes. Mobile hero art remains y=300px and the poem top 266px, including ≤360px; explicit hero minimum height `max(calc(100svh - 64px), calc(280px + min(110vw, 560px)))` preserves their space after removing the jump. The home-current section uses 28px/40px vertical padding, then 24px/24px at ≤760px. Research has a 1040px diagram wrapper and one fitted axonometric scene per topic. Three short numbered captions sit below the art in columns with 40px gaps, then stack at ≤760px. The full illustration remains visible on phones, with larger callouts and finer strokes. Caption headings are 23px/1.2, then 21px; descriptions are 15px/1.6, then 14px. Only collaboration interests use native details. Figure links open original local assets; Read paper links open sources. Native routes, anchors/history and document scrolling remain.

FINISH: `.impeccable/review/research-explain/review.md` returns `ship` at source/component scope with no material findings. It accepts the bounded duplication/comprehension correction using source and four component storyboards. Live responsive layout, typography, controls and whole-page QA remain unverified because browser access is disabled. The earlier object-art verdict is historical and does not override the author’s explicit rejection; no user aesthetic acceptance or publication authorization is inferred.

## Content and behavior

One `inkNavigation` array supplies White/Black desktop/mobile Research, Publications, Library, CV and Contact (`/#contact`). About remains below home; `/about/` redirects to `/#about`, preserving contact/news anchors, and is absent from canonical routes/sitemap. `assets/ink-explorer.js` only redirects old interests/topic/papers/reading hashes. Home About/Contact/News anchors remain native. Game keeps its established four-route primary menu without an About entry. P3 is retired.

`researchPage()` uses three explanatory sequences. Scientific agents reads question → scientific tools → independent checks; dissipative quantum algorithms reads encoding → designed open-system evolution → readout; learning quantum systems reads unknown system → local observations → inferred dynamics. `assets/research-scenes.js` emits nine small SVG scenes with no SVG text or raster plates; short headings/descriptions are live HTML outside each drawing. Curves, bars, matrix tiles and animation are schematic relationships, not measured results, numerical simulations or verified physical dynamics. The build emits complete static sequences and hides controls until enhancement. Play/Pause and the manual range retain forward playback, a two-second end hold and restart; manual input pauses playback. Offscreen, hidden-tab, print and reduced-motion states stop autoplay, while reduced motion retains manual exploration. Quantum Computing links to the Lindbladian ODE paper via `visuals[0]` and `publicationId`. Detailed result notes and original figures remain in source, and the complete catalog stays on Publications.

`homeInterests()` introduces topics whose showOnHome is not false after the opening and before About/news. Two efforts are currently featured. Optional homeTitle/homeSummary fall back to title/description; homeContext supplies existing-work context and internal/external links connect to the supporting work. The full theoretical topic remains on Research. Titles open the corresponding full Research disclosures. The hero jump, hidden duplicate index/status and redundant preamble remain removed. One What I’m working on heading leads to a substantive research aim and two featured action-led topics; optional homeTitle changes only homepage wording, retaining Research titles and stable IDs. Open ruled rows use .85fr/1.15fr columns and a 72px gap, then stack at ≤760px with 16px gaps. All three appearances can access the Research interest link, destination and disclosures; Game styles are in `assets/research-diagrams.css`. Topic interests remain provisional, editable content.

Publications renders all 14 records with summaries, authors, venues, links and figures. The original figure mapping remains in `.impeccable/review/ink-pages/restored-figures.json`; paper figures are preserved separately from the new conceptual illustrations. Library and CV keep their full stored content. Home biography retains the authentic portrait and `SITE.biography`; one contact section contains email, Scholar, arXiv, GitHub and LinkedIn. Repeated hero profiles/CV groups, the repeated biography research paragraph, old home research/afterword markup and repeated footer links are removed. Recent news uses `NEWS.slice(0, 5)`; all 25 records remain in source. The footer is copyright and Back to top. The optional scientific-AI perspective appears once below biography/news, replacing the generic English reflection. The original reflection data remains as a fallback, not a second visible statement.

White/Black use the same mobile Menu, icon appearance selector, focus, reduced-motion and saved theme behavior. Black uses its own artwork/palette and the same paper raster with inversion/desaturation, .24 opacity and screen blending; White paper remains .68 opacity. The dragon stays profile-scoped on home. Classic has no active stylesheet or picker option; valid White/Black/P3/P5 choices persist before paint, across routes and tabs.

## Current evidence

- `.impeccable/review/research-explain/review.md`, `validation.md` and `verification.txt` cover the current correction: seven checked pages, 16 passing tests, a clean diff, scoped detector `[]`, and served-source readback with nine explanatory stages and zero rejected-raster references. Fresh review returns source/component `ship` with no material findings.
- `white-desktop.png`, `black-desktop.png`, `white-mobile.png` and `black-mobile.png` in `research-explain/` are source SVG plus HTML-caption component storyboards, not page screenshots. They approximate type/layout and stroke rasterization. Work settings disable local browser use; current responsive route geometry, loaded typography, live animation, keyboard traversal, browser controls and whole-page visual QA remain unverified. This is not user aesthetic approval.
- Historical `.impeccable/review/ink-black/review-packet.md`, `review.md` and `validation.md` record the new request, initial `fix` disposition and supplied technical evidence. The initial review opened all 18 required captures and both rejected screenshots; `verdict.md` closes both listed fixes with targeted `ship`; this is not a second whole-surface approval.
- That historical revision supplied seven built/checked targets, eight passing tests, clean diff, one scoped detector pass with no findings, ten artwork rasters with provenance, no reported horizontal overflow, and four-route geometry in `layout-metrics.json`. Viewports include 1440, 820, 390, 320 and the actual 641×844 window. The full-page fixed-background export limitation is recorded in the packet; the ordinary scrolled Black About capture confirms the paper continues on screen.
- This documentation merge checked the affected source, JSON/narrative consistency, relevant local references and the owned diff. No build, tests, browser or detector were rerun. No physical-device, actual zoom, cross-browser, full screen-reader/formal WCAG, rendered print/no-JS or outbound-source certification is claimed.

## Historical provenance

Older reviews preserve their original evidence; their then-current geometry and interaction recipes are not current instructions.

- `ink-unframed` records the rejected in-scene reader; `ink-study` records the earlier modal/left-phone-poem and English literary typography work. Both are superseded for reading topology.
- `ink-inscription` retains the exact poem and Ma Shan Zheng source; `ink-type` retains the EB Garamond source and typography evidence. Chinese-label variants were withdrawn following “哦其他地方不需要中文”.
- `ink-watercolor` records the supplied pale watercolor reference. Its `capture-history.md` identifies overwritten same-name captures; the later typography copies are canonical in `ink-type/`.
- `ink-composition` records the earlier explorable-space request and subsequent fixes. `ink-claude/invocation.json` records the actual Claude Code 2.1.288 run: claude-opus-5-5 at high effort after two interrupted max-effort inspections. Its reading-column implementation was later rejected.
- `ink-topics`, `ink-immersive`, `ink-person`, `ink-layout`, `ink-editorial`, `ink-clarity`, `ink` and `ink-before` retain earlier topic, terrain, source and review history under `.impeccable/review/`. Night-scene person/mountain constraints and veils are superseded.

The unchanged White home asset is `assets/artwork/watercolor-dragon.webp`, native 1586×992 and 413682 bytes. The Black sibling is `assets/artwork/black-dragon.webp`, built-in ImageGen output edited from White, native 1586×992 and 352042 bytes; its exact prompt is in the adjacent JSON. Builder-recorded encoding is quality 95 for both. Shared `assets/artwork/watercolor-paper.webp` is native 1536×1024 and 189866 bytes, with exact prompt/timestamp JSON and builder-recorded quality 88. Dimensions and sizes were read from the actual files for this documentation delta. The original scientific figures remain available; the explanatory drawings are not measured data or numerical simulations. No 4K or pixel-identity claim is made.

Earlier 2026-11-03 detail-polish evidence in `.impeccable/review/ink-polish/validation.md` is historical. Its earlier positive-comment wording is superseded by the later explicit rejection; About removal and useful menu behavior persist, while the current appearance has not been aesthetically accepted. Earlier `ink-unified`, `research-visual` and `ink-pages` ship verdicts apply only to their then-current revisions; their full-result Research, Classic and separate-width recipes are superseded.

Historical follow-up: `.impeccable/review/research-motion/validation.md`. Its explanatory SVG scenes and the later branching/Bloch refinement were superseded by object miniatures, then by the current `research-explain` sequences. Prior technical ship verdicts do not establish acceptance of the latest revision.

## Historical refinement evidence (2026-11-03)

The author rejected the prior diagrams as too similar and text-heavy. That revision’s three-concept SVG composition, 38%-wide desktop/full-row mobile publication figures and “New paper:” News convention supersede the previous recipes. All 14 publications and 25 news records remain. SVG contact sheets in `.impeccable/review/research-refinement/` show White/Black initial, intermediate and final frames. Browser access was disabled in Work settings for that turn: no actual responsive page screenshot or live-browser interaction check was asserted. The subsequent explicit artwork rejection superseded the SVG recipe.

## Historical object illustrations and homepage interests (2026-11-03)

The rejected `agents-study.webp`, `quantum-study.webp` and `learning-study.webp` plates and adjacent `.webp.json` prompt/provenance records are archived in `.impeccable/review/research-objects/rejected/`. Their recorded native format is 1536×1024 RGBA WebP, quality 92, totaling 664190 bytes; embedded EXIF/XMP was not claimed. The porcelain, graphite and frosted-glass composition was explicitly rejected as incomprehensible and is not the current visual recipe. Original paper figures remain linked.

The homepage borrows only the reference site’s information choices—current work, projects and collaboration—not its visual design or personal claims. Shared `content/interests.json` keeps the concise home introductions and full Research details editable together. Historical object-art review remains under `research-objects/`; the current source/component evidence is under `research-explain/`. No new browser screenshot or user aesthetic acceptance exists.


## Historical homepage editorial correction (2026-11-03)

The author wants the homepage to convey an independent research agenda and concrete work in motion, using Jiaqi Cai’s supplied screenshots as an information reference. The homepage now combines a research aim, action-led topic titles, explicit ambitions, public project/paper links and one On scientific AI perspective. No founder status, super-AGI claims or self-awarded rising-star label is imported. Copy remains an assistant draft for the author to refine; facts and goals are distinguished. Fields are in content/interests.json and its schema/maintenance guide. The original full Research topics, dragon, poem, About, five news and all publication data remain.

Build/content checks and 16 tests pass; the scoped static detector returns []; served-source and duplicate-heading checks pass. Evidence: .impeccable/review/home-agenda/validation.md. Local browser access remains disabled, so no current desktop/mobile layout or typography approval is claimed. This is a narrow editorial refinement, not a new visual identity or an independent aesthetic verdict.


## Historical AI-led two-effort draft (2026-11-03)

Following continued dissatisfaction, the working draft features algorithm invention with AI and agents for sustained research. Existing theoretical work supports the first rather than appearing as an equal third homepage priority. showOnHome controls homepage inclusion without removing any Research details. homeContext separates existing work from the ambition; internal links now also appear beside relevant topics. The closing scientific-AI statement sets a standard of new methods, useful conjectures and independently scrutinized results rather than repeating the process description. These remain provisional editorial choices; the author has been asked which single long-term goal should lead the site. Preserve their eventual answer. Evidence: home-focus/validation.md; no new browser QA or aesthetic acceptance.


## Current direction: Quantum and AI (2026-11-03, author answer)

The author states that Quantum and AI are both indispensable, with QuantumAGI possibly the ultimate goal. This supersedes the AI-led emphasis and the previously pending question. Home now features Quantum computing & learning and AI for scientific discovery as equal rows; classical–quantum algorithm co-design remains in the AI description, with a link to its complete Research topic. All three full Research topics remain.

The closing Toward QuantumAGI section presents a possible long-term convergence of quantum computation and general intelligence. The reciprocal explanation is an editorial interpretation, not a technical definition, implemented architecture, demonstrated capability or claim that quantum computation is necessary for AGI. Current work and future ambition remain visibly distinct. Existing layout, artwork, fonts, controls and let’s talk are unchanged. Evidence: quantum-ai-direction/validation.md; 7-page checks/16 tests, HTTP source readback and diff pass, no current browser QA or aesthetic-acceptance claim.

## Current refinement (2026-11-04)

P3 is removed at the author’s request. Mist, Nocturne and Vermilion replace the literal labels; assets/appearances.json is the shared build/runtime source. The 224px bounded selector shows 30px swatches in 56px native-radio rows, opens by click/keyboard and preserves focus/dismissal behavior. Removed light/normal values fall back to Mist. Homepage Quantum and AI topics now form two equal open columns, stacking on phones. The unchanged tentative QuantumAGI paragraph follows them within the agenda, before About/news. Biography/news hierarchy is quieter, contact has no duplicate visible heading, and reading-paper opacity is reduced while the hero artwork and exact poem are unchanged. All scholarly source data and five-news policy remain intact.

Evidence: .impeccable/review/appearance-refinement/validation.md. The former rows/footer-perspective layout above is historical. Browser access is disabled in Work settings; there is no current desktop/mobile screenshot or aesthetic certification.

## Current author correction: plain names and Opus drawings (2026-11-04)

The author rejects the obscure appearance names and the current research illustrations. Active labels are Light, Dark and Red, with stable ink/black/dark IDs. P3 stays removed. The coordinator’s three-column icon sequences are rejected; Opus has implemented three cohesive scientific scenes, using Yuxuan Du’s illustrated research scene as a craft reference. No claim of current visual acceptance. Prior layout/artwork recipes are historical where superseded.


Final local integration: Claude Opus 5.5 at requested max effort implemented the three scene renderers, theme palettes and live-layer animation. 16 tests and 7 page checks pass; all 54 content JSON hashes are unchanged. Three active themes have desktop and phone SVG captures; these exclude the surrounding HTML layout. Browser access remains disabled. Evidence: `.impeccable/review/opus-research/validation.md`.


## Latest refinement: Game and reading comfort (2026-11-04)

Active labels are Light, Dark and Game; the author explicitly replaced Red with Game. The drawing set is unchanged. The Research toolbar now groups playback, phase range and readout above the scene. First visible playback begins at zero; resuming and manual exploration preserve phase. SVG visibility, document visibility, reduced motion and print gate animation. Home About/News stack at <=1000px to keep biography prose readable beside the portrait. Current checks and their browser-access limitation are recorded in `.impeccable/review/game-polish/validation.md`.


## Latest correction: one agenda (2026-11-04)

The author removes Current interests as repetitive with What I’m working on. Only the latter is displayed on Home. Research now ends after its three illustrated directions and the publication-list link, with no interest navigation item or disclosures. The homepage titles link directly to direction anchors via `researchHref`; old interest bookmarks resolve through shared `assets/ink-explorer.js` to retained homepage topic anchors. Old claims above about active Research disclosures and their styles are superseded. Full draft text remains in `content/interests.json`.


## Community work and paper actions (2026-11-04)

What I’m working on now includes one QIQCOP community entry between the two commitments and the long-term horizon. It uses `interests.community` (title/href/text); the former duplicate topic link is removed. Copy follows the author’s request to explore ways of collaborating and contributing to the community. Publications actions use one Paper link through the established resolver; venue/status data are not hidden. The figure-credit action is removed, with asset provenance retained outside the reading interface.


## Clarified community hierarchy (2026-11-04)

The author considers QIQCOP’s placement good but says it cannot stand beside the two research topics as a peer. Keep its position and text, using one supporting paragraph with QIQCOP linked inline. Remove the independent h3/divider, reduce body to16px/1.75 and top spacing to32px (24px phone). Quantum/AI remain the two primary commitments. The earlier screenshot ambiguity is resolved.


## Latest correction: Dark figures and Game consistency (2026-11-04)

See DESIGN.md’s matching section. Shared header/menu replaces theme-specific duplicate navigation. Game retains cutout name, one portrait and the two focus lines, with one research entrance; repeated description and institution caption are removed. Career details remain in About, with five news items and the unchanged agenda. Game reading pages share shell/head geometry and expose the full publication figures/summaries. The appearance picker is a compact horizontal palette/type preview with native radios. Dark publication figures receive pale mats; light-lettered transparent diagrams use schema-backed slate surfaces. Original figures are unchanged. This is implementation, not user aesthetic acceptance. Browser remains disabled.

## Post-publication corrections (2026-11-04)

Home retains What I’m working on, its two commitments, supporting QIQCOP paragraph and let’s talk invitation. Toward QuantumAGI moves unchanged into the Research opening summary, after the current-work overview and before topic navigation. The author corrected the earlier bottom placement. The old homepage reflection remains source-only. Light is the explicit default; legacy ng-theme choices are ignored, and new manual choices are saved as ng-appearance. No typography, artwork or academic wording changes beyond the relocated perspective’s existing style.

## Research introduction deduplication (2026-11-04)

The user rejects the stacked scope sentence, Toward QuantumAGI heading and paragraph. Current Research header is one h1, one concise summary paragraph, then direction navigation. Render perspective.text only; perspective.title is metadata. The paragraph preserves the tentative long-term QuantumAGI ambition. This supersedes the previous recommendation to prepend a current-work overview. No duplicated topic list or second introductory heading.

## Contact control (2026-11-04)

Home and CV display an Email button, using the author-requested Gmail. It retains underlined link styling and44px keyboard-accessible target, with recipient decoding only on activation. No complete address in rendered markup/JSON-LD; [at]/[dot] no-JavaScript fallback. Content stores email.local/email.domain for human and agent maintenance. This supersedes the prior visible institutional email.

## Homepage reading load (2026-11-04)

The author questions the agenda’s text volume. Current structure is heading, two equal topics with one concise paragraph and two links each, one QIQCOP supporting sentence, and let’s talk. No generic lead or second context paragraph. Fonts stay readable; the reduction is editorial. Full Research/Publications remain intact.
