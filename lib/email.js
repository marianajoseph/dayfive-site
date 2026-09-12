import { CONFIRMATION_EMAIL, RESEND_FROM, RESEND_REPLY_TO } from "@/lib/site-config";

/**
 * TRANSACTIONAL EMAIL, via Resend.
 *
 * Operator ruling, 2026-09-11: confirmations and future notifications go
 * through Resend; human correspondence stays on Google Workspace.
 *
 * WHY IT MOVED OFF WORKSPACE
 * getdayfive.com is a newly registered domain. Even with SPF and DKIM passing,
 * Gmail filed a plain hand-typed message from docs@ into spam — which is what
 * a new domain with no sending history gets. Ad traffic makes that worse in
 * exactly the way Gmail punishes: a burst of mail to strangers who never
 * reply. Resend sends from warmed, reputable infrastructure, so a confirmation
 * reaches the inbox on day one instead of after weeks of warm-up.
 *
 * The From address stays docs@getdayfive.com and replies go to the firm's
 * Workspace inbox, so nothing changes for the person receiving it.
 */

const ENDPOINT = "https://api.resend.com/emails";

/**
 * Bounded, because a lead must never be lost to a slow mail API. Vercel's
 * function timeout would kill the whole request — including the Sheet write —
 * long before Resend gave up on its own.
 */
const TIMEOUT_MS = 8000;

/**
 * Send the confirmation and REPORT WHAT HAPPENED.
 *
 * Returns a short status string rather than throwing, because the caller's job
 * is to record the lead whatever this does. Every return value is something a
 * human can read in a spreadsheet cell six weeks later:
 *
 *   "sent <id>"              Resend accepted it and gave us a message id
 *   "skipped: not configured"  no API key — the lead is still captured
 *   "skipped: no address"
 *   "FAILED: <reason>"       accepted nothing; the reason is the API's own
 *
 * A confirmation is a courtesy. The lead is the asset. Nothing in here is
 * allowed to cost one.
 */
export async function sendConfirmation({ to, name }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return "skipped: not configured";

  const address = String(to || "").trim();
  if (!address || !address.includes("@")) return "skipped: no address";

  // Greet by first name when we have one. Falls back to no greeting rather
  // than "Hi there" — a template that guesses reads worse than one that does
  // not try.
  const first = String(name || "").trim().split(/\s+/)[0];
  const greeting = first ? `Hi ${first},\n\n` : "";

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: [address],
        reply_to: RESEND_REPLY_TO,
        subject: CONFIRMATION_EMAIL.subject,
        text: greeting + CONFIRMATION_EMAIL.body,
      }),
      signal: controller.signal,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      // Resend puts a human-readable reason in `message`. Kept short so it
      // fits a spreadsheet cell and still names the cause.
      const why = data?.message || data?.name || `HTTP ${res.status}`;
      return `FAILED: ${String(why).slice(0, 160)}`;
    }
    return data?.id ? `sent ${data.id}` : "sent";
  } catch (e) {
    if (e.name === "AbortError") return `FAILED: timed out after ${TIMEOUT_MS}ms`;
    return `FAILED: ${String(e.message || e).slice(0, 160)}`;
  } finally {
    clearTimeout(timer);
  }
}
