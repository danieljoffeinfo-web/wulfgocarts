/**
 * Builds the quote as a real PDF file, in the browser.
 *
 * This exists because a file is the only thing that can be *attached*. The
 * wa.me and mailto: links can carry prefilled text and nothing else, so a
 * quote sent through them has to be retyped or read off the screen. A Blob
 * can be handed to the Web Share API, which on a phone drops it into WhatsApp
 * as an attachment, or saved to disk on a desktop.
 *
 * Drawn with jsPDF's primitives rather than rasterising the DOM: a screenshot
 * of the sheet would be a heavy image with unselectable text that prints
 * soft, where this stays crisp, searchable and a fraction of the size. jsPDF
 * is imported dynamically by the caller so it never enters the page bundle.
 */

export type QuotePdfInput = {
  quoteRef: string;
  date: string;
  modelName: string;
  quantity: number;
  pricePerCart: string;
  trailer?: string;
  total: string;
  rentals: { term: number; amount: string }[];
  customer?: string;
  business?: string;
  email?: string;
  phone?: string;
  notes?: string;
  /** Business footer line, e.g. phone · email. */
  contactLine: string;
  addressLine: string;
};

/** Brand colours, matching the on-screen sheet. */
const INK: [number, number, number] = [8, 9, 11];
const BLUE: [number, number, number] = [37, 99, 235];
const MUTED: [number, number, number] = [110, 116, 128];
const RULE: [number, number, number] = [226, 229, 234];
const PANEL: [number, number, number] = [242, 244, 247];

