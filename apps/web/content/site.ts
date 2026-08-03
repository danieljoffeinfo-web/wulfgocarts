/**
 * Global site configuration.
 * Everything a non-developer might want to change lives here or in the other
 * files in this folder — no component edits required.
 */

export const site = {
  name: "Wulf Golf Carts",
  domain: "https://wulfgolfcarts.co.za",
  tagline: "Golf-ready. Lifestyle-perfect.",
  description:
    "Wulf Golf Carts sells the WULF 2-Seater Electric Golf Cart from our showroom in Montague Gardens, Cape Town. Browse the range online, then come see it in person.",

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

  nav: [
    { label: "Why Wulf", href: "#why" },
    { label: "Visit us", href: "#visit" },
  ],

  social: [
    // PLACEHOLDER — add real profiles when available.
  ] as { label: string; href: string }[],
};
