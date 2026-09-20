"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";
import { ROADMAP } from "@/lib/pricing";

/**
 * "Tell us what you need."
 *
 * Three fields, because the point is to hear the ask, not to qualify a lead.
 * Anything longer would turn a two-line answer into a form somebody abandons,
 * and the thing we are short of is not contact details — it is a record of
 * what people actually want, in their words.
 *
 * Submissions land in the same leads Sheet as everything else, tagged
 * `roadmap`, via the same appendLead path. One destination, one shape.
 *
 * NO CONFIRMATION EMAIL. /api/subscribe sends the "we'll set up your free
 * first close" note, which would be the wrong reply to someone asking whether
 * we do accounts payable. The route this posts to deliberately does not send
 * one — see app/api/roadmap/route.js.
 */
export default function RoadmapForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [need, setNeed] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.includes("@")) {
      setError("Please enter an email we can reply to.");
      return;
    }
    if (!need.trim()) {
      setError("Tell us what you need — even a few words helps.");
      return;
    }

    setState("sending");
    try {
      const res = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, need, company }),
      });
      if (!res.ok) throw new Error("bad response");
      track("roadmap_request", { source: ROADMAP.source });
      setState("done");
    } catch {
      setState("error");
      setError("Something went wrong. Email docs@getdayfive.com and we'll pick it up.");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-cream-200 sm:p-8">
        <p className="text-lg leading-relaxed text-ink">
          Thank you — that's on the list. We read every one of these, and we'll
          email you when the thing you asked for is ready.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-soft ring-1 ring-cream-200 sm:p-8"
    >
      {/* Honeypot: hidden from people, irresistible to bots. */}
      <input
        type="text"
        name="company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <label className="flex flex-col gap-2">
        <span className="text-[1rem] font-semibold text-ink">Your name</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          className="min-h-12 rounded-xl border border-cream-300 bg-cream/40 px-4 text-[1.05rem] text-ink outline-none focus:border-gold-on-light"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-[1rem] font-semibold text-ink">Email</span>
        <input
          type="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
          className="min-h-12 rounded-xl border border-cream-300 bg-cream/40 px-4 text-[1.05rem] text-ink outline-none focus:border-gold-on-light"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-[1rem] font-semibold text-ink">
          What do you need?
        </span>
        <textarea
          value={need}
          onChange={(e) => setNeed(e.target.value)}
          rows={4}
          required
          placeholder="Accounts payable, a cash forecast, reporting for a lender — whatever it is, in your words."
          className="rounded-xl border border-cream-300 bg-cream/40 p-4 text-[1.05rem] leading-relaxed text-ink outline-none focus:border-gold-on-light"
        />
      </label>

      {error && (
        <p role="alert" className="text-[1rem] font-semibold text-status-risk">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        className="min-h-13 rounded-xl bg-navy-900 px-6 py-3.5 text-[1.05rem] font-bold text-gold-on-dark disabled:opacity-60"
      >
        {state === "sending" ? "Sending…" : "Send it"}
      </button>

      <p className="text-[0.95rem] leading-relaxed text-ink-500">
        We'll only email you about this. No newsletter.
      </p>
    </form>
  );
}
