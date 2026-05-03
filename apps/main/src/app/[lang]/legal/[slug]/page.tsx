import { notFound } from 'next/navigation';
import Link from 'next/link';

const TITLES: Record<string, { ar: string; en: string }> = {
  privacy: { ar: 'سياسة الخصوصية', en: 'Privacy Policy' },
  terms: { ar: 'شروط الاستخدام', en: 'Terms of Use' },
  cookies: { ar: 'سياسة الكوكيز', en: 'Cookie Policy' },
};

export default async function LegalPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (lang !== 'ar' && lang !== 'en') notFound();
  if (!TITLES[slug]) notFound();
  const title = TITLES[slug][lang as 'ar' | 'en'];
  return (
    <main className="section-pad" style={{ background: 'var(--field-cream)', minHeight: '100vh', paddingTop: 120 }}>
      <div className="container-narrow">
        <p className="section-eyebrow">{lang === 'ar' ? 'قانوني' : 'LEGAL'}</p>
        {lang === 'ar' ? (
          <h1 className="section-headline-ar">{title}</h1>
        ) : (
          <h1 className="section-headline-en">{title}</h1>
        )}
        <p className="section-sub">
          {lang === 'ar' ? 'النص الكامل قادم قريباً.' : 'Full text lands in the next phase.'}
        </p>
        <p style={{ marginTop: 48 }}>
          <Link href={`/${lang}`}>{lang === 'ar' ? 'العودة إلى الصفحة الرئيسية' : 'Back to home'}</Link>
        </p>
      </div>
    </main>
  );
}
