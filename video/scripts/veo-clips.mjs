/**
 * The b-roll. Beats 1, 2 and 10, generated with Veo 3.1.
 *
 *   node scripts/veo-clips.mjs --list            # the specs, no spend
 *   node scripts/veo-clips.mjs --only beat01a    # one clip
 *   node scripts/veo-clips.mjs                   # every clip not already on disk
 *
 * Operator, 2026-09-14: "Veo via the Gemini API for beats 1, 2, 10 (4–6 clips,
 * ~5s each, cinematic, muted palette matching the site; no readable
 * third-party brands on props)." Faceless: no people on screen.
 *
 * ALREADY-GENERATED CLIPS ARE SKIPPED. A re-run costs nothing for work already
 * done, so fixing one bad clip does not re-buy the other four. --force to
 * deliberately regenerate.
 *
 * TEXT IS NOT ASKED OF VEO. Two beats want words on screen — the calendar's
 * date in beat 2 and "Your August close is ready" on the phone in beat 10 —
 * and a generative video model renders text as plausible-looking nonsense.
 * Both are generated as clean plates with no legible text and the words are
 * overlaid in Remotion, in the brand's own type. That is more reliable AND
 * brand-exact, which is the same argument as rendering the pack from the site's
 * components rather than screen-recording it.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { logCall, STAGING } from "./spend-log.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = path.resolve(HERE, "..", "..");
const CLIPS_DIR = path.join(STAGING, "broll");

/**
 * Veo 3.1 fast. The plates here are static or near-static shots of objects in
 * warm light — no complex motion, no characters, no dialogue — which is the
 * work the fast tier does as well as the full one. The full tier's advantage
 * is in the material this brief explicitly excludes.
 */
const MODEL = "veo-3.1-fast-generate-preview";

/**
 * Applied to every clip. The look the site already has: muted, warm, not
 * glossy. Repeating it per prompt would let one clip drift from the others.
 */
const LOOK =
  "Clean modern digital cinematography, shallow depth of field, very subtle " +
  "grain. Muted, desaturated palette — warm cream, aged wood, deep navy " +
  "shadows, a single warm light source. Calm and still: no camera shake, no " +
  "crash zoom. Full-bleed frame with no film border, no letterbox bars and no " +
  "heavy vignette. Documentary, not advertising.";

/**
 * Applied to every clip. The brief's two hard constraints — faceless, and no
 * third-party brands — plus the text rule above. Stated as a negative prompt
 * AND in the prompt body, because the two are enforced differently and the
 * cost of a person appearing in a "faceless" video is a reshoot.
 */
const NEGATIVE =
  "people, person, human, face, faces, hand, hands, fingers, arm, arms, body " +
  "parts, silhouette, crowd, logos, brand names, trademarks, readable text, " +
  "legible writing, subtitles, watermarks, captions, on-screen text, numbers, " +
  "film border, letterbox bars, heavy vignette, glossy advertising look, " +
  "oversaturated colour, lens flare, fast camera movement";

/**
 * THE SCENES ARE DESCRIBED EMPTY, NOT DESCRIBED AS PERSONLESS.
 *
 * The first take of beat01b said "Nobody is present, no hand reaches for it"
 * and returned a hand reaching for the phone. Naming a thing in the prompt
 * body puts it in the scene whatever the sentence around it claims — the
 * negative prompt is where exclusions belong, and the body should describe
 * only what is actually there.
 *
 * So no clip below contains the words person, hand or nobody. They describe
 * empty rooms and still objects, and NEGATIVE does the excluding.
 */
