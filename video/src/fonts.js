/**
 * The site's two faces, without Next.
 *
 * app/layout.js loads Fraunces and Manrope through next/font/google and hands
 * the result to Tailwind as --font-fraunces / --font-manrope. Remotion has no
 * Next, so the same two families are loaded here and the same two variables are
 * set — the components downstream neither know nor care which loaded them.
 *
 * waitForFonts() is awaited before any frame is rendered. A Remotion render
 * does not wait for a webfont on its own: it screenshots the frame, and a frame
 * screenshotted mid-swap shows the fallback serif. On a brand video that is not
 * a subtle difference.
 */
import { continueRender, delayRender } from "remotion";
import { loadFont as loadFraunces } from "@remotion/google-fonts/Fraunces";
import { loadFont as loadManrope } from "@remotion/google-fonts/Manrope";

const fraunces = loadFraunces("normal", { weights: ["600", "700"] });
const manrope = loadManrope("normal", { weights: ["400", "600", "700"] });

export const FONT_VARS = {
  "--font-fraunces": fraunces.fontFamily,
  "--font-manrope": manrope.fontFamily,
};

export const waitForFonts = () =>
  Promise.all([fraunces.waitUntilDone(), manrope.waitUntilDone()]);

/**
 * APPLIED, not merely loaded.
 *
 * The site sets --font-fraunces and --font-manrope through next/font; nothing
 * sets them here, so `var(--font-fraunces)` resolved to nothing and every
 * headline in the film silently fell back to the sans. It rendered, it looked
 * deliberate, and it was the wrong typeface on a brand video — the failure
 * mode of a CSS variable that is read but never written.
 *
 * Set on :root at module load, so any composition that imports this module
 * gets them, whether it is the master or one beat rendered on its own.
 */
if (typeof document !== "undefined") {
  for (const [name, value] of Object.entries(FONT_VARS)) {
    document.documentElement.style.setProperty(name, value);
  }
}

/**
 * HOLD THE FIRST FRAME UNTIL THE FACES ARE READY.
 *
 * A Remotion render does not wait for a webfont on its own — it screenshots
 * the frame and moves on, so an early frame can go out in the fallback serif
 * while every later one is Fraunces. One frame in the wrong face, in the middle
 * of a brand film, is the kind of defect that only shows up when somebody
 * scrubs.
 */
const handle = delayRender("loading Fraunces and Manrope");
waitForFonts().then(() => continueRender(handle)).catch(() => continueRender(handle));
