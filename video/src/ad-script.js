/**
 * THE 60-SECOND AD. Operator brief, 2026-09-20.
 *
 * A different film from v1, not a recut of it. v1 is calm, premium and slow —
 * "approved as craft but rejected as an ad". This one is for somebody
 * scrolling past: nineteen beats, a cut or a motion on every one, no silence
 * than a breath.
 *
 * ===========================================================================
 * THE PACE IS IN THE EDIT, NOT IN THE VOICE
 * ===========================================================================
 * The operator asked for faster, heard Liam at three paces, and chose the
 * SLOWEST — 119 spoken wpm, with 2.16 seconds of air after "Books?".
 *
 * That is the right instinct and worth writing down, because the obvious
 * reading of "more fast-paced" is "talk faster". At the API's speed ceiling
 * the model compresses its own pauses to 0.70s and the joke's beat vanishes;
 * the line stops being a wince and becomes a read. So the air stays in the
 * voice and the speed comes from the picture: the held pause after "Books?"
 * is covered by a hard cut, not by silence on a static frame.
 *
 * Every beat below therefore has a `seconds` BUDGET as well as a line. Where
 * the two disagree the picture wins and the line gets its own beat.
 *
 * ===========================================================================
 * ONE SOURCE, AGAIN
 * ===========================================================================
 * These strings are what Liam is rendered from and what any caption would be
 * generated from. Prices are NOT here — the promo card reads lib/pricing.js,
 * because a price typed into a script is a price that outlives its offer. That
 * lesson cost a re-render of v1 and the 30s cutdown.
 */

/**
 * The act clock, from the brief. These are precise and they sum to 60.
 *
 * THE BRIEF'S TWO NUMBERS DISAGREE, and this is the resolution. "~10 beats,
 * 1.5–4s each" tops out at 40 seconds; the act timings — 0–15, 15–22, 22–40,
 * 40–50, 50–60 — are exact and make 60. Ten beats cannot fill sixty seconds
 * without holding shots for six seconds each, which is the pace of the film
 * this one is replacing.
 *
 * So the acts win and the beat count rises to nineteen, every one of them
 * inside the 1.5–4s window. That is MORE cutting, not less, which is the
 * brief's actual intent: "a cut or a motion on every beat, no silence longer
 * than a breath." Nineteen beats over sixty seconds averages 3.2s.
 *
 * checkActs() below fails the build if the beats stop adding up to these.
 */
export const ACT_SECONDS = { 1: 15, 2: 7, 3: 18, 4: 10, 5: 10 };
/** Liam. Settings fixed at the take the operator chose. */
export const VOICE = {
  name: "Liam",
  id: "TX3LPaxmHKxFdv7VOQHJ",
  settings: {
    stability: 0.40,
    similarity_boost: 0.75,
    style: 0.30,
    use_speaker_boost: true,
    speed: 1.10,
  },
};

/**
 * Nineteen beats.
 *
 * `seconds` is this beat's slice of its act, used to lay the film out before
 * the audio exists and checked by checkActs(). `shot` is the operator's
 * visual, kept close to verbatim so the build can be read against the brief
 * without opening two documents.
 */
