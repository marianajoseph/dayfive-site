import { Mark } from "../Logo";
import { client } from "@/lib/sample-data";

/**
 * The A4 sheet every mockup is drawn on — white paper, navy ink, a true
 * 1 : 1.4142 page. Typography inside is em-based and driven by `.doc`'s
 * container query, so the same component is correct at thumbnail and at full
 * size.
 */
export default function DocFrame({ title, subtitle, pageNo, children }) {
  return (
    <div className="doc-shell paper-grain relative h-full w-full overflow-hidden bg-white text-ink">
      {/* gold spine */}
      <div aria-hidden="true" className="absolute inset-y-0 left-0 w-[0.45%] bg-gold-500" />

      {/* SAMPLE watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <span className="doc-watermark whitespace-nowrap">SAMPLE</span>
      </div>

      <div className="doc relative flex h-full flex-col px-[3.4em] pb-[2.4em] pt-[3em]">
        {/* letterhead */}
        <header className="flex items-start justify-between border-b border-cream-200 pb-[1.1em]">
          <div>
            <p className="text-[0.76em] font-bold uppercase tracking-[0.16em] text-gold-700">
              {client.name}
            </p>
            <h3 className="mt-[0.35em] text-[1.5em] font-bold leading-tight tracking-[-0.02em] text-ink">
              {title}
            </h3>
            <p className="mt-[0.25em] text-[0.86em] text-ink-600">{subtitle}</p>
          </div>
          <div className="flex shrink-0 items-center gap-[0.45em] pt-[0.2em]">
            <Mark className="h-[2em] w-[2em] text-gold-600" />
            <span className="font-display text-[1.05em] font-semibold tracking-[-0.035em] text-ink">
              Day<span className="text-gold-700">Five</span>
            </span>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col pt-[1.3em]">{children}</div>

        {/* footer */}
        <footer className="mt-[1em] flex items-end justify-between border-t border-cream-200 pt-[0.75em] text-[0.7em] text-ink-500">
          <span>{client.delivered}</span>
          <span className="tnum">Page {pageNo} · Prepared by DayFive · Checked and signed off</span>
        </footer>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- primitives -- */

export function Row({ label, values, indent = false, muted = false }) {
  return (
    <div className={`flex items-baseline py-[0.24em] ${muted ? "text-ink-600" : "text-ink"}`}>
      <span className={`text-[0.88em] ${indent ? "pl-[1.2em]" : ""}`}>{label}</span>
      <span aria-hidden="true" className="doc-leader" />
      {values.map((v, i) => (
        <span
          key={i}
          className={`tnum w-[6.2em] shrink-0 text-right text-[0.88em] ${
            i > 0 ? "text-ink-600" : ""
          }`}
        >
          {v}
        </span>
      ))}
    </div>
  );
}

export function TotalRow({ label, values, heavy = false }) {
  return (
    <div
      className={`mt-[0.3em] flex items-baseline border-t py-[0.34em] ${
        heavy ? "border-t-[1.5px] border-ink/60" : "border-cream-200"
      }`}
    >
      <span className="text-[0.9em] font-bold tracking-[-0.01em]">{label}</span>
      <span aria-hidden="true" className="flex-1" />
      {values.map((v, i) => (
        <span
          key={i}
          className={`tnum w-[6.2em] shrink-0 text-right text-[0.9em] font-bold ${
            i > 0 ? "text-ink-600" : ""
          }`}
        >
          {v}
        </span>
      ))}
    </div>
  );
}

export function ColumnHeads({ heads }) {
  return (
    <div className="flex items-baseline border-b border-cream-200 pb-[0.4em]">
      <span className="flex-1" />
      {heads.map((h) => (
        <span
          key={h}
          className="w-[6.2em] shrink-0 text-right text-[0.68em] font-bold uppercase tracking-[0.11em] text-ink-500"
        >
          {h}
        </span>
      ))}
    </div>
  );
}

export function GroupHead({ children }) {
  return (
    <p className="mt-[0.9em] text-[0.74em] font-bold uppercase tracking-[0.14em] text-gold-700">
      {children}
    </p>
  );
}
