/**
 * The DayFive mark, to spec:
 *   · a calendar tab — two even ticks over the top edge
 *   · a single 2px-stroke rounded-rectangle frame
 *   · the numeral 5 optically centred inside
 *   · all of it in one gold stroke, nothing filled
 *
 * Drawn on a 32-unit grid so `strokeWidth={2}` is a literal 2px at the 32px
 * size the mark is used at in the header. The 5 sits at optical centre, not
 * arithmetic centre: its ink spans y 12.4–22.2 (centre 17.3) against the
 * frame's interior centre of 17.5, so the heavy bowl doesn't drag it low.
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

/**
 * Wordmark beside the mark. `tone="dark"` is the default, for cream
 * backgrounds; `tone="light"` is the cream/gold variant for the navy bands.
 */
export default function Logo({ tone = "dark", className = "", markSize = 32 }) {
  const light = tone === "light";

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Mark
        size={markSize}
        className={light ? "text-gold-400" : "text-gold-600"}
      />
      <span
        className={`font-display text-[1.4rem] font-semibold tracking-[-0.035em] ${
          light ? "text-cream" : "text-ink"
        }`}
      >
        Day
        <span className={light ? "text-gold-400" : "text-gold-700"}>Five</span>
      </span>
    </span>
  );
}
