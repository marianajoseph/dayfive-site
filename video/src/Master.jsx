/**
 * The master. Ten beats, laid out against the measured audio.
 *
 * EVERY DURATION COMES FROM src/timings.json, which scripts/measure-vo.mjs
 * wrote by measuring the actual mp3s. Nothing here is a hand-typed length, so
 * a re-recorded line cannot leave a beat 200ms short — the kind of drift that
 * still renders and only shows when a title card lands on the wrong word.
 *
 * NO MUSIC BED. Operator, 2026-09-20: "start with no bed, exactly as you
 * propose; add only if the silences read empty." Sarah's pauses are doing work
 * and a bed would fill exactly the gaps that were bought deliberately.
 */
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import timings from "./timings.json";
import { colors } from "./config";
import { BEATS } from "./script";
import Broll from "./beats/Broll";
import PnlScroll from "./beats/PnlScroll";
import {
  Beat03Intake, Beat05Citation, Beat06Insights, Beat07Question,
  Beat08Price, Beat09Yours, Beat10EndCard,
} from "./beats/motion";
import { Body, Eyebrow, Headline, Stage } from "./brand";
import { useRise } from "./brand";

const FPS = timings.fps;
const f = (seconds) => Math.round(seconds * FPS);

/**
 * Where each beat starts and how long it runs, accumulated once.
 *
 * `leadIn` sits before beat 1's narration: the film opens on an image, not on
 * a sentence. The b-roll under beat 1 therefore runs longer than beat 1's
 * audio, which is the point of it.
 */
export function layout() {
  let at = f(timings.leadIn);
  const out = [];
  for (const b of timings.beats) {
    const dur = f(b.total);
    out.push({ ...b, from: at - (b.n === 1 ? f(timings.leadIn) : 0),
               voAt: at, frames: dur + (b.n === 1 ? f(timings.leadIn) : 0) });
    at += dur;
  }
  return out;
}

export const MASTER_FRAMES = f(timings.masterSeconds);

/** Beat 2's callout, in brand type — never asked of the generative model. */
function LateCallout() {
  const line = useRise(1.4, 0.8, 26);
  return (
    <Stage>
      <div style={line}>
        <Eyebrow dark style={{ fontSize: 24 }}>The usual arrangement</Eyebrow>
        <Headline size={72} dark style={{ marginTop: 26 }}>
          Books arrive three weeks late —
          <br />
          too late to matter.
        </Headline>
      </div>
    </Stage>
  );
}

/**
 * Beat 10's notification, set over the blank phone screen Veo was asked for.
 *
 * Sized as a card, not a caption. The first pass drew it small and
 * semi-transparent across the middle of the frame, which read as a subtitle
 * floating in a dark room rather than as something the phone was showing.
 */
function CloseReady() {
  const chip = useRise(1.1, 0.8, 18);
  return (
    <AbsoluteFill className="items-center justify-center">
      <div style={{ ...chip, marginBottom: 320 }}>
        <div
          className="rounded-[22px] px-[64px] py-[44px]"
          style={{
            backgroundColor: "rgba(247,243,234,0.97)",
            boxShadow: "0 24px 70px -16px rgb(5 12 23 / 0.85)",
          }}
        >
          <Eyebrow style={{ fontSize: 22 }}>DayFive</Eyebrow>
          <Body size={48} style={{ color: colors.ink, fontWeight: 600,
                                   marginTop: 12 }}>
            Your August close is ready.
          </Body>
        </div>
      </div>
    </AbsoluteFill>
  );
}

/** The visual for one beat, given how long it has. */
function BeatVisual({ n, frames }) {
  switch (n) {
    case 1:
      // Two plates: the shoebox, then the phone that will not stop.
      return (
        <>
          <Sequence durationInFrames={Math.round(frames * 0.58)}>
            <Broll src="broll/beat01a.mp4" ken={0.04} />
          </Sequence>
          <Sequence from={Math.round(frames * 0.58)}>
            <Broll src="broll/beat01b.mp4" />
          </Sequence>
        </>
      );
    case 2:
      return (
        <Broll src="broll/beat02.mp4" tint={0.55}>
          <LateCallout />
        </Broll>
      );
    case 3: return <Beat03Intake />;
    case 4: return <PnlScroll holdIn={0.5} holdOut={0.8} />;
    case 5: return <Beat05Citation />;
    case 6: return <Beat06Insights />;
    case 7: return <Beat07Question />;
    case 8: return <Beat08Price />;
    case 9: return <Beat09Yours />;
    case 10:
      // The workshop, the phone waking, then the card. Three movements inside
      // one beat, because the narration is four short sentences and holding
      // one image across all of them would go slack.
      return (
        <>
          <Sequence durationInFrames={Math.round(frames * 0.24)}>
            <Broll src="broll/beat10a.mp4" ken={0.03} />
          </Sequence>
          <Sequence from={Math.round(frames * 0.24)}
                    durationInFrames={Math.round(frames * 0.32)}>
            {/* startFrom: the plate's screen takes a couple of seconds to
                wake, and a notification over a dark screen is a caption. */}
            <Broll src="broll/beat10b.mp4" tint={0.22} startFrom={2.2}>
              <CloseReady />
            </Broll>
          </Sequence>
          <Sequence from={Math.round(frames * 0.56)}>
            <Beat10EndCard />
          </Sequence>
        </>
      );
    default:
      return null;
  }
}

export default function Master() {
  const beats = layout();
  return (
    <AbsoluteFill style={{ backgroundColor: colors.cream }}>
      {beats.map((b) => (
        <Sequence key={b.n} from={b.from} durationInFrames={b.frames}
                  name={`Beat ${b.n} — ${BEATS[b.n - 1].text.slice(0, 40)}…`}>
          <BeatVisual n={b.n} frames={b.frames} />
        </Sequence>
      ))}

      {/* The narration, one file per beat, placed at its measured start. Kept
          out of the visual sequences on purpose: a beat's picture and its
          audio have different lengths — beat 1's b-roll runs through the
          lead-in before anyone speaks — and nesting the audio would tie them. */}
      {beats.map((b) => (
        <Sequence key={`vo${b.n}`} from={b.voAt} durationInFrames={f(b.vo) + 2}>
          <Audio src={staticFile(`vo/${b.id}.mp3`)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
}
