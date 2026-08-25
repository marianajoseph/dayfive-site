import { ImageResponse } from "next/og";

export const alt =
  "DayFive — your books, closed by day five, every month. Automated bookkeeping and FP&A.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CREAM = "#f7f3ea";
const CREAM_300 = "#dbcfb7";
const INK = "#0e1c31";
const INK_600 = "#36434f";
const GOLD_ON_DARK = "#d9ae52";
const GOLD_TEXT = "#8a6a20";
const NAVY = "#081426";

/** The solid tile mark — the same asset the nav and favicon use. */
function MarkPaths({ scale = 1 }) {
  return (
    <svg width={32 * scale} height={32 * scale} viewBox="0 0 32 32">
      <rect width="32" height="32" rx="7" fill={GOLD_ON_DARK} />
      <g transform="translate(16 16) scale(1.63) translate(-16 -17.3)">
        <path
          d="M19.3 12.4H12.7v4.2H16a2.8 2.8 0 1 1-2.5 4"
          fill="none"
          stroke={NAVY}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
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
