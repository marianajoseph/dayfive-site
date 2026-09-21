/**
 * The ad's plates. Nine shots, Veo 3.1 fast, 1080p.
 *
 *   node scripts/ad-veo-clips.mjs --list        # prompts, no spend
 *   node scripts/ad-veo-clips.mjs --only ad01
 *   node scripts/ad-veo-clips.mjs
 *
 * ===========================================================================
 * FACES ARE IN. Operator ruling, 2026-09-20, superseding "faces avoided"
 * FOR THIS FILM.
 * ===========================================================================
 * "That rule protects the founder's identity, not the film's characters;
 * generated actors are fine."
 *
 * Worth stating plainly, because the earlier rule was applied hard and cost
 * three takes on one shot. It was never a rule about photography — it was
 * about not putting a real person's likeness on a company's advertising, and
 * a generated actor is nobody's likeness. The DOCTRINE is unchanged: describe
 * what should be in frame, never what should not. Faces are now something
 * that should be, so they are described.
 *
 * ===========================================================================
 * SIX CHARACTERS, AND THREE OF THEM TWICE
 * ===========================================================================
 * The film is a before and an after, so the cast has to be recognisable
 * across the cut:
 *
 *   the contractor     kitchen table at 11pm   ->  his truck, laptop, smiling
 *   the bakery owner   buried in receipts      ->  the bank desk, pack in hand
 *   the freelancer     head in hand, 14 tabs   ->  closing the laptop, done
 *
 * Plus the banker — across the desk from the owner in act 2, nodding at her
 * in act 4 — and a fourth owner squinting at a spreadsheet.
 *
 * Gender, race and age vary deliberately across them, "so different viewers
 * see themselves", and every setting is an American small business.
 *
 * ===========================================================================
 * STILL NO TEXT A CLIENT COULD READ
 * ===========================================================================
 * That rule is NOT superseded, and it bites harder here: most of these shots
 * contain a screen or a document. Each is described as rows, columns and pale
 * blocks — structure without language — and "too small to read". The real
 * pack, legible and correct, is on screen in the motion beats either side of
 * these.
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

/** Eight seconds: 1080p refuses six. */
const SECONDS = 8;

const LOOK =
  "Clean modern digital cinematography, shallow depth of field, very subtle " +
  "grain. BRIGHT and warm: generous daylight or warm lamplight, lifted " +
  "exposure, open shadows. Palette of warm cream, pale wood and soft navy. " +
  "Handheld but steady. Full-bleed frame, no film border, no letterbox bars, " +
  "no heavy vignette. Documentary, not advertising.";

/**
 * Faces are gone from this list. What remains is text and treatment — the
 * rules that did not change — plus the emotional ceiling the brief set:
 * "concern, fatigue, mild despair — no tears, no comedy mugging."
 */
const NEGATIVE =
  "logos, brand names, trademarks, readable text, legible writing, letters, " +
  "words, numbers, spreadsheet with visible figures, subtitles, watermarks, " +
  "captions, on-screen text, film border, letterbox bars, heavy vignette, " +
  "dark moody grade, oversaturated colour, lens flare, glossy advertising " +
  "look, crying, tears, exaggerated expression, comedic mugging";

