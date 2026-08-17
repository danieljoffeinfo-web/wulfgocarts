import type { Metadata } from "next";
import { QuoteBuilder } from "@/components/quote-builder";

export const metadata: Metadata = {
  title: "Build a Golf Cart Quote",
  description:
    "Build an indicative WULF golf cart purchase and operating-rental quote for the 2-seater or lifted 4-seater.",
  alternates: { canonical: "/quote" },
};

export default async function QuotePage({
  searchParams,
}: {
  searchParams: Promise<{ model?: string }>;
}) {
  const { model } = await searchParams;

  return (
    <section className="min-h-screen bg-canvas px-5 pb-24 pt-28 sm:px-8 sm:pt-32">
      <div className="mx-auto max-w-7xl">
        <QuoteBuilder initialModel={model} />
      </div>
    </section>
  );
}
