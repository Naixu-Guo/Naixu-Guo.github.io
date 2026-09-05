# Naixu Guo — homepage

A dependency-free static academic site. A small Node script reads the content in `src/data/` and generates every page.

## Update the site

Edit the relevant content file:

- Identity, hero text, links, and the activity stream: `src/data/home.js`
- Publications: `src/data/publications.js` (`selected: true` gives a paper its summary and a larger title on the publications page)
- Research program: `src/data/research.js` (each result references a publication by exact title)
- CV: `src/data/cv.js`
- Library: `src/data/library.js`

Then run:

```bash
npm run update
```

This rebuilds the HTML and checks links, headings, and local assets. Generated HTML is committed because GitHub Pages serves it directly.

## Preview locally

```bash
npm run preview
```

Open <http://127.0.0.1:4173/>.

## Files

```text
index.html, research/, publications/, cv/, library/   generated pages
404.html, sitemap.xml, robots.txt                     generated
mini_lib/                                             redirect to /library/
assets/style.css                                      the one stylesheet
assets/site.js                                        theme toggle and print button
assets/portrait-*.jpg                                 portrait
scripts/build.mjs                                     templates and the small SVG figures
scripts/check.mjs                                     post-build checks
src/data/*.js                                         content
```

Do not edit generated HTML by hand. Change `src/data/`, `scripts/build.mjs`, `assets/style.css`, or `assets/site.js`, then run `npm run update`.

## Design notes

One typeface (Hanken Grotesk), a cool near-white ground with a faint light behind the hero, hairline rules, and a handful of thin-line figures drawn from the research (a dissipative flow, a lattice with probed sites, a polynomial step, an evidence graph), each with one luminous node. The homepage field thickens from sparse structure on the left to a dense lattice on the right. Hierarchy comes from scale, weight, and spacing rather than containers or labels. Light and dark themes are designed separately and share the same structure.
