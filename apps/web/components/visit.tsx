import { Reveal } from "./reveal";
import { AssetSlot } from "./asset-slot";
import { site } from "@/content/site";

/**
 * The conversion section. Everything on this page points here — the goal is
 * a showroom visit, not an online sale, so this carries the address, the
 * hours and the directions link rather than a cart or checkout.
 */
export function Visit() {
  return (
    <section id="visit" className="scroll-mt-20 bg-ink text-white">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-28">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <Reveal>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber">
                Come and see them
              </p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Photos only get you so far.
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-white/60">
                Sit in one. Take it for a run. The whole range is on the floor
                and there is no pressure to buy anything on the day.
              </p>

              <div className="mt-10 grid gap-8 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/40">
                    Where
                  </p>
                  <address className="mt-3 space-y-0.5 text-sm not-italic leading-relaxed text-white/80">
                    {site.showroom.address.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </address>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/40">
                    When
                  </p>
                  <dl className="mt-3 space-y-1.5 text-sm text-white/80">
                    {site.showroom.hours.map((h) => (
                      <div key={h.days} className="flex justify-between gap-4">
                        <dt className="text-white/55">{h.days}</dt>
                        <dd className="font-semibold">{h.time}</dd>
                      </div>
                    ))}
                  </dl>
                  {site.showroom.note && (
                    <p className="mt-3 text-xs leading-relaxed text-white/40">
                      {site.showroom.note}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href={site.showroom.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-amber px-7 py-3.5 text-sm font-extrabold text-ink transition-all hover:-translate-y-0.5 hover:bg-amber-deep"
                >
                  Get directions
                </a>
                <a
                  href={`tel:${site.phoneHref}`}
                  className="text-sm font-bold text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline"
                >
                  {site.phone} →
                </a>
                {site.whatsapp && (
                  <a
                    href={site.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline"
                  >
                    WhatsApp →
                  </a>
                )}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15} y={40}>
            <AssetSlot
              alt="The Wulf Golf Carts showroom"
              label="Showroom photo — wide shot of the floor"
              aspect="4 / 3"
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="border-white/10 bg-white/5"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
