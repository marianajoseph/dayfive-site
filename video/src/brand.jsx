/**
 * The pieces every beat is built from.
 *
 * All of it draws with the site's Tailwind classes against app/globals.css, so
 * there is no second definition of the brand anywhere in the video. The only
 * colours written as JS literals live in config.js and are checked against
 * globals.css by scripts/check-tokens.mjs.
 *
 * ONE EASING, ONE RHYTHM. Every entrance in the film uses `rise` and every
 * fade uses `fade`. A motion-graphics piece where each beat animates slightly
 * differently reads as assembled by several people, which is the impression a
 * bookkeeping firm can least afford.
 */
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import "./fonts";
import { colors } from "./config";

/** Smoothstep. Soft at both ends, no overshoot — nothing here should bounce. */
export const smooth = (t) => t * t * (3 - 2 * t);

/** Opacity 0→1 over `dur` seconds, starting at `delay` seconds. */
export function useFade(delay = 0, dur = 0.5) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return interpolate(frame, [delay * fps, (delay + dur) * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: smooth,
  });
}

/** Fade in, and fade out again `before` seconds from the end. */
export function useFadeInOut(delay = 0, dur = 0.5, before = 0.5) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const inOpacity = interpolate(frame, [delay * fps, (delay + dur) * fps], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: smooth });
  const out = interpolate(
    frame,
    [durationInFrames - (before + dur) * fps, durationInFrames - before * fps],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: smooth }
  );
  return Math.min(inOpacity, out);
}

/** Rise: fade up while translating a few pixels. The film's only entrance. */
export function useRise(delay = 0, dur = 0.6, distance = 22) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = interpolate(frame, [delay * fps, (delay + dur) * fps], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: smooth });
  return { opacity: t, transform: `translateY(${(1 - t) * distance}px)` };
}

/** The cream page every motion beat sits on. */
export function Screen({ children, dark = false, style }) {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: dark ? colors.navy900 : colors.cream,
        color: dark ? colors.mist : colors.ink,
        fontFamily: "var(--font-sans)",
        ...style,
      }}
    >
      {children}
    </AbsoluteFill>
  );
}

/** Centred column with the margins the site uses on its own bands. */
export function Stage({ children, className = "" }) {
  return (
    <AbsoluteFill
      className={`items-center justify-center px-[140px] text-center ${className}`}
    >
      <div className="w-full max-w-[1340px]">{children}</div>
    </AbsoluteFill>
  );
}

/** The gold uppercase eyebrow, at video scale. */
export function Eyebrow({ children, dark = false, style }) {
  return (
    <p
      className="font-bold uppercase"
      style={{
        fontSize: 26,
        letterSpacing: "0.18em",
        color: dark ? colors.goldOnDark : colors.goldOnLight,
        ...style,
      }}
    >
      {children}
    </p>
  );
}

/** A display-face headline. The film's one voice for a statement. */
export function Headline({ children, size = 92, dark = false, style }) {
  return (
    <h1
      style={{
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1.08,
        letterSpacing: "-0.025em",
        color: dark ? colors.mist : colors.ink,
        margin: 0,
        ...style,
      }}
    >
      {children}
    </h1>
  );
}

/** Body copy under a headline. */
export function Body({ children, size = 34, dark = false, style }) {
  return (
    <p
      style={{
        fontSize: size,
        lineHeight: 1.45,
        color: dark ? colors.mist : colors.ink600,
        margin: 0,
        ...style,
      }}
    >
      {children}
    </p>
  );
}

/** The wordmark, set in the display face. Day + gold Five. */
export function Wordmark({ size = 140, dark = false }) {
  return (
    <span
      style={{
        fontFamily: "var(--font-display)",
        fontWeight: 600,
        fontSize: size,
        letterSpacing: "-0.04em",
        color: dark ? colors.mist : colors.ink,
      }}
    >
      Day
      <span style={{ color: dark ? colors.goldOnDark : colors.goldOnLight }}>
        Five
      </span>
    </span>
  );
}

/** The gold checkmark used wherever something is confirmed done. */
export function Check({ size = 40, progress = 1 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="11" stroke={colors.goldOnLight} strokeWidth="1.4"
              opacity={0.35} />
      <path
        d="M7 12.4 L10.4 15.8 L17 9.2"
        stroke={colors.goldOnLight}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - progress}
      />
    </svg>
  );
}

/** A white card on cream, with the site's sheet shadow. */
export function Card({ children, className = "", style }) {
  return (
    <div
      className={`rounded-[18px] bg-white ${className}`}
      style={{
        boxShadow:
          "0 2px 5px rgb(20 30 48 / 0.07), 0 22px 50px -16px rgb(20 30 48 / 0.24)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
