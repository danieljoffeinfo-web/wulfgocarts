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

export const cartModels = {
  twoSeater: `${base("raw")}/v1785224356/wulf/carts/two-seater.glb`,
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
