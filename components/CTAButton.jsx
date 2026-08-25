"use client";

import Link from "next/link";
import { trackCta } from "@/lib/analytics";

/* Generous tap targets: 56px tall on phones, never below 48. */
const base =
  "group inline-flex min-h-[3.5rem] items-center justify-center gap-2.5 rounded-full px-8 text-[1.05rem] font-semibold tracking-tight transition-all duration-200 sm:min-h-[3.25rem]";

const variants = {
  /* gold fill, navy label — 8.3:1 */
  primary:
    "bg-gold-on-dark text-navy-950 shadow-soft hover:bg-gold-on-light hover:text-cream hover:-translate-y-0.5 hover:shadow-card",
  /* outlined, for cream backgrounds */
  secondary:
    "border-2 border-cream-300 bg-white text-ink shadow-soft hover:border-gold-on-light hover:text-gold-on-light hover:-translate-y-0.5",
  /* outlined, for the navy bands */
  onNavy:
    "border-2 border-navy-600 bg-transparent text-mist hover:border-gold-on-dark hover:text-gold-hover hover:-translate-y-0.5",
};

export default function CTAButton({
  children,
  href = "/start",
  variant = "primary",
  location = "unknown",
  className = "",
  arrow = true,
}) {
  const isAnchor = href.startsWith("#");
  const onClick = () => trackCta(String(children), location);

  const content = (
    <>
      {children}
      {arrow && (
        <span
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:translate-x-1"
        >
          →
        </span>
      )}
    </>
  );

  const cls = `${base} ${variants[variant]} ${className}`;

  if (isAnchor) {
    return (
      <a href={href} onClick={onClick} className={cls}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} onClick={onClick} className={cls}>
      {content}
    </Link>
  );
}
