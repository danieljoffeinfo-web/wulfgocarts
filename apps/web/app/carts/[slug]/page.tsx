import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { ColourPicker } from "@/components/colour-picker";
import { AssetSlot } from "@/components/asset-slot";
import { SpecSheet } from "@/components/spec-sheet";
import { Visit } from "@/components/visit";
import { carts, visibleAngles } from "@/content/carts";
import { productCopy, specGroups } from "@/content/specs";
import { site } from "@/content/site";

/** Pre-render every cart at build time; the range is small and static. */
export function generateStaticParams() {
  return carts
    .filter((cart) => cart.detailsAvailable !== false)
    .map((cart) => ({ slug: cart.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cart = carts.find((c) => c.slug === slug);
  if (!cart || cart.detailsAvailable === false) return {};

  const image = cart.colours?.[0]?.image ?? cart.image;

  return {
    /* Leads with the product and the price, since both are what someone
       scanning a results page is deciding on. */
    title: `${cart.name} Golf Cart${cart.price ? ` — ${cart.price}` : ""}`,
    description: `${cart.name} golf cart for sale in Cape Town. 5 kW AC motor, 51.2 V lithium battery, 80–100 km range. ${cart.price ? `${cart.price}. ` : ""}See it at our Montague Gardens showroom in Cape Town.`,
    alternates: { canonical: `/carts/${cart.slug}` },
    openGraph: {
      title: `${cart.name} Golf Cart${cart.price ? ` — ${cart.price}` : ""}`,
      description: `${cart.tagline} Electric golf cart for sale in Cape Town.`,
      url: `${site.domain}/carts/${cart.slug}`,
      type: "website",
      images: image ? [{ url: image, alt: cart.name }] : undefined,
    },
  };
}

export default async function CartPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cart = carts.find((c) => c.slug === slug);
  if (!cart || cart.detailsAvailable === false) notFound();

  /**
   * Product schema with a priced Offer. This is what lets a search result
   * carry the price and availability directly, which for a R185,000 purchase
   * filters out clicks from people who were never going to buy — and pulls
   * in the ones who were.
   */
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${cart.name} Golf Cart`,
    description: productCopy.paragraphs[0],
    /* Every published frame, so the Product carries the full image set. Runs
       through visibleAngles so structured data and page can never disagree:
       turn SHOW_GENERATED_ANGLES off and synthesised frames leave both. */
    image:
      cart.colours?.flatMap((c) => [
        c.image,
        ...visibleAngles(c).map((s) => s.src),
      ]) ?? [],
    brand: { "@type": "Brand", name: "WULF" },
    color: cart.colours?.map((c) => c.name).join(", "),
    offers: cart.priceZAR
      ? {
          "@type": "Offer",
          price: cart.priceZAR,
          priceCurrency: "ZAR",
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
          url: `${site.domain}/carts/${cart.slug}`,
          seller: { "@type": "AutoDealer", name: site.name },
        }
      : undefined,
    additionalProperty: specGroups.flatMap((group) =>
      group.rows.map((row) => ({
        "@type": "PropertyValue",
        name: row.label,
        value: row.value,
      }))
    ),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      {/* pt clears the fixed nav, which sits over the top of the page. */}
      <section className="bg-surface pt-28 sm:pt-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal y={16}>
            <Link
              href="/#range"
              className="text-sm font-bold text-body/50 underline-offset-4 transition-colors hover:text-accent-soft hover:underline"
            >
              ← Back to the range
            </Link>
          </Reveal>

          <div className="mt-8 grid gap-10 pb-20 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-14 sm:pb-24">
            <Reveal y={24}>
              <div className="overflow-hidden rounded-2xl border border-line bg-raised pb-6">
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
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-soft">
                  {cart.seats}
                </p>
                {/* "Golf Cart" is appended so the h1 states the product
                    category, not just the model name. */}
                <h1 className="mt-3 text-3xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
                  {cart.name} Golf Cart
                </h1>
                <p className="mt-4 max-w-md text-base leading-relaxed text-body/65 sm:text-lg">
                  {cart.tagline}
                </p>

                {cart.price && (
                  <div className="mt-8">
                    <p className="text-4xl font-extrabold tracking-tight text-accent-soft sm:text-5xl">
                      {cart.price}
                    </p>
                    {cart.priceNote && (
                      <p className="mt-2 text-xs font-bold uppercase tracking-wide text-body/45">
                        {cart.priceNote}
                      </p>
                    )}
                  </div>
                )}

                <ul className="mt-8 space-y-3 border-t border-line pt-8">
                  {cart.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-3 text-sm text-body/75 sm:text-base"
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
                  <Link
                    href={`/quote?model=${cart.slug}`}
                    className="rounded-full bg-accent px-7 py-3.5 text-sm font-extrabold text-white transition-all hover:-translate-y-0.5 hover:bg-accent-deep"
                  >
                    Build a quote
                  </Link>
                  <a
                    href="#visit"
                    className="rounded-full border border-line px-7 py-3.5 text-sm font-extrabold text-body transition-all hover:-translate-y-0.5 hover:border-accent"
                  >
                    Book a viewing
                  </a>
                  <a
                    href={`tel:${site.phoneHref}`}
                    className="text-sm font-bold text-body/70 underline-offset-4 transition-colors hover:text-accent-soft hover:underline"
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
      <section className="bg-canvas py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Reveal>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              {productCopy.heading}
            </h2>
            <div className="mt-8">
              {productCopy.paragraphs.map((para) => (
                <p
                  key={para.slice(0, 32)}
                  className="mb-5 text-base leading-relaxed text-body/70 last:mb-0 sm:text-lg"
                >
                  {para}
                </p>
              ))}
            </div>
            <p className="mt-10 text-xl font-extrabold tracking-tight text-accent-soft sm:text-2xl">
              {productCopy.closer}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Specification */}
      <section className="bg-surface py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-soft">
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
