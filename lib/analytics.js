/**
 * Analytics stub.
 *
 * Nothing is sent anywhere yet. Every event lands in `window.dayfiveEvents`
 * (and the console in development) so you can see what would be tracked.
 *
 * To go live, drop your provider's snippet into app/layout.js where the
 * ANALYTICS SLOT comment is, then replace the body of `send()` below with the
 * one line that provider asks for — e.g.
 *
 *   window.plausible?.(event, { props });
 *   window.gtag?.("event", event, props);
 *   window.posthog?.capture(event, props);
 */

const isBrowser = typeof window !== "undefined";

function send(event, props) {
  if (!isBrowser) return;

  window.dayfiveEvents = window.dayfiveEvents || [];
  window.dayfiveEvents.push({ event, props, at: new Date().toISOString() });

  // Standard dataLayer push — works out of the box with Google Tag Manager.
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...props });

  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.info("[dayfive:analytics]", event, props);
  }
}

/** Track a named event. `props` is a flat object of strings/numbers. */
export function track(event, props = {}) {
  send(event, props);
}

/** Track a CTA click. `label` is the button text, `location` the section. */
export function trackCta(label, location) {
  send("cta_click", { cta_label: label, cta_location: location });
}
