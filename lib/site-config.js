/**
 * Copy and contact details that change without a code change.
 *
 * Everything here is meant to be edited by hand, one line at a time, by
 * someone who is not thinking about React. Keep it that way: no logic, no
 * imports, no computed values.
 */

/** The site-wide offer banner. Set to null to remove the banner entirely. */
export const OFFER_BANNER =
  "Fall Offer: lock Essentials at $299/mo for life + your first close free — for businesses that sign up this fall.";

/** The single line under the Essentials price. Set to null to remove it. */
export const ESSENTIALS_OFFER_NOTE =
  "Fall Offer: $299/mo locked for life for fall signups.";

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

/** Shown after a successful signup. */
export const CONFIRMATION =
  "You're on the list — we'll reach out within one business day to set up your free first close. Watch for a note from docs@getdayfive.com.";

// --- /start, as a RESERVATION rather than a waitlist (operator, 2026-09-07) --

/** Sits directly above the form. */
export const RESERVE_INTRO =
  "We onboard in small batches. Tell us about your business and we'll reach out within one business day to set up your free first close.";

/** The submit button. */
export const RESERVE_BUTTON = "Reserve my free first close";

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
export const RESERVE_HEADING_ACCENT = "free first close";
export const RESERVE_LEDE =
  "Twenty minutes to onboard: pick a package, sign electronically, connect your bank. Tell us where your books stand and we'll take it from there.";
