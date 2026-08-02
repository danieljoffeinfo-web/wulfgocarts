"use client";

import { ScrollScrub } from "./scroll-scrub";

const clamp01 = (n: number) => Math.min(Math.max(n, 0), 1);

/** 0 before `start`, 1 after `end`, linear between. */
const ramp = (p: number, start: number, end: number) =>
  clamp01((p - start) / (end - start));

/**
 * The hero film, with copy timed to the camera move.
 *
 * Beat 1 sits on the cart as the camera pushes in. Beat 2 lands as we pass
 * through the windscreen. Both are gone by the time the camera reaches sky,
 * so the handoff into the page below is clean.
 */
export function Hero({
  src,
  srcPortrait,
  poster,
  posterPortrait,
}: {
  src?: string;
  srcPortrait?: string;
  poster?: string;
  posterPortrait?: string;
}) {
  return (
    <ScrollScrub
      src={src}
      srcPortrait={srcPortrait}
      poster={poster}
      posterPortrait={posterPortrait}
      scrollLength={340}
      scrollLengthPortrait={260}
    >
      {(p) => {
        const beat1 = 1 - ramp(p, 0.08, 0.26);
        const beat2 = ramp(p, 0.4, 0.52) * (1 - ramp(p, 0.66, 0.78));
        const cue = 1 - ramp(p, 0.02, 0.1);
        /* Scrim lifts as the camera reaches open sky so the frame goes clean. */
        const scrim = 0.55 * (1 - ramp(p, 0.6, 0.9));

        return (
          <div className="relative h-full w-full">
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/20 to-ink/60"
              style={{ opacity: scrim }}
            />

            {/* Beat 1 — on the cart. Sits left rather than centred so the
                cart itself stays unobstructed in the middle of the frame. */}
            <div
              className="absolute left-0 top-[24%] px-5 text-left sm:px-10 lg:px-16"
              style={{
                opacity: beat1,
                transform: `translateY(${(1 - beat1) * -32}px)`,
              }}
            >
              {/* A wordmark, not a heading. The page's h1 lives in the
                  section below and describes what is actually being sold —
                  "WULF" alone tells a search engine nothing. */}
              <p className="text-6xl font-extrabold leading-[0.95] tracking-tight text-white drop-shadow-lg sm:text-8xl lg:text-9xl">
                WULF
              </p>
              <p className="mt-5 max-w-sm text-lg font-semibold text-white/85 drop-shadow">
                New golf carts, seen in person.
              </p>
            </div>

            {/* Beat 2 — through the windscreen */}
            <div
              className="absolute left-0 top-[38%] px-5 text-left sm:px-10 lg:px-16"
              style={{
                opacity: beat2,
                transform: `translateY(${(1 - beat2) * 28}px)`,
              }}
            >
              <p className="max-w-md text-3xl font-extrabold leading-tight tracking-tight text-white drop-shadow-lg sm:text-5xl">
                Sit in one before you buy one.
              </p>
            </div>

            {/* Scroll cue */}
            <div
              className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-2"
              style={{ opacity: cue }}
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/60">
                Scroll
              </span>
              <span
                aria-hidden
                className="h-10 w-px bg-gradient-to-b from-white/60 to-transparent"
              />
            </div>
          </div>
        );
      }}
    </ScrollScrub>
  );
}
