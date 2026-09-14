/**
 * BEAT 4 — "Every transaction is categorized. Every account is reconciled to
 * the cent. And every number is independently double-checked before you ever
 * see it."
 *
 * Operator's visual: "screen capture of the REAL sample pack: the P&L
 * scrolling."
 *
 * IT IS THE REAL ONE. <ProfitAndLoss /> is the site's own component, imported
 * from components/docs/DocPages.jsx and reading lib/sample-data — the same
 * module that draws the sample pack on getdayfive.com. Not a screen recording
 * of it, and not a rebuild of it: the component itself, rendered at video
 * resolution.
 *
 * That matters beyond convenience. A recording goes stale the day the sample
 * pack changes and nobody notices until a client compares the video to the
 * page. This cannot go stale: it is re-rendered from the same source, and if
 * the P&L changes, the video changes with it.
 *
 * WHY THE SHEET IS TALLER THAN THE FRAME. DocFrame draws a true A4 page
 * (1 : 1.4142) and sizes its type from a container query, so the page is
 * legible only when it is wide. At a width that makes the figures readable on
 * a 1080p frame the sheet is taller than the frame — which is why this beat is
 * a scroll and not a static hold. The pan is the document being read.
 */
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ProfitAndLoss } from "@/components/docs/DocPages";
import { colors } from "../config";

/** A4, portrait. The sheet DocFrame is drawn on. */
const A4 = 1.41421356;

/** How wide the sheet is drawn, in frame pixels. */
const SHEET_WIDTH = 1180;

export default function PnlScroll({
  /** Seconds of stillness before the pan starts, so the eye lands first. */
  holdIn = 0.6,
  /** Seconds of stillness at the bottom, so the last figure is readable. */
  holdOut = 0.5,
}) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, height } = useVideoConfig();

  const sheetHeight = SHEET_WIDTH * A4;
  const travel = Math.max(0, sheetHeight - height);

  const start = holdIn * fps;
  const end = durationInFrames - holdOut * fps;

  /**
   * Eased at both ends. A linear pan starts and stops abruptly and reads as a
   * machine scrolling; this reads as a document being looked through.
   */
  const y = interpolate(frame, [start, end], [0, -travel], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => t * t * (3 - 2 * t),
  });

  /** A short fade up, so the beat does not cut in hard from the previous one. */
  const opacity = interpolate(frame, [0, 0.35 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.cream, opacity }}>
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "flex-start",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: SHEET_WIDTH,
            height: sheetHeight,
            transform: `translateY(${y}px)`,
            // The site's own --shadow-sheet: white paper lifted off cream.
            boxShadow:
              "0 2px 5px rgb(20 30 48 / 0.07), 0 22px 50px -16px rgb(20 30 48 / 0.24)",
            flexShrink: 0,
          }}
        >
          <ProfitAndLoss />
        </div>
      </AbsoluteFill>

      {/* A soft cream vignette top and bottom, so the sheet passes under an
          edge rather than being clipped by one. Without it the pan looks like
          a crop; with it, it looks like paper moving past a window. */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: `linear-gradient(to bottom, ${colors.cream} 0%, rgba(247,243,234,0) 7%, rgba(247,243,234,0) 93%, ${colors.cream} 100%)`,
        }}
      />
    </AbsoluteFill>
  );
}
