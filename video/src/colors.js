/**
 * Brand colours as JS literals, for the handful of places that need a colour
 * in JavaScript — an SVG fill, an interpolated background, a gradient string.
 *
 * SEPARATE FROM config.js ON PURPOSE. config.js imports the site's pricing
 * through Remotion's `@` alias, which only webpack resolves; plain node cannot.
 * scripts/check-tokens.mjs runs under plain node, so when the prices moved into
 * config.js the colour check stopped being able to import it and silently
 * stopped guarding anything.
 *
 * A file that a guard needs to read must not depend on a bundler. This one has
 * no imports at all, which is the property that matters.
 *
 * Every value here is checked against app/globals.css by check-tokens.mjs.
 */
export const colors = {
  cream: "#f7f3ea",
  creamTint: "#f1e9db",
  cream200: "#e9dfcd",
  cream300: "#dbcfb7",
  navy950: "#050c17",
  navy900: "#081426",
  ink: "#0e1c31",
  ink600: "#36434f",
  ink500: "#626d7e",
  goldOnDark: "#d9ae52",
  goldOnLight: "#8a6a20",
  mist: "#e6edf7",
};
