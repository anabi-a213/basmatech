import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getHome } from '@basmatech/content';

export default async function ContactPage({
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
        <p className="section-eyebrow">{lang === 'ar' ? 'تواصل' : 'CONTACT'}</p>
        {lang === 'ar' ? (
          <h1 className="section-headline-ar">{copy.chapters.invitation.headline}</h1>
        ) : (
          <h1 className="section-headline-en">{copy.chapters.invitation.headline}</h1>
        )}
        <p className="section-sub">{copy.chapters.invitation.subhead}</p>
        <p style={{ marginTop: 32, fontSize: 18 }}>
          <a href={`mailto:${copy.footer.contactEmail}`} style={{ color: 'var(--magenta)', fontWeight: 600 }}>
            {copy.footer.contactEmail}
          </a>
        </p>
        <p style={{ marginTop: 12, fontSize: 16, color: 'var(--ink-soft)' }}>
          {lang === 'ar' ? 'النموذج الكامل في المرحلة التالية.' : 'Full form lands in the next phase.'}
        </p>
        <p style={{ marginTop: 48 }}>
          <Link href={`/${lang}`}>{lang === 'ar' ? 'العودة إلى الصفحة الرئيسية' : 'Back to home'}</Link>
        </p>
      </div>
    </main>
  );
}
