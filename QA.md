# QA Checklist — fill at Phase 7

Each item is a hard gate before promote-to-production at GATE 7.

## Visual continuity
- [ ] Scroll the entire homepage and the entire portfolio. No seams. No
      flashes between phases.
- [ ] The TintWash hue interpolates smoothly across every adjacent phase pair.
- [ ] Pause-scroll for 5 seconds at every phase boundary; pixel content does
      not drift.

## Scroll completion
- [ ] Every 121-frame walk reaches frame 120 before the canvas advances to
      the next phase. Confirm via TourCanvas onUpdate logs.
- [ ] Each phase's end-frame dwell holds for the budgeted 100vh.
- [ ] Cursor-reactive Motion phase: mouse-X offset visibly tilts the wave.

## Bilingual integrity
- [ ] AR/EN paired meanings, no literal translations.
- [ ] No banned phrases:
       - EN: synergy, leverage, cutting-edge
       - AR: ابتكار, رؤية مستقبلية
- [ ] No em-dashes anywhere.
- [ ] `pnpm tsx pipeline/scripts/voiceLint.ts` exits 0.

## Mobile parity
- [ ] Real iPhone Safari (iOS 17+) passes scroll-through with no rubber-band
      jitter on pinned phases. Lenis is OFF on iOS by design.
- [ ] Real Android Chrome passes scroll-through cleanly.
- [ ] No scroll-top jump on initial load.
- [ ] No janky scroll on either device.
- [ ] Mobile uses 60-frame folders; desktop uses 121-frame folders.

## Performance
- [ ] Desktop LCP <= 2.0s, INP <= 100ms, CLS <= 0.05.
- [ ] Mobile (4G throttle) LCP <= 3.5s, INP <= 200ms, CLS <= 0.05.
- [ ] Total bytes per phase: <= 5 MB desktop, <= 1 MB mobile.

## Reduced motion
- [ ] macOS Reduce Motion replaces canvas with static `<img>` per phase;
      no transforms.
- [ ] No layout shift between full-motion and reduced-motion paths.

## No AI tells
- [ ] Contact-sheet review of 4 random frames per project shows:
      no warped perspective, no melting wood grain, no impossible joinery,
      no lumpy stone, no fake plants, no uncanny DOF, no fingers, no faces.

## Cross-browser
- [ ] Chrome 120+ pass.
- [ ] Edge 120+ pass.
- [ ] Safari 17+ pass.
- [ ] Firefox 130+ pass.
- [ ] No console errors at any tested browser.

## Real-photo drop-in
- [ ] Swap test: replace `assets/projects/{phase}/walk/` with a placeholder
      photographer-delivered folder. The site renders the swap with no code
      change.

## Sign-off
- [ ] All boxes above ticked.
- [ ] CHANGES.md current.
- [ ] Vercel preview URL pasted in chat with all green.
- [ ] Human says "ship it".
