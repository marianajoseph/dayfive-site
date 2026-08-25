/**
 * One ornament for every eyebrow on the page: icon + label, 8px gap, 13px,
 * 0.14em tracking. `icon` is a required component — an eyebrow without one
 * breaks the system, which is why some previously carried a rule, some an
 * icon, and the Scoreboard's carried neither.
 */
export function Eyebrow({ children, icon: Ornament, tone = "dark", className = "" }) {
  const color = tone === "light" ? "text-gold-on-dark" : "text-gold-on-light";

  return (
    <p className={`eyebrow mb-5 ${color} ${className}`}>
      <Ornament size={20} className="shrink-0" />
      {children}
    </p>
  );
}

/** Big headlines — the only place the serif is allowed. */
export function SectionTitle({ children, tone = "dark", className = "" }) {
  return (
    <h2
      className={`font-display text-[2.05rem] font-semibold leading-[1.12] tracking-[-0.03em] sm:text-[2.6rem] lg:text-[3rem] ${
        tone === "light" ? "text-cream" : "text-ink"
      } ${className}`}
    >
      {children}
    </h2>
  );
}

/**
 * `tone`:
 *   "cream" (default) — the page base
 *   "tint"            — a slightly deeper cream, for rhythm between sections
 *   "navy"            — the hero and closing bands only
 */
export default function Section({
  id,
  children,
  tone = "cream",
  className = "",
  inner = "max-w-6xl",
  divider = false,
}) {
  const bands = {
    cream: "bg-cream text-ink",
    tint: "bg-cream-tint text-ink",
    navy: "band-navy bg-navy-900 text-mist",
  };

  return (
    <section
      id={id}
      /* One scale, no per-section overrides: 72px top and bottom at ≤768px,
         120px above that. */
      className={`relative scroll-mt-24 px-5 py-18 sm:px-8 md:py-30 ${bands[tone]} ${className}`}
    >
      {divider && (
        <div
          aria-hidden="true"
          className="rule-fade absolute inset-x-8 top-0 mx-auto max-w-6xl"
        />
      )}
      <div className={`mx-auto w-full ${inner}`}>{children}</div>
    </section>
  );
}
