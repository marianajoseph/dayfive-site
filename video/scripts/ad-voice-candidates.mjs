/**
 * Three male candidates for the 60-second ad, on the opening line.
 *
 *   node scripts/ad-voice-candidates.mjs --dry-run
 *   node scripts/ad-voice-candidates.mjs
 *
 * Operator brief, 2026-09-20: "male, 25–35, upbeat and conversational, a
 * slight smile in the delivery, ~170 wpm, American, no announcer polish.
 * Render three candidates on one 10-second sample of the opening line."
 *
 * WHY THESE THREE, AND WHAT WAS PASSED OVER. The library has thirteen male
 * voices; most are wrong for this in a way worth recording, because the wrong
 * ones are wrong in the direction the master already went.
 *
 *   Eric, Brian, Bill    trustworthy, resonant, "classy" — announcer polish,
 *                        which is the note the brief rules out and the
 *                        register the v1 film already occupies
 *   Adam, Harry, Callum  dominant, fierce, character work — wrong energy
 *   George, Daniel       British
 *   Charlie              Australian
 *   Roger                laid-back but middle-aged and classy; nearest miss
 *
 * That leaves Liam, Will and Chris, which happen to span the range the brief
 * describes rather than crowd one corner of it: energetic, warm-relaxed, and
 * dry-casual. Three samples of the same voice is not a choice.
 *
 * THE PACE IS MEASURED, NOT CLAIMED. `speed` is a nudge to a model, not a
 * words-per-minute setting, so each take is measured after rendering and its
 * real pace reported. Saying "~170 wpm" because a parameter was set to 1.1
 * would be asserting a number nothing checked — the same failure as a price
 * typed twice.
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { logCall, STAGING } from "./spend-log.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = path.resolve(HERE, "..", "..");
const OUT_DIR = path.join(STAGING, "ad-voice");

/** The opening line of the new ad, verbatim from the operator's brief. */
export const SAMPLE =
  "Receipts everywhere. Statements somewhere. Books? … Next week. Probably.";

const MODEL = "eleven_multilingual_v2";

/**
 * Settings aimed at the brief rather than at the master's.
 *
 * The v1 film used stability 0.55 / style 0 / speed 0.96 — level, unhurried,
 * no performance. This wants the opposite of each: lower stability lets the
 * delivery move, a little style is where "a slight smile" lives, and the speed
 * is up because 170 wpm is brisk against these voices' default.
 */
const SETTINGS = {
  stability: 0.40,
  similarity_boost: 0.75,
  style: 0.30,
  use_speaker_boost: true,
  speed: 1.10,
};

const CANDIDATES = [
  { key: "liam", name: "Liam", id: "TX3LPaxmHKxFdv7VOQHJ",
    why: "young American, confident, made for short social video — the most energetic of the three" },
  { key: "will", name: "Will", id: "bIHbv24MWmeRgasZH58o",
    why: "young American, relaxed optimist — the warmest, closest to a smile in the delivery" },
  { key: "chris", name: "Chris", id: "iP95p4xoKVk53GoZ742B",
    why: "down-to-earth and casual — the driest, the one that sounds least like an ad" },
];

const CREDIT_CAP = 15000;

function loadKey() {
  for (const file of [".env.local", ".env"]) {
    const p = path.join(SITE_ROOT, file);
    if (!fs.existsSync(p)) continue;
    const m = fs.readFileSync(p, "utf8")
      .match(/^\s*ELEVENLABS_API_KEY\s*=\s*(.+?)\s*$/m);
    if (m) return m[1].replace(/^["']|["']$/g, "");
  }
  return null;
}

function seconds(file) {
  const r = spawnSync("npx", ["remotion", "ffprobe", file],
                      { encoding: "utf8", shell: true });
  const m = `${r.stdout ?? ""}\n${r.stderr ?? ""}`
    .match(/Duration:\s*(\d+):(\d+):([\d.]+)/);
  return m ? Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]) : null;
}

async function main() {
  const args = process.argv.slice(2);
  const chars = SAMPLE.length * CANDIDATES.length;
  const words = SAMPLE.replace(/…/g, " ").split(/\s+/).filter(Boolean).length;

  console.log(`sample: ${words} words, ${SAMPLE.length} characters`);
  console.log(`"${SAMPLE}"`);
  console.log(`\n${CANDIDATES.length} candidates → ${chars} credits`);

  if (chars > CREDIT_CAP) {
    console.error("REFUSED before spending: over the credit cap.");
    process.exit(1);
  }
  if (args.includes("--dry-run")) {
    console.log("--dry-run: nothing was sent, nothing was spent.");
    return;
  }

  const key = loadKey();
  if (!key) { console.error("ELEVENLABS_API_KEY not found."); process.exit(2); }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const c of CANDIDATES) {
    const out = path.join(OUT_DIR, `ad-sample-${c.key}.mp3`);
    process.stdout.write(`\n${c.name}: `);

    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${c.id}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: { "xi-api-key": key, "Content-Type": "application/json" },
        body: JSON.stringify({ text: SAMPLE, model_id: MODEL,
                               voice_settings: SETTINGS }),
      }
    );

    if (!res.ok) {
      console.log(`FAILED ${res.status}: ${(await res.text()).slice(0, 200)}`);
      logCall({ provider: "elevenlabs", model: MODEL, unit: "characters",
                quantity: 0, usd: 0, exact: true, output: null,
                note: `ad sample ${c.name}: HTTP ${res.status}` });
      continue;
    }

    fs.writeFileSync(out, Buffer.from(await res.arrayBuffer()));
    const dur = seconds(out);
    const wpm = dur ? Math.round((words / dur) * 60) : null;
    console.log(
      `${dur ? dur.toFixed(2) + "s" : "?"} · ${wpm ?? "?"} wpm (incl. pauses) → ${path.basename(out)}`
    );

    logCall({ provider: "elevenlabs", model: MODEL, unit: "characters",
              quantity: SAMPLE.length, usd: 0, exact: true, output: out,
              note: `ad candidate ${c.name} — ${c.why}` });
  }

  console.log(
    "\nThe wpm above counts the written pause after \"Books?\" as speaking " +
    "time, so it reads slower than the delivery actually is. Compare the " +
    "three against each other rather than against the target."
  );
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
