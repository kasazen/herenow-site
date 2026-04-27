# herenow-site

Public website for **Here Now Labs, Inc.** at [herenowlabs.xyz](https://herenowlabs.xyz).

Vite + TypeScript single-page site. Hero animation in Canvas, prose-driven story arc, waitlist-only CTA. Hosted on GitHub Pages.

## Local

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
npm run preview  # serves dist/ for sanity check
```

## Configuration (set as GitHub repo Variables for deploy)

- `VITE_CALENDLY_URL` — your Calendly event URL (e.g. `https://calendly.com/joe-herenow/intake`). The intake questionnaire lives on the Calendly side; configure those questions in the event's Booking Page → Invitee Questions. Theming params (dark background, green primary) are appended automatically. Until set, the embed hides itself and a `team@herenowlabs.xyz` fallback line shows instead.
- `VITE_PLAUSIBLE_DOMAIN` — Plausible domain (e.g. `herenowlabs.xyz`). Until set, no analytics are loaded.

In GitHub: **Settings → Secrets and variables → Actions → Variables tab**.

## Deploy

Push to `main`. The workflow in `.github/workflows/deploy.yml` builds and publishes to GitHub Pages via the official Pages action.

One-time setup:

1. **Settings → Pages → Source:** *GitHub Actions* (not "Deploy from branch").
2. Custom domain: `herenowlabs.xyz`. Enforce HTTPS.
3. DNS at GoDaddy (already in place):
   - Apex `A` records → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` `www` → `kasazen.github.io`

`public/CNAME` keeps the custom-domain binding through deploys.

## What's where

- `index.html` — page structure, the seven moments.
- `src/main.ts` — entry; wires animation, form, analytics.
- `src/animations/hero.ts` — Canvas pixel-sort animation.
- `src/calendly.ts` — Calendly inline embed loader + booking event tracking.
- `src/analytics.ts` — Plausible loader + scroll-depth events.
- `src/styles.css` — design tokens and layout.
- `public/` — files served at the site root (CNAME, robots, sitemap).

## Charter

Charter and company-internal docs live in the private `kasazen/herenow` repo, not here.

## Contact

team@herenowlabs.xyz
