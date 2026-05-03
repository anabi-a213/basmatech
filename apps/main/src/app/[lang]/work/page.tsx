import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getHome } from '@basmatech/content';

export default async function WorkPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (lang !== 'ar' && lang !== 'en') notFound();
  const copy = getHome(lang);
  return (
    <main className="section-pad" style={{ background: 'var(--field-cream)', minHeight: '100vh', paddingTop: 120 }}>
      <div className="container-wide">
        <p className="section-eyebrow">{copy.chapters.proof.eyebrow}</p>
        {lang === 'ar' ? (
          <h1 className="section-headline-ar">{copy.chapters.proof.headline}</h1>
        ) : (
          <h1 className="section-headline-en">{copy.chapters.proof.headline}</h1>
        )}
        <p className="section-sub">{copy.chapters.proof.subhead}</p>
        <div className="proof-grid">
          {copy.chapters.proof.cases.map((c) => (
            <article key={c.title} className="proof-card">
              <p className="proof-card__year">{c.year}</p>
              <h2 className="proof-card__title">{c.title}</h2>
              <p className="proof-card__venue">{c.venue}</p>
              <p className="proof-card__outcome">{c.outcome}</p>
            </article>
          ))}
        </div>
        <p style={{ marginTop: 64, fontSize: 14, color: 'var(--ink-mute)' }}>
          {lang === 'ar' ? 'موقع الأعمال الكامل (الجولة) قادم قريباً.' : 'Full portfolio walk-through coming soon.'}
        </p>
        <p style={{ marginTop: 16 }}>
          <Link href={`/${lang}`}>{lang === 'ar' ? 'العودة إلى الصفحة الرئيسية' : 'Back to home'}</Link>
        </p>
      </div>
    </main>
  );
}
