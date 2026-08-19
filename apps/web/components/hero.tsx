"use client";

import { useEffect, useState } from "react";

/**
 * Above-the-fold showroom film.
 *
 * This plays normally instead of seeking on scroll. That keeps the supplied
 * footage intact and makes the opening responsive even on slower phones.
 *
 * Why this feels instant, which is the same shape Shopify and Squarespace use:
 *
 * 1. The poster is a plain preloaded <img>, so it is the Largest Contentful
 *    Paint and lands as soon as the HTML does — nothing waits on video
 *    metadata, which is the usual cause of a black hero.
 * 2. The film does not compete with it. A <video preload="auto"> starts
 *    pulling megabytes the moment it is parsed, in parallel with the poster,
 *    and on a phone that starves the one image that has to arrive first. So
 *    the sources are withheld until the page has finished loading, and only
 *    then attached. The poster wins the network every time.
 * 3. The film crossfades in over the poster once it can play, so the handoff
 *    is a dissolve rather than a pop.
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
  /** Sources attached — i.e. the film is allowed to start downloading. */
  const [armed, setArmed] = useState(false);
  /** Film has painted a frame, so it can be faded up over the poster. */
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    };
    const conn = nav.connection;

    /* On data saver, a 2G-class connection, or reduced motion, the poster is
       the whole picture: it already shows the cart, and a background film is
       not worth several megabytes of someone's bundle or an animation they
       asked not to see. The hero simply stays a still. */
    if (conn?.saveData) return;
    if (conn?.effectiveType && /(^|-)2g$/.test(conn.effectiveType)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    /* Wait for load, not mount: by then the poster and the rest of the
       critical path are done, so the film gets the bandwidth to itself. On a
       fast connection that is a few hundred milliseconds and invisible. */
    if (document.readyState === "complete") {
      setArmed(true);
      return;
    }
    const start = () => setArmed(true);
    window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, []);

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
          not a swap. Decoded synchronously so it paints on the frame it
          arrives rather than a frame or two later. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Mounted only once armed, sources and all, so the browser runs its
          resource selection exactly once and fetches the film exactly once.
          Attaching sources to an already-parsed <video> instead would need a
          load() call, and that aborts and restarts whatever is already in
          flight — a duplicate download of the whole film on the very
          connection this is meant to protect. */}
      {armed && (
      <video
        /* object-cover on phones too, not contain.
           The film is 2160x3840 — portrait. On a portrait screen the two
           proportions are near identical, so cover crops almost nothing while
           contain leaves black bars down the sides of any handset shorter
           than about 16:9. Cover fills the frame on every phone. */
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${
          playing ? "opacity-100" : "opacity-0"
        }`}
        autoPlay
        muted
        loop
        playsInline
        /* No poster attribute: the <img> above already holds that frame, and
           setting it here makes the browser fetch the same file a second time
           on the video's own account. */
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
      )}

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
