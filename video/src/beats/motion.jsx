/**
 * The motion-graphic beats: 3, 5, 6, 7, 8, 9, and the end card that closes 10.
 *
 * Beat 4 lives in PnlScroll.jsx because it is long enough to want its own file;
 * beats 1, 2 and 10's plates come through Broll.jsx. Everything here is drawn
 * from the site's tokens via brand.jsx.
 *
 * TWO BEATS RENDER THE SITE'S OWN SAMPLE PACK — 5 and 6 — for the same reason
 * beat 4 does: a rebuild of the pack would be a second copy of it, and the
 * first client to compare the video against the page would find the difference.
 */
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FiveInsights, ProfitAndLoss } from "@/components/docs/DocPages";
import { pnl, acct } from "@/lib/sample-data";
import { colors, pricing, endCard } from "../config";
import {
  Body, Card, Check, Eyebrow, Headline, Screen, Stage, Wordmark,
  smooth, useFade, useRise,
} from "../brand";

/* ══════════════════════════════════════════════════ BEAT 3 — the turn ═══ */
/**
 * "DayFive works differently. Send us your statements and receipts — a shoebox
 * is fine."
 *
 * The one hard cut in the film. Beat 2 ends on a calendar and this opens on
 * black — the film's only moment of nothing, which is what makes the wordmark
 * land. Then the documents arrive and are ticked off.
 */
export function Beat03Intake() {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;

  // Black → cream at 1.5s. The wordmark carries across the change.
  const toCream = interpolate(t, [1.4, 2.0], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: smooth });

  const markIn = useFade(0.35, 0.7);
  const markLift = interpolate(t, [1.4, 2.2], [0, -330], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: smooth });
  const markScale = interpolate(t, [1.4, 2.2], [1, 0.42], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: smooth });

  const DOCS = [
    "Bank statement — July",
    "Card statement — July",
    "Supplier invoices (14)",
    "Receipts from the shoebox",
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: colors.navy950 }}>
      <AbsoluteFill style={{ backgroundColor: colors.cream, opacity: toCream }} />

      <AbsoluteFill className="items-center justify-center">
        <div
          style={{
            opacity: markIn,
            transform: `translateY(${markLift}px) scale(${markScale})`,
          }}
        >
          <Wordmark size={150} dark={toCream < 0.5} />
        </div>
      </AbsoluteFill>

      <AbsoluteFill className="items-center justify-center">
        <div style={{ width: 980, marginTop: 112 }}>
          {DOCS.map((label, i) => {
            const at = 2.4 + i * 0.42;
            const row = useRise(at, 0.5, 26);
            // The tick draws after the row has arrived, not with it: the
            // document appears, THEN it is accepted. Doing both at once says
            // nothing happened in between.
            const tick = interpolate(t, [at + 0.45, at + 0.95], [0, 1], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: smooth });
            return (
              <div key={label} style={row}>
                <Card className="mb-[18px] flex items-center gap-[26px] px-[38px] py-[26px]">
                  <Check size={46} progress={tick} />
                  <span style={{ fontSize: 34, color: colors.ink }}>{label}</span>
                </Card>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

/* ═══════════════════════════════════ BEAT 5 — a receipt behind every line ═ */
/**
 * "Not a guess — a receipt behind every line."
 *
 * One P&L row lifts out of the sheet and its citation slides in beside it.
 *
 * THE ROW IS NOT DRAWN OVER THE DOCUMENT AT A MEASURED PIXEL OFFSET. The first
 * approach highlighted a band at a fixed y over the scrolled sheet, which is a
 * number that silently stops pointing at the right row the moment the sample
 * data changes. Instead the sheet dims and the row is re-drawn from the SAME
 * `pnl` data the document uses — so it cannot highlight a line that is not
 * there, or the wrong one.
 */
export function Beat05Citation() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // "Materials & parts" — the first cost-of-revenue line, taken from the data
  // rather than typed, so the label and figure are the document's own.
  const [label, monthly] = pnl.cogs[0];

  const dim = interpolate(t, [0.2, 0.9], [0, 0.82], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: smooth });
  const rowIn = useRise(0.7, 0.6, 18);
  const chip = useRise(1.5, 0.7, 0);
  const chipSlide = interpolate(t, [1.5, 2.2], [70, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: smooth });

  return (
    <Screen>
      {/* The real sheet, held still and dimmed back. */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start" }}>
        <div style={{ width: 1180, height: 1180 * 1.41421356, marginTop: -420 }}>
          <ProfitAndLoss />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: colors.cream, opacity: dim }} />

      <AbsoluteFill className="items-center justify-center">
        <div style={{ width: 1180 }}>
          <div style={rowIn}>
            <Card className="flex items-center px-[44px] py-[34px]">
              <span style={{ fontSize: 38, color: colors.ink }}>{label}</span>
              <span
                aria-hidden
                style={{
                  flex: 1,
                  margin: "0 26px 10px",
                  borderBottom: `2px dotted ${colors.ink500}`,
                }}
              />
              <span
                className="tnum"
                style={{ fontSize: 38, fontWeight: 700, color: colors.ink }}
              >
                {acct(monthly)}
              </span>
            </Card>
          </div>

          <div
            style={{
              ...chip,
              transform: `translateX(${chipSlide}px)`,
              marginTop: 26,
              marginLeft: 120,
            }}
          >
            <Card
              className="inline-flex items-center gap-[22px] px-[34px] py-[24px]"
              style={{ border: `1.5px solid ${colors.cream300}` }}
            >
              <Check size={38} progress={1} />
              <span style={{ fontSize: 28, color: colors.ink600 }}>
                Supplier invoice · matched to the card charge · on file
              </span>
            </Card>
          </div>
        </div>
      </AbsoluteFill>
    </Screen>
  );
}

