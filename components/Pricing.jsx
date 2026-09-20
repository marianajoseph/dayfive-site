import Link from "next/link";
import Section, { Eyebrow, SectionTitle } from "./Section";
import CTAButton from "./CTAButton";
import { Check, Tag } from "./Icons";
import { OFFER, PLAN, ROADMAP, TERMS } from "@/lib/pricing";

/**
 * ONE PRODUCT. Operator ruling, 2026-09-20.
 *
 * Growth and Insights are off the site; their copy is kept in
 * lib/archived-plans.js. Three tiers asked a visitor to classify their own
 * business before they had decided whether they wanted the thing at all, and
 * that classification is a conversation we can have later, with them.
 *
 * THE PRICE IS NOT IN THIS FILE. Everything numeric comes from lib/pricing.js,
 * which the banner, the /start eyebrow and the structured data read too — so a
 * price change is one edit rather than a hunt through five files.
 *
 * MOBILE FIRST. One card centres on a phone and never stacks, which is most of
 * why a single product is easier to sell on the device two thirds of the ad
 * traffic arrives on.
 */
export default function Pricing() {
  return (
    <Section id="pricing" divider>
      <div className="max-w-3xl">
        <Eyebrow icon={Tag}>Pricing</Eyebrow>
        <SectionTitle>One price. Everything included.</SectionTitle>
      </div>

      <div className="mt-10 flex justify-center">
        <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-card ring-1 ring-cream-200 sm:p-9">
          <p className="eyebrow text-gold-on-light">{PLAN.name.toUpperCase()}</p>

          <p className="mt-3 flex flex-nowrap items-baseline gap-2 whitespace-nowrap">
            <span className="tnum font-display text-[3.2rem] font-semibold leading-none tracking-[-0.04em] text-ink sm:text-[3.6rem]">
              {PLAN.price}
            </span>
            <span className="text-[1.05rem] text-ink-600">{PLAN.period}</span>
          </p>

          {OFFER.active && (
            <p className="mt-2 text-[1.05rem] font-semibold leading-snug text-gold-on-light">
              {OFFER.note}
            </p>
          )}

          <p className="mt-4 text-lg leading-relaxed text-ink-600">{PLAN.lede}</p>

          {/* The two promises carry the same weight as the price. They are what
              removes the risk, and a visitor reads them before the feature
              list — so they sit above it. */}
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
            <span className="text-[1.05rem] font-semibold text-ink">
              {TERMS.firstMonthFree}
            </span>
            <span className="text-[1.05rem] font-semibold text-ink">
              {TERMS.cancelAnytime}
            </span>
          </div>

          <div className="mt-6 border-t border-cream-200 pt-6">
            <ul className="flex flex-col gap-3.5">
              {PLAN.features.map((f) => (
                <li
                  key={f}
                  className="flex gap-3 text-[1.05rem] leading-snug text-ink-600"
                >
                  <Check size={20} className="mt-0.5 shrink-0 text-gold-on-light" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <CTAButton location="pricing-essentials" className="w-full">
              Start now
            </CTAButton>
          </div>

          {/* Everything we do not sell yet. It ASKS rather than promises —
              "we're building it next" is a statement about our plans, which we
              can make; a date would be a promise about delivery, which we
              cannot. */}
          <p className="mt-6 border-t border-cream-200 pt-6 text-[1rem] leading-relaxed text-ink-600">
            {ROADMAP.question}{" "}
            <Link
              href={ROADMAP.href}
              className="font-semibold text-gold-on-light underline underline-offset-4"
            >
              {ROADMAP.linkLabel}
            </Link>
            .
          </p>
        </div>
      </div>

      <p className="mx-auto mt-8 max-w-2xl text-center text-[1.05rem] leading-relaxed text-ink-600">
        Behind on your books? Catch-up is quoted flat, upfront, once we have seen
        your statements — never by the hour.
      </p>
    </Section>
  );
}
