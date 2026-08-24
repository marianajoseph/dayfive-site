import { scoreboard, scoreboardSecondary } from "@/lib/sample-data";

const ARC_LENGTH = 131.95; // π × r, for r = 42 in the viewBox below

const TONE = {
  /* inside a white A4 sheet — cards are a warm tint so they read as cards */
  sheet: {
    track: "#e9dfcd",
    card: "border border-cream-200 bg-cream/70",
  },
  /* on the cream page — white cards with a soft shadow */
  cream: {
    track: "#e9dfcd",
    card: "bg-white shadow-soft",
  },
};

const STATUS = {
  good: { color: "#35785a", chip: "On track" },
  watch: { color: "#96610f", chip: "Worth a look" },
  bad: { color: "#a8452a", chip: "Act now" },
};

/** A plain semicircular gauge. No dials, no gradients, no chartjunk. */
function Gauge({ item, theme }) {
  const t = TONE[theme];
  const s = STATUS[item.status];

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
          aria-label={`${item.label}: ${item.value} ${item.unit} — ${s.chip}`}
        >
          <path
            d="M8 50 A42 42 0 0 1 92 50"
            fill="none"
            stroke={t.track}
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M8 50 A42 42 0 0 1 92 50"
            fill="none"
            stroke={s.color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={ARC_LENGTH}
            strokeDashoffset={ARC_LENGTH * (1 - item.fill)}
          />
        </svg>
        <div className="absolute inset-x-0 bottom-0 text-center">
          <span className="tnum font-display text-[2.2em] font-semibold leading-none tracking-[-0.03em] text-ink">
            {item.value}
          </span>
          {item.unit && (
            <span className="ml-[0.25em] text-[0.9em] text-ink-600">{item.unit}</span>
          )}
        </div>
      </div>

      <p className="mt-[0.55em] text-center text-[0.68em] font-semibold uppercase tracking-[0.1em] text-ink-500">
        {item.scale}
      </p>
      <p className="mt-[0.6em] text-[0.78em] leading-snug text-ink-600">{item.note}</p>
    </div>
  );
}

export default function Scoreboard({ theme = "sheet", showSecondary = true }) {
  const t = TONE[theme];

  return (
    <div>
      <div className="grid grid-cols-1 gap-[0.85em] sm:grid-cols-3">
        {scoreboard.map((item) => (
          <Gauge key={item.label} item={item} theme={theme} />
        ))}
      </div>

      {showSecondary && (
        <div className="mt-[0.85em] grid grid-cols-2 gap-[0.85em] sm:grid-cols-4">
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
