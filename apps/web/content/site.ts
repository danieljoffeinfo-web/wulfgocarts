/**
 * Global site configuration.
 * Everything a non-developer might want to change lives here or in the other
 * files in this folder — no component edits required.
 */

/** Canonical page URL — the client's link carried Facebook redirect tracking
 *  params (?_rdc=1&_rdr) and the m./web. host; this is the clean public form. */
const FACEBOOK_URL = "https://www.facebook.com/wulfgolfcarts";

/**
 * WhatsApp.
 *
 * wa.me needs the number in international form with no leading zero and no
 * punctuation, so 082 425 4253 becomes 27824254253. The prefilled text is
 * only a starting point — WhatsApp drops the sender into the compose box with
 * it, and they can edit or delete it before sending.
 */
const WHATSAPP_DISPLAY = "082 425 4253";
const WHATSAPP_URL = `https://wa.me/27824254253?text=${encodeURIComponent(
  "Hi Wulf Golf Carts, I would like to know more about your electric golf carts."
)}`;

/** One physical location. Add a branch by copying an entry into `showrooms`. */
export type Showroom = {
  /** Short branch label, e.g. "Montague Gardens". */
  name: string;
  /** Address lines, in display order. */
  address: string[];
  /**
   * Where the "Get directions" button goes, or undefined to hide it.
   *
   * Either a pinned place link (maps.app.goo.gl/…), which is exact, or a
   * `dir/?api=1&destination=<street address>` link, which lets Google geocode
   * the address. What must never be used is a `?q=` search on the business
   * name: more than one place matches "Wulf Golf Carts" and Google is free to
   * pick, which sends people to the wrong branch.
   */
  mapsUrl?: string;
  /** Weekday hours. Omit entirely for appointment-only branches. */
  hours?: { days: string; time: string }[];
  /** Small print under the hours/contact — e.g. weekend or appointment notes. */
  note?: string;
  /** When true, the branch shows an "By appointment only" flag instead of hours. */
  appointmentOnly?: boolean;
  /**
   * Optional named contact for this branch, shown alongside the address.
   * `href` is the tel: target in international form.
   */
  contact?: { name?: string; phone: string; href: string };
};

/**
 * Every physical location. The first entry is the primary showroom and is what
 * the structured data, footer and quote sheet default to.
 */
export const showrooms: Showroom[] = [
  {
    /**
     * The showroom is the conversion goal for this site: every CTA points here.
     */
    name: "Montague Gardens",
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
    contact: { name: "Danny", phone: "082 425 4253", href: "+27824254253" },
  },
  {
    /**
     * Second branch.
     *
     * No pinned place link exists for this one, and a business-name search
     * resolves to the Montague premises — which is why directions were
     * originally left off. This targets the street address instead, through
     * Maps' documented `dir/?api=1&destination=` form: Google geocodes the
     * address itself rather than guessing at a matching business, so it lands
     * on Chardonnay Road and not on the other showroom.
     *
     * The postal code is deliberately absent from the destination string. The
     * client gives it as 7560, but listings for this address give 7530 and
     * the surrounding area is 7580/7581; feeding a wrong code to the geocoder
     * can push the pin into the wrong suburb, while street + suburb + city
     * resolves cleanly on its own. Swap in a pinned maps.app.goo.gl link if
     * the client shares one from their Business Profile.
     */
    name: "Blackheath, Kuils River",
    address: [
      "Saxenburg Park – D2",
      "1 Chardonnay Rd, Wijnland Park",
      "Blackheath, Kuils River, 7560",
    ],
    mapsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=" +
      encodeURIComponent("1 Chardonnay Rd, Saxenburg Park, Blackheath, Cape Town"),
    appointmentOnly: true,
    note: "Viewing by appointment only.",
    contact: { phone: "061 536 7310", href: "+27615367310" },
  },
];

export const site = {
  name: "Wulf Golf Carts",
  // The branded domain still serves the existing WordPress site. Change this
  // only when DNS is deliberately moved to this Vercel project.
  domain: "https://wulfgocarts.vercel.app",
  tagline: "Golf-ready. Lifestyle-perfect.",
  description:
    "Wulf Golf Carts sells premium lithium 2-seater and lifted 4-seater electric golf carts from our showroom in Montague Gardens, Cape Town.",

  /** Every branch. Render all of them, or index into the primary. */
  showrooms,
  /**
   * The primary showroom. Kept as an alias to the first branch so the footer,
   * structured data and quote sheet can reference a single location without
   * knowing about the array.
   */
  showroom: showrooms[0],

  phone: "082 803 3674",
  phoneHref: "+27828033674",
  /** Full wa.me link. Leave empty to hide every WhatsApp button on the site. */
  whatsapp: WHATSAPP_URL,
  /** The same number, formatted the way someone would read it aloud. */
  whatsappDisplay: WHATSAPP_DISPLAY,
  email: "contact@wulfgolfcarts.co.za",
  facebook: FACEBOOK_URL,

  /** Cash vs rental vs lease comparison, served from /public for download. */
  financeGuide: "/docs/wulf-cash-vs-rental-vs-lease.pdf",

  nav: [
    { label: "The range", href: "/#range" },
    { label: "Gallery", href: "/gallery" },
    { label: "Why Wulf", href: "/#why" },
    { label: "Build a quote", href: "/quote" },
  ],

  social: [
    { label: "WhatsApp", href: WHATSAPP_URL },
    { label: "Facebook", href: FACEBOOK_URL },
  ] as { label: string; href: string }[],
};
