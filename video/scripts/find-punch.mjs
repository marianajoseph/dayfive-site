/**
 * Find a clean hit in a music bed, to use as the promo card's punch.
 *
 *   node scripts/find-punch.mjs                       # analyse every bed
 *   node scripts/find-punch.mjs --track moving-up-origo.wav
 *   node scripts/find-punch.mjs --track <t> --extract 41.2
 *
 * Operator, 2026-09-21: "punch from the chosen bed; fall back to the swell if
 * no clean hit exists."
 *
 * ===========================================================================
 * WHY THE PUNCH COMES OUT OF THE BED
 * ===========================================================================
 * A stinger from another library laid over a bed is the most likely thing in
 * the whole film to sound bolted on — different room, different instruments,
 * different mastering. A hit lifted from the track already playing cannot
 * clash with it, because it is it.
 *
 * ===========================================================================
 * WHAT "CLEAN" MEANS HERE, MEASURED
 * ===========================================================================
 * Not "loud". A loud moment inside a loud passage is not a punch — it is more
 * of the same. A punch is a transient with SPACE IN FRONT OF IT: the ear reads
 * the contrast, not the level.
 *
 * So each candidate is scored on two things, both measured from the audio:
 *
 *   attack    how far the level jumps from one 20ms window to the next
 *   room      how quiet the ~400ms BEFORE it was, relative to the track
 *
 * A window scores well only if both are high. That is why the analysis decodes
 * the audio rather than reading peak levels: the second term needs the shape
 * of what came before, which a summary statistic has already thrown away.
 *
 * Decoding goes through ffmpeg to mono 8kHz signed 16-bit — a format anything
 * can produce and Node can read with a DataView. The bundled ffmpeg has no
 * `ametadata` filter, so per-window statistics are computed here rather than
 * asked of a filter chain that may not exist.
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { STAGING } from "./spend-log.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const MUSIC = path.resolve(HERE, "..", "assets", "music");
const OUT_DIR = path.join(STAGING, "punch");

const RATE = 8000;          // plenty for an energy envelope
const WINDOW = 0.020;       // 20ms
const ROOM = 0.400;         // how far back "space in front of it" looks
/** How long a punch runs. The promo card is 3.5s; a hit plus its tail. */
const PUNCH_SECONDS = 2.2;
/** Ignore the first and last few seconds — intros and outros are not hits. */
const EDGE = 4.0;

/**
 * Decode to mono 8kHz 16-bit WAV, then read the samples out of it.
 *
 * TWO THINGS THIS BUILD WILL NOT DO, both found by trying:
 *
 *   the raw `s16le` MUXER is absent — "Error initializing the muxer … Invalid
 *   argument". Remotion ships a minimal ffmpeg; the WAV muxer is there and the
 *   headerless one is not.
 *
 *   PIPING binary to stdout through `npx` returns a corrupt buffer, because
 *   npx is a Node wrapper writing to the same stdout and the shell layer does
 *   not keep the stream clean.
 *
 * So: a WAV file on disk, and the data chunk located by walking the RIFF
 * chunks rather than assuming a 44-byte header. ffmpeg writes a LIST/INFO
 * chunk into its WAVs, so "skip 44 bytes" reads metadata as audio — quietly,
 * as a burst of noise at the start of every track.
 */
function decode(file) {
  const tmp = path.join(
    STAGING, `decode-${path.parse(file).name}.wav`.replace(/[^\w.-]/g, "_"));
  fs.mkdirSync(STAGING, { recursive: true });
  spawnSync(
    "npx",
    ["remotion", "ffmpeg", "-i", `"${file}"`, "-ac", "1", "-ar", String(RATE),
     "-c:a", "pcm_s16le", "-y", `"${tmp}"`],
    { encoding: "utf8", shell: true }
  );
  if (!fs.existsSync(tmp) || fs.statSync(tmp).size < RATE * 2) {
    throw new Error(`could not decode ${path.basename(file)}`);
  }

  const wav = fs.readFileSync(tmp);
  fs.unlinkSync(tmp);

  // Walk RIFF chunks to find `data`.
  let at = 12;
  while (at + 8 <= wav.length) {
    const id = wav.toString("ascii", at, at + 4);
    const size = wav.readUInt32LE(at + 4);
    if (id === "data") return wav.subarray(at + 8, at + 8 + size);
    at += 8 + size + (size % 2);
  }
  throw new Error(`no data chunk in ${path.basename(file)}`);
}

