import { notFound } from 'next/navigation';
import { homeSpec, getHomeCopy } from '@basmatech/content';
import { TourCanvas, TintWash, Pathfinder } from '@basmatech/ui';
import { LenisProvider } from '@/app/providers/LenisProvider';

/**
 * /[lang]/preview — Phase 1 scaffold preview route.
 *
 * Mounts the new TourCanvas + TintWash + Pathfinder against the homepage
 * TourSpec. Frames don't exist yet (Phase 2 generates them), so each
 * phase renders as a flat #0F1020 background with the canonical hero
 * fallback path that 404s gracefully — the canvas falls back to the bg
 * color until Phase 2 supplies frames.
 *
 * The legacy `/[lang]/page.tsx` route is untouched. Phase 3 migrates it.
 */
export default async function HomePreview({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (lang !== 'ar' && lang !== 'en') notFound();
  const copy = getHomeCopy(lang);
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  // Per-phase scroll budgets for homepage. All chapters are 400vh except
  // Threshold (100vh — quick splash) and Invitation (100vh closing).
  const phaseHeightsVh: Record<string, number> = {
    'home-c1-threshold': 100,
    'home-c2-imprint': 400,
    'home-c3-workshop': 400,
    'home-c4-motion': 400,
    'home-c5-kingdom': 400,
    'home-c6-capabilities': 400,
    'home-c7-proof': 300,
    'home-c8-invitation': 100,
  };

  const phaseHeightsArr = homeSpec.phases.map(
    (p: { phaseId: string }) => phaseHeightsVh[p.phaseId] ?? 400,
  );

  return (
    <>
      <script
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.setAttribute('lang','${lang}');document.documentElement.setAttribute('dir','${dir}');`,
        }}
      />
      <LenisProvider />
      <TourCanvas spec={homeSpec} phaseHeightsVh={phaseHeightsVh} />
      <TintWash phases={homeSpec.phases} phaseHeightsVh={phaseHeightsArr} />
      <Pathfinder phases={homeSpec.phases} phaseHeightsVh={phaseHeightsArr} />

      {/* Phase 1 indicator — visible until Phase 3 replaces it with text overlays. */}
      <div
        style={{
          position: 'fixed',
          left: 24,
          top: 24,
          zIndex: 70,
          fontFamily: 'monospace',
          fontSize: 11,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'rgba(245, 245, 248, 0.7)',
          padding: '8px 12px',
          background: 'rgba(15, 16, 32, 0.6)',
          backdropFilter: 'blur(8px)',
          borderRadius: 4,
          pointerEvents: 'none',
        }}
      >
        Phase 1 preview · {copy.brand.wordmark} · home spec
      </div>
    </>
  );
}
