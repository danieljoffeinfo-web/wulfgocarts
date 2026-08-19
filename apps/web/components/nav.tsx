"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "./logo";
import { site } from "@/content/site";

function FacebookGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z" />
    </svg>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Over the hero film the bar is transparent, so the mark and links invert
     to white. Once the white bar slides in they go back to ink. */
  const onFilm = !scrolled && !open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        onFilm
          ? "border-b border-transparent bg-transparent"
          : "border-b border-line bg-canvas/85 backdrop-blur-md"
      }`}
    >
      {/* Wider than the page's max-w-6xl on purpose: it pushes the mark to
          the far left and the links to the far right, rather than tucking
          both into the content column. */}
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 sm:h-20 sm:px-10">
        <Link
          href="/"
          aria-label={`${site.name} — home`}
          className="text-2xl sm:text-3xl"
        >
          <Logo inverted={onFilm} />
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-semibold transition-colors ${
                onFilm
                  ? "text-white/85 hover:text-white"
                  : "text-body/60 hover:text-body"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={site.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${site.name} on Facebook`}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
              onFilm
                ? "text-white/85 ring-1 ring-white/25 hover:bg-white/10 hover:text-white"
                : "text-body/55 ring-1 ring-line hover:bg-surface hover:text-[#1877F2]"
            }`}
          >
            <FacebookGlyph className="h-4 w-4" />
          </a>
          <Link
            href="/#visit"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-extrabold text-white transition-colors hover:bg-accent-deep"
          >
            Visit the showroom
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle menu"
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={`h-0.5 w-5 transition-transform ${
              onFilm ? "bg-white" : "bg-body"
            } ${open ? "translate-y-1 rotate-45" : ""}`}
          />
          <span
            className={`h-0.5 w-5 transition-transform ${
              onFilm ? "bg-white" : "bg-body"
            } ${open ? "-translate-y-1 -rotate-45" : ""}`}
          />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden border-t border-line bg-canvas md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {site.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-base font-semibold text-body/80 hover:bg-surface"
                >
                  {item.label}
                </Link>
              ))}
              <a
                href={site.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-semibold text-body/80 hover:bg-surface"
              >
                <FacebookGlyph className="h-5 w-5 text-[#1877F2]" />
                Facebook
              </a>
              <Link
                href="/#visit"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-full bg-accent px-5 py-3 text-center text-base font-extrabold text-white"
              >
                Visit the showroom
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
