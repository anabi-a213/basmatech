# Basma Tech — Project Brief for Planning Claude

Paste this whole file to Claude when you want them to write a plan / prompt for the
implementation Claude (me). It contains everything we built, every tool we used, and
the open questions worth solving next.

---

## 1. What we built — two production sites, one monorepo

`basmatech-web/` is a pnpm + Turborepo workspace deployed to Vercel as **two separate
Vercel projects** sharing one GitHub repo (`anabi-a213/basmatech`):

### Site 1 — Main (https://basmatech-main.vercel.app/ar)
The brand manifesto, single page, scroll-driven, 8 chapters.

```
01 Threshold        Dark room + single magenta point of light + IgniteOverlay
                    Click-to-enter splash → "الغرفة مظلمة. الدهشة لم تشتعل بعد."

02 Imprint          [chapter-02 frames]  Spark crystallizes into a champagne-bronze
                                         hexagonal mirror tile. "بصمة" = fingerprint.

03 Workshop         [chapter-03 frames]  Top-down workshop bench in Riyadh. Scattered
                                         components → assembled kinetic module. Brass
                                         "RIYADH WORKSHOP" plate.

04 Motion           [chapter-04 frames]  312-tile kinetic mirror wall awakens, tiles
                                         tilt in a diagonal wave. CURSOR-REACTIVE: mouse
                                         X tilts the wave epicenter.

05 Kingdom          [chapter-05 frames]  Aerial Saudi peninsula at twilight. 6 magenta
                    + custom SVG map     beacons illuminate Riyadh, Jeddah, NEOM, AlUla,
                                         Red Sea, Dammam. Magenta connection lines arc.

06 Capabilities     600vh sticky section. Rotating SVG hex tile cycles through 6 facets,
                    one capability per viewport, large + centered.

07 Proof            3 × 100vh sticky case scenes, dark + magenta accent strip + radial
                    pastel gradient backdrop.

08 Invitation       Pastel field, magenta band ("Made in Saudi Arabia"), CTA buttons,
                    footer.
```

Plus secondary pages: `/services` (index of 6) + 6 service detail pages (each with
process + materials + signature + scale + reference case), `/about`, `/contact`,
`/process`, `/work`, `/legal/[slug]`. All bilingual AR-first / EN.

### Site 2 — Tour (https://basmatech-portfolio.vercel.app/ar)
The portfolio walk-through, single scrolling page, full-bleed cinematic.

```
Foyer               100vh, pastel-corridor entry photo, headline "Step in. You will
                    see our work, not pictures of our work."

Project 01-09       Each 400vh sticky section, full-bleed scroll-locked canvas playing
                    a 121-frame Kling-rendered walk-in (empty room → installation alive).
                    Each project has: number, category, title, city, year, outcome,
                    4 stats. Real Saudi venues. The 9 projects:
                    01 Hotel Lobby Jeddah   — kinetic mirror wall (Walls)
                    02 Retail Flagship Riyadh — 256 motorized mirrors (Walls)
                    03 Mall Arcade Dammam   — 540 pressure-sensing tile arena (Games)
                    04 Sports Activation Riyadh — louvered pavilion + magenta column
                                              (Games / Riyadh Season Stadium Hub)
                    05 Energy Atrium Riyadh  — 220-tile kinetic ceiling wave (Kinetic)
                    06 Cultural Hall AlUla   — 96 ceiling segments wave with music
                                              (Kinetic)
                    07 Restaurant Row Riyadh — 5 curved interactive LED screens, plaza
                                              (Screens)
                    08 Immersive Launch Riyadh — 360 projection room (Immersive)
                    09 Operations Portfolio   — 9 magenta beacons across Riyadh skyline

Closing             100vh, magenta CTA "ابدأ مشروعاً", magenta band, footer.
```

**No transitions between projects** (we tried them, the user wanted smoother — corridor
videos and cross-project dissolves both removed). Each project just flows into the next.

---

## 2. Tech stack — exact tools and versions

