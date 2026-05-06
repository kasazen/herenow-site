# Imagery — direction and inventory

The brand visual thesis is **nature-as-network**: leaf veins, cellular structures, branching/radial patterns. The metaphor is *what neural networks already are in nature* — networks in living things that flow growth toward a conclusion. Photographic imagery and a custom branching-SVG animation work together at this register, neither on-the-nose.

The photographic system is **stock from Unsplash, curated tightly to one subject vocabulary** (leaf-vein networks). Treatment is automatic via `<HeroImage>` and `<SectionImage>` components — drop the file in, no preprocessing required.

## Wired slots (live)

### Hero photos — `public/images/hero/`

| Path | Subject | Page |
|---|---|---|
| `hero/home.jpg` | Bright leaf-vein cellular mesh (Ash Edmonds) | `/` |
| `hero/how-we-work.jpg` | Cellular tessellation pattern (David Clode) | `/how-we-work` |
| `hero/working-sessions.jpg` | Bold yellow leaf-vein infrastructure (Noemi Macavei) | `/working-sessions` |
| `hero/ai-action-plan.jpg` | Symmetrical leaf branching network (Maxence Pira) | `/ai-action-plan` |

### Section-break photos — `public/images/sections/`

Used as full-bleed editorial breaks via `<SectionImage>`, with feathered top/bottom edges.

| Path | Subject | Currently placed at |
|---|---|---|
| `sections/radial-hub.jpg` | Radial leaf vein hub (Stefan Steinbauer) | Home, between Method and Deliverable |
| `sections/weathered-network.jpg` | Weathered leaf with golden vein network (Nishaan Ahmed) | How-we-work, before CTA |
| `sections/leaf-droplet.jpg` | Symmetrical leaf with droplet (Clay Banks) | Held for future use |
| `sections/translucent-leaf.jpg` | Translucent leaf (Mulyadi) | Held for future use |
| `sections/grid-energy.jpg` | Dense vein grid energy (Tony Sebastian) | Held for future use |

### Parking lot — `public/images/options/`

Four photos that read more botanical than network. Held for editorial future needs:

- `gildardo-rh-q1-dAZuhs7I-unsplash.jpg` (palm frond linear ridges)
- `pedro-vit-_9c1z0LWzdA-unsplash.jpg` (leaf with droplets)
- `scott-webb-w0-PjhhbdS8-unsplash.jpg` (dark leaf central vein)
- `yoksel-zok-LdDewlTIn34-unsplash.jpg` (scaled frond layered)

## Curation rules — what to look for if adding more

### YES — these subjects work
- **Leaf veins** — high-contrast networks, especially backlit leaves where veins glow.
- **Cellular tessellation** — Voronoi-like patterns in plant cell walls.
- **Branching structures** — bilateral symmetry leaf veins, river dendrites, root systems, lichen networks.
- **Translucent organic mesh** — light passing through thin natural surfaces.

### NO — never these
- Faces, group photography, generic consulting tropes.
- AI-cliché imagery (neural network diagrams, neon gradients, brain icons, robot hands).
- On-the-nose tech metaphors (circuit boards, glowing data lines, server racks).
- Over-saturated lifestyle, primary-color contrast.
- Generated-by-AI imagery (reads ironic and lazy for an AI consultancy).

## Recommended specs

- **Format**: JPG.
- **Aspect ratio**: 3:2 or 16:9 landscape.
- **Width**: 1600px is sufficient (next/image handles responsive variants).
- **File size**: target <600KB before next/image optimization.

## How treatment works

`<HeroImage>` (in `app/_components/HeroImage.tsx`) wraps photos in a paper-rule frame with subtle desaturation, warm cream overlay, and faint green radial wash. Drop a JPG into the right path; it appears with the unified treatment.

`<SectionImage>` (in `app/_components/SectionImage.tsx`) renders full-bleed section breaks at clamp(180px, 22vw, 280px) height, with feathered top/bottom edges fading to the page background. Slight saturation pull-back unifies them.

## Resizing if needed

```bash
# Resize a new candidate to match the existing inventory
sips -Z 1600 -s formatOptions 65 input.jpg --out output.jpg
```

This typically lands files in the 250–700KB range before next/image further optimizes them.
