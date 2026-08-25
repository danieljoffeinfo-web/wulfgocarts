import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { ContactSheet } from "@/components/contact-sheet";
import { bandSrc, photos } from "@/content/gallery";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Every Wulf golf cart, every angle — bodywork, stitching, wheels and the full row at first light. Filter the range by colour.",
  openGraph: {
    title: `Gallery — ${site.name}`,
    description:
      "Every Wulf golf cart, every angle. Filter the range by colour.",
    images: [bandSrc("line-low-angle", "v1787610284", 1200)],
  },
};

/* The hero still: the low-angle run down the row, sun flaring off the end of
   it. Served at 4:3 and cropped by object-cover so one file covers every
   viewport; the focal point sits left of centre, where the nearest cart is. */
const HERO =
  "https://res.cloudinary.com/dmanxetyl/image/upload/f_auto,q_auto,c_limit,w_2400/v1787610284/wulf/gallery/line-low-angle.jpg";

export default function GalleryPage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────
          Full-bleed photograph, canvas scrim, type sitting on the floor of the
          frame. The nav renders transparent over it and inverts to white. */}
      <section className="relative h-[82svh] min-h-[520px] w-full overflow-hidden bg-canvas">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO}
          alt="Low-angle view down a row of Wulf golf carts with the sun flaring behind them"
          className="absolute inset-0 h-full w-full object-cover object-[42%_60%]"
          fetchPriority="high"
        />
        {/* Two scrims: one across the whole frame so the nav stays legible,
            one heavier at the foot for the headline. */}
        <div className="absolute inset-0 bg-canvas/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/45 to-transparent" />

        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-6xl px-5 pb-14 sm:px-8 sm:pb-20">
            <Reveal y={20}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-soft">
                Gallery
              </p>
              <h1 className="mt-4 max-w-3xl text-balance text-4xl font-extrabold leading-[1.03] tracking-tight text-white sm:text-6xl lg:text-7xl">
                The whole line.
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-white/70 sm:text-lg">
                {photos.length} frames of the range — bodywork, stitching,
                wheels, and the full row at first light.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Orientation ───────────────────────────────────────────────────
          Contained, so the full-bleed sheet below has an edge to push against. */}
      <section className="bg-canvas">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-soft">
              Every colour it comes in
            </p>
            <h2 className="mt-3 max-w-xl text-balance text-3xl font-extrabold leading-[1.1] tracking-tight text-body sm:text-4xl">
              Photographs, not renders.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-body/65">
              Same cart, five colourways, shot from every side — plus the
              close-ups that tell you what the trim is actually like. Pick a
              colour to narrow the sheet, or tap any frame to fill the screen.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Rail + full-bleed contact sheet. */}
      <ContactSheet />

      {/* ── Closing band ──────────────────────────────────────────────────
          The widest frame in the set, cropped to a letterbox: the row on the
          left, open road on the right, and the copy sitting in that space. */}
      <section className="relative isolate overflow-hidden bg-canvas">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bandSrc("line-open-road", "v1787610332")}
          alt="A row of Wulf golf carts beside an open road at sunset"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-canvas/85 via-canvas/55 to-canvas/20 sm:to-transparent" />

        <div className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
          <Reveal>
            <h2 className="max-w-lg text-balance text-3xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-4xl">
              Seeing them in a row is one thing. Sitting in one is another.
            </h2>
            <p className="mt-5 max-w-sm text-base leading-relaxed text-white/70">
              The range is on the floor at our showroom. Come through and take
              one out properly.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/#visit"
                className="rounded-full bg-accent px-6 py-3 text-sm font-extrabold text-white transition-colors hover:bg-accent-deep"
              >
                Visit the showroom
              </Link>
              <Link
                href="/#range"
                className="rounded-full border border-white/25 px-6 py-3 text-sm font-bold text-white/90 transition-colors hover:border-white/60 hover:text-white"
              >
                See the range
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
