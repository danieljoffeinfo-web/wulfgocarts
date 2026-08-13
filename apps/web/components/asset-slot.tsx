import Image from "next/image";

/**
 * An image that degrades to a labelled placeholder frame.
 *
 * Pass `src` (a path from /public) and it renders the real photo. Leave `src`
 * undefined and it renders a dashed frame of the same proportions, so the
 * layout is already correct before the assets land.
 */
export function AssetSlot({
  src,
  alt,
  label,
  aspect = "4 / 3",
  sizes = "(min-width: 768px) 33vw, 100vw",
  className = "",
  priority = false,
}: {
  src?: string;
  alt: string;
  /** Shown in the placeholder frame — describe the photo that belongs here. */
  label: string;
  /** CSS aspect-ratio value, e.g. "16 / 9". */
  aspect?: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
}) {
  if (src) {
    return (
      <div
        className={`relative overflow-hidden rounded-2xl bg-surface ${className}`}
        style={{ aspectRatio: aspect }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-2xl border-2 border-dashed border-line bg-surface px-6 text-center ${className}`}
      style={{ aspectRatio: aspect }}
      role="img"
      aria-label={`Placeholder: ${label}`}
    >
      <span className="text-xs font-bold uppercase tracking-[0.15em] text-body/55">
        {label}
      </span>
    </div>
  );
}
