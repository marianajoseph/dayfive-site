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
