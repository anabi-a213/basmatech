import { notFound } from 'next/navigation';
import { portfolioSpec, getPortfolioCopy } from '@basmatech/content';
import { TourCanvas, TintWash, Pathfinder } from '@basmatech/ui';
import { LenisProvider } from '@/app/providers/LenisProvider';

/**
 * /[lang]/preview — Phase 1 scaffold preview route for the portfolio tour.
 * Same structure as the main app's preview route. Frames don't yet exist;
 * canvas falls back to its bg color.
 */
export default async function PortfolioPreview({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (lang !== 'ar' && lang !== 'en') notFound();
  const copy = getPortfolioCopy(lang);
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  // Foyer + closing 100vh, the 9 walks 400vh each.
  const phaseHeightsVh: Record<string, number> = {
    'tour-foyer': 100,
    'tour-closing': 100,
  };
  const phaseHeightsArr = portfolioSpec.phases.map(
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
      <TourCanvas spec={portfolioSpec} phaseHeightsVh={phaseHeightsVh} />
      <TintWash phases={portfolioSpec.phases} phaseHeightsVh={phaseHeightsArr} />
      <Pathfinder phases={portfolioSpec.phases} phaseHeightsVh={phaseHeightsArr} />

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
        Phase 1 preview · {copy.brand.wordmark} · portfolio spec
      </div>
    </>
  );
}
