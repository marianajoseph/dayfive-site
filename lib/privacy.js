/**
 * THE PRIVACY POLICY TEXT.
 *
 * Paste the policy here and /privacy goes live. Until then the page returns a
 * 404 and nothing is linked to it — a Privacy Policy is a legal undertaking,
 * and a placeholder one is not a weaker version of that, it is a false one.
 *
 * HOW TO FILL THIS IN
 * Set LAST_UPDATED, then replace SECTIONS with the real text. Each entry is
 * a heading and its paragraphs:
 *
 *   { heading: "What we collect", body: ["First paragraph.", "Second."] }
 *
 * A body entry that is an ARRAY of strings renders as a bullet list:
 *
 *   { heading: "What we collect", body: [
 *       "We collect the following:",
 *       ["your name", "your email address", "your phone number"],
 *   ]}
 *
 * Nothing here is markdown and nothing is parsed — the strings render as
 * written, so an apostrophe or an ampersand needs no escaping.
 */

/** e.g. "September 7, 2026". Shown at the top of the page. */
export const LAST_UPDATED = "";

/** The policy itself. Empty means "not published yet" — the page 404s. */
export const SECTIONS = [];

/** Is there a policy to show? Guards the route, the footer link and the sitemap. */
export function hasPrivacyPolicy() {
  return SECTIONS.length > 0 && Boolean(LAST_UPDATED);
}

/**
 * WHAT THE SITE ACTUALLY DOES WITH DATA, as of 2026-09-07.
 *
 * Not policy text and never rendered — a factual note for whoever writes the
 * policy, so the document describes the system that exists rather than a
 * typical one. Keep it true as the code changes.
 *
 *   Collected on /start:  email, the "how far behind are your books?" answer,
 *                         and utm_source / utm_campaign / utm_adgroup read
 *                         from the URL. A hidden honeypot field is collected
 *                         and discarded.
 *   Collected via Google Ads lead forms: name, email, phone, the same
 *                         "how far behind" answer, plus Google's lead_id,
 *                         campaign_id, adgroup_id and gclid.
 *   Where it goes:        a Google Apps Script webhook that appends a row to
 *                         a Google Sheet owned by DayFive. Nothing is stored
 *                         on this site's servers; the local data/leads.json
 *                         fallback is development-only and gitignored.
 *   Processors:           Google (Sheets, Apps Script, Ads) and Vercel
 *                         (hosting, request logs).
 *   Analytics:            lib/analytics.js emits events; no third-party
 *                         analytics provider is installed as of this date.
 *   Cookies:              the site sets none of its own.
 *   Retention/erasure:    no automated deletion — rows stay in the Sheet until
 *                         removed by hand.
 */
