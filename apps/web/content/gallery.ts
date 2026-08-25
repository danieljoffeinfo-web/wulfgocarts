/**
 * Gallery catalogue.
 *
 * Every frame lives on Cloudinary under `wulf/gallery/<slug>`, uploaded from
 * the original HEIC shoot files. EXIF rotation was baked into the pixels
 * before upload, so `w`/`h` here are the true rendered dimensions — the grid
 * derives each tile's span from them, and getting them wrong skews the sheet.
 *
 * Versions are pinned for immutable caching, matching content/media.ts.
 * Re-upload with the same public_id and you must bump the version here.
 */

const CLOUD = "dmanxetyl";

/**
 * Cloudinary does the resizing, so the browser gets exactly the pixels it
 * needs and Vercel's image optimiser stays out of the path entirely. This is
 * also why the grid uses a plain <img> rather than next/image: no remote
 * pattern to configure, and f_auto already serves AVIF/WebP where supported.
 */
function url(photo: Photo, width: number) {
  return `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto,c_limit,w_${width}/${photo.version}/wulf/gallery/${photo.slug}.jpg`;
}

/** Widths the tiles offer the browser. Tiles never render above ~800 CSS px. */
const TILE_WIDTHS = [400, 600, 800, 1200];

export function tileSrc(photo: Photo) {
  return url(photo, 800);
}

export function tileSrcSet(photo: Photo) {
  return TILE_WIDTHS.map((w) => `${url(photo, w)} ${w}w`).join(", ");
}

/** Full-screen viewing. Capped at 2000px — the sources are 3000px. */
export function fullSrc(photo: Photo) {
  return url(photo, 2000);
}

/** Wide, full-bleed bands: crop to a letterbox rather than scaling the whole frame. */
export function bandSrc(slug: string, version: string, width = 2400) {
  return `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto,c_fill,g_auto,ar_21:9,w_${width}/${version}/wulf/gallery/${slug}.jpg`;
}

export type ColourwayId = "yellow" | "black" | "blue" | "red" | "detail" | "line";

export type Photo = {
  slug: string;
  version: string;
  /** True rendered pixel dimensions — drives the tile's grid span. */
  w: number;
  h: number;
  group: ColourwayId;
  /** Shown under the frame in the lightbox. */
  caption: string;
  alt: string;
};

/**
 * Swatches are sampled from the paint itself — the modal saturated tone across
 * the bonnet of each head-on shot, not a guess at what "yellow" means. The two
 * blue shoots are the same paint with different interiors and wheels, so they
 * share one chip; the difference shows up in the photographs.
 */
export const colourways: {
  id: ColourwayId;
  label: string;
  /** Solid hex, or a CSS gradient for the mixed sets. */
  swatch: string;
}[] = [
  { id: "yellow", label: "Yellow", swatch: "#E3C233" },
  { id: "black", label: "Black", swatch: "#2E3137" },
  { id: "blue", label: "Blue", swatch: "#2043AA" },
  { id: "red", label: "Red", swatch: "#C4302F" },
  { id: "detail", label: "Detail", swatch: "#C9CDD2" },
  {
    id: "line",
    label: "The line",
    swatch:
      "conic-gradient(from 220deg, #E3C233 0deg 90deg, #C4302F 90deg 180deg, #2043AA 180deg 270deg, #2E3137 270deg 360deg)",
  },
];

