# Imagery brief — Here Now Labs

This folder is where you drop representative imagery from Unsplash (or commissioned shoots later). The site renders gracefully empty until files land here. When a file is dropped at one of the expected paths below, the site picks it up automatically.

## Brand-aligned imagery, in priority order

1. **Documents and texture** — pages of a contract with passages highlighted, a fountain pen on paper, a balance sheet with handwritten margin notes, a desk with a printed memo and a coffee. Reinforces "we read carefully," which is the brand promise.
2. **Architectural light** — morning light through a window, the corner of a wood desk, an empty boardroom at end-of-day, brass details. Editorial mood; doesn't specify industry.
3. **Restrained nature** — a single tree silhouette, a horizon line, water at dusk. Use sparingly as breathing room between text-heavy sections, never as the dominant motif.

## Treatment

- Warm, slightly desaturated. Closer to *Kinfolk* or *Bloomberg Businessweek* than to typical consulting-firm stock.
- Faces avoided in v1 (we are anonymous). Hands and over-the-shoulder crops are fine.
- No: glass-and-steel skyscrapers, group-of-professionals-laughing, gear-and-handshake icons, AI-brain graphics, server rooms, neon, gradients.

## Folders

### `hero/`
Used at the top of pages where a hero image makes sense. Filenames the site looks for:

- `hero/home.jpg` — home page hero (under or beside the headline)
- `hero/how-we-work.jpg` — top of /how-we-work
- `hero/ai-action-plan.jpg` — top of /ai-action-plan (subtle, not dominant)
- `hero/working-sessions.jpg` — top of /working-sessions

Recommend 16:9, ≥1600px wide. JPG or WebP. Keep file size under 400KB.

### `sections/`
Editorial breaks between text sections. Smaller and more decorative.

- `sections/contract-pages.jpg` — close-up of contract pages with highlighted text
- `sections/desk-corner.jpg` — desk corner with notebook, pen, coffee
- `sections/window-light.jpg` — light through a window onto a desk or boardroom
- `sections/horizon.jpg` — a single horizon line, restrained nature

Recommend 4:3 or 3:2, ≥1200px wide.

### `texture/`
Subtle textural overlays for use as background washes — torn paper edge, paper grain, ink wash. Optional. PNGs with transparency work best.

## Sourcing on Unsplash

Search terms that tend to land:

- *"contract pages"*, *"highlighted text"*, *"reading documents"*
- *"morning light desk"*, *"fountain pen paper"*, *"empty boardroom"*
- *"north shore mountain"*, *"single tree horizon"* (for nature breaks)

Avoid: anything titled "team meeting," "diverse business," "office handshake," or "data analytics."

## Naming

Use the exact filenames above. The site uses these paths in CSS background-image rules and `<Image>` src props. Renaming requires a code edit.
