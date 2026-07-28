import { Reveal } from "@/components/reveal";
import { site } from "@/content/site";

/**
 * Holding page — proves the ported design system (tokens, Manrope, motion,
 * dot-grid, layout scale) renders correctly.
 *
 * The real landing page replaces this once the brand assets and business
 * details land. Section structure is deliberately not invented yet.
 */
export default function HomePage() {
  return (
    <section className="dot-grid flex min-h-screen items-center bg-white">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <Reveal y={20}>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-navy/70">
            {site.name}
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-6xl">
            Foundation ready.{" "}
            <span className="text-navy">Awaiting brand assets.</span>
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-6 max-w-md text-base leading-relaxed text-ink/65 sm:text-lg">
            Next.js 15, React 19, Tailwind v4 and the chom. design system are
            wired up. Drop in the logo, photography and copy and the landing
            page builds on top of this.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
