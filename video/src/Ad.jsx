/**
 * THE 60-SECOND AD. Nineteen beats, cut to the act clock.
 *
 * Operator, 2026-09-20: the v1 master was "approved as craft but rejected as
 * an ad — too slow, too calm, too premium for our buyer."
 *
 * NO MUSIC BED — deliberately, and temporarily. "Assemble without it — deliver
 * the cut silent-bed and I'll source a licensed track separately… never pull
 * an unlicensed track." A commercial film wants a licence, not a file that
 * happened to be downloadable. `MUSIC` below is the slot: drop a track in
 * assets/music/ and set it, and the bed arrives on the next render.
 *
 * THE PLATES ARE GRADED UP. The brief asks for "brighter and warmer than the
 * master (lift ~20%), still inside the brand palette". Veo was asked for a
 * bright look and delivered one; this adds the last of it in the render, where
 * it can be tuned without spending anything.
 */
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate,
         staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import timings from "./ad-timings.json";
import { AD } from "./ad-script";
import { colors } from "./colors";
import { MASTER } from "./config";
import { Body, Eyebrow, Headline, Stage, smooth } from "./brand";
import {
  BeatChecks, BeatContact, BeatEndMark, BeatInsights,
  BeatIntake, BeatPnl, BeatPromo, BeatSnap, BeatTabs, BeatUrl,
} from "./ad/beats";

const FPS = timings.fps;
const f = (s) => Math.round(s * FPS);

/**
 * The licensed music bed. null until a track exists.
 *
 * Set to a filename under assets/music/ once one is bought. Nothing else needs
 * to change — the cut is already timed and the bed simply plays under it.
 */
const MUSIC = null;

/**
 * Which plate each character beat uses.
 *
 * Beat 13 JOINED this list in the casting revision and the calendar-snapping-
 * to-five graphic came out to make room. Three relief characters were asked
 * for — contractor, bakery owner, freelancer — and acts 3–5 had only two
 * plate slots. The day-five motif still lands twice without it: in the
 * narration ("on the fifth of every month") and on the end card ("Day five.
 * Done."). Swapping the calendar back in means giving up one of the three.
 */
const PLATE = {
  1: "ad01", 2: "ad02", 3: "ad03", 5: "ad05",
  6: "ad06", 7: "ad07", 13: "ad13", 15: "ad15", 16: "ad16",
};

/**
 * Where the useful second of each plate starts.
 *
 * Veo hands back eight seconds because 1080p demands it; a 2–4s cut wants the
 * moment the action happens, which is rarely frame one. These are chosen per
 * shot after watching them, not defaulted to zero.
 */
const PLATE_IN = {
  1: 1.6, 2: 1.2, 3: 1.8, 5: 2.4, 6: 1.4,
  7: 1.2, 13: 1.6, 15: 2.0, 16: 2.2,
};

export function adLayout() {
  let at = 0;
  return timings.beats.map((b) => {
    const entry = { ...b, from: at };
    at += b.frames;
    return entry;
  });
}

export const AD_FRAMES = timings.totalFrames;

/**
 * A plate, graded up and cropped to fill.
 *
 * The lift is a CSS filter rather than a colour pass in the prompt: it is free,
 * it is reversible, and it applies identically to all eight so they cut
 * together. Saturation goes up far less than brightness — the brand palette is
 * muted by design and a saturated version of it is a different brand.
 */
function Plate({ beat }) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const id = PLATE[beat];

  // A slow push, so even a locked-off plate is moving under a fast cut.
  const scale = 1.04 + (0.03 * frame) / durationInFrames;

  // Quick edges only — this film cuts, it does not dissolve.
  const edge = 0.12 * fps;
  const o = interpolate(frame, [0, edge, durationInFrames - edge, durationInFrames],
                        [0, 1, 1, 0],
                        { extrapolateLeft: "clamp", extrapolateRight: "clamp",
                          easing: smooth });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.cream, opacity: o }}>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <OffthreadVideo
          src={staticFile(`ad-broll/${id}.mp4`)}
          muted
          startFrom={Math.round((PLATE_IN[beat] ?? 0) * fps)}
          style={{ width: "100%", height: "100%", objectFit: "cover",
                   transform: `scale(${scale})`,
                   filter: "brightness(1.18) saturate(1.06) contrast(1.02)" }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

/** Beat 5's date callout — in Fraunces, never asked of the model. */
function DateCallout() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const o = interpolate(frame, [0.5 * fps, 0.85 * fps], [0, 1],
                        { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "flex-end", justifyContent: "flex-start",
                           padding: 90, opacity: o }}>
      <div style={{ backgroundColor: "rgba(8,20,38,0.9)", borderRadius: 16,
                    padding: "22px 34px", textAlign: "right" }}>
        <p style={{ margin: 0, fontFamily: "var(--font-display)", fontWeight: 600,
                    fontSize: 84, lineHeight: 1, color: colors.goldOnDark }}>
          24th
        </p>
        <p style={{ margin: "8px 0 0", fontSize: 26, color: colors.mist }}>
          still nothing
        </p>
      </div>
    </AbsoluteFill>
  );
}

function BeatVisual({ n }) {
  if (PLATE[n]) {
    return (
      <>
        <Plate beat={n} />
        {n === 5 && <DateCallout />}
      </>
    );
  }
  switch (n) {
    case 4: return <BeatTabs />;
    case 8: return <BeatSnap />;
    case 9: return <BeatIntake />;
    case 10: return <BeatChecks />;
    case 11: return <BeatPnl />;
    case 12: return <BeatInsights />;

    case 14: return <BeatPromo />;
    case 17: return <BeatEndMark />;
    case 18: return <BeatUrl />;
    case 19: return <BeatContact />;
    default: return null;
  }
}

export default function Ad() {
  const beats = adLayout();
  return (
    <AbsoluteFill style={{ backgroundColor: colors.cream }}>
      {beats.map((b) => (
        <Sequence key={b.n} from={b.from} durationInFrames={b.frames}
                  name={`${b.n} · act ${b.act} · ${b.line || "(picture)"}`}>
          <BeatVisual n={b.n} />
        </Sequence>
      ))}

      {/* Narration, one file per beat, starting with its picture. Eight beats
          have none — the cuts that land on silence are what make the next
          line land. */}
      {beats.filter((b) => b.vo > 0).map((b) => (
        <Sequence key={`vo${b.n}`} from={b.from} durationInFrames={f(b.vo) + 2}>
          <Audio src={staticFile(`ad-vo/${b.id}.mp3`)} />
        </Sequence>
      ))}

      {MUSIC && (
        <Sequence from={0} durationInFrames={AD_FRAMES}>
          <Audio src={staticFile(`music/${MUSIC}`)} volume={0.18} />
        </Sequence>
      )}
    </AbsoluteFill>
  );
}
