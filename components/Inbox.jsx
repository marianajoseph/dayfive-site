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
        <strong className="font-bold text-gold-700">
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
        <strong className="font-bold text-gold-700">
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
        <strong className="font-bold text-gold-700">FP&amp;A pack</strong> — your budget
        vs. what actually happened, explained; the rolling 12-month forecast;{" "}
        <strong className="font-bold text-gold-700">Your Business Scoreboard</strong> with
        plain gauges (Cash runway: 4.2 months 🟢 · Customers owe you: $38,400 ⚠️ · Profit
        per job: $312 🟢); and the quarterly Risks &amp; Opportunities letter.
      </p>
    ),
  },
];

export default function Inbox() {
  return (
    <Section id="inbox" tone="tint" divider>
      <div className="max-w-3xl">
        <Eyebrow icon={<EnvelopeSpark size={24} className="text-gold-600" />}>
          What lands in your inbox
        </Eyebrow>

        <SectionTitle>
          Here&rsquo;s the actual thing.{" "}
          <span className="relative inline-block text-ink-600">
            Have a poke around.
            <Squiggle className="absolute -bottom-1 left-0 h-2.5 w-full text-gold-500" />
          </span>
        </SectionTitle>

        <p className="mt-7 max-w-2xl text-xl leading-relaxed text-ink-600">
          Riverside Plumbing is made up — a fictional shop in Paramus — but nothing else
          on these pages is. The statements foot, the balance sheet balances, and every
          insight quotes a number you can go and find on another page. This is what
          shows up on the fifth business day.
        </p>
      </div>

      <div className="mt-14 flex flex-col gap-20 sm:mt-16 lg:gap-32">
        {groups.map((g, i) => (
          <div
            key={g.id}
            id={g.id}
            className="grid items-center gap-8 lg:grid-cols-12 lg:gap-16"
          >
            <div
              className={`lg:col-span-5 ${i % 2 === 1 ? "lg:order-2 lg:col-start-8" : ""}`}
            >
              <p className="mb-4 inline-flex items-center rounded-full border-2 border-gold-500/45 bg-white px-4 py-1.5 text-[0.78rem] font-bold uppercase tracking-[0.12em] text-gold-700">
                {g.tier}
              </p>
              <h3 className="text-[1.6rem] font-bold tracking-[-0.02em] text-ink sm:text-[1.9rem]">
                {g.title}
              </h3>
              <div className="mt-4 text-lg leading-relaxed text-ink-600">{g.body}</div>
              <p className="mt-5 text-[1rem] text-ink-500">
                {g.pages.length} pages shown · watermarked SAMPLE · tap one to read it
              </p>
            </div>

            <div className={`lg:col-span-7 ${i % 2 === 1 ? "lg:order-1 lg:col-start-1" : ""}`}>
              <DocStack pages={g.pages} group={g.title} />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
