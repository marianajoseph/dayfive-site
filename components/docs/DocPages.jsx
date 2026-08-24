import DocFrame, { Row, TotalRow, ColumnHeads, GroupHead } from "./DocFrame";
import Scoreboard from "../Scoreboard";
import {
  client,
  usd,
  acct,
  pnl,
  balanceSheet,
  insights,
  arAging,
  arTotal,
  arDetail,
  apDetail,
  apTotal,
  variance,
  varianceNotes,
  forecast,
  weekly,
} from "@/lib/sample-data";

const TONE_COLOR = {
  gold: "#a67a1e",
  amber: "#96610f",
  green: "#35785a",
  ok: "#35785a",
  warn: "#96610f",
  bad: "#a8452a",
};

/** A tinted panel on the white sheet — used for callouts and totals. */
const PANEL = "rounded-[0.4em] border border-cream-200 bg-cream/70";

/* ═══════════════════════════════════ GROUP A — the monthly close pack ═══ */

export function FiveInsights() {
  return (
    <DocFrame
      title="Your month in five insights"
      subtitle={`${client.periodShort} · ranked by what they're worth to you`}
      pageNo="1 of 14"
    >
      <p className="text-[0.86em] leading-relaxed text-ink-600">
        July was a good month: <strong className="font-bold text-ink">$258,390</strong> of
        revenue, up 8.0%, and <strong className="font-bold text-ink">$19,320</strong> of
        net income at a 7.5% margin. Below are the five things worth your attention,
        most valuable first. Everything else is in the statements behind this page.
      </p>

      <ol className="mt-[1em] flex min-h-0 flex-1 flex-col gap-[0.62em]">
        {insights.map((it) => (
          <li key={it.rank} className={`flex gap-[0.85em] px-[0.9em] py-[0.72em] ${PANEL}`}>
            <span
              className="tnum mt-[0.05em] flex h-[1.6em] w-[1.6em] shrink-0 items-center justify-center rounded-full text-[0.88em] font-bold text-white"
              style={{ background: TONE_COLOR[it.tone] }}
            >
              {it.rank}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-[0.7em] gap-y-[0.15em]">
                <h4 className="text-[1em] font-bold leading-snug tracking-[-0.015em] text-ink">
                  {it.headline}
                </h4>
                <span
                  className="rounded-full px-[0.6em] py-[0.12em] text-[0.66em] font-bold uppercase tracking-[0.08em]"
                  style={{
                    color: TONE_COLOR[it.tone],
                    background: `color-mix(in srgb, ${TONE_COLOR[it.tone]} 12%, transparent)`,
                  }}
                >
                  {it.tag}
                </span>
              </div>
              <p className="mt-[0.28em] text-[0.82em] leading-snug text-ink-600">{it.body}</p>
              <p className="mt-[0.3em] text-[0.82em] font-semibold leading-snug text-ink">
                {it.action}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </DocFrame>
  );
}

export function ProfitAndLoss() {
  const money = (n) => acct(n);

  return (
    <DocFrame
      title="Statement of Profit & Loss"
      subtitle={client.period}
      pageNo="5 of 14"
    >
      <ColumnHeads heads={["Jul 2026", "YTD 2026"]} />

      <GroupHead>Revenue</GroupHead>
      {pnl.revenue.map(([l, m, y]) => (
        <Row key={l} label={l} values={[money(m), money(y)]} indent />
      ))}
      <TotalRow label="Total revenue" values={pnl.revenueTotal.map(money)} />

      <GroupHead>Cost of revenue</GroupHead>
      {pnl.cogs.map(([l, m, y]) => (
        <Row key={l} label={l} values={[money(m), money(y)]} indent />
      ))}
      <TotalRow label="Total cost of revenue" values={pnl.cogsTotal.map(money)} />

      <div className="mt-[0.45em] rounded-[0.35em] bg-cream-tint px-[0.7em]">
        <TotalRow label="Gross profit" values={pnl.grossProfit.map(money)} heavy />
        <Row label="Gross margin" values={pnl.grossMargin} muted />
      </div>

      <GroupHead>Operating expenses</GroupHead>
      {pnl.opex.map(([l, m, y]) => (
        <Row key={l} label={l} values={[money(m), money(y)]} indent />
      ))}
      <TotalRow label="Total operating expenses" values={pnl.opexTotal.map(money)} />

      <TotalRow label="Operating income" values={pnl.operatingIncome.map(money)} />
      <Row
        label="Interest expense — vehicle & equipment loans"
        values={pnl.interest.map((n) => acct(-n))}
        indent
      />

      <div className="mt-[0.5em] rounded-[0.35em] bg-gold-500/15 px-[0.7em]">
        <TotalRow label="Net income" values={pnl.netIncome.map(money)} heavy />
        <Row label="Net margin" values={pnl.netMargin} muted />
      </div>

      <p className="mt-auto pt-[0.9em] text-[0.72em] leading-snug text-ink-500">
        Prepared on the accrual basis. 1,284 transactions categorised this period; 11
        routed to a person to check, all cleared before close. Bank and card accounts
        reconciled to {client.bank} as of July 31, 2026.
      </p>
    </DocFrame>
  );
}

export function BalanceSheet() {
  const b = balanceSheet;
  return (
    <DocFrame title="Balance Sheet" subtitle={b.asOf} pageNo="7 of 14">
      <ColumnHeads heads={["Jul 31, 2026"]} />

      <GroupHead>Current assets</GroupHead>
      {b.currentAssets.map(([l, v]) => (
        <Row key={l} label={l} values={[acct(v)]} indent />
      ))}
      <TotalRow label="Total current assets" values={[usd(b.currentAssetsTotal)]} />

      <GroupHead>Property & equipment</GroupHead>
      {b.fixedAssets.map(([l, v]) => (
        <Row key={l} label={l} values={[acct(v)]} indent />
      ))}
      <TotalRow label="Net property & equipment" values={[usd(b.fixedAssetsTotal)]} />

      <div className="mt-[0.45em] rounded-[0.35em] bg-cream-tint px-[0.7em]">
        <TotalRow label="Total assets" values={[usd(b.assetsTotal)]} heavy />
      </div>

      <GroupHead>Current liabilities</GroupHead>
      {b.currentLiabilities.map(([l, v]) => (
        <Row key={l} label={l} values={[acct(v)]} indent />
      ))}
      <TotalRow label="Total current liabilities" values={[usd(b.currentLiabilitiesTotal)]} />

      <GroupHead>Long-term liabilities</GroupHead>
      {b.longTerm.map(([l, v]) => (
        <Row key={l} label={l} values={[acct(v)]} indent />
      ))}
      <TotalRow label="Total liabilities" values={[usd(b.liabilitiesTotal)]} />

      <GroupHead>Member&rsquo;s equity</GroupHead>
      {b.equity.map(([l, v]) => (
        <Row key={l} label={l} values={[acct(v)]} indent />
      ))}
      <TotalRow label="Total member's equity" values={[usd(b.equityTotal)]} />

      <div className="mt-[0.45em] rounded-[0.35em] bg-gold-500/15 px-[0.7em]">
        <TotalRow
          label="Total liabilities & equity"
          values={[usd(b.liabilitiesAndEquityTotal)]}
          heavy
        />
      </div>

      <p className="mt-auto pt-[0.9em] text-[0.72em] leading-snug text-ink-500">
        Working capital $216,910 · current ratio 3.07 · every balance tied to a source
        document or a reconciled bank feed. Read-only bank connection via Plaid; no
        payment authority.
      </p>
    </DocFrame>
  );
}

/* ═══════════════════════════════════════ GROUP B — money in motion ══════ */

export function MoneyInMotion() {
  const max = Math.max(...arAging.map(([, v]) => v));

  return (
    <DocFrame
      title="Money in Motion — who owes you"
      subtitle={`Accounts receivable aging · ${client.periodShort}`}
      pageNo="1 of 3"
    >
      <div className="flex items-end justify-between rounded-[0.4em] bg-gold-500/15 px-[1em] py-[0.75em]">
        <div>
          <p className="text-[0.74em] font-bold uppercase tracking-[0.12em] text-ink-600">
            Owed to you
          </p>
          <p className="tnum font-display text-[2.2em] font-semibold leading-none tracking-[-0.03em] text-ink">
            {usd(arTotal)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[0.74em] font-bold uppercase tracking-[0.12em] text-ink-600">
            60+ days late
          </p>
          <p
            className="tnum font-display text-[2.2em] font-semibold leading-none tracking-[-0.03em]"
            style={{ color: TONE_COLOR.warn }}
          >
            {usd(11000)}
          </p>
        </div>
      </div>

      <p className="mt-[0.9em] text-[0.86em] leading-relaxed text-ink-600">
        In plain language:{" "}
        <strong className="font-bold text-ink">
          $38,400 is owed to you — $11,000 of it is more than 60 days late, and $8,240
          of that is Johnson. We&rsquo;ve chased them twice.
        </strong>{" "}
        Everything else is behaving normally.
      </p>

      <GroupHead>Aging</GroupHead>
      <div className="mt-[0.3em] flex flex-col gap-[0.4em]">
        {arAging.map(([label, v], i) => (
          <div key={label} className="flex items-center gap-[0.7em]">
            <span className="w-[9em] shrink-0 text-[0.82em] text-ink-600">{label}</span>
            <span className="h-[0.85em] flex-1 overflow-hidden rounded-full bg-cream-200">
              <span
                className="block h-full rounded-full"
                style={{
                  width: `${(v / max) * 100}%`,
                  background:
                    i < 2 ? TONE_COLOR.ok : i === 2 ? TONE_COLOR.warn : TONE_COLOR.bad,
                }}
              />
            </span>
            <span className="tnum w-[4.6em] shrink-0 text-right text-[0.86em] font-bold text-ink">
              {usd(v)}
            </span>
          </div>
        ))}
      </div>

      <GroupHead>By customer</GroupHead>
      <div className="mt-[0.2em]">
        <div className="flex border-b border-cream-200 pb-[0.35em] text-[0.68em] font-bold uppercase tracking-[0.1em] text-ink-500">
          <span className="flex-1">Customer</span>
          <span className="w-[4.6em] text-right">Balance</span>
          <span className="w-[3.4em] text-right">Days</span>
          <span className="w-[11em] pl-[0.9em]">What we&rsquo;ve done</span>
        </div>
        {arDetail.map((r) => (
          <div
            key={r.customer}
            className="flex items-baseline border-b border-cream-200/70 py-[0.42em] text-[0.82em]"
          >
            <span className="flex-1 truncate pr-[0.5em] text-ink">{r.customer}</span>
            <span className="tnum w-[4.6em] shrink-0 text-right font-bold text-ink">
              {usd(r.amount)}
            </span>
            <span
              className="tnum w-[3.4em] shrink-0 text-right font-bold"
              style={{ color: TONE_COLOR[r.tone] }}
            >
              {r.days}
            </span>
            <span className="w-[11em] shrink-0 pl-[0.9em] text-ink-600">{r.status}</span>
          </div>
        ))}
      </div>

      <p className="mt-auto rounded-[0.35em] border-l-[0.22em] border-gold-500 bg-cream px-[0.85em] py-[0.6em] text-[0.82em] leading-snug text-ink">
        <strong className="font-bold">One thing to do:</strong> call Johnson Property
        Group&rsquo;s AP contact this week — two emails have gone unanswered. The call
        script is on page 2. Everything else we&rsquo;ll keep chasing for you.
      </p>
    </DocFrame>
  );
}

export function WhoYouOwe() {
  return (
    <DocFrame
      title="Money in Motion — who you owe"
      subtitle="Accounts payable · drafted and queued for your approval"
      pageNo="2 of 3"
    >
      <div className="flex items-end justify-between rounded-[0.4em] bg-cream-tint px-[1em] py-[0.75em]">
        <div>
          <p className="text-[0.74em] font-bold uppercase tracking-[0.12em] text-ink-600">
            You owe
          </p>
          <p className="tnum font-display text-[2.2em] font-semibold leading-none tracking-[-0.03em] text-ink">
            {usd(apTotal)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[0.74em] font-bold uppercase tracking-[0.12em] text-ink-600">
            Discounts available
          </p>
          <p
            className="tnum font-display text-[2.2em] font-semibold leading-none tracking-[-0.03em]"
            style={{ color: TONE_COLOR.gold }}
          >
            $427
          </p>
        </div>
      </div>

      <p className="mt-[0.9em] text-[0.86em] leading-relaxed text-ink-600">
        Every bill below has already been entered, coded, matched to its purchase order
        where one exists, and drafted for payment.{" "}
        <strong className="font-bold text-ink">Nothing moves until you approve it.</strong>
      </p>

      <GroupHead>Bills due in the next 30 days</GroupHead>
      <div className="mt-[0.2em]">
        <div className="flex border-b border-cream-200 pb-[0.35em] text-[0.68em] font-bold uppercase tracking-[0.1em] text-ink-500">
          <span className="flex-1">Vendor</span>
          <span className="w-[4.8em] text-right">Amount</span>
          <span className="w-[4em] text-right">Due</span>
          <span className="w-[13em] pl-[0.9em]">Terms &amp; status</span>
        </div>
        {apDetail.map((r) => (
          <div
            key={r.vendor}
            className="flex items-baseline border-b border-cream-200/70 py-[0.5em] text-[0.82em]"
          >
            <span className="flex-1 truncate pr-[0.5em] text-ink">{r.vendor}</span>
            <span className="tnum w-[4.8em] shrink-0 text-right font-bold text-ink">
              {usd(r.amount)}
            </span>
            <span className="tnum w-[4em] shrink-0 text-right text-ink-600">{r.due}</span>
            <span
              className="w-[13em] shrink-0 pl-[0.9em]"
              style={{
                color: r.tone === "gold" ? TONE_COLOR.gold : "var(--color-ink-600)",
                fontWeight: r.tone === "gold" ? 700 : 400,
              }}
            >
              {r.note}
            </span>
          </div>
        ))}
      </div>

      <GroupHead>13-week cash position</GroupHead>
      <p className="mt-[0.2em] text-[0.84em] leading-relaxed text-ink-600">
        Starting cash <strong className="font-bold text-ink">$231,800</strong>. Across the
        next thirteen weeks we model <strong className="font-bold text-ink">$742,000</strong>{" "}
        in, and <strong className="font-bold text-ink">$778,000</strong> out — the gap is
        the two vehicle payoffs in September. Your low point is roughly{" "}
        <strong className="font-bold text-ink">$196,000</strong> on September 12. No action
        needed; we&rsquo;ll write to you if that number moves.
      </p>

      <p className="mt-auto rounded-[0.35em] border-l-[0.22em] border-gold-500 bg-cream px-[0.85em] py-[0.6em] text-[0.82em] leading-snug text-ink">
        <strong className="font-bold">One thing to do:</strong> approve the Ferguson
        payment before Friday August 8 and keep $427. It is drafted, funded and waiting
        — it needs one click.
      </p>
    </DocFrame>
  );
}

export function WeeklyEmail() {
  return (
    <DocFrame
      title="The weekly numbers"
      subtitle="Three lines you can read at a red light"
      pageNo="3 of 3"
    >
      <div className={`p-[1.1em] ${PANEL}`}>
        <div className="border-b border-cream-200 pb-[0.7em]">
          <p className="text-[0.72em] uppercase tracking-[0.12em] text-ink-500">
            From: DayFive &lt;weekly@dayfive.co&gt;
          </p>
          <p className="mt-[0.2em] text-[1.15em] font-bold tracking-[-0.02em] text-ink">
            {weekly.subject}
          </p>
          <p className="mt-[0.15em] text-[0.74em] text-ink-500">{weekly.date}</p>
        </div>

        <div className="flex flex-col gap-[0.7em] pt-[0.9em]">
          {weekly.lines.map(([label, value, note, tone]) => (
            <div key={label} className="flex items-baseline gap-[0.6em]">
              <span
                aria-hidden="true"
                className="inline-block h-[0.5em] w-[0.5em] shrink-0 rounded-full"
                style={{ background: TONE_COLOR[tone === "good" ? "ok" : "warn"] }}
              />
              <span className="text-[0.88em] text-ink-600">{label}</span>
              <span className="tnum font-display text-[1.25em] font-semibold tracking-[-0.03em] text-ink">
                {value}
              </span>
              <span className="text-[0.82em] text-ink-500">— {note}</span>
            </div>
          ))}
        </div>

        <p className="mt-[1em] border-t border-cream-200 pt-[0.8em] text-[0.84em] leading-snug text-ink">
          {weekly.footer}
        </p>

        <p className="mt-[0.8em] text-[0.76em] leading-snug text-ink-500">
          Reply to this email with any question — &ldquo;can I afford a second van?&rdquo;,
          &ldquo;why did materials jump?&rdquo; — and you&rsquo;ll have a written answer,
          usually within hours.
        </p>
      </div>

      <GroupHead>What changed since last week</GroupHead>
      <div className="mt-[0.2em] flex flex-col">
        {[
          ["Deposits cleared", "$96,400", "31 payments, all matched", "ok"],
          ["Bills entered", "$18,720", "9 bills, all coded and drafted", "ok"],
          ["Documents processed", "142", "receipts, invoices, statements", "ok"],
          ["Items needing you", "1", "approve Ferguson by Friday", "warn"],
        ].map(([label, value, note, tone]) => (
          <div
            key={label}
            className="flex items-baseline border-b border-cream-200/70 py-[0.45em] text-[0.83em]"
          >
            <span className="flex-1 text-ink-600">{label}</span>
            <span className="tnum w-[5em] shrink-0 text-right font-bold text-ink">{value}</span>
            <span
              className="w-[12.5em] shrink-0 pl-[0.9em]"
              style={{ color: TONE_COLOR[tone] }}
            >
              {note}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-auto pt-[0.9em] text-[0.72em] leading-snug text-ink-500">
        Sent every Monday at 6:00 AM Eastern. Included in Growth and Insights plans.
      </p>
    </DocFrame>
  );
}

/* ═════════════════════════════════════════ GROUP C — the FP&A pack ══════ */

export function BusinessScoreboard() {
  return (
    <DocFrame
      title="Your Business Scoreboard"
      subtitle={`${client.periodShort} · the numbers that run your business`}
      pageNo="1 of 9"
    >
      <p className="text-[0.86em] leading-relaxed text-ink-600">
        Three numbers, checked every month. Green means keep going. Amber means give it
        a look this month. Nothing here needs a meeting.
      </p>

      <div className="mt-[1em]">
        <Scoreboard theme="sheet" />
      </div>

      <GroupHead>How to read it</GroupHead>
      <div className="mt-[0.2em] flex flex-col gap-[0.35em] text-[0.82em] leading-snug text-ink-600">
        <p>
          <strong className="font-bold text-ink">Cash runway</strong> — how many months
          you could keep going on today&rsquo;s cash if the work stopped tomorrow. Above
          3 months is healthy for a trades business with your mix of customers.
        </p>
        <p>
          <strong className="font-bold text-ink">Customers owe you</strong> — the one to
          watch. The balance itself is normal for $258K of monthly revenue; it&rsquo;s
          the $11,000 sitting past 60 days that earns the amber.
        </p>
        <p>
          <strong className="font-bold text-ink">Profit per job</strong> — gross profit
          divided by completed jobs. Up $18 on the last three months, almost entirely on
          the after-hours work.
        </p>
      </div>

      <p className="mt-auto rounded-[0.35em] border-l-[0.22em] border-gold-500 bg-cream px-[0.85em] py-[0.6em] text-[0.82em] leading-snug text-ink">
        Until the web portal ships, the Scoreboard is a page in your monthly pack. When
        it ships, these same three numbers will be live, and you&rsquo;ll be able to ask
        them questions at eleven at night.
      </p>
    </DocFrame>
  );
}

export function BudgetVsActual() {
  return (
    <DocFrame
      title="Budget vs. what actually happened"
      subtitle={`Variance analysis · ${client.periodShort}`}
      pageNo="2 of 9"
    >
      <div className="flex border-b border-cream-200 pb-[0.4em] text-[0.68em] font-bold uppercase tracking-[0.1em] text-ink-500">
        <span className="flex-1" />
        <span className="w-[5.6em] text-right">Budget</span>
        <span className="w-[5.6em] text-right">Actual</span>
        <span className="w-[5.6em] text-right">Variance</span>
        <span className="w-[3.6em] text-right">%</span>
      </div>

      {variance.map(([label, budget, actual, varAmt, pct, tone], i) => {
        const emphasise = i === 2 || i === 4;
        return (
          <div
            key={label}
            className={`flex items-baseline py-[0.45em] text-[0.88em] ${
              emphasise ? "border-t border-ink/50 font-bold" : "border-b border-cream-200/70"
            }`}
          >
            <span className="flex-1 text-ink">{label}</span>
            <span className="tnum w-[5.6em] shrink-0 text-right text-ink-600">
              {usd(budget)}
            </span>
            <span className="tnum w-[5.6em] shrink-0 text-right text-ink">{usd(actual)}</span>
            <span
              className="tnum w-[5.6em] shrink-0 text-right font-bold"
              style={{ color: TONE_COLOR[tone] }}
            >
              {acct(varAmt)}
            </span>
            <span
              className="tnum w-[3.6em] shrink-0 text-right font-bold"
              style={{ color: TONE_COLOR[tone] }}
            >
              {pct}
            </span>
          </div>
        );
      })}

      <GroupHead>Explained, in plain English</GroupHead>
      <ul className="mt-[0.2em] flex flex-col gap-[0.5em]">
        {varianceNotes.map((n, i) => (
          <li key={i} className="flex gap-[0.6em] text-[0.84em] leading-snug text-ink-600">
            <span
              aria-hidden="true"
              className="mt-[0.45em] inline-block h-[0.35em] w-[0.35em] shrink-0 rounded-full bg-gold-600"
            />
            <span>{n}</span>
          </li>
        ))}
      </ul>

      <GroupHead>What we&rsquo;d do about it</GroupHead>
      <div className="mt-[0.2em] flex flex-col gap-[0.4em] text-[0.84em] leading-snug text-ink">
        <p>
          <strong className="font-bold">1.</strong> Re-price the card processing. It is
          the only overage on this page that is pure leakage — roughly $12,200 a year.
          Script attached.
        </p>
        <p>
          <strong className="font-bold">2.</strong> Raise the August–October revenue
          budget by $9,000 a month. You have beaten plan four months running; the budget
          is now the stale number, not the result.
        </p>
        <p>
          <strong className="font-bold">3.</strong> Leave the subcontractor line alone.
          It is doing exactly what it should.
        </p>
      </div>

      <p className="mt-auto pt-[0.9em] text-[0.72em] leading-snug text-ink-500">
        Budget built with you in March 2026 through written planning dialogue. Next
        refresh: quarterly, in October. No meeting required.
      </p>
    </DocFrame>
  );
}

export function RollingForecast() {
  const maxRev = Math.max(...forecast.map(([, r]) => r));
  const W = 100;
  const H = 40;
  const step = W / forecast.length;

  const cashPoints = forecast
    .map(([, , c], i) => {
      const x = step * i + step / 2;
      const y = H - (c / maxRev) * H;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <DocFrame
      title="Rolling 12-month forecast"
      subtitle="Refreshed quarterly · August 2026 through July 2027"
      pageNo="4 of 9"
    >
      <p className="text-[0.86em] leading-relaxed text-ink-600">
        Built from your own seasonality — three winters of it — not an industry average.
        Revenue bars, cash line. Both in thousands.
      </p>

      <div className={`mt-[1em] p-[0.9em] ${PANEL}`}>
        <svg
          viewBox={`0 0 ${W} ${H + 6}`}
          className="w-full"
          role="img"
          aria-label="Rolling 12-month revenue and cash forecast"
        >
          {[0.25, 0.5, 0.75, 1].map((g) => (
            <line
              key={g}
              x1="0"
              x2={W}
              y1={H - g * H}
              y2={H - g * H}
              stroke="#e9dfcd"
              strokeWidth="0.35"
            />
          ))}
          {forecast.map(([, rev], i) => {
            const h = (rev / maxRev) * H;
            return (
              <rect
                key={i}
                x={step * i + step * 0.22}
                y={H - h}
                width={step * 0.56}
                height={h}
                rx="0.6"
                fill="#1a3557"
                opacity="0.8"
              />
            );
          })}
          <polyline
            points={cashPoints}
            fill="none"
            stroke="#a67a1e"
            strokeWidth="1"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {forecast.map(([, , c], i) => (
            <circle
              key={i}
              cx={step * i + step / 2}
              cy={H - (c / maxRev) * H}
              r="0.9"
              fill="#a67a1e"
            />
          ))}
          {forecast.map(([m], i) => (
            <text
              key={m}
              x={step * i + step / 2}
              y={H + 4.4}
              textAnchor="middle"
              fontSize="2.7"
              fill="#626d7e"
            >
              {m}
            </text>
          ))}
        </svg>

        <div className="mt-[0.6em] flex items-center gap-[1.2em] text-[0.72em] text-ink-600">
          <span className="flex items-center gap-[0.4em]">
            <span className="inline-block h-[0.5em] w-[0.9em] rounded-[0.1em] bg-navy-700/80" />
            Revenue
          </span>
          <span className="flex items-center gap-[0.4em]">
            <span className="inline-block h-[0.18em] w-[0.9em] rounded-full bg-gold-600" />
            Cash at month end
          </span>
          <span className="ml-auto tnum">Figures in $000s</span>
        </div>
      </div>

      <GroupHead>What the shape is telling you</GroupHead>
      <div className="mt-[0.2em] flex flex-col gap-[0.45em] text-[0.84em] leading-snug text-ink-600">
        <p>
          <strong className="font-bold text-ink">
            November and December are the problem, and they always are.
          </strong>{" "}
          Revenue falls to roughly $208K while your fixed costs do not move. Cash bottoms
          near $196K in mid-September and again near $196K in December.
        </p>
        <p>
          <strong className="font-bold text-ink">
            You end July 2027 with roughly $284K of cash
          </strong>{" "}
          on $2.96M of revenue — about 2.6% growth on your current run-rate. That is a
          conservative plan; it assumes no second on-call tech.
        </p>
        <p>
          <strong className="font-bold text-ink">
            The winter maintenance contract push is worth modelling.
          </strong>{" "}
          Twenty more contracts at $310 a month would lift the December trough by about
          $6,200 and cost you almost nothing to deliver.
        </p>
      </div>

      <p className="mt-auto pt-[0.9em] text-[0.72em] leading-snug text-ink-500">
        Forecast is a projection, not a promise. Assumptions and the full monthly model
        are on pages 5 through 7.
      </p>
    </DocFrame>
  );
}
