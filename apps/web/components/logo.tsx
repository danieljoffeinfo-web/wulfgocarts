/**
 * Wulf Golf Carts wordmark.
 *
 * PLACEHOLDER: a type-only mark standing in for the real logo. When the
 * asset arrives, drop it in /public and replace this component's contents
 * (keep the `inverted` prop — the nav and footer both rely on it).
 */

export function Logo({
  className = "",
  inverted = false,
}: {
  className?: string;
  inverted?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-baseline gap-1.5 font-extrabold leading-none tracking-tight transition-colors duration-300 ${
        inverted ? "text-white" : "text-body"
      } ${className}`}
    >
      <span>WULF</span>
      <span
        className={`text-[0.62em] uppercase tracking-[0.18em] ${
          inverted ? "text-white/70" : "text-body/55"
        }`}
      >
        Golf Carts
      </span>
    </span>
  );
}
