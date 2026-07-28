/**
 * Annotated feature shots — one marker per photograph, each opening a real
 * macro close-up of that detail.
 *
 * Coordinates are percentages of the displayed frame from the top-left. To
 * adjust one, open the site with ?hotspots=edit appended, click the spot, and
 * the exact x/y is printed and copied to the clipboard.
 *
 * The Cloudinary filenames do NOT follow their subject — Image_4 is the seat,
 * Image_6 is the dashboard, Image_5 is the stitching macro and Image_7 the
 * steering macro. Verified against the rendered page; do not reorder these on
 * the assumption that the numbers mean anything.
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
  label: string;
  src: string;
  alt: string;
  /** The photo's own aspect ratio — keeps marker coordinates truthful. */
  aspect: string;
  hotspots: Hotspot[];
};

const CLOUD = "https://res.cloudinary.com/dmanxetyl/image/upload/v1785234849";

const closeups = {
  stitching: `${CLOUD}/Image_5_jrdrf4.jpg`,
  steering: `${CLOUD}/Image_7_sgyiqs.jpg`,
};

/** Order is the on-page order: seating first, dashboard offset beside it. */
export const featureShots: FeatureShot[] = [
  {
    id: "seating",
    label: "Seating",
    src: `${CLOUD}/Image_4_yity0o.jpg`,
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
    ],
  },
  {
    id: "dashboard",
    label: "Dashboard",
    src: `${CLOUD}/Image_6_hnvibb.jpg`,
    alt: "Wulf golf cart dashboard, steering wheel and touchscreen display",
    aspect: "1 / 1",
    hotspots: [
      {
        id: "wheel",
        x: 46,
        y: 27,
        title: "Carbon-fibre steering wheel",
        description:
          "Carbon-fibre trim across the spokes and centre hub, with a moulded grip rim. PLACEHOLDER: confirm whether this is standard trim or an upgrade.",
        closeup: closeups.steering,
      },
    ],
  },
];
