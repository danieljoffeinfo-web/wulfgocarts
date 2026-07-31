/**
 * WULF 2-Seater specification data.
 *
 * `headline` are the four figures a buyer actually compares between carts —
 * they get the large treatment. `groups` is the full sheet underneath.
 */

export type Stat = {
  /** The figure itself. Kept short; the unit carries separately. */
  value: string;
  unit?: string;
  label: string;
};

export const headlineStats: Stat[] = [
  { value: "5", unit: "kW", label: "AC electric motor" },
  { value: "80–100", unit: "km", label: "Range per charge" },
  { value: "40", unit: "km/h", label: "Limited top speed" },
  { value: "4–6", unit: "hrs", label: "Full charge" },
];

export type SpecGroup = {
  title: string;
  rows: { label: string; value: string }[];
};

export const specGroups: SpecGroup[] = [
  {
    title: "Powertrain",
    rows: [
      { label: "Motor", value: "5 kW AC electric" },
      { label: "Battery", value: "51.2 V 150 Ah lithium" },
      { label: "Charge time", value: "4–6 hours" },
      { label: "Range", value: "80–100 km per full charge" },
      { label: "Top speed", value: "Limited to 40 km/h" },
      { label: "Emissions", value: "Zero" },
    ],
  },
  {
    title: "Wheels & ride",
    rows: [
      { label: "Standard", value: '12" mags, all-terrain tyres' },
      { label: "Lifted spec", value: '14" mags, all-terrain tyres' },
      { label: "Suspension", value: "Balanced, tuned for stability" },
    ],
  },
  {
    title: "Interior & tech",
    rows: [
      { label: "Seating", value: "Diamond-stitched leather" },
      { label: "Display", value: '10" touchscreen' },
      { label: "Smartphone", value: "Apple CarPlay & Android Auto" },
      { label: "Audio", value: "Bluetooth soundbar" },
      { label: "Camera", value: "Integrated reverse camera" },
      { label: "Dashboard", value: "Carbon fibre & wood accents" },
      { label: "Lighting", value: "Ambient interior, LED exterior" },
    ],
  },
  {
    title: "On the course",
    rows: [
      { label: "Golf bags", value: "Rear golf bag stand" },
      { label: "Refreshments", value: "Integrated cooler box" },
      { label: "Seats", value: "2" },
    ],
  },
];

/** Long-form product copy, as supplied. */
export const productCopy = {
  heading: "Golf-ready. Lifestyle-perfect.",
  paragraphs: [
    "The WULF 2-Seater Electric Golf Cart is designed to deliver the best of both worlds — effortless performance on the golf course and refined electric mobility for everyday lifestyle use. Whether you're heading to the tee box or cruising your estate, WULF combines power, comfort, and modern technology in one premium electric cart.",
    "Powered by a smooth 5 kW AC electric motor and a high-capacity 51.2 V 150 Ah lithium battery, the WULF 2-Seater delivers quiet, zero-emission driving with long range, fast charging, and minimal maintenance. A balanced suspension and durable all-terrain tyres ensure a comfortable, stable ride across golf courses, estates, and leisure environments.",
    "Inside, luxury diamond-stitched leather seating, a 10” touchscreen display, Apple CarPlay and Android Auto, Bluetooth soundbar, and an integrated reverse camera create a modern, connected, and confident driving experience. LED lighting and premium finishes complete the bold WULF design.",
    "Golfers benefit from a rear golf bag stand and integrated cooler box, while lifestyle users enjoy effortless electric cruising for estates, beach homes, farms, and resorts — all without compromise.",
  ],
  closer: "One cart. Two lifestyles. Pure electric freedom.",
};
