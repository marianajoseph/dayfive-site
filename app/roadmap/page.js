import Link from "next/link";
import Nav from "@/components/Nav";
import RoadmapForm from "@/components/RoadmapForm";
import { ROADMAP } from "@/lib/pricing";

export const metadata = {
  title: "Tell us what you need — DayFive",
  description:
    "AP/AR, forecasting, management reporting — tell us what you need from your bookkeeping and we'll build it next.",
  robots: { index: false, follow: true },
};

/**
 * The roadmap page.
 *
 * noindex: this is a page we point customers at from the pricing card, not one
 * we want ranking for "forecasting" — a search engine sending somebody here
 * would land them on a form for a thing we do not sell yet, which is the worst
 * possible first impression of the thing we do.
 */
export default function RoadmapPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-2xl px-5 pb-24 pt-10 sm:px-6 sm:pt-16">
        <p className="eyebrow text-gold-on-light">What we're building</p>
        <h1 className="mt-3 font-display text-[2.1rem] font-semibold leading-tight tracking-[-0.03em] text-ink sm:text-[2.8rem]">
          Tell us what you need.
        </h1>
        <p className="mt-4 text-[1.1rem] leading-relaxed text-ink-600">
          Today DayFive does one thing: your books, closed by day five, for one
          flat price. Accounts payable and receivable, cash forecasting and
          management reporting are what we're building next — and what we build
          first is whatever people ask for most.
        </p>
        <p className="mt-3 text-[1.1rem] leading-relaxed text-ink-600">
          So tell us. It takes a minute and a real person reads it.
        </p>

        <div className="mt-8">
          <RoadmapForm />
        </div>

        <p className="mt-8 text-[1rem] text-ink-600">
          <Link href="/#pricing" className="underline underline-offset-4">
            Back to pricing
          </Link>
        </p>
      </main>
    </>
  );
}
