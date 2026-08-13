"use client";

import { useState } from "react";
import { visibleAngles, type CartColour } from "@/content/carts";

/**
 * Colour and angle selector for a cart.
 *
 * The swatches are circular crops of the photographs themselves rather than
 * flat colour chips. That takes the paint colour straight from the asset, so
 * a new colour needs only its image — no hex to look up, and no chip that can
 * drift out of step with the photo it claims to represent. Pass `hex` on a
 * colour to override with a flat chip where a crop reads badly.
 *
 * Colour heroes are all stacked and cross-faded, so switching colour is
 * instant after first paint. Extra angles are not stacked — that would be
 * twenty-five images on one card — so they load on demand and sit above the
 * stack while selected.
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
  /** Padding inside the control rows, matched to the card's own gutter. */
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
  /** 0 is the hero photograph; 1+ index into that colour's angles. */
  const [shotIndex, setShotIndex] = useState(0);

  const active = colours[index];
  const angles = visibleAngles(active);
  const activeAngle = shotIndex > 0 ? angles[shotIndex - 1] : undefined;

  const objectFit = fit === "contain" ? "object-contain" : "object-cover";

  const selectColour = (i: number) => {
    setIndex(i);
    /* Angle indexes do not carry across colours — colour three's rear shot is
       not colour one's rear shot, and the lists can differ in length. */
    setShotIndex(0);
  };

  return (
    <div className={className}>
      {/* White, not mist: the sources are 1:1 and this slot is 4:3, so contain
          letterboxes them. Against a white-background product shot on a white
          card, white bars vanish — mist would draw a visible seam around every
          image. */}
      <div
        className="relative overflow-hidden bg-white"
        style={{ aspectRatio: aspect }}
      >
        {colours.map((colour, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={colour.image}
            src={colour.image}
            alt={i === index && !activeAngle ? `${alt} in ${colour.name}` : ""}
            aria-hidden={i !== index || !!activeAngle}
            draggable={false}
            className={`absolute inset-0 h-full w-full ${objectFit} transition-opacity duration-300 ${
              i === index && !activeAngle ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {activeAngle && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={activeAngle.src}
            src={activeAngle.src}
            alt={`${alt} in ${active.name}, ${activeAngle.angle.toLowerCase()}`}
            draggable={false}
            className={`absolute inset-0 h-full w-full ${objectFit}`}
          />
        )}
      </div>

      {/* z-10 keeps the controls above the card's stretched link, so tapping
          one selects it instead of navigating to the detail page. */}
      <div
        className={`relative z-10 flex items-center gap-2.5 ${swatchClassName}`}
      >
        {colours.map((colour, i) => {
          const isActive = i === index;
          return (
            <button
              key={colour.image}
              type="button"
              onClick={() => selectColour(i)}
              aria-pressed={isActive}
              aria-label={colour.name}
              title={colour.name}
              className={`h-8 w-8 shrink-0 overflow-hidden rounded-full border-2 bg-surface bg-cover bg-center transition-all ${
                isActive
                  ? "border-accent ring-2 ring-accent/25"
                  : "border-line hover:border-ink/30"
              }`}
              style={
                colour.hex
                  ? { backgroundColor: colour.hex }
                  : {
                      backgroundImage: `url(${colour.thumb ?? colour.image})`,
                    }
              }
            />
          );
        })}
        <span className="ml-1 text-xs font-bold uppercase tracking-[0.15em] text-body/55">
          {active.name}
        </span>
      </div>

      {angles.length > 0 && (
        <div
          className={`relative z-10 flex items-center gap-2 pt-3 ${swatchClassName.replace(/pt-\d+/, "")}`}
        >
          <AngleThumb
            src={active.thumb ?? active.image}
            label={`${active.name}, as photographed`}
            isActive={shotIndex === 0}
            onClick={() => setShotIndex(0)}
          />
          {angles.map((shot, i) => (
            <AngleThumb
              key={shot.src}
              src={shot.thumb}
              label={`${active.name}, ${shot.angle.toLowerCase()}`}
              isActive={shotIndex === i + 1}
              onClick={() => setShotIndex(i + 1)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AngleThumb({
  src,
  label,
  isActive,
  onClick,
}: {
  src: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      aria-label={label}
      title={label}
      className={`h-12 w-14 shrink-0 overflow-hidden rounded-lg border bg-white bg-contain bg-center bg-no-repeat transition-all ${
        isActive ? "border-accent ring-1 ring-accent/25" : "border-line hover:border-ink/25"
      }`}
      style={{ backgroundImage: `url(${src})` }}
    />
  );
}
