import { Hero } from "@/components/hero";
import { Reveal, Stagger, StaggerItem } from "@/components/reveal";
import { CartCard } from "@/components/cart-card";
import { Visit } from "@/components/visit";
import { carts, capabilities, reasons } from "@/content/carts";

/** Higgsfield 720p render — the plan ceiling on `starter`. */
const HIGGSFIELD_RENDER_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_3CdVP8uyiMnLQzUlH6RnH8yZa5a/hf_20260728_065010_64a29726-b2ae-42f5-ba16-673c37e6f1ba.mp4";

/**
 * Hero film source.
 *
 * Production wants the film self-hosted: download the render, run it through
 * scripts/encode-scrub.sh, drop it at public/hero/scrub.mp4 and set
 * NEXT_PUBLIC_HERO_FILM=/hero/scrub.mp4. That encode makes every frame a
 * keyframe, which is what stops the scrub juddering.
 *
 * The fallback points straight at the Higgsfield CDN so the effect is live
 * without a download step. It scrubs less smoothly and leans on a third-party
 * CDN — fine for review, swap it before launch.
 */
const HERO_FILM =
  process.env.NEXT_PUBLIC_HERO_FILM || HIGGSFIELD_RENDER_URL;
const HERO_POSTER = process.env.NEXT_PUBLIC_HERO_POSTER || undefined;

export default function HomePage() {
  return (
    <>
      <Hero src={HERO_FILM} poster={HERO_POSTER} />

      <section className="relative bg-white">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink/50">
              Wulf Golf Carts
            </p>
            <h2 className="mt-4 max-w-2xl text-3xl font-extrabold leading-[1.1] tracking-tight text-ink sm:text-5xl">
              We sell new carts.{" "}
              <span className="text-amber-deep">
                We&apos;d rather you came and saw them.
              </span>
            </h2>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-ink/65 sm:text-lg">
              The whole range is on the floor at our showroom. Have a look
              online first, then come through and take one out properly.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Capability strip */}
      <section
        aria-hidden="true"
        className="overflow-hidden border-y border-line bg-mist py-4"
      >
        <div className="flex w-max animate-marquee gap-10">
          {[...capabilities, ...capabilities].map((c, i) => (
            <span
              key={i}
              className="flex items-center gap-10 whitespace-nowrap text-sm font-bold text-ink/50"
            >
              {c}
              <span className="text-amber">///</span>
            </span>
          ))}
        </div>
      </section>

      {/* The range */}
      <section id="range" className="scroll-mt-20 bg-white py-24 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-deep">
              The range
            </p>
            <h2 className="mt-3 max-w-lg text-3xl font-extrabold tracking-tight sm:text-4xl">
              Built for the course, the estate and everything between.
            </h2>
          </Reveal>

          <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {carts.map((cart) => (
              <StaggerItem key={cart.slug} className="h-full">
                <CartCard cart={cart} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Why Wulf */}
      <section id="why" className="scroll-mt-20 bg-mist py-24 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-deep">
              Why Wulf
            </p>
            <h2 className="mt-3 max-w-lg text-3xl font-extrabold tracking-tight sm:text-4xl">
              Buy from people who know the carts.
            </h2>
          </Reveal>

          <Stagger className="mt-12 grid gap-4 sm:grid-cols-2">
            {reasons.map((reason, i) => (
              <StaggerItem key={reason.title}>
                <div className="flex h-full flex-col rounded-2xl border border-line bg-white p-7">
                  <span className="text-xs font-extrabold text-amber">
                    0{i + 1}
                  </span>
                  <h3 className="mt-3 text-xl font-extrabold tracking-tight">
                    {reason.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/60">
                    {reason.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <Visit />
    </>
  );
}
