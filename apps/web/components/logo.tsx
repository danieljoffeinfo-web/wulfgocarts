import Image from "next/image";

/** Wulf Golf Carts SA brand lockup, restored from the supplied artwork. */

export function Logo({
  className = "",
  inverted: _inverted = false,
}: {
  className?: string;
  inverted?: boolean;
}) {
  return (
    <Image
      src="/brand/wulf-logo-upscaled.png"
      alt="Wulf Golf Carts SA"
      width={2109}
      height={746}
      priority
      /* Without `sizes`, next/image assumes the image may fill the viewport
         and preloads the 3840px variant — for a mark that renders about
         136px wide. It is `priority`, so that download was competing with the
         hero film for the first bytes on the page. The width/height above
         stay as the source dimensions; they only set the aspect ratio. */
      sizes="180px"
      /* 30% up from h-10/h-12: 2.5rem→3.25rem and 3rem→3.9rem. Still clears
         the h-16/h-20 nav bar with room to spare. */
      className={`h-[3.25rem] w-auto object-contain sm:h-[3.9rem] ${className}`}
    />
  );
}
