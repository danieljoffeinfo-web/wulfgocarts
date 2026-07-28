# Wulf Go Carts

Landing page for Wulf Go Carts — a scroll-scrubbed hero film that flies through
the cart's windscreen into open sky, handing off into a showroom-first site.

Built on the stack and design language of [chom.biz](https://chom.biz).

## Stack

- **Next.js 15** (App Router) + **React 19**
- **Tailwind CSS v4** — CSS-first config via `@theme` in `app/globals.css`
- **Framer Motion 12** — scroll-reveal primitives
- **TypeScript**, npm workspaces monorepo

## Getting started

```bash
npm install
npm run dev
```

Runs at http://localhost:3000.

## The scroll-scrub hero

`components/scroll-scrub.tsx` pins the film in a sticky stage and maps scroll
position through the section onto the video's `currentTime`.

Two things make it feel smooth:

1. **Eased playhead.** Scroll sets a *target*; a `requestAnimationFrame` loop
   eases the actual playhead toward it. Writing `currentTime` straight from the
   scroll handler stutters badly on fast trackpad input.
2. **Every frame a keyframe.** Generated MP4s ship with sparse keyframes, so
   seeking snaps to the nearest one and the scrub judders. `scripts/encode-scrub.sh`
   re-encodes with `-g 1` to fix this. **Do not skip this step** — it is the
   single biggest factor in how the effect feels.

`components/hero.tsx` times three copy beats to the camera move, clearing the
frame before the camera reaches sky. `.sky-handoff` in `globals.css` opens the
next section in that same sky and resolves to white, so the film reads as
continuous with the page rather than as a cut.

Under `prefers-reduced-motion` the stage unpins and falls back to a static
poster frame.

## Getting the film in

The render lives on the Higgsfield CDN. For production, self-host it:

```bash
# 1. Download the render from Higgsfield
# 2. Re-encode for scrubbing (requires ffmpeg)
./scripts/encode-scrub.sh ~/Downloads/render.mp4 apps/web/public/hero/scrub.mp4

# 3. Point the app at it
echo 'NEXT_PUBLIC_HERO_FILM=/hero/scrub.mp4' >> apps/web/.env.local
echo 'NEXT_PUBLIC_HERO_POSTER=/hero/scrub-poster.jpg' >> apps/web/.env.local
```

Without those env vars the app falls back to the CDN URL baked into
`app/page.tsx` — fine for a preview, not for production.

## Deploying to Vercel

The repo is a monorepo; `vercel.json` at the root handles the workspace build.

**Via the dashboard (recommended)** — New Project → import this repo → deploy.
`vercel.json` is picked up automatically and every push auto-deploys.

**Via CLI:**

```bash
npx vercel deploy --prod --token=$VERCEL_TOKEN
```

Set `NEXT_PUBLIC_HERO_FILM` / `NEXT_PUBLIC_HERO_POSTER` in the project's
environment variables once the film is self-hosted.

## Where things live

| Path | What it holds |
| --- | --- |
| `apps/web/app/globals.css` | Brand tokens. Change the hex values and the whole site follows. |
| `apps/web/content/site.ts` | Showroom address, hours, phone, nav. |
| `apps/web/content/carts.ts` | The range, capability strip, why-Wulf reasons. |
| `apps/web/components/scroll-scrub.tsx` | The scrub engine. |
| `apps/web/components/asset-slot.tsx` | Images that degrade to labelled placeholder frames. |
| `scripts/encode-scrub.sh` | Re-encodes a render for smooth seeking. |

## Design system

- **Colours** — amber `#f0a02a` (accent, from the badge chevrons), amber-deep `#d8871a`, ink `#0e0f11` (bumper black), steel `#c9cdd2` (cart body), mist `#f4f5f7`, sky `#a8c8e4`
- **Type** — Manrope; `font-extrabold` headings, tight tracking; eyebrows are `text-xs uppercase tracking-[0.2em]`
- **Layout** — `max-w-6xl px-5 sm:px-8`, sections `py-24 sm:py-28`
- **Motion** — ease-out-expo `cubic-bezier(0.16, 1, 0.3, 1)`

## Status

Structure and motion are done. Still `PLACEHOLDER` in `content/site.ts` and
`content/carts.ts`: showroom address, opening hours, phone, email, and the real
model names, specs and photos. Cart photos go in `public/carts/`.
