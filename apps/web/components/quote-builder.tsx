"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { carts } from "@/content/carts";
import { site } from "@/content/site";

const factors = [
  { min: 10_000, max: 19_999, 36: 0.03841, 48: 0.032, 60: 0.02771 },
  { min: 20_000, max: 49_999, 36: 0.03794, 48: 0.03115, 60: 0.027 },
  { min: 50_000, max: 99_999, 36: 0.0368, 48: 0.03007, 60: 0.02612 },
  { min: 100_000, max: Infinity, 36: 0.0356, 48: 0.029, 60: 0.0248 },
] as const;

/**
 * Optional trailer add-on. Quoted excl. VAT by the client; the rest of the
 * sheet works in VAT-inclusive rands, so it is converted once here. Adding
 * the inclusive figure to the purchase total keeps the rental maths correct
 * for free: capital-ex-VAT is derived by dividing the total back by 1.15, and
 * 30,475 / 1.15 lands back on 26,500.
 */
const VAT_RATE = 1.15;
const TRAILER_EX_VAT = 26_500;
const TRAILER_INCL_VAT = TRAILER_EX_VAT * VAT_RATE;

const rand = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 2,
});

const today = () =>
  new Intl.DateTimeFormat("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

function buildQuoteRef() {
  const now = new Date();
  const stamp = [
    String(now.getFullYear()).slice(2),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");
  try {
    const key = `wulf-quote-${stamp}`;
    const next = Number(window.localStorage.getItem(key) ?? "0") + 1;
    window.localStorage.setItem(key, String(next));
    return `WULF-${stamp}-${String(next).padStart(3, "0")}`;
  } catch {
    return `WULF-${stamp}-001`;
  }
}

export function QuoteBuilder({ initialModel }: { initialModel?: string }) {
  const available = carts.filter((cart) => cart.priceZAR);
  const fallback = available[0]?.slug ?? "two-seater";
  const [model, setModel] = useState(
    available.some((cart) => cart.slug === initialModel)
      ? initialModel!
      : fallback
  );
  const [quantity, setQuantity] = useState(1);
  const [trailer, setTrailer] = useState(false);
  const [customer, setCustomer] = useState("");
  const [business, setBusiness] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [quoteRef, setQuoteRef] = useState("WULF-QUOTE");

  useEffect(() => setQuoteRef(buildQuoteRef()), []);

  const selected = available.find((cart) => cart.slug === model) ?? available[0];
  const cartsInclVat = (selected?.priceZAR ?? 0) * quantity;
  const totalInclVat = cartsInclVat + (trailer ? TRAILER_INCL_VAT : 0);
  const capitalExVat = totalInclVat / VAT_RATE;
  const factor = factors.find(
    (row) => capitalExVat >= row.min && capitalExVat <= row.max
  );
  const rentals = useMemo(
    () =>
      ([36, 48, 60] as const).map((term) => ({
        term,
        amount: factor ? capitalExVat * factor[term] : 0,
      })),
    [capitalExVat, factor]
  );

  const emailHref = useMemo(() => {
    const subject = `Quote enquiry ${quoteRef} — ${selected?.name ?? "WULF cart"}`;
    const body = [
      `Hi Wulf Golf Carts,`,
      "",
      `Please contact me about ${quantity} × ${selected?.name ?? "WULF cart"}.`,
      trailer ? `Plus a trailer (${rand.format(TRAILER_EX_VAT)} excl. VAT).` : "",
      `Advertised total: ${rand.format(totalInclVat)} including VAT.`,
      customer ? `Name: ${customer}` : "",
      business ? `Business: ${business}` : "",
      phone ? `Phone: ${phone}` : "",
      notes ? `Notes: ${notes}` : "",
      "",
      `Reference: ${quoteRef}`,
    ]
      .filter(Boolean)
      .join("\n");
    return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [business, customer, notes, phone, quantity, quoteRef, selected, totalInclVat, trailer]);

  return (
    <div className="quote-builder grid gap-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-start">
      <section className="quote-controls rounded-3xl border border-line bg-raised p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-soft">
          Configure your quote
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Choose your WULF.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-body/60">
          Select a cart, add your details and save a clean quote as a PDF. Your
          information stays in this browser.
        </p>

        <div className="mt-8 space-y-5">
          <Field label="Model">
            <select value={model} onChange={(event) => setModel(event.target.value)}>
              {available.map((cart) => (
                <option key={cart.slug} value={cart.slug}>
                  {cart.name} — {cart.price}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Quantity">
            <input
              type="number"
              min={1}
              max={20}
              value={quantity}
              onChange={(event) =>
                setQuantity(Math.min(20, Math.max(1, Number(event.target.value) || 1)))
              }
            />
          </Field>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-canvas p-4 transition-colors hover:border-accent/60">
            <input
              type="checkbox"
              checked={trailer}
              onChange={(e) => setTrailer(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#2563eb]"
            />
            <span className="leading-tight">
              <span className="block text-sm font-bold text-body">
                Add a trailer
              </span>
              <span className="mt-0.5 block text-xs font-medium text-body/55">
                {rand.format(TRAILER_EX_VAT)} excl. VAT
              </span>
            </span>
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Your name">
              <input value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="Full name" />
            </Field>
            <Field label="Business (optional)">
              <input value={business} onChange={(e) => setBusiness(e.target.value)} placeholder="Company name" />
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Email">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </Field>
            <Field label="Phone">
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="082 000 0000" />
            </Field>
          </div>
          <Field label="Notes (optional)">
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} placeholder="Colour, delivery location or anything Wulf should know" />
          </Field>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-full bg-accent px-6 py-3.5 text-sm font-extrabold text-white transition-colors hover:bg-accent-deep"
          >
            Print / save PDF
          </button>
          <a
            href={emailHref}
            className="rounded-full border border-accent px-6 py-3.5 text-center text-sm font-extrabold text-accent-soft transition-colors hover:bg-accent/10"
          >
            Email Wulf
          </a>
        </div>
      </section>

      <article className="quote-sheet overflow-hidden rounded-3xl bg-white text-ink shadow-2xl shadow-black/30">
        <div className="h-2 bg-accent" />
        <header className="flex flex-col gap-6 bg-[#08090b] px-7 py-7 text-white sm:flex-row sm:items-center sm:justify-between sm:px-10">
          {/* A normal img keeps this browser-print document self-contained. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/wulf-logo-upscaled.png" alt="Wulf Golf Carts SA" className="h-auto w-56" />
          <div className="text-left text-[11px] font-bold uppercase leading-6 tracking-widest text-white/55 sm:text-right">
            <p>{quoteRef}</p>
            <p>{today()}</p>
          </div>
        </header>

        <div className="px-7 py-8 sm:px-10 sm:py-10">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#2563eb]">
            Indicative cart quotation
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight">
            {selected?.name}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-black/55">
            Prepared for {customer || "Customer"}
            {business ? ` · ${business}` : ""}
          </p>

          <div className="mt-8 overflow-hidden rounded-2xl border border-black/10">
            <QuoteRow label="Model" value={selected?.name ?? "—"} />
            <QuoteRow label="Quantity" value={String(quantity)} />
            <QuoteRow label="Price per cart" value={`${rand.format(selected?.priceZAR ?? 0)} incl. VAT`} />
            {trailer && (
              <QuoteRow label="Trailer" value={`${rand.format(TRAILER_INCL_VAT)} incl. VAT`} />
            )}
            <QuoteRow label="Total purchase price" value={`${rand.format(totalInclVat)} incl. VAT`} strong />
          </div>

          <div className="mt-8">
            {/* Side by side, the heading wrapped to two lines and pinched the
                qualifier against it. Stacked until there is room for both. */}
            <div className="flex flex-col items-start gap-1 border-b border-black/10 pb-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
              <h3 className="text-sm font-extrabold uppercase tracking-widest">
                Indicative operating rental
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wide text-black/40">
                VAT excluded
              </span>
            </div>
            {/* Three across even on a phone: comparing the terms is the whole
                point of the block, so stacking them would defeat it. The
                padding gives way instead. */}
            <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
              {rentals.map((rental) => (
                <div key={rental.term} className="rounded-xl bg-[#f2f4f7] p-2.5 text-center sm:p-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-black/40">
                    {rental.term} months
                  </p>
                  <p className="mt-2 text-sm font-extrabold sm:text-base">
                    {rand.format(rental.amount)}
                  </p>
                  <p className="mt-1 text-[9px] text-black/40">per month</p>
                </div>
              ))}
            </div>
          </div>

          {(email || phone || notes) && (
            <div className="mt-8 rounded-2xl bg-[#f2f4f7] p-5 text-sm leading-relaxed text-black/60">
              {email && <p><strong className="text-black">Email:</strong> {email}</p>}
              {phone && <p><strong className="text-black">Phone:</strong> {phone}</p>}
              {notes && <p className="mt-3 whitespace-pre-wrap"><strong className="text-black">Notes:</strong> {notes}</p>}
            </div>
          )}

          <div className="mt-8 border-t border-black/10 pt-6 text-[10px] leading-relaxed text-black/45">
            <p>
              Advertised purchase prices include VAT and are subject to stock availability.
            </p>
            <p className="mt-2">
              Rental amounts are indicative only, calculated from capital excluding VAT using the factors supplied with the original quote tool. Final payments, fees and approval are determined by the finance provider.
            </p>
          </div>
        </div>

        <footer className="flex flex-col gap-2 border-t border-black/10 px-7 py-5 text-[10px] font-bold uppercase tracking-wider text-black/45 sm:flex-row sm:justify-between sm:px-10">
          <span>{site.phone} · {site.email}</span>
          <span>{site.showroom.address.join(", ")}</span>
        </footer>
        <div className="h-2 bg-accent" />
      </article>

      <div className="quote-controls lg:col-start-2">
        <Link href="/#range" className="text-sm font-bold text-body/55 underline-offset-4 hover:text-accent-soft hover:underline">
          ← Back to the range
        </Link>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-xs font-bold uppercase tracking-wider text-body/55">
      {label}
      <span className="mt-2 block [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-line [&_input]:bg-canvas [&_input]:px-4 [&_input]:py-3 [&_input]:text-sm [&_input]:font-medium [&_input]:text-body [&_input]:outline-none [&_input]:transition [&_input]:focus:border-accent [&_select]:w-full [&_select]:rounded-xl [&_select]:border [&_select]:border-line [&_select]:bg-canvas [&_select]:px-4 [&_select]:py-3 [&_select]:text-sm [&_select]:font-medium [&_select]:text-body [&_select]:outline-none [&_select]:focus:border-accent [&_textarea]:w-full [&_textarea]:resize-y [&_textarea]:rounded-xl [&_textarea]:border [&_textarea]:border-line [&_textarea]:bg-canvas [&_textarea]:px-4 [&_textarea]:py-3 [&_textarea]:text-sm [&_textarea]:font-medium [&_textarea]:normal-case [&_textarea]:tracking-normal [&_textarea]:text-body [&_textarea]:outline-none [&_textarea]:focus:border-accent">
        {children}
      </span>
    </label>
  );
}

function QuoteRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    // gap-6 fixed on a 390px sheet left the value about 150px to work in, so
    // "R 175,750.00 incl. VAT" broke mid-figure. The gap only needs to be
    // generous once there is width to spend.
    <div className="flex items-start justify-between gap-3 border-b border-black/10 px-4 py-4 text-sm last:border-b-0 sm:gap-6 sm:px-5">
      <span className="shrink-0 text-black/45">{label}</span>
      <span
        className={`text-right ${
          strong
            ? /* text-lg alone still broke the total across two lines on a
                 375px sheet; it steps up once the row has room. */
              "text-base font-extrabold text-[#2563eb] sm:text-lg"
            : "font-bold"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
