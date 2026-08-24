export function Eyebrow({ children, tone = "dark", icon = null, className = "" }) {
  const color = tone === "light" ? "text-gold-400" : "text-gold-700";
  const rule = tone === "light" ? "bg-gold-400/60" : "bg-gold-600/50";

  return (
    <p
      className={`mb-5 flex items-center gap-3 text-[0.8rem] font-bold uppercase tracking-[0.16em] ${color} ${className}`}
    >
      {icon ? (
        <span className="shrink-0">{icon}</span>
      ) : (
        <span aria-hidden="true" className={`h-px w-7 ${rule}`} />
      )}
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
      className={`relative scroll-mt-24 px-5 py-16 sm:px-8 sm:py-24 lg:py-32 ${bands[tone]} ${className}`}
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