| Layer | Tool | Why |
|---|---|---|
| Framework | Next.js 15 App Router | SSR + RSC + automatic code splitting + per-app SSG. Two apps, one workspace. |
| UI runtime | React 19 | Server Components + Suspense for the metadata + `use()` for params. |
| Language | TypeScript 5.7 strict | Catches bilingual content shape errors at compile time. |
| Monorepo | pnpm 10 + Turborepo 2 | Fast hoisted node_modules, workspace deps via `workspace:*`. |
| Styling | Tailwind 4 (`@tailwindcss/postcss`) + design-system tokens.css + per-app globals.css | Tokens come from a single source, Tailwind for utility, custom CSS for cinematic specifics. |
| Type | next/font self-hosted Bricolage Grotesque (display EN), Cairo (AR), Manrope (body), Fraunces (editorial italic), JetBrains Mono | No FOIT / FOUT. AR-first, RTL flash prevented via inline script in `[lang]/layout.tsx`. |
| Scroll engine | GSAP 3.13 ScrollTrigger (free tier, NO SplitText) | The frame-canvas scrub controller. |
| Smooth scroll | Lenis 1.2 | Tames mouse-wheel velocity so scroll-locked canvas always has time to render every frame. Bails on `prefers-reduced-motion`. |
| Animation | Framer Motion 11 | Text reveals, fade-ins, the rotating SVG hex tile, button states. |
| State | zustand 5 | Currently unused but installed for future cursor mode. |
| Frame canvas | Custom `FrameSequenceCanvas` primitive in `packages/design-system/src/primitives/` | Hand-rolled, 247 lines, eager-loads frame 0 + idle-batches the rest, IntersectionObserver upgrades batch-of-4 → rAF batch-of-16 when section is within 1.5 viewports of view, falls back to highest-loaded frame on miss, supports `cursorReactive` for chapter 04, supports `scrollEnd` override (e.g. `+=200%` to finish scrub before sticky unpins). |

### Asset generation pipeline

