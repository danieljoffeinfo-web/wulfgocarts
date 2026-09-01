import type { Metadata } from "next";
import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/reveal";
import { CartCard } from "@/components/cart-card";
import { SpecSheet } from "@/components/spec-sheet";
import { Visit } from "@/components/visit";
import { carts, reasons } from "@/content/carts";
import { headlineStats } from "@/content/specs";
import { areasServed, faqs, keywords, useCases } from "@/content/seo";
import { site } from "@/content/site";
import { WhatsAppGlyph } from "@/components/icons";

/**
 * The catalogue page.
 *
 * The homepage sells the brand; this page answers a search. Someone typing
 * "golf carts for sale" wants a list, a price against each thing on it, and
 * an address — in that order — so that is the order the page is built in.
 *
 * The URL is the exact phrase. That is not a trick: it is a page whose entire
 * subject is the golf carts this business has for sale, and the slug says so.
 * Everything below it is content that exists nowhere else on the site — the
 * price table, the use cases, the areas served and the FAQ — so it earns its
 * place in the index rather than competing with the homepage for the same
 * words with the same copy.
 */

/**
 * `absolute`, so the root layout does not append "| Wulf Golf Carts" on top
 * of this and push it past the ~60 characters Google renders. The brand is
 * still in the title — it is just doing the work at the end rather than
 * costing twenty characters that the price could have used.
 */
const TITLE = "Golf Carts for Sale in Cape Town — from R175,750 | Wulf";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description:
    "Electric golf carts for sale in Cape Town from R175,750 incl. VAT. Lithium 2-seater and lifted 4-seater carts, 80–100 km range, finance available. Two showrooms — come and drive one.",
  keywords,
  alternates: { canonical: "/golf-carts-for-sale" },
  openGraph: {
    title: TITLE,
    description:
      "Electric golf carts for sale in Cape Town from R175,750 incl. VAT. Lithium 2-seater and lifted 4-seater carts. Two showrooms — come and drive one.",
    url: `${site.domain}/golf-carts-for-sale`,
    type: "website",
  },
};

/** Every priced item, for the on-page table and the ItemList schema. */
const priced = carts.filter((cart) => cart.priceZAR);

/** Where a given product's own page lives, or this page if it has none. */
const hrefFor = (slug: string, hasDetails: boolean) =>
  hasDetails ? `/carts/${slug}` : `/golf-carts-for-sale#range`;

