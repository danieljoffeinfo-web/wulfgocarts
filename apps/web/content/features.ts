/**
 * Annotated feature shots — the markers laid over the product photography.
 *
 * Coordinates are percentages of the displayed frame, measured from the
 * top-left. They were placed by eye against the photos; to adjust one, open
 * the site with ?hotspots=edit appended, click the spot, and the exact x/y is
 * printed and copied to the clipboard.
 *
 * `closeup` points at a real macro photograph where one exists — always
 * sharper than magnifying the wide shot. Without it the detail pane falls
 * back to scaling the wide shot about the marker, controlled by `zoom`.
 */

export type Hotspot = {
  id: string;
  /** Percentage across the frame from the left edge. */
  x: number;
  /** Percentage down the frame from the top edge. */
  y: number;
  /** Which way the leader line points out of the marker. */
  side?: "left" | "right";
  title: string;
  description: string;
  /** Real macro photo of this detail. Beats magnifying the wide shot. */
  closeup?: string;
  /** Magnification when there is no `closeup`. */
  zoom?: number;
};

export type FeatureShot = {
  id: string;
  /** Tab label. */
  label: string;
  src: string;
  alt: string;
  /** The photo's own aspect ratio — keeps marker coordinates truthful. */
  aspect: string;
  hotspots: Hotspot[];
};

const CLOUD = "https://res.cloudinary.com/dmanxetyl/image/upload/v1785234849";

/** Macro shots, reused as the detail view for their matching markers. */
const closeups = {
  steering: `${CLOUD}/Image_5_jrdrf4.jpg`,
  stitching: `${CLOUD}/Image_7_sgyiqs.jpg`,
};

export const featureShots: FeatureShot[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    src: `${CLOUD}/Image_4_yity0o.jpg`,
    alt: "Wulf golf cart dashboard, steering wheel and touchscreen display",
    aspect: "1 / 1",
    hotspots: [
      {
        id: "display",
        x: 54,
        y: 58,
        title: "Touchscreen display",
        description:
          "Speed, power draw, trip distance and remaining range on one screen — no guessing how much charge is left before the back nine. PLACEHOLDER: confirm the screen size and whether it is standard or optional.",
      },
      {
        id: "wheel",
        x: 46,
        y: 27,
        title: "Carbon-fibre steering wheel",
        description:
          "Carbon-fibre trim across the spokes and centre hub, with a moulded grip rim. PLACEHOLDER: confirm whether this is standard trim or an upgrade.",
        closeup: closeups.steering,
      },
      {
        id: "drive-mode",
        x: 56,
        y: 79,
        title: "Drive mode selector",
        description:
          "Rotary selector for drive mode, including Sport. PLACEHOLDER: list the actual modes and what each one changes.",
        zoom: 3.4,
      },
      {
        id: "start-stop",
        x: 45,
        y: 81,
        side: "left",
        title: "Keyless start",
        description:
          "Illuminated start/stop button — no key barrel to wear out. PLACEHOLDER: confirm keyless entry details.",
        zoom: 3.6,
      },
      {
        id: "glovebox",
        x: 83,
        y: 59,
        title: "Lockable glovebox",
        description:
          "Key-lockable storage on the passenger side, so valuables stay put while the cart is parked up. PLACEHOLDER: confirm capacity.",
        zoom: 3,
      },
      {
        id: "cupholders",
        x: 78,
        y: 43,
        title: "Moulded cupholders",
        description:
          "Recessed holders either side of the dash. PLACEHOLDER: confirm how many and what they fit.",
        zoom: 3.2,
      },
    ],
  },
  {
    id: "seating",
    label: "Seating",
    src: `${CLOUD}/Image_6_hnvibb.jpg`,
    alt: "Wulf golf cart bench seat in diamond-quilted upholstery",
    aspect: "4 / 3",
    hotspots: [
      {
        id: "stitching",
        x: 55,
        y: 30,
        title: "Diamond-quilted upholstery",
        description:
          "Diamond quilting with contrast stitching and matching piping throughout. PLACEHOLDER: confirm the material and which colour combinations are available.",
        closeup: closeups.stitching,
      },
      {
        id: "headrest",
        x: 30,
        y: 9,
        side: "left",
        title: "Embossed headrests",
        description:
          "Padded headrests carrying the Wulf mark. PLACEHOLDER: confirm whether headrests are standard across the range.",
        zoom: 3.4,
      },
      {
        id: "belts",
        x: 46,
        y: 57,
        title: "Seat belts fitted",
        description:
          "Belts fitted across the bench as standard. PLACEHOLDER: confirm how many seating positions are belted.",
        zoom: 3.2,
      },
      {
        id: "grab-handles",
        x: 14,
        y: 68,
        side: "left",
        title: "Grab handles",
        description:
          "Padded handles at each end of the bench for getting in and out, and something to hold on rougher ground. PLACEHOLDER: confirm.",
        zoom: 3,
      },
    ],
  },
];
