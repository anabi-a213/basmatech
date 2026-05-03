import { notFound } from 'next/navigation';
import { getHome } from '@basmatech/content';
import { Cinematic } from '@/components/Cinematic';

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (lang !== 'ar' && lang !== 'en') notFound();
  const copy = getHome(lang);
  return <Cinematic lang={lang} copy={copy} />;
}
