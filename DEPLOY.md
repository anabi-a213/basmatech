# Deploy basmatech-web to Vercel

The cleanest path is **two Vercel projects** importing the same GitHub repo, each with a different `Root Directory`. Vercel auto-detects the pnpm workspace and runs `pnpm install` at the repo root, then `next build` in the per-app subdir.

## Step 1: Push to GitHub

```bash
cd basmatech-web

# Auth GitHub CLI (one-time)
gh auth login

# Initialise repo + push
git init
git add .
git commit -m "feat: cinematic two-site monorepo for Basma Tech"
gh repo create basmatech-web --public --source=. --remote=origin --push
```

## Step 2: Import → Vercel (Site 1 — main marketing site)

1. https://vercel.com/new → Import Git Repository → pick `basmatech-web`
2. **Project Name**: `basmatech-main`
3. **Framework Preset**: Next.js
4. **Root Directory**: `apps/main`  ← important
5. Build settings (auto-detected by Vercel from pnpm-lock.yaml at repo root):
   - Install Command: `pnpm install --frozen-lockfile=false` (auto)
   - Build Command: `pnpm run build` (auto, runs in `apps/main`)
   - Output Directory: `.next` (auto)
6. Click **Deploy**. ~2 minutes.
7. After first deploy: **Settings → Domains** → add `basmatech.sa` (or `nordbuild.sa` if that's the parent domain).

## Step 3: Import → Vercel (Site 2 — walking-tour portfolio)

Same flow:
1. https://vercel.com/new → Import the same `basmatech-web` repo (Vercel allows reusing for multiple projects)
2. **Project Name**: `basmatech-portfolio`
3. **Framework Preset**: Next.js
4. **Root Directory**: `apps/portfolio`  ← different
5. Click **Deploy**. ~2 minutes (the 1.7GB of frame assets uploads once and is cached).
6. **Settings → Domains** → add `work.basmatech.sa` (or `tour.basmatech.sa`).

## Why two projects (not one)

- Each app has its own `next build` output, separate routing, separate caching.
- Domains can point at different subdomains.
- One can ship without the other.
- Vercel's monorepo detection (the workspace `pnpm-lock.yaml` at repo root) handles `workspace:*` deps automatically when `Root Directory` is set per project. CLI deploy without setting Root Directory tries to `npm install` from inside the app dir and fails on `workspace:*`.

## Asset weight reality check

- **Site 1**: ~119 MB of frame sequences (605 frames × 5 chapters), ~1 MB of showcase + logos. First-load impression is the dark Threshold chapter — frames lazy-load as the user scrolls.
- **Site 2**: ~210 MB of frame sequences (9 walk-ins × 121 frames + 8 transitions × 121 frames). All cached `Cache-Control: public, max-age=31536000, immutable`. First load only fetches what the visitor scrolls into, in 1.5-viewport-ahead batches.

## Domain wiring (post-deploy)

After both projects are live with Vercel's `*.vercel.app` URLs:

1. Buy `basmatech.sa` (~$15-25/year) from any registrar that supports `.sa` (the registrar is the Saudi NIC).
2. In Vercel: **basmatech-main → Settings → Domains** → add `basmatech.sa` and `www.basmatech.sa`.
3. Vercel gives you A or CNAME records to paste at your registrar.
4. Repeat for `basmatech-portfolio → Settings → Domains` → `work.basmatech.sa`.
5. Within ~10 min the domains resolve, with auto-HTTPS via Let's Encrypt.

## Environment variables

Both apps are static + SSR with no env-var-dependent runtime code right now. Production deploys need nothing in the Vercel env tab.

The only secrets in the repo are in `.env` (gitignored) used by content-regen scripts:
- `GOOGLE_API_KEY` — Gemini for image gen (optional)
- `FAL_KEY` — Kling 2.1 Master video interpolation

These are NOT needed for prod runtime. Rotate after the first public deploy as they were typed in clear chat.

## Re-deploy after content edits

```bash
git add .
git commit -m "content: update project 04 hero"
git push
```

Vercel auto-deploys both projects on every push to `main`. Each project's "Root Directory" filter means a change to `apps/portfolio/**` only re-deploys the portfolio (and vice versa).
