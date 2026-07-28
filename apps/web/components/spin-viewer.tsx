"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Drag-to-rotate 360° product viewer, StockX style.
 *
 * `frames` is an ordered set of photos taken at even angles around the cart.
 * Dragging horizontally steps through them, which reads as rotation. There is
 * no 3D model involved — the illusion depends entirely on the frames being
 * evenly spaced, so 24–36 shots at a consistent height and distance is what
 * makes it work. Fewer than ~16 and the rotation visibly jumps.
 *
 * Every frame is preloaded before the viewer becomes interactive; swapping to
 * an undecoded image mid-drag causes a visible flash.
 */

/** Horizontal pixels of drag per frame step. Lower = more sensitive. */
const PIXELS_PER_FRAME = 8;

export function SpinViewer({
  frames,
  alt,
  className = "",
  aspect = "4 / 3",
}: {
  frames: string[];
  alt: string;
  className?: string;
  aspect?: string;
}) {
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [hinted, setHinted] = useState(false);

  const lastX = useRef(0);
  const carry = useRef(0);

  const total = frames.length;
  const ready = total > 0 && loaded >= total;

  /* Preload every frame up front. */
  useEffect(() => {
    if (!total) return;
    let alive = true;
    let count = 0;

    frames.forEach((src) => {
      const img = new Image();
      const done = () => {
        if (!alive) return;
        count += 1;
        setLoaded(count);
      };
      img.onload = done;
      /* Count failures too, otherwise one bad path hangs the viewer forever. */
      img.onerror = done;
      img.src = src;
    });

    return () => {
      alive = false;
    };
  }, [frames, total]);

  const step = useCallback(
    (delta: number) => {
      setIndex((i) => (((i + delta) % total) + total) % total);
    },
    [total]
  );

  /* A single slow revolution on first reveal, so it reads as interactive. */
  useEffect(() => {
    if (!ready || hinted) return;
    setHinted(true);
    let frame = 0;
    const id = window.setInterval(() => {
      frame += 1;
      step(1);
      if (frame >= Math.min(total, 12)) window.clearInterval(id);
    }, 55);
    return () => window.clearInterval(id);
  }, [ready, hinted, step, total]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!ready) return;
    setDragging(true);
    lastX.current = e.clientX;
    carry.current = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;
    carry.current += dx;

    const steps = Math.trunc(carry.current / PIXELS_PER_FRAME);
    if (steps !== 0) {
      carry.current -= steps * PIXELS_PER_FRAME;
      /* Negative so dragging right spins the cart as if pushed from the left. */
      step(-steps);
    }
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-mist select-none ${
        dragging ? "cursor-grabbing" : "cursor-grab"
      } ${className}`}
      style={{ aspectRatio: aspect, touchAction: "pan-y" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={onKeyDown}
      role="img"
      aria-label={`${alt} — 360 degree view. Drag, or use arrow keys, to rotate.`}
      tabIndex={0}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={frames[index]}
        alt=""
        draggable={false}
        className={`h-full w-full object-cover transition-opacity duration-500 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      />

      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-ink/30">
            Loading 360° view {total ? `${Math.round((loaded / total) * 100)}%` : ""}
          </span>
        </div>
      )}

      {ready && (
        <>
          <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-ink/70 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/90 backdrop-blur-sm">
            Drag to rotate
          </span>
          {/* Position dots — a cheap read on where you are in the revolution. */}
          <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-ink/60 px-2.5 py-1 text-[10px] font-bold tabular-nums text-white/80 backdrop-blur-sm">
            {index + 1}/{total}
          </span>
        </>
      )}
    </div>
  );
}
