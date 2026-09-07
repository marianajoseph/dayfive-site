import { promises as fs } from "node:fs";
import path from "node:path";

import { BOOKS_BEHIND_OPTIONS } from "@/lib/site-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Where captured emails go.
 *
 * Production: POSTed to a Google Apps Script web app bound to the owner's
 * Google Sheet. The script appends a row (timestamp, email, source) and
 * emails a copy. Its URL and a shared token live in Vercel environment
 * variables — never in this repo.
 *
 * Local development with no webhook configured: appended to ./data/leads.json
 * so the form stays testable offline. That file is gitignored.
 */
async function toSheet(entry) {
  const url = process.env.SHEETS_WEBHOOK_URL;
  const token = process.env.SHEETS_WEBHOOK_TOKEN;
  if (!url || !token) return { ok: false, reason: "not-configured" };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, ...entry }),
      // Apps Script answers with a 302 across to script.googleusercontent.com
      redirect: "follow",
    });

    const text = await res.text();
    let data = {};
    try {
      data = JSON.parse(text);
    } catch {
      // non-JSON reply means the script errored or the deployment is wrong
    }

    if (!res.ok || data.ok !== true) {
      return { ok: false, reason: `rejected ${res.status}: ${text.slice(0, 160)}` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: `unreachable: ${e.message}` };
  }
}

/** Dev-only fallback so the form works with no network and no credentials. */
async function toLocalFile(entry) {
  const file = path.join(process.cwd(), "data", "leads.json");
  try {
    await fs.mkdir(/*turbopackIgnore: true*/ path.dirname(file), { recursive: true });
    let list = [];
    try {
      list = JSON.parse(await fs.readFile(/*turbopackIgnore: true*/ file, "utf8"));
      if (!Array.isArray(list)) list = [];
    } catch {
      list = [];
    }
    list.push(entry);
    await fs.writeFile(
      /*turbopackIgnore: true*/ file,
      `${JSON.stringify(list, null, 2)}\n`,
      "utf8",
    );
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: e.message };
  }
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
    email,
    source: String(body?.source ?? "start-page").slice(0, 60),
    booksBehind,
    // Campaign attribution. Always present as keys, even when empty, so every
    // row has the same shape and the Sheet's columns cannot slip.
    utm_source: String(body?.utm_source ?? "").trim().slice(0, 120),
    utm_campaign: String(body?.utm_campaign ?? "").trim().slice(0, 120),
    utm_adgroup: String(body?.utm_adgroup ?? "").trim().slice(0, 120),
  };

  let result = await toSheet(entry);
  if (result.reason === "not-configured") result = await toLocalFile(entry);

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