export const photos: Photo[] = [
  // ── The line ───────────────────────────────────────────────────────────
  {
    slug: "line-low-angle",
    version: "v1787610284",
    w: 3000,
    h: 2250,
    group: "line",
    caption: "Down the line, first light",
    alt: "Low-angle view along a row of Wulf golf carts with the sun flaring behind them",
  },
  {
    slug: "line-golden-hour",
    version: "v1787610291",
    w: 3000,
    h: 2250,
    group: "line",
    caption: "The line at golden hour",
    alt: "A long row of Wulf golf carts in different colours, lit from behind at golden hour",
  },
  {
    slug: "line-reverse",
    version: "v1787610295",
    w: 3000,
    h: 2249,
    group: "line",
    caption: "The line, from the far end",
    alt: "The row of Wulf golf carts photographed from the opposite end",
  },
  {
    slug: "line-lit-close",
    version: "v1787610343",
    w: 3000,
    h: 2250,
    group: "line",
    caption: "Headlights on",
    alt: "Row of Wulf golf carts at dusk with their headlights and dash displays lit",
  },
  {
    slug: "line-dusk",
    version: "v1787610308",
    w: 3000,
    h: 2250,
    group: "line",
    caption: "The line at dusk",
    alt: "Row of Wulf golf carts parked under willow trees at dusk",
  },
  {
    slug: "line-lit-wide",
    version: "v1787610348",
    w: 3000,
    h: 2250,
    group: "line",
    caption: "Headlights on, wide",
    alt: "Wide view of the lit row of Wulf golf carts against a pale evening sky",
  },
  {
    slug: "line-lit-dusk",
    version: "v1787610362",
    w: 3000,
    h: 2250,
    group: "line",
    caption: "Last light",
    alt: "The row of Wulf golf carts with headlights on as the light fades",
  },
  {
    slug: "line-wide",
    version: "v1787610325",
    w: 3000,
    h: 2250,
    group: "line",
    caption: "The line, wide",
    alt: "Very wide view of the row of Wulf golf carts beside an empty road",
  },
  {
    slug: "line-open-road",
    version: "v1787610332",
    w: 3000,
    h: 2250,
    group: "line",
    caption: "The line and the open road",
    alt: "The row of Wulf golf carts on the left with open road and sunset sky to the right",
  },

  // ── Yellow ─────────────────────────────────────────────────────────────
  {
    slug: "yellow-front-quarter",
    version: "v1787610045",
    w: 3000,
    h: 3000,
    group: "yellow",
    caption: "Front three-quarter",
    alt: "Yellow Wulf golf cart photographed from the front three-quarter angle",
  },
  {
    slug: "yellow-head-on",
    version: "v1787610055",
    w: 3000,
    h: 3000,
    group: "yellow",
    caption: "Head-on",
    alt: "Yellow Wulf golf cart photographed head-on, showing the brush bar and badge",
  },
  {
    slug: "yellow-quarter-left",
    version: "v1787610079",
    w: 3000,
    h: 3000,
    group: "yellow",
    caption: "Front three-quarter, near side",
    alt: "Yellow Wulf golf cart from the near-side front three-quarter angle",
  },
  {
    slug: "yellow-profile",
    version: "v1787610085",
    w: 3000,
    h: 3000,
    group: "yellow",
    caption: "Full profile",
    alt: "Yellow Wulf golf cart in full side profile under a cloudy sky",
  },
  {
    slug: "yellow-rear-quarter",
    version: "v1787610092",
    w: 3000,
    h: 3000,
    group: "yellow",
    caption: "Rear three-quarter, rear seats out",
    alt: "Yellow Wulf golf cart from behind, showing the rear-facing bench and cargo rack",
  },

  // ── Black ──────────────────────────────────────────────────────────────
  {
    slug: "black-front-quarter",
    version: "v1787610135",
    w: 2250,
    h: 3000,
    group: "black",
    caption: "Front three-quarter",
    alt: "Black Wulf golf cart with red stitching, front three-quarter angle",
  },
  {
    slug: "black-head-on",
    version: "v1787610142",
    w: 2250,
    h: 3000,
    group: "black",
    caption: "Head-on",
    alt: "Black Wulf golf cart photographed head-on",
  },
  {
    slug: "black-quarter-left",
    version: "v1787610150",
    w: 2250,
    h: 3000,
    group: "black",
    caption: "Front three-quarter, near side",
    alt: "Black Wulf golf cart from the near-side front three-quarter angle",
  },
  {
    slug: "black-profile",
    version: "v1787610164",
    w: 2250,
    h: 3000,
    group: "black",
    caption: "Full profile",
    alt: "Black Wulf golf cart in side profile against a dramatic cloudy sky",
  },

  // ── Blue ───────────────────────────────────────────────────────────────
  {
    slug: "blue-front-quarter",
    version: "v1787610246",
    w: 2250,
    h: 3000,
    group: "blue",
    caption: "Front three-quarter, black interior",
    alt: "Blue Wulf golf cart with black diamond-stitched interior, front three-quarter angle",
  },
  {
    slug: "blue-head-on",
    version: "v1787610251",
    w: 2250,
    h: 3000,
    group: "blue",
    caption: "Head-on",
    alt: "Blue Wulf golf cart photographed head-on",
  },
  {
    slug: "blue-quarter-left",
    version: "v1787610259",
    w: 2250,
    h: 3000,
    group: "blue",
    caption: "Front three-quarter, near side",
    alt: "Blue Wulf golf cart from the near-side front three-quarter angle",
  },
  {
    slug: "blue-profile",
    version: "v1787610265",
    w: 3000,
    h: 2250,
    group: "blue",
    caption: "Full profile",
    alt: "Blue Wulf golf cart in full side profile showing the rear-facing bench",
  },
  {
    slug: "cognac-front-quarter",
    version: "v1787610177",
    w: 2250,
    h: 3000,
    group: "blue",
    caption: "Front three-quarter, cognac interior",
    alt: "Blue Wulf golf cart with cognac leather interior and machined alloy wheels",
  },
  {
    slug: "cognac-head-on",
    version: "v1787610185",
    w: 2250,
    h: 3000,
    group: "blue",
    caption: "Head-on, cognac interior",
    alt: "Blue Wulf golf cart with cognac interior, photographed head-on",
  },
  {
    slug: "cognac-quarter-left",
    version: "v1787610204",
    w: 2250,
    h: 3000,
    group: "blue",
    caption: "Front three-quarter, near side",
    alt: "Blue Wulf golf cart with cognac interior from the near-side front angle",
  },
  {
    slug: "cognac-profile",
    version: "v1787610170",
    w: 3000,
    h: 3000,
    group: "blue",
    caption: "Full profile, machined alloys",
    alt: "Blue Wulf golf cart in side profile on machined alloy wheels",
  },

  // ── Red ────────────────────────────────────────────────────────────────
  {
    slug: "red-front-quarter",
    version: "v1787610208",
    w: 2250,
    h: 3000,
    group: "red",
    caption: "Front three-quarter",
    alt: "Red Wulf golf cart photographed from the front three-quarter angle",
  },
  {
    slug: "red-head-on",
    version: "v1787610213",
    w: 2250,
    h: 3000,
    group: "red",
    caption: "Head-on",
    alt: "Red Wulf golf cart photographed head-on",
  },
  {
    slug: "red-quarter-left",
    version: "v1787610219",
    w: 2250,
    h: 3000,
    group: "red",
    caption: "Front three-quarter, near side",
    alt: "Red Wulf golf cart from the near-side front three-quarter angle",
  },
  {
    slug: "red-profile",
    version: "v1787610242",
    w: 3000,
    h: 2250,
    group: "red",
    caption: "Full profile",
    alt: "Red Wulf golf cart in full side profile with the rear bench folded out",
  },

  // ── Detail ─────────────────────────────────────────────────────────────
  {
    slug: "detail-seats",
    version: "v1787610105",
    w: 3000,
    h: 3000,
    group: "detail",
    caption: "Diamond-stitched bench and wolf badge",
    alt: "Close-up of the diamond-stitched seat backs with contrast piping and the Wulf badge",
  },
  {
    slug: "detail-wheel",
    version: "v1787610127",
    w: 2250,
    h: 3000,
    group: "detail",
    caption: "Alloy rim on all-terrain rubber",
    alt: "Close-up of a Wulf golf cart wheel: black alloy rim, all-terrain tyre and disc brake",
  },
  {
    slug: "detail-rear-bench",
    version: "v1787610123",
    w: 3000,
    h: 3000,
    group: "detail",
    caption: "Rear bench, cup holders and grab rail",
    alt: "Close-up of the folding rear bench, cup holder and grab rail under the canopy",
  },
];

export function countFor(id: ColourwayId) {
  return photos.filter((p) => p.group === id).length;
}
