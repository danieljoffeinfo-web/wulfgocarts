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
