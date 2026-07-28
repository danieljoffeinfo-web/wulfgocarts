/**
 * The range shown on the landing page.
 *
 * To add a cart: copy an entry, fill it in, and drop its photo in
 * `public/carts/`. Set `image` to the path from /public — e.g.
 * `image: "/carts/two-seater.jpg"`. Leave `image` undefined and the card
 * renders a labelled placeholder frame instead, so the layout still holds.
 *
 * All entries below are PLACEHOLDER content awaiting the real range.
 */

export type Cart = {
  slug: string;
  name: string;
  /** One line under the name — who it suits. */
  tagline: string;
  seats: string;
  /** 3–4 short spec bullets. Keep them scannable. */
  highlights: string[];
  /** Path from /public, e.g. "/carts/two-seater.jpg". Optional. */
  image?: string;
  /**
   * Ordered frames for the drag-to-rotate 360 viewer. When set, this replaces
   * the static `image` on the card. Use spinFrames() below to build the list.
   */
  frames?: string[];
  /** Optional corner badge, e.g. "Most popular" or "New arrival". */
  badge?: string;
};

/**
 * Build the frame list for a cart's 360 view.
 *
 * Expects photos at public/carts/<slug>/001.jpg … NNN.jpg, shot at even
 * angles all the way around the cart, from a fixed height and distance.
 * 24–36 frames gives a smooth revolution; below ~16 the rotation jumps.
 *
 *   frames: spinFrames("two-seater", 36)
 */
export const spinFrames = (slug: string, count: number, ext = "jpg") =>
  Array.from(
    { length: count },
    (_, i) => `/carts/${slug}/${String(i + 1).padStart(3, "0")}.${ext}`
  );

export const carts: Cart[] = [
  {
    slug: "two-seater",
    name: "PLACEHOLDER — Model name",
    tagline: "PLACEHOLDER — who this one suits",
    seats: "2 seater",
    highlights: [
      "PLACEHOLDER — battery / range",
      "PLACEHOLDER — motor or top speed",
      "PLACEHOLDER — standout feature",
    ],
    badge: "Most popular",
  },
  {
    slug: "four-seater",
    name: "PLACEHOLDER — Model name",
    tagline: "PLACEHOLDER — who this one suits",
    seats: "4 seater",
    highlights: [
      "PLACEHOLDER — battery / range",
      "PLACEHOLDER — motor or top speed",
      "PLACEHOLDER — standout feature",
    ],
  },
  {
    slug: "six-seater",
    name: "PLACEHOLDER — Model name",
    tagline: "PLACEHOLDER — who this one suits",
    seats: "6 seater",
    highlights: [
      "PLACEHOLDER — battery / range",
      "PLACEHOLDER — motor or top speed",
      "PLACEHOLDER — standout feature",
    ],
  },
];

/** Short capability lines for the marquee strip under the hero. */
export const capabilities = [
  "PLACEHOLDER — Brand new stock",
  "PLACEHOLDER — Lithium options",
  "PLACEHOLDER — Full warranty",
  "PLACEHOLDER — Finance available",
  "PLACEHOLDER — Parts & service",
  "PLACEHOLDER — Delivery arranged",
];

/** The "Why Wulf" reasons. Three or four reads best. */
export const reasons: { title: string; description: string }[] = [
  {
    title: "PLACEHOLDER — Reason one",
    description:
      "PLACEHOLDER — a sentence or two on why this matters to someone deciding where to buy.",
  },
  {
    title: "PLACEHOLDER — Reason two",
    description:
      "PLACEHOLDER — a sentence or two on why this matters to someone deciding where to buy.",
  },
  {
    title: "PLACEHOLDER — Reason three",
    description:
      "PLACEHOLDER — a sentence or two on why this matters to someone deciding where to buy.",
  },
  {
    title: "PLACEHOLDER — Reason four",
    description:
      "PLACEHOLDER — a sentence or two on why this matters to someone deciding where to buy.",
  },
];
