/**
 * Sarah, one audio file per beat.
 *
 *   node scripts/voice-beats.mjs --dry-run
 *   node scripts/voice-beats.mjs
 *
 * WHY NOT THE ONE CONTINUOUS TAKE WE ALREADY HAVE.
 *
 * The continuous take was right for choosing a voice — one performance, no
 * seams, you hear what the whole thing sounds like. It is wrong for cutting,
 * for two reasons that only appeared once there was something to cut.
 *
 * 1. The beat boundaries would have to be GUESSED. Silence detection finds 33
 *    pauses in Sarah's read and only nine of them are beat breaks; picking
 *    which nine means snapping to expected word positions, and a snap that is
 *    out by 300ms puts a title card on the wrong word. Per-beat files make the
 *    boundary exact by construction — the beat is as long as its own audio.
 *
 * 2. The master has to run 85–90s and the narration is 66.8s, so roughly
 *    twenty seconds of deliberate silence has to go SOMEWHERE. Inside one file
 *    those gaps are whatever the model happened to leave. As separate files the
 *    gap after each beat is a number in src/timings.js — chosen, reviewable,
 *    and changeable without re-rendering audio.
 *
 * The tone-matching worry that argued for one take does not bite here: every
 * beat is a whole sentence group with a full stop at each end, so there is no
 * mid-sentence seam for a shift in delivery to show up in.
 *
 * Already-rendered beats are skipped; --force to redo one.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { BEATS } from "../src/script.js";
import { logCall, STAGING } from "./spend-log.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = path.resolve(HERE, "..", "..");
const VO_DIR = path.join(STAGING, "vo");

/** Sarah. Chosen from the two candidate takes, operator 2026-09-20. */
const VOICE = { name: "Sarah", id: "EXAVITQu4vr4xnSDxMaL" };
const MODEL = "eleven_multilingual_v2";

/** Unchanged from the take that was approved — "no rate change", operator. */
const SETTINGS = {
  stability: 0.55,
  similarity_boost: 0.75,
  style: 0.0,
  use_speaker_boost: true,
  speed: 0.96,
};

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

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");

  fs.mkdirSync(VO_DIR, { recursive: true });
  const queue = BEATS.filter((b) => {
    const exists = fs.existsSync(path.join(VO_DIR, `beat${String(b.n).padStart(2, "0")}.mp3`));
    if (exists && !force) console.log(`beat ${b.n}: already rendered, skipping`);
    return force || !exists;
  });

  const chars = queue.reduce((t, b) => t + b.text.length, 0);
  console.log(`\n${queue.length} beat(s), ${chars} characters, voice ${VOICE.name}`);

  if (chars > CREDIT_CAP) {
    console.error(`REFUSED before spending: ${chars} exceeds the ${CREDIT_CAP} cap.`);
    process.exit(1);
  }
  if (args.includes("--dry-run")) {
    console.log("--dry-run: nothing was sent, nothing was spent.");
    return;
  }

  const key = loadKey();
  if (!key) {
    console.error("ELEVENLABS_API_KEY is not in the site repo's .env.local or .env.");
    process.exit(2);
  }

  for (const beat of queue) {
    const id = `beat${String(beat.n).padStart(2, "0")}`;
    const out = path.join(VO_DIR, `${id}.mp3`);
    process.stdout.write(`${id}: `);

    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE.id}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: { "xi-api-key": key, "Content-Type": "application/json" },
        body: JSON.stringify({
          text: beat.text,
          model_id: MODEL,
          voice_settings: SETTINGS,
        }),
      }
    );

    if (!res.ok) {
      console.log(`FAILED ${res.status}: ${(await res.text()).slice(0, 200)}`);
      logCall({ provider: "elevenlabs", model: MODEL, unit: "characters",
                quantity: 0, usd: 0, exact: true, output: null,
                note: `${id}: HTTP ${res.status}` });
      continue;
    }

    fs.writeFileSync(out, Buffer.from(await res.arrayBuffer()));
    console.log(`${(fs.statSync(out).size / 1024).toFixed(0)} KB`);
    logCall({ provider: "elevenlabs", model: MODEL, unit: "characters",
              quantity: beat.text.length, usd: 0, exact: true, output: out,
              note: `${id} — ${VOICE.name}` });
  }

  console.log("\nMeasure the durations next: node scripts/measure-vo.mjs");
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
