"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "./logo";
import { site } from "@/content/site";

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
