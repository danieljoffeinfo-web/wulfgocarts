"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  colourways,
  fullSrc,
  photos,
  tileSrc,
  tileSrcSet,
  type ColourwayId,
  type Photo,
} from "@/content/gallery";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * A darkroom contact sheet, not a card grid.
 *
 * Tiles sit flush against each other and are separated only by a 1px seam —
 * which is the grid container's own background showing through a 1px gap, so
 * the seams never double up where tiles meet. No radius, no shadow, no lift on
 * hover: the only hover state is the image dimming, because anything else
 * turns a contact sheet into a product grid.
 *
 * ── The span system ───────────────────────────────────────────────────────
 * Rows are a fixed 8.333vw — one twelfth of the viewport, the same as a column
 * — so a tile spanning C columns and R rows has an aspect ratio of exactly
 * C/R. That is what keeps mixed portrait/square/landscape frames on one sheet
 * without letterboxing any of them:
 *
 *   landscape 4:3   →  4 × 3        square 1:1  →  3 × 3
 *   portrait  3:4   →  3 × 4
 *
 * Below `lg` every span doubles (and landscapes go full width) so tiles stay
 * big enough to read on a phone. Spans are written as complete literal class
 * strings because Tailwind scans source text — building them by interpolation
 * would leave the classes ungenerated.
 */
const SPANS = {
  landscape: "col-span-12 row-span-9 lg:col-span-4 lg:row-span-3",
  square: "col-span-6 row-span-6 lg:col-span-3 lg:row-span-3",
  portrait: "col-span-6 row-span-8 lg:col-span-3 lg:row-span-4",
} as const;

function spanFor(photo: Photo) {
  const ratio = photo.w / photo.h;
  if (ratio > 1.15) return SPANS.landscape;
  if (ratio < 0.9) return SPANS.portrait;
  return SPANS.square;
}

type Filter = ColourwayId | "all";

