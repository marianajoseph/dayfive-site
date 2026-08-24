"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";
import { Check } from "./Icons";

const field =
  "w-full rounded-2xl border-2 border-cream-300 bg-cream px-5 py-4 text-lg text-ink placeholder:text-ink-500/70 transition-colors focus:border-gold-600 focus:outline-none";

export default function EmailCapture() {
  const [email, setEmail] = useState("");
  const [business, setBusiness] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [state, setState] = useState("idle"); // idle | sending | done | error
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    if (state === "sending") return;

    setState("sending");
    setError("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, business, company, source: "start-page" }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Something went wrong. Try again in a moment.");
        setState("error");
        return;
      }

      track("lead_captured", { source: "start-page" });
      setState("done");
    } catch {
      setError("We couldn't reach the server. Check your connection and try again.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div role="status" className="text-center sm:text-left">
        <Check size={44} className="mx-auto text-gold-600 sm:mx-0" />
        <p className="mt-4 font-display text-[1.6rem] font-semibold tracking-[-0.03em] text-ink">
          You&rsquo;re on the list.
        </p>
        <p className="mt-3 text-lg leading-relaxed text-ink-600">
          We&rsquo;ll write to{" "}
          <strong className="font-bold text-gold-700">{email}</strong> the moment
          onboarding opens — one email, no drip campaign. Want a head start? Reply to it
          with how far behind your books are and we&rsquo;ll quote the catch-up before you
          sign anything.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-[0.85rem] font-bold uppercase tracking-[0.12em] text-ink-600"
        >
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
        <label
          htmlFor="business"
          className="mb-2 block text-[0.85rem] font-bold uppercase tracking-[0.12em] text-ink-600"
        >
          Business name{" "}
          <span className="font-medium normal-case tracking-normal text-ink-500">
            (optional)
          </span>
        </label>
        <input
          id="business"
          name="business"
          type="text"
          autoComplete="organization"
          placeholder="Riverside Plumbing LLC"
          value={business}
          onChange={(e) => setBusiness(e.target.value)}
          className={field}
        />
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
        <p id="capture-error" role="alert" className="text-[1rem] font-semibold text-status-bad">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        className="inline-flex min-h-[3.5rem] items-center justify-center rounded-full bg-gold-500 px-8 text-[1.05rem] font-semibold tracking-tight text-navy-950 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:bg-gold-600 hover:text-cream disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state === "sending" ? "Adding you…" : "Tell me when it opens"}
      </button>

      <p className="text-[1rem] leading-relaxed text-ink-500">
        One email when onboarding opens. No newsletter, we don&rsquo;t share your address
        with anyone, and you can unsubscribe in one click.
      </p>
    </form>
  );
}
