import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * WHERE EVERY LEAD GOES — the site form and the Google Ads webhook alike.
 *
 * Extracted from app/api/subscribe/route.js when the Ads webhook arrived, so
 * both routes append to the same Sheet by the same path. Two copies of this
 * logic would drift, and the drift would show up as leads from one source
 * quietly missing a column the other has.
 *
 * Production: POSTed to a Google Apps Script web app bound to the owner's
 * Google Sheet. Its URL and a shared token live in Vercel environment
 * variables — never in this repo.
 *
 * Local development with no webhook configured: appended to ./data/leads.json
 * so both forms stay testable offline. That file is gitignored.
 */
export async function toSheet(entry) {
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

/** Dev-only fallback so the forms work with no network and no credentials. */
export async function toLocalFile(entry) {
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

/** The Sheet if it is configured, the local file if it is not. */
export async function appendLead(entry) {
  const result = await toSheet(entry);
  if (result.reason === "not-configured") return toLocalFile(entry);
  return result;
}
