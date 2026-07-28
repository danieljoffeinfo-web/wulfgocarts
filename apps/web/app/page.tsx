import { Hero } from "@/components/hero";
import { Reveal, Stagger, StaggerItem } from "@/components/reveal";
import { CartCard } from "@/components/cart-card";
import { Visit } from "@/components/visit";
import { FeatureHotspots } from "@/components/feature-hotspots";
import { carts, reasons } from "@/content/carts";
import { featureShots } from "@/content/features";
import { heroFilm } from "@/content/media";

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

      <section className="relative bg-white">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink/50">
              Wulf Golf Carts
            </p>
            <h2 className="mt-4 max-w-2xl text-3xl font-extrabold leading-[1.1] tracking-tight text-ink sm:text-5xl">
              We sell new carts.{" "}
              <span className="text-accent">
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

      {/* The range */}
      <section id="range" className="scroll-mt-20 bg-white py-24 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
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

      {/* Detail — annotated feature shots */}
      <section id="detail" className="scroll-mt-20 bg-white pb-24 sm:pb-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              In the detail
            </p>
            <h2 className="mt-3 max-w-lg text-3xl font-extrabold tracking-tight sm:text-4xl">
              The bits you only notice up close.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-ink/65">
              Tap any marker to see it magnified, and what it actually does.
            </p>
          </Reveal>

          <div className="mt-12">
            <FeatureHotspots shots={featureShots} />
          </div>
        </div>
      </section>

      {/* Why Wulf */}
      <section id="why" className="scroll-mt-20 bg-mist py-24 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
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
                  <span className="text-xs font-extrabold text-accent">
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
