import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header, Footer } from '@basmatech/design-system';
import { getServices, getHome } from '@basmatech/content';

export default async function ServicesIndex({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (lang !== 'ar' && lang !== 'en') notFound();
  const sCopy = getServices(lang);
  const hCopy = getHome(lang);
  const otherLang = lang === 'ar' ? 'en' : 'ar';

  return (
    <>
      <Header
        lang={lang}
        toggleHref={`/${otherLang}/services`}
        toggleLabel={otherLang.toUpperCase()}
        brandLabel={hCopy.brand.wordmark}
        nav={hCopy.nav}
      />
      <main
        className="section-pad"
        style={{ background: 'var(--canvas)', minHeight: '100vh', paddingTop: 140 }}
      >
        <div className="container-wide">
          <p className="section-eyebrow">{sCopy.index.eyebrow}</p>
          {lang === 'ar' ? (
            <h1 className="section-headline-ar">{sCopy.index.headline}</h1>
          ) : (
            <h1 className="section-headline-en">{sCopy.index.headline}</h1>
          )}
          <p className="section-sub" style={{ marginBottom: 56 }}>
            {sCopy.index.subhead}
          </p>

          <div className="cap-grid">
            {(Object.values(sCopy.services)).map((s) => (
              <Link
                key={s.slug}
                href={`/${lang}/services/${s.slug}`}
                className="cap-card"
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <span className="cap-card__tag">{s.number}</span>
                <h2 className="cap-card__title">{s.title}</h2>
                <p className="cap-card__line">{s.tagline}</p>
                <span
                  style={{
                    marginTop: 24,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--magenta)',
                  }}
                >
                  {sCopy.index.cardCta}
                  <span aria-hidden style={{ transform: lang === 'ar' ? 'rotate(180deg)' : 'none' }}>
                    →
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer
        lang={lang}
        lines={hCopy.footer}
      />
    </>
  );
}
