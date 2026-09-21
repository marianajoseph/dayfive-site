/**
 * Import licensed tracks from staging into assets/, keeping the licence trail.
 *
 *   node scripts/import-music.mjs
 *
 * Remotion's staticFile() has to survive spaces, commas and apostrophes in a
 * URL, and these filenames have all three. But the ORIGINAL filename is the
 * licence trail — it carries the library, the artist and the track title, and
 * it is what a LICENSE.txt entry can be matched against. So the files are
 * copied under slugs and sources.json records where each came from.
 *
 * ===========================================================================
 * THREE BUGS THIS FILE EXISTS BECAUSE OF
 * ===========================================================================
 * It replaced a throwaway script, after that script lost data twice.
 *
 *   1. COLLISION. The first slugger truncated to 48 characters from the
 *      front. Two stinger filenames identical for sixty characters, differing
 *      only at "02" versus "09", collapsed to one slug and the second
 *      overwrote the first. Truncation now keeps the distinguishing tail, and
 *      a collision is REFUSED rather than resolved.
 *
 *   2. PROVENANCE REPLACED, NOT MERGED. The second run rebuilt sources.json
 *      from whatever was in staging — and staging had been emptied and
 *      refilled with different tracks, so the first three tracks' originals
 *      were erased while their WAVs sat in assets/ beside the record that no
 *      longer described them. Recovered from git. It merges now, and a slug
 *      already present with a DIFFERENT original is an error, not an update.
 *
 *   3. DOUBLE EXTENSION. ".wav" was only stripped as part of the Epidemic
 *      Sound suffix, so tracks named "- Artist.wav" slugged to "-wav.wav".
 *      The extension is stripped on its own now.
 *
 * All three are the same shape: a convenience script handling the data that
 * proves what we are allowed to use. The licence record is not a by-product.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { STAGING } from "./spend-log.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(STAGING, "music");
const DST = path.resolve(HERE, "..", "assets", "music");
const MAP = path.join(DST, "sources.json");
const LIBRARY = "Epidemic Sound Pro";

/**
 * Parse the library's licence note, if one is beside the tracks.
 *
 * Blocks separated by a blank line, "Key: value" per line. The Epidemic ID is
 * the thing that actually proves the licence — a filename can be renamed, an
 * ID cannot — so it is folded into sources.json beside the original name.
 *
 * Matched on TRACK TITLE rather than filename, because the note is written by
 * a person and the filename by a download. "Let's go!" in the note is
 * "Let's Go!" in the filename, so the comparison is loose on case and
 * punctuation and would rather miss than mis-attribute an ID.
 */
function readLicences(dir) {
  const file = fs.readdirSync(dir).find((f) => /licen[cs]e/i.test(f) && /\.txt$/i.test(f));
  if (!file) return [];
  const text = fs.readFileSync(path.join(dir, file), "utf8");
  return text.split(/\n\s*\n/).map((block) => {
    const fields = {};
    for (const line of block.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Za-z ]+):\s*(.+?)\s*$/);
      if (m) fields[m[1].trim().toLowerCase()] = m[2];
    }
    return fields;
  }).filter((f) => f.track);
}

const loose = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, "");

function slug(name) {
  const base = name
    .replace(/\.(wav|mp3|aiff?)$/i, "")          // extension first, on its own
    .replace(/^ES_/i, "")
    .replace(/ - Epidemic Sound$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const ext = path.extname(name).toLowerCase() || ".wav";
  if (base.length <= 52) return base + ext;
  // Head reads; tail distinguishes. These names differ at the end.
  return `${base.slice(0, 30)}--${base.slice(-18)}${ext}`;
}

function main() {
  if (!fs.existsSync(SRC)) {
    console.error(`no music in ${SRC}`);
    process.exit(1);
  }
  fs.mkdirSync(DST, { recursive: true });

  // MERGE. Tracks imported earlier may no longer be in staging, and their
  const licences = readLicences(SRC);
  if (licences.length) console.log(`licence note: ${licences.length} entries\n`);

  // record is the only thing left describing the file in assets/.
  const map = fs.existsSync(MAP) ? JSON.parse(fs.readFileSync(MAP, "utf8")) : {};
  const bySlug = new Map(Object.entries(map));
  let added = 0;

  for (const f of fs.readdirSync(SRC).filter((f) => /\.(wav|mp3|aiff?)$/i.test(f))) {
    const s = slug(f);
    const existing = bySlug.get(s);
    if (existing && existing.original !== f) {
      console.error(
        `REFUSED: "${f}"\n  slugs to ${s}, which already belongs to ` +
        `"${existing.original}".\n  Nothing was written.`
      );
      process.exit(1);
    }
    const lic = licences.find((l) => loose(f).includes(loose(l.track)));
    const record = { original: f, library: LIBRARY };
    if (lic) {
      record.track = lic.track;
      record.artist = lic.artist;
      record.epidemicId = lic["epidemic id"] ?? null;
      record.licence = lic.licence ?? null;
      record.use = lic.use ?? null;
    }
    fs.copyFileSync(path.join(SRC, f), path.join(DST, s));
    if (!existing) added += 1;
    bySlug.set(s, record);
    console.log(
      `${existing ? "=" : "+"} ${s}\n    ${f}` +
      (lic ? `\n    id ${record.epidemicId}` : "\n    NO LICENCE ENTRY MATCHED")
    );
  }
  const merged = Object.fromEntries([...bySlug.entries()].sort());
  fs.writeFileSync(MAP, JSON.stringify(merged, null, 2) + "\n", "utf8");

  // Every slug in the record must still have a file. A record describing a
  // track nobody can play is the other half of a file nobody can identify.
  //
  // --prune drops those records DELIBERATELY. It is a flag rather than
  // automatic behaviour because the record is the licence trail: dropping one
  // silently is how you end up with a track in a film and nothing on disk
  // saying where it came from.
  const orphans = Object.keys(merged).filter(
    (s) => !fs.existsSync(path.join(DST, s))
  );
  if (orphans.length && process.argv.includes("--prune")) {
    for (const s of orphans) {
      console.log(`- pruned ${s}\n    was: ${merged[s].original}`);
      delete merged[s];
    }
    fs.writeFileSync(MAP, JSON.stringify(merged, null, 2) + "\n", "utf8");
  } else if (orphans.length) {
    console.error(
      `\nRECORDED BUT MISSING:\n` +
      orphans.map((s) => `  ${s}\n    ${merged[s].original}`).join("\n") +
      `\n\nRe-import them, or --prune to drop the records.`
    );
    process.exit(1);
  }

  console.log(
    `\n${added} new, ${Object.keys(merged).length} tracks recorded in ` +
    `${path.basename(MAP)} — every one with a file beside it.`
  );
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main();
