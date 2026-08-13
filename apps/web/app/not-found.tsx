import Link from "next/link";
import { site } from "@/content/site";

export const metadata = {
  title: "Page not found",
  /* A 404 carries no value in search and shouldn't compete with real pages. */
  robots: { index: false, follow: true },
};

/**
 * Custom 404.
 *
 * The default Next page is a bare "404" on white with no way back. Someone
 * who mistypes a URL or follows a stale link is still a potential customer,
 * so this keeps the brand, gives them the range and the showroom, and puts
 * the phone number in front of them.
 */
export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center bg-canvas pt-28 sm:pt-32">
      <div className="mx-auto w-full max-w-6xl px-5 pb-24 sm:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-soft">
          404
        </p>
        <h1 className="mt-4 max-w-2xl text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
          That page has gone for a drive.
        </h1>
        <p className="mt-6 max-w-md text-base leading-relaxed text-body/65 sm:text-lg">
          The link you followed doesn&apos;t exist any more. The carts are all
          still here though.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/"
            className="rounded-full bg-accent px-7 py-3.5 text-sm font-extrabold text-white transition-all hover:-translate-y-0.5 hover:bg-accent-deep"
          >
            Back to the range
          </Link>
          <a
            href={`tel:${site.phoneHref}`}
            className="text-sm font-bold text-body/70 underline-offset-4 transition-colors hover:text-accent-soft hover:underline"
          >
            {site.phone} →
          </a>
        </div>
      </div>
    </section>
  );
}
