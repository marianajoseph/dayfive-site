/**
 * The ad's motion beats. Eleven of the nineteen; the other eight are plates.
 *
 * Faster and brighter than v1's beats by construction, not by grading:
 * entrances are ~0.35s rather than ~0.6s, things arrive on a small overshoot
 * instead of a smoothstep, and nothing holds still for longer than its beat.
 *
 * WHERE IT REUSES THE SITE, IT REUSES THE SITE. The P&L assembles from
 * lib/sample-data's own `pnl`, the insights page is the site's <FiveInsights />,
 * and the promo card reads lib/pricing.js. Nothing numeric is typed here.
 */
import { AbsoluteFill, interpolate, spring, useCurrentFrame,
         useVideoConfig } from "remotion";
import { FiveInsights } from "@/components/docs/DocPages";
import { pnl, usd } from "@/lib/sample-data";
import { OFFER, PLAN, TERMS } from "@/lib/pricing";
import { colors } from "../colors";
import { brand, endCard } from "../config";
import { Card, Check, Eyebrow, Headline, Screen, Stage, Wordmark,
         useContentWidth } from "../brand";

/** The ad's entrance: quick, with a little overshoot. v1's had neither. */
function pop(frame, fps, delay = 0, damping = 13) {
  return spring({ frame: frame - delay * fps, fps,
                  config: { damping, mass: 0.6, stiffness: 140 } });
}

/* ═══════════════════════════════════════ BEAT 4 — tabs and sticky notes ══ */
/**
 * "Fourteen spreadsheet tabs; sticky notes multiplying."
 *
 * Kinetic type rather than a screenshot of a spreadsheet: a real one would
 * need legible cell contents, and inventing a client's numbers to fill them is
 * exactly what the pack's controls exist to prevent. Tabs are shapes with
 * names; the joke is the count, and the count is on screen.
 */
export function BeatTabs() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const TABS = ["Jan", "Jan (2)", "Jan FINAL", "Feb", "Feb v2", "Q1", "Q1 old",
                "copy", "copy 2", "receipts", "receipts?", "TAXES", "new",
                "new new"];
  return (
    <Screen style={{ backgroundColor: "#fff" }}>
      <AbsoluteFill style={{ padding: "90px 70px", alignContent: "flex-start",
                             display: "flex", flexWrap: "wrap", gap: 14 }}>
        {TABS.map((t, i) => {
          const p = pop(frame, fps, 0.06 * i, 11);
          return (
            <div key={t}
                 style={{ opacity: p, transform: `scale(${0.85 + p * 0.15})`,
                          backgroundColor: i % 3 === 0 ? colors.creamTint : colors.cream,
                          border: `2px solid ${colors.cream300}`,
                          borderRadius: "10px 10px 0 0",
                          padding: "16px 26px", fontSize: 30,
                          color: colors.ink600 }}>
              {t}
            </div>
          );
        })}
      </AbsoluteFill>

      {/* Sticky notes multiplying over the top. */}
      <AbsoluteFill>
        {[[210, 520, -8], [640, 700, 6], [1180, 480, -4], [1520, 760, 9],
          [900, 300, 3]].map(([x, y, rot], i) => {
          const p = pop(frame, fps, 0.8 + 0.12 * i, 10);
          return (
            <div key={i}
                 style={{ position: "absolute", left: x, top: y,
                          width: 200, height: 190,
                          transform: `rotate(${rot}deg) scale(${p})`,
                          backgroundColor: "#f6e6a8",
                          boxShadow: "0 12px 26px -10px rgb(20 30 48 / 0.4)" }} />
          );
        })}
      </AbsoluteFill>
    </Screen>
  );
}

/* ══════════════════════════════════════ BEAT 8 — the snap to bright ═════ */
/** "DayFive does it for you." Navy wipes away and the wordmark lands. */
export function BeatSnap() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const wipe = interpolate(frame, [0, 0.28 * fps], [0, 1], {
    extrapolateRight: "clamp" });
  const p = pop(frame, fps, 0.2, 12);
  return (
    <Screen>
      <AbsoluteFill style={{ backgroundColor: colors.navy950,
                             transform: `translateY(${-wipe * 100}%)` }} />
      <Stage>
        <div style={{ transform: `scale(${0.9 + p * 0.1})`, opacity: p }}>
          <Wordmark size={168} />
        </div>
      </Stage>
    </Screen>
  );
}

