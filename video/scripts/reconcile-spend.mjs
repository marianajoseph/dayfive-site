/**
 * Re-cost the ledger against published rates.
 *
 *   node scripts/reconcile-spend.mjs           # show the correction
 *   node scripts/reconcile-spend.mjs --write   # rewrite the ledger's usd values
 *
 * Operator, 2026-09-20: "Reconcile the Veo spend against AI Studio billing
 * before the next generation batch and log the real rate."
 *
 * TWO DIFFERENT CLAIMS, AND THIS ONLY SETTLES ONE. The ledger's dollars were
 * arithmetic on a rate I assumed ($0.15/s) because none was published on the
 * model metadata. Google's pricing page publishes the real ones, so the
 * arithmetic can be redone honestly — but a published rate is still not a
 * BILL. The authoritative figure is the AI Studio usage page, and until
 * somebody reads it the reconciliation is half done. The ledger says which
 * half: `exact: false` on every line whose dollars came from a rate card
 * rather than from an invoice.
 *
 * That distinction is the whole reason the log records a basis per line
 * instead of a running total.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { STAGING, readLog } from "./spend-log.mjs";

const LOG = path.join(STAGING, "spend-log.jsonl");

/**
 * Published USD per second, ai.google.dev/gemini-api/docs/pricing, read
 * 2026-09-20. Audio is included in every tier — which is why the clips arrive
 * with a track we then mute: it was paid for whether wanted or not.
 */
const VEO_RATES = {
  "veo-3.1-generate-preview": { "720p": 0.40, "1080p": 0.40, "4k": 0.60 },
  "veo-3.1-fast-generate-preview": { "720p": 0.10, "1080p": 0.12, "4k": 0.30 },
  "veo-3.1-lite-generate-preview": { "720p": 0.05, "1080p": 0.08 },
};

/**
 * The first clip predates the `resolution: "1080p"` parameter and came back
 * 720p, so it was billed at the cheaper rate. Recorded by name rather than
 * guessed from the file, because the file on disk was overwritten by the
 * reshoot and no longer shows what the first call produced.
 */
const WAS_720P = new Set(["2026-09-14T17:38:01.352Z"]);

function recost(row) {
  if (row.provider !== "veo" || !row.quantity) return row.usd ?? 0;
  const table = VEO_RATES[row.model];
  if (!table) return row.usd ?? 0;
  const res = WAS_720P.has(row.at) ? "720p" : "1080p";
  return Number((row.quantity * table[res]).toFixed(4));
}

const rows = readLog();
let before = 0;
let after = 0;
const corrected = rows.map((r) => {
  const now = recost(r);
  before += r.usd ?? 0;
  after += now;
  return { ...r, usd: now, exact: false,
           rateBasis: r.provider === "veo"
             ? `published rate, ai.google.dev pricing, read 2026-09-20 ` +
               `(${WAS_720P.has(r.at) ? "720p" : "1080p"})`
             : r.rateBasis ?? null };
});

for (const r of corrected) {
  if (r.provider !== "veo") continue;
  console.log(
    `${r.at}  ${String(r.quantity).padStart(2)}s  ` +
    `${WAS_720P.has(r.at) ? "720p" : "1080p"}  $${r.usd.toFixed(2)}  ` +
    `${r.output ? path.basename(r.output) : "(failed)"}`
  );
}

console.log(
  `\nassumed  $${before.toFixed(2)}` +
  `\npublished $${after.toFixed(2)}` +
  `\ndelta     $${(after - before).toFixed(2)}`
);
console.log(
  "\nSTILL UNRECONCILED: a published rate is not a bill. Read the total on " +
  "https://aistudio.google.com/usage and, if it differs, that figure wins."
);

if (process.argv.includes("--write")) {
  fs.writeFileSync(
    LOG, corrected.map((r) => JSON.stringify(r)).join("\n") + "\n", "utf8");
  console.log(`\nledger rewritten: ${LOG}`);
} else {
  console.log("\n(--write to apply)");
}
