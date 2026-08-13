import { Hero } from "@/components/hero";
import { Reveal, Stagger, StaggerItem } from "@/components/reveal";
import { CartCard } from "@/components/cart-card";
import { FeatureHotspots } from "@/components/feature-hotspots";
import { ScrollScrub } from "@/components/scroll-scrub";
import { SpecSheet } from "@/components/spec-sheet";
import { Visit } from "@/components/visit";
import { carts, reasons } from "@/content/carts";
import { featureShots } from "@/content/features";
import { productCopy } from "@/content/specs";
import { heroFilm, assemblyFilm } from "@/content/media";

/**
 * Hero film source.
 *
 * Two cuts of the same camera move, both on Cloudinary. The landscape one
 * crops badly on a phone under object-cover, so portrait viewports get the
 * natively vertical version; ScrollScrub picks between them by viewport shape.
 *
 * The env vars still win when set — that is the escape hatch for serving a
 * locally encoded copy (scripts/encode-scrub.sh) from /public if the scrub
 * needs denser keyframes than the source has.
 */
const HERO_FILM = process.env.NEXT_PUBLIC_HERO_FILM || heroFilm.landscape;
const HERO_FILM_PORTRAIT =
  process.env.NEXT_PUBLIC_HERO_FILM_PORTRAIT || heroFilm.portrait;
const HERO_POSTER = process.env.NEXT_PUBLIC_HERO_POSTER || undefined;
const HERO_POSTER_PORTRAIT =
  process.env.NEXT_PUBLIC_HERO_POSTER_PORTRAIT || undefined;

export default function HomePage() {
  return (
    <>
      <Hero
        src={HERO_FILM}
        srcPortrait={HERO_FILM_PORTRAIT}
        poster={HERO_POSTER}
        posterPortrait={HERO_POSTER_PORTRAIT}
      />

      <section className="relative bg-canvas">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-body/50">
              {productCopy.heading}
            </p>
            {/* The page's real h1: what is sold, and where. It carries the
                phrase people actually search while still reading as copy. */}
            <h1 className="mt-4 max-w-3xl text-3xl font-extrabold leading-[1.1] tracking-tight text-body sm:text-5xl">
              Electric golf carts for sale in Cape Town.{" "}
              <span className="text-accent-soft">
                We&apos;d rather you came and saw them.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-body/65 sm:text-lg">
              Wulf Golf Carts is a golf cart dealer in Montague Gardens, Cape
              Town,
              selling the new WULF 2-Seater electric golf cart — lithium
              powered, street-ready and built for the course, the estate and
              everything in between. Have a look online first, then come
              through to the showroom and take one out properly.
            </p>
          </Reveal>
        </div>
      </section>

      {/* The cart — card alongside the long-form copy */}
      <section id="range" className="scroll-mt-20 bg-surface py-24 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-soft">
              The range
            </p>
            <h2 className="mt-3 max-w-xl text-3xl font-extrabold tracking-tight sm:text-4xl">
              Built for the course, the estate and everything between.
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
            <Stagger>
              {carts.map((cart) => (
                <StaggerItem key={cart.slug}>
                  <CartCard cart={cart} />
                </StaggerItem>
              ))}
            </Stagger>

            <Reveal delay={0.12}>
              <div className="lg:pt-2">
                {productCopy.paragraphs.map((para) => (
                  <p
                    key={para.slice(0, 32)}
                    className="mb-5 text-base leading-relaxed text-body/70 last:mb-0"
                  >
                    {para}
                  </p>
                ))}
                <p className="mt-8 text-xl font-extrabold tracking-tight text-accent-soft sm:text-2xl">
                  {productCopy.closer}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Detail — annotated feature shots */}
      <section id="detail" className="scroll-mt-20 bg-canvas py-24 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-soft">
              In the detail
            </p>
            <h2 className="mt-3 max-w-lg text-3xl font-extrabold tracking-tight sm:text-4xl">
              The bits you only notice up close.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-body/65">
              Tap any marker to see it magnified, and what it actually does.
            </p>
          </Reveal>

          <div className="mt-12">
            <FeatureHotspots shots={featureShots} />
          </div>
        </div>
      </section>

      {/* Assembly film — the visitor's scroll drives the build */}
      <section id="build" className="scroll-mt-20 bg-canvas pt-24 sm:pt-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-soft">
              How it comes together
            </p>
            <h2 className="mt-3 max-w-lg text-3xl font-extrabold tracking-tight sm:text-4xl">
              Every part, in its place.
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-body/65">
              Keep scrolling to build it.
            </p>
          </Reveal>
        </div>

        {/* contain, not cover: this is a studio layout where cropping would
            push parts out of frame. The white stage matches the film's own
            backdrop, so the letterboxing never shows. */}
        <ScrollScrub
          src={assemblyFilm.src}
          poster={assemblyFilm.poster}
          scrollLength={260}
          scrollLengthPortrait={200}
          fit="contain"
          stageClassName="bg-white"
          className="mt-8"
        />

        {/* The sheet lands straight out of the assembly, while the visitor is
            still looking at what the parts add up to. */}
        <div className="mx-auto max-w-6xl px-5 pb-24 sm:px-8 sm:pb-28">
          <Reveal>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-accent-soft">
              Specification
            </h3>
            <p className="mt-3 max-w-lg text-2xl font-extrabold tracking-tight sm:text-3xl">
              What it adds up to.
            </p>
          </Reveal>
          <div className="mt-10">
            <SpecSheet />
          </div>
        </div>
      </section>

      {/* Why Wulf */}
      <section id="why" className="scroll-mt-20 bg-surface py-24 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-soft">
              Why Wulf
            </p>
            <h2 className="mt-3 max-w-lg text-3xl font-extrabold tracking-tight sm:text-4xl">
              Buy from people who know the carts.
            </h2>
          </Reveal>

          <Stagger className="mt-12 grid gap-4 sm:grid-cols-2">
            {reasons.map((reason, i) => (
              <StaggerItem key={reason.title}>
                <div className="flex h-full flex-col rounded-2xl border border-line bg-raised p-7">
                  <span className="text-xs font-extrabold text-accent-soft">
                    0{i + 1}
                  </span>
                  <h3 className="mt-3 text-xl font-extrabold tracking-tight">
                    {reason.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-body/60">
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
