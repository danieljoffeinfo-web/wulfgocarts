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
      className={`h-10 w-auto object-contain sm:h-12 ${className}`}
    />
  );
}
