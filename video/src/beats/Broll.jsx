/**
 * A Veo plate, with whatever the beat needs written over it in brand type.
 *
 * MUTED, ALWAYS. veo-3.1-fast will not accept `generateAudio: false`, so every
 * clip arrives with an invented audio track. The film carries Sarah's
 * narration; room tone the model imagined underneath it is a third layer
 * nobody asked for.
 *
 * COVER, NOT CONTAIN. The plates are 1920x1080 and so is the master, so this
 * is normally a no-op — but if a plate is ever regenerated at another size,
 * covering crops it rather than letterboxing it, and a black bar in the middle
 * of a brand film is worse than a tighter frame.
 */
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile,
         useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../config";
import { smooth } from "../brand";

export default function Broll({ src, children, ken = 0, tint = 0, startFrom = 0 }) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // A very slow push, only when asked for. The plates already move.
  const scale = 1 + (ken * frame) / durationInFrames;

  // Fade from and to the cream page, so cuts into motion graphics are soft.
  const edge = 0.45 * fps;
  const cover = interpolate(
    frame,
    [0, edge, durationInFrames - edge, durationInFrames],
    [1, 0, 0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: smooth }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: colors.navy900 }}>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <OffthreadVideo
          src={staticFile(src)}
          muted
          // startFrom picks the moment of the plate that is wanted, rather
          // than always opening on its first frame. The phone in beat 10 takes
          // a couple of seconds to wake, and a notification card over a dark
          // screen is a caption floating in a room.
          startFrom={Math.round(startFrom * fps)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${scale})`,
          }}
        />
      </AbsoluteFill>

      {/* A navy wash, so white type sits on something and the plates read as
          one palette with the rest of the film. */}
      {tint > 0 && (
        <AbsoluteFill style={{ backgroundColor: colors.navy950, opacity: tint }} />
      )}

      {children}

      <AbsoluteFill style={{ backgroundColor: colors.cream, opacity: cover }} />
    </AbsoluteFill>
  );
}
