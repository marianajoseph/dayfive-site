"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";

const A4 = "1 / 1.4142";

/**
 * Two sheets, not three, and squared up rather than fanned.
 *
 * The fan was the problem: three pages meant the front one rendered its body
 * copy at 5–6px, and the outer two were clipped by the section edge. Here the
 * front page takes 80% of the container — 620px at the narrowest supported
 * layout, where `.doc` puts body copy at 9.5px — and one page sits behind it,
 * offset. The pair spans 4%–96% of the container, so both stay fully inside
 * with ~33px of clearance at the section edge.
 *
 * On phones the offset page is dropped entirely: one page, full width.
 * Everything in the pack is still reachable through the viewer.
 */
export default function DocStack({ pages, group, packSize }) {
  const [open, setOpen] = useState(null);
  const closeRef = useRef(null);
  const lastFocused = useRef(null);

  const openAt = useCallback(
    (i) => {
      lastFocused.current = document.activeElement;
      setOpen(i);
      track("doc_open", { group, document: pages[i].label });
    },
    [group, pages],
  );

  const close = useCallback(() => {
    setOpen(null);
    if (lastFocused.current instanceof HTMLElement) lastFocused.current.focus();
  }, []);

  useEffect(() => {
    if (open === null) return;

    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") setOpen((i) => (i + 1) % pages.length);
      if (e.key === "ArrowLeft") setOpen((i) => (i - 1 + pages.length) % pages.length);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, pages.length, close]);

  const [front, behind] = pages;

  return (
    <>
      {/* Clearance is padding on the wrapper, not percentage margins on the
          sheets. The sheets used to be offset by percentages inside the bare
          column, so the gap to the container edge scaled with the viewport and
          the outer sheet ran into it — the front page on the right in the close
          pack, the offset page on the left in the blocks where the grid
          reverses. A fixed 32px holds whatever the width, and absorbs the 2%
          hover scale rather than letting it spill. Inside the padded box the
          front page spans 0–84% and the offset page 16–100%. */}
      <div className="w-full sm:px-8">
        <div className="relative w-full sm:pt-[6.5%]">
          {/* The page behind — desktop only, and inert to assistive tech since
              the front page and the button already lead into the same viewer.
              `doc-behind` suppresses its watermark: both sheets carry one, and
              where they overlap the two marks read as a single doubled word. */}
          {behind && (
            <div
              aria-hidden="true"
              className="doc-behind pointer-events-none absolute left-[16%] top-0 hidden w-[84%] overflow-hidden rounded-md shadow-sheet sm:block"
              style={{ aspectRatio: A4 }}
            >
              {behind.node}
            </div>
          )}

          <button
            type="button"
            onClick={() => openAt(0)}
            aria-label={`Open ${front.label} at full size`}
            className="doc-sheet relative block w-full overflow-hidden rounded-md text-left shadow-sheet sm:w-[84%]"
            style={{ aspectRatio: A4 }}
          >
            {front.node}
          </button>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
          <button
            type="button"
            onClick={() => openAt(0)}
            className="inline-flex min-h-[3rem] items-center gap-2 rounded-full border-2 border-cream-300 bg-white px-6 text-[1.05rem] font-semibold text-ink shadow-soft transition-colors hover:border-gold-on-light hover:text-gold-on-light"
          >
            Open a page
            <span aria-hidden="true">→</span>
          </button>
          <p className="text-[0.8125rem] text-ink-500">
            {pages.length} of the {packSize} pages in this pack · watermarked SAMPLE
          </p>
        </div>
      </div>

      {/* ── the viewer ─────────────────────────────────────────────────── */}
      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={pages[open].label}
          className="band-navy fixed inset-0 z-[100] flex flex-col items-center justify-center bg-navy-950/94 p-4 backdrop-blur-sm sm:p-8"
          onClick={close}
        >
          {/* On a wide screen the page list sits beside the sheet rather than
              under it. Stacking it cost the sheet ~70px of width for no reason
              — the modal was 467px wide inside a 1440px viewport. */}
          <div
            className="flex max-h-full w-full flex-col items-center gap-5 lg:flex-row lg:items-start lg:justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex w-full min-w-0 flex-col lg:w-[min(70vw,calc((100vh-9rem)/1.4142))]">
            <div className="mb-3 flex items-end justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate text-[1.05rem] font-semibold text-mist">
                  {pages[open].label}
                </p>
                {/* where this sheet actually sits in the real pack */}
                <p className="mt-0.5 truncate text-[0.85rem] text-mist-700">
                  Page {pages[open].page} of {packSize} · {group}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => setOpen((i) => (i - 1 + pages.length) % pages.length)}
                  aria-label="Previous page"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-navy-600 text-mist transition-colors hover:border-gold-on-dark hover:text-gold-hover"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => setOpen((i) => (i + 1) % pages.length)}
                  aria-label="Next page"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-navy-600 text-mist transition-colors hover:border-gold-on-dark hover:text-gold-hover"
                >
                  →
                </button>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={close}
                  aria-label="Close"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-navy-600 text-mist transition-colors hover:border-gold-on-dark hover:text-gold-hover"
                >
                  ✕
                </button>
              </div>
            </div>

              <div
                className="mx-auto w-full max-w-[min(92vw,calc((100vh-13rem)/1.4142))] overflow-hidden rounded-md shadow-lift lg:max-w-none"
                style={{ aspectRatio: A4 }}
              >
                {pages[open].node}
              </div>
            </div>

            {/* Jump straight to any of the three. Read three pages and you
                believe the other eleven. */}
            <nav
              aria-label="Pages in this sample"
              className="-mx-1 flex w-full shrink-0 gap-2 overflow-x-auto px-1 pb-1 lg:mx-0 lg:mt-16 lg:w-60 lg:flex-col lg:overflow-visible lg:px-0"
            >
              {pages.map((p, i) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setOpen(i)}
                  aria-current={i === open ? "true" : undefined}
                  className={`flex min-h-[2.75rem] shrink-0 items-center gap-2.5 rounded-full border px-4 text-left text-[0.9rem] transition-colors lg:rounded-xl lg:py-2.5 ${
                    i === open
                      ? "border-gold-on-dark bg-gold-on-dark/15 font-semibold text-gold-on-dark"
                      : "border-navy-600 text-mist-600 hover:border-gold-on-dark hover:text-gold-hover"
                  }`}
                >
                  <span className="tnum shrink-0 text-[0.8rem] opacity-70">p.{p.page}</span>
                  <span className="max-w-[11rem] truncate lg:max-w-none lg:whitespace-normal">
                    {p.label}
                  </span>
                </button>
              ))}
              <p className="hidden pt-2 text-[0.8rem] leading-snug text-mist-700 lg:block">
                Three of the {packSize} pages in this month&rsquo;s pack. Use ← and → to
                move between them.
              </p>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
