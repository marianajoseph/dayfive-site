/**
 * The logo motif made literal: a business-day calendar — weekdays only, so the
 * fifth cell *is* business day five — with the 5 ringed in gold.
 *
 * Two weeks are legible and the third fades out under a mask. The full
 * twenty-day grid made the card roughly twice the height of the hero's left
 * column, which pushed the caption — the actual payoff — hundreds of pixels
 * below the fold, and days 6–20 were dead weight anyway.
 */
export default function CalendarFive() {
  const days = Array.from({ length: 15 }, (_, i) => i + 1);

  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div
        aria-hidden="true"
        className="absolute -inset-8 rounded-full bg-gold-on-dark/12 blur-3xl"
      />

      <div className="relative max-h-[520px] rounded-3xl bg-cream p-6 shadow-lift">
        <div className="flex items-center justify-between">
          <p className="eyebrow text-gold-on-light">Business days</p>
          <span className="flex items-center gap-1.5 text-[0.85rem] font-medium text-ink-500">
            <span className="dot-pulse h-2 w-2 rounded-full bg-status-good" />
            Reconciling · 2:14&nbsp;AM
          </span>
        </div>

        {/* One week on a phone, two on desktop. The heights are set so the
            fade begins exactly below the last legible row — 96px of mask on
            desktop starting at 156px, where row two ends. */}
        <div className="relative mt-5 max-h-[112px] overflow-hidden sm:max-h-[252px]">
          <div className="grid grid-cols-5 gap-1.5 text-center">
            {["M", "T", "W", "T", "F"].map((d, i) => (
              <span
                key={i}
                className="pb-1 text-[0.7rem] font-bold uppercase tracking-[0.1em] text-ink-500"
              >
                {d}
              </span>
            ))}

            {days.map((d) => {
              const isFive = d === 5;
              const done = d < 5;
              return (
                <span
                  key={d}
                  className={`tnum relative flex aspect-square items-center justify-center rounded-xl text-[0.95rem] ${
                    isFive
                      ? "day-five font-display text-[1.4rem] font-semibold"
                      : done
                        ? "bg-white font-medium text-ink-600 shadow-soft"
                        : "text-ink-500/45"
                  }`}
                >
                  {d}
                  {done && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-1 h-1 w-1 rounded-full bg-status-good/70"
                    />
                  )}
                </span>
              );
            })}
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-b from-transparent to-cream sm:h-24"
          />
        </div>

        <div className="mt-4 border-t border-cream-200 pt-4">
          <p className="font-display text-[1.2rem] font-semibold leading-snug tracking-[-0.02em] text-ink">
            Business day five.
          </p>
          <p className="mt-1 text-[1rem] leading-relaxed text-ink-600">
            Your statements, the one-page summary and five insights — in your inbox.
            Every month, without you asking.
          </p>
        </div>
      </div>
    </div>
  );
}
