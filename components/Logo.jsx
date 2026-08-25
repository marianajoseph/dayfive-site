/**
 * Two marks, one geometry.
 *
 * `Mark` is the outline calendar: a tab of two even ticks, a single 2px-stroke
 * rounded frame, and the numeral 5 optically centred inside (its ink spans
 * y 12.4–22.2, centre 17.3, against the frame's interior centre of 17.5, so
 * the heavy bowl doesn't drag it low). Drawn on a 32-unit grid so the stroke
 * is a literal 2px at 32px.
 *
 * `MarkTile` is the same 5 on a solid gold tile. The outline's hairline turns
 * to mush below about 24px, so everything small — nav, favicon, document
 * letterheads, email avatars — uses the tile instead. The 5 is scaled 1.63×
 * about its own optical centre and re-seated on the tile's true centre.
 */

export function Mark({ size = 32, className = "" }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* calendar tab — two even ticks */}
      <path d="M11 3.2v3.6" />
      <path d="M21 3.2v3.6" />
      {/* frame */}
      <rect x="3" y="6.8" width="26" height="22.2" rx="5" />
      {/* the five */}
      <path d="M19.3 12.4H12.7v4.2H16a2.8 2.8 0 1 1-2.5 4" />
    </svg>
  );
}

export function MarkTile({ size = 32, className = "" }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect width="32" height="32" rx="7" fill="var(--color-gold-on-dark)" />
      <g transform="translate(16 16) scale(1.63) translate(-16 -17.3)">
        <path
          d="M19.3 12.4H12.7v4.2H16a2.8 2.8 0 1 1-2.5 4"
          fill="none"
          stroke="var(--color-navy-900)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

/**
 * Wordmark beside the tile. `tone="dark"` for cream backgrounds,
 * `tone="light"` for the navy bands.
 */
export default function Logo({ tone = "dark", className = "", markSize = 32 }) {
  const light = tone === "light";

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <MarkTile size={markSize} />
      <span
        className={`font-display text-[1.4rem] font-semibold tracking-[-0.035em] ${
          light ? "text-cream" : "text-ink"
        }`}
      >
        Day
        <span className={light ? "text-gold-on-dark" : "text-gold-on-light"}>
          Five
        </span>
      </span>
    </span>
  );
}
