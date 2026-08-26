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
 * the sheet's own background showing through — so the seams never double up
 * where tiles meet. No radius, no shadow, no lift on hover: the only hover
 * state is the image dimming, because anything else turns a contact sheet
 * into a product grid.
 *
 * ── Why columns and not a grid ────────────────────────────────────────────
 * This was a 12-column grid, with each tile spanning as many columns and rows
 * as its aspect ratio implied: landscape 4x3, square 3x3, portrait 3x4. The
 * ratios were right, but the widths were not co-tileable — 4+4+4 fills a row
 * of twelve and 3+3+3+3 fills a row of twelve, and any mix of the two leaves
 * a one- or two-column gutter that no tile is narrow enough to occupy.
 * `grid-auto-flow: dense` cannot pack what does not fit, so the sheet carried
 * 48 empty cells, 11% of its own area, plus a ragged tail at the bottom.
 *
 * CSS multi-column is masonry: each tile keeps its natural height, the
 * shortest column takes the next tile, and nothing has to divide into twelve.
 * Zero holes, and no frame is cropped or letterboxed to make it fit — which
 * was the point of the span system in the first place.
 *
 * The trade is reading order: columns flow top-to-bottom before
 * left-to-right. On a sheet of photographs with no narrative sequence that
 * costs nothing, and the frame numbers still index the full set.
 */
/**
 * How many columns the sheet may use, given how many frames are showing.
 *
 * CSS balances tiles across whatever columns it is handed, so asking for more
 * columns than there are photos to fill them leaves whole columns empty — the
 * five yellow frames across four columns packed as 2/2/1/0, with a
 * column-wide void down the right-hand side of the sheet. Filtering makes
 * that the common case, not the edge case.
 *
 * Capping at one column per two photos guarantees every column receives at
 * least two tiles, so none is ever empty and the foot is never more than a
 * single frame ragged. Classes are written out in full because Tailwind scans
 * source text and would not generate an interpolated name.
 */
function columnsFor(count: number) {
  const cap = Math.min(4, Math.max(2, Math.floor(count / 2)));
  if (cap <= 2) return "columns-2 gap-px";
  if (cap === 3) return "columns-2 gap-px lg:columns-3";
  return "columns-2 gap-px lg:columns-3 xl:columns-4";
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
      {/* `canvas`, not `line`. Two jobs: the 1px seams become near-black
          hairlines, which is what separates frames on a real contact sheet,
          and the ragged foot that masonry always leaves — columns cannot end
          at the same height — lands on the same colour as the sections above
          and below it, so it reads as the sheet ending rather than as a hole
          in it. */}
      <div className={`${columnsFor(visible.length)} bg-canvas`}>
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
              /* `break-inside-avoid` keeps a tile from being split across a
                 column boundary; the 1px bottom margin is the horizontal seam,
                 matching the column gap. */
              className="group relative mb-px block w-full break-inside-avoid overflow-hidden bg-raised focus:outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
              /* Reserve the frame's exact shape before the image arrives, so
                 the columns do not reflow as the sheet loads. */
              style={{ aspectRatio: `${photo.w} / ${photo.h}` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={tileSrc(photo)}
                srcSet={tileSrcSet(photo)}
                sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, 50vw"
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
