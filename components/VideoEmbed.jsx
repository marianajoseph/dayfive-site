"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

/**
 * The explainer, as a FACADE rather than an iframe.
 *
 * A YouTube iframe costs roughly half a megabyte and several hundred
 * milliseconds of main-thread work on first paint, whether or not anyone
 * presses play — and two thirds of this site's ad traffic is phones. So the
 * page ships a poster image and a button; the iframe is created on the first
 * click, and only then.
 *
 * This is the lite-youtube pattern, written out rather than installed. It is
 * about forty lines, and a dependency for forty lines is a dependency to
 * update, audit and explain.
 *
 * THE POSTER IS A LOCAL FRAME, NOT YOUTUBE'S THUMBNAIL. Taken from the cut at
 * 44.5s — the bakery owner handing the pack across the bank desk, both women
 * smiling. Three reasons it beats i.ytimg.com:
 *
 *   a face, chosen. YouTube's auto-thumbnail is whatever frame it liked, and
 *   the frame that sells this film is the payoff, not the pain it opens on.
 *   no third-party request before a click. Fetching the thumbnail from
 *   ytimg contacts Google on page load, which is the cost this component
 *   exists to avoid.
 *   it cannot change underneath us.
 *
 * `youtube-nocookie.com` and no cookie until play: the privacy policy says
 * what we set, and a marketing iframe quietly setting one on every visit would
 * make that page wrong.
 */
export default function VideoEmbed({
  id,
  title = "DayFive — your books, closed by day five",
  poster = "/video-poster.jpg",
}) {
  const [playing, setPlaying] = useState(false);

  function play() {
    track("video_play", { id });
    setPlaying(true);
  }

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-navy-950 shadow-lift">
      {/* 16:9, held by aspect-ratio so the box never collapses while the
          poster loads and nothing below it jumps. */}
      <div className="relative aspect-video w-full">
        {playing ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
            title={title}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={play}
            aria-label={`Play: ${title}`}
            className="group absolute inset-0 h-full w-full cursor-pointer border-0 p-0"
          >
            <img
              src={poster}
              alt=""
              width={1920}
              height={1080}
              /* eager + high priority: it is the hero. A lazy hero image is a
                 blank box in the first paint, which is worse than the byte
                 cost it saves. */
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* A soft scrim so the play mark holds on any frame. */}
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-navy-950/15 transition-colors group-hover:bg-navy-950/25"
            />

            <span
              aria-hidden="true"
              /* Sits ABOVE centre and sized for the narrow hero column. Centred at
                 4.5rem it collided with the caption, because the right column
                 makes this box ~455px wide and a 72px button is a large share
                 of that. */
              className="absolute left-1/2 top-[44%] flex h-[3.5rem] w-[3.5rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gold-on-dark shadow-card transition-transform group-hover:scale-105 sm:h-[4.25rem] sm:w-[4.25rem]"
            >
              {/* A triangle, drawn — no icon font, no second asset. */}
              <svg
                viewBox="0 0 24 24"
                className="ml-0.5 h-6 w-6 sm:h-8 sm:w-8"
                fill="#050c17"
                aria-hidden="true"
              >
                <path d="M8 5.5v13l11-6.5z" />
              </svg>
            </span>

            <span /* A three-stop gradient, not two. With a single stop the eyebrow sat
                 where the wash was still nearly transparent, and gold-on-light
                 is the one pairing this palette cannot carry. */
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy-950 via-navy-950/80 to-transparent px-5 pb-4 pt-14 text-left sm:px-6 sm:pb-5">
              <span className="block text-[0.95rem] font-bold uppercase tracking-[0.14em] text-gold-on-dark">
                Watch · 1 min
              </span>
              <span className="mt-1 block font-display text-[1.25rem] font-semibold tracking-[-0.02em] text-mist sm:text-[1.6rem]">
                What DayFive actually does
              </span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
