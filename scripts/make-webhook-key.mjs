/**
 * Generate the Google Ads lead-form webhook key.
 *
 *   node scripts/make-webhook-key.mjs
 *
 * The key is written to two places and PRINTED TO NEITHER the terminal nor a
 * commit: .env.local for local development (gitignored), and a plain note
 * outside the repo for the operator to open, copy from, and delete.
 *
 * Re-running is safe: an existing key in .env.local is kept rather than
 * rotated, because rotating it silently would break a live Ads form that is
 * still holding the old value.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const ENV = ".env.local";
const NOTE = path.join(os.homedir(), "dayfive-google-ads-webhook.txt");
const URL = "https://getdayfive.com/api/google-lead";

let env = "";
try {
  env = fs.readFileSync(ENV, "utf8");
} catch {
  /* first run */
}

const existing = env.match(/^GOOGLE_ADS_WEBHOOK_KEY=(.+)$/m);
const key = existing ? existing[1].trim() : crypto.randomBytes(24).toString("base64url");

if (!existing) {
  const sep = env && !env.endsWith("\n") ? "\n" : "";
  fs.appendFileSync(ENV, `${sep}GOOGLE_ADS_WEBHOOK_KEY=${key}\n`, "utf8");
}

fs.writeFileSync(
  NOTE,
  [
    "DayFive — Google Ads lead-form webhook",
    "",
    "1. PASTE INTO GOOGLE ADS",
    "   Assets → Lead form → “Send leads to a webhook”",
    "",
    `   Webhook URL:  ${URL}`,
    `   Key:          ${key}`,
    "",
    "2. PASTE THE SAME KEY INTO VERCEL",
    "   Project → Settings → Environment Variables",
    "     Name:  GOOGLE_ADS_WEBHOOK_KEY",
    `     Value: ${key}`,
    "     Scope: Production (and Preview if you test there)",
    "   Then redeploy.",
    "",
    "Until that variable exists in Vercel the endpoint answers 503 and writes",
    "nothing. It fails closed rather than accepting unverified leads.",
    "",
    "3. TEST",
    "   In the Ads lead form, press “Send test data”. The row lands in the",
    "   Sheet with is_test = true — marked, not dropped, so a working webhook",
    "   never looks broken.",
    "",
    "This file sits outside the repo and is not committed. Delete it once both",
    "values are pasted.",
    "",
  ].join("\n"),
  "utf8",
);

console.log(`key ${existing ? "reused from" : "generated into"} ${ENV} (${key.length} chars)`);
console.log(`instructions for the operator: ${NOTE}`);