export const CLIPS = [
  /* ── ACT 1 · worry ────────────────────────────────────────────────────── */
  {
    id: "ad01",
    beat: 1,
    prompt:
      "A Latino man in his late thirties in a work shirt sits at a kitchen " +
      "table late at night, lit by one warm lamp and the glow of the phone in " +
      "his hand. He stares at the screen, jaw tight, tired. The screen shows " +
      "only soft bands of pale colour. Loose paper receipts cover the table " +
      "around him. Medium close-up.",
    note: "Act 1 — the contractor at 11pm.",
  },
  {
    id: "ad02",
    beat: 2,
    prompt:
      "A Black woman in her thirties wearing a baker's apron stands at a " +
      "counter in a small bakery, surrounded by piles and piles of paper " +
      "receipts. She presses her fingertips to her temples and closes her " +
      "eyes for a moment. Bright morning daylight through a shop window. " +
      "Medium shot.",
    note: "Act 1 — the bakery owner, buried.",
  },
  {
    id: "ad03",
    beat: 3,
    prompt:
      "A young East Asian woman in her mid-twenties sits at a small desk in a " +
      "bright apartment, one hand holding up her forehead, looking at an open " +
      "laptop. The laptop screen shows a long row of small identical tabs and " +
      "pale blocks, too small to read. Notebooks and sticky notes crowd the " +
      "desk. Bright daylight. Medium close-up.",
    note: "Act 1 — the freelancer and her fourteen tabs.",
  },
  {
    id: "ad05",
    beat: 5,
    prompt:
      "A white man in his fifties in a checked shirt leans toward a desktop " +
      "monitor in a small workshop office, frowning, eyebrows drawn, clearly " +
      "not following what he is looking at. The monitor shows a pale grid of " +
      "rows and columns, too small to read. Stacks of paper fill the desk " +
      "beside him. Bright daylight. Medium close-up.",
    note: "Act 1 — the spreadsheet he does not understand.",
  },

  /* ── ACT 2 · the bank ─────────────────────────────────────────────────── */
  {
    id: "ad06",
    beat: 6,
    prompt:
      "A South Asian woman in her forties in a smart blazer sits behind a " +
      "desk in a bright bank branch, speaking and gesturing politely toward " +
      "the camera side of the desk. Across from her, seen from behind over " +
      "the shoulder, a woman in a baker's apron sits with a thick, " +
      "overstuffed paper folder in front of her. Bright daylight. Medium shot.",
    note: "Act 2 — the bank asks.",
  },
  {
    id: "ad07",
    beat: 7,
    prompt:
      "A Black woman in her thirties in a baker's apron sits at a bank desk " +
      "and slides a thick, overstuffed paper folder across the desk away from " +
      "her, then sits back with a small resigned shrug, embarrassed. Loose " +
      "sheets fan out of the folder. Bright daylight. Medium close-up.",
    note: "Act 2 — the shoebox, handed over.",
  },

  /* ── ACT 3–4 · relief. The same people, transformed. ──────────────────── */
  {
    id: "ad13",
    beat: 13,
    prompt:
      "A young East Asian woman in her mid-twenties at a tidy desk in a " +
      "bright apartment closes her laptop with one hand, sits back and gives " +
      "a small satisfied nod, smiling to herself. The desk is clear. Bright " +
      "afternoon daylight. Medium close-up.",
    note: "Act 3 — the freelancer, done.",
  },
  {
    id: "ad15",
    beat: 15,
    prompt:
      "A Black woman in her thirties in a baker's apron hands a crisp, neatly " +
      "squared stack of printed pages across a bank desk to a South Asian " +
      "woman in her forties in a blazer, who takes it and nods, impressed. " +
      "Both are smiling. The pages are clean and white with faint even rows " +
      "of pale blocks, too small to read. Bright daylight in a bank branch. " +
      "Medium shot.",
    note: "Act 4 — the pack across the bank desk.",
  },
  {
    id: "ad16",
    beat: 16,
    prompt:
      "A Latino man in his late thirties in a work shirt sits in the driver " +
      "seat of a pickup truck with the door open, an open laptop resting on " +
      "the steering wheel. He looks at the screen and smiles, relaxed, then " +
      "nods once. The screen shows a clean document of neat pale rows, too " +
      "small to read. Bright daylight outside the truck. Medium close-up.",
    note: "Act 4 — the contractor in his truck. Replaces the shot that read " +
          "as a volunteer rather than an owner.",
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

  let made = 0;
  for (const c of queue) {
    if (await generate(c, key)) made += 1;
  }

  // EXIT NON-ZERO WHEN NOTHING WAS MADE.
  //
  // A run where all nine calls returned 429 exited 0 and reported success to
  // the shell, which is how a batch failure looked like a completed batch.
  // Worse, the caller had already deleted the previous plates to force a
  // regenerate — so "exit 0, directory empty" was the state, and only the
  // committed copies under assets/ made it recoverable.
  if (made === 0 && queue.length > 0) {
    console.error(
      `\nNOTHING WAS GENERATED — ${queue.length} clip(s) all failed. The ` +
      "previous plates, if any, are in video/assets/ad-broll/."
    );
    process.exit(1);
  }
  if (made < queue.length) {
    console.error(`\n${queue.length - made} of ${queue.length} clip(s) failed.`);
    process.exit(1);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