/* ════════════════════════════════════════ BEAT 6 — day five, every month ═ */
/**
 * "By the fifth business day, your books are closed: a P&L, a balance sheet,
 * and five plain-English insights…"
 *
 * The site's own insights page, then the promise over it.
 */
export function Beat06Insights() {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;

  const sheetIn = useFade(0, 0.5);
  const rise = interpolate(t, [0.4, 4.5], [40, -250], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: smooth });

  const veil = interpolate(t, [7.2, 8.2], [0, 0.9], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: smooth });
  const line = useRise(7.8, 0.7, 26);

  return (
    <Screen>
      <AbsoluteFill
        style={{ alignItems: "center", justifyContent: "flex-start",
                 opacity: sheetIn, overflow: "hidden" }}
      >
        <div
          style={{
            width: 1180,
            height: 1180 * 1.41421356,
            transform: `translateY(${rise}px)`,
            boxShadow:
              "0 2px 5px rgb(20 30 48 / 0.07), 0 22px 50px -16px rgb(20 30 48 / 0.24)",
          }}
        >
          <FiveInsights />
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ backgroundColor: colors.cream, opacity: veil }} />
      <Stage>
        <div style={line}>
          <Headline size={104}>Day five. Every month.</Headline>
        </div>
      </Stage>
    </Screen>
  );
}

/* ═══════════════════════════════════════════════ BEAT 7 — ask any day ═══ */
/**
 * "Have a question about your numbers? Ask any day. You'll get a written
 * answer — from your actual books."
 *
 * A question and an answer, as they would actually be written. NOT a mock
 * product screen: there is no DayFive app, and drawing one would promise a
 * thing that does not exist. Two cards in the brand's own type promise nothing
 * but what the sentence already says.
 */
export function Beat07Question() {
  const q = useRise(0.3, 0.6, 26);
  const a = useRise(2.1, 0.7, 26);
  const stamp = useFade(3.2, 0.6);

  return (
    <Screen>
      <Stage className="!px-[180px]">
        <div style={{ textAlign: "left" }}>
          <div style={q}>
            <Card
              className="mb-[34px] px-[48px] py-[38px]"
              style={{ backgroundColor: colors.creamTint, boxShadow: "none",
                       border: `1.5px solid ${colors.cream300}` }}
            >
              <Eyebrow style={{ fontSize: 22 }}>You, on a Tuesday</Eyebrow>
              <p style={{ fontSize: 40, lineHeight: 1.3, color: colors.ink,
                          marginTop: 14 }}>
                “Can I afford to take on another van this quarter?”
              </p>
            </Card>
          </div>

          <div style={a}>
            <Card className="px-[48px] py-[38px]">
              <Eyebrow style={{ fontSize: 22 }}>DayFive, from your books</Eyebrow>
              <p style={{ fontSize: 36, lineHeight: 1.4, color: colors.ink600,
                          marginTop: 14 }}>
                A written answer, with the figures it rests on — and the entries
                behind every figure.
              </p>
              <p style={{ ...stampStyle, opacity: stamp }}>
                Answered from the July close · every number cited
              </p>
            </Card>
          </div>
        </div>
      </Stage>
    </Screen>
  );
}

const stampStyle = {
  marginTop: 26,
  fontSize: 25,
  color: colors.goldOnLight,
  fontWeight: 700,
  letterSpacing: "0.04em",
};

