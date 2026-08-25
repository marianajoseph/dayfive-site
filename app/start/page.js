import Link from "next/link";
import Logo from "@/components/Logo";
import EmailCapture from "@/components/EmailCapture";
import { Check, EnvelopeSpark } from "@/components/Icons";

export const metadata = {
  title: "Get started",
  description:
    "Onboarding for DayFive — automated bookkeeping and FP&A — opens shortly. Leave your email and we'll write to you the moment it does.",
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
            <p className="mb-5 flex items-center gap-3 text-[0.8rem] font-bold uppercase tracking-[0.16em] text-gold-on-light">
              <EnvelopeSpark size={24} className="text-gold-on-light" />
              Almost there
            </p>

            <h1 className="font-display text-[2.1rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[3rem]">
              Onboarding opens shortly —{" "}
              <span className="text-gold-on-light">leave your email</span>
            </h1>

            <p className="mt-6 max-w-lg text-xl leading-relaxed text-ink-600">
              We&rsquo;re finishing the twenty-minute checkout — package, electronic
              signature, bank connection. Leave your address and you&rsquo;ll be first
              through the door, with your first monthly close free.
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
            <EmailCapture />
          </div>
        </div>
      </div>

      <footer className="mx-auto w-full max-w-5xl border-t border-cream-200 pt-6 text-[1rem] text-ink-600">
        <p>
          Questions before you sign up? Write to{" "}
          <a
            href="mailto:docs@dayfive.co"
            className="font-semibold text-gold-on-light underline decoration-gold-on-dark decoration-2 underline-offset-4"
          >
            docs@dayfive.co
          </a>{" "}
          — you&rsquo;ll get a written answer, usually within hours.
        </p>
      </footer>
    </main>
  );
}
