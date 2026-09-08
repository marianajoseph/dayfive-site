"use client";

import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";
import { Check } from "./Icons";
import {
  BOOKS_BEHIND_OPTIONS,
  BOOKS_BEHIND_QUESTION,
  CONFIRMATION,
  RESERVE_BUTTON,
  RESERVE_PRIVACY_LINE,
} from "@/lib/site-config";

const field =
  "w-full rounded-2xl border-2 border-cream-300 bg-cream px-5 py-4 text-lg text-ink placeholder:text-ink-500/70 transition-colors focus:border-gold-on-light focus:outline-none";

const label =
  "mb-2 block text-[0.85rem] font-bold uppercase tracking-[0.12em] text-ink-600";

/**
 * Campaign parameters, read off the URL and sent along silently.
 *
 * Read on mount, not at module scope: this component is prerendered on the
 * server where there is no location to read. Missing params are simply absent
 * rather than empty strings, so a direct visit does not write blank columns.
 */
const UTM_KEYS = ["utm_source", "utm_campaign", "utm_adgroup"];

function readUtm() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const out = {};
  for (const key of UTM_KEYS) {
    const value = (params.get(key) || "").trim();
    if (value) out[key] = value.slice(0, 120);
  }
  return out;
}

export default function EmailCapture() {
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [booksBehind, setBooksBehind] = useState("");
  const [utm, setUtm] = useState({});
  const [company, setCompany] = useState(""); // honeypot
  const [state, setState] = useState("idle"); // idle | sending | done | error
  const [error, setError] = useState("");

  useEffect(() => setUtm(readUtm()), []);

  async function onSubmit(e) {
    e.preventDefault();
    if (state === "sending") return;

    // Checked here as well as in the markup, so the browser's own validation
    // being bypassed cannot lose an answer silently.
    const missing =
      (!name.trim() && "your name") ||
      (!businessName.trim() && "your business name") ||
      (!email.trim() && "your email") ||
      (!booksBehind && "how far behind your books are");
    if (missing) {
      setError(`We still need ${missing}.`);
      setState("error");
      return;
    }

    setState("sending");
    setError("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          businessName,
          email,
          phone,
          booksBehind,
          company,
          source: "start-page",
          ...utm,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Something went wrong. Try again in a moment.");
        setState("error");
        return;
      }

      track("lead_captured", { source: "start-page", booksBehind, ...utm });
      setState("done");
    } catch {
      setError("We couldn't reach the server. Check your connection and try again.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div role="status" className="text-center sm:text-left">
        <Check size={44} className="mx-auto text-gold-on-light sm:mx-0" />
        <p className="mt-4 font-display text-[1.6rem] font-semibold tracking-[-0.03em] text-ink">
          You&rsquo;re on the list.
        </p>
        <p className="mt-3 text-lg leading-relaxed text-ink-600">
          {CONFIRMATION.replace(/^You're on the list — /, "")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <div>
        <label htmlFor="name" className={label}>
          Your name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Alex Rivera"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={field}
        />
      </div>

      <div>
        <label htmlFor="business" className={label}>
          Business name
        </label>
        <input
          id="business"
          name="businessName"
          type="text"
          required
          autoComplete="organization"
          placeholder="Rivera Plumbing LLC"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          className={field}
        />
      </div>

      <div>
        <label htmlFor="email" className={label}>
          Your email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="you@yourbusiness.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={state === "error"}
          aria-describedby={state === "error" ? "capture-error" : undefined}
          className={field}
        />
      </div>

      <div>
        <label htmlFor="phone" className={label}>
          Phone <span className="font-medium normal-case tracking-normal text-ink-500">(optional)</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder="(609) 555-0142"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={field}
        />
      </div>

      <div>
        <label htmlFor="books-behind" className={label}>
          {BOOKS_BEHIND_QUESTION}
        </label>
        <select
          id="books-behind"
          name="booksBehind"
          required
          value={booksBehind}
          onChange={(e) => setBooksBehind(e.target.value)}
          aria-invalid={state === "error" && !booksBehind}
          className={`${field} appearance-none bg-[length:1.1rem] bg-[right_1.25rem_center] bg-no-repeat pr-12 ${
            booksBehind ? "" : "text-ink-500/70"
          }`}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%23596273' stroke-width='2'><path d='M5 7.5l5 5 5-5'/></svg>\")",
          }}
        >
          <option value="" disabled>
            Choose one…
          </option>
          {BOOKS_BEHIND_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* honeypot — hidden from people, irresistible to bots */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      {state === "error" && (
        <p id="capture-error" role="alert" className="text-[1rem] font-semibold text-status-risk">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        className="inline-flex min-h-[3.5rem] items-center justify-center rounded-full bg-gold-on-dark px-8 text-center text-[1.05rem] font-semibold tracking-tight text-navy-950 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:bg-gold-on-light hover:text-cream disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state === "sending" ? "Reserving…" : RESERVE_BUTTON}
      </button>

      <p className="text-[1rem] leading-relaxed text-ink-600">
        {RESERVE_PRIVACY_LINE}
      </p>
    </form>
  );
}
