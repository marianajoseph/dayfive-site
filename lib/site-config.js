/**
 * Copy and contact details that change without a code change.
 *
 * Meant to be edited by hand, one line at a time, by someone who is not
 * thinking about React.
 *
 * ONE EXCEPTION, ADDED 2026-09-20. This file used to say "no logic, no
 * imports, no computed values", and the offer lines below now break all three:
 * they are derived from lib/pricing.js. That is deliberate — the banner and
 * the price card were two hand-written strings that could state different
 * offers with nothing to notice — but the header had to change with it. A
 * rule a file states about itself and no longer follows is worse than no rule.
 */

/**
 * The site-wide offer banner and the line under the price.
 *
 * BOTH NOW COME FROM lib/pricing.js. They used to be two hand-written strings
 * here, which meant the banner and the price card could state different offers
 * and nothing would notice. Re-exported rather than re-typed so existing
 * imports keep working and there is still exactly one place a price lives.
 *
 * Set OFFER.active to false in lib/pricing.js to remove both at once.
 */
import { OFFER, PLAN } from "./pricing";

export const OFFER_BANNER = OFFER.active ? OFFER.banner : null;
export const ESSENTIALS_OFFER_NOTE = OFFER.active ? OFFER.note : null;

/**
 * THE PHONE SLOT.
 *
 * Swap this one string for the real number and it appears in the header (as
 * click-to-call on a phone) and in the footer beside docs@. Until then it is
 * the sentinel below, and every place that would show it renders NOTHING —
 * a half-built contact detail on a live site is worse than no contact detail,
 * because a visitor who taps it learns the company does not check its own
 * pages.
 *
 * Write it as a human would read it: "(609) 555-0142".
 */
export const PHONE = "+1 (609) 482-5663";

/** The sentinel above. Nothing renders while PHONE still equals it. */
export const PHONE_PENDING = "[PHONE PENDING]";

/** Is there a real number to show? Guards every render site. */
export function hasPhone() {
  const v = String(PHONE ?? "").trim();
  return v !== "" && v !== PHONE_PENDING && !v.startsWith("[");
}

/** Digits only, for the tel: href. "(609) 555-0142" -> "+16095550142". */
export function phoneHref() {
  const digits = String(PHONE ?? "").replace(/\D/g, "");
  if (!digits) return "";
  return digits.length === 10 ? `tel:+1${digits}` : `tel:+${digits}`;
}


/**
 * The explainer on YouTube. Operator, 2026-09-26: approved and published at
 * https://youtu.be/hdFiVqDBrAU
 *
 * The id alone, not the URL — the component builds a nocookie embed URL from
 * it, and a full watch URL pasted into an embed is the classic way to end up
 * with a page that will not play.
 */
export const VIDEO_ID = "hdFiVqDBrAU";
/** The registered address, as it should appear to a reader. */
export const ADDRESS = {
  name: "DayFive",
  street: "3495 US Highway 1, Ste 34 #1102",
  locality: "Princeton",
  region: "NJ",
  postalCode: "08540",
  country: "US",
};

/** One line, as the footer shows it. */
export const ADDRESS_LINE = `${ADDRESS.name} · ${ADDRESS.street}, ${ADDRESS.locality}, ${ADDRESS.region} ${ADDRESS.postalCode}`;

/**
 * The lead form's qualifying question.
 *
 * The values are what lands in the Sheet, so they are stable strings rather
 * than indexes — a column of "1" and "2" is unreadable a month later, and
 * reordering the options would silently rewrite history.
 */
export const BOOKS_BEHIND_QUESTION = "How far behind are your books?";
export const BOOKS_BEHIND_OPTIONS = [
  "Current",
  "1–3 months behind",
  "4+ months behind",
  "What books? 😅",
];

// --- transactional email (Resend), ratified 2026-09-11 --------------------

/**
 * The From line. Must be an address on a domain VERIFIED IN RESEND, or the API
 * refuses the send. The display name is what a recipient sees in their list.
 */
export const RESEND_FROM = "DayFive <docs@getdayfive.com>";

/** Replies go to the Workspace inbox — human correspondence stays there. */
export const RESEND_REPLY_TO = "docs@getdayfive.com";

/** The automatic confirmation. Operator copy, 2026-09-07. */
export const CONFIRMATION_EMAIL = {
  subject: "Got it — DayFive.",
  body:
    "Thanks for reaching out. We'll follow up within one business day to set up " +
    "your free first month. If you'd like to get a head start, reply with roughly " +
    "how far behind your books are and which accounts you use — no attachments " +
    "needed yet.\n\n" +
    "— DayFive · getdayfive.com · (609) 482-5663",
};

/** Shown after a successful signup. */
export const CONFIRMATION =
  "You're on the list — we'll reach out within one business day to set up your free first month. Watch for a note from docs@getdayfive.com.";

// --- /start, as a RESERVATION rather than a waitlist (operator, 2026-09-07) --

/** The small uppercase line above the headline. */
export const RESERVE_EYEBROW = OFFER.active
  ? `Fall Offer · ${OFFER.price}/mo for your first year`
  : `${PLAN.name} · ${PLAN.price}${PLAN.period}`;

/** Sits directly above the form. */
export const RESERVE_INTRO =
  "We onboard in small batches. Tell us about your business and we'll reach out within one business day to set up your free first month.";

/** The submit button. */
export const RESERVE_BUTTON = "Reserve my free first month";

/** Under the button, replacing the old newsletter line. */
export const RESERVE_PRIVACY_LINE =
  "No newsletter, no spam — we'll only email you about your books. Unsubscribe anytime.";

/**
 * The page's headline and lede.
 *
 * NOT operator copy — see the note in app/start/page.js. The originals said
 * onboarding "opens shortly" and invited people to "leave your email", which
 * contradicts a page whose button now reserves a close. Replace freely.
 */
export const RESERVE_HEADING_LEAD = "Reserve your";
export const RESERVE_HEADING_ACCENT = "free first month";
export const RESERVE_LEDE =
  "Twenty minutes to onboard: sign electronically, connect your bank, send us last month. Tell us where your books stand and we'll take it from there.";
