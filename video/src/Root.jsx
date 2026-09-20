/**
 * The compositions.
 *
 * Master is the deliverable; the individual beats stay registered because
 * rendering one beat to look at it is the loop this was built for — a 9-second
 * render answers "does that read?" and an 86-second one does not.
 */
import { Composition } from "remotion";
import { MASTER } from "./config";
import timings from "./timings.json";
import Master, { MASTER_FRAMES, layout } from "./Master";
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
    <Composition
      id="Master"
      component={Master}
      durationInFrames={MASTER_FRAMES}
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
