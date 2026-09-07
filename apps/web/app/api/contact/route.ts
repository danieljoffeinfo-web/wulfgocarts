import { NextResponse } from "next/server";
import { site } from "@/content/site";

/**
 * Contact form endpoint.
 *
 * Posts an enquiry to the showroom inbox through Resend. Everything that
 * varies between environments — the key, the sender, the recipient — is read
 * from the environment, so moving from Resend's sandbox sender to a branded
 * one is a dashboard change and not a deploy.
 *
 * Node runtime, not edge: nothing here needs edge, and the Node runtime keeps
 * the door open for anything (PDF attachments, a CRM write) that does not run
 * on a stripped-down runtime.
 */
export const runtime = "nodejs";
/* The route reads request headers for rate limiting, so it can never be
   statically rendered. Saying so explicitly beats relying on inference. */
export const dynamic = "force-dynamic";

/**
 * Who the enquiry goes to.
 *
 * Defaults to the address already published on the site, which is also the
 * address that owns the Resend account — that second fact is what lets the
 * sandbox sender below deliver before any DNS work is done.
 */
const TO = process.env.CONTACT_TO ?? site.email;

/**
 * Who it comes from.
 *
 * `onboarding@resend.dev` is Resend's sandbox sender. It is allowed to send to
 * exactly one recipient — the address that owns the Resend account — which
 * here is the showroom inbox, so the form works with no DNS at all.
 *
 * Once wulfgolfcarts.co.za (or a send.* subdomain) is verified in Resend, set
 * CONTACT_FROM to an address on it. That is worth doing: a branded From line
 * survives spam filtering far better than a shared sandbox domain, and it is
 * what the customer sees if the reply thread is ever forwarded.
 */
const FROM = process.env.CONTACT_FROM ?? `${site.name} <onboarding@resend.dev>`;

/** Field limits. Long enough for a real enquiry, short enough to bound abuse. */
const LIMITS = { name: 100, email: 254, phone: 40, interest: 120, message: 4000 };

/**
 * Per-IP rate limit, held in module scope.
 *
 * Fluid Compute reuses an instance across requests, so this catches the
 * ordinary case — one script hammering the endpoint — without a Redis. It is
 * deliberately not a security boundary: instances scale out and recycle, so a
 * determined sender gets a fresh bucket. The honeypot and the size limits do
 * the rest, and the blast radius of getting past all three is a spam email.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  /* Bound the map so a stream of unique IPs cannot grow it without limit. */
  if (hits.size > 5000) hits.clear();
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

/**
 * Deliberately permissive: one @, no spaces, a dot in the domain.
 *
 * Anything stricter rejects addresses that are legal and deliverable, and the
 * cost of a wrong rejection here is a lost customer. The address is proven or
 * disproven by the reply landing, not by a regex.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** HTML-escape. The enquiry is attacker-controlled text going into an email. */
const esc = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/**
 * Strip CR/LF from anything that lands in a header.
 *
 * The subject and Reply-To carry visitor input. A newline in a header value is
 * how header injection works, so it never reaches the API in the first place.
 */
const oneLine = (value: string) => value.replace(/[\r\n]+/g, " ").trim();

const clean = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  /**
   * Honeypot. The field is present in the DOM but hidden from people and from
   * screen readers; a bot that fills every input trips it. Answer 200 rather
   * than 400 — a bot that is told it failed simply tries something else.
   */
  if (clean(body.company, 200)) {
    return NextResponse.json({ ok: true });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many messages from this connection. Please try again shortly." },
      { status: 429 }
    );
  }

  const name = clean(body.name, LIMITS.name);
  const email = clean(body.email, LIMITS.email);
  const phone = clean(body.phone, LIMITS.phone);
  const interest = clean(body.interest, LIMITS.interest);
  const message = clean(body.message, LIMITS.message);

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Please tell us your name.";
  if (!email) errors.email = "Please give us an email address.";
  else if (!EMAIL_RE.test(email)) errors.email = "That email address does not look right.";
  if (!message) errors.message = "Please tell us what you are after.";
  if (Object.keys(errors).length) {
    return NextResponse.json({ error: "Please check the form.", errors }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    /* Configuration fault, not the visitor's. Say so honestly and let the UI
       offer WhatsApp and the phone number instead of eating the enquiry. */
    console.error("[contact] RESEND_API_KEY is not set — enquiry not sent.");
    return NextResponse.json(
      { error: "Our contact form is not available right now." },
      { status: 503 }
    );
  }

  const subject = oneLine(
    `Website enquiry — ${name}${interest ? ` — ${interest}` : ""}`
  );

  const rows: [string, string][] = [
    ["Name", name],
    ["Email", email],
    ["Phone", phone || "—"],
    ["Interested in", interest || "—"],
  ];

  const html = `<!doctype html>
<html lang="en"><body style="margin:0;background:#f4f5f7;padding:24px;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#0e0f11">
  <table role="presentation" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
    <tr><td style="background:#08090b;padding:20px 24px">
      <p style="margin:0;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#60a5fa;font-weight:700">${esc(site.name)}</p>
      <p style="margin:6px 0 0;font-size:19px;font-weight:800;color:#fff">New website enquiry</p>
    </td></tr>
    <tr><td style="padding:24px">
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;font-size:14px;border-collapse:collapse">
        ${rows
          .map(
            ([label, value]) => `<tr>
          <td style="padding:8px 0;color:#6b7280;width:120px;vertical-align:top">${esc(label)}</td>
          <td style="padding:8px 0;font-weight:600">${esc(value)}</td>
        </tr>`
          )
          .join("")}
      </table>
      <p style="margin:22px 0 8px;color:#6b7280;font-size:14px">Message</p>
      <div style="white-space:pre-wrap;font-size:15px;line-height:1.6;background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:14px">${esc(message)}</div>
      <p style="margin:24px 0 0;font-size:13px;color:#6b7280">
        Reply straight to this email and it goes back to
        <a href="mailto:${esc(email)}" style="color:#2563eb">${esc(email)}</a>.
      </p>
    </td></tr>
  </table>
</body></html>`;

  const text = [
    `New website enquiry — ${site.name}`,
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Message:",
    message,
    "",
    `Reply to this email to answer ${email} directly.`,
  ].join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        /* The whole point of the inbox workflow: hitting Reply in the showroom
           mailbox writes to the customer, not to the robot that sent this. */
        reply_to: oneLine(email),
        subject,
        html,
        text,
      }),
    });

    if (!response.ok) {
      /* Resend's message names the actual fault — an unverified domain, a
         revoked key — and it belongs in the server log, never in the response
         body where it would leak configuration to the public. */
      console.error(
        `[contact] Resend rejected the send (${response.status}):`,
        await response.text()
      );
      return NextResponse.json(
        { error: "We could not send that just now. Please try WhatsApp or call us." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact] Could not reach Resend:", error);
    return NextResponse.json(
      { error: "We could not send that just now. Please try WhatsApp or call us." },
      { status: 502 }
    );
  }
}
