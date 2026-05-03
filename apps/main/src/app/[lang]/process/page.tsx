import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getHome } from '@basmatech/content';

export default async function ProcessPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (lang !== 'ar' && lang !== 'en') notFound();
  const copy = getHome(lang);
  return (
    <main className="section-pad" style={{ background: 'var(--field-cream)', minHeight: '100vh', paddingTop: 120 }}>
      <div className="container-narrow">
        <p className="section-eyebrow">{copy.chapters.loop.eyebrow}</p>
        {lang === 'ar' ? (
          <h1 className="section-headline-ar">{copy.chapters.loop.headline}</h1>
        ) : (
          <h1 className="section-headline-en">{copy.chapters.loop.headline}</h1>
        )}
        <p className="section-sub">{copy.chapters.loop.subhead}</p>
        <p style={{ marginTop: 32, color: 'var(--ink-soft)', lineHeight: 1.7 }}>{copy.chapters.loop.body}</p>
        <p style={{ marginTop: 48 }}>
          <Link href={`/${lang}`}>{lang === 'ar' ? 'العودة إلى الصفحة الرئيسية' : 'Back to home'}</Link>
        </p>
      </div>
    </main>
  );
}
