/**
 * THE PRICES COME FROM THE SITE. They are not restated here.
 *
 * This file used to carry its own copies — "$450/month", "Fall Offer: $299/mo
 * for life" — and when the site moved to one product at $299 the video went on
 * rendering the old ones. The cutdown was built, encoded and watched before
 * anybody noticed, with a price on screen that the company no longer charges.
 *
 * The docstring right here warned about exactly that: "a number typed twice is
 * a number that will eventually disagree with itself." It was typed twice
 * anyway, two files apart, which is the distance at which the rule stops
 * feeling like it applies.
 *
 * So the video reads lib/pricing.js — the same module the price card, the
 * banner, the /start eyebrow and the structured data read. Remotion already
 * resolves `@` to the site root for the sample-pack components; this is the
 * same door.
 */
import { OFFER, PLAN, TERMS } from "@/lib/pricing";

/**
 * Contact details, read from the site so there is one of each.
 *
 * PHONE comes from lib/site-config.js — the same string the header and footer
 * render. A phone number on an end card that the site has changed is a call
 * nobody answers.
 */
import { PHONE, ADDRESS } from "@/lib/site-config";

export const brand = {
  url: "getdayfive.com",
  phone: PHONE.replace(/^\+1\s*/, ""),
  wordmark: { plain: "Day", accent: "Five" },
};

export const pricing = {
  /** e.g. "$299/month" — assembled from the site's plan, never retyped. */
  essentials: `${PLAN.price}${PLAN.period}`,
  flatLine: "Flat. No hourly billing.",
  /**
   * The offer. `active` comes from the site, so ending the offer there ends it
   * in the video on the next render — no second flag to remember.
   */
  offer: {
    active: OFFER.active,
    // The SHORT form. OFFER.banner is written for a one-line web banner and
    // wraps to two lines on a video card; OFFER.note is the same offer said
    // briefly, which is what a card three seconds long needs.
    line: OFFER.note,
  },
  firstCloseFree: TERMS.firstMonthFree,
};

/** The end card, beat 10. */
export const endCard = {
  line: "Your books. Day five. Done.",
  url: brand.url,
  phone: brand.phone,
};

export { colors } from "./colors";
/**
/** 1080p, 16:9, 30fps. The master's format, per the brief. */
export const MASTER = { width: 1920, height: 1080, fps: 30 };

/** The 9:16 vertical of the 30s cutdown. */
export const VERTICAL = { width: 1080, height: 1920, fps: 30 };
