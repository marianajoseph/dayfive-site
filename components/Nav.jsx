"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import CTAButton from "./CTAButton";

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
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* At the top the bar floats over the navy hero band; once you scroll it
     lands on cream and flips to dark type. */
  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid
          ? "border-b border-cream-200 bg-cream/95 backdrop-blur-lg"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:h-[4.5rem] sm:px-8">
        <Link href="/" aria-label="DayFive — home" className="shrink-0 py-2">
          <Logo tone={solid ? "dark" : "light"} />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className={`text-[1rem] font-medium transition-colors ${
                solid ? "text-ink-600 hover:text-gold-700" : "text-mist-600 hover:text-gold-300"
              }`}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <CTAButton
            location="nav"
            className="min-h-[2.9rem] px-6 text-[0.98rem] sm:min-h-[2.9rem]"
            arrow={false}
          >
            Get your first close free
          </CTAButton>
        </div>

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