export const CLIPS = [
  {
    id: "beat01a",
    beat: 1,
    seconds: 8,
    prompt:
      "A worn cardboard shoebox sits alone on a scratched wooden workbench in " +
      "an empty room, overflowing with crumpled paper receipts and folded " +
      "statements. Late afternoon light falls across it from a window to the " +
      "left. The camera pushes in very slowly. The writing on the receipts is " +
      "soft and out of focus, never legible.",
    note: "Beat 1 opener — the shoebox.",
  },
  {
    id: "beat01b",
    beat: 1,
    seconds: 8,
    prompt:
      "Close on a dark smartphone lying face-down on a wooden workbench in an " +
      "empty room, beside a cardboard box of paper receipts. The phone buzzes " +
      "twice where it lies, shifting a few millimetres against the wood, then " +
      "goes still. Dim warm light from one side. The camera does not move.",
    note: "Beat 1 — the phone that keeps buzzing.",
  },
  {
    id: "beat02",
    beat: 2,
    seconds: 8,
    /**
     * SHOT FROM THE PAGE EDGE, deliberately. The first take framed the
     * calendar face-on and Veo filled the grid with legible nonsense —
     * "Nowr Tuu Tur Mud" across the weekday heads and numbers in no order.
     * Readable-but-wrong is worse than unreadable: it survives a glance and
     * fails a pause.
     *
     * There is no printed surface in this framing at all, so there is nothing
     * for the model to invent. The date callout the beat wants is overlaid in
     * Remotion, in the brand's own type.
     */
    prompt:
      "Extreme close-up on the edge of a thick paper wall calendar hanging in " +
      "an empty room, seen almost side-on so only the stacked edges of the " +
      "pages face the camera. One page after another lifts and falls in a " +
      "draught, the stack thinning as they turn. Soft even daylight rakes " +
      "across the paper edges. Very shallow depth of field: only the near " +
      "edge of the paper is sharp and the background is a soft wash. The " +
      "camera does not move.",
    note: "Beat 2 — time passing, shot on the page edge. Callout overlaid in Remotion.",
  },
  {
    id: "beat10a",
    beat: 10,
    seconds: 8,
    prompt:
      "An empty woodworking workshop at night, seen wide. One warm overhead " +
      "lamp pools light over a clean, bare workbench in the foreground; hand " +
      "tools hang on a pegboard behind, fading into darkness. Dust drifts " +
      "slowly through the beam of light. The camera holds still.",
    note: "Beat 10 — the workshop at night.",
  },
  {
    id: "beat10b",
    beat: 10,
    seconds: 8,
    prompt:
      "Close on a smartphone lying face-up and alone on a bare wooden " +
      "workbench in a dark, empty workshop. Its screen wakes and glows with a " +
      "soft, even, featureless light that spills onto the wood around it. The " +
      "screen shows only smooth light, with nothing written on it. A warm lamp " +
      "burns out of focus in the far background. The camera holds still.",
    note: "Beat 10 — the notification. The message is overlaid in Remotion.",
  },
];

/**
 * Veo 3.1 pricing is not published on the model metadata, so a dollar figure
 * here would be invented. Seconds ARE measured, so the ledger records seconds
 * exactly and marks the dollar estimate as unconfirmed. Reconcile against the
 * AI Studio billing page rather than trusting this number.
 */
// Published rate, ai.google.dev/gemini-api/docs/pricing, read 2026-09-20:
// veo-3.1-fast is $0.12/s at 1080p (and $0.10/s at 720p, which the first
// clip came back as before the resolution parameter was added). Audio is
// included in the price — which is why these clips arrive with a track that
// is then muted: it was paid for whether it was wanted or not.
//
// Still not a bill. scripts/reconcile-spend.mjs re-costs the ledger from this
// table and says so; the AI Studio usage page is the authority.
const ASSUMED_USD_PER_SECOND = 0.12;

