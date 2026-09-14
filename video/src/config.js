/**
 * Everything on screen that could change without the video being remade.
 *
 * Operator, 2026-09-14: "the offer line and price must be config values, not
 * baked pixels."
 *
 * The point is a re-render, not an edit. When Essentials moves off $450, or the
 * fall offer ends, or the phone number changes, this file changes and the video
 * is rendered again — nobody opens an editor, nobody re-types a number into a
 * title card, and no stale price survives in a frame somebody forgot about.
 *
 * That is the same reason the machine's pack renders from the ledger rather
 * than from a document somebody updated: a number typed twice is a number that
 * will eventually disagree with itself.
 */

export const brand = {
  url: "getdayfive.com",
  phone: "(609) 482-5663",
  wordmark: { plain: "Day", accent: "Five" },
};

export const pricing = {
  /** The list price of Essentials, as it appears on the pricing page. */
  essentials: "$450/month",
  /** The flat-price claim, beat 8. */
  flatLine: "Flat. No hourly billing.",
  /**
   * The fall offer. `active: false` drops the line from beat 8 entirely rather
   * than leaving an expired promise on screen — a video that keeps running
   * after the offer ends is the failure this config exists to prevent.
   */
  offer: {
    active: true,
    line: "Fall Offer: $299/mo for life.",
  },
  firstCloseFree: "Your first close is free.",
};

/** The end card, beat 10. */
export const endCard = {
  line: "Your books. Day five. Done.",
  url: brand.url,
  phone: brand.phone,
};

/**
 * Brand colours, read from the SITE's tokens at build time via Tailwind
 * classes wherever possible. These literals exist only for the handful of
 * places that need a colour in JS — an SVG fill, an interpolated background —
 * and each is the same hex as app/globals.css.
 *
 * A test compares them to globals.css, the same way the machine's pack
 * renderer keeps its TOKENS honest. Two copies of a palette with nothing
 * checking them is how a brand drifts.
 */
export const colors = {
  cream: "#f7f3ea",
  creamTint: "#f1e9db",
  cream200: "#e9dfcd",
  cream300: "#dbcfb7",
  navy950: "#050c17",
  navy900: "#081426",
  ink: "#0e1c31",
  ink600: "#36434f",
  ink500: "#626d7e",
  goldOnDark: "#d9ae52",
  goldOnLight: "#8a6a20",
  mist: "#e6edf7",
};

/** 1080p, 16:9, 30fps. The master's format, per the brief. */
export const MASTER = { width: 1920, height: 1080, fps: 30 };

/** The 9:16 vertical of the 30s cutdown. */
export const VERTICAL = { width: 1080, height: 1920, fps: 30 };
