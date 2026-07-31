import { Reveal, Stagger, StaggerItem } from "./reveal";
import { headlineStats, specGroups } from "@/content/specs";

/**
 * The specification sheet.
 *
 * Two tiers, because buyers read in two passes: four headline figures set
 * large for the skim, and the full grouped sheet underneath for the person
 * who is actually comparing carts.
 */
export function SpecSheet() {
  return (
    <div>
      {/* Headline figures */}
      <Stagger className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-line lg:grid-cols-4">
        {headlineStats.map((stat) => (
          <StaggerItem key={stat.label} className="bg-white">
            <div className="px-6 py-8 sm:px-8 sm:py-10">
              <p className="flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
                  {stat.value}
                </span>
                {stat.unit && (
                  <span className="text-lg font-extrabold text-accent sm:text-xl">
                    {stat.unit}
                  </span>
                )}
              </p>
              <p className="mt-3 text-xs font-bold uppercase tracking-[0.15em] text-ink/45">
                {stat.label}
              </p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>

      {/* Full sheet */}
      <div className="mt-12 grid gap-x-14 gap-y-10 sm:grid-cols-2">
        {specGroups.map((group, i) => (
          <Reveal key={group.title} delay={i * 0.06}>
            <section>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                {group.title}
              </h3>
              <dl className="mt-4">
                {group.rows.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-baseline justify-between gap-6 border-b border-line py-3 last:border-b-0"
                  >
                    <dt className="shrink-0 text-sm text-ink/50">
                      {row.label}
                    </dt>
                    <dd className="text-right text-sm font-semibold text-ink">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
