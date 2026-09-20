/**
 * GROWTH AND INSIGHTS — the copy, kept. Not rendered anywhere.
 *
 * Operator ruling, 2026-09-20: one product on the site, "remove Growth/Insights
 * (keep copy in repo)". This file is that keeping.
 *
 * It is here because the words were the expensive part. The tiers may come
 * back, and when they do the argument for each feature — how it was phrased,
 * what it promised, what it deliberately did not — is worth more than the
 * layout that held it. Rewriting from memory would quietly drop the careful
 * parts, which are the ones nobody remembers were careful.
 *
 * NOTHING IMPORTS THIS. If something ever does, the prices below are stale by
 * definition: lib/pricing.js is the live one. Treat these as a transcript of
 * what the site said on 2026-09-20, not as configuration.
 *
 * The Scoreboard component (components/Scoreboard.jsx) was the Insights
 * sample on the pricing page and is likewise still in the repo, no longer
 * rendered there — it advertised a tier we no longer sell.
 */
export const ARCHIVED_PLANS = [
  {
    name: "GROWTH",
    price: "$850",
    lede: "Essentials, plus your money in motion.",
    features: [
      "AP & AR management — we draft the bills, we chase the invoices",
      "13-week cash-flow forecast",
      "Weekly numbers email",
    ],
    inherits: "Everything in Essentials, plus:",
  },
  {
    name: "INSIGHTS",
    price: "$1,800",
    lede: "Growth, plus a real FP&A function — the finance department growing companies pay thousands a month for.",
    features: [
      "An **annual operating budget** built with you through a structured written planning dialogue (no meetings, ever)",
      "**Monthly variance analysis** — budget vs. actuals, explained in plain English with what to do about it",
      "A **rolling 12-month forecast**, refreshed quarterly",
      "**Your Business Scoreboard** — the numbers that run your business (cash runway, what customers owe you, profit per job)",
      "A quarterly **Risks & Opportunities letter** — what happened, two risks, two opportunities, one recommendation",
    ],
    inherits: "Everything in Growth, plus:",
    fit: "Reviewed, verified, and signed off before it reaches you.",
  },
];

/** The old Essentials fit line, which assumed a bigger tier existed to move to. */
export const ARCHIVED_ESSENTIALS_FIT =
  "Best for businesses up to ~$50K/month in expenses — bigger or busier? Growth is your home.";

/** The old footnote under the three cards. */
export const ARCHIVED_PLANS_FOOTNOTE =
  "All plans: $250 one-time setup. Catch-up bookkeeping quoted flat per backlog month. Cancel anytime — your books are yours, exportable in one click.";
