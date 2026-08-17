import Link from "next/link";
import { AssetSlot } from "./asset-slot";
import { SpinViewer } from "./spin-viewer";
import { ColourPicker } from "./colour-picker";
import type { Cart } from "@/content/carts";

/**
 * The whole card links through to the cart's detail page via a stretched
 * link — an absolutely positioned anchor covering the card — rather than
 * wrapping everything in an <a>. Wrapping would nest the colour swatch
 * buttons inside an anchor, which is invalid and makes tapping a colour
 * navigate away. The swatch row sits at z-10 to stay above it.
 */
export function CartCard({ cart }: { cart: Cart }) {
  const href =
    cart.detailsAvailable === false
      ? `/quote?model=${cart.slug}`
      : `/carts/${cart.slug}`;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-raised transition-all duration-300 hover:-translate-y-1.5 hover:border-ink/20 hover:shadow-xl hover:shadow-ink/5">
      <div className="relative">
        {cart.colours?.length ? (
          <ColourPicker colours={cart.colours} alt={cart.name} aspect="4 / 3" />
        ) : cart.frames?.length ? (
          <SpinViewer
            frames={cart.frames}
            alt={cart.name}
            aspect="4 / 3"
            className="rounded-none"
          />
        ) : (
          <AssetSlot
            src={cart.image}
            alt={cart.name}
            label={`${cart.seats} photo`}
            aspect="4 / 3"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="rounded-none"
          />
        )}
        {cart.badge && (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-accent px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white">
            {cart.badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-7">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-body/55">
            {cart.seats}
          </p>
          {cart.price && (
            <div className="text-right">
              <p className="text-lg font-extrabold tracking-tight text-accent-soft">
                {cart.price}
              </p>
              {cart.priceNote && (
                <p className="mt-1 max-w-44 text-[10px] font-bold uppercase leading-tight tracking-wide text-body/40">
                  {cart.priceNote}
                </p>
              )}
            </div>
          )}
        </div>
        <h3 className="mt-2 text-xl font-extrabold tracking-tight">
          {cart.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-body/60">
          {cart.tagline}
        </p>

        <ul className="mt-5 space-y-2 border-t border-line pt-5">
          {cart.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2.5 text-sm text-body/70">
              <span
                aria-hidden
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
              />
              {h}
            </li>
          ))}
        </ul>

        <span className="mt-6 text-sm font-bold text-body transition-colors group-hover:text-accent-soft">
          {cart.detailsAvailable === false
            ? "Build a quote →"
            : "View details and book a viewing →"}
        </span>
      </div>

      <Link href={href} className="absolute inset-0" aria-label={cart.name}>
        <span className="sr-only">{cart.name}</span>
      </Link>
    </article>
  );
}
