/**
 * The compositions. Beat 4 first, because it is the one the operator asked to
 * see rendered before anything else is built:
 *
 *   "Report with the two voice takes + one rendered beat (the P&L scroll) for
 *    approval before the full render."
 *
 * Everything is registered at the master's 1920x1080 / 30fps. The 9:16 and the
 * cutdowns arrive as their own compositions rather than as crops of this one.
 */
import { Composition } from "remotion";
import { MASTER } from "./config";
import { BEATS, estimateSeconds } from "./script";
import PnlScroll from "./beats/PnlScroll";
import "./style.css";

/** A beat's length from its own line, until real audio replaces the estimate. */
const beatFrames = (n, pad = 0.9) => {
  const beat = BEATS.find((b) => b.n === n);
  return Math.round((estimateSeconds(beat.text) + pad) * MASTER.fps);
};

export const Root = () => (
  <>
    <Composition
      id="Beat04-PnlScroll"
      component={PnlScroll}
      durationInFrames={beatFrames(4)}
      fps={MASTER.fps}
      width={MASTER.width}
      height={MASTER.height}
    />
  </>
);
