import { site } from "@/content/site";

function FacebookGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z" />
    </svg>
  );
}

/**
 * Above-the-fold showroom film.
 *
 * This plays normally instead of seeking on scroll. That keeps the supplied
 * footage intact and makes the opening responsive even on slower phones.
 */
export function Hero({
  src,
  srcMobile,
  poster,
}: {
  src: string;
  srcMobile?: string;
  poster: string;
}) {
  return (
    <section className="relative h-[82svh] min-h-[34rem] overflow-hidden bg-black sm:h-[100svh]">
      {/* React hoists these into <head>, so the browser starts fetching before
          it has parsed this far down the document.

          The poster is what the visitor actually sees first, so it is fetched
          at high priority. preconnect opens the TLS handshake to Cloudinary in
          parallel rather than after the first request resolves — on a mobile
          connection that alone is a few hundred milliseconds off the wait. */}
      <link rel="preconnect" href="https://res.cloudinary.com" />
      <link
        rel="preload"
        as="image"
        href={poster}
        fetchPriority="high"
      />

      <video
        /* object-cover on phones too, not contain.
           The film is 2160x3840 — portrait. On a portrait screen the two
           proportions are near identical, so cover crops almost nothing while
           contain leaves black bars down the sides of any handset shorter
           than about 16:9. Cover fills the frame on every phone. */
        className="h-full w-full object-cover"
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        /* "metadata" fetches only the header and then waits, which on an
           autoplaying above-the-fold film is the opposite of what is wanted —
           it delays the very thing that is meant to start immediately. */
        preload="auto"
        aria-label="WULF yellow four-seater electric golf cart showcase"
      >
        {/* Phones take the narrower cut. No `type` is declared because f_auto
            lets Cloudinary answer with VP9 or H.264 depending on the browser,
            so asserting a container here would be a guess. */}
        {srcMobile && <source media="(max-width: 639px)" src={srcMobile} />}
        <source src={src} />
      </video>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/75"
      />

      {/* Facebook button, top-right on the banner. Offset below the fixed nav
          (h-16/h-20) so it never collides with the logo or the menu. It aligns
          to the same 1600px gutter as the nav's right edge. */}
      <a
        href={site.facebook}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Wulf Golf Carts on Facebook"
        className="absolute right-5 top-[4.75rem] z-20 inline-flex items-center gap-2 rounded-full bg-[#1877F2] px-4 py-2 text-sm font-extrabold text-white shadow-lg ring-1 ring-white/20 transition-transform hover:-translate-y-0.5 sm:right-10 sm:top-[6rem] lg:right-16"
      >
        <FacebookGlyph className="h-4 w-4" />
        Facebook
      </a>

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
