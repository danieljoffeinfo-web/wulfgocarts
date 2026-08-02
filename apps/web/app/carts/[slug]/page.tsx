import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { ColourPicker } from "@/components/colour-picker";
import { AssetSlot } from "@/components/asset-slot";
import { SpecSheet } from "@/components/spec-sheet";
import { Visit } from "@/components/visit";
import { carts } from "@/content/carts";
import { productCopy } from "@/content/specs";
import { site } from "@/content/site";

/** Pre-render every cart at build time; the range is small and static. */
export function generateStaticParams() {
  return carts.map((cart) => ({ slug: cart.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cart = carts.find((c) => c.slug === slug);
  if (!cart) return {};

  return {
    title: cart.name,
    description: `${cart.tagline} ${cart.price ? `From ${cart.price}.` : ""} See it at the ${site.name} showroom in Blackheath, Cape Town.`,
  };
}

export default async function CartPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cart = carts.find((c) => c.slug === slug);
  if (!cart) notFound();

  return (
    <>
      {/* pt clears the fixed nav, which sits over the top of the page. */}
      <section className="bg-mist pt-28 sm:pt-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal y={16}>
            <Link
              href="/#range"
              className="text-sm font-bold text-ink/50 underline-offset-4 transition-colors hover:text-accent hover:underline"
            >
              ← Back to the range
            </Link>
          </Reveal>

          <div className="mt-8 grid gap-10 pb-20 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-14 sm:pb-24">
            <Reveal y={24}>
              <div className="overflow-hidden rounded-2xl border border-line bg-white pb-6">
                {cart.colours?.length ? (
                  <ColourPicker
                    colours={cart.colours}
                    alt={cart.name}
                    aspect="4 / 3"
                    swatchClassName="px-6 pt-6"
                  />
                ) : (
                  <AssetSlot
                    src={cart.image}
                    alt={cart.name}
                    label={`${cart.seats} photo`}
                    aspect="4 / 3"
                    className="rounded-none"
                  />
                )}
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                  {cart.seats}
                </p>
                <h1 className="mt-3 text-3xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
                  {cart.name}
                </h1>
                <p className="mt-4 max-w-md text-base leading-relaxed text-ink/65 sm:text-lg">
                  {cart.tagline}
                </p>

                {cart.price && (
                  <p className="mt-8 text-4xl font-extrabold tracking-tight text-accent sm:text-5xl">
                    {cart.price}
                  </p>
                )}

                <ul className="mt-8 space-y-3 border-t border-line pt-8">
                  {cart.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-3 text-sm text-ink/75 sm:text-base"
                    >
                      <span
                        aria-hidden
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                      />
                      {h}
                    </li>
                  ))}
                </ul>

                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <a
                    href="#visit"
                    className="rounded-full bg-accent px-7 py-3.5 text-sm font-extrabold text-white transition-all hover:-translate-y-0.5 hover:bg-accent-deep"
                  >
                    Book a viewing
                  </a>
                  <a
                    href={`tel:${site.phoneHref}`}
                    className="text-sm font-bold text-ink/70 underline-offset-4 transition-colors hover:text-accent hover:underline"
                  >
                    {site.phone} →
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Long-form copy */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Reveal>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              {productCopy.heading}
            </h2>
            <div className="mt-8">
              {productCopy.paragraphs.map((para) => (
                <p
                  key={para.slice(0, 32)}
                  className="mb-5 text-base leading-relaxed text-ink/70 last:mb-0 sm:text-lg"
                >
                  {para}
                </p>
              ))}
            </div>
            <p className="mt-10 text-xl font-extrabold tracking-tight text-accent sm:text-2xl">
              {productCopy.closer}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Specification */}
      <section className="bg-mist py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Specification
            </p>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
              What it adds up to.
            </h2>
          </Reveal>
          <div className="mt-10">
            <SpecSheet />
          </div>
        </div>
      </section>

      <Visit />
    </>
  );
}
