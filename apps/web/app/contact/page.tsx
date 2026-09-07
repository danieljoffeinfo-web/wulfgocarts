import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";
import { site } from "@/content/site";
import { WhatsAppGlyph } from "@/components/icons";

/**
 * Titles lead with the search phrase, not the brand — the same rule the rest
 * of the site follows. "Contact" alone would rank for nothing.
 */
export const metadata: Metadata = {
  title: { absolute: `Contact Wulf Golf Carts — Golf Cart Dealer, Cape Town` },
  description:
    "Contact Wulf Golf Carts in Cape Town: send an enquiry, WhatsApp us on 082 425 4253, or visit the Montague Gardens or Blackheath showroom to test-drive an electric golf cart.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Wulf Golf Carts — Cape Town",
    description:
      "Send an enquiry, WhatsApp us, or visit a showroom to test-drive an electric golf cart.",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <section className="min-h-screen bg-canvas px-5 pb-24 pt-28 sm:px-8 sm:pt-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-soft">
              Get in touch
            </p>
            <h1 className="mt-4 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">
              Ask us anything about the range.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-body/60">
              Prices, colours, delivery anywhere in the Western Cape, running
              costs, or booking a test drive — send it through and a person at
              the showroom answers. No call centre, no automated reply.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-16">
          <Reveal>
            <ContactForm />
          </Reveal>

          {/*
            The form is the point of the page, but it is not the fastest way to
            reach a golf cart dealer in South Africa — WhatsApp is. Putting both
            alongside each other costs the form nothing and catches the visitor
            who would otherwise have bounced looking for a number.
          */}
          <Reveal>
            <div className="space-y-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-accent-soft">
                  Faster than email
                </p>
                <div className="mt-4 flex flex-col items-start gap-3">
                  {site.whatsapp && (
                    <a
                      href={site.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-extrabold text-[#04301b] shadow-lg shadow-[#25D366]/20 transition-all hover:-translate-y-0.5 hover:bg-[#1ebe5b]"
                    >
                      <WhatsAppGlyph className="h-[18px] w-[18px]" />
                      WhatsApp {site.whatsappDisplay}
                    </a>
                  )}
                  <a
                    href={`tel:${site.phoneHref}`}
                    className="text-sm font-bold text-body/70 underline-offset-4 transition-colors hover:text-body hover:underline"
                  >
                    Call {site.phone} →
                  </a>
                  <a
                    href={`mailto:${site.email}`}
                    className="text-sm font-bold text-body/70 underline-offset-4 transition-colors hover:text-body hover:underline"
                  >
                    {site.email} →
                  </a>
                </div>
              </div>

              <div className="border-t border-line pt-8">
                <p className="text-xs font-bold uppercase tracking-widest text-accent-soft">
                  Come and see them
                </p>
                <div className="mt-5 space-y-8">
                  {site.showrooms.map((branch) => (
                    <div key={branch.name}>
                      <p className="text-sm font-extrabold">{branch.name}</p>
                      <address className="mt-2 space-y-0.5 text-sm not-italic leading-relaxed text-body/60">
                        {branch.address.map((line) => (
                          <p key={line}>{line}</p>
                        ))}
                      </address>

                      {branch.appointmentOnly ? (
                        <p className="mt-3 inline-block rounded-full border border-line px-3 py-1 text-xs font-bold uppercase tracking-widest text-body/60">
                          By appointment only
                        </p>
                      ) : branch.hours ? (
                        <dl className="mt-3 max-w-[15rem] space-y-1.5 text-sm text-body/70">
                          {branch.hours.map((h) => (
                            <div key={h.days} className="flex justify-between gap-4">
                              <dt className="text-body/45">{h.days}</dt>
                              <dd className="font-semibold">{h.time}</dd>
                            </div>
                          ))}
                        </dl>
                      ) : null}

                      {branch.contact && (
                        <p className="mt-3 text-sm text-body/70">
                          {branch.contact.name && (
                            <span className="text-body/45">{branch.contact.name} · </span>
                          )}
                          <a
                            href={`tel:${branch.contact.href}`}
                            className="font-bold underline-offset-4 transition-colors hover:text-body hover:underline"
                          >
                            {branch.contact.phone}
                          </a>
                        </p>
                      )}

                      {branch.note && (
                        <p className="mt-2 text-xs leading-relaxed text-body/40">
                          {branch.note}
                        </p>
                      )}

                      {branch.mapsUrl && (
                        <a
                          href={branch.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-block text-sm font-bold text-accent-soft underline-offset-4 hover:underline"
                        >
                          Get directions →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
