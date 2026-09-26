/**
 * The 30-second cutdown and the 15-second bumper.
 *
 * ===========================================================================
 * NEITHER IS A TRUNCATION
 * ===========================================================================
 * Both reuse the ad's beats exactly — same plates, same narration, same
 * reframing, same score — because a cutdown that re-cut its shots would be a
 * second edit to keep in step with the first. What changes is WHICH beats, and
 * that choice is the whole craft of a cutdown.
 *
 * THE 30 keeps one beat from each movement and drops the elaborations: one
 * line of pain rather than four, one line of proof rather than three. A viewer
 * who sees only this should still get the argument end to end — problem, turn,
 * proof, offer, name — because on a thirty-second placement there is no long
 * version behind it to fill the gaps.
 *
 * THE 15 has its own line ("Books closed by day five. Flat price. First month
 * free. DayFive.") rather than four beats of the ad played fast. A bumper has
 * to work for somebody who has never seen the film, so it states the offer
 * whole and lets the picture carry the mood.
 *
 * ===========================================================================
 * THE BED IS RE-DUCKED, NOT RE-USED
 * ===========================================================================
 * Ducking windows are derived from each cut's OWN layout. The promo card sits
 * at ~40s in the ad and ~22s in the 30 — a copied envelope would duck over
 * silence and swell under a line, which is precisely the failure the computed
 * envelope was built to avoid.
 */
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import timings from "./ad-timings.json";
import { colors } from "./colors";
import { adLayout, BeatVisualForTest } from "./Ad";
import { Bed, Punch } from "./ad/music";
import { BeatPnl, BeatPromo, BeatEndMark, BeatContact } from "./ad/beats";

const FPS = timings.fps;
const f = (s) => Math.round(s * FPS);

const BED = "moving-up-origo.wav";
const PUNCH = "punch-moving-up-origo-106.24s.wav";

/**
 * The thirty, beat by beat, and why each survives.
 *
 *    1  "Receipts everywhere."          the problem, stated once
 *    5  "Books? … Next week. Probably." the wince — the line the film is built
 *                                        around, and the only joke
 *    8  "DayFive does it for you."      the turn
 *    9  "Send the shoebox…"             what the viewer actually has to do
 *   11  "Every transaction sorted…"     the proof, over the P&L assembling
 *   14  the promo card                  the offer
 *   16  "First month free."             the offer, said
 *   17  "Your books. Day five. Done."   the name
 *
 * Dropped: the second and third pain beats (one is enough at this length), the
 * bank (a story the thirty has no room to tell), the checkmark cascade and the
 * insights page (elaborations of beat 11), and the URL/phone holds — a
 * thirty-second placement carries its own click target.
 */
const THIRTY = [1, 5, 8, 9, 11, 14, 16, 17];

/**
 * The fifteen. Picture only from the ad; the narration is the bumper's own.
 *
 * Two plates and two cards: the mess, the pack arriving at the bank, the
 * offer, the name. No dialogue beats — at this length a second voice competing
 * with the bumper line would lose both.
 */
const FIFTEEN = [
  { beat: 2, seconds: 2.6 },    // the receipts spilling
  { beat: 15, seconds: 3.0 },   // the pack across the bank desk
  { beat: 14, seconds: 3.6 },   // the promo card
  { beat: 17, seconds: 3.0 },   // the wordmark and the line
  { beat: 19, seconds: 2.8 },   // the number and the offer
];

/** The bumper's measured narration length — scripts/bumper-vo.mjs printed it. */
const BUMPER_VO = 5.06;

function lay(beatNumbers) {
  const full = adLayout();
  let at = 0;
  return beatNumbers.map((n) => {
    const b = full.find((x) => x.n === n);
    const entry = { ...b, from: at };
    at += b.frames;
    return entry;
  });
}

export const THIRTY_FRAMES = lay(THIRTY).reduce((t, b) => t + b.frames, 0);
export const FIFTEEN_FRAMES = FIFTEEN.reduce((t, b) => t + f(b.seconds), 0);

/** Shared: picture, narration, bed and punch for a list of ad beats. */
function Assembled({ beats, punchBeat = 14 }) {
  const windows = beats
    .filter((b) => b.vo > 0)
    .map((b) => [b.from / FPS, (b.from + f(b.vo)) / FPS]);
  const promo = beats.find((b) => b.n === punchBeat);
  const total = beats.reduce((t, b) => t + b.frames, 0);

  return (
    <>
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

      <Sequence from={0} durationInFrames={total}>
        <Bed track={BED} windows={windows} />
      </Sequence>

      {promo && (
        <Sequence from={promo.from} durationInFrames={total - promo.from}>
          <Punch track={PUNCH} />
        </Sequence>
      )}
    </>
  );
}

export function AdCut30() {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.cream }}>
      <Assembled beats={lay(THIRTY)} />
    </AbsoluteFill>
  );
}

export function AdBumper15() {
  // Laid out on the bumper's own durations, not the ad's — these beats are
  // held for different lengths here than they are in the film.
  let at = 0;
  const beats = FIFTEEN.map(({ beat, seconds }) => {
    const entry = { n: beat, from: at, frames: f(seconds) };
    at += entry.frames;
    return entry;
  });
  const promo = beats.find((b) => b.n === 14);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.cream }}>
      {beats.map((b, i) => (
        <Sequence key={`${b.n}-${i}`} from={b.from} durationInFrames={b.frames}>
          <BeatVisualForTest n={b.n} />
        </Sequence>
      ))}

      {/* One line, from the top. The bumper's whole job is to be understood
          by somebody who has never seen the film. */}
      <Sequence from={f(0.3)} durationInFrames={f(BUMPER_VO) + 2}>
        <Audio src={staticFile("ad-vo/bumper.mp3")} />
      </Sequence>

      <Sequence from={0} durationInFrames={FIFTEEN_FRAMES}>
        <Bed track={BED} windows={[[0.3, 0.3 + BUMPER_VO]]} />
      </Sequence>

      {promo && (
        <Sequence from={promo.from} durationInFrames={FIFTEEN_FRAMES - promo.from}>
          <Punch track={PUNCH} />
        </Sequence>
      )}
    </AbsoluteFill>
  );
}
