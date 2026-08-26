/**
 * One mark: an outline calendar in gold, with a serif 5 inside.
 *
 * The tab is two ticks; the frame is a single 2px-stroke rounded rectangle on a
 * 32-unit grid, so the stroke is a literal 2px at 32px. Everything takes its
 * colour from `currentColor`, so the caller sets gold-on-light over cream and
 * gold-on-dark over the navy bands, and the mark always matches the "Five" in
 * the wordmark beside it.
 *
 * The 5 is a filled path rather than live text. It has to render identically in
 * three places that cannot load a webfont — the SVG favicon, the OG card (drawn
 * by Satori with no serif available) and the document letterheads — and a path
 * is the only thing all of them agree on. Its own bounds are x 12.25–20.95,
 * y 12.30–23.85, so it is seated on the frame's interior centre and scaled to
 * 0.9 to leave air inside the frame.
 *
 * Keep this geometry in step with app/icon.svg and the mark in
 * app/opengraph-image.js, which are hand-copies of it for the same reason.
 */

const FIVE =
  "M12.75 12.30 H19.95 V13.70 H14.35 " +
  "C14.20 14.90 14.08 15.85 13.98 16.62 " +
  "C14.95 16.15 15.95 15.92 16.90 15.92 " +
  "C19.35 15.92 20.95 17.45 20.95 19.70 " +
  "C20.95 22.10 19.10 23.85 16.45 23.85 " +
  "C14.55 23.85 13.05 23.00 12.25 21.60 " +
  "L13.35 20.85 " +
  "C13.95 22.00 15.05 22.70 16.40 22.70 " +
  "C18.25 22.70 19.45 21.45 19.45 19.75 " +
  "C19.45 18.10 18.35 17.00 16.65 17.00 " +
  "C15.45 17.00 14.35 17.45 13.35 18.30 " +
  "L12.30 17.85 Z";

export function Mark({ size = 32, className = "" }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* calendar tab — two even ticks */}
        <path d="M9.5 3.2v3.6" />
        <path d="M22.5 3.2v3.6" />
        {/* frame */}
        <rect x="3" y="6.8" width="26" height="22.2" rx="5" />
      </g>
      {/* the five */}
      <g transform="translate(16 17.9) scale(0.9) translate(-16.6 -18.07)">
        <path d={FIVE} fill="currentColor" />
      </g>
    </svg>
  );
}

/**
 * Wordmark beside the mark. `tone="dark"` for cream backgrounds,
 * `tone="light"` for the navy bands. The mark takes the same gold as "Five",
 * so the two never drift apart.
 */
export default function Logo({ tone = "dark", className = "", markSize = 32 }) {
  const light = tone === "light";
  const gold = light ? "text-gold-on-dark" : "text-gold-on-light";

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Mark size={markSize} className={gold} />
      <span
        className={`font-display text-[1.4rem] font-semibold tracking-[-0.035em] ${
          light ? "text-cream" : "text-ink"
        }`}
      >
        Day
        <span className={gold}>Five</span>
      </span>
    </span>
  );
}