export async function buildQuotePdf(q: QuotePdfInput): Promise<Blob> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const W = doc.internal.pageSize.getWidth();
  const M = 40;
  const inner = W - M * 2;

  /* Accent rule and dark masthead, as on screen. */
  doc.setFillColor(...BLUE);
  doc.rect(0, 0, W, 6, "F");
  doc.setFillColor(...INK);
  doc.rect(0, 6, W, 74, "F");

  /* The real lockup, same file the on-screen sheet uses. Same-origin, so it
     reads without CORS. If it cannot be fetched the wordmark is typeset
     instead — a quote that is missing its logo is still a usable quote, and
     failing the whole download over an image would not be. */
  const logo = await loadLogo();
  if (logo) {
    const h = 34;
    doc.addImage(logo.data, "PNG", M, 24, (logo.w / logo.h) * h, h);
  } else {
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("WULF", M, 40);
    doc.setTextColor(96, 165, 250);
    doc.setFontSize(9);
    doc.text("GOLF CARTS SA", M, 56);
  }
  doc.setFont("helvetica", "bold");

  doc.setTextColor(190, 195, 205);
  doc.setFontSize(8);
  doc.text(q.quoteRef, W - M, 40, { align: "right" });
  doc.text(q.date, W - M, 54, { align: "right" });

  let y = 118;

  doc.setTextColor(...BLUE);
  doc.setFontSize(8);
  doc.text("INDICATIVE CART QUOTATION", M, y);

  y += 26;
  doc.setTextColor(...INK);
  doc.setFontSize(20);
  doc.text(q.modelName, M, y);

  y += 20;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...MUTED);
  const preparedFor = [q.customer || "Customer", q.business]
    .filter(Boolean)
    .join("  ·  ");
  doc.text(`Prepared for ${preparedFor}`, M, y);

  /* Line-item table. */
  y += 26;
  const rows: [string, string, boolean][] = [
    ["Model", q.modelName, false],
    ["Quantity", String(q.quantity), false],
    ["Price per cart", `${q.pricePerCart} incl. VAT`, false],
  ];
  if (q.trailer) rows.push(["Trailer", `${q.trailer} incl. VAT`, false]);
  rows.push(["Total purchase price", `${q.total} incl. VAT`, true]);

  const rowH = 30;
  doc.setDrawColor(...RULE);
  doc.setLineWidth(0.8);
  doc.roundedRect(M, y, inner, rowH * rows.length, 6, 6, "S");

  rows.forEach(([label, value, strong], i) => {
    const ry = y + rowH * i;
    if (i > 0) doc.line(M, ry, M + inner, ry);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...MUTED);
    doc.text(label, M + 14, ry + 19);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...(strong ? BLUE : INK));
    doc.setFontSize(strong ? 12 : 10);
    doc.text(value, M + inner - 14, ry + 19, { align: "right" });
  });
  y += rowH * rows.length + 34;

  /* Operating rental, three cards across. */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...INK);
  doc.text("INDICATIVE OPERATING RENTAL", M, y);
  doc.setTextColor(...MUTED);
  doc.setFontSize(7.5);
  doc.text("VAT EXCLUDED", M + inner, y, { align: "right" });

  y += 10;
  doc.setDrawColor(...RULE);
  doc.line(M, y, M + inner, y);

  y += 14;
  const gap = 10;
  const cardW = (inner - gap * 2) / 3;
  const cardH = 64;
  q.rentals.forEach((r, i) => {
    const x = M + (cardW + gap) * i;
    doc.setFillColor(...PANEL);
    doc.roundedRect(x, y, cardW, cardH, 6, 6, "F");
    doc.setTextColor(...MUTED);
    doc.setFontSize(7.5);
    doc.text(`${r.term} MONTHS`, x + cardW / 2, y + 20, { align: "center" });
    doc.setTextColor(...INK);
    doc.setFontSize(12);
    doc.text(r.amount, x + cardW / 2, y + 40, { align: "center" });
    doc.setTextColor(...MUTED);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text("per month", x + cardW / 2, y + 54, { align: "center" });
    doc.setFont("helvetica", "bold");
  });
  y += cardH + 30;

  /* Contact details, only when the visitor supplied any. */
  const details = [
    q.email && `Email: ${q.email}`,
    q.phone && `Phone: ${q.phone}`,
  ].filter(Boolean) as string[];
  if (details.length || q.notes) {
    const noteLines = q.notes
      ? doc.splitTextToSize(`Notes: ${q.notes}`, inner - 28)
      : [];
    const boxH = 18 + details.length * 14 + (noteLines.length ? 8 + noteLines.length * 12 : 0);
    doc.setFillColor(...PANEL);
    doc.roundedRect(M, y, inner, boxH, 6, 6, "F");
    let ty = y + 20;
    doc.setFontSize(9.5);
    doc.setTextColor(...INK);
    details.forEach((line) => {
      doc.text(line, M + 14, ty);
      ty += 14;
    });
    if (noteLines.length) {
      ty += 6;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...MUTED);
      noteLines.forEach((line: string) => {
        doc.text(line, M + 14, ty);
        ty += 12;
      });
      doc.setFont("helvetica", "bold");
    }
    y += boxH + 24;
  }

  /* Small print — the same wording as the on-screen sheet, because this is
     the document that leaves the site and gets forwarded. */
  doc.setDrawColor(...RULE);
  doc.line(M, y, M + inner, y);
  y += 16;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...MUTED);
  [
    "Advertised purchase prices include VAT and are subject to stock availability.",
    "Rental amounts are indicative only, calculated from capital excluding VAT using the factors supplied with the original quote tool. Final payments, fees and approval are determined by the finance provider.",
  ].forEach((para) => {
    const lines = doc.splitTextToSize(para, inner);
    doc.text(lines, M, y);
    y += lines.length * 10 + 6;
  });

  /* Footer band. */
  const H = doc.internal.pageSize.getHeight();
  doc.setDrawColor(...RULE);
  doc.line(M, H - 58, M + inner, H - 58);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...MUTED);
  doc.text(q.contactLine.toUpperCase(), M, H - 42);
  doc.text(q.addressLine.toUpperCase(), M + inner, H - 42, { align: "right" });
  doc.setFillColor(...BLUE);
  doc.rect(0, H - 6, W, 6, "F");

  return doc.output("blob");
}

/**
 * The brand lockup as a data URL, with its natural proportions so the caller
 * can scale it without distorting it. Resolves to null on any failure.
 *
 * Redrawn through a canvas at print size first. The source is the upscaled
 * 2109px master, and jsPDF embeds whatever it is handed verbatim — passing
 * the original straight in produced a 6 MB quote, which is not something to
 * send over WhatsApp. The mark prints about 113pt wide, so 480px covers it at
 * 300dpi and costs a few kilobytes.
 */
const LOGO_PRINT_PX = 480;

async function loadLogo(): Promise<{ data: string; w: number; h: number } | null> {
  try {
    const res = await fetch("/brand/wulf-logo-upscaled.png");
    if (!res.ok) return null;
    const bitmap = await createImageBitmap(await res.blob());
    const scale = Math.min(1, LOGO_PRINT_PX / bitmap.width);
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close();

    return { data: canvas.toDataURL("image/png"), w, h };
  } catch {
    return null;
  }
}

/** Filename used for both the download and the shared attachment. */
export const quotePdfName = (quoteRef: string) => `${quoteRef}.pdf`;
