/**
 * The 30-second cutdown — the last four beats, with burned-in captions.
 *
 * Operator, 2026-09-14: "② 30s cutdown (the last four beats) with burned-in
 * captions."
 *
 * TIGHTER GAPS, SAME TAKES. The narration for beats 7–10 is 20.98s, so a 30s
 * cut has about nine seconds of air rather than the master's proportionally
 * larger share. The beats themselves are untouched: same audio, same visuals,
 * same order. A cutdown that re-cut the beats would be a second edit to keep
 * in step with the first.
 *
 * CAPTIONS ARE BURNED IN, which means they are part of the picture and cannot
 * be turned off — right for a silent autoplay feed, where most of this will be
 * watched, and the reason the cutdown exists separately from the master.
 *
 * Their text comes from src/script.js, the same strings the voiceover was
 * rendered from. A caption cannot disagree with what the voice says because
 * there is no second copy of the words.
 */
import { AbsoluteFill, Audio, Sequence, staticFile, interpolate,
         useCurrentFrame, useVideoConfig } from "remotion";
import timings from "./timings.json";
import captions from "./captions.json";
import { CUTDOWN_BEATS } from "./script";
import { colors, MASTER } from "./config";
import Broll from "./beats/Broll";
import {
  Beat07Question, Beat08Price, Beat09Yours, Beat10EndCard,
} from "./beats/motion";
import { Body, Eyebrow, smooth } from "./brand";

const FPS = MASTER.fps;
const f = (s) => Math.round(s * FPS);

/** Air after each beat, and before the first word. Tighter than the master. */
const LEAD_IN = 0.5;
const GAP_AFTER = { 7: 1.4, 8: 1.6, 9: 1.4, 10: 4.1 };

export function cutdownLayout() {
  let at = f(LEAD_IN);
  const out = [];
  for (const n of CUTDOWN_BEATS) {
    const beat = timings.beats.find((b) => b.n === n);
    const dur = f(beat.vo + GAP_AFTER[n]);
    const lead = n === CUTDOWN_BEATS[0] ? f(LEAD_IN) : 0;
    out.push({ ...beat, from: at - lead, voAt: at, frames: dur + lead });
    at += dur;
  }
  return out;
}

export const CUTDOWN_FRAMES = (() => {
  const last = cutdownLayout().at(-1);
  return last.from + last.frames;
})();

/**
 * One caption, bottom third.
 *
 * On a scrim rather than bare over the picture: these run over a cream page
 * for three beats and a dark workshop for the fourth, and type that is legible
 * on both is type that has a panel behind it. A caption nobody can read on
 * half the beats is not a caption.
 */
function Caption({ text }) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const o = interpolate(
    frame,
    [0, 0.12 * fps, durationInFrames - 0.12 * fps, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: smooth }
  );
  return (
    <AbsoluteFill
      style={{ alignItems: "center", justifyContent: "flex-end", opacity: o }}
    >
      <div
        style={{
          marginBottom: 88,
          maxWidth: 1500,
          backgroundColor: "rgba(8,20,38,0.88)",
          borderRadius: 14,
          padding: "22px 40px",
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: "var(--font-sans)",
            fontSize: 46,
            fontWeight: 600,
            lineHeight: 1.25,
            color: colors.mist,
            textAlign: "center",
          }}
        >
          {text}
        </p>
      </div>
    </AbsoluteFill>
  );
}

function BeatVisual({ n, frames }) {
  switch (n) {
    case 7: return <Beat07Question />;
    case 8: return <Beat08Price />;
    case 9: return <Beat09Yours />;
    case 10:
      return (
        <>
          <Sequence durationInFrames={Math.round(frames * 0.3)}>
            <Broll src="broll/beat10b.mp4" tint={0.25} startFrom={2.2} />
          </Sequence>
          <Sequence from={Math.round(frames * 0.3)}>
            <Beat10EndCard />
          </Sequence>
        </>
      );
    default: return null;
  }
}

export default function Cutdown() {
  const beats = cutdownLayout();
  return (
    <AbsoluteFill style={{ backgroundColor: colors.cream }}>
      {beats.map((b) => (
        <Sequence key={b.n} from={b.from} durationInFrames={b.frames}>
          <BeatVisual n={b.n} frames={b.frames} />
        </Sequence>
      ))}

      {beats.map((b) => (
        <Sequence key={`vo${b.n}`} from={b.voAt} durationInFrames={f(b.vo) + 2}>
          <Audio src={staticFile(`vo/${b.id}.mp3`)} />
        </Sequence>
      ))}

      {/* Captions sit above everything, placed against each beat's own audio
          start rather than against the film — so retiming a beat moves its
          captions with it. */}
      {beats.map((b) =>
        (captions.beats[b.id] ?? []).map((c, i) => (
          <Sequence
            key={`${b.id}-${i}`}
            from={b.voAt + f(c.from)}
            durationInFrames={Math.max(f(c.to - c.from), 12)}
          >
            <Caption text={c.text} />
          </Sequence>
        ))
      )}
    </AbsoluteFill>
  );
}
