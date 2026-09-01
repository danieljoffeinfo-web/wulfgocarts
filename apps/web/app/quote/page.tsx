import type { Metadata } from "next";
import { QuoteBuilder } from "@/components/quote-builder";

export const metadata: Metadata = {
  title: { absolute: "Golf Cart Prices & Quote Builder | Wulf Cape Town" },
  description:
    "Price a golf cart for sale in Cape Town: the lithium 2-seater from R175,750, the lifted 4-seater from R207,431, or a trailer on its own. Purchase and monthly operating-rental figures, saved as a PDF.",
  alternates: { canonical: "/quote" },
  openGraph: {
    title: "Golf Cart Prices & Quote Builder — Cape Town",
    description:
      "Price a golf cart for sale in Cape Town — purchase and monthly operating-rental figures, saved as a PDF.",
    type: "website",
  },
};

export default async function QuotePage({
  searchParams,
}: {
  searchParams: Promise<{ model?: string; trailer?: string }>;
}) {
  const { model, trailer } = await searchParams;
  /* The trailer card links here as ?trailer=1. Clamped to the same 0–20 the
     control allows, so a hand-edited URL cannot seed a nonsense quantity. */
  const initialTrailers = Math.min(20, Math.max(0, Number(trailer) || 0));

  return (
    <section className="min-h-screen bg-canvas px-5 pb-24 pt-28 sm:px-8 sm:pt-32">
      <div className="mx-auto max-w-7xl">
        <QuoteBuilder initialModel={model} initialTrailers={initialTrailers} />
      </div>
    </section>
  );
}