export function ContactSheet() {
  const [filter, setFilter] = useState<Filter>("all");
  const [openAt, setOpenAt] = useState<number | null>(null);
  const reduce = useReducedMotion();

  const visible = useMemo(
    () => (filter === "all" ? photos : photos.filter((p) => p.group === filter)),
    [filter]
  );

  /* The lightbox indexes into the filtered list, so changing filter while it
     is open would point at the wrong frame. Close it instead. */
  const choose = (next: Filter) => {
    setOpenAt(null);
    setFilter(next);
  };

  const close = useCallback(() => setOpenAt(null), []);
  const step = useCallback(
    (delta: number) =>
      setOpenAt((i) =>
        i === null ? i : (i + delta + visible.length) % visible.length
      ),
    [visible.length]
  );

  return (
    <>
      {/* ── Colourway rail ────────────────────────────────────────────────
          Sticky under the nav. Each chip carries the paint itself, sampled
          from the bonnet in the photographs rather than picked by eye. */}
      <div className="sticky top-16 z-30 border-y border-line bg-canvas/90 backdrop-blur-md sm:top-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div
            role="group"
            aria-label="Filter photographs by colour"
            className="flex snap-x gap-2 overflow-x-auto py-3.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <Chip
              active={filter === "all"}
              onClick={() => choose("all")}
              label="Everything"
              count={photos.length}
            />
            {colourways.map((c) => (
              <Chip
                key={c.id}
                active={filter === c.id}
                onClick={() => choose(c.id)}
                label={c.label}
                swatch={c.swatch}
                count={photos.filter((p) => p.group === c.id).length}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── The sheet ─────────────────────────────────────────────────────
          Full-bleed on purpose: the contained text sections above and below
          give it edges, so the photography reads as the page's main event. */}
      <div
        className="grid auto-rows-[8.333vw] grid-cols-12 gap-px bg-line"
        style={{ gridAutoFlow: "row dense" }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((photo, i) => (
            <motion.button
              key={photo.slug}
              type="button"
              onClick={() => setOpenAt(i)}
              aria-label={`Open ${photo.caption}`}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.4,
                ease: EASE,
                delay: reduce ? 0 : Math.min(i, 12) * 0.025,
              }}
              className={`group relative overflow-hidden bg-raised focus:outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent ${spanFor(
                photo
              )}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={tileSrc(photo)}
                srcSet={tileSrcSet(photo)}
                sizes="(min-width: 1024px) 25vw, 50vw"
                alt={photo.alt}
                loading={i < 4 ? "eager" : "lazy"}
                decoding="async"
                draggable={false}
                className="h-full w-full object-cover transition-[filter,transform] duration-500 ease-out group-hover:scale-[1.02] group-hover:brightness-[0.82]"
              />

              {/* Frame number and caption, revealed on hover. The scrim is
                  bottom-anchored so it never sits over the subject. */}
              <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-ink/75 via-ink/25 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 sm:p-4">
                <span className="text-[11px] font-semibold leading-snug text-white/90">
                  {photo.caption}
                </span>
                <span className="shrink-0 font-mono text-[10px] tabular-nums text-white/55">
                  {String(photos.indexOf(photo) + 1).padStart(2, "0")}
                </span>
              </span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <Lightbox
        photos={visible}
        index={openAt}
        onClose={close}
        onStep={step}
      />
    </>
  );
}

function Chip({
  active,
  onClick,
  label,
  swatch,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  swatch?: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex shrink-0 snap-start items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-bold transition-colors ${
        active
          ? "border-accent bg-accent text-white"
          : "border-line bg-surface text-body/70 hover:border-body/30 hover:text-body"
      }`}
    >
      {swatch && (
        <span
          aria-hidden
          className="h-3.5 w-3.5 shrink-0 rounded-full ring-1 ring-inset ring-body/20"
          style={
            swatch.startsWith("#")
              ? { background: swatch }
              : { backgroundImage: swatch }
          }
        />
      )}
      {label}
      <span
        className={`font-mono text-[11px] tabular-nums ${
          active ? "text-white/50" : "text-body/40"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

/**
 * Full-screen viewer.
 *
 * A lightbox is a darkroom. The page is already dark, so the overlay takes the
 * darkest surface in the palette — `canvas` — and everything but the
 * photograph drops to a low-contrast white, leaving the frame the only lit
 * thing on screen.
 */
function Lightbox({
  photos: list,
  index,
  onClose,
  onStep,
}: {
  photos: Photo[];
  index: number | null;
  onClose: () => void;
  onStep: (delta: number) => void;
}) {
  const open = index !== null;
  const photo = open ? list[index] : null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onStep(1);
      if (e.key === "ArrowLeft") onStep(-1);
    };
    window.addEventListener("keydown", onKey);
    /* Lock the page behind the overlay without the layout shifting as the
       scrollbar disappears. */
    const { body } = document;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    const prev = { overflow: body.style.overflow, pad: body.style.paddingRight };
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;
    return () => {
      window.removeEventListener("keydown", onKey);
      body.style.overflow = prev.overflow;
      body.style.paddingRight = prev.pad;
    };
  }, [open, onClose, onStep]);

  /* Warm the neighbours so arrowing through does not flash. */
  useEffect(() => {
    if (index === null || list.length < 2) return;
    for (const d of [1, -1]) {
      const n = list[(index + d + list.length) % list.length];
      const img = new Image();
      img.src = fullSrc(n);
    }
  }, [index, list]);

  return (
    <AnimatePresence>
      {open && photo && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={photo.caption}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="fixed inset-0 z-[60] flex flex-col bg-canvas"
        >
          {/* Header: counter left, close right. */}
          <div className="flex shrink-0 items-center justify-between px-4 py-4 sm:px-6">
            <p className="font-mono text-xs tabular-nums text-white/45">
              {String(index + 1).padStart(2, "0")}
              <span className="mx-1.5 text-white/25">/</span>
              {String(list.length).padStart(2, "0")}
            </p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-mr-2 flex h-10 w-10 items-center justify-center text-white/60 transition-colors hover:text-white"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
                <path
                  d="M1 1l16 16M17 1L1 17"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </button>
          </div>

          {/* The frame. Clicking the surround closes; clicking the photo does
              not, so a mis-aimed tap near the edge is forgiving. */}
          <div
            className="flex min-h-0 flex-1 items-center justify-center px-4 sm:px-16"
            onClick={onClose}
          >
            <motion.img
              key={photo.slug}
              src={fullSrc(photo)}
              alt={photo.alt}
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
              draggable={false}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          {/* Footer: caption centred, arrows either side. */}
          <div className="flex shrink-0 items-center justify-between gap-4 px-4 py-5 sm:px-6">
            <Arrow dir="prev" onClick={() => onStep(-1)} />
            <p className="min-w-0 truncate text-center text-sm font-semibold text-white/80">
              {photo.caption}
            </p>
            <Arrow dir="next" onClick={() => onStep(1)} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Arrow({ dir, onClick }: { dir: "prev" | "next"; onClick: () => void }) {
  const next = dir === "next";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={next ? "Next photograph" : "Previous photograph"}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/40 hover:text-white"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
        <path
          d={next ? "M5 1l7 7-7 7" : "M11 1L4 8l7 7"}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </svg>
    </button>
  );
}
