import { access, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const pages = [
  "index.html",
  "research/index.html",
  "publications/index.html",
  "cv/index.html",
  "library/index.html",
  "about/index.html",
  "404.html",
];

const errors = [];

function localTarget(url) {
  const clean = url.split("#")[0].split("?")[0];
  if (!clean || clean === "/") return "index.html";
  const relative = clean.replace(/^\//, "");
  return path.extname(relative) ? relative : path.join(relative, "index.html");
}

for (const page of pages) {
  const file = path.join(root, page);
  let html;
  try {
    html = await readFile(file, "utf8");
  } catch {
    errors.push(`${page}: missing generated page`);
    continue;
  }

  const h1Count = (html.match(/<h1\b/g) || []).length;
  if (h1Count !== 1) errors.push(`${page}: expected one h1, found ${h1Count}`);
  if (!/<link rel="canonical" href="https:\/\/naixu-guo\.github\.io\//.test(html)) {
    errors.push(`${page}: missing canonical URL`);
  }
  if (/href="\s*"/.test(html)) errors.push(`${page}: contains an empty href`);
  if (/react\.development|text\/babel|babel\.min\.js/.test(html)) {
    errors.push(`${page}: contains a development runtime`);
  }

  const attributes = html.matchAll(/(?:href|src)="([^"]+)"/g);
  for (const [, url] of attributes) {
    if (/^(?:https?:|mailto:|tel:|#|data:)/.test(url)) continue;
    const target = localTarget(url);
    try {
      await access(path.join(root, target));
    } catch {
      errors.push(`${page}: missing local target ${url}`);
    }
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Checked ${pages.length} pages: structure and local assets are valid.`);
