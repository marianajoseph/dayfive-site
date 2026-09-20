/**
 * The ad's plates. Eight shots, Veo 3.1 fast, 1080p.
 *
 *   node scripts/ad-veo-clips.mjs --list        # prompts, no spend
 *   node scripts/ad-veo-clips.mjs --only ad01
 *   node scripts/ad-veo-clips.mjs
 *
 * ===========================================================================
 * HANDS ARE IN. FACES ARE NOT.
 * ===========================================================================
 * Operator brief, 2026-09-20: "people in motion, hands and workplaces — faces
 * avoided, but hands, torsos, over-shoulder are in. Veo prompts describe the
 * scene with hands present."
 *
 * This looks like a reversal of the ruling that scenes are described EMPTY,
 * and it is not. That ruling is about never NEGATING a presence — "nobody is
 * here, no hand reaches for it" put a hand in the frame. The rule underneath
 * is: the prompt body describes what is actually there, and exclusions live in
 * the negative prompt. So hands, which we want, are described; faces, which we
 * do not, are excluded there and named nowhere in the body.
 *
 * ===========================================================================
 * STILL NO TEXT A CLIENT COULD READ
 * ===========================================================================
 * Three of these shots would naturally contain writing — a banking app, a wall
 * calendar, a printed pack. Every one is framed so the writing is shape rather
 * than language: a screen as a glow of pale bands, a calendar soft and off
 * focus, pages seen edge-on. The date callout and anything else legible is set
 * in Fraunces over the top.
 *
 * THE GRADE IS BRIGHTER. The brief asks for "brighter and warmer than the
 * master (lift ~20%), still inside the brand palette" — so the look direction
 * lifts the exposure and warms it, where v1's asked for muted and shadowed.
 * Same palette, different mood: v1 was evening, this is a window.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { logCall, STAGING } from "./spend-log.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = path.resolve(HERE, "..", "..");
const CLIPS_DIR = path.join(STAGING, "ad-broll");
const MODEL = "veo-3.1-fast-generate-preview";
const USD_PER_SECOND = 0.12; // 1080p, published rate, read 2026-09-20

/**
 * Eight seconds, because 1080p requires it.
 *
 * Six was the intent — latitude to pick a moment inside a 2.5-4s cut without
 * paying for film nobody uses. The API refuses the combination: "1080p is not
 * supported for a duration of 6 seconds." The deliverable is 1080p, so the
 * duration gives way, and each clip costs a third more than planned.
 */
const SECONDS = 8;

const LOOK =
  "Clean modern digital cinematography, shallow depth of field, very subtle " +
  "grain. BRIGHT and warm: generous daylight or warm lamplight, lifted " +
  "exposure, open shadows. Palette of warm cream, pale wood and soft navy. " +
  "Handheld but steady. Full-bleed frame, no film border, no letterbox bars, " +
  "no heavy vignette.";

const NEGATIVE =
  "face, faces, facial features, eyes, mouth, portrait, head-on shot, " +
  "logos, brand names, trademarks, readable text, legible writing, letters, " +
  "words, numbers, subtitles, watermarks, captions, on-screen text, " +
  "film border, letterbox bars, heavy vignette, dark moody grade, " +
  "oversaturated colour, lens flare, glossy advertising look";

export const CLIPS = [
  {
    id: "ad01",
    beat: 1,
    prompt:
      "A hand rests on a kitchen counter late at night holding a phone; the " +
      "thumb, smudged with grease, scrolls slowly up the screen. The screen " +
      "glows pale on the fingers and shows only soft bands of light and " +
      "colour. A warm lamp burns behind. Seen close, over the shoulder.",
    note: "Act 1 — the bank app at 11pm.",
  },
  {
    id: "ad02",
    beat: 2,
    prompt:
      "A shallow cardboard box of crumpled paper receipts tips over on a pale " +
      "kitchen counter and the receipts spill across the surface in slow " +
      "motion. Bright morning light from a window. Seen close, the camera " +
      "steady.",
    note: "Act 1 — the box tipping.",
  },
  {
    id: "ad03",
    beat: 3,
    prompt:
      "Two hands press a shoebox lid down onto a box crammed with folded " +
      "paper; the lid sinks, then springs back up. Bright even daylight on a " +
      "wooden table. Close, steady.",
    note: "Act 1 — the lid that will not close.",
  },
  {
    id: "ad05",
    beat: 5,
    /**
     * RESHOT TWICE, and both failures were the same mistake — mine, against a
     * rule already in the doctrine file.
     *
     *   take 1: "seen from behind and to the side"  -> a clean profile
     *   take 2: "the head cropped away above the frame line" -> a face at the
     *           right edge
     *
     * "Describe a scene empty; never negate a presence" is not only about the
     * word "nobody". Take 2 named the head in order to exclude it, which is
     * the same move as "no hand reaches for it" — the noun lands in the scene
     * and the instruction around it does not.
     *
     * This take names a hand, a table and a calendar. Nothing else. The wince
     * is carried by the hand alone, which is what "hands and workplaces" asked
     * for, and the shot cannot contain a face because nothing in it suggests
     * one.
     */
    prompt:
      "A hand lies flat on a bright kitchen table, fingers slowly curling " +
      "into a loose fist and then releasing. The table fills the frame. A " +
      "paper wall calendar hangs far behind, soft and out of focus. Bright " +
      "warm daylight from a window.",
    note: "Act 1 — the wince, carried by the hand. Nothing else named.",
  },
  {
    id: "ad06",
    beat: 6,
    prompt:
      "A hand slides a thick, overstuffed paper folder across a pale desk " +
      "toward the camera; loose sheets fan out of it. Bright office daylight, " +
      "warm wood. Seen from above and close.",
    note: "Act 2 — the folder arriving.",
  },
  {
    id: "ad07",
    beat: 7,
    prompt:
      "A hand slides an overstuffed paper folder firmly back across a pale " +
      "desk, away from the camera. Bright office daylight. Seen from above " +
      "and close, the camera still.",
    note: "Act 2 — the folder going back.",
  },
  {
    id: "ad15",
    beat: 15,
    prompt:
      "Two hands pass a crisp, neatly squared stack of printed pages across a " +
      "counter to another pair of hands. The pages are seen edge-on, clean " +
      "and white. Bright warm daylight, pale wood.",
    note: "Act 4 — the pack handed over. Pages edge-on, nothing legible.",
  },
  {
    id: "ad16",
    beat: 16,
    prompt:
      "The back of a head and shoulders in a bright workshop, seen from " +
      "behind; they nod once, slowly, and the shoulders drop as they relax. " +
      "Warm daylight from a window ahead, out of focus.",
    note: "Act 4 — the nod, from behind.",
  },
];

