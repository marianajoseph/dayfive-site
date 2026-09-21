/**
 * The music bed, ducked under the narration, and the promo-card punch.
 *
 * Operator, 2026-09-21: "Bed ducked ~12–15 dB under the VO, up on picture-only
 * beats, punch on the promo card."
 *
 * ===========================================================================
 * DUCKING IS COMPUTED FROM THE CUT, NOT DRAWN BY HAND
 * ===========================================================================
 * The envelope is built from the same ad-timings.json the picture and the
 * narration are built from, so a beat that moves takes its ducking with it.
 * A hand-drawn automation curve would be a second copy of the edit — and the
 * first time a beat changed length, the bed would duck over silence and swell
 * under a line.
 *
 * ===========================================================================
 * THE dB ARE REAL dB
 * ===========================================================================
 * "12–15 dB under" is a ratio, not a slider position. Remotion's `volume` is
 * linear amplitude, so the levels below are computed from decibels rather than
 * guessed: -14 dB is 10^(-14/20) ≈ 0.20, not "about a fifth". Writing the
 * conversion down means the brief's number and the number in the render are
 * the same number.
 */
import { Audio, staticFile, useVideoConfig } from "remotion";

/** Decibels to linear amplitude. */
export const db = (x) => 10 ** (x / 20);

/**
 * Bed levels.
 *
 * UNDER_VO sits the bed 14 dB below the narration — the middle of the brief's
 * 12–15 dB range, so there is room to move either way after a listen. OPEN is
 * where it comes up when nobody is speaking, which is most of what makes a
 * silent-bed cut feel scored rather than merely accompanied.
 */
export const BED_UNDER_VO = db(-14);   // ≈ 0.200
export const BED_OPEN = db(-7);        // ≈ 0.447

/** How long the bed takes to get out of the way, and to come back. */
const DUCK_IN = 0.18;
const DUCK_OUT = 0.45;   // slower up than down: a fast swell sounds like a mistake

/**
 * Build a frame → amplitude function from a list of speaking windows.
 *
 * Ducking early and recovering late is deliberate. The bed is already out of
 * the way when a line starts, and it does not rush back in on the last
 * syllable — which is where an automatic ducker gives itself away.
 */
export function duckEnvelope(windows, fps) {
  return (frame) => {
    const t = frame / fps;
    let level = BED_OPEN;
    for (const [from, to] of windows) {
      if (t >= from - DUCK_IN && t <= to + DUCK_OUT) {
        if (t < from) {
          const k = (t - (from - DUCK_IN)) / DUCK_IN;
          level = Math.min(level, BED_OPEN + (BED_UNDER_VO - BED_OPEN) * k);
        } else if (t <= to) {
          level = BED_UNDER_VO;
        } else {
          const k = (t - to) / DUCK_OUT;
          level = Math.min(level, BED_UNDER_VO + (BED_OPEN - BED_UNDER_VO) * k);
        }
      }
    }
    return level;
  };
}

/**
 * The bed.
 *
 * `loop` because none of these tracks is as long as the film — the shortest
 * usable one is 22.6s against sixty seconds of picture. A bed that simply
 * stops two-thirds of the way through is worse than no bed.
 */
export function Bed({ track, windows }) {
  const { fps } = useVideoConfig();
  if (!track) return null;
  return (
    <Audio
      src={staticFile(`music/${track}`)}
      loop
      volume={duckEnvelope(windows, fps)}
    />
  );
}

/**
 * The promo card's punch.
 *
 * A stinger, not a bed: it is allowed to ring out past the card and into the
 * next beat, which is what a stinger does. Loud, because it is the one moment
 * the film asks for attention rather than giving information — but under 0 dB,
 * since it lands over no narration and full scale would clip against the bed.
 */
export function Punch({ track }) {
  if (!track) return null;
  return <Audio src={staticFile(`music/${track}`)} volume={db(-3)} />;
}
