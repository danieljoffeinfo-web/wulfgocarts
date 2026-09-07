"use client";

import { useState } from "react";
import { carts } from "@/content/carts";
import { site } from "@/content/site";
import { WhatsAppGlyph } from "./icons";

/**
 * The enquiry form.
 *
 * The site's existing conversion paths are WhatsApp and a downloadable quote
 * PDF, both of which need the visitor to already be on their phone or willing
 * to start a chat. This is the quiet path: someone browsing on a laptop at
 * work who wants a reply in their inbox tomorrow.
 *
 * The dropdown is built from content/carts.ts rather than a hardcoded list,
 * so adding a cart to the range puts it in the form the same day it appears
 * on the site — the same rule the sitemap follows.
 */
const interests = [
  ...carts
    .filter((cart) => cart.priceZAR)
    .map((cart) => cart.name),
  "Servicing or spares",
  "Something else",
];

type Status = "idle" | "sending" | "sent" | "error";

const EMPTY = { name: "", email: "", phone: "", interest: "", message: "", company: "" };

export function ContactForm() {
  const [values, setValues] = useState(EMPTY);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const set = (key: keyof typeof EMPTY) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setValues((prev) => ({ ...prev, [key]: event.target.value }));

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    setError("");
    setFieldErrors({});

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setFieldErrors(data.errors ?? {});
        setError(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setValues(EMPTY);
      setStatus("sent");
    } catch {
      /* Offline, or the request never left the device. */
      setError("We could not reach the showroom. Please check your connection.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div
        role="status"
        className="rounded-2xl border border-accent/40 bg-surface p-8 text-center sm:p-10"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/15">
          <svg viewBox="0 0 20 20" fill="none" className="h-6 w-6 text-accent-soft" aria-hidden="true">
            <path
              d="m5 10.5 3.5 3.5L15 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="mt-5 text-2xl font-extrabold tracking-tight">Message sent.</h3>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-body/60">
          Thanks — that has landed in the showroom inbox. We usually come back
          within one working day. If it is urgent, WhatsApp is faster.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          {site.whatsapp && (
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-6 py-3 text-sm font-extrabold text-[#04301b] transition-all hover:-translate-y-0.5 hover:bg-[#1ebe5b]"
            >
              <WhatsAppGlyph className="h-[18px] w-[18px]" />
              WhatsApp us
            </a>
          )}
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="rounded-full border border-line px-6 py-3 text-sm font-bold text-body/70 transition-colors hover:border-body/30 hover:text-body"
          >
            Send another
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" error={fieldErrors.name}>
          <input
            name="name"
            value={values.name}
            onChange={set("name")}
            autoComplete="name"
            required
            aria-invalid={!!fieldErrors.name}
            placeholder="Full name"
          />
        </Field>
        <Field label="Email" error={fieldErrors.email}>
          <input
            name="email"
            type="email"
            value={values.email}
            onChange={set("email")}
            autoComplete="email"
            required
            aria-invalid={!!fieldErrors.email}
            placeholder="you@example.com"
          />
        </Field>
        <Field label="Phone (optional)">
          <input
            name="phone"
            type="tel"
            value={values.phone}
            onChange={set("phone")}
            autoComplete="tel"
            placeholder="082 000 0000"
          />
        </Field>
        <Field label="Interested in">
          <select name="interest" value={values.interest} onChange={set("interest")}>
            <option value="">Not sure yet</option>
            {interests.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-5">
        <Field label="Message" error={fieldErrors.message}>
          <textarea
            name="message"
            value={values.message}
            onChange={set("message")}
            rows={5}
            required
            aria-invalid={!!fieldErrors.message}
            placeholder="Tell us what you are after — a colour, a delivery address, a test drive, or a question about running costs."
          />
        </Field>
      </div>

      {/*
        Honeypot. Hidden from people with CSS and from assistive tech with
        aria-hidden, and taken out of the tab order — so anything that fills it
        in is not a visitor. `autoComplete="off"` stops a browser helpfully
        completing it for a real person and getting them silently dropped.
      */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          Company
          <input
            name="company"
            tabIndex={-1}
            autoComplete="off"
            value={values.company}
            onChange={set("company")}
          />
        </label>
      </div>

      {status === "error" && error && (
        <p
          role="alert"
          className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300"
        >
          {error}{" "}
          {site.whatsapp && (
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline underline-offset-4"
            >
              WhatsApp us instead
            </a>
          )}
        </p>
      )}

      <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-full bg-accent px-8 py-3.5 text-sm font-extrabold text-white transition-all hover:-translate-y-0.5 hover:bg-accent-deep disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send enquiry"}
        </button>
        <p className="text-xs leading-relaxed text-body/40">
          Goes straight to the showroom. We reply within one working day.
        </p>
      </div>
    </form>
  );
}

/**
 * Label + control wrapper.
 *
 * The control styling is applied from the label with child selectors, exactly
 * as the quote builder does it — one place to change how every field on the
 * site looks, and no class list repeated on six inputs.
 */
function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-xs font-bold uppercase tracking-wider text-body/55">
      {label}
      <span
        className={`mt-2 block [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:bg-canvas [&_input]:px-4 [&_input]:py-3 [&_input]:text-sm [&_input]:font-medium [&_input]:normal-case [&_input]:tracking-normal [&_input]:text-body [&_input]:outline-none [&_input]:transition [&_input]:focus:border-accent [&_select]:w-full [&_select]:rounded-xl [&_select]:border [&_select]:bg-canvas [&_select]:px-4 [&_select]:py-3 [&_select]:text-sm [&_select]:font-medium [&_select]:normal-case [&_select]:tracking-normal [&_select]:text-body [&_select]:outline-none [&_select]:focus:border-accent [&_textarea]:w-full [&_textarea]:resize-y [&_textarea]:rounded-xl [&_textarea]:border [&_textarea]:bg-canvas [&_textarea]:px-4 [&_textarea]:py-3 [&_textarea]:text-sm [&_textarea]:font-medium [&_textarea]:normal-case [&_textarea]:tracking-normal [&_textarea]:text-body [&_textarea]:outline-none [&_textarea]:focus:border-accent ${
          error
            ? "[&_input]:border-red-500/60 [&_select]:border-red-500/60 [&_textarea]:border-red-500/60"
            : "[&_input]:border-line [&_select]:border-line [&_textarea]:border-line"
        }`}
      >
        {children}
      </span>
      {error && (
        <span className="mt-1.5 block text-xs font-semibold normal-case tracking-normal text-red-300">
          {error}
        </span>
      )}
    </label>
  );
}
