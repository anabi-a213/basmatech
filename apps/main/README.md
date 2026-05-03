# apps/main — Basma Tech company website

Next.js 15 App Router. Bilingual (`/ar`, `/en`). Cinematic 8-chapter homepage. Phase B (chapters 01–04) is fully working; chapters 05–08 are stubbed for next phase.

## Local dev

```bash
# from basmatech-web/ root
pnpm install
pnpm --filter main dev
# open http://localhost:3000  →  redirects to /ar
```

The `predev` hook copies frame sequences and showcase photos from `../../website-next/frames/` and `../../website-next/showcase/` into `public/`. Run `node scripts/copy-assets.mjs` manually if you ever need to refresh.

## Routes

| Route | Status |
|-------|--------|
| `/` | Redirects to `/ar` (or `/en` if Accept-Language explicit) |
| `/ar`, `/en` | Full cinematic homepage — chapters 01–08 |
| `/[lang]/services` | Services index — six cards, full detail pages next phase |
| `/[lang]/work` | Work index — three case cards, full walk-through on Site 2 |
| `/[lang]/process` | Loop deep dive |
| `/[lang]/about` | About — placeholder |
| `/[lang]/contact` | Contact — placeholder with email |
| `/[lang]/legal/{privacy,terms,cookies}` | Legal — placeholders |

## Deploy to Vercel

```bash
vercel link
vercel --prod
```

Or push to GitHub and import the repo in the Vercel dashboard. Both apps live in the same monorepo so set the project root to `apps/main`.
