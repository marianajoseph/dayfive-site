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
import { Bed, Punch } from "./ad/music";
import plates from "./plates.json";
import {
  BeatCalendar, BeatChecks, BeatContact, BeatEndMark, BeatInsights,
  BeatIntake, BeatPnl, BeatPromo, BeatSnap, BeatTabs, BeatUrl,
} from "./ad/beats";

const FPS = timings.fps;
const f = (s) => Math.round(s * FPS);

/**
 * The bed and the promo-card punch. Operator's pick, 2026-09-21.
 *
 * The punch is a hit lifted out of this same track at 106.24s — the moment
 * scripts/find-punch.mjs scored highest on attack and on the space in front of
 * it. A stinger from another library over this bed would be the likeliest
 * thing in the film to sound bolted on; a hit from the track already playing
 * cannot clash with it.
 */
const BED = "moving-up-origo.wav";
const PUNCH = "punch-moving-up-origo-106.24s.wav";

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
 * Per-plate reframing, to crop generated artifacts out of shot.
 *
 * Three of the nine came back with something that should not be on screen, and
 * all three sit near a frame edge — so a tighter frame removes them for
 * nothing, where a regenerate would cost a request against a ten-a-day cap.
 *
 *   ad01  a camera VIEWFINDER overlay: corner brackets and a battery icon.
 *         Veo decided "documentary" meant showing the camera's own UI.
 *   ad07  bank signage reading "Bahide" — garbled, which is the failure the
 *         no-readable-text rule exists for: it survives a glance and fails a
 *         pause.
 *   ad06  a CONTINUITY break. The apron woman seen over the shoulder is white
 *         and blonde; the bakery owner in ad02, ad07 and ad15 is Black. The
 *         same person has to be at that desk in act 2 and act 4 or the arc
 *         does not land. Cropping reduces her to a hand at the frame edge,
 *         which identifies nobody.
 *
 * Expressed as the ffmpeg crop each was tested with, then converted — so the
 * numbers here are the ones actually verified on a frame, not re-derived.
 */
const FULL = { w: 1920, h: 1080 };
const CROPS = {
  1: { w: 1520, h: 855, x: 200, y: 130 },
  6: { w: 1330, h: 748, x: 80, y: 160 },
  7: { w: 1520, h: 855, x: 340, y: 180 },
};

function reframe(beat) {
  const c = CROPS[beat];
  if (!c) return { zoom: 1, dx: 0, dy: 0 };
  const zoom = FULL.w / c.w;
  return {
    zoom,
    dx: (FULL.w / 2 - (c.x + c.w / 2)) * zoom,
    dy: (FULL.h / 2 - (c.y + c.h / 2)) * zoom,
  };
}
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
  const { zoom, dx, dy } = reframe(beat);

  // A slow push on top of whatever reframing the plate needs.
  //
  // A REFRAMED PLATE STARTS EXACTLY WHERE IT WAS VERIFIED. The base 1.04 —
  // which exists to hide the edges of an un-reframed shot — multiplied with
  // the crop zoom and pushed ad01 a further 4% past the framing that had been
  // checked on a still. The crop is already the framing decision; only the
  // 3% push belongs on top of it.
  const base = CROPS[beat] ? 1 : 1.04;
  const scale = zoom * (base + (0.03 * frame) / durationInFrames);

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
                   transform: `translate(${dx}px, ${dy}px) scale(${scale})`,
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

export function BeatVisualForTest(props) {
  return <BeatVisual {...props} />;
}

/**
 * Does this beat have a plate ON DISK?
 *
 * Not "is it in the PLATE map" — the map is the intention and plates.json is
 * the fact. The casting revision pointed beat 13 at a shot the daily Veo cap
 * had not allowed yet, and the render died at frame 1144 on a 404. A beat
 * whose plate is still queued falls back to its motion version, so the film
 * stays watchable while the picture catches up.
 */
const hasPlate = (n) => PLATE[n] && plates.have.includes(PLATE[n]);

function BeatVisual({ n }) {
  if (hasPlate(n)) {
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
    // Beat 13's plate (the freelancer closing her laptop) is queued behind the
    // Veo cap. Until it lands, the calendar snapping to five holds the slot —
    // which is the motif the casting revision traded away, so the fallback is
    // the thing it replaced rather than a placeholder.
    case 13: return <BeatCalendar />;
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

      {/* The bed, ducked from the cut's own timings — a beat that moves takes
          its ducking with it. Up on the eight picture-only beats, which is
          most of what makes a scored cut feel scored. */}
      <Sequence from={0} durationInFrames={AD_FRAMES}>
        <Bed
          track={BED}
          windows={beats.filter((b) => b.vo > 0)
            .map((b) => [b.from / FPS, (b.from + f(b.vo)) / FPS])}
        />
      </Sequence>

      {/* The punch, on the promo card. */}
      {(() => {
        const promo = beats.find((b) => b.n === 14);
        return promo ? (
          <Sequence from={promo.from} durationInFrames={AD_FRAMES - promo.from}>
            <Punch track={PUNCH} />
          </Sequence>
        ) : null;
      })()}
    </AbsoluteFill>
  );
}
