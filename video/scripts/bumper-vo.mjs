/**
 * The 15-second bumper's line, in Liam's voice.
 *
 *   node scripts/bumper-vo.mjs
 *
 * The bumper has its own copy — it is not four beats of the ad played fast.
 * A bumper has to work for somebody who has never seen the long film, so it
 * states the whole offer in one sentence rather than assuming any setup.
 *
 * Same voice and settings as the ad, so the three deliverables sound like one
 * campaign rather than three attempts at one.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { BUMPER_TEXT } from "../src/script.js";
import { VOICE } from "../src/ad-script.js";
import { logCall, STAGING } from "./spend-log.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = path.resolve(HERE, "..", "..");
const OUT = path.join(STAGING, "ad-vo", "bumper.mp3");
const MODEL = "eleven_multilingual_v2";

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
  const key = loadKey();
  if (!key) { console.error("ELEVENLABS_API_KEY not found."); process.exit(2); }

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE.id}/with-timestamps` +
    "?output_format=mp3_44100_128",
    { method: "POST",
      headers: { "xi-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({ text: BUMPER_TEXT, model_id: MODEL,
                             voice_settings: VOICE.settings }) });

  if (!res.ok) {
    console.error(`FAILED ${res.status}: ${(await res.text()).slice(0, 200)}`);
    logCall({ provider: "elevenlabs", model: MODEL, unit: "characters",
              quantity: 0, usd: 0, exact: true, output: null,
              note: `bumper: HTTP ${res.status}` });
    process.exit(1);
  }

  const j = await res.json();
  const align = j.alignment ?? j.normalized_alignment;
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, Buffer.from(j.audio_base64, "base64"));

  const dur = align.character_end_times_seconds.at(-1);
  console.log(`"${BUMPER_TEXT}"`);
  console.log(`${dur.toFixed(2)}s → ${OUT}`);
  console.log(`\nPut this in src/bumper-timing.json by hand? No — it is printed ` +
              `so the\ncomposition can be written against a measured number ` +
              `rather than a guess.`);

  logCall({ provider: "elevenlabs", model: `${MODEL}/with-timestamps`,
            unit: "characters", quantity: BUMPER_TEXT.length, usd: 0,
            exact: true, output: OUT,
            note: `bumper — ${VOICE.name} @${VOICE.settings.speed}, ${dur.toFixed(2)}s` });
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
