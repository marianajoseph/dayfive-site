import Section, { Eyebrow, SectionTitle } from "./Section";
import DocStack from "./DocStack";
import { EnvelopeSpark, Squiggle } from "./Icons";
import {
  FiveInsights,
  ProfitAndLoss,
  BalanceSheet,
  MoneyInMotion,
  WhoYouOwe,
  WeeklyEmail,
  BusinessScoreboard,
  BudgetVsActual,
  RollingForecast,
} from "./docs/DocPages";

const groups = [
  {
    id: "close-pack",
    tier: "Every plan",
    title: "The monthly close pack",
    pages: [
      { label: "Your month in five insights", node: <FiveInsights /> },
      { label: "Statement of Profit & Loss", node: <ProfitAndLoss /> },
      { label: "Balance Sheet", node: <BalanceSheet /> },
    ],
    body: (
      <p>
        <strong className="font-bold text-ink">Every plan:</strong> the monthly close
        pack — clean statements plus{" "}
        <strong className="font-bold text-gold-on-light">
          the one-page summary: five insights, ranked, each one actionable.
        </strong>
      </p>
    ),
  },
  {
    id: "money-in-motion",
    tier: "Growth adds",
    title: "Money in Motion",
    pages: [
      { label: "Money in Motion — who owes you", node: <MoneyInMotion /> },
      { label: "Money in Motion — who you owe", node: <WhoYouOwe /> },
      { label: "The weekly numbers email", node: <WeeklyEmail /> },
    ],
    body: (
      <p>
        <strong className="font-bold text-ink">Growth adds:</strong> the{" "}
        <strong className="font-bold text-gold-on-light">
          &ldquo;Money in Motion&rdquo; page
        </strong>{" "}
        — who owes you and who you owe, aged and ranked, in plain language
        (&ldquo;$38,400 owed to you — $11K is 60+ days late; we&rsquo;ve chased Johnson
        twice&rdquo;) — plus the weekly numbers email, three lines you can read at a red
        light.
      </p>
    ),
  },
  {
    id: "fpa-pack",
    tier: "Insights adds",
    title: "The FP&A pack",
    pages: [
      { label: "Your Business Scoreboard", node: <BusinessScoreboard /> },
      { label: "Budget vs. what actually happened", node: <BudgetVsActual /> },
      { label: "Rolling 12-month forecast", node: <RollingForecast /> },
    ],
    body: (
      <p>
        <strong className="font-bold text-ink">Insights adds:</strong> the{" "}
        <strong className="font-bold text-gold-on-light">FP&amp;A pack</strong> — your budget
        vs. what actually happened, explained; the rolling 12-month forecast;{" "}
        <strong className="font-bold text-gold-on-light">Your Business Scoreboard</strong> with
        plain gauges (Cash runway: 4.2 months 🟢 · Customers owe you: $38,400 ⚠️ · Profit
        per job: $312 🟢); and the quarterly Risks &amp; Opportunities letter.
      </p>
    ),
  },
];

export default function Inbox() {
  return (
    <Section id="inbox" tone="tint" divider inner="max-w-7xl">
      <div className="max-w-3xl">
        <Eyebrow icon={EnvelopeSpark}>What lands in your inbox</Eyebrow>

        <SectionTitle>
          Here&rsquo;s the actual thing.{" "}
          <span className="relative inline-block text-ink-600">
            Have a poke around.
            <Squiggle className="absolute -bottom-1 left-0 h-2.5 w-full text-gold-on-light" />
          </span>
        </SectionTitle>

        <p className="mt-7 max-w-2xl text-xl leading-relaxed text-ink-600">
          Riverside Plumbing is made up — a fictional shop in Paramus — but nothing else
          on these pages is. The statements foot, the balance sheet balances, and every
          insight quotes a number you can go and find on another page. This is what
          shows up on the fifth business day.
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-18 md:gap-30">
        {groups.map((g, i) => (
          <div
            key={g.id}
            id={g.id}
            className="grid items-start gap-8 lg:grid-cols-12 lg:gap-16"
          >
            {/* 4/8 rather than 5/7: the documents need the width far more than
                the description does, and the front page has a 620px floor.
                Both columns top-align at the same 64px inset in all three
                blocks — the first used to be top-aligned and the second
                vertically centred. */}
            <div
              className={`lg:col-span-4 lg:pt-16 ${
                i % 2 === 1 ? "lg:order-2 lg:col-start-9" : ""
              }`}
            >
              <p className="mb-4 inline-flex items-center rounded-full border-2 border-gold-on-light/40 bg-white px-4 py-1.5 text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-gold-on-light">
                {g.tier}
              </p>
              {/* Display serif, like every other title at this level. */}
              <h3 className="font-display text-[2rem] font-semibold leading-[1.1] tracking-[-0.01em] text-ink sm:text-[2.5rem] sm:leading-[2.75rem]">
                {g.title}
              </h3>
              <div className="mt-4 text-lg leading-relaxed text-ink-600">{g.body}</div>
            </div>

            <div
              className={`lg:col-span-8 lg:pt-16 ${
                i % 2 === 1 ? "lg:order-1 lg:col-start-1" : ""
              }`}
            >
              <DocStack pages={g.pages} group={g.title} />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
