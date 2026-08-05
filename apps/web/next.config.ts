import type { NextConfig } from "next";

/**
 * Origins the site actually loads from. Kept as one list so the CSP and
 * next/image cannot drift apart.
 *
 * The two CloudFront hosts serve the assembly film and its poster only. They
 * disappear from here once that file moves to Cloudinary — see the TODO in
 * content/media.ts.
 */
const CLOUDINARY = "https://res.cloudinary.com";
const HIGGSFIELD_MEDIA = "https://d8j0ntlcm91z4.cloudfront.net";
const HIGGSFIELD_POSTER = "https://d2ol7oe51mr4n9.cloudfront.net";

/**
 * Content Security Policy.
 *
 * Scripts and styles need 'unsafe-inline': Next injects inline bootstrap
 * scripts for hydration and the pages carry inline JSON-LD. Tightening that
 * to nonces requires middleware, which would make every page dynamic and
 * throw away the static rendering this site's speed depends on.
 *
 * That trade is acceptable here specifically because the attack surface is
 * near zero — no forms, no auth, no cookies, no user input rendered anywhere,
 * and every page is static HTML built at deploy time. The policy's real work
 * is frame-ancestors (clickjacking) and pinning where media may load from.
 * It would NOT be an acceptable trade on a site that accepted input.
 */
const csp = [
  "default-src 'self'",
  `img-src 'self' data: blob: ${CLOUDINARY} ${HIGGSFIELD_POSTER}`,
  `media-src 'self' ${CLOUDINARY} ${HIGGSFIELD_MEDIA}`,
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "connect-src 'self'",
  "manifest-src 'self'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  /* Two years, preloadable. The site is HTTPS-only on Vercel already; this
     stops a first visit over http from being downgradeable. */
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  /* Redundant against frame-ancestors for modern browsers, kept for old ones. */
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  /* The site asks for none of these; deny them so an embedded third party
     cannot either. */
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /* Drops the X-Powered-By: Next.js header — free version disclosure. */
  poweredByHeader: false,

  images: {
    /**
     * AssetSlot renders through next/image, which rejects any remote URL not
     * listed here. Nothing currently passes it a Cloudinary URL — the carts
     * all render through ColourPicker — but the moment one does it would
     * throw at runtime rather than degrade. Allowing the one host we use
     * costs nothing and removes the trap.
     */
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
    ],
    formats: ["image/avif", "image/webp"],
  },

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
