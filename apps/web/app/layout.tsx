import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { site } from "@/content/site";
import { carts } from "@/content/carts";
import { keywords } from "@/content/seo";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

/**
 * Social preview card. Cropped to 1200x630 by Cloudinary rather than shipping
 * a separate asset, so it stays in step with the product photography.
 */
const ogImage =
  "https://res.cloudinary.com/dmanxetyl/image/upload/c_fill,g_auto,w_1200,h_630/v1785709138/Image_neyitk.jpg";

/**
 * Titles lead with what someone actually searches for, not the brand — very
 * few people search "Wulf Golf Carts", many search "golf carts for sale".
 * The brand goes last, where it still builds recognition in results.
 *
 * The default is deliberately 50 characters, comfortably inside the ~60 that
 * Google renders before it truncates, so the exact-match phrase and the city
 * both survive into the results page instead of being cut to an ellipsis.
 */
const TITLE = `Golf Carts for Sale in Cape Town | ${site.name}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: TITLE,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords,
  category: "Golf carts for sale",
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: site.description,
    url: site.domain,
    siteName: site.name,
    locale: "en_ZA",
    type: "website",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "WULF electric golf cart for sale in Cape Town",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: site.description,
    images: [ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

/**
 * What the dealer has for sale, as a schema.org OfferCatalog.
 *
 * This is the piece that does the work for "golf carts for sale": it hands a
 * crawler a machine-readable list of the actual products, each with a price,
 * a currency and an availability, attached to the business rather than buried
 * on a detail page. Built from content/carts.ts, so adding a cart to the
 * range adds it here — the catalogue can never quietly fall behind the floor.
 */
const offerCatalog = {
  "@type": "OfferCatalog",
  name: "Golf carts for sale",
  itemListElement: carts
    .filter((cart) => cart.priceZAR)
    .map((cart, i) => ({
      "@type": "Offer",
      position: i + 1,
      price: cart.priceZAR,
      priceCurrency: "ZAR",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      url:
        cart.detailsAvailable === false
          ? `${site.domain}/golf-carts-for-sale`
          : `${site.domain}/carts/${cart.slug}`,
      itemOffered: {
        "@type": cart.kind === "accessory" ? "Product" : "Car",
        name: cart.name,
        description: cart.tagline,
        brand: { "@type": "Brand", name: "WULF" },
        ...(cart.kind === "accessory"
          ? {}
          : {
              vehicleEngine: {
                "@type": "EngineSpecification",
                engineType: "5 kW AC electric",
              },
              fuelType: "Electric",
              numberOfDoors: 0,
              vehicleSeatingCapacity: cart.seats === "4 seater" ? 4 : 2,
            }),
        ...(cart.colours?.length
          ? { color: cart.colours.map((c) => c.name).join(", ") }
          : {}),
      },
    })),
};

/**
 * Structured data for the showroom.
 *
 * The whole site exists to get someone to drive to the showroom, so telling
 * search engines the address, phone number and opening hours in a form they
 * can render directly in results is worth more here than on most sites.
 * Built from content/site.ts so it cannot drift from the visible page.
 */
const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AutoDealer",
      "@id": `${site.domain}/#montague`,
      name: `${site.name} — Montague Gardens`,
      description: site.description,
      url: site.domain,
      telephone: site.phoneHref,
      email: site.email,
      image: ogImage,
      logo: ogImage,
      slogan: site.tagline,
      priceRange: "R175,750–R207,431",
      currenciesAccepted: "ZAR",
      paymentAccepted: "Cash, EFT, Bank finance, Operating rental, Lease",
      /* The Facebook page, so the brand entity in Google's index resolves to
         one business rather than to two unlinked profiles. */
      sameAs: [site.facebook],
      /* The subject matter this dealer is an authority on. Cheap to state,
         and it is what an entity-based ranker reads rather than the keywords
         meta tag it stopped looking at a decade ago. */
      knowsAbout: [
        "Electric golf carts",
        "Lithium golf cart batteries",
        "Golf cart sales and finance",
        "Golf cart trailers",
      ],
      hasOfferCatalog: offerCatalog,
      areaServed: [
        { "@type": "City", name: "Cape Town" },
        { "@type": "City", name: "Kuils River" },
        { "@type": "City", name: "Durbanville" },
        { "@type": "City", name: "Somerset West" },
        { "@type": "City", name: "Stellenbosch" },
        { "@type": "AdministrativeArea", name: "Western Cape" },
        { "@type": "Country", name: "South Africa" },
      ],
      address: {
        "@type": "PostalAddress",
        streetAddress: "21 Montague Drive",
        addressLocality: "Montague Gardens",
        addressRegion: "Western Cape",
        postalCode: "7441",
        addressCountry: "ZA",
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
          ],
          opens: "08:00",
          closes: "17:00",
        },
      ],
    },
    {
      // Second branch. Viewing is by appointment only, so no opening hours are
      // published — stating hours a walk-in can't rely on would misinform.
      "@type": "AutoDealer",
      "@id": `${site.domain}/#blackheath`,
      name: `${site.name} — Blackheath`,
      description: site.description,
      url: site.domain,
      telephone: "+27615367310",
      email: site.email,
      image: ogImage,
      priceRange: "R175,750–R207,431",
      currenciesAccepted: "ZAR",
      sameAs: [site.facebook],
      hasOfferCatalog: offerCatalog,
      areaServed: [
        { "@type": "City", name: "Kuils River" },
        { "@type": "City", name: "Brackenfell" },
        { "@type": "City", name: "Somerset West" },
        { "@type": "City", name: "Stellenbosch" },
        { "@type": "AdministrativeArea", name: "Western Cape" },
      ],
      address: {
        "@type": "PostalAddress",
        streetAddress: "Saxenburg Park – D2, 1 Chardonnay Rd, Wijnland Park",
        addressLocality: "Blackheath, Kuils River",
        addressRegion: "Western Cape",
        postalCode: "7560",
        addressCountry: "ZA",
      },
    },
    {
      /* The brand itself, linked to both branches. Without this, the two
         AutoDealer nodes look like two unrelated businesses that happen to
         share a name; with it, they are two locations of one dealer, which is
         what a knowledge panel needs to resolve. */
      "@type": "Organization",
      "@id": `${site.domain}/#organization`,
      name: site.name,
      alternateName: "WULF Golf Carts SA",
      url: site.domain,
      logo: ogImage,
      description: site.description,
      telephone: site.phoneHref,
      email: site.email,
      sameAs: [site.facebook],
      department: [
        { "@id": `${site.domain}/#montague` },
        { "@id": `${site.domain}/#blackheath` },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${site.domain}/#website`,
      url: site.domain,
      name: site.name,
      description: site.description,
      inLanguage: "en-ZA",
      publisher: { "@id": `${site.domain}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // en-ZA rather than en: it tells search engines this business serves
    // South Africa, which matters for a showroom nobody flies to.
    <html lang="en-ZA">
      <head>
        {/* Opened in the document head rather than beside the hero, so the DNS
            lookup and TLS handshake to Cloudinary are already done by the time
            the banner poster is requested. On a mobile connection that is a
            few hundred milliseconds off the first paint. */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body className={`${manrope.variable} font-sans`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd),
          }}
        />
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
