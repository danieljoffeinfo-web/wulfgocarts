"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/**
 * Scroll-scrubbed film.
 *
 * The section is taller than the viewport; inside it a sticky stage pins the
 * video while the page scrolls past. Scroll progress through the section maps
 * onto the video's currentTime, so the visitor "drives" the camera move.
 *
 * Two details make this feel smooth rather than steppy:
 *
 *  1. currentTime is never written from the scroll handler directly. Scroll
 *     sets a target; a rAF loop eases the actual playhead toward it. Without
 *     this, fast trackpad scrolling produces visible stutter.
 *  2. The source MP4 must be encoded with every frame a keyframe, otherwise
 *     seeking snaps to the nearest keyframe and the film judders. See
 *     scripts/encode-scrub.sh.
 */

export function ScrollScrub({
  src,
  poster,
  /** Scroll distance for the film, in vh. More = slower, more deliberate. */
  scrollLength = 320,
  className = "",
  children,
}: {
  src?: string;
  poster?: string;
  scrollLength?: number;
  className?: string;
  /** Render-prop receiving scrub progress 0→1, for overlay copy. */
  children?: (progress: number) => ReactNode;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const durationRef = useRef(0);

  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);

  /* Honour prefers-reduced-motion: fall back to a static frame, no pinning. */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const readProgress = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return 0;
    const rect = section.getBoundingClientRect();
    const scrollable = section.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return 0;
    return Math.min(Math.max(-rect.top / scrollable, 0), 1);
  }, []);

  useEffect(() => {
    if (reduced) return;

    const onScroll = () => {
      const p = readProgress();
      targetRef.current = p;
      setProgress(p);
    };

    /* Ease the playhead toward the scroll target rather than snapping to it. */
    const tick = () => {
      const video = videoRef.current;
      const duration = durationRef.current;

      if (video && duration > 0) {
        const target = targetRef.current * duration;
        const delta = target - currentRef.current;

        if (Math.abs(delta) > 0.001) {
          currentRef.current += delta * 0.12;
          /* Seeking while a previous seek is in flight drops frames. */
          if (video.readyState >= 2 && !video.seeking) {
            video.currentTime = currentRef.current;
          }
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [reduced, readProgress]);

  const onLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    durationRef.current = video.duration || 0;
    setReady(true);
    /* iOS will not decode frames for a video that has never been told to
       play. A muted play/pause unlocks the decoder without showing motion. */
    video.play().then(() => video.pause()).catch(() => {});
  };

  return (
    <div
      ref={sectionRef}
      className={`relative ${className}`}
      style={reduced ? undefined : { height: `${scrollLength}vh` }}
    >
      <div className="scrub-stage bg-ink">
        {src ? (
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            onLoadedMetadata={onLoadedMetadata}
            className={`h-full w-full object-cover transition-opacity duration-700 ${
              ready ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : (
          /* No film yet — the stage still holds its shape so the rest of the
             page can be built and reviewed before the render lands. */
          <div className="flex h-full w-full items-center justify-center bg-ink">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/30">
              Hero film renders here
            </span>
          </div>
        )}

        {children ? (
          <div className="pointer-events-none absolute inset-0">
            {children(progress)}
          </div>
        ) : null}
      </div>
    </div>
  );
}