/** RMS per 20ms window, in dBFS. */
function envelope(pcm) {
  const view = new DataView(pcm.buffer, pcm.byteOffset, pcm.byteLength);
  const per = Math.round(RATE * WINDOW);
  const out = [];
  for (let i = 0; i + per <= view.byteLength / 2; i += per) {
    let sum = 0;
    for (let j = 0; j < per; j++) {
      const s = view.getInt16((i + j) * 2, true) / 32768;
      sum += s * s;
    }
    const rms = Math.sqrt(sum / per);
    out.push(rms > 0 ? 20 * Math.log10(rms) : -90);
  }
  return out;
}

function candidates(env) {
  const roomWindows = Math.round(ROOM / WINDOW);
  const edge = Math.round(EDGE / WINDOW);
  const loudest = Math.max(...env);
  const found = [];

  for (let i = edge; i < env.length - edge; i++) {
    const attack = env[i] - env[i - 1];
    if (attack < 4) continue;                       // not a transient

    const before = env.slice(Math.max(0, i - roomWindows), i);
    const room = loudest - (before.reduce((a, b) => a + b, 0) / before.length);

    // Both terms matter, so they multiply: a big jump out of a loud passage
    // and a small jump out of silence both score poorly, which is right.
    found.push({ t: i * WINDOW, attack, room, score: attack * room,
                 level: env[i] });
  }

  // Keep the best, then thin them out — twenty candidates half a second apart
  // are one candidate.
  found.sort((a, b) => b.score - a.score);
  const kept = [];
  for (const c of found) {
    if (kept.every((k) => Math.abs(k.t - c.t) > 1.5)) kept.push(c);
    if (kept.length === 6) break;
  }
  return kept;
}

function main() {
  const args = process.argv.slice(2);
  const only = args.includes("--track") ? args[args.indexOf("--track") + 1] : null;
  const extract = args.includes("--extract")
    ? Number(args[args.indexOf("--extract") + 1]) : null;

  const tracks = fs.readdirSync(MUSIC)
    .filter((f) => /\.(wav|mp3)$/i.test(f))
    .filter((f) => !only || f === only);

  if (!tracks.length) { console.error("no tracks found"); process.exit(1); }

  if (extract !== null) {
    if (!only) { console.error("--extract needs --track"); process.exit(2); }
    fs.mkdirSync(OUT_DIR, { recursive: true });
    const out = path.join(OUT_DIR, `punch-${path.parse(only).name}-${extract}s.wav`);

    // NO FADE HERE. This build has no `afade` filter — and the fade belongs in
    // the render regardless: baked into the asset it is one fixed shape, and
    // in Remotion it is a volume curve that can be tuned against the picture
    // without re-cutting the file.
    const r = spawnSync(
      "npx",
      ["remotion", "ffmpeg", "-ss", String(extract), "-i", `"${path.join(MUSIC, only)}"`,
       "-t", String(PUNCH_SECONDS), "-c:a", "pcm_s16le", "-y", `"${out}"`],
      { encoding: "utf8", shell: true }
    );

    // VERIFIED, NOT ASSUMED. The first version ran with stdio ignored and
    // printed "punch written" for three files that were never created —
    // afade was missing and nothing looked.
    if (!fs.existsSync(out) || fs.statSync(out).size < 1000) {
      console.error(
        `FAILED to extract ${only} at ${extract}s\n` +
        (r.stderr ?? "").split("\n").slice(-3).join("\n")
      );
      process.exit(1);
    }
    console.log(`punch: ${out} (${(fs.statSync(out).size / 1024).toFixed(0)} KB)`);
    return;
  }

  for (const t of tracks) {
    console.log(`\n${t}`);
    const env = envelope(decode(path.join(MUSIC, t)));
    const cs = candidates(env);
    if (!cs.length) {
      console.log("  no clean hits — use the swell instead");
      continue;
    }
    console.log("     time   attack    room   score");
    for (const c of cs) {
      console.log(
        `  ${c.t.toFixed(2).padStart(7)}s  ${c.attack.toFixed(1).padStart(5)}dB ` +
        ` ${c.room.toFixed(1).padStart(5)}dB  ${c.score.toFixed(0).padStart(5)}`
      );
    }
  }
  console.log(
    "\nattack = jump from the previous 20ms · room = how much quieter the " +
    "400ms before it was than the track's loudest point.\nA punch needs both."
  );
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main();
