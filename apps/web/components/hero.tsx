/**
 * Above-the-fold showroom film.
 *
 * This plays normally instead of seeking on scroll. That keeps the supplied
 * footage intact and makes the opening responsive even on slower phones.
 */
export function Hero({ src, poster }: { src: string; poster: string }) {
  return (
    <section className="relative h-[82svh] min-h-[34rem] overflow-hidden bg-black sm:h-[100svh]">
      <video
        className="h-full w-full object-contain sm:object-cover"
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="WULF yellow four-seater electric golf cart showcase"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/75"
      />

      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1600px] px-5 pb-10 sm:px-10 sm:pb-14 lg:px-16">
        <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-accent-soft drop-shadow-md">
          WULF Golf Carts SA
        </p>
        <p className="mt-3 max-w-xl text-3xl font-extrabold leading-tight tracking-tight text-white drop-shadow-lg sm:text-5xl">
          Built different. Drive different.
        </p>
        <p className="mt-3 max-w-md text-sm font-semibold text-white/80 drop-shadow sm:text-base">
          Premium lithium electric golf carts, available to test-drive in Cape
          Town.
        </p>
      </div>
    </section>
  );
}
