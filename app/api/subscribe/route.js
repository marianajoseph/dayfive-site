import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LOCAL_STORE = path.join(process.cwd(), "data", "leads.json");

/**
 * Where captured emails go.
 *
 * Locally this is ./data/leads.json — open it in any editor to see the list.
 *
 * On Vercel the app directory is read-only, so we fall back to the writable
 * temp directory. That file does NOT survive between requests on serverless,
 * so treat production writes as best-effort only: the authoritative record in
 * production is the structured log line below, which you can see in the Vercel
 * dashboard under Logs. Swap `persist()` for a real store (Airtable, Resend
 * audience, Postgres, Google Sheet) when you're ready.
 */
async function persist(entry) {
  const targets = [LOCAL_STORE, path.join(os.tmpdir(), "dayfive-leads.json")];

  for (const file of targets) {
    try {
      // turbopackIgnore comments: these paths are resolved at runtime, not
      // bundled. Without them the bundler tries to trace them and warns.
      await fs.mkdir(/*turbopackIgnore: true*/ path.dirname(file), { recursive: true });

      let list = [];
      try {
        list = JSON.parse(await fs.readFile(/*turbopackIgnore: true*/ file, "utf8"));
        if (!Array.isArray(list)) list = [];
      } catch {
        list = []; // first write, or an unreadable file
      }

      if (list.some((l) => l.email === entry.email)) {
        return { ok: true, file, duplicate: true };
      }

      list.push(entry);
      await fs.writeFile(
        /*turbopackIgnore: true*/ file,
        `${JSON.stringify(list, null, 2)}\n`,
        "utf8",
      );
      return { ok: true, file, duplicate: false };
    } catch {
      // read-only filesystem — try the next target
    }
  }

  return { ok: false };
}

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
  const business = String(body?.business ?? "").trim().slice(0, 120);

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

  const entry = {
    email,
    business: business || null,
    source: String(body?.source ?? "start-page").slice(0, 60),
    at: new Date().toISOString(),
  };

  const result = await persist(entry);

  // Structured log — this is the production-safe record of the signup.
  console.log(`[dayfive:lead] ${JSON.stringify(entry)}`);

  if (!result.ok) {
    console.warn("[dayfive:lead] could not persist to disk; log line above is the record");
  }

  return Response.json({ ok: true, duplicate: result.duplicate ?? false });
}

export async function GET() {
  return Response.json({ error: "Method not allowed." }, { status: 405 });
}