export const AD = [
  // ── ACT 1 · the pain, played for a wince-laugh (0–15s) ──────────────────
  { n: 1, act: 1, seconds: 3.0, source: "veo",
    line: "Receipts everywhere.",
    shot: "A grease-smudged thumb scrolling a bank app at 11pm." },
  { n: 2, act: 1, seconds: 2.5, source: "veo",
    line: "",
    shot: "A box of receipts tipping over on a kitchen counter." },
  { n: 3, act: 1, seconds: 3.0, source: "veo",
    line: "Statements somewhere.",
    shot: "A shoebox lid that will not close, pressed down and springing back." },
  { n: 4, act: 1, seconds: 2.5, source: "motion",
    line: "",
    shot: "Fourteen spreadsheet tabs; sticky notes multiplying across a screen edge." },
  { n: 5, act: 1, seconds: 4.0, source: "veo",
    line: "Books? … Next week. Probably.",
    shot: "A hand rubbing a face at a kitchen table; a wall calendar on the 24th." },

  // ── ACT 2 · the bank (15–22s) ───────────────────────────────────────────
  { n: 6, act: 2, seconds: 4.0, source: "veo",
    line: "Then the bank asks for last quarter's numbers —",
    shot: "A messy folder slid across a desk." },
  { n: 7, act: 2, seconds: 3.0, source: "veo",
    line: "and you've got a shoebox.",
    shot: "A hand sliding the folder straight back." },

  // ── ACT 3 · the turn, all motion, snap to bright (22–40s) ───────────────
  { n: 8, act: 3, seconds: 3.0, source: "motion",
    line: "DayFive does it for you.",
    shot: "Snap to bright. The wordmark lands." },
  { n: 9, act: 3, seconds: 3.5, source: "motion",
    line: "Send the shoebox — we'll do the rest.",
    shot: "Documents flying into place in a clean intake list." },
  { n: 10, act: 3, seconds: 2.5, source: "motion",
    line: "",
    shot: "Checkmarks cascading down the list." },
  { n: 11, act: 3, seconds: 4.0, source: "motion",
    line: "Every transaction sorted. Every account reconciled.",
    shot: "The P&L assembling line by line; figures counting up." },
  { n: 12, act: 3, seconds: 3.0, source: "motion",
    line: "Clean books, on the fifth of every month.",
    shot: "The five insights page." },
  { n: 13, act: 3, seconds: 2.0, source: "motion",
    line: "",
    shot: "The calendar snapping to five." },

  // ── ACT 4 · the promo card (40–50s) ─────────────────────────────────────
  { n: 14, act: 4, seconds: 3.5, source: "motion",
    line: "",
    shot: "PROMO CARD slams in, full frame, sound punch. Every figure read " +
          "from lib/pricing.js, never typed." },
  { n: 15, act: 4, seconds: 3.0, source: "veo",
    line: "",
    shot: "Relief: a clean printed pack handed across a counter." },
  { n: 16, act: 4, seconds: 3.5, source: "veo",
    line: "First month free.",
    shot: "A nod — head and shoulders from behind, no face." },

  // ── ACT 5 · CTA (50–60s) ────────────────────────────────────────────────
  { n: 17, act: 5, seconds: 3.5, source: "motion",
    line: "Your books. Day five. Done.",
    shot: "End card: the wordmark and the line." },
  { n: 18, act: 5, seconds: 3.5, source: "motion",
    line: "",
    shot: "getdayfive.com, held long enough to type." },
  { n: 19, act: 5, seconds: 3.0, source: "motion",
    line: "",
    shot: "The phone number, and the offer line beneath it." },
];

/**
 * The beats must add up to the act clock. Checked rather than trusted: the
 * first pass budgeted per-beat and came to 42 seconds against a 60-second
 * brief, which nobody noticed until the numbers were printed.
 */
export function checkActs() {
  const problems = [];
  for (const [act, want] of Object.entries(ACT_SECONDS)) {
    const got = AD.filter((b) => b.act === Number(act))
                  .reduce((t, b) => t + b.seconds, 0);
    if (Math.abs(got - want) > 0.01) {
      problems.push(`act ${act}: beats sum to ${got.toFixed(1)}s, clock says ${want}s`);
    }
  }
  for (const b of AD) {
    if (b.seconds < 1.5 || b.seconds > 4.0) {
      problems.push(`beat ${b.n}: ${b.seconds}s is outside the 1.5–4s window`);
    }
  }
  return problems;
}

/**
 * Beats that carry narration. Eight of the nineteen are picture only —
 * the checkmark cascade, the promo card, the URL hold — because a cut that
 * lands on silence is the thing that makes the next line land.
 */
export const SPOKEN = AD.filter((b) => b.line.trim());

export const BUDGET_SECONDS = AD.reduce((t, b) => t + b.seconds, 0);
