/**
 * The logo motif made literal: a business-day calendar — weekdays only, so the
 * fifth cell *is* business day five — with the 5 ringed in gold.
 * A cream card, sitting on the navy hero band.
 */
export default function CalendarFive() {
  const days = Array.from({ length: 20 }, (_, i) => i + 1);

  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div
        aria-hidden="true"
        className="absolute -inset-8 rounded-full bg-gold-500/12 blur-3xl"
      />

      <div className="relative rounded-3xl bg-cream p-6 shadow-lift sm:p-7">
        <div className="flex items-center justify-between">
          <p className="text-[0.78rem] font-bold uppercase tracking-[0.14em] text-gold-700">
            Business days
          </p>
          <span className="flex items-center gap-1.5 text-[0.85rem] font-medium text-ink-500">
            <span className="h-2 w-2 animate-pulse rounded-full bg-status-good" />
            Reconciling · 2:14&nbsp;AM
          </span>
        </div>

        <div className="mt-5 grid grid-cols-5 gap-1.5 text-center">
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
                    ? "bg-gold-500 font-display text-[1.4rem] font-semibold text-navy-950 shadow-[0_0_0_4px_rgba(212,160,60,0.25)]"
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

        <div className="mt-6 border-t border-cream-200 pt-4">
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
