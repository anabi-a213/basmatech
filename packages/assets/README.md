# @basmatech/assets

Hosts the canonical paths to frame sequences, photos, fonts, and logos. The actual binary assets live in the repo root (already-generated):

- Frames: `../../website-next/frames/seq{1..5}/` (605 frames total, 121 each + manifest)
- Showcase photos: `../../website-next/showcase/`
- Logos: `../../brand-assets/`

For each app, the public folder either symlinks or copies the relevant subset. See `apps/main/scripts/copy-assets.mjs` for the copy step.
