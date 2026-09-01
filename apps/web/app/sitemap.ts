import type { MetadataRoute } from "next";
import { carts } from "@/content/carts";
import { site } from "@/content/site";

/**
 * Generated from the same content the pages are built from, so adding a cart
 * to content/carts.ts puts it in the sitemap automatically — no second list
 * to forget to update.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: site.domain,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      /* The exact-match catalogue page. Second only to the homepage, because
         it is the page every "golf carts for sale" query should land on. */
      url: `${site.domain}/golf-carts-for-sale`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${site.domain}/gallery`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${site.domain}/quote`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    ...carts
      .filter((cart) => cart.detailsAvailable !== false)
      .map((cart) => ({
        url: `${site.domain}/carts/${cart.slug}`,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
  ];
}
