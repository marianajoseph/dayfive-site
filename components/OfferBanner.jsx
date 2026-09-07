import { OFFER_BANNER } from "@/lib/site-config";

/**
 * The site-wide offer strip.
 *
 * Gold on navy in both of the nav's states, because the bar behind it changes
 * from transparent-over-hero to solid cream on scroll and a banner that
 * inherited either one would vanish against the other.
 *
 * `inFlow` is for pages with no fixed nav (/start), where the banner is an
 * ordinary first element rather than part of a floating header.
 */
export default function OfferBanner({ inFlow = false }) {
  if (!OFFER_BANNER) return null;

  return (
    <div
      className={`bg-navy-950 px-5 py-2 text-center sm:px-8 ${
        inFlow ? "-mx-5 mb-6 sm:-mx-8" : ""
      }`}
    >
      <p className="mx-auto max-w-4xl text-[0.9rem] font-medium leading-snug text-cream sm:text-[0.95rem]">
        <span className="font-bold text-gold-on-dark">Fall Offer:</span>{" "}
        {OFFER_BANNER.replace(/^Fall Offer:\s*/, "")}
      </p>
    </div>
  );
}
