# Imagery — how to add an image

The site renders cleanly with no images. The visual system is built around the **Operations-as-systems diagram** (code-built, on the home page) — photography is a *supporting* atmospheric layer, not the lead. When you drop a file at one of the named paths below, the matching slot lights up. The slot stays collapsed (no broken-image, no layout shift) until the file lands.

## Workflow

1. Pick the image. Save it as the exact filename below.
2. Drop it in the right folder under `public/images/`.
3. Commit and push. Vercel deploys; the image appears on production.

```bash
# example
cp ~/Downloads/dawn-light.jpg public/images/hero/home.jpg
git add public/images/hero/home.jpg
git commit -m "Home hero image"
git push
```

## Slots wired up today

| Page | File path | Notes |
|---|---|---|
| `/` (home) | `hero/home.jpg` | Optional. The Operations diagram is the primary visual. Photo plays atmospheric role. |
| `/how-we-work` | `hero/how-we-work.jpg` | Below the title block |
| `/working-sessions` | `hero/working-sessions.jpg` | Below the title block |
| `/ai-action-plan` | `hero/ai-action-plan.jpg` | Below the dek; subtle, the document still leads |

All four are rendered by `<HeroImage>` (`app/_components/HeroImage.tsx`), which checks if the file exists on the server before rendering. Missing → nothing rendered.

The `<HeroImage>` component automatically applies a unified treatment (subtle desaturation, warm overlay, rounded paper-bordered frame) so any stock image drops into the brand without breaking it.

## Curation rules — what to look for

The brand register is **hybrid editorial + tech-modernist**. Photography supports the Operations diagram; it doesn't compete with it. Search Unsplash with these constraints:

### YES — these subjects work
- **First light, dawn, golden hour** — morning light through a window, low sun across a horizon, soft early light on a desk corner
- **Architectural restraint** — empty boardroom at end-of-day, brass details, wood grain, the corner of a window
- **Quiet horizons** — a road curving up over a hill, a waterline at dawn, farmland at first light, a coastline (eastern seaboard mood)
- **Texture and surface** — paper grain, ledger paper, a single sheet on a wood desk, brass and leather
- **Hands at rest, not action** — hands holding coffee, hands on a desk, never hands striking/signing/working

### NO — never these
- **Faces** (we are anonymous in v1)
- **Group photography** ("team meeting", "diverse business", "office handshake")
- **Generic consulting tropes** — laptops on glass tables, sticky notes on whiteboards, brainstorm sessions
- **AI-cliché imagery** — neural networks, neon gradients, brain icons, robot hands, holograms, "data" abstractions
- **Trade-tool action** — wrench biting bolt, sparks flying, sawdust mid-air (loss-coded action register, wrong for opportunity frame)
- **Glass-and-steel skyscrapers, finance-bro stock**
- **Over-saturated lifestyle** — bright primary colors, contrasty Instagram filters
- **Generated-by-AI imagery** — reads ironic and lazy for an AI consultancy

### Treatment is automatic
The `<HeroImage>` component applies:
- `saturate(0.78)` — knocks back saturation toward the cream palette
- `contrast(0.96)` — softens contrast slightly
- A warm cream overlay + faint green radial wash
- A 1px paper-rule border + 6px rounded corners

You don't need to pre-process. Pick raw images that follow the curation rules; the CSS treatment unifies them.

## Recommended specs

- **Format**: JPG or WebP. PNG is fine but heavier.
- **Aspect ratio**: 16:9 or 3:2 (landscape).
- **Width**: ≥1600px.
- **File size**: aim for under 400KB. Run through TinyPNG or `sips -Z 1600` on macOS if needed.

## Sourcing on Unsplash — search terms that tend to land

- *"morning light desk"*, *"first light window"*, *"dawn horizon"*
- *"empty boardroom"*, *"corner office wood"*, *"brass detail"*
- *"north shore mountain"*, *"single tree horizon"*, *"coastline dawn"*
- *"contract pages"*, *"ledger paper"*, *"fountain pen paper"* (for Action Plan slot specifically — document register)

Avoid anything titled *"team meeting,"* *"diverse business,"* *"office handshake,"* *"brainstorm,"* *"data analytics,"* *"AI,"* *"technology,"* *"future."*

## Subfolders

`hero/` — page-top images (the four slots above).

`sections/` — for future use as editorial breaks between text sections (not wired up yet; tell me when you have files and I'll wire them in).

`texture/` — subtle textural overlays for background washes (paper grain is now built-in CSS; this folder is a parking lot for any future texture overlays).

## Commission later, curate now

The current direction (stock photography + code-built diagram) is the *get-to-good-fast* path. If the site warrants it later, commission a single photographer for a consistent set or a single illustrator for spot illustrations — those are the *get-to-defensible* paths. For now, careful Unsplash curation through the unified CSS treatment gets us 80% there at zero cost.