```
Step 1: KEYFRAMES (start + end image of a cinematic moment)
   Tool:   nano-banana (Gemini 2.5 Flash Image / Imagen via MCP)
   Input:  detailed prompt with camera (Hasselblad H6D-100c / ARRI Alexa 65),
           lens (24-80mm specific), ISO/aperture, named architectural references
           (Foster + Partners, Tadao Ando, Heatherwick Studio), real Saudi
           context (named cities / venues), exact materials (champagne-bronze,
           cream travertine, brushed steel, polished basalt), exact counts
           (312 tiles, 7m wall, 320 m²), brand color palette (mint / sky /
           lavender / pastel pink / magenta accent), explicit "NO PEOPLE",
           "NO TEXT", "NO organic/lumpy/blob", "16:9 ultra-widescreen"
   Output: 2K JPG end-frame + 1K JPG matching start-frame (edited from end
           via "remove the installation, keep everything else identical")
   Cost:   ~free per image, parallel batches of 4-8

Step 2: VIDEO INTERPOLATION (start → end as 5s motion)
   Tool:   Kling 2.1 Master via Fal.ai queue
            POST https://queue.fal.run/fal-ai/kling-video/v2.1/master/image-to-video
   Input:  base64-encoded start (`image_url`) + end (`tail_image_url`),
           prompt describing the motion ("smooth cinematic camera push-in
           toward [hero element]; as we approach, [installation transforms
           from off → alive]"), duration "5", aspect_ratio "16:9", negative
           prompt to suppress people/text/distortion
   Output: 1080p H.264 MP4 at 24fps, ~5 seconds
   Cost:   $2.50 per 5s video. We've spent ~$60 across 24 videos so far.
   Wallclock: ~3-5 min per job. Run them in parallel — Fal.ai queue handles
              concurrent jobs cleanly.

Step 3: FRAME EXTRACTION
   Tool:   ffmpeg-static (via npm), ffmpeg.exe
   Cmd:    ffmpeg -i video.mp4 -vsync 0 -vf fps=24 -c:v libwebp \
           -quality 90 -compression_level 4 frame-%03d.webp
   Output: 121 HD WebP files at q90, ~95KB each, native 1928×1072 resolution.
           Stored in apps/main/public/frames/chapter-NN/ or
           apps/portfolio/public/frames/walk-NN/ etc.

Step 4: SCROLL-LOCKED CANVAS PLAYBACK
   Component: <FrameSequenceCanvas framePath="/frames/walk-04/frame-"
                                   frameCount={121} triggerRef={ref}
                                   ext="webp" scrub={0.2}
                                   scrollEnd="+=200%" />
   Mechanism: GSAP ScrollTrigger maps section scroll progress 0..1 to frame
              number Math.round(progress * 120). Canvas redraws via rAF.
              IntersectionObserver pre-loads when section is within 1.5
              viewports of view. Initial frame eager, rest lazy.
   Layout:    Section is `position: relative; height: 400vh`. Inner sticky
              child is `position: sticky; top: 0; height: 100vh`. Sticky
              pins for 300vh. ScrollEnd at `+=200%` means frame scrub finishes
              after 200vh of section scroll, leaving 100vh of "end frame
              dwell" then 100vh of release.

   Critical rules:
   - NEVER set `overflow: hidden` on the section or any ancestor — sticky
     positioning silently breaks.
   - ALWAYS set `body { background: #0F1020 }` for tour pages or you get
     white flashes between sections.
   - On mobile (<768px), reduce section to 280vh = 140vh scrub + 100vh dwell
     + 40vh release.
```

### Content + voice system

`packages/content/src/{home,portfolio,services,tour}.ts` — single-source-of-truth
TypeScript objects, bilingual (`ar`, `en`), exported via `getHome(lang)`.

Every line of copy was authored against a master prompt with banned phrases:

```
BANNED EN: synergy, leverage, cutting-edge, best-in-class, world-class, journey,
seamless, holistic, immersive (use specific verbs), revolutionize, disruptive,
solutions, deliver, unlock, ecosystem, end-to-end (use "from sketch to operation").
NO em-dashes ever (period, comma, colon, restructure).

BANNED AR: ابتكار، رؤية مستقبلية، حلول متكاملة، تجربة استثنائية، نسعى لتقديم الأفضل،
إعادة تعريف، التحول الرقمي. NO em-dashes.

EVERY HEADLINE answers one of:
- What changed at the threshold? (before vs after)
- What is the specific count, dimension, or duration?
- What is the action verb the visitor takes?

EVERY SECTION ends with a sentence that names what the next section opens with.

AR ↔ EN are paired meanings, NOT literal translations.
Headlines max 6 words. Subheads max 12. Body max 3 sentences per paragraph.
```

### Deploy

- Two Vercel projects, both linked to GitHub repo `anabi-a213/basmatech`
- Per-app `rootDirectory` set via API (`apps/portfolio` and `apps/main`)
- Custom buildCommand: `cd ../.. && pnpm install --frozen-lockfile=false && pnpm --filter X build`
- This is the trick that makes `workspace:*` deps resolve correctly at build time.
- Vercel auto-deploys on push to `main`. Each project filters by its rootDirectory.
- Canonical URLs (auto-update on push):
  - https://basmatech-main.vercel.app/ar  /en
  - https://basmatech-portfolio.vercel.app/ar  /en
- Deploy-specific URLs (e.g. `basmatech-main-9ncmretnh-...vercel.app`) are FROZEN
  at the deploy commit and never update. Always use the canonical URLs.
- Domain wiring to `basmatech.sa` / `work.basmatech.sa` is one Vercel Settings →
  Domains click each (when domain owned). Auto-HTTPS via Let's Encrypt.

---

## 3. What works well right now

- 9 project walk-ins are visually distinct, each shot in real Saudi context (named cities,
  named architecture references, real installation behaviors).
- The empty → alive walk-in pattern reads instantly: visitor's scroll IS the camera +
  the installation transforming.
- Heroes are 2K, frames are HD WebP q90 — sharper than typical web video.
- Lenis duration 1.6 + scrub 0.2 + section 400vh + scrollEnd `+=200%` together
  guarantee every frame is visible at any scroll velocity, with 100vh of dwell
  on the final revealed installation.
- Bilingual AR-first works: lang/dir set via inline script before hydration so no
  LTR flash.
- Asset pipeline is reproducible: 24 Kling videos, 9 contrast-photo edits, 484 frames,
  all driven by 4 Python scripts (`submit-walks.py`, `poll-walks.py`, `submit-chapters.py`,
  `poll-chapters.py`).

---

## 4. Friction points — what could be smoother

1. **Per-section canvas creates seams.** Each project has its own `<FrameSequenceCanvas>`.
   When section A unpins and section B pins, the active canvas changes. Even though we
   match end-frame-of-A ≈ start-frame-of-B by design, there's a brief moment where
   browsers can render a 1-frame mismatch. The user perceives this as "videos cut
   between each one." Possible fixes:
   - **Single tour-wide canvas** (architectural change): one persistent fixed-position
     `<canvas>` at the page root. A central scroll mapper computes (folder, frame)
     from total scrollY and a phase table. Tradeoff: managing 9 × 121 = 1089 image
     elements in memory is heavy, would need quantized loading windows.
   - **Crossfade adjacent canvases via CSS opacity** (cheaper): each section's canvas
     is `position: fixed`, opacity controlled by IntersectionObserver. Active canvas
     opacity 1, others 0. Tradeoff: 9 fixed canvases sitting in DOM constantly.
   - **Concatenate frame sequences upstream** (preprocessing): build a single mp4 of
     all 9 walk-ins back-to-back, extract to one folder of 1089 frames. One canvas,
     one ScrollTrigger. Tradeoff: single ~210MB asset folder, harder to reorder
     projects, no per-project hold time.

2. **Kling end-frame drift.** Kling 2.1 Master interpolates start → end but doesn't
   strictly enforce the end frame matching the input image exactly. Some videos drift
   visually in the last 5-10% of frames. Mitigation in place: we override the last 30
   WebP frames with a static export of the actual hero photo (used on project 04 v3).
   Possible automation: post-extraction script that always overwrites the last N frames
   of every walk-NN folder with a webp-ified hero photo of that project, guaranteeing
   the dwell window shows the canonical end-state.

3. **Mobile experience untested deeply.** We added responsive CSS (280vh on <768px,
   2-col stats, scaled type, touch-action: pan-y) but never ran a real iOS device.
   Lenis on iOS Safari has known issues with rubber-band edge cases and momentum
   inertia. Possible fix: detect iOS via `navigator.userAgent` and disable Lenis
   (use native scroll), or downgrade scrub to 0 on touch.

4. **Site 1 and Site 2 don't link to each other.** They're two separate experiences
   on two separate domains. A visitor on Site 1's chapter 7 ("Proof") sees 3 case
   studies as text — they should hand off into Site 2's tour at the relevant project.
   Site 2's closing CTA links back to `basmatech.sa/contact` (Site 1 doesn't have
   that route yet).

5. **No video on Site 2 between projects.** The user originally asked for cross-project
   transition videos (we built 8, then removed them per their feedback that the cuts
   were jarring). We never tried a softer alternative: a 0.5-second CSS color wipe
   between projects using each project's `corridorTint` (mint/sky/lavender/pink/magenta/
   cream) — could give a visual handoff without a 100vh scroll commitment.

6. **No measured Lighthouse performance.** Production deploys are live but never
   benchmarked. With 1.7GB of frame assets across both sites, First Contentful Paint
   should still be fast (frame 0 only at boot, rest lazy), but actual numbers are
   unknown.

---

## 5. Research notes — best-in-class scroll-cinematic patterns to consider

This is what an outside Claude should research before writing the next plan:

- **Apple AirPods / iPhone product pages** — the canonical canvas-frame-scroll
  reference. Use as a quality bar.
- **Inkwell.studio** (their ATMOS work) — long-form scroll cinematic with WebGL
  shaders for between-scene transitions.
- **Cyd Stumpel** — stitched single-canvas scroll where each "scene" is a different
  segment of one continuous timeline. No per-section seams.
- **Studio Output / OHZI** — heavy use of `mix-blend-mode: difference` and CSS
  filters during scroll-locked moments.
- **Awwwards 2025 SOTD scroll-driven category** — pull 5 recent winners that use
  frame-scroll + per-project transitions. Note their section heights, scrub
  approach, mobile fallback.
- **View Transitions API (Chrome 111+)** — could automate cross-section transitions
  with `<view-transition>` declarative API. Requires same-document SPA navigation;
  works for our `/[lang]/` route.
- **Bezier easing for scroll mapping** — instead of linear progress 0..1 → frame,
  use `gsap.parseEase('power2.inOut')(progress)` so frames advance non-linearly,
  faster through the boring middle, slower at the dramatic moments.
- **Adaptive frame fps** — scrolling fast? play 12fps. Scrolling slow? play 24fps.
  Reduce mid-scroll bandwidth via `requestVideoFrameCallback`.

---

## 6. What I want next Claude to write a plan for

In priority order:

1. **A "single canvas" architecture** for the tour — one canvas at the page root,
   one ScrollTrigger, a phase table mapping scrollY ranges to (folder, frame).
   Eliminates per-section seams by design. Plan the data structure, the canvas
   manager component, and the migration path from the current per-section setup.

2. **An automated end-frame-lock script** — runs after every Kling extraction,
   overwrites the last N frames of every walk-NN folder with a webp version of
   the canonical hero photo. Eliminates Kling drift at the dwell window.

3. **A cross-project visual handoff** that's softer than the corridor video we
   removed — e.g. a 30-frame CSS-driven color wash using each project's
   `corridorTint`, or a webp-rendered breath of pastel particles, or a `mix-blend-mode`
   ribbon. Should add ~50vh of scroll and feel like a "next room" without
   committing to a full transition section.

4. **Mobile-first verification** — write a Playwright test suite that opens both
   apps at 375 × 812 (iPhone 13/14/15 viewport), scrolls every section, and
   asserts no white flashes, no missed frames, no janky scroll. Fix whatever it
   finds.

5. **Real installation photos** — Basma Tech is a real company with real installations.
   The current heroes are all AI-generated. Plan an asset replacement strategy:
   directory layout, photo brief sheets the photographer would shoot, and how to
   swap a single project's 121 walk-in frames for a real video without rebuilding
   anything else.

When the planning Claude is done, send their plan back to me and I'll execute.
The execution-Claude (me) has full repo write access, can call nano-banana for
images, can submit Kling jobs via Fal.ai, can run ffmpeg via ffmpeg-static, and
can deploy via Vercel API + GitHub push.

---

End of brief.
