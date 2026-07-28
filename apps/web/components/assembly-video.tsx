"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The assembly film — parts converging into the finished cart.
 *
 * Plays once when it scrolls into view and holds on the last frame, rather
 * than looping. The shot tells a story that ends somewhere (finished cart),
 * so looping would repeatedly snap it back to a heap of components and undo
 * the payoff. A replay control covers wanting to see it again.
 */
export function AssemblyVideo({
  src,
  poster,
  className = "",
}: {
  src: string;
  poster?: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    /* Under reduced motion the poster is the whole experience — never autoplay. */
    if (!video || reduced || started) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setStarted(true);
        video.play().catch(() => {
          /* Autoplay refused — the replay button is the fallback. */
        });
        observer.disconnect();
      },
      /* Wait until it is meaningfully on screen; firing at 0 means the film
         is half over before the visitor has scrolled to it. */
      { threshold: 0.4 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [reduced, started]);

  const replay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    setFinished(false);
    video.play().catch(() => {});
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-white ${className}`}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        playsInline
        preload="metadata"
        onEnded={() => setFinished(true)}
        aria-label="Wulf golf cart components assembling into the finished cart"
        className="h-full w-full object-cover"
      />

      {(finished || (reduced && poster)) && (
        <button
          type="button"
          onClick={replay}
          className="absolute bottom-4 right-4 rounded-full bg-ink/75 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm transition-colors hover:bg-accent"
        >
          Replay
        </button>
      )}
    </div>
  );
}
