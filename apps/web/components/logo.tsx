/**
 * Wulf Go Carts wordmark.
 *
 * PLACEHOLDER: a type-only mark standing in for the real logo. When the
 * asset arrives, drop it in /public and replace this component's contents
 * with an <Image> (keep the `inverted` prop — the footer relies on it).
 */

export function Logo({
  className = "",
  inverted = false,
}: {
  className?: string;
  inverted?: boolean;
}) {
  const primary = inverted ? "#ffffff" : "var(--color-navy)";
  const secondary = inverted ? "rgba(255,255,255,0.65)" : "var(--color-ink)";

  return (
    <span
      className={`inline-flex items-baseline gap-1.5 font-extrabold leading-none tracking-tight ${className}`}
    >
      <span style={{ color: primary }}>WULF</span>
      <span
        className="text-[0.62em] uppercase tracking-[0.18em]"
        style={{ color: secondary }}
      >
        Go Carts
      </span>
    </span>
  );
}
