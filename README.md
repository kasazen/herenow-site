# herenow-site

Public website for **Here Now Labs, Inc.** at [herenowlabs.xyz](https://herenowlabs.xyz).

Next.js 16 (App Router, Turbopack) + React 19 + plain CSS modules. Deployed to Vercel via push-to-main.

## Local

```sh
npm install
npm run dev      # http://localhost:3000
npm run build
npm run start    # serves the production build
```

## Pages

- `/` — home
- `/how-we-work` — how the two-week sprint runs
- `/contact` — book the intro or write first

## Deploy

Push to `main`. Vercel rebuilds and promotes to production. Custom domain `herenowlabs.xyz` is bound at the Vercel project level. There is no GitHub Pages workflow.

## Charter

Charter and company-internal docs live in the private `kasazen/herenow` repo, not here.

## Contact

team@herenowlabs.xyz
