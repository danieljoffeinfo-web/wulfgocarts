"use client";

import { useState } from "react";

/**
 * Above-the-fold showroom film.
 *
 * This plays normally instead of seeking on scroll. That keeps the supplied
 * footage intact and makes the opening responsive even on slower phones.
 *
 * "Instant" is a layering trick, the same one Shopify and Squarespace use:
 * the poster is a plain preloaded <img>, so it is the Largest Contentful Paint
 * and shows the instant the HTML lands — no waiting on video metadata. The
 * film sits on top at opacity-0 and crossfades in the moment it can play. The
 * visitor sees a finished frame immediately and never a black box or a pop.
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
  const [playing, setPlaying] = useState(false);

  return (
    <section className="relative h-[82svh] min-h-[34rem] overflow-hidden bg-black sm:h-[100svh]">
      {/* React hoists these into <head>, so the browser starts fetching before
          it has parsed this far down the document.

          The poster is what the visitor actually sees first, so it is fetched
          at high priority. preconnect opens the TLS handshake to Cloudinary in
          parallel rather than after the first request resolves — on a mobile
          connection that alone is a few hundred milliseconds off the wait. */}
      <link rel="preconnect" href="https://res.cloudinary.com" />
      <link rel="preload" as="image" href={poster} fetchPriority="high" />

      {/* The poster as a real image element, painted immediately as the LCP.
          It stays mounted underneath the film so the handoff is a crossfade,
          not a swap. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <video
        /* object-cover on phones too, not contain.
           The film is 2160x3840 — portrait. On a portrait screen the two
           proportions are near identical, so cover crops almost nothing while
           contain leaves black bars down the sides of any handset shorter
           than about 16:9. Cover fills the frame on every phone. */
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${
          playing ? "opacity-100" : "opacity-0"
        }`}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        /* "metadata" fetches only the header and then waits, which on an
           autoplaying above-the-fold film is the opposite of what is wanted —
           it delays the very thing that is meant to start immediately. */
        preload="auto"
        /* Fade in on the first painted frame. onPlaying is the reliable signal
           that pixels are on screen; the others are belt-and-braces so the
           film can never get stuck invisible if one event is missed. */
        onPlaying={() => setPlaying(true)}
        onCanPlay={() => setPlaying(true)}
        onLoadedData={() => setPlaying(true)}
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
