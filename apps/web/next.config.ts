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
 * The site does now accept input: /contact posts an enquiry to
 * /api/contact. That narrows the old justification for 'unsafe-inline' but
 * does not overturn it, because the enquiry is never rendered as markup. It
 * goes from a controlled React input straight to the API route, which escapes
 * it before it reaches the email body, and nothing on any page interpolates
 * visitor text into HTML. There is still no auth and no cookie for injected
 * script to reach for.
 *
 * connect-src 'self' is what the form needs and all it needs — the fetch is
 * same-origin, and Resend is called from the server where no CSP applies.
 * The policy's real work remains frame-ancestors (clickjacking), form-action
 * (which stops an injected form posting the enquiry off-site) and pinning
 * where media may load from.
 *
 * Revisit this the moment a page renders anything a visitor typed.
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
