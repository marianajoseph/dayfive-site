import { ImageResponse } from "next/og";

export const alt =
  "DayFive — your books, closed by day five, every month. Automated bookkeeping and FP&A.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CREAM = "#f7f3ea";
const CREAM_300 = "#dbcfb7";
const INK = "#0e1c31";
const INK_600 = "#36434f";
const GOLD_TEXT = "#8a6a20";
const NAVY = "#081426";

/**
 * Hand-copy of components/Logo.jsx `Mark`. Satori draws this card with no
 * webfont loaded, so the 5 has to be a path here as it is in the favicon.
 * Keep the geometry in step with both.
 */
function MarkPaths({ scale = 1 }) {
  return (
    <svg width={32 * scale} height={32 * scale} viewBox="0 0 32 32">
      <g
        fill="none"
        stroke={GOLD_TEXT}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* calendar tab — two even ticks */}
        <path d="M9.5 3.2v3.6" />
        <path d="M22.5 3.2v3.6" />
        <rect x="3" y="6.8" width="26" height="22.2" rx="5" />
      </g>
      <g transform="translate(16 17.9) scale(0.9) translate(-16.6 -18.07)">
        <path
          fill={GOLD_TEXT}
          d="M12.75 12.30 H19.95 V13.70 H14.35
             C14.20 14.90 14.08 15.85 13.98 16.62
             C14.95 16.15 15.95 15.92 16.90 15.92
             C19.35 15.92 20.95 17.45 20.95 19.70
             C20.95 22.10 19.10 23.85 16.45 23.85
             C14.55 23.85 13.05 23.00 12.25 21.60
             L13.35 20.85
             C13.95 22.00 15.05 22.70 16.40 22.70
             C18.25 22.70 19.45 21.45 19.45 19.75
             C19.45 18.10 18.35 17.00 16.65 17.00
             C15.45 17.00 14.35 17.45 13.35 18.30
             L12.30 17.85 Z"
        />
      </g>
    </svg>
  );
}

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: CREAM,
          padding: "64px 76px",
          fontFamily: "sans-serif",
        }}
      >
        {/* soft warm wash, top right */}
        <div
          style={{
            position: "absolute",
            top: -300,
            right: -180,
            width: 780,
            height: 780,
            borderRadius: 9999,
            background: "rgba(212,160,60,0.16)",
            display: "flex",
          }}
        />

        {/* logo lockup */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <MarkPaths scale={1.9} />
          <div
            style={{
              display: "flex",
              fontSize: 40,
              fontWeight: 700,
              color: INK,
              letterSpacing: "-0.035em",
            }}
          >
            Day<span style={{ color: GOLD_TEXT }}>Five</span>
          </div>
        </div>

        {/* headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              display: "flex",
              fontSize: 74,
              lineHeight: 1.08,
              fontWeight: 700,
              color: INK,
              letterSpacing: "-0.03em",
              maxWidth: 900,
            }}
          >
            Your books. Closed by day five. Every month.
          </div>
          <div style={{ display: "flex", fontSize: 28, color: INK_600, maxWidth: 880 }}>
            Automated bookkeeping and FP&amp;A. Clean numbers and five plain-English
            insights, by business day 5.
          </div>
        </div>

        {/* footer strip */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              padding: "10px 22px",
              borderRadius: 999,
              background: NAVY,
              color: CREAM,
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            First close free
          </div>
          <div style={{ display: "flex", flex: 1, height: 1, background: CREAM_300 }} />
          <div style={{ display: "flex", fontSize: 22, color: INK_600 }}>
            Always on · Never late · No meetings needed
          </div>
        </div>
      </div>
    ),
    size,
  );
}
