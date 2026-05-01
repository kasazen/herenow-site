# OG image & icon sources

These are the source files for the social-share image and favicons rendered into `/public/`.

- `og-image.html` — typographic 1200×630 OG image. Loads Google Fonts (Fraunces italic, Geist Mono) so the rendered PNG matches the site's typography.
- `apple-touch-icon.svg` — 180×180 brand glyph (cream + six green squares).
- `favicon-32.svg` / `favicon-16.svg` — small-size brand glyphs.

## Regenerate the PNGs

The PNGs in `/public/` are produced by headless Chrome. Re-run with:

```sh
npm run build:og-assets
```

(Defined in `package.json` → invokes `scripts/og-assets/render.mjs`.)

The render script uses `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome --headless --screenshot=...` to capture each source at exact pixel dimensions. No build-time tooling is added to the site bundle.

If Chrome isn't installed, regenerate manually in Figma/Sketch: 1200×630 PNG, cream background `#faf9f5`, accent `#15803d`, Fraunces italic + Geist Mono — match the structure shown in `og-image.html`.
