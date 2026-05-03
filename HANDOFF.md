# Handoff — Phase A + Phase B

**Status:** scaffold complete, code-reviewed, NOT yet installed/booted (sandbox blocks `pnpm install`).

The agent that built this could not execute `pnpm install` in its sandbox, so the verification step (run dev server, take Playwright screenshots) must be done locally by you.

## What was built

### Phase A — Monorepo scaffold

```
basmatech-web/
├── apps/
│   ├── main/                 # Next.js 15 site — fully wired
│   └── portfolio/            # Placeholder for phase E
├── packages/
│   ├── design-system/        # Tokens, components, primitives, motion, hooks
│   ├── content/              # Bilingual TS copy + voice guide + banned phrases
│   └── assets/               # Documentation only — actual assets stay in repo root
├── pnpm-workspace.yaml
├── package.json              # pnpm 10 + Turborepo 2
├── turbo.json
├── README.md
├── .gitignore
├── .npmrc
└── .github/workflows/ci.yml
```

### Phase B — Site 1 chapters 01–04 fully working

- **Chapter 01 — Threshold:** pastel field hero with pulsing point of light, animated headline reveal, CTA. Bilingual.
- **Chapter 02 — Fingerprint:** `seq1` 121-frame sequence, 500vh pinned scroll, text overlay.
- **Chapter 03 — Loop:** `seq3` frames, 500vh pinned scroll.
- **Chapter 04 — Motion:** `seq4` frames, 600vh pinned scroll, `cursorReactive` so mouse X tilts the wave epicenter.

Chapters 05–08 are stubbed (functional but not at the same depth — placeholder visuals, real content):

- **Chapter 05 — Kingdom:** `seq5` holding visual (Saudi-map-with-magenta-lines treatment lands phase C).
- **Chapter 06 — Capabilities:** six-card grid (proper hex-rotate version lands phase C).
- **Chapter 07 — Proof:** three case-study cards (real venue copy already drafted).
- **Chapter 08 — Invitation:** pastel field, logo, bilingual CTA. **MagentaBand sits here — the once-per-page Saudi marker.**

Plus stub pages for `/services`, `/work`, `/process`, `/about`, `/contact`, `/legal/{privacy,terms,cookies}` so the Header nav links don't 404.

## To verify locally

```bash
cd basmatech-web

# 1. Install (Phase A doesn't have a lockfile yet — first install creates one)
pnpm install                 # ~3 minutes first time

# 2. The predev hook copies frame sequences + showcase + logos into apps/main/public
# (it runs automatically before dev/build, but you can also run manually:)
node apps/main/scripts/copy-assets.mjs

# 3. Dev server
pnpm --filter main dev
# open http://localhost:3000  →  redirects to /ar (or /en if Accept-Language: en)

# 4. Type-check
pnpm --filter main type-check

# 5. Production build
pnpm --filter main build
```

### What you should see

- `/` → redirects to `/ar` (or `/en` if browser explicitly asks for English)
- Hero (chapter 01): pastel field, magenta cursor ribbon, pulsing point of light, "نهندس الدهشة" headline, CTA
- Scrolling: chapter 02 pins, frames scrub through (seq1 120 frames over 500vh)
- Chapter 03 pins, seq3 frames scrub
- Chapter 04 pins, seq4 frames scrub AND mouse X tilts the wave (move cursor left/right)
- Chapters 05–07 render in the pastel system with real bilingual copy
- Chapter 08 has the Magenta band, then footer
- AR/EN toggle in header swaps the language; URL changes from `/ar` ↔ `/en`

### What you should NOT see (post-verify)

- Any console errors
- LTR flash before Arabic loads (we set `lang`/`dir` via inline script in `[lang]/layout.tsx`)
- 404s on header nav
- Frame canvas going black mid-scroll (the FrameSequenceCanvas falls back to highest-loaded frame)

## Known follow-ups (not blockers, just on the radar)

1. **Lockfile.** First `pnpm install` will create `pnpm-lock.yaml`. Commit it.
2. **Asset copy.** The `predev` script copies ~80MB of frames into `apps/main/public/`. If you'd rather symlink (saves disk), Windows needs admin or developer mode for `mklink /J`. The copy approach is portable across all platforms and `Cache-Control: immutable` is set in `vercel.json`/`next.config.mjs` so the copies don't slow anything down.
3. **Tailwind 4.** Using v4 with `@tailwindcss/postcss` and `@import "tailwindcss"`. If you hit any v4 quirks during install, a v3 downgrade is one `pnpm add -D tailwindcss@^3 autoprefixer postcss` away.
4. **Lenis import.** v1.2 default-exports `Lenis`. If install resolves a different sub-version with named exports, change `import Lenis from 'lenis'` to `import { Lenis } from 'lenis'` in `useLenis.ts`.
5. **Chapter 02–04 frame paths.** Hard-coded to `/frames/seq1/frame-`, `/frames/seq3/frame-`, `/frames/seq4/frame-`. If you ever rename folders, update those constants in the chapter files.
6. **GSAP free.** No SplitText. The text reveal in `BilingualText` and chapter overlays uses `Intl.Segmenter` + Framer Motion — no Club license needed.

## Voice + content audit pass

The home content in `packages/content/src/home.ts` was authored against the master prompt in `TWO-SITES-PLAN.md` section 7. A 2026-05-02 audit confirms:

- Banned phrases: clean (no synergy/leverage/cutting-edge etc., no ابتكار/رؤية مستقبلية etc.)
- Em-dashes: zero in both languages
- AR ↔ EN paired meanings (not literal translations) — same impact, different construction
- Headlines max 6 words, subheads max 12, body max 3 sentences/paragraph
- Section last sentences bridge to next section first ideas

If you spot a phrase that should change, edit `packages/content/src/home.ts` — that's the canonical source. The `.mdx` files in `packages/content/src/{ar,en}/` are placeholder-shaped for next phase when copywriters take over.
