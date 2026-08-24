"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";

/** Resting position of each sheet in the desktop fan. */
const FAN = [
  { x: 0, y: 0, r: -2, z: 30 },
  { x: 26, y: 6, r: 7, z: 20 },
  { x: -26, y: 9, r: -10, z: 10 },
];

const A4 = "1 / 1.4142";

export default function DocStack({ pages, group }) {
  const [hovered, setHovered] = useState(null);
  const [open, setOpen] = useState(null);
  const closeRef = useRef(null);
  const lastFocused = useRef(null);

  const openAt = useCallback(
    (i) => {
      lastFocused.current = document.activeElement;
      setOpen(i);
      track("doc_enlarge", { group, document: pages[i].label });
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

  return (
    <>
      {/* One set of sheets. A rail on phones, a fan from lg up — see globals.css. */}
      <div
        className="doc-fan -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-5 pt-2 sm:-mx-8 sm:px-8 lg:aspect-[4/3.4] lg:w-full"
        onMouseLeave={() => setHovered(null)}
      >
        {pages.map((p, i) => {
          const f = FAN[i] ?? FAN[0];
          const isUp = hovered === i;
          const dimmed = hovered !== null && !isUp;

          return (
            <button
              key={p.label}
              type="button"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => openAt(i)}
              aria-label={`Enlarge: ${p.label}`}
              className="doc-fan-item w-[74%] shrink-0 snap-center text-left sm:w-[54%]"
              style={{
                "--tx": `${isUp ? f.x * 0.35 : f.x}%`,
                "--ty": isUp ? "-4%" : `${f.y}%`,
                "--r": isUp ? "0deg" : `${f.r}deg`,
                "--s": isUp ? 1.05 : 1,
                "--dim": dimmed ? 0.82 : 1,
                zIndex: isUp ? 50 : f.z,
              }}
            >
              <div
                className="w-full overflow-hidden rounded-md shadow-sheet lg:h-full"
                style={{ aspectRatio: A4 }}
              >
                {p.node}
              </div>
              <span className="mt-3 block text-[0.95rem] font-medium text-ink-600 lg:hidden">
                {p.label}
                <span className="ml-2 font-semibold text-gold-700">Tap to enlarge</span>
              </span>
            </button>
          );
        })}

        <p className="pointer-events-none absolute inset-x-0 bottom-0 hidden text-center text-[0.95rem] text-ink-500 lg:block">
          {hovered === null ? (
            <>Hover a page to lift it · click to see it full size</>
          ) : (
            <span className="font-semibold text-gold-700">{pages[hovered].label}</span>
          )}
        </p>
      </div>

      {/* ── lightbox ───────────────────────────────────────────────────── */}
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
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-navy-600 text-mist transition-colors hover:border-gold-400 hover:text-gold-300"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => setOpen((i) => (i + 1) % pages.length)}
                  aria-label="Next page"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-navy-600 text-mist transition-colors hover:border-gold-400 hover:text-gold-300"
                >
                  →
                </button>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={close}
                  aria-label="Close"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-navy-600 text-mist transition-colors hover:border-gold-400 hover:text-gold-300"
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
