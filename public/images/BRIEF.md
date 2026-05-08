# Imagery — direction and inventory

The brand visual thesis is **nature-as-network**: leaf veins, cellular structures, branching/radial patterns. The metaphor is *what neural networks already are in nature* — networks in living things that flow growth toward a conclusion. Photographic imagery and animated leaf-vein SVGs work together at this register, neither on-the-nose.

The photographic system is **stock from Unsplash, curated tightly to one subject vocabulary** (leaf-vein networks). Treatment is automatic via `<HeroImage>` and `<SectionImage>` components — drop the file in, no preprocessing required.

After the May 2026 rebuild, the live pages lead with animated SVG diagrams (`HomeInsight`, `HowWeWorkDiagram`, `BranchingMark`) rather than photography. The leaf-vein photographic inventory below is on hand for future editorial slots — section breaks, longer-form pages, future case studies.

## On-hand inventory

### Hero-grade photos — `public/images/hero/`

| Path | Subject |
|---|---|
| `hero/home.jpg` | Bright leaf-vein cellular mesh (Ash Edmonds) |
| `hero/how-we-work.jpg` | Cellular tessellation pattern (David Clode) |
| `hero/working-sessions.jpg` | Bold yellow leaf-vein infrastructure (Noemi Macavei) |
| `hero/ai-action-plan.jpg` | Symmetrical leaf branching network (Maxence Pira) |

### Section-break photos — `public/images/sections/`

Used as full-bleed editorial breaks via `<SectionImage>`, with feathered top/bottom edges.

| Path | Subject |
|---|---|
| `sections/radial-hub.jpg` | Radial leaf vein hub (Stefan Steinbauer) |
| `sections/weathered-network.jpg` | Weathered leaf with golden vein network (Nishaan Ahmed) |
| `sections/leaf-droplet.jpg` | Symmetrical leaf with droplet (Clay Banks) |
| `sections/translucent-leaf.jpg` | Translucent leaf (Mulyadi) |
| `sections/grid-energy.jpg` | Dense vein grid energy (Tony Sebastian) |

### Parking lot — `public/images/options/`

Four photos that read more botanical than network. Held for editorial future needs:

- `gildardo-rh-q1-dAZuhs7I-unsplash.jpg` (palm frond linear ridges)
- `pedro-vit-_9c1z0LWzdA-unsplash.jpg` (leaf with droplets)
- `scott-webb-w0-PjhhbdS8-unsplash.jpg` (dark leaf central vein)
- `yoksel-zok-LdDewlTIn34-unsplash.jpg` (scaled frond layered)

## Animated SVG components

Built into the rebuild and carry the leaf-vein grammar in motion:

- `app/_components/HomeInsight.tsx` — Home signature. Trunk + 3 prominent branches with glowing terminal nodes, denser secondary network, SMIL `<animateMotion>` flowing dots along the primary veins. Visualizes "the obvious AI plays vs. the structural network behind them."
- `app/_components/HowWeWorkDiagram.tsx` — How We Work signature. 8 inflowing veins from the canvas edges converge at a central glowing nexus (= The Analysis), with flowing dots traveling inward. Visualizes "many inputs funneling into one decision document."
- `app/_components/BranchingMark.tsx` — Quieter accent used at the foot of the Contact page. Single self-drawing branching SVG; gentler register than the page-signature pieces.

All three respect `prefers-reduced-motion` (skip the timeline, render in completed end-state, suppress flowing dots).

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

`<HeroImage>` (in `app/_components/HeroImage.tsx`) wraps photos in a paper-rule frame with subtle desaturation, warm cream overlay, and faint green radial wash. The frame is locked to a 3:2 aspect ratio with `object-fit: cover`, so portrait sources crop to landscape and never dominate the mobile viewport.

`<SectionImage>` (in `app/_components/SectionImage.tsx`) renders full-bleed section breaks at clamp(180px, 22vw, 280px) height, with feathered top/bottom edges fading to the page background. Slight saturation pull-back unifies them.

## Resizing if needed

```bash
# Resize a new candidate to match the existing inventory
sips -Z 1600 -s formatOptions 65 input.jpg --out output.jpg
```

This typically lands files in the 250–700KB range before next/image further optimizes them.