/* ═══════════════════════════════════════════════════ BEAT 8 — the price ═ */
/**
 * "One flat monthly price. No hourly meters. No surprise invoices. And your
 * first close is free."
 *
 * EVERY NUMBER ON THIS BEAT COMES FROM config.js. When Essentials moves off
 * $450 or the fall offer ends, this beat changes by re-rendering — nobody
 * opens an editor, and no stale price survives in a frame somebody forgot.
 * The offer line disappears entirely when `active` is false, rather than
 * leaving an expired promise on screen.
 */
export function Beat08Price() {
  const price = useRise(0.3, 0.7, 30);
  const flat = useRise(1.5, 0.6, 22);
  const offer = useRise(3.4, 0.7, 26);
  const free = useRise(4.6, 0.6, 22);

  return (
    <Screen>
      <Stage>
        <div style={price}>
          <Headline size={150}>{pricing.essentials}</Headline>
        </div>
        <div style={flat}>
          <Body size={44} style={{ marginTop: 22 }}>{pricing.flatLine}</Body>
        </div>

        {pricing.offer.active && (
          <div style={offer}>
            <div
              className="mx-auto mt-[62px] inline-block rounded-[14px] px-[46px] py-[26px]"
              style={{ backgroundColor: colors.navy900 }}
            >
              <span style={{ fontSize: 42, fontWeight: 700,
                             color: colors.goldOnDark }}>
                {pricing.offer.line}
              </span>
            </div>
          </div>
        )}

        <div style={free}>
          <Body size={38} style={{ marginTop: 44, color: colors.ink }}>
            {pricing.firstCloseFree}
          </Body>
        </div>
      </Stage>
    </Screen>
  );
}

/* ═════════════════════════════════════════════════════ BEAT 9 — yours ═══ */
/** "Your books, always yours — export everything, cancel anytime." */
export function Beat09Yours() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const card = useRise(0.2, 0.6, 24);
  // The sheet slides down and out of the card: an export, drawn once.
  const slide = interpolate(t, [1.0, 2.2], [0, 210], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: smooth });
  const sheetFade = interpolate(t, [1.0, 1.4, 2.4], [0, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const word = useRise(2.4, 0.7, 30);

  return (
    <Screen>
      <AbsoluteFill className="items-center justify-center">
        <div style={{ ...card, position: "relative" }}>
          <Card className="px-[70px] py-[54px]">
            <span style={{ fontSize: 36, color: colors.ink600 }}>
              Your books, your statements, your documents
            </span>
          </Card>
          <div
            style={{
              position: "absolute", left: "50%", top: "100%",
              transform: `translate(-50%, ${slide}px)`,
              opacity: sheetFade,
            }}
          >
            <div
              style={{
                width: 150, height: 196, backgroundColor: "#fff",
                border: `1.5px solid ${colors.cream300}`, borderRadius: 8,
                boxShadow: "0 12px 28px -12px rgb(20 30 48 / 0.35)",
              }}
            />
          </div>
        </div>
      </AbsoluteFill>

      <Stage>
        <div style={{ ...word, marginTop: 420 }}>
          <Headline size={128}>Yours.</Headline>
        </div>
      </Stage>
    </Screen>
  );
}

/* ═══════════════════════════════════════════════════ BEAT 10 — the card ═ */
/**
 * The end card. Everything on it is config: the line, the URL, the phone.
 *
 * It follows the workshop plate rather than sitting over it — a phone glowing
 * in the dark and a contact card want different amounts of attention, and
 * stacking them means neither gets any.
 */
export function Beat10EndCard() {
  const mark = useRise(0.15, 0.7, 24);
  const line = useRise(0.75, 0.7, 24);
  const meta = useRise(1.5, 0.7, 20);
  const rule = useFade(1.3, 0.8);

  return (
    <Screen dark>
      <Stage>
        <div style={mark}>
          <Wordmark size={132} dark />
        </div>
        <div style={line}>
          <Headline size={78} dark style={{ marginTop: 40 }}>
            {endCard.line}
          </Headline>
        </div>
        <div
          style={{
            opacity: rule, height: 1.5, width: 300, margin: "56px auto 0",
            backgroundColor: colors.goldOnDark,
          }}
        />
        <div style={meta}>
          <p style={{ fontSize: 40, color: colors.mist, marginTop: 46,
                      letterSpacing: "0.01em" }}>
            {endCard.url}
          </p>
          <p style={{ fontSize: 32, color: "#9db0ca", marginTop: 16 }}>
            {endCard.phone}
          </p>
        </div>
      </Stage>
    </Screen>
  );
}
