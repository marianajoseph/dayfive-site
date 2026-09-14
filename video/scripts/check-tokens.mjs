/**
 * The video's JS colour literals must equal the site's tokens.
 *
 *   node scripts/check-tokens.mjs
 *
 * Almost everything in the video is drawn with Tailwind classes against
 * app/globals.css, so it cannot drift. The exceptions are the handful of places
 * that need a colour in JavaScript — an SVG fill, an interpolated background,
 * a gradient built from a string — and those are literals in src/config.js.
 *
 * A literal copied out of a stylesheet is a second definition of the brand.
 * The machine's pack renderer has the same problem and solves it the same way:
 * a test that fails when the site moves. src/config.js claims this check
 * exists; this file is that claim being true.
 *
 * Exits non-zero on any mismatch, so it can gate a render.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { colors } from "../src/config.js";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const GLOBALS = path.resolve(HERE, "..", "..", "app", "globals.css");

/** Which site token each JS literal is a copy of. */
const TOKEN_OF = {
  cream: "--color-cream",
  creamTint: "--color-cream-tint",
  cream200: "--color-cream-200",
  cream300: "--color-cream-300",
  navy950: "--color-navy-950",
  navy900: "--color-navy-900",
  ink: "--color-ink",
  ink600: "--color-ink-600",
  ink500: "--color-ink-500",
  goldOnDark: "--color-gold-on-dark",
  goldOnLight: "--color-gold-on-light",
  mist: "--color-mist",
};

const css = fs.readFileSync(GLOBALS, "utf8");
const site = {};
for (const m of css.matchAll(/(--color-[\w-]+)\s*:\s*([^;]+);/g)) {
  site[m[1]] = m[2].trim();
}

const problems = [];

// Every literal must match the site.
for (const [key, value] of Object.entries(colors)) {
  const token = TOKEN_OF[key];
  if (!token) {
    problems.push(
      `colors.${key} is not mapped to a site token in TOKEN_OF. Add it, or ` +
        "remove the literal — an unmapped colour is one nothing is checking."
    );
    continue;
  }
  if (!(token in site)) {
    problems.push(`${token} is no longer defined in app/globals.css`);
  } else if (site[token].toLowerCase() !== value.toLowerCase()) {
    problems.push(
      `colors.${key}: video has ${value}, site has ${site[token]} (${token})`
    );
  }
}

// And the map must not outlive the literals it describes.
for (const key of Object.keys(TOKEN_OF)) {
  if (!(key in colors)) {
    problems.push(`TOKEN_OF maps colors.${key}, which no longer exists`);
  }
}

if (problems.length) {
  console.error("The video's colours have drifted from the site:\n");
  for (const p of problems) console.error("  - " + p);
  console.error(
    "\nUpdate src/config.js to match app/globals.css. The site is the source."
  );
  process.exit(1);
}

console.log(
  `OK — ${Object.keys(colors).length} colour literals match app/globals.css.`
);
