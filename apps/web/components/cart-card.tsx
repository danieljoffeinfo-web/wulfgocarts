import { AssetSlot } from "./asset-slot";
import type { Cart } from "@/content/carts";

export function CartCard({ cart }: { cart: Cart }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 hover:-translate-y-1.5 hover:border-ink/20 hover:shadow-xl hover:shadow-ink/5">
      <div className="relative">
        <AssetSlot
          src={cart.image}
          alt={cart.name}
          label={`${cart.seats} photo`}
          aspect="4 / 3"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="rounded-none"
        />
        {cart.badge && (
          <span className="absolute left-4 top-4 rounded-full bg-amber px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-ink">
            {cart.badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-7">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-ink/40">
          {cart.seats}
        </p>
        <h3 className="mt-2 text-xl font-extrabold tracking-tight">
          {cart.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink/60">
          {cart.tagline}
        </p>

        <ul className="mt-5 space-y-2 border-t border-line pt-5">
          {cart.highlights.map((h) => (
            <li
              key={h}
              className="flex items-start gap-2.5 text-sm text-ink/70"
            >
              <span
                aria-hidden
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber"
              />
              {h}
            </li>
          ))}
        </ul>

        <a
          href="#visit"
          className="mt-6 text-sm font-bold text-ink underline-offset-4 transition-colors group-hover:text-amber-deep hover:underline"
        >
          See it in the showroom →
        </a>
      </div>
    </article>
  );
}
