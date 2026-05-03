import { notFound } from 'next/navigation';
import { portfolioSpec, getPortfolioCopy } from '@basmatech/content';
import { TourCanvas, TintWash, Pathfinder } from '@basmatech/ui';
import { LenisProvider } from '@/app/providers/LenisProvider';
import { Header, Footer, MagentaBand } from '@basmatech/design-system';

/**
 * Portfolio walking-tour entry. The new TourCanvas architecture (Phase 1):
 * one fixed canvas drives all 11 phases via a single ScrollTrigger that
 * maps scrollY to (phase, frame). TintWash crossfades adjacent phases'
 * tints in last 20%/first 20% windows. Pathfinder dot navigator on the
 * right edge.
 */
export default async function PortfolioTour({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (lang !== 'ar' && lang !== 'en') notFound();
  const copy = getPortfolioCopy(lang);
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  // Per-phase scroll budgets. Foyer + closing are 100vh splash sections,
  // each project walk is 400vh = 200vh frame scrub + 100vh end-frame dwell + 100vh release.
  const phaseHeightsVh: Record<string, number> = {
    'tour-foyer': 100,
    'tour-closing': 100,
  };
  const phaseHeightsArr = portfolioSpec.phases.map(
    (p: { phaseId: string }) => phaseHeightsVh[p.phaseId] ?? 400,
  );

  const otherLang = lang === 'ar' ? 'en' : 'ar';
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
        nav={copy.nav}
      />

      <TourCanvas spec={portfolioSpec} phaseHeightsVh={phaseHeightsVh} />
      <TintWash phases={portfolioSpec.phases} phaseHeightsVh={phaseHeightsArr} />
      <Pathfinder phases={portfolioSpec.phases} phaseHeightsVh={phaseHeightsArr} />

      {/* Foyer overlay text (first 100vh) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '80px clamp(20px, 5vw, 60px)',
          color: '#F5F5F8',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        <div style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(245,245,248,0.65)', marginBottom: 16 }}>
          — {copy.foyer.eyebrowOverline} —
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(245,245,248,0.85)', marginBottom: 24 }}>
          {copy.foyer.eyebrow}
        </div>
        <h1
          style={{
            fontFamily: lang === 'ar' ? 'var(--font-ar)' : 'var(--font-display)',
            fontWeight: lang === 'ar' ? 900 : 800,
            fontSize: 'clamp(36px, 7vw, 96px)',
            lineHeight: 1.1,
            margin: '0 0 16px',
            maxWidth: '20ch',
            textShadow: '0 4px 32px rgba(0,0,0,0.5)',
          }}
        >
          {copy.foyer.headline}
        </h1>
        <p style={{ fontSize: 'clamp(15px, 1.3vw, 19px)', color: 'rgba(245,245,248,0.85)', maxWidth: '56ch' }}>
          {copy.foyer.subhead}
        </p>
      </div>

      {/* Per-project overlays positioned via fixed offsets in the scroll table */}
      {copy.projects.map((project, i) => {
        // Each project section starts at: 100vh (foyer) + i * 400vh
        const offsetVh = 100 + i * 400 + 200; // mid-dwell
        return (
          <div
            key={project.slug}
            style={{
              position: 'absolute',
              top: `calc(${offsetVh}vh - 50vh)`,
              left: 0,
              right: 0,
              height: '100vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: 'clamp(80px, 12vh, 120px) clamp(24px, 6vw, 96px)',
              color: '#F5F5F8',
              zIndex: 10,
              pointerEvents: 'none',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
              <span style={{ fontFamily: 'monospace', fontSize: 13, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--magenta, #FF5A9E)' }}>
                {project.number} {copy.ui.progressOf} 09
              </span>
              <span style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(245,245,248,0.7)' }}>
                {project.categoryLabel}
              </span>
            </div>
            <h2
              style={{
                fontFamily: lang === 'ar' ? 'var(--font-ar)' : 'var(--font-display)',
                fontWeight: lang === 'ar' ? 900 : 800,
                fontSize: 'clamp(36px, 5.5vw, 76px)',
                lineHeight: 1.1,
                margin: '0 0 12px',
                maxWidth: '20ch',
                textShadow: '0 4px 32px rgba(0,0,0,0.5)',
              }}
            >
              {project.title}
            </h2>
            <p style={{ fontFamily: lang === 'ar' ? 'var(--font-ar)' : 'var(--font-editorial)', fontStyle: lang === 'ar' ? 'normal' : 'italic', fontSize: 'clamp(16px, 1.5vw, 22px)', color: 'var(--magenta, #FF5A9E)', marginBottom: 16 }}>
              {project.subtitle}
            </p>
            <p style={{ fontFamily: 'monospace', fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(245,245,248,0.7)', marginBottom: 24 }}>
              {project.city} · {project.year}
            </p>
            <p style={{ fontSize: 'clamp(15px, 1.5vw, 20px)', lineHeight: 1.5, color: 'rgba(245,245,248,0.95)', maxWidth: '50ch' }}>
              {project.outcome}
            </p>
          </div>
        );
      })}

      {/* Closing CTA */}
      <div
        style={{
          position: 'absolute',
          top: `calc(${100 + 9 * 400}vh)`,
          left: 0,
          right: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: 'clamp(80px, 12vh, 160px) clamp(24px, 6vw, 80px)',
          color: '#F5F5F8',
          zIndex: 10,
        }}
      >
        <div style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,245,248,0.7)', marginBottom: 24 }}>
          — {copy.closing.eyebrow} —
        </div>
        <h2
          style={{
            fontFamily: lang === 'ar' ? 'var(--font-ar)' : 'var(--font-display)',
            fontWeight: lang === 'ar' ? 900 : 800,
            fontSize: 'clamp(32px, 5.5vw, 76px)',
            lineHeight: 1.1,
            margin: '0 0 16px',
            maxWidth: '24ch',
          }}
        >
          {copy.closing.headline}
        </h2>
        <p style={{ fontSize: 'clamp(16px, 1.5vw, 22px)', color: 'rgba(245,245,248,0.85)', maxWidth: '52ch', marginBottom: 16 }}>
          {copy.closing.subhead}
        </p>
        {copy.closing.body && (
          <p style={{ fontSize: 'clamp(14px, 1.3vw, 17px)', color: 'rgba(245,245,248,0.7)', maxWidth: '50ch', marginBottom: 48 }}>
            {copy.closing.body}
          </p>
        )}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          <a
            href="https://basmatech.sa/contact"
            style={{
              padding: '16px 32px',
              borderRadius: 999,
              background: '#FF5A9E',
              color: '#fff',
              fontFamily: 'monospace',
              fontSize: 13,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              boxShadow: '0 8px 32px rgba(255,90,158,0.5)',
            }}
          >
            {copy.closing.cta}
          </a>
          <a
            href={`https://basmatech.sa/${lang}`}
            style={{
              padding: '16px 28px',
              borderRadius: 999,
              border: '1px solid rgba(245,245,248,0.4)',
              color: 'rgba(245,245,248,0.92)',
              fontFamily: 'monospace',
              fontSize: 13,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            {copy.closing.ctaSecondary}
          </a>
        </div>
      </div>

      <MagentaBand label={copy.closing.bandLabel} />
      <Footer
        lang={lang}
        lines={{
          brandLabel: copy.footer.brandLabel,
          legalEntity: copy.footer.legalEntity,
          address: copy.footer.address,
          contactLabel: copy.footer.contactLabel,
          contactEmail: copy.footer.contactEmail,
          parentLabel: copy.footer.parentLabel,
          parentName: copy.footer.parentName,
          copyright: copy.footer.copyright,
          legal: [],
        }}
      />
    </>
  );
}