function loadKey() {
  for (const file of [".env.local", ".env"]) {
    const p = path.join(SITE_ROOT, file);
    if (!fs.existsSync(p)) continue;
    const m = fs
      .readFileSync(p, "utf8")
      .match(/^\s*GEMINI_API_KEY\s*=\s*(.+?)\s*$/m);
    if (m) return m[1].replace(/^["']|["']$/g, "");
  }
  return null;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function generate(clip, key) {
  const out = path.join(CLIPS_DIR, `${clip.id}.mp4`);

  const body = {
    instances: [{ prompt: `${clip.prompt}\n\n${LOOK}` }],
    parameters: {
      aspectRatio: "16:9",
      // 1080p ASKED FOR EXPLICITLY. The first clip came back 1280x720 — the
      // model's default — and the master is a 1080p deliverable. Upscaling a
      // 720p plate is visible on wood grain and paper texture, which is most
      // of what these shots are.
      resolution: "1080p",
      durationSeconds: clip.seconds,
      negativePrompt: NEGATIVE,
      // NEITHER generateAudio NOR personGeneration IS ACCEPTED HERE.
      // veo-3.1-fast rejects both outright ("isn't supported by this model",
      // "dont_allow for personGeneration is currently not supported").
      //
      // Two consequences worth stating rather than discovering later:
      //   - the clips arrive WITH a generated audio track. It is muted in the
      //     assembly; the video carries Sarah's narration and a music bed, and
      //     Veo's invented room tone under a voice track is a third layer
      //     nobody asked for.
      //   - "no people on screen" is no longer enforceable at the API. It
      //     rests on the prompt and the negative prompt, which are requests,
      //     not guarantees — so every clip is WATCHED before it is used. A
      //     faceless brief is not satisfied by having asked for facelessness.
    },
  };

  process.stdout.write(`${clip.id}: submitting … `);
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predictLongRunning`,
    {
      method: "POST",
      headers: { "x-goog-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const text = (await res.text()).slice(0, 500);
    console.log(`FAILED ${res.status}`);
    console.log(`  ${text}`);
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
    if (state.done) {
      done = state;
      break;
    }
  }

  if (!done) {
    console.log(" TIMED OUT after 10 minutes");
    logCall({ provider: "veo", model: MODEL, unit: "seconds",
              quantity: clip.seconds, usd: null, exact: false, output: null,
              note: `${clip.id}: operation did not complete in 10 minutes` });
    return null;
  }

  if (done.error) {
    console.log(` ERROR: ${done.error.message}`);
    logCall({ provider: "veo", model: MODEL, unit: "seconds", quantity: 0,
              usd: 0, exact: true, output: null,
              note: `${clip.id}: ${done.error.message}` });
    return null;
  }

  const sample =
    done.response?.generateVideoResponse?.generatedSamples?.[0] ??
    done.response?.generatedSamples?.[0] ??
    done.response?.videos?.[0];
  const uri = sample?.video?.uri ?? sample?.uri;
  if (!uri) {
    console.log(" no video in the response");
    console.log(JSON.stringify(done.response ?? done, null, 1).slice(0, 700));
    return null;
  }

  const dl = await fetch(uri, { headers: { "x-goog-api-key": key } });
  fs.mkdirSync(CLIPS_DIR, { recursive: true });
  fs.writeFileSync(out, Buffer.from(await dl.arrayBuffer()));
  const mb = (fs.statSync(out).size / 1024 / 1024).toFixed(1);
  console.log(` ${mb} MB → ${out}`);

  logCall({
    provider: "veo", model: MODEL, unit: "seconds", quantity: clip.seconds,
    usd: clip.seconds * ASSUMED_USD_PER_SECOND, exact: false, output: out,
    note: `${clip.id} — ${clip.note} (rate assumed $${ASSUMED_USD_PER_SECOND}/s, ` +
          "reconcile against AI Studio billing)",
  });
  return out;
}

async function main() {
  const args = process.argv.slice(2);
  const only = args.includes("--only") ? args[args.indexOf("--only") + 1] : null;
  const force = args.includes("--force");

  let queue = only ? CLIPS.filter((c) => c.id === only) : CLIPS;
  if (only && !queue.length) {
    console.error(`no clip called ${only}. Known: ${CLIPS.map((c) => c.id).join(", ")}`);
    process.exit(1);
  }

  if (!force) {
    queue = queue.filter((c) => {
      const exists = fs.existsSync(path.join(CLIPS_DIR, `${c.id}.mp4`));
      if (exists) console.log(`${c.id}: already on disk, skipping (--force to redo)`);
      return !exists;
    });
  }

  const seconds = queue.reduce((t, c) => t + c.seconds, 0);
  console.log(
    `\n${queue.length} clip(s), ${seconds}s total, model ${MODEL}` +
      `\nassumed ~$${(seconds * ASSUMED_USD_PER_SECOND).toFixed(2)} ` +
      "(rate unconfirmed — reconcile against AI Studio billing)\n"
  );

  if (args.includes("--list")) {
    for (const c of queue) {
      console.log(`--- ${c.id} (beat ${c.beat}, ${c.seconds}s) — ${c.note}`);
      console.log(`    ${c.prompt}\n`);
    }
    console.log("--list: nothing was sent, nothing was spent.");
    return;
  }

  const key = loadKey();
  if (!key) {
    console.error("GEMINI_API_KEY is not in the site repo's .env.local or .env.");
    process.exit(2);
  }

  for (const c of queue) await generate(c, key);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
