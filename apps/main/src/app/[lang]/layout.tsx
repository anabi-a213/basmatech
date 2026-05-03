import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getHome } from '@basmatech/content';

export function generateStaticParams() {
  return [{ lang: 'ar' }, { lang: 'en' }];
}

type LangParam = { lang: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<LangParam>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (lang !== 'ar' && lang !== 'en') return {};
  const copy = getHome(lang);
  return {
    title: copy.meta.title,
    description: copy.meta.description,
    alternates: {
      canonical: `/${lang}`,
      languages: {
        ar: '/ar',
        en: '/en',
      },
    },
    openGraph: {
      title: copy.meta.title,
      description: copy.meta.description,
      type: 'website',
      locale: lang === 'ar' ? 'ar_SA' : 'en_US',
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<LangParam>;
}) {
  const { lang } = await params;
  if (lang !== 'ar' && lang !== 'en') notFound();

  // Inject lang/dir on the <html> tag via inline script — RSC layout can't
  // mutate <html> attributes after the root layout, so we set them here
  // through a small client-side directive.
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  return (
    <>
      {/* Set lang/dir at first paint to avoid LTR flash for Arabic. */}
      <script
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.setAttribute('lang','${lang}');document.documentElement.setAttribute('dir','${dir}');`,
        }}
      />
      {children}
    </>
  );
}
