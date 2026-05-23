# Naixu Guo Homepage

This repo now contains only the current standalone homepage app. It is a small React-in-the-browser SPA served from `index.html` with page-specific content stored in `src/data/`.

## Edit Content

- Homepage identity and news: `src/data/home.js`
- Publications: `src/data/publications.js`
- Research page: `src/data/research.js`
- CV page: `src/data/cv.js`
- Library page: `src/data/library.js`
- Homepage section layout and labels: `src/home.jsx`
- Secondary page layout (`Research`, `Publications`, `CV`, `Library`): `src/pages.jsx`
- Navigation, routing, theme toggle, and footer: `src/app.jsx`
- Site styling: `assets/style.css`
- Portrait image: `photo.jpg`
- Publication figures used by the live site: `figure/previews/`

## Run Locally

Serve the repo root with any static file server. For example:

```bash
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173/`.

## Current Structure

```text
index.html
assets/style.css
src/
  app.jsx
  home.jsx
  pages.jsx
  utils.jsx
  data/
    cv.js
    home.js
    library.js
    publications.js
    research.js
figure/
  previews/
photo.jpg
favicon.ico
robots.txt
```
