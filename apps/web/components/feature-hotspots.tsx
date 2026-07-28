"use client";

import { useEffect, useState } from "react";
import type { FeatureShot, Hotspot } from "@/content/features";

/**
 * Annotated product photo: circular markers on points of interest, each with
 * a short leader line. Clicking one opens a magnified view of that spot plus
 * its description.
 *
 * Where a real macro photograph of the detail exists it is used directly.
 * Otherwise the detail pane scales the wide shot about the marker's own
 * coordinates, so a hotspot costs one line of data and no new asset.
 *
 * That fallback only lines up if the detail frame and the main frame crop
 * identically, which is why both use the shot's own aspect ratio rather than
 * a shared constant — a square photo forced into a 4:3 box would crop top and
 * bottom, and every marker would sit slightly wrong.
 *
 * Placing markers by eye against a photo is fiddly, so append ?hotspots=edit
 * to the URL: clicking the image then reports the exact x/y percentages and
 * copies them to the clipboard. Works on the deployed site, not just locally.
 */

export function FeatureHotspots({ shots }: { shots: FeatureShot[] }) {
  const [shotIndex, setShotIndex] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [probe, setProbe] = useState<string | null>(null);

  useEffect(() => {
    setEditing(
      new URLSearchParams(window.location.search).get("hotspots") === "edit"
    );
  }, []);

  const shot = shots[shotIndex];

  /* Switching photo must clear the selection — the old marker's coordinates
     mean something different on a different image. */
  useEffect(() => setActiveId(null), [shotIndex]);

  if (!shots.length) return null;

  const active: Hotspot | undefined = shot.hotspots.find(
    (h) => h.id === activeId
  );

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
    <div>
      {shots.length > 1 && (
        <div className="mb-5 flex flex-wrap gap-2">
          {shots.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setShotIndex(i)}
              aria-pressed={i === shotIndex}
              className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
                i === shotIndex
                  ? "bg-accent text-white"
                  : "bg-mist text-ink/60 hover:bg-line"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        {/* Annotated photo */}
        <div
          className={`relative overflow-hidden rounded-2xl bg-mist ${
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
            const isActive = h.id === activeId;
            return (
              <button
                key={h.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveId(isActive ? null : h.id);
                }}
                aria-pressed={isActive}
                aria-label={h.title}
                className="group absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${h.x}%`, top: `${h.y}%` }}
              >
                {/* Leader line — the "pointer" out from the marker. */}
                <span
                  aria-hidden
                  className={`absolute top-1/2 h-px w-8 origin-left transition-colors ${
                    isActive ? "bg-accent" : "bg-white/70"
                  } ${h.side === "left" ? "right-1/2 origin-right" : "left-1/2"}`}
                />
                <span
                  className={`relative flex h-6 w-6 items-center justify-center rounded-full border-2 shadow-lg transition-all ${
                    isActive
                      ? "scale-110 border-white bg-accent"
                      : "border-white bg-white/30 backdrop-blur-sm group-hover:bg-accent"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full transition-colors ${
                      isActive ? "bg-white" : "bg-white group-hover:bg-white"
                    }`}
                  />
                </span>
              </button>
            );
          })}

          {editing && probe && (
            <p className="absolute bottom-3 left-3 rounded-lg bg-ink/85 px-3 py-2 font-mono text-xs text-white">
              {probe} <span className="text-white/50">— copied</span>
            </p>
          )}
        </div>

        {/* Detail pane */}
        <div className="lg:sticky lg:top-24">
          {active ? (
            <div className="rounded-2xl border border-line bg-white p-5">
              <div
                className="overflow-hidden rounded-xl bg-mist"
                style={{ aspectRatio: shot.aspect }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={active.closeup ?? shot.src}
                  alt={active.title}
                  className="h-full w-full object-cover transition-transform duration-500"
                  style={
                    active.closeup
                      ? undefined
                      : {
                          transform: `scale(${active.zoom ?? 2.6})`,
                          transformOrigin: `${active.x}% ${active.y}%`,
                        }
                  }
                />
              </div>
              <h3 className="mt-5 text-lg font-extrabold tracking-tight">
                {active.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">
                {active.description}
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-line bg-mist p-8 text-center">
              <p className="text-sm font-semibold text-ink/50">
                Tap a marker on the photo to see it up close.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
