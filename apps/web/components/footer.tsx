import Link from "next/link";
import { Logo } from "./logo";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-line-dark bg-ink-soft text-white">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Link href="/" aria-label={`${site.name} — home`} className="text-2xl">
              <Logo inverted />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/50">
              {site.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-12 sm:gap-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/35">
                Explore
              </p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {site.nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-white/70 transition-colors hover:text-accent-soft"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/35">
                Visit
              </p>
              <address className="mt-4 space-y-0.5 text-sm not-italic leading-relaxed text-white/70">
                {site.showroom.address.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </address>
              <a
                href={site.showroom.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-sm font-bold text-accent-soft underline-offset-4 hover:underline"
              >
                Get directions →
              </a>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/35">
                Get in touch
              </p>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <a
                    href={`tel:${site.phoneHref}`}
                    className="text-white/70 transition-colors hover:text-accent-soft"
                  >
                    {site.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${site.email}`}
                    className="text-white/70 transition-colors hover:text-accent-soft"
                  >
                    {site.email}
                  </a>
                </li>
                {site.social.map((s) => (
                  <li key={s.href}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/70 transition-colors hover:text-accent-soft"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-6 text-xs text-white/35">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
