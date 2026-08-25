/**
 * Regenerates public/day-five-insight-in-hand.jpg.
 *
 * Places a DayFive screen onto the phone in a Pexels photograph. Run it when
 * the copy on that screen needs to change — the numbers there are quoted from
 * step 3 of "How it works" and must not drift out of sync with it.
 *
 *   curl -o base-hi.jpg https://images.pexels.com/photos/6682874/pexels-photo-6682874.jpeg
 *   node scripts/compose-insight-screen.js        # writes into this directory
 *
 * Base photo: https://www.pexels.com/photo/a-delivery-man-holding-his-mobile-phone-6682874/ by Kampus Production,
 * Pexels License — free for commercial use, no attribution required. The
 * 2.1MB original is deliberately not committed; re-fetch it with the line
 * above. Requires sharp, which arrives as a Next.js dependency.
 *
 * The phone is held at an angle steep enough that its near (left) edge is
 * ~35% longer than its far (right) edge, so an affine transform — which
 * keeps opposite edges parallel — visibly skews. This does a real projective
 * warp instead: solve the homography mapping photo coords back onto the flat
 * artwork, then inverse-sample every pixel inside the screen quad.
 *
 * The quad was measured by eye on an 1800px-wide proxy and is scaled up to
 * whatever the working image actually is, so the numbers below stay readable.
 */
const sharp = require('sharp');
const path = require('path');

const DIR = __dirname;
const BASE = path.join(DIR, 'base-hi.jpg');
const PROXY_W = 1800;                       // the width the quad was measured at
const QUAD_AT_PROXY = [[548, 309], [872, 354], [913, 491], [631, 470]];

const CW = 1170, CH = 540;                  // artwork design space, ~2.17:1
const ART_SCALE = 3;                        // render the SVG oversized, keep type crisp

// Crop for the site, also in proxy coords: phone + hand + jacket, clear of the
// out-of-focus shoulder bottom-left.
const CROP_AT_PROXY = { left: 380, top: 60, width: 1120, height: 720 };
const OUT_WIDTH = 2240;                     // 2x a ~1120px slot

const NAVY = '#081426';
const GOLD = '#d9ae52';
const MIST = '#e6edf7';
const MIST6 = '#9db0ca';

/* ---------------------------------------------------------------- artwork */

const screenSvg = `<svg xmlns="http://www.w3.org/2000/svg"
     width="${CW * ART_SCALE}" height="${CH * ART_SCALE}" viewBox="0 0 ${CW} ${CH}">
  <defs>
    <clipPath id="round"><rect x="0" y="0" width="${CW}" height="${CH}" rx="20" ry="20"/></clipPath>
    <linearGradient id="sheen" x1="0" y1="0" x2="0.75" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.13"/>
      <stop offset="0.42" stop-color="#ffffff" stop-opacity="0.03"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <g clip-path="url(#round)">
    <rect width="${CW}" height="${CH}" fill="${NAVY}"/>

    <text x="74" y="104" font-family="Segoe UI, Arial, sans-serif" font-size="43"
          font-weight="700" letter-spacing="5.5" fill="${GOLD}">DAY 5 · INSIGHT 1 OF 5</text>

    <text x="74" y="248" font-family="Segoe UI, Arial, sans-serif" font-size="95"
          font-weight="700" letter-spacing="-2" fill="${MIST}">Card fees grew 19%.</text>
    <text x="74" y="352" font-family="Segoe UI, Arial, sans-serif" font-size="95"
          font-weight="700" letter-spacing="-2" fill="${MIST}">Revenue grew 8%.</text>

    <rect x="76" y="402" width="74" height="5" fill="${GOLD}"/>

    <text x="74" y="472" font-family="Segoe UI, Arial, sans-serif" font-size="50"
          font-weight="600" fill="${MIST6}">Here&#8217;s the script for that call.</text>

    <rect width="${CW}" height="${CH}" fill="url(#sheen)"/>
  </g>
</svg>`;

/* ------------------------------------------------------------- homography */

// Transform taking photo coords (x,y) -> artwork coords (u,v):
//   u = (a x + b y + c) / (g x + h y + 1)
//   v = (d x + e y + f) / (g x + h y + 1)
function solveHomography(dst, src) {
  const M = [], rhs = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = dst[i];
    const [u, v] = src[i];
    M.push([x, y, 1, 0, 0, 0, -x * u, -y * u]); rhs.push(u);
    M.push([0, 0, 0, x, y, 1, -x * v, -y * v]); rhs.push(v);
  }
  const n = 8;
  for (let col = 0; col < n; col++) {
    let piv = col;
    for (let r = col + 1; r < n; r++) if (Math.abs(M[r][col]) > Math.abs(M[piv][col])) piv = r;
    [M[col], M[piv]] = [M[piv], M[col]];
    [rhs[col], rhs[piv]] = [rhs[piv], rhs[col]];
    const dv = M[col][col];
    if (Math.abs(dv) < 1e-12) throw new Error('degenerate quad');
    for (let c = col; c < n; c++) M[col][c] /= dv;
    rhs[col] /= dv;
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const fv = M[r][col];
      if (!fv) continue;
      for (let c = col; c < n; c++) M[r][c] -= fv * M[col][c];
      rhs[r] -= fv * rhs[col];
    }
  }
  return rhs;
}

