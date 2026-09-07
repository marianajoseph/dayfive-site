/**
 * Google Ads brand images, from the same SVG masters as everything else.
 *
 *   node ads_export.mjs
 *
 * Google Ads asks for a 1:1 square logo and a 1.91:1 landscape image. Neither
 * matches an existing master exactly:
 *
 *   logo_720.svg          720x720   — already 1:1, so it scales cleanly
 *   cover_1024x576.svg   1024x576   — 16:9, NOT 1.91:1
 *
 * The cover is therefore RE-CANVASED rather than stretched. Its content is one
 * translated group over a flat navy rect, so the group is re-centred on a
 * 1200x628 rect and the artwork keeps its proportions. Stretching 16:9 into
 * 1.91:1 would squash the mark by 6% horizontally — not obviously wrong at a
 * glance, which is exactly why it would ship.
 *
 * Ads rejects images with excessive padding, so the mark is sized to a
 * deliberate fraction of the canvas rather than left at whatever the source
 * scale produced.
 */
import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The brand kit lives outside this repo; the script lives here because this is
// where sharp resolves from. Forward slashes: node accepts them on Windows and
// they need no escaping.
const HERE = "C:/Users/user/OneDrive/Documents/dayfive-machine/brand";
const NAVY = "#081426";

/**
 * Pull the artwork group and its transform out of a master.
 *
 * Both masters have the same shape: a flat navy rect, then one translated and
 * scaled group holding the whole mark. `w`/`h` are the master's canvas, from
 * which the artwork's own extent is derived — the group is centred in both
 * masters, so its span is canvas - 2 * offset.
 */
function artworkOf(file, w, h) {
  const svg = readFileSync(join(HERE, file), "utf8");
  const open = svg.indexOf("<g transform=");
  const close = svg.lastIndexOf("</svg>");
  if (open === -1 || close === -1) {
    throw new Error(`${file} is not the shape this script expects`);
  }
  const body = svg.slice(open, close);
  const m = body.match(/^<g transform="translate\(([\d.]+) ([\d.]+)\) scale\(([\d.]+)\)">/);
  if (!m) throw new Error(`could not read ${file}'s translate/scale`);
  const x = parseFloat(m[1]);
  const y = parseFloat(m[2]);
  return {
    inner: body.replace(m[0], "").replace(/<\/g>\s*$/, ""),
    scale: parseFloat(m[3]),
    spanW: w - 2 * x,
    spanH: h - 2 * y,
  };
}

/**
 * Re-canvas artwork onto a new frame at a chosen fill fraction.
 *
 * `fill` is the share of the frame the mark should occupy on its tighter axis.
 * Google Ads rejects images with excessive padding, and the square master was
 * drawn for a favicon — its mark covers only ~37% of the frame, which reads as
 * a small logo floating in a navy field rather than a logo.
 */
function recanvas({ inner, scale, spanW, spanH }, W, H, fillW, fillH) {
  const target = Math.min((W * fillW) / spanW, (H * fillH) / spanH);
  const s = scale * target;
  const nx = (W - spanW * target) / 2;
  const ny = (H - spanH * target) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${NAVY}"/>
  <g transform="translate(${nx.toFixed(3)} ${ny.toFixed(3)}) scale(${s.toFixed(6)})">
${inner}
  </g>
</svg>
`;
}

// The lockup (mark + wordmark) is wide, so it is fitted mostly on width.
const landscape = recanvas(
  artworkOf("cover_1024x576.svg", 1024, 576), 1200, 628, 0.62, 0.62);

// The bare mark is square, so one fraction governs both axes.
const square = recanvas(
  artworkOf("logo_720.svg", 720, 720), 1200, 1200, 0.68, 0.68);

writeFileSync(join(HERE, "ads_landscape_1200x628.svg"), landscape, "utf8");
writeFileSync(join(HERE, "ads_logo_1200x1200.svg"), square, "utf8");

const jobs = [
  [Buffer.from(square), "dayfive_ads_logo_1200x1200.png", 1200, 1200],
  [Buffer.from(landscape), "dayfive_ads_landscape_1200x628.png", 1200, 628],
];

for (const [svg, dst, w, h] of jobs) {
  const info = await sharp(svg, { density: 384 })
    .resize(w, h, { fit: "fill" })
    .png({ compressionLevel: 9 })
    .toFile(join(HERE, dst));
  console.log(`${dst}  ${info.width}x${info.height}  ${info.size.toLocaleString()} bytes`);
}
