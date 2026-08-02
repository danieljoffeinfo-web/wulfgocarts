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
    ...carts.map((cart) => ({
      url: `${site.domain}/carts/${cart.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
