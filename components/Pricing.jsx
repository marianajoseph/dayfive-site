import Section, { Eyebrow, SectionTitle } from "./Section";
import CTAButton from "./CTAButton";
import Scoreboard from "./Scoreboard";
import { Check, Tag, Gauge } from "./Icons";

const plans = [
  {
    name: "ESSENTIALS",
    price: "$450",
    lede: "Bookkeeping, done.",
    features: [
      "Monthly close by day 5",
      "Full financial statements (profit & loss, balance sheet, cash flow)",
      "The one-page plain-English summary",
      "Unlimited document intake",
      "Works with your ERP or ours",
    ],
    fit: "Fits businesses up to ~$50K/month in expenses.",
    popular: false,
  },
  {
    name: "GROWTH",
    price: "$850",
    lede: "Essentials, plus your money in motion.",
    features: [
      "AP & AR management — we draft the bills, we chase the invoices",
      "13-week cash-flow forecast",
      "Weekly numbers email",
    ],
    inherits: "Everything in Essentials, plus:",
    fit: null,
    popular: true,
  },
  {
    name: "INSIGHTS",
    price: "$1,800",
    lede: "Growth, plus a real FP&A function — the finance department growing companies pay thousands a month for.",
    features: [
      "An **annual operating budget** built with you through a structured written planning dialogue (no meetings, ever)",
      "**Monthly variance analysis** — budget vs. actuals, explained in plain English with what to do about it",
      "A **rolling 12-month forecast**, refreshed quarterly",
      "**Your Business Scoreboard** — the numbers that run your business (cash runway, what customers owe you, profit per job)",
      "A quarterly **Risks & Opportunities letter** — what happened, two risks, two opportunities, one recommendation",
    ],
    inherits: "Everything in Growth, plus:",
    fit: "Reviewed, verified, and signed off before it reaches you.",
    popular: false,
  },
];

/** Renders **bold** spans from the copy without pulling in a markdown parser. */
function Rich({ text }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
        part.startsWith("**") ? (
          <strong key={i} className="font-bold text-ink">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

export default function Pricing() {
  return (
    <Section id="pricing" divider>
      <div className="max-w-3xl">
        <Eyebrow icon={Tag}>Pricing</Eyebrow>
        <SectionTitle>Pick your number.</SectionTitle>
      </div>

      {/* items-start: the cards used to stretch to match Insights, leaving
          Essentials and Growth with ~200px of empty card above their buttons. */}
      <div className="mt-10 grid items-start gap-6 lg:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.name}
            /* Growth leads on a phone — it is the recommended plan and the
               one most people should land on first when the row stacks. */
            className={`relative flex flex-col rounded-3xl bg-white p-7 sm:p-8 lg:order-none ${
              p.popular ? "order-first" : ""
            } ${
              p.popular
                ? "shadow-card ring-2 ring-gold-on-dark"
                : "shadow-soft ring-1 ring-cream-200"
            }`}
          >
            {p.popular && (
              <span className="absolute -top-3.5 left-7 rounded-full bg-gold-on-dark px-4 py-1.5 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-navy-950">
                ⭐ Most popular
              </span>
            )}

            <p className="eyebrow text-gold-on-light">{p.name}</p>
            <p className="mt-3 flex flex-nowrap items-baseline gap-2 whitespace-nowrap">
              <span className="tnum font-display text-[3rem] font-semibold leading-none tracking-[-0.04em] text-ink">
                {p.price}
              </span>
              <span className="text-[1.05rem] text-ink-600">/mo</span>
            </p>
            <p className="mt-4 text-lg leading-relaxed text-ink-600">
              <Rich text={p.lede} />
            </p>

            <div className="mt-6 border-t border-cream-200 pt-6">
              {p.inherits && (
                <p className="eyebrow mb-4 text-ink-500">{p.inherits}</p>
              )}
              <ul className="flex flex-col gap-3.5">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-3 text-[1.05rem] leading-snug text-ink-600">
                    <Check size={20} className="mt-0.5 shrink-0 text-gold-on-light" />
                    <span>
                      <Rich text={f} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {p.fit && <p className="mt-5 text-[1rem] leading-snug text-ink-600">{p.fit}</p>}

            {/* follows the list at a fixed 32px, rather than pinned to the
                card bottom */}
            <div className="mt-8">
              <CTAButton
                location={`pricing-${p.name.toLowerCase()}`}
                variant={p.popular ? "primary" : "secondary"}
                className="w-full"
              >
                Start now
              </CTAButton>
            </div>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-8 max-w-3xl text-center text-[1.05rem] leading-relaxed text-ink-600">
        All plans: $250 one-time setup. Catch-up bookkeeping quoted flat per backlog
        month. Cancel anytime — your books are yours, exportable in one click.
      </p>

      {/* Sample scoreboard — show, don't explain. */}
      <div className="mt-18 rounded-3xl bg-white p-7 shadow-soft ring-1 ring-cream-200 sm:p-9">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-gold-on-light">
              <Gauge size={20} className="shrink-0" />
              Sample · included with Insights
            </p>
            <h3 className="mt-2 font-display text-[1.8rem] font-semibold tracking-[-0.03em] text-ink sm:text-[2.1rem]">
              Your Business Scoreboard
            </h3>
          </div>
          <p className="max-w-sm text-[1rem] leading-relaxed text-ink-600">
            Riverside Plumbing LLC, July 2026. Until the web portal ships, the Scoreboard
            is a page in the monthly PDF pack.
          </p>
        </div>

        <div className="mt-10 text-base">
          <Scoreboard theme="cream" />
        </div>
      </div>
    </Section>
  );
}