function loadKey() {
  for (const file of [".env.local", ".env"]) {
    const p = path.join(SITE_ROOT, file);
    if (!fs.existsSync(p)) continue;
    const m = fs.readFileSync(p, "utf8").match(/^\s*GEMINI_API_KEY\s*=\s*(.+?)\s*$/m);
    if (m) return m[1].replace(/^["']|["']$/g, "");
  }
  return null;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function generate(clip, key) {
  const out = path.join(CLIPS_DIR, `${clip.id}.mp4`);
  process.stdout.write(`${clip.id}: submitting … `);

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predictLongRunning`,
    {
      method: "POST",
      headers: { "x-goog-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({
        instances: [{ prompt: `${clip.prompt}\n\n${LOOK}` }],
        parameters: {
          aspectRatio: "16:9",
          resolution: "1080p",
          durationSeconds: SECONDS,
          negativePrompt: NEGATIVE,
        },
      }),
    }
  );

  if (!res.ok) {
    console.log(`FAILED ${res.status}\n  ${(await res.text()).slice(0, 300)}`);
    logCall({ provider: "veo", model: MODEL, unit: "seconds", quantity: 0,
              usd: 0, exact: true, output: null,
              note: `${clip.id}: HTTP ${res.status}` });
    return null;
  }

  const op = await res.json();
  process.stdout.write("polling ");
  let done = null;
  for (let i = 0; i < 60; i++) {
    await sleep(10000);
    process.stdout.write(".");
    const poll = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/${op.name}`,
      { headers: { "x-goog-api-key": key } }
    );
    const state = await poll.json();
    if (state.done) { done = state; break; }
  }
  if (!done) { console.log(" TIMED OUT"); return null; }
  if (done.error) { console.log(` ERROR: ${done.error.message}`); return null; }

  const sample =
    done.response?.generateVideoResponse?.generatedSamples?.[0] ??
    done.response?.generatedSamples?.[0];
  const uri = sample?.video?.uri ?? sample?.uri;
  if (!uri) { console.log(" no video in response"); return null; }

  const dl = await fetch(uri, { headers: { "x-goog-api-key": key } });
  fs.mkdirSync(CLIPS_DIR, { recursive: true });
  fs.writeFileSync(out, Buffer.from(await dl.arrayBuffer()));
  console.log(` ${(fs.statSync(out).size / 1048576).toFixed(1)} MB`);

  logCall({
    provider: "veo", model: MODEL, unit: "seconds", quantity: SECONDS,
    usd: SECONDS * USD_PER_SECOND, exact: false, output: out,
    note: `${clip.id} — ${clip.note} (published rate $${USD_PER_SECOND}/s @1080p)`,
  });
  return out;
}

async function main() {
  const args = process.argv.slice(2);
  const only = args.includes("--only") ? args[args.indexOf("--only") + 1] : null;
  const force = args.includes("--force");

  let queue = only ? CLIPS.filter((c) => c.id === only) : CLIPS;
  if (!force) {
    queue = queue.filter((c) => {
      const there = fs.existsSync(path.join(CLIPS_DIR, `${c.id}.mp4`));
      if (there) console.log(`${c.id}: already on disk, skipping`);
      return !there;
    });
  }

  const secs = queue.length * SECONDS;
  console.log(
    `\n${queue.length} clip(s) x ${SECONDS}s = ${secs}s · ` +
    `~$${(secs * USD_PER_SECOND).toFixed(2)} at the published rate\n`
  );

  if (args.includes("--list")) {
    for (const c of queue) console.log(`--- ${c.id} — ${c.note}\n    ${c.prompt}\n`);
    console.log("--list: nothing sent, nothing spent.");
    return;
  }

  const key = loadKey();
  if (!key) { console.error("GEMINI_API_KEY not found."); process.exit(2); }
  for (const c of queue) await generate(c, key);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
