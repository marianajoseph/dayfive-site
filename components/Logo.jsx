/**
 * Two marks, one geometry, drawn on a 24-unit grid.
 *
 * `Mark` is the outline calendar: two tabs, a 1.6-stroke rounded frame, and the
 * numeral set in the brand serif. Stroke width stays 1.6 in the viewBox at every
 * size, so it thickens with the mark rather than thinning out. Colour comes from
 * `currentColor` — gold-on-dark (#d9ae52) over the navy bands, gold-on-light
 * (#8a6a20) over cream and white — so the mark always matches the "Five" beside
 * it and one component serves every placement.
 *
 * `MarkTile` is the solid form, and the only place the tabs are allowed to
 * disappear. Below about 32px the outline's 1.6 stroke lands under 2px and the
 * frame turns to mush, so the favicon and the sample-document letterheads use
 * the tile instead. Its numeral is a drawn path, not text: neither an SVG
 * favicon nor a document thumbnail can be relied on to have the webfont, and a
 * path is the one form that renders identically everywhere.
 *
 * On the numeral's optical size: Fraunces carries opsz, SOFT and WONK axes, but
 * app/layout.js loads the weight axis only. SOFT and WONK default to 0, which is
 * exactly what we want, so the wonk risk is already handled. `opsz` is left at
 * its default rather than pinned to the display end — pinning it would be a
 * no-op against a font shipped without that axis, and the display end is the
 * high-contrast one, which thins hairlines at the 32–40px this mark actually
 * renders at. See the note in app/layout.js before changing that.
 */

/* The numeral for the tile, drawn on the 32-unit grid it was authored on and
   mapped into the 24-unit box by its wrapper. Bounds: x 12.25–20.95,
   y 12.30–23.85, so its centre is 16.6 / 18.07. */
const FIVE_PATH =
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

export function Mark({ size = 40, className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    >
      {/* tabs */}
      <path d="M8 2.4v2.6M16 2.4v2.6" />
      {/* frame */}
      <rect x="3.2" y="5" width="17.6" height="16.4" rx="3.2" />
      {/* numeral — text, so it is the same face as the wordmark beside it.
          y is optical, not geometric: the frame's true centre is 13.2, and a
          numeral seated there reads low. 10.4/16.6 are the spec's starting
          values, kept as given — see the note to the designer. */}
      <text
        x="12"
        y="16.6"
        textAnchor="middle"
        fill="currentColor"
        stroke="none"
        fontFamily="var(--font-fraunces), Georgia, serif"
        fontWeight="600"
        fontSize="10.4"
      >
        5
      </text>
    </svg>
  );
}

/** Solid tile. Used only below 32px, where the outline stops holding up. */
export function MarkTile({ size = 24, className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {/* 22% of 24 = 5.28 */}
      <rect width="24" height="24" rx="5.28" fill="#C9A227" />
      <g transform="translate(12 12.6) scale(0.78) translate(-16.6 -18.07)">
        <path d={FIVE_PATH} fill="#0B1A2C" />
      </g>
    </svg>
  );
}

/* Lockup metrics, from the spec:
   — gap is 40% of the mark's height
   — the wordmark's cap-height aligns to the frame's TOP EDGE, not the tabs,
     which sit at y 5 of 24.
   With line-height 1, Fraunces puts its baseline ~0.86em below the text box top
   and its cap height is ~0.73em, so the cap top sits ~0.13em down. Offsetting by
   that difference lands the caps on the frame rather than on the tabs. */
const FRAME_TOP = 5 / 24;
const CAP_TOP_FROM_BOX = 0.13;
const WORD_PX = 22.4; // 1.4rem

export default function Logo({ tone = "dark", className = "", markSize = 40 }) {
  const light = tone === "light";
  const gold = light ? "text-gold-on-dark" : "text-gold-on-light";

  return (
    <span
      className={`inline-flex items-start ${className}`}
      style={{ gap: `${markSize * 0.4}px` }}
    >
      <Mark size={markSize} className={gold} />
      <span
        className={`font-display font-semibold leading-none tracking-[-0.035em] ${
          light ? "text-cream" : "text-ink"
        }`}
        style={{
          fontSize: `${WORD_PX}px`,
          marginTop: `${markSize * FRAME_TOP - WORD_PX * CAP_TOP_FROM_BOX}px`,
        }}
      >
        Day
        <span className={gold}>Five</span>
      </span>
    </span>
  );
}
