import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (lang !== 'ar' && lang !== 'en') notFound();
  return (
    <main className="section-pad" style={{ background: 'var(--field-cream)', minHeight: '100vh', paddingTop: 120 }}>
      <div className="container-narrow">
        <p className="section-eyebrow">{lang === 'ar' ? 'القصة' : 'STORY'}</p>
        {lang === 'ar' ? (
          <h1 className="section-headline-ar">قريباً</h1>
        ) : (
          <h1 className="section-headline-en">Coming soon</h1>
        )}
        <p className="section-sub">
          {lang === 'ar'
            ? 'صفحة "عنّا" تلحق في المرحلة التالية. القصة، الفريق، المنهجية.'
            : 'About page lands in the next phase. The story, the team, the method.'}
        </p>
        <p style={{ marginTop: 48 }}>
          <Link href={`/${lang}`}>{lang === 'ar' ? 'العودة إلى الصفحة الرئيسية' : 'Back to home'}</Link>
        </p>
      </div>
    </main>
  );
}
