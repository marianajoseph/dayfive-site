import { appendLead } from "@/lib/leads";
import { BOOKS_BEHIND_OPTIONS } from "@/lib/site-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GOOGLE ADS LEAD FORM WEBHOOK.
 *
 * Google POSTs one JSON body per lead. Its shape is fixed by Google, not by
 * us: the answers arrive as an ARRAY of {column_id, column_name, string_value}
 * rather than named fields, because a lead form's questions are configured in
 * the Ads UI and Google does not know what we called them.
 *
 * Configure in Google Ads: Assets -> Lead form -> "Send leads to a webhook"
 *   Webhook URL   https://getdayfive.com/api/google-lead
 *   Key           the value of GOOGLE_ADS_WEBHOOK_KEY (Vercel env var)
 *
 * WHY THE KEY MATTERS. This endpoint has to be public — Google's servers call
 * it, from addresses we cannot enumerate — so the shared key is the only thing
 * standing between the leads Sheet and anyone who guesses the URL. A request
 * whose google_key does not match is refused before anything is written.
 *
 * WHY 200 ON A WRITE FAILURE. Google retries non-200s for a while and then
 * gives up, and a lead it has given up on is gone for good. So a storage
 * failure is logged as [dayfive:google-lead:FAILED] with the whole lead in the
 * line — that log entry IS the recovery record — and we still answer 200. The
 * one exception is a bad key, which is refused loudly: retrying that would be
 * correct behaviour on Google's part and it would never start working.
 */

/** Google's own column ids for the three standard fields. */
const NAME_IDS = new Set(["FULL_NAME", "FIRST_NAME", "LAST_NAME"]);
const EMAIL_IDS = new Set(["EMAIL", "USER_EMAIL"]);
const PHONE_IDS = new Set(["PHONE_NUMBER", "USER_PHONE"]);

function readColumns(list) {
  const out = { name: "", email: "", phone: "", answers: {} };
  if (!Array.isArray(list)) return out;

  const nameParts = [];
  for (const c of list) {
    const id = String(c?.column_id ?? "").toUpperCase();
    const label = String(c?.column_name ?? "").trim();
    const value = String(c?.string_value ?? "").trim();
    if (!value) continue;

    if (NAME_IDS.has(id)) {
      // FIRST_NAME and LAST_NAME arrive as separate columns when the form asks
      // for them separately; FULL_NAME arrives alone. Joining handles both.
      nameParts.push(value);
    } else if (EMAIL_IDS.has(id)) {
      out.email = value.toLowerCase();
    } else if (PHONE_IDS.has(id)) {
      out.phone = value;
    } else if (label) {
      // A custom question. Keyed by the label the form shows, because the
      // column_id for a custom question is opaque and changes if the question
      // is edited — the label is what the owner will recognise in the Sheet.
      out.answers[label] = value;
    }
  }
  out.name = nameParts.join(" ").trim();
  return out;
}

/**
 * Find the "how far behind" answer among the custom questions.
 *
 * Matched on the ANSWER rather than the question wording, because the question
 * is retyped by hand in the Ads UI and will not match our string exactly. The
 * four options are ours and are distinctive, so an answer that is one of them
 * is that question's answer whatever the question was called.
 */
function findBooksBehind(answers) {
  for (const value of Object.values(answers)) {
    if (BOOKS_BEHIND_OPTIONS.includes(value)) return value;
  }
  // Fall back to a forgiving match: the Ads UI may not accept the en dash or
  // the emoji, so "1-3 months behind" must still land in the right column.
  const norm = (s) =>
    String(s).toLowerCase().replace(/[–—]/g, "-").replace(/[^a-z0-9+ -]/g, "").trim();
  for (const value of Object.values(answers)) {
    const hit = BOOKS_BEHIND_OPTIONS.find((o) => norm(o) === norm(value));
    if (hit) return hit;
  }
  return "";
}

export async function POST(request) {
  const expected = process.env.GOOGLE_ADS_WEBHOOK_KEY;
  if (!expected) {
    console.error("[dayfive:google-lead:MISCONFIGURED] GOOGLE_ADS_WEBHOOK_KEY is unset");
    return Response.json({ error: "Not configured." }, { status: 503 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Expected JSON." }, { status: 400 });
  }

  // Length-independent compare is not warranted here — the key is not derived
  // from user input and a timing oracle on a string equality of a 32-byte
  // random value is not a practical attack. Refused loudly, and never logged.
  if (String(body?.google_key ?? "") !== expected) {
    console.warn("[dayfive:google-lead:REJECTED] bad or missing google_key");
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { name, email, phone, answers } = readColumns(body?.user_column_data);

  const entry = {
    timestamp: new Date().toISOString(),
    name,
    email,
    phone,
    booksBehind: findBooksBehind(answers),
    source: "google-lead-form",
    // Google's own identifiers, so a lead can be traced back to the ad that
    // produced it and a duplicate delivery can be recognised as one.
    lead_id: String(body?.lead_id ?? ""),
    utm_source: "google",
    utm_campaign: String(body?.campaign_id ?? ""),
    utm_adgroup: String(body?.adgroup_id ?? ""),
    gclid: String(body?.gcl_id ?? ""),
    // Google sends a test lead when you press "Send test data" in the Ads UI.
    // Marked rather than dropped: a test that vanishes looks like a broken
    // webhook, which is the opposite of what the button is for.
    is_test: Boolean(body?.is_test),
  };

  const result = await appendLead(entry);
  if (result.ok) {
    console.log(`[dayfive:google-lead] ${JSON.stringify(entry)}`);
  } else {
    console.error(
      `[dayfive:google-lead:FAILED] ${result.reason} ${JSON.stringify(entry)}`,
    );
  }

  return Response.json({ ok: true });
}

export async function GET() {
  // Google only ever POSTs. A GET is a person checking the URL is alive, and
  // telling them the shape of the thing is more useful than a bare 405.
  return Response.json(
    { ok: true, endpoint: "google-lead", method: "POST", auth: "google_key" },
    { status: 200 },
  );
}
