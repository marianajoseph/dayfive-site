/**
 * The music test cut — Act 1 plus the promo card, about twenty seconds.
 *
 * Operator, 2026-09-21: "render three short test cuts — Act 1 plus the promo
 * card, ~20s each — one per track, so I can pick by ear."
 *
 * WHY THOSE TWO PIECES. Act 1 is five fast cuts carrying four lines of
 * narration, so it is where ducking either works or is audible. The promo card
 * is the only silent beat with a stinger on it. Between them they exercise
 * every state the bed has — open, ducked, and punched — in a fifth of the
 * runtime of the film.
 *
 * The beats are the REAL beats, pulled from the same layout the ad uses, so a
 * track that sits well here sits well in the film. A purpose-built twenty
 * seconds would have been quicker and would have proved nothing.
 */
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import timings from "./ad-timings.json";
import { colors } from "./colors";
import { adLayout, BeatVisualForTest } from "./Ad";

import { Bed, Punch } from "./ad/music";

const FPS = timings.fps;
const f = (s) => Math.round(s * FPS);

/** Act 1 entire, then the promo card. */
const TEST_BEATS = [1, 2, 3, 4, 5, 14];

export function testLayout() {
  const full = adLayout();
  let at = 0;
  return TEST_BEATS.map((n) => {
    const b = full.find((x) => x.n === n);
    const entry = { ...b, from: at };
    at += b.frames;
    return entry;
  });
}

export const TEST_FRAMES = testLayout().reduce((t, b) => t + b.frames, 0);

export default function MusicTest({ bed, punch }) {
  const beats = testLayout();

  // The windows the bed has to get out of the way for, in seconds, derived
  // from this cut rather than from the film — the promo card sits at ~15s
  // here and ~40s there, and a hand-copied number would be wrong in one.
  const windows = beats
    .filter((b) => b.vo > 0)
    .map((b) => [b.from / FPS, (b.from + f(b.vo)) / FPS]);

  const promo = beats.find((b) => b.n === 14);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.cream }}>
      {beats.map((b) => (
        <Sequence key={b.n} from={b.from} durationInFrames={b.frames}
                  name={`${b.n} · ${b.line || "(picture)"}`}>
          <BeatVisualForTest n={b.n} />
        </Sequence>
      ))}

      {beats.filter((b) => b.vo > 0).map((b) => (
        <Sequence key={`vo${b.n}`} from={b.from} durationInFrames={f(b.vo) + 2}>
          <Audio src={staticFile(`ad-vo/${b.id}.mp3`)} />
        </Sequence>
      ))}

      <Sequence from={0} durationInFrames={TEST_FRAMES}>
        <Bed track={bed} windows={windows} />
      </Sequence>

      {promo && (
        <Sequence from={promo.from} durationInFrames={TEST_FRAMES - promo.from}>
          <Punch track={punch} />
        </Sequence>
      )}
    </AbsoluteFill>
  );
}
