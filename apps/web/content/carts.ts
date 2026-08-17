/**
 * The range shown on the landing page.
 *
 * To add a cart: copy an entry, fill it in, and drop its photo in
 * `public/carts/`. Set `image` to the path from /public — e.g.
 * `image: "/carts/two-seater.jpg"`. Leave `image` undefined and the card
 * renders a labelled placeholder frame instead, so the layout still holds.
 */

import { productShots } from "./media";

/**
 * Where a product image came from.
 *
 * "photo" is a photograph of the actual cart. "generated" is a viewpoint
 * synthesised from that photograph by an image model — the far side, the rear
 * and the front of these carts were never photographed, so seat pattern,
 * badging, wheel design and rear details in those frames are the model's
 * inference rather than the product.
 *
 * This is tracked per shot rather than assumed because the detail page carries
 * schema.org/Product markup with a priced Offer, and a synthetic angle
 * published under that is a misrepresentation of goods, not a styling choice.
 */
export type ShotProvenance = "photo" | "generated";

export type CartShot = {
  src: string;
  /** Swatch/thumbnail-sized crop of the same frame. */
  thumb: string;
  /** Short label, e.g. "Rear three-quarter". */
  angle: string;
  provenance: ShotProvenance;
};

export type CartColour = {
  /** Shown beside the swatches and used as the accessible label. */
  name: string;
  /**
   * Hero shot, and the swatch crop source. Always a real photograph — a
   * generated frame must never become the image that represents a colour,
   * because this is also what feeds the OpenGraph card.
   */
  image: string;
  /** Swatch-sized crop of `image`. Falls back to `image` when absent. */
  thumb?: string;
  /** Additional angles, in display order. */
  gallery?: CartShot[];
  /**
   * Optional flat chip colour. Omit and the swatch is a circular crop of
   * `image`, which keeps the chip and the photo in step automatically.
   */
  hex?: string;
};

/**
 * Master switch for synthesised viewpoints.
 *
 * Set to false and every generated angle disappears from the cards, the
 * detail page and the Product structured data, leaving only photographs of
 * the actual carts. One edit, no other changes needed.
 */
export const SHOW_GENERATED_ANGLES = false;

/** The angles that should actually render, after the switch above. */
export const visibleAngles = (colour: CartColour): CartShot[] =>
  (colour.gallery ?? []).filter(
    (s) => SHOW_GENERATED_ANGLES || s.provenance === "photo"
  );

/**
 * Every angle in a productShots set is synthesised — only the `hero` in each
 * set is a photograph — so provenance is stamped here rather than repeated
 * twenty times in the manifest.
 */
const generatedAngles = (
  set: (typeof productShots)[keyof typeof productShots]
): CartShot[] =>
  set.angles.map((a) => ({ ...a, provenance: "generated" as const }));

export type Cart = {
  slug: string;
  name: string;
  /** One line under the name — who it suits. */
  tagline: string;
  seats: string;
  /** Formatted for display, e.g. "R185,000". */
  price?: string;
  /** Short qualification shown beside the price. */
  priceNote?: string;
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
  /** False when only campaign-level information is available. */
  detailsAvailable?: boolean;
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
    price: "R175,750",
    priceZAR: 175750,
    priceNote: "Incl. VAT · special until 12 September 2026",
    highlights: [
      "5 kW AC motor, 51.2 V 150 Ah lithium",
      "80–100 km range, 4–6 hour charge",
      'Diamond-stitched leather and a 10" touchscreen',
      "Rear golf bag stand and cooler box",
    ],
    /**
     * Black and Grey use the new white-background set: a real photograph as
     * the hero, plus four synthesised angles behind SHOW_GENERATED_ANGLES.
     *
     * Blue, Yellow and Red still point at the older untransformed JPEGs. The
     * new set has three colours whose names were never confirmed — variants A,
     * B and C — and they may well BE these three. Swapping them on that guess
     * would put the wrong paint under the wrong label on a priced product
     * page, so they stay until someone confirms. Once confirmed, replace these
     * three entries with productShots.variantA/B/C and rename the Cloudinary
     * public IDs to match.
     */
    colours: [
      {
        name: "Black",
        image: productShots.black.hero,
        thumb: productShots.black.thumb,
        gallery: generatedAngles(productShots.black),
      },
      {
        name: "Grey",
        image: productShots.grey.hero,
        thumb: productShots.grey.thumb,
        gallery: generatedAngles(productShots.grey),
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
    badge: "Rivalry special",
  },
  {
    slug: "four-seater",
    name: "WULF Lifted 4-Seater Electric",
    tagline:
      "A lifted four-seat configuration for estates, resorts and family use.",
    seats: "4 seater",
    price: "R207,431",
    priceZAR: 207431,
    priceNote: "Incl. VAT · special until 12 September 2026",
    highlights: [
      "Lifted four-seat configuration",
      "Premium lithium electric platform",
      "Available to test-drive in Cape Town",
      "Finance available, subject to approval",
    ],
    image: "/brand/wulf-rugby-special-2026.png",
    badge: "Rivalry special",
    detailsAvailable: false,
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
      "The cart is on the floor at our Montague Gardens showroom. Come and sit in it, take it for a run, and decide in person rather than from a photograph.",
  },
];
