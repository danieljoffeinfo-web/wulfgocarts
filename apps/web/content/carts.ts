/**
 * The range shown on the landing page.
 *
 * To add a cart: copy an entry, fill it in, and drop its photo in
 * `public/carts/`. Set `image` to the path from /public — e.g.
 * `image: "/carts/two-seater.jpg"`. Leave `image` undefined and the card
 * renders a labelled placeholder frame instead, so the layout still holds.
 */

export type CartColour = {
  /** Shown beside the swatches and used as the accessible label. */
  name: string;
  /** Photograph of the cart in this colour. */
  image: string;
  /**
   * Optional flat chip colour. Omit and the swatch is a circular crop of
   * `image`, which keeps the chip and the photo in step automatically.
   */
  hex?: string;
};

export type Cart = {
  slug: string;
  name: string;
  /** One line under the name — who it suits. */
  tagline: string;
  seats: string;
  /** Formatted for display, e.g. "R185,000". */
  price?: string;
  /**
   * The same figure as a number, for structured data. Kept separate rather
   * than parsed out of `price` so the display string stays free to be
   * formatted however reads best without breaking the schema.
   */
  priceZAR?: number;
  /** 3–4 short spec bullets. Keep them scannable. */
  highlights: string[];
  /** Path from /public, e.g. "/carts/two-seater.jpg". Optional. */
  image?: string;
  /** Available paint colours. When set, the card shows a colour selector. */
  colours?: CartColour[];
  /**
   * Ordered frames for the drag-to-rotate 360 viewer. Build with spinFrames().
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
    name: "WULF 2-Seater Electric",
    tagline: "Golf-ready on the course, lifestyle-perfect on the estate.",
    seats: "2 seater",
    price: "R185,000",
    priceZAR: 185000,
    highlights: [
      "5 kW AC motor, 51.2 V 150 Ah lithium",
      "80–100 km range, 4–6 hour charge",
      'Diamond-stitched leather and a 10" touchscreen',
      "Rear golf bag stand and cooler box",
    ],
    /**
     * Names are in the order the images were supplied. The swatches are crops
     * of the photographs, so they always show the true paint — only these
     * labels could ever fall out of step. Reorder the names, not the images,
     * if a label ever reads wrong.
     */
    colours: [
      {
        name: "Black",
        image:
          "https://res.cloudinary.com/dmanxetyl/image/upload/v1785709138/Image_1_ww5i4r.jpg",
      },
      {
        name: "Blue",
        image:
          "https://res.cloudinary.com/dmanxetyl/image/upload/v1785709138/Image_2_ktihtp.jpg",
      },
      {
        name: "Yellow",
        image:
          "https://res.cloudinary.com/dmanxetyl/image/upload/v1785709138/Image_neyitk.jpg",
      },
      {
        name: "Red",
        image:
          "https://res.cloudinary.com/dmanxetyl/image/upload/v1785709137/Image_3_jb30qq.jpg",
      },
    ],
    badge: "Most popular",
  },
];

/** The "Why Wulf" reasons. Three or four reads best. */
export const reasons: { title: string; description: string }[] = [
  {
    title: "Two carts in one",
    description:
      "Built for the tee box and the estate alike — quiet enough for a Sunday round, capable enough for daily use around a farm, resort or beach house.",
  },
  {
    title: "Lithium, not lead",
    description:
      "A 51.2 V 150 Ah lithium pack means 80–100 km on a charge, four to six hours to fill it, and none of the topping up and terminal cleaning that lead-acid demands.",
  },
  {
    title: "Properly finished inside",
    description:
      "Diamond-stitched leather, carbon fibre and wood accents, ambient lighting, and a 10” touchscreen with CarPlay and Android Auto. It reads like a car, not a buggy.",
  },
  {
    title: "Seen before it's sold",
    description:
      "The cart is on the floor at our Blackheath showroom. Come and sit in it, take it for a run, and decide in person rather than from a photograph.",
  },
];
