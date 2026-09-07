import Link from "next/link";
import { notFound } from "next/navigation";

import Logo from "@/components/Logo";
import OfferBanner from "@/components/OfferBanner";
import { LAST_UPDATED, SECTIONS, hasPrivacyPolicy } from "@/lib/privacy";
import { ADDRESS_LINE, PHONE, hasPhone, phoneHref } from "@/lib/site-config";

export const metadata = {
  title: "Privacy Policy",
  description:
    "How DayFive collects, uses and stores the information you give us.",
  alternates: { canonical: "/privacy" },
};

/**
 * The page renders only once lib/privacy.js carries real text.
 *
 * Until then it is a 404, deliberately. A Privacy Policy is a legal
 * undertaking; a placeholder one is not a weaker version of that, it is a
 * false one — and Google Ads will read whatever is at this URL as the
 * advertiser's actual commitment.
 */
export default function PrivacyPage() {
  if (!hasPrivacyPolicy()) notFound();

  return (
    <main className="flex min-h-dvh flex-col bg-cream px-5 py-6 sm:px-8">
      <OfferBanner inFlow />

      <header className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4">
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

      <article className="mx-auto w-full max-w-3xl flex-1 py-12 sm:py-16">
        <h1 className="font-display text-[2.1rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[3rem]">
          Privacy Policy
        </h1>
        <p className="mt-4 text-[1rem] text-ink-500">
          Last updated {LAST_UPDATED}
        </p>

        {SECTIONS.map((section) => (
          <section key={section.heading} className="mt-10">
            <h2 className="font-display text-[1.5rem] font-semibold tracking-[-0.02em] text-ink sm:text-[1.8rem]">
              {section.heading}
            </h2>
            {section.body.map((block, i) =>
              Array.isArray(block) ? (
                <ul key={i} className="mt-4 flex list-disc flex-col gap-2 pl-6">
                  {block.map((item) => (
                    <li key={item} className="text-lg leading-relaxed text-ink-600">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p key={i} className="mt-4 text-lg leading-relaxed text-ink-600">
                  {block}
                </p>
              ),
            )}
          </section>
        ))}
      </article>

      <footer className="mx-auto w-full max-w-3xl border-t border-cream-200 pt-6 text-[1rem] text-ink-600">
        <p>
          Questions about any of this? Write to{" "}
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
          )}
          .
        </p>
        <p className="mt-2 text-[0.9rem] text-ink-500">{ADDRESS_LINE}</p>
      </footer>
    </main>
  );
}
