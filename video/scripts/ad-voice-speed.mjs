/**
 * Liam at several speeds, with the pace actually measured.
 *
 *   node scripts/ad-voice-speed.mjs
 *
 * Operator, 2026-09-20: Liam, "can you make it even more fast-paced?"
 *
 * WHY THIS MEASURES INSTEAD OF GUESSING. `speed` is a nudge to a model, and
 * the obvious check — clip length — answers the wrong question on this line.
 * The script has a written pause in it ("Books? … Next week"), so a take can
 * be genuinely brisk and still measure slow, and turning the speed up to fix a
 * number that the PAUSE is producing would rush the delivery without touching
 * the thing making it feel long.
 *
 * So each take is rendered through /with-timestamps, and the character
 * alignment is used to split the clip into speech and silence. What comes back
 * is three numbers per take:
 *
 *   spoken wpm   words divided by the time actually spent speaking — the
 *                delivery's real pace, and the one the brief's "~170 wpm"
 *                is about
 *   pause        total silence inside the line
 *   clip         what it all adds up to, which is what the edit has to fit
 *
 * The audio is kept: these are candidates, not probes.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { SAMPLE } from "./ad-voice-candidates.mjs";
import { logCall, STAGING } from "./spend-log.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = path.resolve(HERE, "..", "..");
const OUT_DIR = path.join(STAGING, "ad-voice");

const LIAM = "TX3LPaxmHKxFdv7VOQHJ";
const MODEL = "eleven_multilingual_v2";

/**
 * Three takes. SPEED IS CAPPED AT 1.2 by the API — the first run asked for
 * 1.26 and 1.34 and was refused ("expected to be greater or equal to 0.7 and
 * less or equal to 1.2"). So the parameter alone cannot go much past where we
 * already were, and anything faster has to come from somewhere else: a
 * time-stretch after the fact, shorter lines, or tighter cutting.
 *
 * Stability drops as speed climbs — a fast read at high stability comes out
 * clipped and even, which is the "announcer" failure arriving by another route.
 */
const TAKES = [
  { key: "s110", speed: 1.10, stability: 0.40, note: "the take you heard" },
  { key: "s115", speed: 1.15, stability: 0.38, note: "a step up" },
  { key: "s120", speed: 1.20, stability: 0.35, note: "the API's ceiling" },
];

/** A gap this long or longer counts as a pause rather than as speech. */
const PAUSE_FLOOR = 0.09;

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

/**
 * Total silence inside the line.
 *
 * NOT from the gaps BETWEEN characters — those are always ~0. The alignment
 * attributes a pause to the character that precedes it, so a full stop
 * followed by a breath is one character with a long duration, and a
 * gap-between-characters measure reports 0.00s on a line that audibly pauses
 * three times. It did exactly that on the first run.
 *
 * So: a space or punctuation mark lasting longer than a phoneme is silence.
 */
function pauseSeconds(align) {
  const { characters, character_start_times_seconds: starts,
          character_end_times_seconds: ends } = align;
  let total = 0;
  for (let i = 0; i < characters.length; i++) {
    const dur = ends[i] - starts[i];
    const isBreak = /[\s.,;:!?…—-]/.test(characters[i]);
    if (isBreak && dur > PAUSE_FLOOR) total += dur - PAUSE_FLOOR;
  }
  return total;
}

async function main() {
  const key = loadKey();
  if (!key) { console.error("ELEVENLABS_API_KEY not found."); process.exit(2); }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const words = SAMPLE.replace(/…/g, " ").split(/\s+/).filter(Boolean).length;

  console.log(`"${SAMPLE}"`);
  console.log(`${words} words · ${TAKES.length} takes · ` +
              `${SAMPLE.length * TAKES.length} credits\n`);
  console.log("take    speed  clip    pause   speaking  spoken wpm");
  console.log("─".repeat(56));

  for (const t of TAKES) {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${LIAM}/with-timestamps` +
      "?output_format=mp3_44100_128",
      {
        method: "POST",
        headers: { "xi-api-key": key, "Content-Type": "application/json" },
        body: JSON.stringify({
          text: SAMPLE,
          model_id: MODEL,
          voice_settings: {
            stability: t.stability, similarity_boost: 0.75, style: 0.30,
            use_speaker_boost: true, speed: t.speed,
          },
        }),
      }
    );

    if (!res.ok) {
      console.log(`${t.key}: FAILED ${res.status} ${(await res.text()).slice(0, 160)}`);
      logCall({ provider: "elevenlabs", model: MODEL, unit: "characters",
                quantity: 0, usd: 0, exact: true, output: null,
                note: `liam ${t.key}: HTTP ${res.status}` });
      continue;
    }

    const json = await res.json();
    const align = json.alignment ?? json.normalized_alignment;
    const clip = align.character_end_times_seconds.at(-1);
    const pause = pauseSeconds(align);
    const speaking = clip - pause;
    const wpm = Math.round((words / speaking) * 60);

    const out = path.join(OUT_DIR, `liam-${t.key}.mp3`);
    fs.writeFileSync(out, Buffer.from(json.audio_base64, "base64"));

    console.log(
      `${t.key.padEnd(7)} ${t.speed.toFixed(2)}   ` +
      `${clip.toFixed(2)}s   ${pause.toFixed(2)}s   ` +
      `${speaking.toFixed(2)}s     ${String(wpm).padStart(3)}   ${t.note}`
    );

    logCall({ provider: "elevenlabs", model: `${MODEL}/with-timestamps`,
              unit: "characters", quantity: SAMPLE.length, usd: 0, exact: true,
              output: out,
              note: `liam speed ${t.speed} — ${wpm} spoken wpm, ${pause.toFixed(2)}s pause` });
  }

  console.log(
    "\nThe written pause after \"Books?\" is most of the `pause` column. It is " +
    "the joke's beat, so it is NOT something to tune away with speed — if the " +
    "line still feels slow at a spoken pace you like, shorten the pause in " +
    "the script rather than rushing the words around it."
  );
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
