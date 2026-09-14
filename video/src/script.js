/**
 * The script, verbatim. Operator, 2026-09-14: "Script (final, verbatim — no
 * rewrites)."
 *
 * ONE SOURCE FOR THE NARRATION AND THE CAPTIONS.
 * The ElevenLabs voiceover is rendered from these strings and the burned-in
 * captions are generated from these strings, so a caption cannot disagree with
 * what the voice says — there is no second copy of the script to drift from.
 * The same shape as the pack's Figure type: not two things kept in step, one
 * thing used twice.
 *
 * `text` is what is spoken and captioned, and nothing else reads it. Beat
 * visuals live beside it in `visual` as a note to the component author; they
 * are documentation, never rendered.
 */

/** Words per minute the voice is directed at. Used to estimate beat timing. */
export const WPM = 150;

export const BEATS = [
  {
    n: 1,
    text: "Every month, the same ritual. Receipts in a box. Statements somewhere in your inbox. And a bookkeeper who'll get to it… eventually.",
    visual: "Veo b-roll: a shoebox of receipts on a workbench, a phone buzzing beside it.",
    source: "veo",
  },
  {
    n: 2,
    text: "By the time your numbers show up, the month they describe is already gone.",
    visual: "A calendar flipping past the 20th; text callout 'Books arrive three weeks late — too late to matter.'",
    source: "veo",
  },
  {
    n: 3,
    text: "DayFive works differently. Send us your statements and receipts — a shoebox is fine.",
    visual: "Cut to black; 'DayFive.' wordmark; then documents flowing into a clean intake list, each getting a checkmark.",
    source: "motion",
  },
  {
    n: 4,
    text: "Every transaction is categorized. Every account is reconciled to the cent. And every number is independently double-checked before you ever see it.",
    visual: "Screen capture of the REAL sample pack: the P&L scrolling.",
    source: "motion",
  },
  {
    n: 5,
    text: "Not a guess — a receipt behind every line.",
    visual: "One P&L line highlights and its receipt citation slides in.",
    source: "motion",
  },
  {
    n: 6,
    text: "By the fifth business day, your books are closed: a P&L, a balance sheet, and five plain-English insights about what actually happened in your business.",
    visual: "The five insights page; text 'Day five. Every month.'",
    source: "motion",
  },
  {
    n: 7,
    text: "Have a question about your numbers? Ask any day. You'll get a written answer — from your actual books.",
    visual: "A simple chat-style Q&A card in brand style (no fake product UI beyond what exists).",
    source: "motion",
  },
  {
    n: 8,
    text: "One flat monthly price. No hourly meters. No surprise invoices. And your first close is free.",
    visual: "Text '$450/month. Flat. No hourly billing.' then 'Fall Offer: $299/mo for life.'",
    source: "motion",
  },
  {
    n: 9,
    text: "Your books, always yours — export everything, cancel anytime.",
    visual: "An export/download motion, the word 'Yours.'",
    source: "motion",
  },
  {
    n: 10,
    text: "DayFive. Your books. Day five. Done. — getdayfive.com",
    visual: "Veo b-roll: workshop at night, a phone lighting up 'Your August close is ready' → end card.",
    source: "veo",
  },
];

/**
 * The 30s cutdown is "the last four beats" — operator's words. Named by beat
 * number rather than sliced with an index, so a beat inserted into the middle
 * of the script cannot silently change which four the cutdown carries.
 */
export const CUTDOWN_BEATS = [7, 8, 9, 10];

/** The 15s bumper. Its own copy, not a beat of the master. */
export const BUMPER_TEXT =
  "Books closed by day five. Flat price. First close free. DayFive.";

/** Rough spoken length of a line, for laying beats out before audio exists. */
export function estimateSeconds(text) {
  // The ellipsis in beat 1 is a directed pause, not a word.
  const words = text.replace(/…/g, " ").split(/\s+/).filter(Boolean).length;
  return (words / WPM) * 60;
}

export const FULL_SCRIPT = BEATS.map((b) => b.text).join("\n\n");
