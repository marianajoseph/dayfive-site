import Image from "next/image";
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
  Route,
  Gift,
  People,
  Notebook,
  Question,
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
          <h1 className="font-display text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.03em] text-cream sm:text-[3.2rem] lg:text-[4.1rem]">
            Your books. Closed by <span className="text-gold-on-dark">day five</span>. Every
            month.
          </h1>

          <p
            className="mt-5 max-w-2xl text-lg font-semibold leading-[1.55] text-mist sm:mt-7 sm:text-xl"
          >
            DayFive is your fully automated back office. Your bookkeeping runs 24/7 —
            while you sleep, we reconcile — and your monthly close lands by business day
            5, with five insights in plain English. Every number independently
            double-checked.
          </p>

          <p
            className="mt-4 text-[1.15rem] font-bold tracking-[-0.01em] text-gold-on-dark sm:mt-6 sm:text-[1.3rem]"
          >
            Always on. Never late. No meetings needed.
          </p>

          <div
            className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:items-center"
          >
            <CTAButton location="hero">Get your first close free</CTAButton>
            <CTAButton href="#how-it-works" variant="onNavy" location="hero" arrow={false}>
              How it works
            </CTAButton>
          </div>

        </div>

        <div className="lg:col-span-5">
          <CalendarFive />
        </div>
      </div>

      {/* Full width, below the two columns: at 1152px the four chips sit on one
          line with room to spare, so nothing wraps and no separator strands. */}
      <ul
        className="relative mx-auto mt-12 max-w-6xl border-t border-navy-700 pt-6 text-[1rem] text-mist-600 trust-row"
      >
        {trustSignals.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────── problem ─── */

function Problem() {
  return (
    <Section inner="max-w-5xl">
      <Clock size={40} className="mb-7 text-gold-on-light" />
      {/* Stays in the serif — it is a pull quote, not body copy — but drops
          from ~42px to 32px so it stops competing with the section titles. */}
      <p className="font-display text-[1.6rem] font-medium leading-[1.3] tracking-[-0.025em] text-ink-600 sm:text-[1.85rem] lg:text-[2rem]">
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
          className="ml-2 inline-block align-[-0.5em] text-gold-on-light"
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
          className="font-semibold text-gold-on-light underline decoration-gold-on-dark decoration-2 underline-offset-4"
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
        <em className="font-semibold not-italic text-gold-on-light">
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
        <Eyebrow icon={Route}>How it works</Eyebrow>
        <SectionTitle>Three steps. None of them a meeting.</SectionTitle>
      </div>

      <ol className="mt-10 grid gap-6 md:grid-cols-3">
        {steps.map((s) => {
          const StepIcon = s.icon;
          return (
            <li key={s.n} className="rounded-3xl bg-white p-7 shadow-soft sm:p-8">
              <div className="flex items-center gap-3.5">
                <span className="tnum flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-on-dark text-[1.15rem] font-bold text-navy-950">
                  {s.n}
                </span>
                <StepIcon size={40} className="text-gold-on-light" />
              </div>
              <h3 className="mt-5 text-[1.35rem] font-bold tracking-[-0.02em] text-ink">
                {s.title}
              </h3>
              <p className="mt-3 text-lg leading-relaxed text-ink-600">{s.body}</p>
            </li>
          );
        })}
      </ol>

      {/* Step 3, shown instead of described. The screen is our own artwork
          warped into the photograph, so what he is reading is the insight
          quoted directly above — not a stock prop carrying invented numbers
          that fall apart when you look at them. Cropped 14:9 so the handset
          stays big enough to read in one glance; the file is 2240px, twice
          the widest slot it can occupy here. The filter pulls the jacket's
          red back toward brick, so it sits with the cream instead of
          shouting over it. */}
      <figure className="mt-12">
        <div className="overflow-hidden rounded-3xl shadow-card">
          <div className="relative aspect-[14/9] w-full bg-cream-tint">
            <Image
              src="/day-five-insight-in-hand.jpg"
              alt="A tradesperson in a red work jacket stands at a job holding his phone. The screen reads: Day 5, insight 1 of 5 — card fees grew 19%, revenue grew 8%, here's the script for that call."
              fill
              sizes="(min-width: 1200px) 1088px, 100vw"
              className="object-cover [filter:saturate(0.9)_contrast(1.01)_sepia(0.05)]"
            />
          </div>
        </div>
        <figcaption className="mt-4 text-[0.95rem] leading-relaxed text-ink-500">
          Day five, as it actually arrives: one ranked insight and the next move,
          on the job, with nobody booking a call about it.
        </figcaption>
      </figure>
    </Section>
  );
}

/* ──────────────────────────────────────────────────────── 24/7 part ─── */

function AlwaysOn() {
  return (
    <Section divider>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <Eyebrow icon={Moon}>
            The 24/7 part
          </Eyebrow>
          <SectionTitle>
            While your old bookkeeper works banker&rsquo;s hours, DayFive works all of
            them.
          </SectionTitle>

          {/* The client's side of the promise: his workday, his phone, his
              numbers arriving — sitting opposite the 11:04pm exchange.
              Held to 380px and cropped 4:5 rather than run full-width, so it
              reads as a deliberate portrait. The source is 816px wide, which
              covers this slot at 2x — it stays sharp on retina screens.

              Crop is biased upward (26%) to hold his face and the phone in
              frame together; centring it would cut the phone. The filter is
              doing real work: the denim is the coolest thing on the page, so
              a little desaturation and a touch of sepia settle it onto the
              cream instead of letting it sit on top as a cold rectangle. */}
          <figure className="mt-10 max-w-[380px] overflow-hidden rounded-3xl shadow-card">
            <div className="relative aspect-[4/5] w-full bg-cream-tint">
              <Image
                src="/handyman-checking-phone.jpg"
                alt="A handyman in a denim shirt and tan overalls stands in his workshop, frowning slightly as he reads something on his phone."
                fill
                sizes="380px"
                className="object-cover object-[50%_26%] [filter:saturate(0.92)_contrast(1.01)_sepia(0.05)]"
              />
            </div>
          </figure>
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

          <div className="mt-10 rounded-3xl bg-white p-7 shadow-soft">
            <p className="text-[0.8rem] font-bold uppercase tracking-[0.14em] text-ink-500">
              11:04 PM · you
            </p>
            <p className="mt-2 text-lg text-ink">
              Can I afford to hire a second on-call tech in October?
            </p>
            <div className="mt-5 border-t border-cream-200 pt-4">
              <p className="flex items-center gap-2 text-[0.8rem] font-bold uppercase tracking-[0.14em] text-gold-on-light">
                <Moon size={17} className="text-gold-on-light" />
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
            <p className="mt-5 text-[1rem] text-ink-600">
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
          <Check size={44} className="text-gold-on-light" />
        </div>
        <Eyebrow icon={Gift} className="justify-center">
            Your first close is on us
          </Eyebrow>
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

        {/* the dominant close on the page */}
        <div className="mt-9 flex justify-center">
          <CTAButton location="first-close" className="min-h-[3.75rem] px-10 text-[1.15rem]">
            Start now
          </CTAButton>
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-[1.05rem] leading-relaxed text-ink-600">
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
          <Eyebrow icon={CalendarStruck}>
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

        {/* self-start so the boxes size to their contents — as grid children
            they were stretching to match the paragraph column and ran about
            three times taller than the text inside them. The dashed border
            already says "old way", so the strikethrough is gone: one signal,
            and the sentence is readable again. */}
        <div className="flex flex-col gap-6 self-start lg:col-span-6 lg:pt-8">
          <div className="rounded-3xl border-2 border-dashed border-cream-300 p-7">
            <p className="eyebrow text-ink-500">The old way</p>
            <p className="mt-3 text-xl leading-relaxed text-ink-600">
              hourly bills, three-week closes, &ldquo;let&rsquo;s hop on a call.&rdquo;
            </p>
          </div>
          <div className="rounded-3xl bg-white p-7 shadow-card ring-2 ring-gold-on-dark">
            <p className="eyebrow text-gold-on-light">DayFive</p>
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

/* "E-commerce" ran to two lines while the other four sat on one, which broke
   the row's baseline. Unhyphenated it fits, and the label row is fixed. */
const trades = [
  [Wrench, "Contractors"],
  [Laptop, "Agencies"],
  [Cart, "Ecommerce"],
  [Stethoscope, "Healthcare"],
  [Blocks, "Childcare"],
];

function WhoWeServe() {
  return (
    <Section tone="tint" divider>
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <Eyebrow icon={People}>Who we serve</Eyebrow>
          {/* Sans, not serif: this is a paragraph, not a headline. */}
          <p className="max-w-[64ch] text-xl leading-[1.6] text-ink-600">
            Service businesses from $300K to $5M in revenue: contractors, agencies,
            e-commerce, healthcare practices,{" "}
            <strong className="font-bold text-ink">
              and childcare centers — our specialty.
            </strong>
          </p>
          <p className="mt-5 max-w-[64ch] text-lg leading-relaxed text-ink-600">
            (We speak Brightwheel, tuition billing, CCAP, and district UPK contracts
            fluently.)
          </p>

          <ul className="mt-10 flex flex-wrap items-start gap-x-6 gap-y-6">
            {trades.map(([TradeIcon, label]) => (
              <li
                key={label}
                className="flex min-w-[5rem] flex-col items-center text-center"
              >
                <TradeIcon size={34} className="text-gold-on-light" />
                <span className="mt-2 flex h-10 items-start whitespace-nowrap text-[0.95rem] font-medium text-ink-600">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <Eyebrow icon={Lock}>Security</Eyebrow>
          <ul className="flex flex-col gap-4">
            {[
              "Bank-level encryption in transit and at rest",
              "Your data never trains AI models or leaves our controlled pipeline",
              "Every automated entry carries an audit trail",
              "Reviewed under treasury-department standards",
              "Read-only bank connections via Plaid — we can see, never move",
            ].map((s) => (
              <li key={s} className="flex gap-3 text-lg leading-snug text-ink-600">
                <Check size={20} className="mt-1 shrink-0 text-gold-on-light" />
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
      <Eyebrow icon={Notebook}>About</Eyebrow>
      {/* Was the only sustained body copy on the page set in the display
          serif, at ~28px across ~75 characters — the single strongest "pricey"
          signal on the site. Now sans at 20px/1.6 on a 64ch measure, with the
          serif kept for the closing line, which is the accent. */}
      <p className="max-w-[64ch] text-xl leading-[1.6] text-ink-600">
        DayFive was built on a simple observation: small businesses get the worst
        financial service money can buy — slow, expensive, and silent. So we built the
        back office we&rsquo;d want to own: always-on automation for speed and
        availability, professional oversight on every number, and a promise in the name.{" "}
        <strong className="relative inline-block font-display text-[1.35rem] font-semibold tracking-[-0.02em] text-ink">
          Your books, by day five.
          <Squiggle className="absolute -bottom-1.5 left-0 h-2.5 w-full text-gold-on-light" />
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
      <Eyebrow icon={Question}>Questions</Eyebrow>
      <SectionTitle>The honest six.</SectionTitle>

      <div className="mt-10 overflow-hidden rounded-3xl bg-white shadow-soft">
        {faqs.map(([q, a], i) => (
          /* The first answer is open on load, so the accordion doesn't read as
             inert. Dividers lifted off the cream hairline, which was reading
             as a rendering artefact rather than a rule. */
          <details
            key={q}
            open={i === 0}
            className={`group ${i > 0 ? "border-t border-[rgb(11_26_44_/_0.10)]" : ""}`}
          >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-5 px-6 py-6 text-left [&::-webkit-details-marker]:hidden sm:px-8">
              <span className="text-[1.15rem] font-bold leading-snug tracking-[-0.015em] text-ink sm:text-[1.25rem]">
                {q}
              </span>
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream text-[1.3rem] font-semibold text-gold-on-light transition-transform duration-300 group-open:rotate-45"
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
        {/* A text link, not a fourth gold pill. "Try DayFive with nothing to
            lose" is the dominant close; this band is the reminder. */}
        <div className="mt-9 flex justify-center">
          <CTAButton location="footer-cta" variant="linkOnNavy">
            Get your first close free
          </CTAButton>
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

          {/* py-3 keeps every footer link at a 44px tap target */}
          <div className="flex flex-col text-[1rem] text-mist-600 sm:items-end">
            <a
              href="mailto:docs@dayfive.co"
              className="inline-flex min-h-[2.75rem] items-center transition-colors hover:text-gold-hover"
            >
              docs@dayfive.co
            </a>
            <div className="flex gap-6">
              <a
                href="#pricing"
                className="inline-flex min-h-[2.75rem] items-center transition-colors hover:text-gold-hover"
              >
                Pricing
              </a>
              <a
                href="#faq"
                className="inline-flex min-h-[2.75rem] items-center transition-colors hover:text-gold-hover"
              >
                Questions
              </a>
              <a
                href="/start"
                className="inline-flex min-h-[2.75rem] items-center transition-colors hover:text-gold-hover"
              >
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
