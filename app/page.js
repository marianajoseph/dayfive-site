import Nav from "@/components/Nav";
import CTAButton from "@/components/CTAButton";
import Section, { Eyebrow, SectionTitle } from "@/components/Section";
import CalendarFive from "@/components/CalendarFive";
import Inbox from "@/components/Inbox";
import Pricing from "@/components/Pricing";
import Logo from "@/components/Logo";
import {
  SignedPage,
  Shoebox,
  EnvelopeSpark,
  CalendarStruck,
  Moon,
  Lock,
  Clock,
  Check,
  Wrench,
  Laptop,
  Cart,
  Stethoscope,
  Blocks,
  Squiggle,
} from "@/components/Icons";

/* ───────────────────────────────────────────────────────────── hero ─── */

const trustSignals = [
  "Bank-grade security",
  "Always-on automation",
  "Every number double-checked",
  "Flat monthly price",
];

function Hero() {
  return (
    <section className="band-navy relative overflow-hidden bg-navy-900 px-5 pb-16 pt-[5.5rem] text-mist sm:px-8 sm:pb-24 sm:pt-32 lg:pb-28 lg:pt-40">
      <div aria-hidden="true" className="glow-gold absolute inset-0" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <h1 className="rise font-display text-[2.05rem] font-semibold leading-[1.06] tracking-[-0.03em] text-cream sm:text-[3.2rem] lg:text-[4.1rem]">
            Your books. Closed by <span className="text-gold-400">day five</span>. Every
            month.
          </h1>

          <p
            className="rise mt-5 max-w-2xl text-lg font-semibold leading-[1.55] text-mist sm:mt-7 sm:text-xl"
            style={{ animationDelay: "90ms" }}
          >
            DayFive is your fully automated back office. Your bookkeeping runs 24/7 —
            while you sleep, we reconcile — and your monthly close lands by business day
            5, with five insights in plain English. Every number independently
            double-checked.
          </p>

          <p
            className="rise mt-4 text-[1.15rem] font-bold tracking-[-0.01em] text-gold-400 sm:mt-6 sm:text-[1.3rem]"
            style={{ animationDelay: "160ms" }}
          >
            Always on. Never late. No meetings needed.
          </p>

          <div
            className="rise mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:items-center"
            style={{ animationDelay: "230ms" }}
          >
            <CTAButton location="hero">Get your first close free</CTAButton>
            <CTAButton href="#how-it-works" variant="onNavy" location="hero" arrow={false}>
              How it works
            </CTAButton>
          </div>

          <ul
            className="rise mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-navy-700 pt-6 text-[1rem] text-mist-600 sm:mt-12 sm:pt-7"
            style={{ animationDelay: "300ms" }}
          >
            {trustSignals.map((s, i) => (
              <li key={s} className="flex items-center gap-3">
                {i > 0 && (
                  <span aria-hidden="true" className="text-navy-600">
                    ·
                  </span>
                )}
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rise lg:col-span-5" style={{ animationDelay: "380ms" }}>
          <CalendarFive />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────── problem ─── */

function Problem() {
  return (
    <Section inner="max-w-5xl">
      <Clock size={40} className="mb-7 text-gold-600" />
      <p className="font-display text-[1.7rem] font-medium leading-[1.28] tracking-[-0.025em] text-ink-600 sm:text-[2.2rem] lg:text-[2.6rem]">
        Your bookkeeper closes your books three weeks late and tells you nothing.
        <br className="hidden sm:block" /> Your accountant charges by the hour and
        answers by Friday.{" "}
        <strong className="font-semibold text-ink">You deserve better math.</strong>
      </p>
    </Section>
  );
}

/* ────────────────────────────────────────────────────── how it works ─── */

const steps = [
  {
    n: "1",
    icon: SignedPage,
    title: "Order online.",
    body: (
      <>
        Pick a package, sign electronically, connect your bank. Twenty minutes, start to
        finish. No discovery call. No proposal. No calendar links.
        <CalendarStruck
          size={30}
          className="ml-2 inline-block align-[-0.5em] text-gold-600"
        />
      </>
    ),
  },
  {
    n: "2",
    icon: Shoebox,
    title: "Forward us the mess.",
    body: (
      <>
        Email receipts to{" "}
        <a
          href="mailto:docs@dayfive.co"
          className="font-semibold text-gold-700 underline decoration-gold-500 decoration-2 underline-offset-4"
        >
          docs@dayfive.co
        </a>
        . Snap photos of invoices. Or change nothing — if you already use QuickBooks,
        Xero, or NetSuite, we work inside YOUR system. Shoebox or ERP, we swallow it all.
      </>
    ),
  },
  {
    n: "3",
    icon: EnvelopeSpark,
    title: "Day five: your numbers, explained.",
    body: (
      <>
        Every month, by the fifth business day: clean financials plus a one-page summary
        in plain English — five insights, ranked, each one actionable. Not &ldquo;revenue
        was $62,340.&rdquo; Instead:{" "}
        <em className="font-semibold not-italic text-gold-700">
          &ldquo;Your card fees grew 19% while revenue grew 8% — here&rsquo;s the script
          for the call to your processor.&rdquo;
        </em>
      </>
    ),
  },
];

function HowItWorks() {
  return (
    <Section id="how-it-works" tone="tint" divider>
      <div className="max-w-3xl">
        <Eyebrow>How it works</Eyebrow>
        <SectionTitle>Three steps. None of them a meeting.</SectionTitle>
      </div>

      <ol className="mt-12 grid gap-5 md:grid-cols-3">
        {steps.map((s) => {
          const StepIcon = s.icon;
          return (
            <li key={s.n} className="rounded-3xl bg-white p-7 shadow-soft sm:p-8">
              <div className="flex items-center gap-3.5">
                <span className="tnum flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500 text-[1.15rem] font-bold text-navy-950">
                  {s.n}
                </span>
                <StepIcon size={40} className="text-gold-600" />
              </div>
              <h3 className="mt-5 text-[1.35rem] font-bold tracking-[-0.02em] text-ink">
                {s.title}
              </h3>
              <p className="mt-3 text-lg leading-relaxed text-ink-600">{s.body}</p>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}

/* ──────────────────────────────────────────────────────── 24/7 part ─── */

function AlwaysOn() {
  return (
    <Section divider>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <Eyebrow icon={<Moon size={24} className="text-gold-600" />}>
            The 24/7 part
          </Eyebrow>
          <SectionTitle>
            While your old bookkeeper works banker&rsquo;s hours, DayFive works all of
            them.
          </SectionTitle>
        </div>

        <div className="lg:col-span-6 lg:pt-14">
          <p className="text-xl leading-relaxed text-ink-600">
            Our automated systems categorize, reconcile, and chase what&rsquo;s missing
            through the night — every number independently double-checked and reviewed
            before it reaches you.{" "}
            <strong className="font-bold text-ink">Ask your books anything, any hour:</strong>{" "}
            &ldquo;Can I afford to hire in October?&rdquo; gets a real answer at 11pm,
            from your actual numbers.
          </p>

          <div className="mt-8 rounded-3xl bg-white p-6 shadow-soft sm:p-7">
            <p className="text-[0.8rem] font-bold uppercase tracking-[0.14em] text-ink-500">
              11:04 PM · you
            </p>
            <p className="mt-2 text-lg text-ink">
              Can I afford to hire a second on-call tech in October?
            </p>
            <div className="mt-5 border-t border-cream-200 pt-4">
              <p className="flex items-center gap-2 text-[0.8rem] font-bold uppercase tracking-[0.14em] text-gold-700">
                <Moon size={17} className="text-gold-600" />
                11:04 PM · DayFive
              </p>
              <p className="mt-2 text-lg leading-relaxed text-ink-600">
                Yes, with room to spare. A second on-call tech at $68K fully loaded costs
                $5,670 a month. Your after-hours line ran a 61% margin in July, so
                breakeven is nine extra calls a month — you averaged twenty-three. Cash
                dips to $196K on September 12 and recovers by the 30th, so October is the
                right month to start, not September.
              </p>
            </div>
            <p className="mt-5 text-[1rem] text-ink-500">
              Included in Growth and Insights plans when the portal ships. Until then,
              write to us — the answer still arrives, in writing.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ───────────────────────────────────────────────────── first close ─── */

function FirstClose() {
  return (
    <Section id="first-close" tone="tint" divider>
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-6 flex justify-center">
          <Check size={44} className="text-gold-600" />
        </div>
        <Eyebrow className="justify-center">Your first close is on us</Eyebrow>
        <SectionTitle>Try DayFive with nothing to lose.</SectionTitle>

        <p className="mt-7 text-xl leading-relaxed text-ink-600">
          Sign up, connect in twenty minutes, and we&rsquo;ll bring your books current and
          deliver your{" "}
          <strong className="font-bold text-ink">
            first monthly close — statements plus the five-insight summary — free.
          </strong>{" "}
          Love it, do nothing, and your plan begins the following month. Not for you?
          Cancel in two clicks{" "}
          <strong className="font-bold text-ink">and keep the clean books.</strong>{" "}
          That&rsquo;s how confident we are in what lands on day five.
        </p>

        <div className="mt-9 flex justify-center">
          <CTAButton location="first-close">Start now</CTAButton>
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-[1.05rem] leading-relaxed text-ink-500">
          (Fine print, honestly: card on file at signup, billing starts only after your
          free close; catch-up beyond three months of backlog quoted separately; one trial
          per business.)
        </p>
      </div>
    </Section>
  );
}

/* ────────────────────────────────────────────────────── no meetings ─── */

function NoMeetings() {
  return (
    <Section divider>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <Eyebrow icon={<CalendarStruck size={24} className="text-gold-600" />}>
            Why you&rsquo;ll never need a meeting
          </Eyebrow>
          <SectionTitle>Because meetings are how the old firms bill you.</SectionTitle>
          <p className="mt-7 text-xl leading-relaxed text-ink-600">
            Everything DayFive delivers arrives in writing — clear enough that no call is
            needed. You get your evenings back; nobody gets a calendar invite. Real people
            review everything behind the scenes, and if a question ever needs one, your
            answer still arrives in writing — usually within hours, often within minutes.
          </p>
        </div>

        <div className="grid gap-4 lg:col-span-6 lg:pt-8">
          <div className="rounded-3xl border-2 border-dashed border-cream-300 p-6 sm:p-7">
            <p className="text-[0.8rem] font-bold uppercase tracking-[0.14em] text-ink-500">
              The old way
            </p>
            <p className="mt-3 text-xl leading-relaxed text-ink-500 line-through decoration-status-bad decoration-2">
              hourly bills, three-week closes, &ldquo;let&rsquo;s hop on a call.&rdquo;
            </p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-card ring-2 ring-gold-500 sm:p-7">
            <p className="text-[0.8rem] font-bold uppercase tracking-[0.14em] text-gold-700">
              DayFive
            </p>
            <p className="mt-3 font-display text-[1.45rem] font-semibold leading-snug tracking-[-0.025em] text-ink">
              flat price, day-five close, already answered.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ──────────────────────────────────────────── who we serve + security ─── */

const trades = [
  [Wrench, "Contractors"],
  [Laptop, "Agencies"],
  [Cart, "E-commerce"],
  [Stethoscope, "Healthcare"],
  [Blocks, "Childcare"],
];

function WhoWeServe() {
  return (
    <Section tone="tint" divider>
      <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <Eyebrow>Who we serve</Eyebrow>
          <p className="font-display text-[1.6rem] font-medium leading-[1.3] tracking-[-0.025em] text-ink-600 sm:text-[1.95rem]">
            Service businesses from $300K to $5M in revenue: contractors, agencies,
            e-commerce, healthcare practices,{" "}
            <strong className="font-semibold text-ink">
              and childcare centers — our specialty.
            </strong>
          </p>
          <p className="mt-5 text-lg leading-relaxed text-ink-600">
            (We speak Brightwheel, tuition billing, CCAP, and district UPK contracts
            fluently.)
          </p>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-5">
            {trades.map(([TradeIcon, label]) => (
              <li key={label} className="flex w-20 flex-col items-center gap-2 text-center">
                <TradeIcon size={34} className="text-gold-600" />
                <span className="text-[0.95rem] font-medium text-ink-600">{label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <Eyebrow icon={<Lock size={24} className="text-gold-600" />}>Security</Eyebrow>
          <ul className="flex flex-col gap-4">
            {[
              "Bank-level encryption in transit and at rest",
              "Your data never trains AI models or leaves our controlled pipeline",
              "Every automated entry carries an audit trail",
              "Reviewed under treasury-department standards",
              "Read-only bank connections via Plaid — we can see, never move",
            ].map((s) => (
              <li key={s} className="flex gap-3 text-lg leading-snug text-ink-600">
                <Check size={20} className="mt-1 shrink-0 text-gold-600" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
          <p className="mt-7 rounded-2xl bg-white px-6 py-5 text-[1.2rem] font-bold leading-snug tracking-[-0.01em] text-ink shadow-soft">
            Money never moves without a human&rsquo;s explicit action. Ever.
          </p>
        </div>
      </div>
    </Section>
  );
}

/* ───────────────────────────────────────────────────────────── about ─── */

function About() {
  return (
    <Section divider inner="max-w-4xl">
      <Eyebrow>About</Eyebrow>
      <p className="font-display text-[1.45rem] font-medium leading-[1.4] tracking-[-0.02em] text-ink-600 sm:text-[1.75rem]">
        DayFive was built on a simple observation: small businesses get the worst
        financial service money can buy — slow, expensive, and silent. So we built the
        back office we&rsquo;d want to own: always-on automation for speed and
        availability, professional oversight on every number, and a promise in the name.{" "}
        <strong className="relative inline-block font-semibold text-ink">
          Your books, by day five.
          <Squiggle className="absolute -bottom-1.5 left-0 h-2.5 w-full text-gold-500" />
        </strong>
      </p>
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────── FAQ ─── */

const faqs = [
  [
    "Is this just ChatGPT doing my books?",
    "No. Purpose-built agent workflows with confidence thresholds, independent review agents checking the work, and human sign-off on everything client-facing. The AI does the volume; the judgment is layered and audited.",
  ],
  [
    "What if the AI makes a mistake?",
    "Every entry is confidence-scored; anything uncertain routes to human review before posting. We carry professional liability insurance like any real firm — because we are one.",
  ],
  [
    "Do I have to switch accounting software?",
    "No. Keep QuickBooks, Xero, or NetSuite — we work inside it. No system at all? We host QuickBooks for you, included.",
  ],
  [
    "Do you do taxes?",
    "We prepare everything your tax preparer needs and partner with licensed EAs/CPAs for filing. Your books will be the cleanest they've ever received.",
  ],
  [
    "What does “no meetings” mean if I have a problem?",
    "Write to us any hour; answers come fast and in writing. You'll find it's better: written answers can be re-read, forwarded, and acted on.",
  ],
  [
    "Can I really cancel anytime?",
    "Yes. Month to month. Your data exports in one click. We keep clients with day-five closes, not contracts.",
  ],
];

function FAQ() {
  return (
    <Section id="faq" tone="tint" divider inner="max-w-4xl">
      <Eyebrow>Questions</Eyebrow>
      <SectionTitle>The honest six.</SectionTitle>

      <div className="mt-10 overflow-hidden rounded-3xl bg-white shadow-soft">
        {faqs.map(([q, a], i) => (
          <details key={q} className={`group ${i > 0 ? "border-t border-cream-200" : ""}`}>
            <summary className="flex cursor-pointer list-none items-start justify-between gap-5 px-6 py-6 text-left [&::-webkit-details-marker]:hidden sm:px-8">
              <span className="text-[1.15rem] font-bold leading-snug tracking-[-0.015em] text-ink sm:text-[1.25rem]">
                {q}
              </span>
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream text-[1.3rem] font-semibold text-gold-700 transition-transform duration-300 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="px-6 pb-6 pr-14 text-lg leading-relaxed text-ink-600 sm:px-8 sm:pr-20">
              {a}
            </p>
          </details>
        ))}
      </div>
    </Section>
  );
}

/* ───────────────────────────── closing navy band: CTA + footer ─────── */

function ClosingBand() {
  return (
    <section className="band-navy relative overflow-hidden bg-navy-900 text-mist">
      <div aria-hidden="true" className="glow-gold absolute inset-0" />

      <div className="relative mx-auto max-w-4xl px-5 py-20 text-center sm:px-8 sm:py-28 lg:py-32">
        <h2 className="font-display text-[2.3rem] font-semibold leading-[1.06] tracking-[-0.03em] text-cream sm:text-[3.2rem] lg:text-[3.8rem]">
          Stop chasing your bookkeeper.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg font-semibold leading-relaxed text-mist sm:text-xl">
          Onboarded in twenty minutes. First close free. Decide with the evidence in hand.
        </p>
        <div className="mt-9 flex justify-center">
          <CTAButton location="footer-cta">Get your first close free</CTAButton>
        </div>
      </div>

      <footer className="relative border-t border-navy-700 px-5 py-12 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Logo tone="light" />
            <p className="mt-3 max-w-sm text-[1rem] leading-relaxed text-mist-600">
              Bookkeeping for New Jersey service businesses. Your monthly close, by
              business day five.
            </p>
          </div>

          <div className="flex flex-col gap-1 text-[1rem] text-mist-600 sm:items-end">
            <a
              href="mailto:docs@dayfive.co"
              className="py-1.5 transition-colors hover:text-gold-300"
            >
              docs@dayfive.co
            </a>
            <div className="flex gap-6">
              <a href="#pricing" className="py-1.5 transition-colors hover:text-gold-300">
                Pricing
              </a>
              <a href="#faq" className="py-1.5 transition-colors hover:text-gold-300">
                Questions
              </a>
              <a href="/start" className="py-1.5 transition-colors hover:text-gold-300">
                Get started
              </a>
            </div>
            <p className="mt-2 text-[0.9rem] text-mist-700">
              © {new Date().getFullYear()} DayFive. All figures shown are illustrative
              samples for a fictional client.
            </p>
          </div>
        </div>
      </footer>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────── page ─── */

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <Inbox />
        <AlwaysOn />
        <Pricing />
        <FirstClose />
        <NoMeetings />
        <WhoWeServe />
        <About />
        <FAQ />
      </main>
      <ClosingBand />
    </>
  );
}
