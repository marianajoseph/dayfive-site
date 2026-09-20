/**
 * The compositions.
 *
 * Master is the deliverable; the individual beats stay registered because
 * rendering one beat to look at it is the loop this was built for — a 9-second
 * render answers "does that read?" and an 86-second one does not.
 */
/**
 * V1 — THE CALM FILM. Kept, not deleted.
 *
 * Operator, 2026-09-20: the master was "approved as craft but rejected as an
 * ad — too slow, too calm, too premium for our buyer… Keep the old master as
 * v1 in the repo — it's a good film for a different audience."
 *
 * So it stays whole and renderable: Master.jsx, Cutdown.jsx, the beats in
 * motion.jsx, the timings, the Sarah takes. The 60-second ad is a NEW set of
 * compositions beside these, not an edit of them — rebuilding in place would
 * destroy the thing that was judged good at what it does.
 *
 * Its audience is somebody already considering us: a page, a proposal, an
 * onboarding email. The ad's audience is somebody scrolling past.
 *
 * Renders are named dayfive-explainer-v1-*.mp4 in staging.
 */
import { Composition } from "remotion";
import { MASTER } from "./config";
import timings from "./timings.json";
import Master, { MASTER_FRAMES, layout } from "./Master";
import Cutdown, { CUTDOWN_FRAMES } from "./Cutdown";
import Ad, { AD_FRAMES } from "./Ad";
import PnlScroll from "./beats/PnlScroll";
import {
  Beat03Intake, Beat05Citation, Beat06Insights, Beat07Question,
  Beat08Price, Beat09Yours, Beat10EndCard,
} from "./beats/motion";
import "./style.css";

const frames = (n) => {
  const b = layout().find((x) => x.n === n);
  return b.frames;
};

const beat = (id, component, n) => (
  <Composition
    id={id}
    component={component}
    durationInFrames={frames(n)}
    fps={MASTER.fps}
    width={MASTER.width}
    height={MASTER.height}
  />
);

export const Root = () => (
  <>
    {/* The ad — the deliverable. v1 sits below it, kept. */}
    <Composition
      id="Ad60"
      component={Ad}
      durationInFrames={AD_FRAMES}
      fps={MASTER.fps}
      width={MASTER.width}
      height={MASTER.height}
    />
    <Composition
      id="MasterV1"
      component={Master}
      durationInFrames={MASTER_FRAMES}
      fps={MASTER.fps}
      width={MASTER.width}
      height={MASTER.height}
    />
    <Composition
      id="CutdownV1-30"
      component={Cutdown}
      durationInFrames={CUTDOWN_FRAMES}
      fps={MASTER.fps}
      width={MASTER.width}
      height={MASTER.height}
    />
    {beat("Beat03-Intake", Beat03Intake, 3)}
    {beat("Beat04-PnlScroll", PnlScroll, 4)}
    {beat("Beat05-Citation", Beat05Citation, 5)}
    {beat("Beat06-Insights", Beat06Insights, 6)}
    {beat("Beat07-Question", Beat07Question, 7)}
    {beat("Beat08-Price", Beat08Price, 8)}
    {beat("Beat09-Yours", Beat09Yours, 9)}
    {beat("Beat10-EndCard", Beat10EndCard, 10)}
  </>
);
