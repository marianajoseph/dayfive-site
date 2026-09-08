import Link from "next/link";
import Logo from "@/components/Logo";
import EmailCapture from "@/components/EmailCapture";
import { Check, Tag } from "@/components/Icons";
import OfferBanner from "@/components/OfferBanner";
import {
  ADDRESS_LINE,
  PHONE,
  RESERVE_EYEBROW,
  RESERVE_HEADING_ACCENT,
  RESERVE_HEADING_LEAD,
  RESERVE_INTRO,
  RESERVE_LEDE,
  hasPhone,
  phoneHref,
} from "@/lib/site-config";

export const metadata = {
  title: "Get started",
  description:
    "Reserve your free first close with DayFive — automated bookkeeping and FP&A. Tell us about your business and we will reach out within one business day.",
  robots: { index: false, follow: true },
};

const promises = [
  ["Twenty minutes", "Pick a package, sign electronically, connect your bank."],
  ["First close free", "Statements plus the five-insight summary, on us."],
  ["Cancel in two clicks", "And keep the clean books. No contract, no call."],
];

export default function StartPage() {
  return (
    <main className="flex min-h-dvh flex-col bg-cream px-5 py-6 sm:px-8">
      {/* No fixed nav on this page, so the banner is an ordinary first element
          rather than part of a floating header. -mx pulls it full-bleed. */}
      <OfferBanner inFlow />

      <header className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4">
        <Link href="/" aria-label="DayFive — home" className="py-2">
          <Logo />
        </Link>
        <Link
          href="/"
          className="py-2 text-[1rem] font-medium text-ink-600 transition-colors hover:text-gold-on-light"
        >
          ← Back to the site
        </Link>
      </header>

      <div className="mx-auto flex w-full max-w-5xl flex-1 items-center py-12 sm:py-20">
        <div className="grid w-full items-start gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            {/* Same eyebrow treatment as before — 24px glyph, gold, uppercase,
                0.16em tracking. The GLYPH changed from an envelope to the tag:
                an envelope beside a price reads as a mistake, and Tag is
                already this site's symbol for pricing (see the Pricing
                section's eyebrow). Swap EnvelopeSpark back in if you meant the
                icon itself to stay. */}
            <p className="mb-5 flex items-center gap-3 text-[0.8rem] font-bold uppercase tracking-[0.16em] text-gold-on-light">
              <Tag size={24} className="text-gold-on-light" />
              {RESERVE_EYEBROW}
            </p>

            {/* NOT operator copy. The originals said onboarding "opens shortly"
                and invited people to "leave your email" — waitlist language,
                which contradicts a page whose button now reserves a close.
                Changed for coherence rather than for style; both live in
                lib/site-config.js and are one line each to replace. */}
            <h1 className="font-display text-[2.1rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[3rem]">
              {RESERVE_HEADING_LEAD}{" "}
              <span className="text-gold-on-light">{RESERVE_HEADING_ACCENT}</span>
            </h1>

            <p className="mt-6 max-w-lg text-xl leading-relaxed text-ink-600">
              {RESERVE_LEDE}
            </p>

            <ul className="mt-9 flex flex-col gap-5 border-t border-cream-200 pt-8">
              {promises.map(([title, body]) => (
                <li key={title} className="flex gap-4">
                  <Check size={22} className="mt-1 shrink-0 text-gold-on-light" />
                  <span>
                    <strong className="block text-[1.15rem] font-bold tracking-[-0.015em] text-ink">
                      {title}
                    </strong>
                    <span className="text-lg leading-relaxed text-ink-600">{body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-white p-7 shadow-card sm:p-9">
            <p className="mb-7 text-lg leading-relaxed text-ink-600">
              {RESERVE_INTRO}
            </p>
            <EmailCapture />
          </div>
        </div>
      </div>

      <footer className="mx-auto w-full max-w-5xl border-t border-cream-200 pt-6 text-[1rem] text-ink-600">
        <p>
          Questions before you sign up? Write to{" "}
          <a
            href="mailto:docs@getdayfive.com"
            className="font-semibold text-gold-on-light underline decoration-gold-on-dark decoration-2 underline-offset-4"
          >
            docs@getdayfive.com
          </a>
          {hasPhone() && (
            <>
              {" or call "}
              <a
                href={phoneHref()}
                className="font-semibold text-gold-on-light underline decoration-gold-on-dark decoration-2 underline-offset-4"
              >
                {PHONE}
              </a>
            </>
          )}{" "}
          — you&rsquo;ll get a written answer, usually within hours.
        </p>
        <p className="mt-2 text-[0.9rem] text-ink-500">{ADDRESS_LINE}</p>
      </footer>
    </main>
  );
}
