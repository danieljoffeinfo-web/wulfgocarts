import { Reveal } from "./reveal";
import { site } from "@/content/site";

/**
 * The conversion section. Everything on this page points here — the goal is
 * a showroom visit, not an online sale, so this carries the addresses, the
 * hours and the directions links rather than a cart or checkout.
 */
export function Visit() {
  return (
    <section id="visit" className="scroll-mt-20 bg-canvas text-white">
      <div className="mx-auto max-w-3xl px-5 py-24 sm:px-8 sm:py-28">
        <Reveal>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-soft">
              Come and see them
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Photos only get you so far.
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/60">
              Sit in one. Take it for a run. Our golf cart showroom on Montague
              Drive is a short drive from the Cape Town CBD, Century City,
              Milnerton and the northern suburbs — and there is no pressure to
              buy anything on the day.
            </p>

            {/* One block per branch. Two locations sit side by side on wider
                screens and stack on phones. */}
            <div className="mt-12 grid gap-x-10 gap-y-12 sm:grid-cols-2">
              {site.showrooms.map((branch) => (
                <div key={branch.name}>
                  <p className="text-xs font-bold uppercase tracking-widest text-accent-soft">
                    {branch.name}
                  </p>

                  <address className="mt-4 space-y-0.5 text-sm not-italic leading-relaxed text-white/80">
                    {branch.address.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </address>

                  {branch.appointmentOnly ? (
                    <p className="mt-4 inline-block rounded-full border border-white/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white/70">
                      By appointment only
                    </p>
                  ) : branch.hours ? (
                    <dl className="mt-4 space-y-1.5 text-sm text-white/80">
                      {branch.hours.map((h) => (
                        <div key={h.days} className="flex justify-between gap-4">
                          <dt className="text-white/55">{h.days}</dt>
                          <dd className="font-semibold">{h.time}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}

                  {branch.contact && (
                    <p className="mt-4 text-sm text-white/80">
                      {branch.contact.name && (
                        <span className="text-white/55">
                          {branch.contact.name} ·{" "}
                        </span>
                      )}
                      <a
                        href={`tel:${branch.contact.href}`}
                        className="font-bold text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline"
                      >
                        {branch.contact.phone}
                      </a>
                    </p>
                  )}

                  {branch.note && (
                    <p className="mt-3 text-xs leading-relaxed text-white/40">
                      {branch.note}
                    </p>
                  )}

                  {branch.mapsUrl && (
                    <a
                      href={branch.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-block rounded-full bg-accent px-6 py-3 text-sm font-extrabold text-white transition-all hover:-translate-y-0.5 hover:bg-accent-deep"
                    >
                      Get directions
                    </a>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-white/10 pt-8">
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
      </div>
    </section>
  );
}