/* ═══════════════════════════════ BEATS 9 & 10 — intake and checkmarks ═══ */
const DOCS = ["Bank statement", "Card statement", "Supplier invoices",
              "Receipts", "Fuel receipts", "Payroll summary"];

/** "Send the shoebox — we'll do the rest." Documents fly into a clean list. */
export function BeatIntake() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const listWidth = useContentWidth(1120);
  return (
    <Screen>
      <AbsoluteFill className="items-center justify-center">
        <div style={{ width: listWidth }}>
          {DOCS.map((d, i) => {
            const p = pop(frame, fps, 0.08 * i, 12);
            return (
              <div key={d}
                   style={{ opacity: p,
                            transform: `translateX(${(1 - p) * (i % 2 ? 340 : -340)}px)` }}>
                <Card className="mb-[14px] flex items-center gap-[24px] px-[34px] py-[22px]">
                  <div style={{ width: 34, height: 44, borderRadius: 4,
                                backgroundColor: colors.cream,
                                border: `2px solid ${colors.cream300}` }} />
                  <span style={{ fontSize: 32, color: colors.ink }}>{d}</span>
                </Card>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </Screen>
  );
}

/** Checkmarks cascading down the same list. Picture only. */
export function BeatChecks() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const listWidth = useContentWidth(1120);
  return (
    <Screen>
      <AbsoluteFill className="items-center justify-center">
        <div style={{ width: listWidth }}>
          {DOCS.map((d, i) => {
            const t = interpolate(frame, [i * 0.1 * fps, (i * 0.1 + 0.3) * fps],
                                  [0, 1], { extrapolateLeft: "clamp",
                                            extrapolateRight: "clamp" });
            return (
              <Card key={d}
                    className="mb-[14px] flex items-center gap-[24px] px-[34px] py-[22px]">
                <Check size={40} progress={t} />
                <span style={{ fontSize: 32, color: colors.ink,
                               opacity: 0.45 + t * 0.55 }}>{d}</span>
              </Card>
            );
          })}
        </div>
      </AbsoluteFill>
    </Screen>
  );
}

/* ═════════════════════════════════════ BEAT 11 — the P&L, assembling ═══ */
/**
 * "Every transaction sorted. Every account reconciled."
 *
 * The lines arrive one at a time and their figures COUNT UP to the real
 * values from lib/sample-data. The counter interpolates toward the true
 * number and lands exactly on it — a count-up that stops on a rounded
 * approximation is a number the pack does not contain.
 */
export function BeatPnl() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rows = [...pnl.revenue, ...pnl.cogs];
  const pnlWidth = useContentWidth(1280);

  return (
    <Screen>
      <AbsoluteFill className="items-center justify-center">
        <div style={{ width: pnlWidth }}>
          <Eyebrow style={{ fontSize: 24, marginBottom: 18 }}>
            Profit &amp; Loss · assembling
          </Eyebrow>
          {rows.map(([label, monthly], i) => {
            const at = 0.1 * i;
            const p = pop(frame, fps, at, 13);
            const c = interpolate(frame, [(at + 0.15) * fps, (at + 0.75) * fps],
                                  [0, monthly],
                                  { extrapolateLeft: "clamp",
                                    extrapolateRight: "clamp" });
            return (
              <div key={label}
                   style={{ opacity: p, display: "flex", alignItems: "baseline",
                            padding: "11px 0",
                            borderBottom: `1px solid ${colors.cream200}` }}>
                <span style={{ fontSize: 31, color: colors.ink }}>{label}</span>
                <span style={{ flex: 1, margin: "0 20px 8px",
                               borderBottom: `2px dotted ${colors.ink500}` }} />
                <span className="tnum"
                      style={{ fontSize: 31, fontWeight: 700, color: colors.ink }}>
                  {usd(Math.round(c))}
                </span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </Screen>
  );
}

/* ═════════════════════════════════════════ BEAT 12 — the insights page ══ */
/** "Clean books, on the fifth of every month." The site's own page. */
export function BeatInsights() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(frame, fps, 0, 14);
  return (
    <Screen>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start",
                             overflow: "hidden" }}>
        <div style={{ width: 1040, height: 1040 * 1.41421356,
                      marginTop: interpolate(frame, [0, fps * 3], [10, -180],
                                             { extrapolateRight: "clamp" }),
                      transform: `scale(${0.94 + p * 0.06})`,
                      boxShadow: "0 2px 5px rgb(20 30 48 / 0.07), " +
                                 "0 22px 50px -16px rgb(20 30 48 / 0.24)" }}>
          <FiveInsights />
        </div>
      </AbsoluteFill>
    </Screen>
  );
}

/* ═══════════════════════════════════════ BEAT 13 — the calendar snaps ══ */
/** Business days one to five; five lands in gold. Picture only. */
export function BeatCalendar() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Screen>
      <Stage>
        <div style={{ display: "flex", gap: 22, justifyContent: "center" }}>
          {[1, 2, 3, 4, 5].map((d, i) => {
            const p = pop(frame, fps, 0.09 * i, 11);
            const isFive = d === 5;
            return (
              <div key={d}
                   style={{ width: 170, height: 170, borderRadius: 22,
                            transform: `scale(${isFive ? 0.9 + p * 0.25 : p})`,
                            backgroundColor: isFive ? colors.goldOnDark : "#fff",
                            border: `2px solid ${colors.cream300}`,
                            display: "flex", alignItems: "center",
                            justifyContent: "center",
                            fontFamily: "var(--font-display)",
                            fontSize: 78, fontWeight: 600,
                            color: isFive ? colors.navy950 : colors.ink500 }}>
                {d}
              </div>
            );
          })}
        </div>
      </Stage>
    </Screen>
  );
}

