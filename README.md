# Wulf Go Carts

Landing page for Wulf Go Carts, built on the same stack and design system as
[chom.biz](https://chom.biz).

## Stack

- **Next.js 15** (App Router) + **React 19**
- **Tailwind CSS v4** — CSS-first config via `@theme` in `app/globals.css`
- **Framer Motion 12** — scroll-reveal primitives in `components/reveal.tsx`
- **TypeScript**, npm workspaces monorepo

## Getting started

```bash
npm install
npm run dev
```

The site runs at http://localhost:3000.

## Where things live

| Path | What it holds |
| --- | --- |
| `apps/web/app/globals.css` | Brand tokens (colours, font, easing). Change hex values here and the whole site follows. |
| `apps/web/content/site.ts` | Site name, domain, contact details, nav — all editable without touching components. |
| `apps/web/components/reveal.tsx` | `Reveal` / `Stagger` / `StaggerItem` scroll animations. Respects `prefers-reduced-motion`. |
| `apps/web/app/page.tsx` | The landing page. |
| `apps/web/public/` | Static assets — logo, photography. |

## Design system

Ported from chom.biz:

- **Colours** — `navy` `#0d3b66`, `navy-deep` `#092a4a`, `ink` `#0a0a0a`, `mist` `#f4f5f7`, `line` `#e3e6eb`
- **Type** — Manrope, `font-extrabold` headings with tight tracking; eyebrow labels are `text-xs font-bold uppercase tracking-[0.2em]`
- **Layout** — `mx-auto max-w-6xl px-5 sm:px-8`, sections at `py-24 sm:py-28`, alternating white / mist backgrounds
- **Buttons** — full pills: `rounded-full bg-navy px-7 py-3.5 text-sm font-bold text-white hover:-translate-y-0.5`
- **Cards** — `rounded-2xl border border-line bg-mist p-7`, hover inverts to navy
- **Motion** — ease-out-expo `cubic-bezier(0.16, 1, 0.3, 1)`

## Status

Foundation only. Brand assets and business copy still to come — values marked
`PLACEHOLDER` in `content/site.ts` need filling in.
