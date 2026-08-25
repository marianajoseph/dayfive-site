import { scoreboard, scoreboardSecondary } from "@/lib/sample-data";

const R = 42;
const ARC_LENGTH = Math.PI * R; // 131.95

const TONE = {
  /* inside a white A4 sheet — cards are a warm tint so they read as cards */
  sheet: { track: "#e9dfcd", card: "border border-cream-200 bg-cream/70" },
  /* on the cream page — white cards with a soft shadow */
  cream: { track: "#e9dfcd", card: "bg-white shadow-soft" },
};

/* Semantic status colours, deliberately outside the gold family. */
const STATUS = {
  good: { color: "#2e6f4e", chip: "On track" },
  watch: { color: "#b4531b", chip: "Worth a look" },
  risk: { color: "#9b2c22", chip: "Act now" },
};

/** Point on the semicircle at `t` (0 = left end, 1 = right end). */
function arcPoint(t) {
  const a = Math.PI * (1 - t);
  return { x: 50 + R * Math.cos(a), y: 50 - R * Math.sin(a) };
}

/**
 * A plain semicircular gauge with three ticks and its scale on the arc ends.
 *
 * For a downside metric the fill is inverted: the arc shows how much headroom
 * is left, so it empties as the number climbs. Without that, the single worst
 * number on the card drew the fullest arc and read as "almost complete".
 */
function Gauge({ item, theme }) {
  const t = TONE[theme];
  const s = STATUS[item.status];

  const share = Math.min(1, Math.max(0, (item.amount - item.min) / (item.max - item.min)));
  const fill = item.direction === "down" ? 1 - share : share;

  return (
    <div className={`rounded-[0.75em] px-[1.1em] pb-[1em] pt-[0.95em] ${t.card}`}>
      <div className="flex items-center justify-between gap-[0.6em]">
        <p className="text-[0.8em] font-bold uppercase tracking-[0.1em] text-ink-600">
          {item.label}
        </p>
        <span className="flex items-center gap-[0.4em]">
          <span
            aria-hidden="true"
            className="inline-block h-[0.5em] w-[0.5em] rounded-full"
            style={{ background: s.color }}
          />
          <span
            className="text-[0.72em] font-bold uppercase tracking-[0.08em]"
            style={{ color: s.color }}
          >
            {s.chip}
          </span>
        </span>
      </div>

      <div className="relative mt-[0.5em]">
        <svg
          viewBox="0 0 100 58"
          className="w-full"
          role="img"
          aria-label={`${item.label}: ${item.value} ${item.unit} of ${item.maxLabel} — ${s.chip}`}
        >
          <path
            d={`M8 50 A${R} ${R} 0 0 1 92 50`}
            fill="none"
            stroke={t.track}
            strokeWidth="7"
            strokeLinecap="round"
          />
          {/* the acceptable band, shaded behind the reading */}
          {item.healthyFrom != null && (
            <path
              d={`M8 50 A${R} ${R} 0 0 1 92 50`}
              fill="none"
              stroke={s.color}
              strokeOpacity="0.16"
              strokeWidth="13"
              strokeDasharray={`${ARC_LENGTH * (1 - item.healthyFrom)} ${ARC_LENGTH}`}
              strokeDashoffset={-ARC_LENGTH * item.healthyFrom}
            />
          )}
          <path
            d={`M8 50 A${R} ${R} 0 0 1 92 50`}
            fill="none"
            stroke={s.color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={ARC_LENGTH}
            strokeDashoffset={ARC_LENGTH * (1 - fill)}
          />
          {/* three ticks, so the arc has a scale rather than a vibe */}
          {[0.25, 0.5, 0.75].map((p) => {
            const inner = arcPoint(p);
            const outer = arcPoint(p);
            const a = Math.PI * (1 - p);
            return (
              <line
                key={p}
                x1={inner.x - Math.cos(a) * 4.5}
                y1={inner.y + Math.sin(a) * 4.5}
                x2={outer.x - Math.cos(a) * 7.5}
                y2={outer.y + Math.sin(a) * 7.5}
                stroke={t.track}
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {/* scale sits on the arc ends, not adrift under the number */}
        <span className="absolute bottom-0 left-0 text-[0.66em] font-semibold text-ink-500">
          {item.minLabel}
        </span>
        <span className="absolute bottom-0 right-0 text-[0.66em] font-semibold text-ink-500">
          {item.maxLabel}
        </span>

        {/* figure + unit share a baseline, unit at 40% of the figure */}
        <div className="absolute inset-x-0 bottom-[1.5em] flex items-baseline justify-center">
          <span className="tnum font-display text-[2.2em] font-semibold leading-none tracking-[-0.03em] text-ink">
            {item.value}
          </span>
          {item.unit && (
            <span className="ml-[0.28em] text-[0.88em] font-medium text-ink-600">
              {item.unit}
            </span>
          )}
        </div>
      </div>

      {item.healthyLabel && (
        <p className="mt-[0.6em] flex items-center gap-[0.4em] text-[0.7em] font-semibold text-ink-500">
          <span
            aria-hidden="true"
            className="inline-block h-[0.5em] w-[0.9em] rounded-[0.1em]"
            style={{ background: s.color, opacity: 0.22 }}
          />
          {item.healthyLabel}
        </p>
      )}
      <p className="mt-[0.5em] text-[0.78em] leading-snug text-ink-600">{item.note}</p>
    </div>
  );
}

export default function Scoreboard({ theme = "sheet", showSecondary = true }) {
  const t = TONE[theme];

  /* Inside an A4 sheet the columns must NOT follow viewport breakpoints — the
     page is a fixed-aspect document, not a responsive layout. Letting `sm:`
     apply stacked the gauges one-up inside the sheet on any phone and pushed
     the rest of the page off the bottom. */
  const sheet = theme === "sheet";
  const primaryCols = sheet ? "grid-cols-3" : "grid-cols-1 sm:grid-cols-3";
  const secondaryCols = sheet ? "grid-cols-4" : "grid-cols-2 sm:grid-cols-4";

  return (
    <div>
      <div className={`grid gap-[0.85em] ${primaryCols}`}>
        {scoreboard.map((item) => (
          <Gauge key={item.label} item={item} theme={theme} />
        ))}
      </div>

      {showSecondary && (
        <div className={`mt-[0.85em] grid gap-[0.85em] ${secondaryCols}`}>
          {scoreboardSecondary.map(([label, value, status, note]) => (
            <div key={label} className={`rounded-[0.75em] px-[0.9em] py-[0.8em] ${t.card}`}>
              <p className="text-[0.72em] font-bold uppercase tracking-[0.08em] text-ink-600">
                {label}
              </p>
              <p className="mt-[0.3em] flex items-baseline gap-[0.4em]">
                <span className="tnum font-display text-[1.4em] font-semibold tracking-[-0.02em] text-ink">
                  {value}
                </span>
                <span
                  aria-hidden="true"
                  className="inline-block h-[0.42em] w-[0.42em] shrink-0 rounded-full"
                  style={{ background: STATUS[status].color }}
                />
              </p>
              <p className="mt-[0.15em] text-[0.72em] leading-snug text-ink-500">{note}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