/* ═══════════════════════════════════════════ BEAT 14 — the promo card ══ */
/**
 * The card slams in, full frame, three seconds.
 *
 * EVERY FIGURE READS lib/pricing.js. The operator's brief said so explicitly —
 * "driven by lib/pricing.js, never typed" — and the reason is on the record:
 * the v1 film rendered $450/month for a week after the site moved to $299,
 * because its config carried its own copy.
 */
export function BeatPromo() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slam = pop(frame, fps, 0, 9);
  const line2 = pop(frame, fps, 0.28, 11);
  return (
    <Screen dark style={{ backgroundColor: colors.navy950 }}>
      <Stage>
        <div style={{ transform: `scale(${0.8 + slam * 0.2})`, opacity: slam }}>
          <Eyebrow dark style={{ fontSize: 30 }}>Fall offer</Eyebrow>
          <Headline size={128} dark style={{ marginTop: 26 }}>
            {OFFER.price}/mo
          </Headline>
          <p style={{ fontSize: 46, color: colors.mist, marginTop: 10 }}>
            your first year
          </p>
        </div>
        <div style={{ transform: `scale(${0.9 + line2 * 0.1})`, opacity: line2 }}>
          <div style={{ height: 2, width: 260, margin: "44px auto",
                        backgroundColor: colors.goldOnDark }} />
          <p style={{ fontSize: 58, fontWeight: 700, color: colors.goldOnDark }}>
            {TERMS.firstMonthFree.replace(/\.$/, "").toUpperCase()}
          </p>
          <p style={{ fontSize: 30, color: "#9db0ca", marginTop: 22 }}>
            then {PLAN.price}{PLAN.period} · {TERMS.cancelAnytime}
          </p>
        </div>
      </Stage>
    </Screen>
  );
}

/* ══════════════════════════════════════════════ BEATS 17–19 — the CTA ══ */
export function BeatEndMark() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const m = pop(frame, fps, 0, 13);
  const l = pop(frame, fps, 0.3, 13);
  return (
    <Screen dark>
      <Stage>
        <div style={{ transform: `scale(${0.92 + m * 0.08})`, opacity: m }}>
          <Wordmark size={146} dark />
        </div>
        <div style={{ opacity: l }}>
          <Headline size={82} dark style={{ marginTop: 40 }}>
            {endCard.line}
          </Headline>
        </div>
      </Stage>
    </Screen>
  );
}

/** getdayfive.com, held long enough to type. */
export function BeatUrl() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(frame, fps, 0, 14);
  return (
    <Screen dark>
      <Stage>
        <div style={{ transform: `scale(${0.94 + p * 0.06})`, opacity: p }}>
          <Headline size={96} dark>{brand.url}</Headline>
        </div>
      </Stage>
    </Screen>
  );
}

/** The number, and the offer under it. */
export function BeatContact() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(frame, fps, 0, 14);
  const o = pop(frame, fps, 0.3, 12);
  return (
    <Screen dark>
      <Stage>
        <div style={{ opacity: p }}>
          <Headline size={78} dark>{brand.phone}</Headline>
        </div>
        <div style={{ opacity: o }}>
          <p style={{ fontSize: 50, fontWeight: 700, color: colors.goldOnDark,
                      marginTop: 40 }}>
            {TERMS.firstMonthFree}
          </p>
        </div>
      </Stage>
    </Screen>
  );
}
