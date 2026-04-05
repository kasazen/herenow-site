# herenow-site

Public website for **Here Now Labs, Inc.** (Delaware corporation) at [herenowlabs.xyz](https://herenowlabs.xyz).

Single static `index.html` — no build step, no dependencies. Hosted on GitHub Pages.

## Deploy

1. Push to `main`.
2. In repo settings → Pages, set source to `main` / root.
3. Set custom domain to `herenowlabs.xyz` and enable "Enforce HTTPS".
4. DNS at GoDaddy:
   - Apex `A` records → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` `www` → `kasazen.github.io`

## Contact

team@askcorro.com
