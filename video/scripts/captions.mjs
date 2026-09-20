/**
 * Caption timings for the burned-in cutdowns.
 *
 *   node scripts/captions.mjs
 *
 * Writes src/captions.json: per beat, a list of {text, from, to} in seconds
 * relative to that beat's audio.
 *
 * ===========================================================================
 * WHY THE TIMINGS ARE ALIGNED AND THEN RESCALED
 * ===========================================================================
 * ElevenLabs returns character-level alignment, but only from the endpoint
 * that GENERATES audio — /with-timestamps. The forced-alignment endpoint,
 * which would time the audio we already have, needs a permission this key
 * deliberately does not carry (it is Text-to-Speech only, with a credit cap,
 * which is the right shape for a key that lives in a web repo).
 *
 * So a fresh render is asked for the alignment and its audio is DISCARDED.
 * The master keeps the takes it was cut to and approved on — re-rendering
 * them would hand the operator a sign-off on a version that no longer exists,
 * which is too high a price for caption precision.
 *
 * The fresh render is the same voice, settings and text, so it is close to the
 * original but not identical. Its timings are therefore scaled by
 * (original duration / fresh duration), which anchors every caption on a real
 * phrase boundary and corrects for the difference in overall pace.
 *
 * THIS IS AN APPROXIMATION AND IS LABELLED ONE. Expect a few tens of
 * milliseconds of drift, which is well inside what a caption tolerates and
 * nowhere near what a title card would. If exact is ever wanted, re-render
 * every beat from /with-timestamps and rebuild the master on those takes —
 * one consistent set, at the cost of a fresh sign-off.
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { BEATS, CUTDOWN_BEATS, BUMPER_TEXT } from "../src/script.js";
import { logCall, STAGING } from "./spend-log.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = path.resolve(HERE, "..", "..");
const VO_DIR = path.join(STAGING, "vo");
const OUT = path.resolve(HERE, "..", "src", "captions.json");

const VOICE_ID = "EXAVITQu4vr4xnSDxMaL"; // Sarah
const MODEL = "eleven_multilingual_v2";
const SETTINGS = {
  stability: 0.55, similarity_boost: 0.75, style: 0.0,
  use_speaker_boost: true, speed: 0.96,
};

/** Longest a single caption may run on screen. */
const MAX_CHARS = 42;

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
  if (!m) throw new Error(`no duration for ${file}`);
  return Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]);
}

/**
 * Split a line into caption-sized phrases at punctuation, then at word
 * boundaries. Breaking mid-clause is what makes a caption hard to read, so
 * punctuation is preferred and the length cap is the fallback.
 */
function phrases(text) {
  const out = [];
  let current = "";
  for (const token of text.split(/(?<=[,.;:—?!])\s+/)) {
    if (!current) {
      current = token;
    } else if ((current + " " + token).length <= MAX_CHARS) {
      current += " " + token;
    } else {
      out.push(current);
      current = token;
    }
  }
  if (current) out.push(current);

  // Anything still over the cap is split on words.
  const final = [];
  for (const p of out) {
    if (p.length <= MAX_CHARS) { final.push(p); continue; }
    let line = "";
    for (const w of p.split(/\s+/)) {
      if (!line) line = w;
      else if ((line + " " + w).length <= MAX_CHARS) line += " " + w;
      else { final.push(line); line = w; }
    }
    if (line) final.push(line);
  }
  return final;
}

async function alignmentFor(text, key) {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/with-timestamps` +
    "?output_format=mp3_44100_128",
    {
      method: "POST",
      headers: { "xi-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({ text, model_id: MODEL, voice_settings: SETTINGS }),
    }
  );
  if (!res.ok) throw new Error(`alignment ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const json = await res.json();
  logCall({ provider: "elevenlabs", model: `${MODEL}/with-timestamps`,
            unit: "characters", quantity: text.length, usd: 0, exact: true,
            output: null, note: "alignment only — audio discarded" });
  return json.alignment ?? json.normalized_alignment;
}

/** Character end-times → one {text, from, to} per phrase. */
function timeThem(text, align, scale) {
  const ends = align.character_end_times_seconds;
  const starts = align.character_start_times_seconds;
  const out = [];
  let cursor = 0;
  for (const p of phrases(text)) {
    const at = text.indexOf(p, cursor);
    const i = at === -1 ? cursor : at;
    const j = Math.min(i + p.length - 1, ends.length - 1);
    out.push({
      text: p,
      from: Number((starts[i] * scale).toFixed(3)),
      to: Number((ends[j] * scale).toFixed(3)),
    });
    cursor = i + p.length;
  }
  return out;
}

async function main() {
  const key = loadKey();
  if (!key) { console.error("ELEVENLABS_API_KEY not found."); process.exit(2); }

  const data = { note: "Generated by scripts/captions.mjs. Alignment from a " +
                       "discarded re-render, rescaled onto the committed " +
                       "takes — approximate by design, see the file header.",
                 beats: {}, bumper: null };

  for (const n of CUTDOWN_BEATS) {
    const beat = BEATS.find((b) => b.n === n);
    const id = `beat${String(n).padStart(2, "0")}`;
    const real = seconds(path.join(VO_DIR, `${id}.mp3`));
    const align = await alignmentFor(beat.text, key);
    const fresh = align.character_end_times_seconds.at(-1);
    const scale = real / fresh;
    data.beats[id] = timeThem(beat.text, align, scale);
    console.log(
      `${id}: ${data.beats[id].length} captions · take ${real.toFixed(2)}s · ` +
      `fresh ${fresh.toFixed(2)}s · scale ${scale.toFixed(3)}`
    );
    for (const c of data.beats[id]) {
      console.log(`    ${c.from.toFixed(2)}–${c.to.toFixed(2)}  ${c.text}`);
    }
  }

  fs.writeFileSync(OUT, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log(`\nwritten: ${OUT}`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
