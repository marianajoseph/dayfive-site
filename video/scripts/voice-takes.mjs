/**
 * The two candidate voice takes.
 *
 *   node scripts/voice-takes.mjs --list     # voices available, no spend
 *   node scripts/voice-takes.mjs --dry-run  # what it would cost, no spend
 *   node scripts/voice-takes.mjs            # renders both takes
 *
 * Operator, 2026-09-14: "Render the script with two candidate voices (one male,
 * one female, both in that register) and send me both takes before assembling."
 * Register: warm-neutral American, unhurried, trustworthy. Pace ~150 wpm,
 * natural pauses at the beat breaks.
 *
 * THE SCRIPT IS NOT RETYPED HERE. It is imported from src/script.js, the same
 * module the burned-in captions are generated from, so the voice and the
 * captions cannot disagree about a word.
 *
 * THE CAP IS CHECKED BEFORE THE CALL, NOT AFTER. The operator set 15,000
 * credits on this key and ElevenLabs bills one credit per character. Two takes
 * of the full script is roughly 2 x 900 characters; this refuses before
 * spending if a run would cross the cap, because a run that stops early can be
 * repeated and credits that are gone cannot be un-spent. Same rule as the
 * machine's budget guard.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BEATS, WPM } from "../src/script.js";
import { logCall, STAGING } from "./spend-log.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = path.resolve(HERE, "..", "..");

/** Operator's cap on this key. Characters, because credits are characters. */
const CREDIT_CAP = 15000;

/**
 * The two candidates. Named voices rather than ids alone, so a take can be
 * discussed by name; ids because a name is not what the API takes.
 *
 * Both sit in the warm-neutral American register the brief asks for. These are
 * ElevenLabs' own stock voices — no cloning, nobody's likeness.
 */
const CANDIDATES = [
  { key: "male", name: "Bill", id: "pqHfZKP75CvOlQylNhV4",
    why: "warm-neutral American, low and unhurried; the register of somebody explaining rather than selling" },
  { key: "female", name: "Sarah", id: "EXAVITQu4vr4xnSDxMaL",
    why: "warm-neutral American, even and calm; carries the same trust without brightness" },
];

/**
 * Voice settings for this read. Stability high because the script is a level,
 * unhurried explanation and a wandering delivery would undercut it; style at
 * zero because the brief asks for trustworthy, not performed.
 */
const SETTINGS = {
  stability: 0.55,
  similarity_boost: 0.75,
  style: 0.0,
  use_speaker_boost: true,
  speed: 0.96,           // ~150 wpm against these voices' default pace
};

const MODEL = "eleven_multilingual_v2";

/**
 * The script as one utterance, with the beat breaks left as paragraph breaks.
 *
 * Paragraph breaks are how this model is told to take a breath, so "natural
 * pauses at the beat breaks" is expressed in the text rather than by cutting
 * ten files and butting them together. A single take also keeps one continuous
 * performance — ten separately-generated lines do not match each other in tone,
 * and the seams are audible.
 */
function scriptForSpeech() {
  return BEATS.map((b) => b.text).join("\n\n");
}

function loadKey() {
  for (const file of [".env.local", ".env"]) {
    const p = path.join(SITE_ROOT, file);
    if (!fs.existsSync(p)) continue;
    const m = fs
      .readFileSync(p, "utf8")
      .match(/^\s*ELEVENLABS_API_KEY\s*=\s*(.+?)\s*$/m);
    if (m) return { key: m[1].replace(/^["']|["']$/g, ""), from: file };
  }
  return null;
}

async function main() {
  const args = process.argv.slice(2);
  const text = scriptForSpeech();
  const chars = text.length;
  const words = text.split(/\s+/).filter(Boolean).length;

  console.log(`script: ${words} words, ${chars} characters`);
  console.log(`        ~${((words / WPM) * 60).toFixed(1)}s at ${WPM} wpm`);
  console.log(`takes:  ${CANDIDATES.length} → ${chars * CANDIDATES.length} credits ` +
              `of the ${CREDIT_CAP.toLocaleString()} cap`);

  if (chars * CANDIDATES.length > CREDIT_CAP) {
    console.error(
      `\nREFUSED before spending: ${chars * CANDIDATES.length} credits exceeds ` +
        `the ${CREDIT_CAP} cap on this key.`
    );
    process.exit(1);
  }

  if (args.includes("--dry-run")) {
    console.log("\n--dry-run: nothing was sent, nothing was spent.");
    return;
  }

  const found = loadKey();
  if (!found) {
    console.error(
      "\nELEVENLABS_API_KEY is not in the site repo's .env.local or .env.\n" +
        "Put it in C:\\Users\\user\\dayfive-site\\.env.local — the same file " +
        "GOOGLE_ADS_WEBHOOK_KEY lives in. Both are gitignored.\n" +
        "Never the machine repo's .env."
    );
    process.exit(2);
  }
  console.log(`key:    read from ${found.from}`);

  if (args.includes("--list")) {
    const res = await fetch("https://api.elevenlabs.io/v1/voices", {
      headers: { "xi-api-key": found.key },
    });
    const body = await res.json();
    for (const v of body.voices ?? []) {
      console.log(`  ${v.voice_id}  ${v.name}  ${v.labels?.accent ?? ""} ` +
                  `${v.labels?.description ?? ""}`);
    }
    return;
  }

  fs.mkdirSync(STAGING, { recursive: true });

  for (const c of CANDIDATES) {
    const out = path.join(STAGING, `vo-take-${c.key}-${c.name.toLowerCase()}.mp3`);
    process.stdout.write(`\n${c.name} (${c.key}) … `);

    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${c.id}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": found.key,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: MODEL,
          voice_settings: SETTINGS,
        }),
      }
    );

    if (!res.ok) {
      console.error(`FAILED ${res.status}: ${(await res.text()).slice(0, 300)}`);
      // Logged even on failure: a call that cost nothing still happened, and a
      // ledger that only records successes cannot explain a credit balance.
      logCall({ provider: "elevenlabs", model: MODEL, unit: "characters",
                quantity: 0, usd: 0, exact: true, output: null,
                note: `${c.name}: HTTP ${res.status}` });
      continue;
    }

    fs.writeFileSync(out, Buffer.from(await res.arrayBuffer()));
    const kb = (fs.statSync(out).size / 1024).toFixed(0);
    console.log(`${kb} KB → ${out}`);

    logCall({
      provider: "elevenlabs", model: MODEL, unit: "characters",
      quantity: chars, usd: 0, exact: true, output: out,
      note: `${c.name} (${c.key}) — ${c.why}`,
    });
  }

  console.log("\nBoth takes written. Listen before anything is assembled.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
