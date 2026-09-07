import { OFFER_BANNER } from "@/lib/site-config";

/**
 * The site-wide offer strip.
 *
 * GOLD, NOT NAVY. The first version used navy-950 (#050c17) on a page whose
 * hero is navy-900 (#081426) — three points apart. It rendered perfectly and
 * was invisible: the operator reported "no Fall Offer banner" against a page
 * that was serving one. A banner has to look like a banner, so this is the
 * brand gold with navy text, which separates from both of the nav's states
 * (transparent over the hero, solid cream once scrolled).
 *
 * `inFlow` is for pages with no fixed nav (/start), where the banner is an
 * ordinary first element rather than part of a floating header.
 */
export default function OfferBanner({ inFlow = false }) {
  if (!OFFER_BANNER) return null;

  return (
    <div
      className={`bg-gold-on-dark px-5 py-2 text-center sm:px-8 ${
        inFlow ? "-mx-5 mb-6 sm:-mx-8" : ""
      }`}
    >
      <p className="mx-auto max-w-4xl text-[0.85rem] font-medium leading-snug text-navy-950 sm:text-[0.95rem]">
        <span className="font-bold">Fall Offer:</span>{" "}
        {OFFER_BANNER.replace(/^Fall Offer:\s*/, "")}
      </p>
    </div>
  );
}
