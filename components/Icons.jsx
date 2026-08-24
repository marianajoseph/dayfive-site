/**
 * Hand-drawn line icons.
 *
 * All one weight, all round-capped, all slightly imperfect — the curves are
 * deliberately not symmetrical and several sit at a degree or two off true.
 * They should read as drawn by a person with a decent pen, never as corporate
 * clip-art. Nothing here is filled.
 */

function Icon({ children, size = 28, className = "", tilt = 0, label }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={`ink-stroke ${className}`}
      style={tilt ? { transform: `rotate(${tilt}deg)` } : undefined}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : "true"}
      focusable="false"
    >
      {children}
    </svg>
  );
}

/* ── step 1: order online — a page with a signature scrawled across it ──── */
export function SignedPage(props) {
  return (
    <Icon {...props} tilt={-1.5}>
      <path d="M6.3 3.5h7.2l4.5 4.5v9.3a1.5 1.5 0 0 1-1.5 1.5H6.3a1.4 1.4 0 0 1-1.5-1.4V5a1.5 1.5 0 0 1 1.5-1.5z" />
      <path d="M13.4 3.6v4.4h4.4" />
      <path d="M7.7 15.4c1.2-2.5 2.1-3.7 2.8-3.5.7.2.2 2.4.9 2.6.8.2 1.5-2.9 2.4-2.8.7.1.4 1.9 1.1 2 .5.1 1-.4 1.5-1.1" />
      <path d="M18.4 20.8c1.4-.5 2.4-.4 3.1.2" />
    </Icon>
  );
}

/* ── step 2: forward us the mess — a shoebox, lid ajar, paper poking out ── */
export function Shoebox(props) {
  return (
    <Icon {...props} tilt={1.5}>
      {/* sheets escaping under the lid */}
      <path d="M8.9 8.2 8.1 4.7l4.3-1 .9 3.4" />
      <path d="M13.6 7.6 15 5l3.1 1.7-1 1.9" />
      {/* lid, sitting a touch crooked */}
      <path d="M2.7 11.2 3.2 8.1l17.8-.6.6 3.2z" />
      {/* box */}
      <path d="M4.1 11.4 5.3 20a1 1 0 0 0 1 .9h11.5a1 1 0 0 0 1-.9l1.1-8.6" />
      <path d="M9.1 15.4h5.9" />
    </Icon>
  );
}

/* ── step 3: what lands — an envelope with a small spark beside it ─────── */
export function EnvelopeSpark(props) {
  return (
    <Icon {...props} tilt={-1}>
      <path d="M3.4 7.1h16.2a1.3 1.3 0 0 1 1.3 1.3v9.3a1.3 1.3 0 0 1-1.3 1.3H3.4a1.3 1.3 0 0 1-1.3-1.3V8.4a1.3 1.3 0 0 1 1.3-1.3z" />
      <path d="M2.4 8.2 10.7 14a1.5 1.5 0 0 0 1.7 0l8.3-5.9" />
      <path d="M21.3 2.6v2.5M20 3.8h2.6" />
    </Icon>
  );
}

/* ── "no calendar links" — a calendar with a soft strike through it ────── */
export function CalendarStruck(props) {
  return (
    <Icon {...props} tilt={-1}>
      <path d="M8.1 3.4v3.3M16 3.4v3.3" />
      <path d="M4.3 6.5h15.4a1.4 1.4 0 0 1 1.4 1.4v11.2a1.4 1.4 0 0 1-1.4 1.4H4.3a1.4 1.4 0 0 1-1.4-1.4V7.9a1.4 1.4 0 0 1 1.4-1.4z" />
      <path d="M3 10.6h18" />
      <path d="M6.7 14.1h1.7M11.2 14.1h1.7M15.7 14.1h1.7M6.7 17.4h1.7M11.2 17.4h1.7" />
      {/* the strike — drawn by hand, so it bows */}
      <path d="M3.4 20.7C8.2 16.5 14.8 10.9 21 5.9" />
    </Icon>
  );
}

/* ── the 24/7 part — a crescent moon and two small stars ───────────────── */
export function Moon(props) {
  return (
    <Icon {...props} tilt={2}>
      <path d="M20.1 15.1A8.3 8.3 0 0 1 9.4 4.4a8.5 8.5 0 1 0 10.7 10.7z" />
      <path d="M17.4 3.9v1.9M16.5 4.8h1.9" />
      <path d="M21.2 8.1v1.3M20.6 8.7h1.3" />
    </Icon>
  );
}

