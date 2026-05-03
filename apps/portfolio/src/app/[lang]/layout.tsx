import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPortfolio } from '@basmatech/content';

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
  const copy = getPortfolio(lang);
  return {
    title: copy.meta.title,
    description: copy.meta.description,
    alternates: {
      canonical: `/${lang}`,
      languages: { ar: '/ar', en: '/en' },
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

  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  return (
    <>
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
