import { appendLead } from "@/lib/leads";
import { ROADMAP } from "@/lib/pricing";

/**
 * "Tell us what you need" — the roadmap form.
 *
 * Same Sheet, same appendLead path, tagged `roadmap` so what people ask for is
 * a filterable record rather than an impression somebody remembers having.
 *
 * DELIBERATELY SENDS NO CONFIRMATION EMAIL. /api/subscribe replies with "we'll
 * reach out to set up your free first close", which is the wrong answer to
 * somebody asking whether we do accounts payable — it answers a question they
 * did not ask and ignores the one they did. Sharing that route would have been
 * less code and a worse reply.
 */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot. A filled hidden field is a bot; answer 200 so it learns nothing.
  if (String(body?.company ?? "").trim()) {
    return Response.json({ ok: true });
  }

  const email = String(body?.email ?? "").trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return Response.json({ error: "A valid email is required." }, { status: 400 });
  }

  const need = String(body?.need ?? "").trim();
  if (!need) {
    return Response.json({ error: "Tell us what you need." }, { status: 400 });
  }

  const entry = {
    at: new Date().toISOString(),
    email,
    name: String(body?.name ?? "").trim().slice(0, 120),
    source: ROADMAP.source,
    booksBehind: "",
    // The ask itself, in their words. Capped rather than rejected: a long
    // answer is a keen customer, and truncating keeps the row while losing
    // only the tail.
    note: need.slice(0, 2000),
  };

  const result = await appendLead(entry);
  if (result.ok) {
    console.log(`[dayfive:roadmap] ${JSON.stringify(entry)}`);
  } else {
    // Answer 200 regardless: failing the form loses the request entirely, and
    // this line is the recovery record.
    console.error(`[dayfive:roadmap:FAILED] ${result.reason} ${JSON.stringify(entry)}`);
  }

  return Response.json({ ok: true });
}

export async function GET() {
  return Response.json({ error: "Method not allowed." }, { status: 405 });
}