/* ── security — a padlock ──────────────────────────────────────────────── */
export function Lock(props) {
  return (
    <Icon {...props} tilt={-1}>
      <path d="M5.5 10.5h13a1.3 1.3 0 0 1 1.3 1.3v7.4a1.3 1.3 0 0 1-1.3 1.3h-13a1.3 1.3 0 0 1-1.3-1.3v-7.4a1.3 1.3 0 0 1 1.3-1.3z" />
      <path d="M8 10.3V7.9a4 4 0 0 1 8 .1v2.3" />
      <path d="M12 14.1v2.5" />
    </Icon>
  );
}

/* ── the problem — a clock running late ────────────────────────────────── */
export function Clock(props) {
  return (
    <Icon {...props} tilt={1.5}>
      <path d="M12 3.4a8.6 8.6 0 1 1-.1 17.2A8.6 8.6 0 0 1 12 3.4z" />
      <path d="M12 7.1V12l3.7 2.3" />
    </Icon>
  );
}

/* ── first close free — a price tag with nothing on it ─────────────────── */
export function Tag(props) {
  return (
    <Icon {...props} tilt={-2}>
      <path d="M20.6 3.4h-7.4L3.6 13.1a1.1 1.1 0 0 0 0 1.5l6.3 6.3a1.1 1.1 0 0 0 1.5 0l9.2-9.6z" />
      <path d="M17.3 7.2h.02" />
      <circle cx="17.2" cy="7.1" r="1.3" />
    </Icon>
  );
}

/* ── who we serve ──────────────────────────────────────────────────────── */
export function Wrench(props) {
  return (
    <Icon {...props} tilt={-2}>
      <path d="M15.4 4.3a4.6 4.6 0 0 0-5.8 5.8L4 15.7a1.9 1.9 0 0 0 2.7 2.7l5.6-5.6a4.6 4.6 0 0 0 5.8-5.8l-2.5 2.5-2.6-.5-.5-2.6z" />
    </Icon>
  );
}

export function Laptop(props) {
  return (
    <Icon {...props} tilt={1}>
      <path d="M5.4 6.4h13.1a1 1 0 0 1 1 1v8.1H4.4V7.4a1 1 0 0 1 1-1z" />
      <path d="M2.6 15.6h18.9l-1.4 2.5a1 1 0 0 1-.9.5H4.9a1 1 0 0 1-.9-.5z" />
    </Icon>
  );
}

export function Cart(props) {
  return (
    <Icon {...props} tilt={-1}>
      <path d="M2.8 4.4h2.5l2.6 10.1h9.5l2.2-7.3H7.1" />
      <circle cx="9.5" cy="18.7" r="1.5" />
      <circle cx="17" cy="18.7" r="1.5" />
    </Icon>
  );
}

export function Stethoscope(props) {
  return (
    <Icon {...props} tilt={2}>
      <path d="M6.4 3.6v4.7a4.2 4.2 0 0 0 8.3 0V3.6" />
      <path d="M4.9 3.6h3M13.2 3.6h3" />
      <path d="M10.5 12.5v2.4a4 4 0 0 0 7.9.2v-1.3" />
      <circle cx="18.5" cy="11.4" r="1.9" />
    </Icon>
  );
}

export function Blocks(props) {
  return (
    <Icon {...props} tilt={-1.5}>
      <path d="M4.2 12.7h6.1v6.1H4.2zM13.5 12.7h6.1v6.1h-6.1zM8.8 5.7h6.1v6.1H8.8z" />
    </Icon>
  );
}

/* ── small utility marks ───────────────────────────────────────────────── */
export function Check({ size = 20, className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={`ink-stroke ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4.6 12.6c1.9 1.5 3.3 3.2 4.4 5 2.6-5.1 6-8.7 10.4-11.5" />
    </svg>
  );
}

/**
 * A wavy underline, for putting warmth under a word. It stretches to whatever
 * width the word is, so the stroke is pinned with `non-scaling-stroke` —
 * otherwise the horizontal stretch would fatten it and the hand-drawn feel
 * would turn into a smear.
 */
export function Squiggle({ className = "" }) {
  return (
    <svg
      viewBox="0 0 120 10"
      preserveAspectRatio="none"
      className={`ink-stroke ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M2 6.6c8.4-5.1 16.8 2.9 25.2-1.2s16.8-3.5 25.2.6 16.8 2.4 25.2-1.1 16.8-2.6 25.2 1.4 15.3 1.4 15.3 1.4"
        vectorEffect="non-scaling-stroke"
        strokeWidth="2.5"
      />
    </svg>
  );
}
