# herenow-site

Public website for **Here Now Labs, Inc.** at [herenowlabs.xyz](https://herenowlabs.xyz).

Single-page corporate landing for the holding entity, plus Privacy and Terms. Next.js 16 (App Router) + React 19 + plain CSS. Deployed to Vercel via push-to-main.

## Local

```sh
npm install
npm run dev      # http://localhost:3000
npm run build
npm run start
```

## Routes

- `/` — landing (entity, contact, address, links to legal)
- `/privacy` — corporate Privacy Policy
- `/terms` — corporate Terms of Service

## Deploy

Push to `main`. Vercel rebuilds and promotes to production. Custom domain `herenowlabs.xyz` is bound at the Vercel project level.

## Charter

Charter and company-internal docs live in the private `kasazen/herenow` repo, not here.

## Contact

team@herenowlabs.xyz
