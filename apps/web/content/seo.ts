/**
 * Search-facing content.
 *
 * The site sells one thing, and the phrase people type when they want to buy
 * it is "golf carts for sale". That phrase is barely contested in South
 * Africa, so the work here is not out-clevering anyone — it is making sure
 * every surface a crawler reads (title, headings, body copy, structured data)
 * says plainly what is on the floor, where it is, and what it costs.
 *
 * Everything in this file is written to be read by a person first. Copy that
 * is stuffed for a crawler reads as spam to a buyer, and the buyer is the one
 * who drives to Montague Gardens.
 */

/**
 * The keyword cluster, in one place.
 *
 * Used for the `keywords` meta tag (which Google ignores, but Bing and a few
 * SA aggregators still read) and — more usefully — as the checklist the page
 * copy is written against. Ordered most- to least-important.
 */
export const keywords = [
  "golf carts for sale",
  "golf carts for sale Cape Town",
  "golf carts for sale South Africa",
  "electric golf carts for sale",
  "electric golf cart Cape Town",
  "lithium golf cart for sale",
  "2 seater golf cart for sale",
  "4 seater golf cart for sale",
  "new golf carts for sale",
  "golf cart prices South Africa",
  "buy a golf cart Cape Town",
  "golf cart dealer Cape Town",
  "golf cart dealership South Africa",
  "golf cart trailer for sale",
  "golf carts for sale near me",
  "WULF golf carts",
];

/**
 * Questions people actually type, answered honestly.
 *
 * Rendered as visible copy AND as FAQPage structured data, which is the rule:
 * Google drops FAQ markup that has no on-page counterpart, and rightly so.
 *
 * Every figure here is sourced from content/carts.ts and content/specs.ts.
 * Nothing is estimated — a wrong price or a wrong range in a rich result is a
 * customer arriving at the showroom expecting something that is not true.
 */
export const faqs: { question: string; answer: string }[] = [
  {
    question: "How much do golf carts cost in South Africa?",
    answer:
      "Our WULF 2-Seater Electric golf cart is R175,750 including VAT, and the lifted 4-Seater is R207,431 including VAT. A 1 Man Tilt Trailer to tow one is R30,475 including VAT (R26,500 excluding). Those are the on-the-floor prices at our Cape Town showrooms — build a quote on the site to see the full figure with any accessories.",
  },
  {
    question: "Where can I buy a golf cart in Cape Town?",
    answer:
      "From our showroom at 21 Montague Drive, Montague Gardens, open Monday to Friday 08:00–17:00, or from our Blackheath branch at Saxenburg Park D2, 1 Chardonnay Road, Kuils River, by appointment. Both hold stock you can sit in and drive before you decide.",
  },
  {
    question: "Are these golf carts electric or petrol?",
    answer:
      "Every cart we sell is fully electric. A 5 kW AC motor runs off a 51.2 V 150 Ah lithium battery — no fuel, no oil changes, no exhaust, and quiet enough to hold a conversation in.",
  },
  {
    question: "How far does an electric golf cart go on one charge?",
    answer:
      "80 to 100 km on a full charge, depending on terrain and load, and four to six hours to charge it back up from a standard plug point. That is a full day on a course or an estate with room to spare.",
  },
  {
    question: "How fast do your golf carts go?",
    answer:
      "Top speed is limited to 40 km/h, which is well above what a golf course or an estate road calls for and keeps the cart comfortable and stable at pace.",
  },
  {
    question: "Can I drive a golf cart on a public road in South Africa?",
    answer:
      "These carts are not registered or licensed as road-going vehicles, so they are built for golf courses, private estates, farms, resorts, retirement villages and private property rather than public roads. Some estates and municipalities permit limited use on their own roads — check with the estate or your local authority before you buy if that matters to you.",
  },
  {
    question: "Is finance available on a golf cart?",
    answer:
      "Yes, subject to approval. You can buy outright, rent on an operating rental, or lease — our quote builder prices a purchase and a monthly rental side by side, and there is a cash vs rental vs lease guide on the site if you want to compare the three before you come in.",
  },
  {
    question: "Why lithium instead of lead-acid batteries?",
    answer:
      "A 51.2 V 150 Ah lithium pack gives 80–100 km per charge and fills in four to six hours, with none of the watering, topping up or terminal cleaning that lead-acid demands. It is lighter, it holds its performance as it discharges rather than fading, and it lasts substantially longer before it needs replacing.",
  },
  {
    question: "Can I test drive a golf cart before buying?",
    answer:
      "Yes, and we would rather you did. The range is on the floor at Montague Gardens — come through, sit in one, take it for a run, and there is no pressure to buy anything on the day.",
  },
  {
    question: "What colours can I order?",
    answer:
      "Black, grey, blue, yellow and red. The gallery on this site is photographs of the actual carts in each colour rather than renders, so what you see is what arrives.",
  },
  {
    question: "Do you sell a trailer to tow a golf cart?",
    answer:
      "Yes — a 1 Man Tilt Trailer at R30,475 including VAT. The tilt bed and ramps mean one person can load a cart on their own. Buy it on its own or add it to a cart quote.",
  },
  {
    question: "What is included with the golf cart?",
    answer:
      "Diamond-stitched leather seating, a 10” touchscreen with Apple CarPlay and Android Auto, a Bluetooth soundbar, an integrated reverse camera, ambient interior and LED exterior lighting, carbon fibre and wood dashboard accents, all-terrain tyres, a rear golf bag stand and a cooler box.",
  },
];

/**
 * Where buyers come from.
 *
 * Two showrooms on opposite sides of the metro cover most of greater Cape
 * Town, and "golf carts for sale near me" resolves against place names in the
 * page text. Listed as plain prose on the page rather than a link farm of
 * thin per-suburb pages, which is the version of this tactic that gets sites
 * penalised rather than ranked.
 */
export const areasServed = [
  "Cape Town CBD",
  "Century City",
  "Milnerton",
  "Table View",
  "Bloubergstrand",
  "Durbanville",
  "Bellville",
  "Parow",
  "Goodwood",
  "Brackenfell",
  "Kuils River",
  "Somerset West",
  "Stellenbosch",
  "Paarl",
  "Constantia",
  "Hout Bay",
  "the Atlantic Seaboard",
  "the West Coast",
];

/**
 * Who these carts get bought for. Long-tail intent — "golf cart for a farm",
 * "estate golf cart", "resort buggy" — captured as honest use cases rather
 * than as a keyword list.
 */
export const useCases: { title: string; description: string }[] = [
  {
    title: "Golf courses and clubs",
    description:
      "Rear golf bag stand, integrated cooler box and a 40 km/h limit — quiet, quick between holes, and comfortable for eighteen of them.",
  },
  {
    title: "Estates and security villages",
    description:
      "Silent, zero-emission and easy to park. A cart that does the school run to the gate and the trip to the clubhouse without waking anyone.",
  },
  {
    title: "Farms and smallholdings",
    description:
      "All-terrain tyres, balanced suspension and 80–100 km of range cover a working day across uneven ground without a fuel stop.",
  },
  {
    title: "Resorts, lodges and guesthouses",
    description:
      "Move guests and luggage the length of a property in something that looks the part — leather, ambient lighting and a finished interior.",
  },
  {
    title: "Beach houses and holiday homes",
    description:
      "The short runs that do not deserve a car. Charges off a normal plug point in four to six hours.",
  },
  {
    title: "Retirement villages",
    description:
      "Simple to drive, stable at speed, and cheap to run — no fuel, no oil, no service schedule to keep track of.",
  },
];
