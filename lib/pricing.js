/**
 * THE PRODUCT, AND WHAT IT COSTS.
 *
 * Operator ruling, 2026-09-20: one product — Essentials at $299/mo, first
 * month free, cancel anytime. Growth and Insights come off the site; their
 * copy is kept in lib/archived-plans.js rather than deleted.
 *
 * WHY A MODULE AND NOT THREE STRINGS IN A COMPONENT. A price appears in more
 * places than anyone remembers: the card, the banner, the /start eyebrow, the
 * structured data a search engine reads, and now a video. Every one of those
 * is a place a stale number can survive a price change. Here it is written
 * once and read everywhere, so changing it is one edit and the only question
 * is whether the edit is right.
 *
 * The same reasoning as the machine's Figure type and the explainer's
 * config.js: a number typed twice is a number that will eventually disagree
 * with itself.
 *
 * Everything below is meant to be edited by hand by somebody who is not
 * thinking about React. No logic, no imports.
 */

/** The one plan. */
export const PLAN = {
  name: "Essentials",
  /** List price. The number a customer pays after any intro period ends. */
  price: "$299",
  period: "/month",
  lede: "Bookkeeping, done.",
  features: [
    "Monthly close by day 5",
    "Full financial statements — profit & loss, balance sheet, cash summary",
    "Five plain-English insights about what actually happened",
    "Every account reconciled, every figure independently double-checked",
    "Unlimited document intake — a shoebox is fine",
    "Written answers about your numbers, any day",
  ],
};

/** The two promises that sit beside the price. */
export const TERMS = {
  firstMonthFree: "Your first month is free.",
  cancelAnytime: "Cancel anytime.",
};

/**
 * The intro offer.
 *
 * `active: false` removes it EVERYWHERE — the banner, the price card, the
 * /start eyebrow — rather than leaving an expired promise on a live page.
 * That is the whole point of it being a flag and not a paragraph somebody has
 * to remember to delete.
 */
export const OFFER = {
  active: true,
  price: "$249",
  /** The banner, site-wide. */
  banner: "Fall Offer: $249/mo for your first year — plus your first month free",
  /** The shorter line under the price card. */
  note: "Fall Offer: $249/mo for your first year.",
};

/**
 * The line under the price card for everything we do not sell yet.
 *
 * It asks rather than promises. "We're building it next" is a statement about
 * our plans, which we can make; a date would be a promise about delivery,
 * which we cannot. The answers land in the leads Sheet tagged `roadmap` so
 * what people actually ask for is a record rather than an impression.
 */
export const ROADMAP = {
  question:
    "Need AP/AR, forecasting, or management reporting? Tell us what you need — we're building it next.",
  linkLabel: "Tell us what you need",
  href: "/roadmap",
  /** The tag every roadmap submission carries into the Sheet. */
  source: "roadmap",
};

/** For the structured data in app/layout.js — one offer now, not three. */
export const SCHEMA_PRICE = PLAN.price.replace(/[^0-9.]/g, "");
