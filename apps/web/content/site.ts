/**
 * Global site configuration.
 * Everything a non-developer might want to change lives here or in the other
 * files in this folder — no component edits required.
 *
 * Values marked PLACEHOLDER still need real content.
 */

export const site = {
  name: "Wulf Golf Carts",
  domain: "https://wulfgocarts.vercel.app", // PLACEHOLDER — update when the real domain is live
  tagline: "New golf carts, seen in person.",
  description:
    "Wulf Golf Carts sells new golf carts from our showroom. Browse the range online, then come see them in person — no pressure, no hard sell.",

  /**
   * The showroom is the conversion goal for this site: every CTA points here.
   */
  showroom: {
    // PLACEHOLDER — real street address, one line per array entry
    address: ["PLACEHOLDER street address", "PLACEHOLDER suburb", "PLACEHOLDER city, postal code"],
    // PLACEHOLDER — Google Maps link used by the "Get directions" buttons
    mapsUrl: "https://maps.google.com/?q=PLACEHOLDER",
    // PLACEHOLDER — opening hours, shown in the Visit section and the footer
    hours: [
      { days: "Monday – Friday", time: "PLACEHOLDER" },
      { days: "Saturday", time: "PLACEHOLDER" },
      { days: "Sunday & public holidays", time: "Closed" },
    ],
    // Optional note under the hours, e.g. "After-hours viewings by appointment."
    note: "PLACEHOLDER — optional line about appointments or after-hours viewings.",
  },

  phone: "PLACEHOLDER", // display format, e.g. "021 123 4567"
  phoneHref: "PLACEHOLDER", // dial format, e.g. "+27211234567"
  whatsapp: "", // optional — full wa.me link, leave empty to hide the button
  email: "PLACEHOLDER@wulfgocarts.com",

  nav: [
    { label: "Why Wulf", href: "#why" },
    { label: "Visit us", href: "#visit" },
  ],

  social: [
    // PLACEHOLDER — add real profiles, e.g.
    // { label: "Facebook", href: "https://facebook.com/wulfgocarts" },
    // { label: "Instagram", href: "https://instagram.com/wulfgocarts" },
  ] as { label: string; href: string }[],
};
