import { appendLead } from "@/lib/leads";
import { sendConfirmation } from "@/lib/email";
import { BOOKS_BEHIND_OPTIONS } from "@/lib/site-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";


// Deliberately permissive: catches typos like "a@b" while accepting the odd
// but valid addresses a stricter pattern would wrongly reject.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Expected JSON." }, { status: 400 });
  }

  const email = String(body?.email ?? "").trim().toLowerCase();

  if (!EMAIL.test(email) || email.length > 254) {
    return Response.json(
      { error: "That doesn't look like an email address." },
      { status: 400 },
    );
  }

  // Honeypot: a hidden field only a bot would fill in. Answer 200 so it can't
  // tell it was caught.
  if (String(body?.company ?? "").trim()) {
    return Response.json({ ok: true });
  }

  // The qualifying answer, checked against the known options rather than
  // passed through: a hand-crafted POST must not be able to write arbitrary
  // text into a column the owner reads as a category. An unrecognised value
  // records as blank — never dropped, and never invented.
  const answered = String(body?.booksBehind ?? "").trim();
  const booksBehind = BOOKS_BEHIND_OPTIONS.includes(answered) ? answered : "";

  const entry = {
    timestamp: new Date().toISOString(),
    // Trimmed and length-capped, not validated further: a name is whatever the
    // person says it is, and a rule that rejects a real one is worse than an
    // untidy cell. The Apps Script adds `businessName` as a new column on its
    // own, so nothing there needs changing for these three.
    name: String(body?.name ?? "").trim().slice(0, 120),
    businessName: String(body?.businessName ?? "").trim().slice(0, 160),
    email,
    phone: String(body?.phone ?? "").trim().slice(0, 40),
    source: String(body?.source ?? "start-page").slice(0, 60),
    booksBehind,
    // Campaign attribution. Always present as keys, even when empty, so every
    // row has the same shape and the Sheet's columns cannot slip.
    utm_source: String(body?.utm_source ?? "").trim().slice(0, 120),
    utm_campaign: String(body?.utm_campaign ?? "").trim().slice(0, 120),
    utm_adgroup: String(body?.utm_adgroup ?? "").trim().slice(0, 120),
  };

  // Sent BEFORE the Sheet write so its outcome travels with the lead as a
  // column, rather than living in a log nobody reads. sendConfirmation never
  // throws and is time-bounded — see lib/email.js.
  entry.confirmSent = await sendConfirmation({ to: entry.email, name: entry.name });

  const result = await appendLead(entry);

  if (result.ok) {
    console.log(`[dayfive:lead] ${JSON.stringify(entry)}`);
  } else {
    // The signup is not lost — this line is the recovery record. We still
    // answer 200: failing the form would lose the address entirely, and a
    // missing copy in the owner's inbox is the signal that something broke.
    console.error(
      `[dayfive:lead:FAILED] ${result.reason} ${JSON.stringify(entry)}`,
    );
  }

  return Response.json({ ok: true });
}

export async function GET() {
  return Response.json({ error: "Method not allowed." }, { status: 405 });
}
