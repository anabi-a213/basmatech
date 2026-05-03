import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header, Footer } from '@basmatech/design-system';
import { getServices, getHome } from '@basmatech/content';
import type { ServiceSlug } from '@basmatech/content';

const VALID_SLUGS: ServiceSlug[] = ['walls', 'games', 'kinetic', 'displays', 'immersive', 'operations'];

export function generateStaticParams() {
  const params: { lang: string; slug: string }[] = [];
  for (const lang of ['ar', 'en']) {
    for (const slug of VALID_SLUGS) {
      params.push({ lang, slug });
    }
  }
  return params;
}

export default async function ServiceDetail({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (lang !== 'ar' && lang !== 'en') notFound();
  if (!VALID_SLUGS.includes(slug as ServiceSlug)) notFound();

  const sCopy = getServices(lang);
  const hCopy = getHome(lang);
  const service = sCopy.services[slug as ServiceSlug];
  const otherLang = lang === 'ar' ? 'en' : 'ar';

  return (
    <>
      <Header
        lang={lang}
        toggleHref={`/${otherLang}/services/${slug}`}
        toggleLabel={otherLang.toUpperCase()}
        brandLabel={hCopy.brand.wordmark}
        nav={hCopy.nav}
      />

      <main style={{ paddingTop: 160, paddingBottom: 96, background: 'var(--canvas)' }}>
        <div className="container-wide">
          {/* Hero */}
          <div style={{ maxWidth: 880, marginBottom: 80 }}>
            <p className="section-eyebrow">
              {service.number} · {service.eyebrow}
            </p>
            {lang === 'ar' ? (
              <h1 className="section-headline-ar">{service.title}</h1>
            ) : (
              <h1 className="section-headline-en">{service.title}</h1>
            )}
            <p
              style={{
                fontFamily: lang === 'ar' ? 'var(--font-ar)' : 'var(--font-editorial)',
                fontStyle: lang === 'ar' ? 'normal' : 'italic',
                fontWeight: lang === 'ar' ? 700 : 400,
                fontSize: 'clamp(20px, 1.8vw, 26px)',
                color: 'var(--magenta)',
                margin: '12px 0 24px',
              }}
            >
              {service.tagline}
            </p>
            <p
              style={{
                fontSize: 'clamp(15px, 1.2vw, 17px)',
                lineHeight: 1.7,
                color: 'var(--ink-soft)',
                fontFamily: lang === 'ar' ? 'var(--font-ar)' : 'var(--font-body)',
                maxWidth: 720,
              }}
            >
              {service.intro}
            </p>
          </div>

          {/* Steps */}
          <section style={{ marginBottom: 96 }}>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--ink-mute)',
                marginBottom: 32,
              }}
            >
              {lang === 'ar' ? 'كيف نُسلّم المشروع' : 'How we ship a project'}
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 24,
              }}
            >
              {service.steps.map((s, i) => (
                <div
                  key={s.title}
                  style={{
                    padding: 28,
                    background: 'var(--canvas-soft)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-soft)',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 12,
                      color: 'var(--magenta)',
                      letterSpacing: '0.12em',
                      display: 'block',
                      marginBottom: 12,
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3
                    style={{
                      fontFamily: lang === 'ar' ? 'var(--font-ar)' : 'var(--font-display)',
                      fontWeight: lang === 'ar' ? 900 : 800,
                      fontSize: 18,
                      letterSpacing: lang === 'ar' ? 0 : '-0.01em',
                      margin: '0 0 8px',
                      color: 'var(--ink)',
                    }}
                  >
                    {s.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: lang === 'ar' ? 'var(--font-ar)' : 'var(--font-body)',
                      fontSize: 14,
                      lineHeight: 1.6,
                      color: 'var(--ink-soft)',
                      margin: 0,
                    }}
                  >
                    {s.line}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Materials + signature row */}
          <section
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 48,
              marginBottom: 96,
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-mute)',
                  marginBottom: 24,
                }}
              >
                {lang === 'ar' ? 'ما الذي يدخل في المشروع' : 'What goes in'}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {service.materials.map((m) => (
                  <div
                    key={m.label}
                    style={{
                      padding: '16px 20px',
                      borderLeft: lang === 'ar' ? 'none' : '2px solid var(--magenta)',
                      borderRight: lang === 'ar' ? '2px solid var(--magenta)' : 'none',
                      background: 'var(--canvas-soft)',
                    }}
                  >
                    <strong
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        color: 'var(--ink)',
                        marginBottom: 4,
                      }}
                    >
                      {m.label}
                    </strong>
                    <span
                      style={{
                        fontFamily: lang === 'ar' ? 'var(--font-ar)' : 'var(--font-body)',
                        fontSize: 14,
                        lineHeight: 1.6,
                        color: 'var(--ink-soft)',
                      }}
                    >
                      {m.line}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-mute)',
                  marginBottom: 24,
                }}
              >
                {lang === 'ar' ? 'التوقيع' : 'Signature'}
              </p>
              <p
                style={{
                  fontFamily: lang === 'ar' ? 'var(--font-ar)' : 'var(--font-editorial)',
                  fontStyle: lang === 'ar' ? 'normal' : 'italic',
                  fontSize: 'clamp(20px, 1.8vw, 26px)',
                  lineHeight: 1.5,
                  color: 'var(--ink)',
                  margin: '0 0 32px',
                }}
              >
                {service.signature}
              </p>

              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-mute)',
                  marginBottom: 16,
                }}
              >
                {lang === 'ar' ? 'الحجم المعتاد' : 'Typical scale'}
              </p>
              <dl
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  rowGap: 10,
                  columnGap: 24,
                  margin: 0,
                }}
              >
                {service.scale.map((row) => (
                  <div key={row.label} style={{ display: 'contents' }}>
                    <dt
                      style={{
                        fontFamily: lang === 'ar' ? 'var(--font-ar)' : 'var(--font-mono)',
                        fontSize: lang === 'ar' ? 14 : 12,
                        letterSpacing: lang === 'ar' ? 0 : '0.08em',
                        color: 'var(--ink-mute)',
                      }}
                    >
                      {row.label}
                    </dt>
                    <dd
                      style={{
                        margin: 0,
                        fontFamily: 'var(--font-mono)',
                        fontSize: 14,
                        color: 'var(--ink)',
                      }}
                    >
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          {/* Reference case */}
          <section
            style={{
              padding: '40px 48px',
              background: 'var(--canvas-deep)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: 800,
              marginBottom: 96,
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--magenta)',
                marginBottom: 12,
              }}
            >
              {lang === 'ar' ? 'الحالة المرجعية' : 'Reference case'}
            </p>
            <h3
              style={{
                fontFamily: lang === 'ar' ? 'var(--font-ar)' : 'var(--font-display)',
                fontWeight: lang === 'ar' ? 900 : 800,
                fontSize: 'clamp(22px, 2vw, 28px)',
                margin: '0 0 8px',
                color: 'var(--ink)',
              }}
            >
              {service.caseStudy.title}
            </h3>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-mute)', margin: '0 0 16px' }}>
              {service.caseStudy.venue} · {service.caseStudy.year}
            </p>
            <p
              style={{
                fontFamily: lang === 'ar' ? 'var(--font-ar)' : 'var(--font-body)',
                fontSize: 15,
                lineHeight: 1.6,
                color: 'var(--ink-soft)',
                margin: 0,
              }}
            >
              {service.caseStudy.outcome}
            </p>
          </section>

          {/* Next + CTA */}
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <Link
              href={`/${lang}/services/${service.next.slug}`}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--ink-soft)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {service.next.label}
              <span aria-hidden style={{ transform: lang === 'ar' ? 'rotate(180deg)' : 'none' }}>→</span>
            </Link>
            <Link href={`/${lang}/contact`} className="hero__cta">
              <span>{lang === 'ar' ? 'ابدأ مشروعاً' : 'Start a project'}</span>
              <span aria-hidden style={{ transform: lang === 'ar' ? 'rotate(180deg)' : 'none' }}>→</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer lang={lang} lines={hCopy.footer} />
    </>
  );
}
