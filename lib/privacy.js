/**
 * THE PRIVACY POLICY TEXT.
 *
 * Supplied by the operator 2026-09-07 and transcribed VERBATIM. This is a
 * legal undertaking, so nothing here is tightened, rephrased or "improved" —
 * if it reads oddly, that is the document, and the fix belongs upstream with
 * the person who wrote it.
 *
 * HOW TO CHANGE IT
 * Edit the text below and update EFFECTIVE_DATE. Each section is a heading and
 * its paragraphs; a body entry that is an ARRAY of strings renders as a bullet
 * list. Nothing is parsed as markdown — the strings render as written, so an
 * apostrophe or an ampersand needs no escaping.
 *
 * Emptying SECTIONS takes /privacy back to a 404 and unlinks it from the
 * footer, which is the right state for a policy that is being rewritten.
 */

/** Shown at the top of the page. Empty means "not published" — the page 404s. */
export const EFFECTIVE_DATE = "September 7, 2026";

/** Paragraphs above the numbered sections. */
export const INTRO = [
  "DayFive (“we,” “us”) provides bookkeeping and financial reporting services for businesses. This policy explains what information we collect through getdayfive.com and our services, how we use it, and the choices you have. We write it plainly on purpose.",
];

export const SECTIONS = [
  {
    heading: "1. What we collect",
    body: [
      "When you contact us or sign up (website forms, our Google ad forms, phone, or email): your name, business name, email address, phone number, and the answers you give us (for example, how far behind your books are, or what you’d like help with).",
      "When you become a client: the financial documents and data needed to do your books — bank and card statements, transaction exports, receipts, invoices, and related records — plus billing details handled by our payment processor (we never see or store full card numbers).",
      "Automatically, when you visit the site: standard web logs (IP address, browser type, pages viewed, timestamps) and campaign tags in links you clicked (which ad or source brought you here). We use only the cookies needed for the site to work and to measure our advertising; we do not run a tracking network across other sites.",
      "Phone calls to our business number are answered by an AI assistant that takes your details; calls are transcribed and summarized so we can follow up.",
    ],
  },
  {
    heading: "2. How we use it",
    body: [
      [
        "To respond to you, provide the services you request, and deliver your monthly close and reports.",
        "To operate, secure, and improve our systems.",
        "To measure whether our advertising works (aggregate campaign performance).",
        "To communicate with you about your account and our services.",
      ],
      "We do not sell personal information, and we do not use your data to train artificial-intelligence models.",
    ],
  },
  {
    heading: "3. Who touches your data (our service providers)",
    body: [
      "We use carefully chosen providers to run our business. They process data only to provide their service to us, under their own security and privacy commitments:",
      [
        "Google (Workspace email, Google Sheets, Google Ads, Google Business Profile) — email, lead handling, advertising measurement.",
        "Dialzara — AI phone answering, call transcription, and summaries.",
        "Stripe — payments and billing.",
        "Anthropic, OpenAI, and xAI — AI processing that categorizes, checks, and helps prepare financial work, under agreements that prohibit training on our data.",
        "Backblaze — encrypted backup storage.",
        "Namecheap and our hosting provider — domain and website hosting.",
        "Plaid or accounting-software connections — only if you choose to connect an account, and only with read access.",
      ],
      "We may update this list as our systems change; the current list is always in this policy.",
    ],
  },
  {
    heading: "4. How we protect it",
    body: [
      "Data is encrypted in transit and at rest. Client financial records are kept on encrypted systems with restricted access, backed up to immutable encrypted storage, and every automated entry carries an audit trail. Access is limited to the people and systems needed to do your work.",
    ],
  },
  {
    heading: "5. How long we keep it",
    body: [
      "Client financial records are kept for the duration of your engagement and for the retention period required for bookkeeping records (generally seven years), unless you request earlier deletion where the law allows. Lead information from people who don’t become clients is deleted within 12 months. You may request deletion at any time (see section 7).",
    ],
  },
  {
    heading: "6. Your choices and rights",
    body: [
      "Depending on where you live, you may have the right to access, correct, export, or delete your personal information, and to opt out of marketing messages. To exercise any of these, email us — we’ll respond within 30 days. We don’t discriminate against anyone for exercising their rights.",
    ],
  },
  {
    heading: "7. Contact",
    body: [
      "DayFive · 3495 US Highway 1, Ste 34 #1102, Princeton, NJ 08540 · docs@getdayfive.com · (609) 482-5663",
    ],
  },
  {
    heading: "8. Changes",
    body: [
      "If we change this policy, we’ll post the new version here with a new effective date. Material changes affecting clients will be emailed.",
    ],
  },
];

/** The closing note, set smaller than the body. */
export const CLOSING =
  "This policy describes our practices as of the effective date. It is not legal advice; it will be reviewed by counsel as part of our formation and compliance work.";

/** Is there a policy to show? Guards the route and the footer link. */
export function hasPrivacyPolicy() {
  return SECTIONS.length > 0 && Boolean(EFFECTIVE_DATE);
}

/**
 * WHAT THE SITE ACTUALLY DOES WITH DATA, as of 2026-09-07.
 *
 * Not policy text and never rendered — a factual record of the system the
 * policy describes, so the two can be checked against each other later. Keep it
 * true as the code changes; where it and the policy disagree, one of them is
 * wrong and it matters which.
 *
 *   Collected on /start:  email, the "how far behind are your books?" answer,
 *                         and utm_source / utm_campaign / utm_adgroup read
 *                         from the URL. A hidden honeypot field is collected
 *                         and discarded.
 *   Collected via Google Ads lead forms: name, email, phone, the same
 *                         "how far behind" answer, plus Google's lead_id,
 *                         campaign_id, adgroup_id and gclid.
 *   Where it goes:        a Google Apps Script webhook that appends a row to
 *                         a Google Sheet owned by DayFive, and emails a copy
 *                         to docs@getdayfive.com. Nothing is stored on this
 *                         site's servers; the local data/leads.json fallback is
 *                         development-only and gitignored.
 *   Processors reached by THIS CODEBASE: Google (Sheets, Apps Script, Ads) and
 *                         Vercel (hosting, request logs). The policy's list is
 *                         broader because it covers the whole business.
 *   Analytics:            lib/analytics.js emits events; no third-party
 *                         analytics provider is installed as of this date.
 *   Cookies:              the site sets none of its own.
 *   Retention/erasure:    no automated deletion — rows stay in the Sheet until
 *                         removed by hand. The policy promises 12 months for
 *                         non-client leads, which is a MANUAL commitment today.
 */
