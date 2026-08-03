import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { site } from "@/content/site";
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
 * few people search "Wulf Golf Carts", many search "electric golf carts Cape
 * Town". The brand goes last, where it still builds recognition in results.
 */
export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: `Electric Golf Carts for Sale in Cape Town | ${site.name}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "golf carts for sale Cape Town",
    "electric golf carts South Africa",
    "golf cart dealer Cape Town",
    "lithium golf cart",
    "buy golf cart Cape Town",
    "street legal golf cart South Africa",
    "WULF golf carts",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: `Electric Golf Carts for Sale in Cape Town | ${site.name}`,
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
        alt: "WULF 2-Seater electric golf cart",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Electric Golf Carts for Sale in Cape Town | ${site.name}`,
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
 * Structured data for the showroom.
 *
 * The whole site exists to get someone to drive to the showroom, so telling
 * search engines the address, phone number and opening hours in a form they
 * can render directly in results is worth more here than on most sites.
 * Built from content/site.ts so it cannot drift from the visible page.
 */
const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  name: site.name,
  description: site.description,
  url: site.domain,
  telephone: site.phoneHref,
  email: site.email,
  image: ogImage,
  priceRange: "R185,000",
  areaServed: [
    { "@type": "City", name: "Cape Town" },
    { "@type": "AdministrativeArea", name: "Western Cape" },
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: site.showroom.address[0],
    addressLocality: site.showroom.address[1],
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
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // en-ZA rather than en: it tells search engines this business serves
    // South Africa, which matters for a showroom nobody flies to.
    <html lang="en-ZA">
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
