/**
 * Cloudinary-hosted assets.
 *
 * Everything the site loads is served from Cloudinary rather than the
 * Higgsfield CDN it was generated on: faster edge delivery, no dependency on
 * a third party's URLs staying alive, and — the reason the 3D viewer works at
 * all — Cloudinary sends CORS headers, which a GLB needs because it is
 * fetched rather than loaded as a media element.
 *
 * Versions are pinned so the URLs are immutably cacheable. Re-upload with the
 * same public_id and you must bump the version here for the change to show.
 */

const CLOUD = "dmanxetyl";
const base = (type: "video" | "image" | "raw") =>
  `https://res.cloudinary.com/${CLOUD}/${type}/upload`;

/**
 * The hero films are served untransformed on purpose.
 *
 * `q_auto` / `f_auto` would cut bytes further, but both produce a re-encoded
 * derivative whose keyframe layout decides how cleanly the scrub seeks — and
 * that could improve or degrade the effect. Worth trying and measuring on a
 * real device; not worth shipping blind.
 */
export const heroFilm = {
  landscape: `${base("video")}/v1785224346/wulf/hero-landscape.mp4`,
  portrait: `${base("video")}/v1785224351/wulf/hero-portrait.mp4`,
};

/**
 * Product still, Cloudinary-optimised.
 *
 * The no-transform rule above applies to the films only, where re-encoding
 * changes keyframe layout and so changes how the scrub seeks. Stills have no
 * such constraint, and these sources are 2048x2048 PNGs at 4–6 MB each —
 * twenty-five of them unoptimised would make the range page unusable on a
 * phone. f_auto serves WebP or AVIF where supported, q_auto picks a quality
 * per image, and c_limit scales down without ever upscaling a smaller source.
 *
 * Format and quality go last and in their own components: Cloudinary treats
 * `f_auto,q_auto` in one component differently from `f_auto/q_auto`.
 */
const shot = (id: string, version: number, w = 1200) =>
  `${base("image")}/c_limit,w_${w}/f_auto/q_auto/v${version}/golfcarts/white-bg/${id}.png`;

/**
 * White-background product shots, keyed by colour.
 *
 * `hero` is the real photograph. `angles` are viewpoints synthesised from it
 * — see the provenance note in content/carts.ts before publishing them.
 * `thumb` is the same frame at swatch size; loading a 1200px image into a
 * 32px circle is most of a megabyte wasted per colour.
 */
export const productShots = {
  black: {
    hero: shot("black-01", 1785959202),
    thumb: shot("black-01", 1785959202, 160),
    angles: [
      { src: shot("black-02", 1785959206), thumb: shot("black-02", 1785959206, 160), angle: "Front three-quarter" },
      { src: shot("black-03", 1785959211), thumb: shot("black-03", 1785959211, 160), angle: "Side profile" },
      { src: shot("black-04", 1785959214), thumb: shot("black-04", 1785959214, 160), angle: "Rear three-quarter" },
      { src: shot("black-05", 1785959220), thumb: shot("black-05", 1785959220, 160), angle: "Front" },
    ],
  },
  grey: {
    hero: shot("grey-01", 1785959231),
    thumb: shot("grey-01", 1785959231, 160),
    angles: [
      { src: shot("grey-02", 1785959233), thumb: shot("grey-02", 1785959233, 160), angle: "Front three-quarter" },
      { src: shot("grey-03", 1785959239), thumb: shot("grey-03", 1785959239, 160), angle: "Side profile" },
      { src: shot("grey-04", 1785959243), thumb: shot("grey-04", 1785959243, 160), angle: "Rear three-quarter" },
      { src: shot("grey-05", 1785959247), thumb: shot("grey-05", 1785959247, 160), angle: "Front" },
    ],
  },
  /* Names unconfirmed — see the note in content/carts.ts. Public IDs should be
     renamed in Cloudinary once the colours are known, so the asset store and
     the code agree; that is a metadata rename, not a regeneration. */
  variantA: {
    hero: shot("variant-a-01", 1785959732),
    thumb: shot("variant-a-01", 1785959732, 160),
    angles: [
      { src: shot("variant-a-02", 1785959740), thumb: shot("variant-a-02", 1785959740, 160), angle: "Front three-quarter" },
      { src: shot("variant-a-03", 1785959744), thumb: shot("variant-a-03", 1785959744, 160), angle: "Side profile" },
      { src: shot("variant-a-04", 1785959748), thumb: shot("variant-a-04", 1785959748, 160), angle: "Rear three-quarter" },
      { src: shot("variant-a-05", 1785959751), thumb: shot("variant-a-05", 1785959751, 160), angle: "Front" },
    ],
  },
  variantB: {
    hero: shot("variant-b-01", 1785959759),
    thumb: shot("variant-b-01", 1785959759, 160),
    angles: [
      { src: shot("variant-b-02", 1785959765), thumb: shot("variant-b-02", 1785959765, 160), angle: "Front three-quarter" },
      { src: shot("variant-b-03", 1785959770), thumb: shot("variant-b-03", 1785959770, 160), angle: "Side profile" },
      { src: shot("variant-b-04", 1785959773), thumb: shot("variant-b-04", 1785959773, 160), angle: "Rear three-quarter" },
      { src: shot("variant-b-05", 1785959778), thumb: shot("variant-b-05", 1785959778, 160), angle: "Front" },
    ],
  },
  variantC: {
    hero: shot("variant-c-01", 1785959787),
    thumb: shot("variant-c-01", 1785959787, 160),
    angles: [
      { src: shot("variant-c-02", 1785959793), thumb: shot("variant-c-02", 1785959793, 160), angle: "Front three-quarter" },
      { src: shot("variant-c-03", 1785959800), thumb: shot("variant-c-03", 1785959800, 160), angle: "Side profile" },
      { src: shot("variant-c-04", 1785959804), thumb: shot("variant-c-04", 1785959804, 160), angle: "Rear three-quarter" },
      { src: shot("variant-c-05", 1785959808), thumb: shot("variant-c-05", 1785959808, 160), angle: "Front" },
    ],
  },
};

/**
 * Assembly film — components converging into the finished cart.
 *
 * TODO: still on the Higgsfield CDN because the Cloudinary MCP was offline
 * when this was wired up. Move it across for the same reasons as everything
 * else here: edge delivery, and not depending on a third party's URL staying
 * alive. Upload with `file` set to the URL below, then swap in the
 * res.cloudinary.com path.
 */
export const assemblyFilm = {
  src: "https://d8j0ntlcm91z4.cloudfront.net/user_3CdVP8uyiMnLQzUlH6RnH8yZa5a/hf_20260728_180809_6b1cb96e-a45b-40b0-b1b4-0d7de716c12b.mp4",
  /* First frame — the exploded layout. Holds the space before playback. */
  poster:
    "https://d2ol7oe51mr4n9.cloudfront.net/user_3CdVP8uyiMnLQzUlH6RnH8yZa5a/715afa08-6548-4352-a201-ede10d43fa9e.jpg",
};
