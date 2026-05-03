# CHANGES — divergences from the Phase 1 prompt

Every decision that diverges from the planning Claude's prompt is logged
here with rationale and date.

## 2026-05-03 (Phase 1 commit)

### Brand-identity reconciliation (BRIEF.md wins, per the prompt's own rule)

**Divergence:** Planning prompt called Basma Tech "a luxury bespoke
interior design and craftsmanship studio" with a house style banning
"chrome, neon, gloss plastic, LED strips visible" and naming "Calacatta
marble, smoked walnut, hand-rubbed brass, unbleached linen, lime
plaster" as the materials palette.

**Reconciliation:** BRIEF.md describes Basma Tech accurately as a Saudi
**interactive experiences** studio whose product categories are
kinetic walls, interactive games, kinetic installations, screens with
AI mapping, immersive rooms, and 24/7 operations. LED edge lighting and
luminous magenta light columns are CORE to the brand's visual signature
on multiple categories (Walls, Games, Screens, Immersive, Operations).
The interior-design framing would have produced the wrong product.

**Action:** Kept BRIEF.md's category list and brand identity. Adapted the
house-style block in `pipeline/prompts/houseStyle.txt` to reflect the
actual product: editorial Hasselblad photography retains the Iwan Baan
calmness and the warm-neutral grade, BUT explicitly allows champagne-bronze
metal, brushed steel, magenta light columns, and pastel haze (mint, sky,
lavender, pink, cream — the corridorTint palette). It bans neon tube
shapes and visible cable runs but permits LED edge-lighting and the
single-line magenta beacon glow.

### File path adaptation: `apps/main/src/app/` not `apps/main/app/`

**Divergence:** Planning prompt referenced `apps/main/app/[lang]/page.tsx`.

**Reconciliation:** Existing project uses `apps/main/src/app/` and
`apps/portfolio/src/app/`. Stayed consistent with existing structure to
avoid a Next.js routing surprise.

### Package name: keeping `@basmatech/design-system` alongside `@basmatech/ui`

**Divergence:** Planning prompt assumed package was `@basmatech/ui` and
called for deleting `FrameSequenceCanvas.tsx` from `packages/ui/src/`.

**Reconciliation:** Existing package is `@basmatech/design-system`. Phase 1
adds NEW `packages/ui/` for the new TourCanvas architecture without
deleting the existing design-system (which still hosts Header, Footer,
LiquidMark, MagentaBand, IgniteOverlay, Cursor, used by other routes).
The legacy `FrameSequenceCanvas` will be removed in Phase 3 once the
TourCanvas migration is verified end-to-end. Until then, the legacy
component stays so the deployed canonical URLs do not break.

### Existing assets retained until Phase 2c

**Divergence:** Planning prompt said "Delete every existing
assets/projects/*/walk/*.webp before Phase 2."

**Reconciliation:** Phase 1 does NOT delete any frames. Asset deletion
happens at the start of Phase 2c (runKling), AFTER human approves the
new keyframes at GATE 2b. Reason: deleting before approved replacements
exist would 404 the live production sites for the duration of Phase 2.

### Categories covered (verbatim from BRIEF.md)

> The 9 projects:
> 01 Hotel Lobby Jeddah   — kinetic mirror wall (Walls)
> 02 Retail Flagship Riyadh — 256 motorized mirrors (Walls)
> 03 Mall Arcade Dammam   — 540 pressure-sensing tile arena (Games)
> 04 Sports Activation Riyadh — louvered pavilion + magenta column (Games)
> 05 Energy Atrium Riyadh  — 220-tile kinetic ceiling wave (Kinetic)
> 06 Cultural Hall AlUla   — 96 ceiling segments wave with music (Kinetic)
> 07 Restaurant Row Riyadh — 5 curved interactive LED screens, plaza (Screens)
> 08 Immersive Launch Riyadh — 360 projection room (Immersive)
> 09 Operations Portfolio   — 9 magenta beacons across Riyadh skyline

The Phase 1 portfolio TourSpec covers all six BRIEF.md categories:
- Walls (2): tour-01, tour-02
- Games (2): tour-03, tour-04
- Kinetic (2): tour-05, tour-06
- Screens (1): tour-07
- Immersive (1): tour-08
- Operations (1): tour-09

This matches BRIEF.md verbatim.
