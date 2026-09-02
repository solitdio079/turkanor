# TURKANOR Corporation

Premium, single-page corporate website for TURKANOR Corporation—an operational
bridge for sourcing, trade, business development, travel, education and medical
services between Türkiye, Africa and the rest of the world.

## Experience

- Editorial, responsive visual system built specifically for TURKANOR
- Continuous, reversible scroll journey around a realistic 3D globe, landing on real Türkiye and West Africa locations between chapters
- Full-screen pinned chapters that expand from the globe, then choreograph headings, copy, imagery and service details as separate scroll beats
- Selectable route points that carry visitors directly into their matching chapter
- Catalogue-faithful chapter order and complete source content without a redundant website contents page
- GSAP scroll reveals and Lenis smooth scrolling
- Accessible reduced-motion mode, keyboard focus treatment and mobile navigation
- Server-rendered and prerendered French, English and Turkish content with structured organization data
- Direct WhatsApp, telephone and email conversion paths
- Catalogue-derived WebP imagery, Natural Earth country geometry and responsive performance safeguards

## Stack

- React 19
- React Router 8 with SSR and prerendering
- TypeScript
- GSAP + ScrollTrigger
- Lenis
- Three.js / React Three Fiber / Drei
- world-atlas / TopoJSON country boundaries
- Vite 8

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

The local development URL is printed by React Router after startup.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

## Quality checks

```bash
npm run typecheck
npm run build
```

## Docker deployment

To build and run using Docker:

```bash
docker build -t turkanor-corporation .

# Run the container
docker run -p 3000:3000 turkanor-corporation
```

## Netlify deployment

The project includes Netlify's official React Router runtime adapter and a
checked-in `netlify.toml`. Netlify will use:

- Build command: `npm run build`
- Publish directory: `build/client`
- Runtime: Node.js 24
- Rendering: prerendered `/`, `/en` and `/tr` pages, with SSR available for future routes

Connect the Git repository in Netlify and accept the settings detected from
`netlify.toml`. Do not add an SPA catch-all redirect: the React Router adapter
generates the correct server handler automatically.

The Netlify Vite integration is active during normal local development:

```bash
npm run dev
```

No environment variables are currently required. Run `npm run verify` before
pushing a deployment.

Before the first production deploy, set the final domain in the SEO metadata so
the canonical URL, social preview image URL and sitemap can be absolute.

## Node deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

The project is intentionally structured so the landing page can later grow into
dedicated service pages, multilingual routes, lead forms, a CMS or a client portal.
