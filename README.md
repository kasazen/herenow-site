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

## Configuration

- `VITE_PLAUSIBLE_DOMAIN` *(client-side build var)* — Plausible domain (e.g. `herenowlabs.xyz`). Until set, no analytics are loaded.
- `MEETING_HREF` *(server-side, optional)* — meeting URL injected into outgoing First Read emails. Defaults to `https://cal.com/herenowlabs/intro`. Override only if you want emails to point at a different link than the public site.

The public meeting link on the site itself is hard-coded in `index.html` — it's the canonical URL, not a per-environment secret. Set Vercel project env vars in **Project → Settings → Environment Variables**.

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
- `src/analytics.ts` — Plausible loader + scroll-depth events.
- `src/styles.css` — design tokens and layout.
- `public/` — files served at the site root (CNAME, robots, sitemap).

## Charter

Charter and company-internal docs live in the private `kasazen/herenow` repo, not here.

## Contact

team@herenowlabs.xyz