export default function GolfCartsForSalePage() {
  /**
   * Three graphs, one script.
   *
   * - BreadcrumbList so results render "wulfgocarts › Golf carts for sale"
   *   rather than a bare URL.
   * - ItemList of the priced range, which is what a shopping-style result set
   *   reads to decide this page is a catalogue and not an article.
   * - FAQPage, mirroring the questions rendered further down. Google drops
   *   FAQ markup with no visible counterpart, so these are the same strings.
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: site.domain,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Golf carts for sale",
            item: `${site.domain}/golf-carts-for-sale`,
          },
        ],
      },
      {
        "@type": "ItemList",
        name: "Golf carts for sale in Cape Town",
        numberOfItems: priced.length,
        itemListElement: priced.map((cart, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Product",
            name: cart.name,
            description: cart.tagline,
            brand: { "@type": "Brand", name: "WULF" },
            url: `${site.domain}${hrefFor(
              cart.slug,
              cart.detailsAvailable !== false
            )}`,
            offers: {
              "@type": "Offer",
              price: cart.priceZAR,
              priceCurrency: "ZAR",
              availability: "https://schema.org/InStock",
              itemCondition: "https://schema.org/NewCondition",
              seller: { "@id": `${site.domain}/#organization` },
            },
          },
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Header ──────────────────────────────────────────────────────
          No film here. Someone who arrived from a search for a price wants
          the answer above the fold, not a thirty-second brand moment. */}
      <section className="bg-canvas pt-28 sm:pt-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            {/* Visible breadcrumb, matching the schema above it. */}
            <nav aria-label="Breadcrumb" className="text-xs font-bold text-body/40">
              <Link href="/" className="underline-offset-4 hover:text-accent-soft hover:underline">
                Home
              </Link>
              <span className="mx-2" aria-hidden>
                /
              </span>
              <span className="text-body/60">Golf carts for sale</span>
            </nav>

            <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-accent-soft">
              Golf cart dealer · Cape Town, South Africa
            </p>
            <h1 className="mt-4 max-w-4xl text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-body sm:text-6xl">
              Golf carts for sale in Cape Town.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-body/70 sm:text-lg">
              Wulf Golf Carts sells premium electric golf carts from two
              showrooms in Cape Town — a lithium 2-seater at R175,750 and a
              lifted 4-seater at R207,431, both including VAT. Every cart for
              sale here runs a 5&nbsp;kW AC motor and a 51.2&nbsp;V lithium
              pack, covers 80–100&nbsp;km on a charge, and is on the floor to
              be driven before you buy it.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/quote"
                className="rounded-full bg-accent px-7 py-3.5 text-sm font-extrabold text-white transition-all hover:-translate-y-0.5 hover:bg-accent-deep"
              >
                Build a quote
              </Link>
              {site.whatsapp && (
                <a
                  href={site.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-extrabold text-[#04301b] transition-all hover:-translate-y-0.5 hover:bg-[#1ebe5b]"
                >
                  <WhatsAppGlyph className="h-[18px] w-[18px]" />
                  WhatsApp us
                </a>
              )}
              <a
                href="#visit"
                className="rounded-full border border-line px-7 py-3.5 text-sm font-extrabold text-body transition-all hover:-translate-y-0.5 hover:border-accent"
              >
                Visit a showroom
              </a>
            </div>
          </Reveal>

          {/* The four figures a buyer compares between carts, stated once at
              the top so the page answers "is this the right cart" before it
              asks for a drive to Montague Gardens. */}
          <Stagger className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
            {headlineStats.map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="h-full bg-raised p-6">
                  <p className="text-2xl font-extrabold tracking-tight text-accent-soft sm:text-3xl">
                    {stat.value}
                    {stat.unit && (
                      <span className="ml-1 text-base font-bold text-body/50">
                        {stat.unit}
                      </span>
                    )}
                  </p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-wide text-body/45">
                    {stat.label}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── Price list ──────────────────────────────────────────────────
          A plain table. Unglamorous, and the single most-read thing on the
          page — a crawler reads it as a catalogue and a buyer reads it as the
          answer to the only question they arrived with. */}
      <section className="bg-canvas py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Golf cart prices
            </h2>
            <p className="mt-3 max-w-lg text-base leading-relaxed text-body/65">
              What each cart costs, VAT included. Finance, operating rental and
              lease are all available subject to approval.
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mt-8 overflow-x-auto rounded-2xl border border-line">
              <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
                <caption className="sr-only">
                  Electric golf carts and trailers for sale at Wulf Golf Carts,
                  Cape Town, with prices in South African Rand including VAT
                </caption>
                <thead>
                  <tr className="bg-surface text-xs font-bold uppercase tracking-widest text-body/45">
                    <th scope="col" className="px-6 py-4">
                      Model
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Availability
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {priced.map((cart) => (
                    <tr key={cart.slug} className="border-t border-line bg-raised">
                      <th scope="row" className="px-6 py-5 font-extrabold text-body">
                        <Link
                          href={hrefFor(cart.slug, cart.detailsAvailable !== false)}
                          className="underline-offset-4 hover:text-accent-soft hover:underline"
                        >
                          {cart.name}
                        </Link>
                      </th>
                      <td className="px-6 py-5 text-body/60">
                        {cart.seats ?? cart.category}
                      </td>
                      <td className="px-6 py-5">
                        <span className="font-extrabold text-accent-soft">
                          {cart.price}
                        </span>{" "}
                        {cart.priceNote && (
                          <span className="text-xs text-body/40">
                            {cart.priceNote}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-5 text-body/60">In stock</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── The range ───────────────────────────────────────────────────── */}
      <section id="range" className="scroll-mt-20 bg-surface py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-soft">
              The range
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
              Every electric golf cart we have for sale.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-body/65">
              Two carts and a trailer, in five colours. Photographs of the
              actual stock, not renders — see the{" "}
              <Link
                href="/gallery"
                className="font-bold text-accent-soft underline-offset-4 hover:underline"
              >
                full golf cart gallery
              </Link>{" "}
              for every angle of every colourway.
            </p>
          </Reveal>

          <Stagger className="mt-12 grid gap-6 md:grid-cols-2">
            {carts.map((cart) => (
              <StaggerItem key={cart.slug} className="h-full">
                <CartCard cart={cart} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── Who buys them ───────────────────────────────────────────────
          Long-tail intent, answered as prose. Someone searching "golf cart
          for a farm" or "estate buggy for sale" lands on the paragraph that
          describes their own situation rather than a generic product page. */}
      <section className="bg-canvas py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-soft">
              What people buy them for
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
              A golf cart that is not only for golf.
            </h2>
          </Reveal>

          <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {useCases.map((useCase) => (
              <StaggerItem key={useCase.title}>
                <div className="flex h-full flex-col rounded-2xl border border-line bg-raised p-7">
                  <h3 className="text-lg font-extrabold tracking-tight">
                    {useCase.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-body/60">
                    {useCase.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── Why buy here ────────────────────────────────────────────────── */}
      <section className="bg-surface py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-soft">
              Buying a golf cart in Cape Town
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
              What to look at before you buy.
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

      {/* ── Specification ───────────────────────────────────────────────── */}
      <section className="bg-canvas py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-soft">
              Specification
            </p>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Full electric golf cart specification.
            </h2>
          </Reveal>
          <div className="mt-10">
            <SpecSheet />
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────
          Rendered as <details>, so every answer is in the HTML whether or not
          it is open — which is what the FAQPage markup above is asserting,
          and what a crawler reads. No JavaScript involved. */}
      <section id="faq" className="scroll-mt-20 bg-surface py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-soft">
              Questions
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Golf carts for sale — the questions we get asked.
            </h2>
          </Reveal>

          <div className="mt-10 divide-y divide-line border-y border-line">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-5">
                {/* `list-none` kills the disclosure triangle in Chrome and
                    Firefox; Safari draws its own via ::-webkit-details-marker
                    and ignores list-style, so that one needs the arbitrary
                    variant. Without both, Safari shows a stray triangle beside
                    the custom +/× glyph. */}
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-body [&::-webkit-details-marker]:hidden">
                  <h3 className="text-base font-extrabold tracking-tight">
                    {faq.question}
                  </h3>
                  <span
                    aria-hidden
                    className="mt-1 shrink-0 text-accent-soft transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-body/65">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Areas served ────────────────────────────────────────────────
          One honest paragraph rather than a fan of thin per-suburb pages.
          It gives "golf carts for sale near me" real place names to match on
          without building the kind of doorway network that gets a small site
          buried instead of found. */}
      <section className="bg-canvas py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Reveal>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Where we sell golf carts
            </h2>
            <p className="mt-5 text-base leading-relaxed text-body/65">
              Our Montague Gardens showroom sits ten minutes off the N1 and N7,
              and the Blackheath branch covers the far side of the metro, so
              between the two we are a short drive from{" "}
              {areasServed.slice(0, -1).join(", ")} and {areasServed.at(-1)}.
              Buyers come to us from across the Western Cape and the rest of
              South Africa — call{" "}
              <a
                href={`tel:${site.phoneHref}`}
                className="font-bold text-accent-soft underline-offset-4 hover:underline"
              >
                {site.phone}
              </a>{" "}
              if you are travelling and want a cart held for you to see.
            </p>
          </Reveal>
        </div>
      </section>

      <Visit />
    </>
  );
}
