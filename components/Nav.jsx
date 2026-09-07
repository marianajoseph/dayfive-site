"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import CTAButton from "./CTAButton";
import OfferBanner from "./OfferBanner";
import { PHONE, hasPhone, phoneHref } from "@/lib/site-config";

const links = [
  ["How it works", "#how-it-works"],
  ["What you get", "#inbox"],
  ["Pricing", "#pricing"],
  ["Questions", "#faq"],
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* At the top the bar floats over the navy hero band. Past 80px it lands on
     cream and needs a real fill and a bottom edge — without them the sample
     document cards slid under the links. */
  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid
          ? "border-b border-[rgb(11_26_44_/_0.10)] bg-[rgb(247_243_234_/_0.94)] backdrop-blur-[8px]"
          : "border-b border-transparent"
      }`}
    >
      {/* The banner rides INSIDE the fixed header so it stays put on scroll
          and needs no layout offset anywhere else on the page. */}
      <OfferBanner />

      <div className="mx-auto flex h-[3.75rem] max-w-6xl items-center justify-between px-5 sm:h-[4.5rem] sm:px-8">
        <Link href="/" aria-label="DayFive — home" className="shrink-0 py-2">
          <Logo tone={solid ? "dark" : "light"} />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className={`text-[1rem] font-medium transition-colors ${
                solid ? "text-ink-600 hover:text-gold-on-light" : "text-mist-600 hover:text-gold-hover"
              }`}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          {hasPhone() && (
            <a
              href={phoneHref()}
              className={`text-[1rem] font-semibold transition-colors ${
                solid ? "text-ink hover:text-gold-on-light" : "text-cream hover:text-gold-hover"
              }`}
            >
              {PHONE}
            </a>
          )}
          <CTAButton
            location="nav"
            className="min-h-[2.9rem] px-6 text-[0.98rem] sm:min-h-[2.9rem]"
            arrow={false}
          >
            Get your first close free
          </CTAButton>
        </div>

        {/* Click-to-call, phones only. Renders nothing until a real number is
            set in lib/site-config.js — see the note on PHONE.

            A GLYPH, NOT THE NUMBER. Spelled out at 0.95rem the number is ~160px
            wide, which alongside the logo and the menu button overflowed a
            390px viewport and pushed the whole document sideways — the hero
            headline clipped at the right edge on every phone. The number itself
            is one tap away and repeated in both footers; the header only has to
            offer the call. */}
        {hasPhone() && (
          <a
            href={phoneHref()}
            aria-label={`Call DayFive on ${PHONE}`}
            className={`ml-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors lg:hidden ${
              solid ? "text-ink hover:bg-cream-tint" : "text-cream hover:bg-white/10"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M6.5 3.5h3l1.5 4-2 1.4a12 12 0 0 0 6.1 6.1l1.4-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z" />
            </svg>
          </a>
        )}

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className={`-mr-2 flex h-12 w-12 items-center justify-center rounded-full transition-colors lg:hidden ${
            solid ? "text-ink hover:bg-cream-tint" : "text-cream hover:bg-white/10"
          }`}
        >
          <span aria-hidden="true" className="relative block h-3.5 w-5">
            <span
              className={`absolute left-0 block h-[2px] w-full rounded-full bg-current transition-all duration-200 ${
                open ? "top-1.5 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-1.5 block h-[2px] w-full rounded-full bg-current transition-opacity ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 block h-[2px] w-full rounded-full bg-current transition-all duration-200 ${
                open ? "top-1.5 -rotate-45" : "top-3"
              }`}
            />
          </span>
        </button>
      </div>

      {open && (
        <div id="mobile-menu" className="border-t border-cream-200 bg-cream px-5 pb-6 pt-1 lg:hidden">
          <nav aria-label="Mobile" className="flex flex-col">
            {links.map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="border-b border-cream-200 py-4 text-[1.1rem] font-medium text-ink"
              >
                {label}
              </a>
            ))}
          </nav>
          <CTAButton location="nav-mobile" className="mt-5 w-full">
            Get your first close free
          </CTAButton>
        </div>
      )}
    </header>
  );
}
