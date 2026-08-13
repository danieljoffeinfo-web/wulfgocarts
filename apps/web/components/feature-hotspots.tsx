"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { FeatureShot } from "@/content/features";

/**
 * Annotated product photography. Each shot carries a marker on its point of
 * interest; clicking it reveals a macro close-up and a description directly
 * beneath that photo.
 *
 * The two shots sit side by side rather than behind a toggle, with the second
 * dropped down the page so the pair reads as a composition instead of a grid.
 *
 * Where a real macro photograph exists it is shown directly. Otherwise the
 * detail pane scales the wide shot about the marker's own coordinates — which
 * only lines up if both frames crop identically, hence each shot carrying its
 * own aspect ratio rather than a shared constant.
 *
 * Placing markers by eye is fiddly, so append ?hotspots=edit to the URL:
 * clicking a photo then reports the exact x/y percentages and copies them to
 * the clipboard. Works on the deployed site, not just locally.
 */

export function FeatureHotspots({ shots }: { shots: FeatureShot[] }) {
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setEditing(
      new URLSearchParams(window.location.search).get("hotspots") === "edit"
    );
  }, []);

  if (!shots.length) return null;

  return (
    <div className="grid gap-10 md:grid-cols-2 md:items-start md:gap-8">
      {shots.map((shot, i) => (
        <ShotCard
          key={shot.id}
          shot={shot}
          editing={editing}
          /* Drop the second shot down so the pair is staggered, not aligned. */
          className={i === 1 ? "md:mt-24" : undefined}
        />
      ))}
    </div>
  );
}

function ShotCard({
  shot,
  editing,
  className = "",
}: {
  shot: FeatureShot;
  editing: boolean;
  className?: string;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [probe, setProbe] = useState<string | null>(null);

  const open = shot.hotspots.find((h) => h.id === openId);

  const onProbe = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!editing) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = +(((e.clientX - rect.left) / rect.width) * 100).toFixed(1);
    const y = +(((e.clientY - rect.top) / rect.height) * 100).toFixed(1);
    const snippet = `x: ${x}, y: ${y},`;
    setProbe(snippet);
    navigator.clipboard?.writeText(snippet).catch(() => {});
  };

  return (
    <div className={className}>
      <div
        className={`relative overflow-hidden rounded-2xl bg-surface ${
          editing ? "cursor-crosshair" : ""
        }`}
        style={{ aspectRatio: shot.aspect }}
        onClick={onProbe}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={shot.src}
          alt={shot.alt}
          className="h-full w-full object-cover"
          draggable={false}
        />

        {shot.hotspots.map((h) => {
          const isOpen = h.id === openId;
          return (
            <button
              key={h.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpenId(isOpen ? null : h.id);
              }}
              aria-expanded={isOpen}
              aria-label={h.title}
              className="group absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
            >
              <span
                aria-hidden
                className={`absolute top-1/2 h-px w-8 transition-colors ${
                  isOpen ? "bg-accent" : "bg-white/70"
                } ${h.side === "left" ? "right-1/2" : "left-1/2"}`}
              />
              <span
                className={`relative flex h-7 w-7 items-center justify-center rounded-full border-2 border-white shadow-lg transition-all ${
                  isOpen
                    ? "scale-110 bg-accent"
                    : "bg-white/25 backdrop-blur-sm group-hover:bg-accent"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              </span>
            </button>
          );
        })}

        {editing && probe && (
          <p className="absolute bottom-3 left-3 rounded-lg bg-canvas/85 px-3 py-2 font-mono text-xs text-white">
            {probe} <span className="text-white/50">— copied</span>
          </p>
        )}
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key={open.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-4 rounded-2xl border border-line bg-raised p-5">
              <div
                className="overflow-hidden rounded-xl bg-surface"
                style={{ aspectRatio: shot.aspect }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={open.closeup ?? shot.src}
                  alt={open.title}
                  className="h-full w-full object-cover"
                  style={
                    open.closeup
                      ? undefined
                      : {
                          transform: `scale(${open.zoom ?? 2.6})`,
                          transformOrigin: `${open.x}% ${open.y}%`,
                        }
                  }
                />
              </div>
              <h3 className="mt-5 text-lg font-extrabold tracking-tight">
                {open.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-body/65">
                {open.description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
