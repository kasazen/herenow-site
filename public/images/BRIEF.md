# Imagery — how to add an image

The site renders cleanly with no images. When you drop a file at one of the named paths below, the matching slot on the matching page lights up. The slot stays collapsed (no broken-image, no layout shift) until the file lands.

## Workflow

1. Pick the image. Save it as the exact filename below.
2. Drop it in the right folder under `public/images/`.
3. Commit and push. Vercel deploys; the image appears on production.

```bash
# example
cp ~/Downloads/contract-pages.jpg public/images/hero/home.jpg
git add public/images/hero/home.jpg
git commit -m "Home hero image"
git push
```

That's it.

## Slots wired up today

| Page | File path | Notes |
|---|---|---|
| `/` (home) | `hero/home.jpg` | Largest slot — the editorial anchor |
| `/how-we-work` | `hero/how-we-work.jpg` | Below the title block |
| `/working-sessions` | `hero/working-sessions.jpg` | Below the title block |
| `/ai-action-plan` | `hero/ai-action-plan.jpg` | Below the dek; subtle, the document still leads |

All four are rendered by `<HeroImage>` (`app/_components/HeroImage.tsx`), which checks if the file exists on the server before rendering. Missing → nothing rendered.

## Recommended specs

- **Format**: JPG or WebP. PNG is fine but heavier.
- **Aspect ratio**: 16:9 or 3:2 (landscape).
- **Width**: ≥1600px.
- **File size**: aim for under 400KB. Run through TinyPNG or `sips -Z 1600` on macOS if needed.

## Brand-aligned imagery, in priority order

1. **Documents and texture** — pages of a contract with passages highlighted, a fountain pen on paper, a balance sheet with handwritten margin notes, a desk with a printed memo and a coffee. Reinforces *we work the operation*.
2. **Architectural light** — morning light through a window, the corner of a wood desk, an empty boardroom at end-of-day, brass details. Editorial mood; doesn't specify industry.
3. **Restrained nature** — a single tree silhouette, a horizon line, water at dusk. Use sparingly as breathing room between text-heavy sections, never as the dominant motif.

## Treatment

- Warm, slightly desaturated. Closer to *Kinfolk* or *Bloomberg Businessweek* than to typical consulting-firm stock.
- Faces avoided in v1 (we are anonymous). Hands and over-the-shoulder crops are fine.
- No: glass-and-steel skyscrapers, group-of-professionals-laughing, gear-and-handshake icons, AI-brain graphics, server rooms, neon, gradients.

## Sourcing on Unsplash

Search terms that tend to land:

- *"contract pages"*, *"highlighted text"*, *"reading documents"*
- *"morning light desk"*, *"fountain pen paper"*, *"empty boardroom"*
- *"north shore mountain"*, *"single tree horizon"* (for nature breaks)

Avoid: anything titled *"team meeting,"* *"diverse business,"* *"office handshake,"* or *"data analytics."*

## Subfolders

`hero/` — page-top images (the four slots above).

`sections/` — for future use as editorial breaks between text sections (not wired up yet; tell me when you have files and I'll wire them in).

`texture/` — subtle textural overlays for background washes (paper grain, ink wash). Optional. PNGs with transparency work best.

## To wire a new slot

Tell me the page and the visual, I'll add a `<HeroImage>` component at the right spot and update this brief.
