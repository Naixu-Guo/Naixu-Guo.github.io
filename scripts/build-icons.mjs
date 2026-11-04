import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { Resvg } from "@resvg/resvg-js";

// The SVG is the only editable source. Keep generated fallbacks in sync on every build.
export async function buildIcons(root) {
  const svg = await readFile(path.join(root, "assets/mark.svg"), "utf8");
  const backgroundElement = svg.match(/<rect\b(?=[^>]*\bid="icon-background")[^>]*>/)?.[0];
  const iconBackground = backgroundElement?.match(/\bfill="(#[\da-f]{6})"/i)?.[1];
  if (!iconBackground) throw new Error('mark.svg must define rect#icon-background with a six-digit hex fill.');
  const render = (size, background) => Buffer.from(new Resvg(svg, {
    fitTo: { mode: "width", value: size },
    ...(background ? { background } : {}),
    font: { loadSystemFonts: false },
  }).render().asPng());
  const save = async (file, bytes) => {
    const target = path.join(root, file);
    try { if ((await readFile(target)).equals(bytes)) return; }
    catch (error) { if (error.code !== "ENOENT") throw error; }
    await writeFile(target, bytes);
  };
  const sizes = [16, 32, 48];
  const images = sizes.map(size => render(size));
  for (const [index, size] of sizes.entries()) {
    await save(`assets/favicon-${size}.png`, images[index]);
  }
  // iOS applies its own mask; fill the outer transparent corners with the same ink.
  await save("assets/apple-touch-icon.png", render(180, iconBackground));

  // ICO directory followed by three lossless PNG entries, one at each native size.
  const directory = Buffer.alloc(6 + 16 * sizes.length);
  directory.writeUInt16LE(1, 2);
  directory.writeUInt16LE(sizes.length, 4);
  let offset = directory.length;
  sizes.forEach((size, index) => {
    const entry = 6 + index * 16;
    directory[entry] = directory[entry + 1] = size;
    directory.writeUInt16LE(1, entry + 4);
    directory.writeUInt16LE(32, entry + 6);
    directory.writeUInt32LE(images[index].length, entry + 8);
    directory.writeUInt32LE(offset, entry + 12);
    offset += images[index].length;
  });
  await save("favicon.ico", Buffer.concat([directory, ...images]));
}
