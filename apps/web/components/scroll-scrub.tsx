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
 * Three details make this feel right:
 *
 *  1. currentTime is never written from the scroll handler directly. Scroll
 *     sets a target; a rAF loop eases the actual playhead toward it. Without
 *     this, fast trackpad scrolling produces visible stutter.
 *  2. A portrait cut is served to portrait viewports. A 16:9 film under
 *     object-cover on a phone crops away most of its width and upscales the
 *     remaining strip — the subject leaves the frame and what is left is soft.
 *     The switch keys off viewport shape, not device type, so a rotated phone
 *     and a narrow window both get the right cut.
 *  3. The source MP4 wants every frame to be a keyframe, otherwise seeking
 *     snaps to the nearest one and the film judders. See scripts/encode-scrub.sh.
 */

export function ScrollScrub({
  src,
  srcPortrait,
  poster,
  posterPortrait,
  /** Scroll distance for the film, in vh. More = slower, more deliberate. */
  scrollLength = 340,
  /** Portrait viewports get less, since it is all thumb-scrolling. */
  scrollLengthPortrait = 260,
  /**
   * "cover" fills the stage and crops — right for a scene the visitor is
   * inside of. "contain" letterboxes and shows the whole frame — right for a
   * studio product shot, where cropping would cut parts out of the picture.
   */
  fit = "cover",
  /** Stage backdrop. Matters for "contain", which leaves visible margins. */
  stageClassName = "bg-canvas",
  className = "",
  eager = false,
  children,
}: {
  src?: string;
  srcPortrait?: string;
  poster?: string;
  posterPortrait?: string;
  scrollLength?: number;
  scrollLengthPortrait?: number;
  fit?: "cover" | "contain";
  stageClassName?: string;
  className?: string;
  /** Load immediately for above-the-fold films; defer everything else. */
  eager?: boolean;
  /** Render-prop receiving scrub progress 0→1, for overlay copy. */
  children?: (progress: number) => ReactNode;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const scrollRafRef = useRef<number | null>(null);
  const durationRef = useRef(0);

  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [portrait, setPortrait] = useState(false);
  const [nearby, setNearby] = useState(eager);
  const [active, setActive] = useState(eager);

  /* Honour prefers-reduced-motion: fall back to a static frame, no pinning. */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  /* Viewport shape decides which cut to load. */
  useEffect(() => {
    const mq = window.matchMedia("(max-aspect-ratio: 1/1)");
    const apply = () => setPortrait(mq.matches);
    apply();
    const onChange = () => {
      setPortrait(mq.matches);
      const video = videoRef.current;
      if (video) {
        setReady(false);
        durationRef.current = 0;
        video.load();
      }
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const activePoster = portrait && posterPortrait ? posterPortrait : poster;
  const activeLength = portrait ? scrollLengthPortrait : scrollLength;

  /* Keep lower films out of the initial network queue and stop animation work
     once a scrub section is well outside the viewport. */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !("IntersectionObserver" in window)) {
      setNearby(true);
      setActive(true);
      return;
    }

    const preloadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearby(true);
          preloadObserver.disconnect();
        }
      },
      { rootMargin: "150% 0px" },
    );
    const activityObserver = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "75% 0px" },
    );

    preloadObserver.observe(section);
    activityObserver.observe(section);
    return () => {
      preloadObserver.disconnect();
      activityObserver.disconnect();
    };
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
    if (reduced || !active) return;

    const onScroll = () => {
      if (scrollRafRef.current !== null) return;
      scrollRafRef.current = requestAnimationFrame(() => {
        const p = readProgress();
        targetRef.current = p;
        setProgress(p);
        scrollRafRef.current = null;
      });
    };

    /* Ease the playhead toward the scroll target rather than snapping to it. */
    const tick = () => {
      const video = videoRef.current;
      const duration = durationRef.current;

      if (video && duration > 0) {
        const target = targetRef.current * duration;
        const delta = target - currentRef.current;

        if (Math.abs(delta) > 0.001) {
          currentRef.current += delta * 0.22;
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
      if (scrollRafRef.current !== null) {
        cancelAnimationFrame(scrollRafRef.current);
        scrollRafRef.current = null;
      }
    };
  }, [active, reduced, readProgress]);

  const onLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    durationRef.current = video.duration || 0;
    currentRef.current = targetRef.current * durationRef.current;
    video.currentTime = currentRef.current;
    /* iOS will not decode frames for a video that has never been told to
       play. A muted play/pause unlocks the decoder without showing motion. */
    video.play().then(() => video.pause()).catch(() => {});
  };

  return (
    <div
      ref={sectionRef}
      className={`relative ${className}`}
      style={reduced ? undefined : { height: `${activeLength}vh` }}
    >
      <div className={`scrub-stage ${stageClassName}`}>
        {nearby && (src || srcPortrait) ? (
          <video
            ref={videoRef}
            poster={activePoster}
            muted
            playsInline
            preload={eager ? "auto" : "metadata"}
            aria-hidden="true"
            onLoadedMetadata={onLoadedMetadata}
            onLoadedData={() => setReady(true)}
            className={`h-full w-full transition-opacity duration-300 ${
              fit === "contain" ? "object-contain" : "object-cover"
            } ${ready ? "opacity-100" : "opacity-0"}`}
          >
            {srcPortrait ? (
              <source
                src={srcPortrait}
                media="(max-aspect-ratio: 1/1)"
                type="video/mp4"
              />
            ) : null}
            {src ? <source src={src} type="video/mp4" /> : null}
          </video>
        ) : activePoster ? (
          <div
            aria-hidden="true"
            className={`h-full w-full bg-center bg-no-repeat ${
              fit === "contain" ? "bg-contain" : "bg-cover"
            }`}
            style={{ backgroundImage: `url(${activePoster})` }}
          />
        ) : (
          /* No film yet — the stage still holds its shape so the rest of the
             page can be built and reviewed before the render lands. */
          <div className="flex h-full w-full items-center justify-center bg-canvas">
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
