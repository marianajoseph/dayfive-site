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
export default function DocStack({ pages, group }) {
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
      <div className="relative w-full sm:pt-[6.5%]">
        {/* The page behind — desktop only, and inert to assistive tech since
            the front page and the button already lead into the same viewer. */}
        {behind && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[16%] top-0 hidden w-[80%] overflow-hidden rounded-md shadow-sheet sm:block"
            style={{ aspectRatio: A4 }}
          >
            {behind.node}
          </div>
        )}

        <button
          type="button"
          onClick={() => openAt(0)}
          aria-label={`Open ${front.label} at full size`}
          className="doc-sheet relative block w-full overflow-hidden rounded-md text-left shadow-sheet sm:ml-[4%] sm:w-[80%]"
          style={{ aspectRatio: A4 }}
        >
          {front.node}
        </button>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 sm:ml-[4%]">
        <button
          type="button"
          onClick={() => openAt(0)}
          className="inline-flex min-h-[3rem] items-center gap-2 rounded-full border-2 border-cream-300 bg-white px-6 text-[1.05rem] font-semibold text-ink shadow-soft transition-colors hover:border-gold-on-light hover:text-gold-on-light"
        >
          Open a page
          <span aria-hidden="true">→</span>
        </button>
        <p className="text-[0.8125rem] text-ink-500">
          {pages.length} pages in this pack · watermarked SAMPLE
        </p>
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
          <div
            className="flex max-h-full w-full max-w-[min(96vw,calc((100vh-9rem)/1.4142))] flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between gap-4">
              <p className="min-w-0 truncate text-[1rem] font-medium text-mist">
                {pages[open].label}
                <span className="ml-3 text-[0.9rem] text-mist-700">
                  {open + 1} of {pages.length}
                </span>
              </p>
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
              className="w-full overflow-hidden rounded-md shadow-lift"
              style={{ aspectRatio: A4 }}
            >
              {pages[open].node}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