function bilinear(buf, w, h, x, y, out) {
  const x0 = Math.floor(x), y0 = Math.floor(y);
  const fx = x - x0, fy = y - y0;
  out[0] = out[1] = out[2] = out[3] = 0;
  for (let dy = 0; dy < 2; dy++) {
    const yy = Math.min(h - 1, Math.max(0, y0 + dy));
    const wy = dy ? fy : 1 - fy;
    for (let dx = 0; dx < 2; dx++) {
      const xx = Math.min(w - 1, Math.max(0, x0 + dx));
      const wgt = (dx ? fx : 1 - fx) * wy;
      const i = (yy * w + xx) * 4;
      out[0] += buf[i] * wgt;
      out[1] += buf[i + 1] * wgt;
      out[2] += buf[i + 2] * wgt;
      out[3] += buf[i + 3] * wgt;
    }
  }
}

async function main() {
  const meta = await sharp(BASE).metadata();
  const W = meta.width, H = meta.height;
  const S = W / PROXY_W;
  const QUAD = QUAD_AT_PROXY.map(([x, y]) => [x * S, y * S]);
  console.log(`base ${W}x${H}, scale ${S.toFixed(3)}x from proxy`);

  const AW = CW * ART_SCALE, AH = CH * ART_SCALE;
  const art = await sharp(Buffer.from(screenSvg)).raw().ensureAlpha().toBuffer();

  const [a, b, c, d, e, f, g, h] = solveHomography(
    QUAD,
    [[0, 0], [AW, 0], [AW, AH], [0, AH]],
  );

  const overlay = Buffer.alloc(W * H * 4, 0);
  const xs = QUAD.map((p) => p[0]), ys = QUAD.map((p) => p[1]);
  const x0 = Math.max(0, Math.floor(Math.min(...xs)) - 2);
  const x1 = Math.min(W - 1, Math.ceil(Math.max(...xs)) + 2);
  const y0 = Math.max(0, Math.floor(Math.min(...ys)) - 2);
  const y1 = Math.min(H - 1, Math.ceil(Math.max(...ys)) + 2);

  const SS = 3; // supersample so warped edges and type stay clean
  const total = SS * SS;
  const s = [0, 0, 0, 0];

  for (let py = y0; py <= y1; py++) {
    for (let px = x0; px <= x1; px++) {
      let r = 0, gg = 0, bb = 0, aa = 0, hits = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const X = px + (sx + 0.5) / SS;
          const Y = py + (sy + 0.5) / SS;
          const den = g * X + h * Y + 1;
          const u = (a * X + b * Y + c) / den;
          const v = (d * X + e * Y + f) / den;
          if (u < 0 || v < 0 || u >= AW || v >= AH) continue;
          bilinear(art, AW, AH, u, v, s);
          r += s[0]; gg += s[1]; bb += s[2]; aa += s[3];
          hits++;
        }
      }
      if (!hits) continue;
      const i = (py * W + px) * 4;
      overlay[i] = r / hits;
      overlay[i + 1] = gg / hits;
      overlay[i + 2] = bb / hits;
      // coverage * artwork alpha * 0.965 — the last few percent lets a hint of
      // the real reflection through, so the screen reads as glass, not a decal
      overlay[i + 3] = (aa / hits) * (hits / total) * 0.965;
    }
  }

  const layer = await sharp(overlay, { raw: { width: W, height: H, channels: 4 } })
    .blur(0.6 * S) // match the photo's own softness at this scale
    .png()
    .toBuffer();

  const composed = await sharp(BASE)
    .composite([{ input: layer, top: 0, left: 0 }])
    .toBuffer();

  const crop = {
    left: Math.round(CROP_AT_PROXY.left * S),
    top: Math.round(CROP_AT_PROXY.top * S),
    width: Math.round(CROP_AT_PROXY.width * S),
    height: Math.round(CROP_AT_PROXY.height * S),
  };

  const info = await sharp(composed)
    .extract(crop)
    .resize({ width: OUT_WIDTH })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(DIR, 'day-five-insight-in-hand.jpg'));

  console.log(`final ${info.width}x${info.height}, ${(info.size / 1024).toFixed(0)}KB`);

  // proofs
  await sharp(composed)
    .extract({
      left: Math.round(440 * S), top: Math.round(200 * S),
      width: Math.round(700 * S), height: Math.round(500 * S),
    })
    .resize({ width: 1400 })
    .toFile(path.join(DIR, 'composite-zoom.png'));

  await sharp(path.join(DIR, 'day-five-insight-in-hand.jpg'))
    .resize({ width: 1000 })
    .toFile(path.join(DIR, 'site-preview.png'));

  console.log('proofs written');
}

main().catch((err) => { console.error(err); process.exit(1); });
