/**
 * Every generation call, what it cost, and what it produced.
 *
 * Operator, 2026-09-14: "log every generation call and cost (expect $20–40
 * total)."
 *
 * WHY A LEDGER AND NOT A RUNNING TOTAL. A number that only goes up tells you
 * what you spent; a line per call tells you what you spent it ON, which is the
 * question asked after the fact — "did we really generate that clip six times?"
 * Each entry names the provider, the model, the unit that was billed, the
 * output file, and the estimate's basis. An estimated cost is recorded AS an
 * estimate: `exact: false` means a published rate was applied to a measured
 * quantity, not that a provider told us a price.
 *
 * The log lives in staging, beside the media it describes, and never in git —
 * the same rule as the MP4s.
 */
import fs from "node:fs";
import path from "node:path";

export const STAGING = "C:\\DayFive\\staging\\video";
const LOG = path.join(STAGING, "spend-log.jsonl");

/** Published rates, recorded here so a cost line can say where it came from. */
export const RATES = {
  /**
   * ElevenLabs bills characters against a plan credit balance, not dollars per
   * call. The cap the operator set is 15,000 credits, so the meaningful unit
   * is credits and the "cost" of a take is the characters it consumed.
   */
  elevenlabs: { unit: "characters", note: "1 character = 1 credit on the TTS plan" },
  /**
   * Veo is billed per second of generated video. The rate is read from the
   * config below rather than hard-coded into a call site, so a price change is
   * one edit and the log says which rate was in force.
   */
  veo: { unit: "seconds", usdPerSecond: 0.35, note: "Veo 3 Fast, Paid Tier 1" },
};

export function logCall(entry) {
  const line = {
    at: new Date().toISOString(),
    provider: entry.provider,
    model: entry.model ?? null,
    unit: entry.unit ?? null,
    quantity: entry.quantity ?? null,
    usd: entry.usd ?? null,
    /** false = a published rate applied to a measured quantity, not a quote. */
    exact: entry.exact ?? false,
    output: entry.output ?? null,
    note: entry.note ?? null,
  };
  fs.mkdirSync(STAGING, { recursive: true });
  fs.appendFileSync(LOG, JSON.stringify(line) + "\n", "utf8");
  return line;
}

export function readLog() {
  if (!fs.existsSync(LOG)) return [];
  return fs
    .readFileSync(LOG, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((l) => JSON.parse(l));
}

export function summary() {
  const rows = readLog();
  const usd = rows.reduce((t, r) => t + (r.usd ?? 0), 0);
  const chars = rows
    .filter((r) => r.provider === "elevenlabs")
    .reduce((t, r) => t + (r.quantity ?? 0), 0);
  return { calls: rows.length, usd, elevenlabsCharacters: chars, rows };
}

// `node scripts/spend-log.mjs` prints the ledger.
if (import.meta.url === `file://${process.argv[1].replace(/\\/g, "/")}`) {
  const s = summary();
  for (const r of s.rows) {
    const cost = r.usd != null ? `$${r.usd.toFixed(2)}${r.exact ? "" : " est"}` : "—";
    console.log(
      `${r.at}  ${String(r.provider).padEnd(11)} ${String(r.model ?? "").padEnd(22)} ` +
        `${String(r.quantity ?? "").padStart(7)} ${String(r.unit ?? "").padEnd(11)} ` +
        `${cost.padStart(10)}  ${r.output ?? ""}`
    );
  }
  console.log(
    `\n${s.calls} calls · $${s.usd.toFixed(2)} estimated · ` +
      `${s.elevenlabsCharacters.toLocaleString()} ElevenLabs characters ` +
      "(cap 15,000 credits)"
  );
}
