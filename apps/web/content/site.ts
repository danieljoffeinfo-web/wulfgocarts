/**
 * Global site configuration.
 * Everything a non-developer might want to change lives here or in the other
 * files in this folder — no component edits required.
 */

/** Canonical page URL — the client's link carried Facebook redirect tracking
 *  params (?_rdc=1&_rdr) and the m./web. host; this is the clean public form. */
const FACEBOOK_URL = "https://www.facebook.com/wulfgolfcarts";

export const site = {
  name: "Wulf Golf Carts",
  // The branded domain still serves the existing WordPress site. Change this
  // only when DNS is deliberately moved to this Vercel project.
  domain: "https://wulfgocarts.vercel.app",
  tagline: "Golf-ready. Lifestyle-perfect.",
  description:
    "Wulf Golf Carts sells premium lithium 2-seater and lifted 4-seater electric golf carts from our showroom in Montague Gardens, Cape Town.",

  /**
   * The showroom is the conversion goal for this site: every CTA points here.
   */
  showroom: {
    address: ["21 Montague Drive", "Montague Gardens", "Cape Town, 7441"],
    /**
     * A pinned Google Maps place link, not a text search.
     *
     * The previous value was a ?q= query built from the address lines, which
     * lets Google resolve it to whichever matching place it likes — and there
     * is more than one match, so some visitors were being routed to the wrong
     * premises. A place link resolves to exactly one pin.
     */
    mapsUrl: "https://maps.app.goo.gl/K8j7uAJgUgKeenHcA",
    /**
     * Only weekday hours were supplied. Weekend rows are deliberately absent
     * rather than guessed — wrong opening hours send someone on a wasted
     * drive to Montague Gardens, which is worse than not stating them.
     */
    hours: [{ days: "Monday – Friday", time: "08:00 – 17:00" }],
    note: "Call ahead for weekend viewings.",
  },

  phone: "082 803 3674",
  phoneHref: "+27828033674",
  whatsapp: "", // optional — full wa.me link, leave empty to hide the button
  email: "contact@wulfgolfcarts.co.za",
  facebook: FACEBOOK_URL,

  nav: [
    { label: "The range", href: "/#range" },
    { label: "Why Wulf", href: "/#why" },
    { label: "Build a quote", href: "/quote" },
  ],

  social: [
    { label: "Facebook", href: FACEBOOK_URL },
  ] as { label: string; href: string }[],
};
