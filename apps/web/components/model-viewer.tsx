"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

/**
 * Interactive 3D product viewer.
 *
 * Unlike SpinViewer — which fakes rotation by stepping through photos —
 * this renders an actual GLB mesh, so the visitor can orbit to any angle
 * rather than just the ones that happened to be photographed.
 *
 * @google/model-viewer is a ~500 kB web component, so it is imported lazily
 * on mount and never lands in the initial bundle. The element only renders
 * once the module has registered, otherwise React emits an unknown tag and
 * the fallback never shows.
 */

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        src?: string;
        alt?: string;
        poster?: string;
        "camera-controls"?: boolean | string;
        "auto-rotate"?: boolean | string;
        "auto-rotate-delay"?: string | number;
        "rotation-per-second"?: string;
        "shadow-intensity"?: string | number;
        "environment-image"?: string;
        "camera-orbit"?: string;
        "min-camera-orbit"?: string;
        "max-camera-orbit"?: string;
        "field-of-view"?: string;
        "interaction-prompt"?: string;
        "touch-action"?: string;
        exposure?: string | number;
        loading?: string;
      };
    }
  }
}

export function ModelViewer({
  src,
  alt,
  poster,
  className = "",
  aspect = "4 / 3",
}: {
  src: string;
  alt: string;
  poster?: string;
  className?: string;
  aspect?: string;
}) {
  const [registered, setRegistered] = useState(false);
  const [failed, setFailed] = useState(false);
  const elRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let alive = true;
    import("@google/model-viewer")
      .then(() => alive && setRegistered(true))
      .catch(() => {
        /* Leave the placeholder in place rather than a broken custom tag. */
      });
    return () => {
      alive = false;
    };
  }, []);

  /* A GLB is fetched, so a missing CORS header on the host fails the load.
     Fall back to the still photo rather than leaving an empty box. */
  useEffect(() => {
    const el = elRef.current;
    if (!el || !registered) return;
    const onError = () => setFailed(true);
    el.addEventListener("error", onError);
    return () => el.removeEventListener("error", onError);
  }, [registered]);

  if (failed) {
    return (
      <div
        className={`relative overflow-hidden rounded-2xl bg-mist ${className}`}
        style={{ aspectRatio: aspect }}
      >
        {poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={poster} alt={alt} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-ink/30">
              {alt}
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-mist ${className}`}
      style={{ aspectRatio: aspect }}
    >
      {registered ? (
        <model-viewer
          ref={elRef}
          src={src}
          alt={alt}
          poster={poster}
          camera-controls
          auto-rotate
          auto-rotate-delay={1200}
          rotation-per-second="18deg"
          shadow-intensity="1"
          exposure="1.1"
          /* Image-based lighting reads far better than the flat default,
             especially on the cart's gloss panels. */
          environment-image="neutral"
          /* Keep the camera near eye level — orbiting under the floor plane
             exposes the mesh's unmodelled underside. */
          min-camera-orbit="auto 55deg auto"
          max-camera-orbit="auto 95deg auto"
          /* pan-y so vertical page scroll still works over the viewer. */
          touch-action="pan-y"
          loading="lazy"
          style={
            {
              width: "100%",
              height: "100%",
              backgroundColor: "transparent",
              "--poster-color": "transparent",
            } as CSSProperties
          }
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-ink/30">
            Loading 3D view
          </span>
        </div>
      )}

      {registered && (
        <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-ink/70 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/90 backdrop-blur-sm">
          Drag to rotate
        </span>
      )}
    </div>
  );
}
