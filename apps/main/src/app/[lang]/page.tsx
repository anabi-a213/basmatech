import { notFound } from 'next/navigation';
import { homeSpec, getHomeCopy } from '@basmatech/content';
import { TourCanvas, TintWash, Pathfinder } from '@basmatech/ui';
import { LenisProvider } from '@/app/providers/LenisProvider';
import { Header, Footer, MagentaBand } from '@basmatech/design-system';

/**
 * Site 1 home page driven by TourCanvas (Phase 1+2 architecture).
 * 8 chapter phases. Phases 02..05 carry Kling-rendered walk frames;
 * 01/06/07/08 are static splash sections that show their tint gradient.
 * Text overlays are absolutely-positioned per phase scroll position.
 */
export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (lang !== 'ar' && lang !== 'en') notFound();
  const copy = getHomeCopy(lang);
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  // Per-phase scroll budgets in vh-percentage units (100 = 1 viewport).
  // Threshold + Invitation are 100vh splashes. Chapters 02..05 are 400vh
  // walks (200vh scrub + 100vh dwell + 100vh release). 06/07 are 200vh.
  const phaseHeightsVh: Record<string, number> = {
    'home-c1-threshold': 100,
    'home-c2-imprint': 400,
    'home-c3-workshop': 400,
    'home-c4-motion': 400,
    'home-c5-kingdom': 400,
    'home-c6-capabilities': 200,
    'home-c7-proof': 200,
    'home-c8-invitation': 100,
  };
  const phaseHeightsArr = homeSpec.phases.map(
    (p: { phaseId: string }) => phaseHeightsVh[p.phaseId] ?? 400,
  );

  const otherLang = lang === 'ar' ? 'en' : 'ar';

  // Compute cumulative top in vh for overlay positioning.
  let cum = 0;
  const phaseTopVh: number[] = phaseHeightsArr.map((h: number) => {
    const t = cum;
    cum += h;
    return t;
  });

  return (
    <>
      <script
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.setAttribute('lang','${lang}');document.documentElement.setAttribute('dir','${dir}');document.body.style.background='#0F1020';`,
        }}
      />
      <LenisProvider />

      <Header
        lang={lang}
        toggleHref={`/${otherLang}`}
        toggleLabel={otherLang.toUpperCase()}
        brandLabel={copy.brand.wordmark}
        nav={[]}
      />

      <TourCanvas spec={homeSpec} phaseHeightsVh={phaseHeightsVh} />
      <TintWash phases={homeSpec.phases} phaseHeightsVh={phaseHeightsArr} />
      <Pathfinder phases={homeSpec.phases} phaseHeightsVh={phaseHeightsArr} />

      {/* Overlay text per chapter, mid-dwell positioning */}
      {([
        { phase: 'home-c1-threshold', mid: 50, c: copy.chapters.threshold },
        { phase: 'home-c2-imprint', mid: phaseTopVh[1] + 250, c: copy.chapters.imprint },
        { phase: 'home-c3-workshop', mid: phaseTopVh[2] + 250, c: copy.chapters.workshop },
        { phase: 'home-c4-motion', mid: phaseTopVh[3] + 250, c: copy.chapters.motion },
        { phase: 'home-c5-kingdom', mid: phaseTopVh[4] + 250, c: copy.chapters.kingdom },
        { phase: 'home-c6-capabilities', mid: phaseTopVh[5] + 100, c: copy.chapters.capabilities },
        { phase: 'home-c7-proof', mid: phaseTopVh[6] + 100, c: copy.chapters.proof },
        { phase: 'home-c8-invitation', mid: phaseTopVh[7] + 50, c: copy.chapters.invitation },
      ] as const).map(({ phase, mid, c }) => (
        <div
          key={phase}
          style={{
            position: 'absolute',
            top: `calc(${mid}vh - 50vh)`,
            left: 0,
            right: 0,
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: 'clamp(80px, 12vh, 120px) clamp(24px, 6vw, 96px)',
            color: '#F5F5F8',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          <div style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(245,245,248,0.6)', marginBottom: 24 }}>
            {c.eyebrow}
          </div>
          <h2 style={{
            fontFamily: lang === 'ar' ? 'var(--font-ar)' : 'var(--font-display)',
            fontWeight: lang === 'ar' ? 900 : 800,
            fontSize: 'clamp(36px, 5.5vw, 76px)',
            lineHeight: 1.1,
            margin: '0 0 16px',
            maxWidth: '20ch',
            textShadow: '0 4px 32px rgba(0,0,0,0.5)',
          }}>{c.headline}</h2>
          <p style={{ fontSize: 'clamp(15px, 1.4vw, 19px)', color: 'rgba(245,245,248,0.85)', maxWidth: '52ch', marginBottom: 12 }}>
            {c.subhead}
          </p>
          {'body' in c && c.body && (
            <p style={{ fontSize: 'clamp(13px, 1.2vw, 16px)', color: 'rgba(245,245,248,0.7)', maxWidth: '50ch' }}>
              {c.body}
            </p>
          )}
        </div>
      ))}

      <MagentaBand label={copy.magentaBand} />
      <Footer lang={lang} lines={copy.footer} />
    </>
  );
}
