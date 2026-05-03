# Basma Tech Solutions — Web

Two production sites for Basma Tech, a Saudi interactive experience studio. Liquid Pastel design system, bilingual AR/EN, scroll-driven cinema.

## Apps

- **`apps/main`** — Company website (this app). Eight-chapter cinematic homepage, services, process, about, contact. Deploys to `nordbuild.sa` or `basmatech.nordbuild.sa`.
- **`apps/portfolio`** — Portfolio walk-through site (next phase). Placeholder folder.

## Packages

- **`packages/design-system`** — Tokens, components, primitives, motion. Single source of truth.
- **`packages/content`** — Bilingual MDX content. Voice guide + banned phrases live here.
- **`packages/assets`** — Frame sequences, photos, fonts.

## Stack

Next.js 15 App Router · React 19 · GSAP (free) · Framer Motion · Lenis · Tailwind 4 · TypeScript 5 strict · Turborepo 2 · pnpm 10.

No Club GreenSock license. Custom Arabic-aware text splitter via `Intl.Segmenter`.

## Local dev

```bash
# from basmatech-web/
pnpm install                # ~3 minutes first time
pnpm dev                    # both apps in parallel via turbo
pnpm dev:main               # main only at localhost:3000
pnpm dev:portfolio          # portfolio only at localhost:3001
```

## Deploy

Each app deploys as a separate Vercel project.

```bash
git remote add origin git@github.com:USERNAME/basmatech-web.git
git push -u origin main

# from apps/main
vercel link
vercel --prod
```

## Brand truth

- `BRAND-STRATEGY.md`, `DESIGN.md`, `MASTER-PROMPT.md` in repo root
- `brand-assets/tokens.css` — synced into `packages/design-system/src/tokens.css`
- `packages/content/src/voice/` — banned phrases + voice guide

## Rules

1. Arabic-first. AR is the default, EN is the toggle.
2. Use tokens. Never hardcode hex except inside `tokens.css`.
3. Bricolage + Manrope + Cairo + Fraunces + JetBrains Mono only.
4. No em-dashes anywhere in copy.
5. Magenta band exactly once per page (Saudi cultural marker).
6. Liquid stacked-layer mark is the signature visual — reuse via `LiquidMark` component.

## Status

Phase A (monorepo scaffold) and Phase B (Site 1 chapters 01–04) complete. Chapters 05–08 stubbed for next phase.
