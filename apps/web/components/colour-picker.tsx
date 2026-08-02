"use client";

import { useState } from "react";
import type { CartColour } from "@/content/carts";

/**
 * Colour selector for a cart card.
 *
 * The swatches are circular crops of the photographs themselves rather than
 * flat colour chips. That takes the paint colour straight from the asset, so
 * a new colour needs only its image — no hex to look up, and no chip that can
 * drift out of step with the photo it claims to represent. Pass `hex` on a
 * colour to override with a flat chip where a crop reads badly.
 */
export function ColourPicker({
  colours,
  alt,
  aspect = "4 / 3",
  /**
   * "contain" shows the whole photograph, letterboxing where its proportions
   * differ from the frame. The default, because these are product shots and
   * cropping a cart's roof or wheels off defeats the point of showing it.
   */
  fit = "contain",
  /** Padding inside the swatch row, matched to the card's own gutter. */
  swatchClassName = "px-7 pt-5",
  className = "",
}: {
  colours: CartColour[];
  alt: string;
  aspect?: string;
  fit?: "cover" | "contain";
  swatchClassName?: string;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const active = colours[index];

  return (
    <div className={className}>
      <div
        className="relative overflow-hidden bg-mist"
        style={{ aspectRatio: aspect }}
      >
        {/* All colours are stacked and cross-faded rather than swapping one
            src. Swapping would show a blank frame while the new image
            decodes; stacking means every colour is warm after first paint. */}
        {colours.map((colour, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={colour.image}
            src={colour.image}
            alt={i === index ? `${alt} in ${colour.name}` : ""}
            aria-hidden={i !== index}
            draggable={false}
            className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${
              fit === "contain" ? "object-contain" : "object-cover"
            } ${i === index ? "opacity-100" : "opacity-0"}`}
          />
        ))}
      </div>

      {/* z-10 keeps the swatches above the card's stretched link, so tapping
          a colour selects it instead of navigating to the detail page. */}
      <div
        className={`relative z-10 flex items-center gap-2.5 ${swatchClassName}`}
      >
        {colours.map((colour, i) => {
          const isActive = i === index;
          return (
            <button
              key={colour.image}
              type="button"
              onClick={() => setIndex(i)}
              aria-pressed={isActive}
              aria-label={colour.name}
              title={colour.name}
              className={`h-8 w-8 shrink-0 overflow-hidden rounded-full border-2 bg-mist bg-cover bg-center transition-all ${
                isActive
                  ? "border-accent ring-2 ring-accent/25"
                  : "border-line hover:border-ink/30"
              }`}
              style={
                colour.hex
                  ? { backgroundColor: colour.hex }
                  : { backgroundImage: `url(${colour.image})` }
              }
            />
          );
        })}
        <span className="ml-1 text-xs font-bold uppercase tracking-[0.15em] text-ink/45">
          {active.name}
        </span>
      </div>
    </div>
  );
}
