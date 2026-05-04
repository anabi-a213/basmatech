import { notFound } from 'next/navigation';
import { homeSpec, getHomeCopy } from '@basmatech/content';
import { TourCanvas, TintWash, Pathfinder, PhaseOverlay } from '@basmatech/ui';
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
  // Threshold + Invitation are 100vh splashes. Chapters 02..05 are 250vh
  // walks (200vh full-canvas scrub + 50vh static dwell on the last frame).
  // 06/07 trimmed to 150vh static splashes — they have no Kling walk and
  // 200vh of pure tint with brief text felt empty.
  const phaseHeightsVh: Record<string, number> = {
    'home-c1-threshold': 100,
    'home-c2-imprint': 250,
    'home-c3-workshop': 250,
    'home-c4-motion': 250,
    'home-c5-kingdom': 250,
    'home-c6-capabilities': 150,
    'home-c7-proof': 150,
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

      {/* Overlay text per chapter. Each centerOffsetVh places the headline
          at the moment the canvas reaches its final frame (200vh into the
          250vh walk phases) so the type lands with the static scene under
          it. Splash phases use phase center. PhaseOverlay handles the
          opacity crossfade between adjacent chapters. */}
      {([
        { phase: 'home-c1-threshold', top: phaseTopVh[0], offset: 50, c: copy.chapters.threshold },
        { phase: 'home-c2-imprint', top: phaseTopVh[1], offset: 200, c: copy.chapters.imprint },
        { phase: 'home-c3-workshop', top: phaseTopVh[2], offset: 200, c: copy.chapters.workshop },
        { phase: 'home-c4-motion', top: phaseTopVh[3], offset: 200, c: copy.chapters.motion },
        { phase: 'home-c5-kingdom', top: phaseTopVh[4], offset: 200, c: copy.chapters.kingdom },
        { phase: 'home-c6-capabilities', top: phaseTopVh[5], offset: 75, c: copy.chapters.capabilities },
        { phase: 'home-c7-proof', top: phaseTopVh[6], offset: 75, c: copy.chapters.proof },
        { phase: 'home-c8-invitation', top: phaseTopVh[7], offset: 50, c: copy.chapters.invitation },
      ] as const).map(({ phase, top, offset, c }) => (
        <PhaseOverlay
          key={phase}
          phaseTopVh={top}
          centerOffsetVh={offset}
          contentStyle={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: 'clamp(80px, 12vh, 120px) clamp(24px, 6vw, 96px)',
            color: '#F5F5F8',
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
        </PhaseOverlay>
      ))}

      <MagentaBand label={copy.magentaBand} />
      <Footer lang={lang} lines={copy.footer} />
    </>
  );
}
