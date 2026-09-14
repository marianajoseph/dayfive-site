/**
 * Is Veo actually available on this key?
 *
 *   node scripts/veo-probe.mjs
 *
 * Operator, 2026-09-14: "If Veo is unavailable on the key, fall back to Nano
 * Banana stills with slow Ken-Burns pans."
 *
 * That fallback is a different production — three moving b-roll shots versus
 * three stills with pans — so it is worth knowing BEFORE the beats are built
 * around one or the other. This asks and spends nothing: listing models is not
 * a generation call.
 *
 * It answers three questions and prints them plainly:
 *   1. does the key work at all
 *   2. is a Veo model listed for it
 *   3. is an image model listed, so the fallback is actually open
 *
 * A missing Veo is reported as a fact about the key, not as a failure — the
 * fallback exists precisely because this outcome was expected.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = path.resolve(HERE, "..", "..");

function loadKey() {
  for (const file of [".env.local", ".env"]) {
    const p = path.join(SITE_ROOT, file);
    if (!fs.existsSync(p)) continue;
    const m = fs
      .readFileSync(p, "utf8")
      .match(/^\s*GEMINI_API_KEY\s*=\s*(.+?)\s*$/m);
    if (m) return { key: m[1].replace(/^["']|["']$/g, ""), from: file };
  }
  return null;
}

const found = loadKey();
if (!found) {
  console.error(
    "GEMINI_API_KEY is not in the site repo's .env.local or .env.\n" +
      "Put it in C:\\Users\\user\\dayfive-site\\.env.local alongside " +
      "GOOGLE_ADS_WEBHOOK_KEY. Both are gitignored. Never the machine repo's .env."
  );
  process.exit(2);
}
console.log(`key: read from ${found.from}`);

const res = await fetch(
  "https://generativelanguage.googleapis.com/v1beta/models?pageSize=200",
  { headers: { "x-goog-api-key": found.key } }
);

if (!res.ok) {
  console.error(`\nThe key was rejected — HTTP ${res.status}`);
  console.error((await res.text()).slice(0, 400));
  process.exit(1);
}

const { models = [] } = await res.json();
const names = models.map((m) => m.name.replace(/^models\//, ""));

const veo = names.filter((n) => /veo/i.test(n));
const image = names.filter((n) => /image|imagen|banana/i.test(n));

console.log(`\n${names.length} models visible to this key.`);
console.log(`\nVEO:   ${veo.length ? veo.join("\n       ") : "none listed"}`);
console.log(`IMAGE: ${image.length ? image.join("\n       ") : "none listed"}`);

console.log(
  veo.length
    ? "\n→ Beats 1, 2 and 10 can be generated as video."
    : "\n→ Veo is not on this key. Beats 1, 2 and 10 fall back to stills with " +
        "slow Ken-Burns pans, per the brief."
);
