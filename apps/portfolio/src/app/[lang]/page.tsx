import { notFound } from 'next/navigation';
import { getTour } from '@basmatech/content';
import { Tour } from '@/components/tour/Tour';

export default async function TourPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (lang !== 'ar' && lang !== 'en') notFound();
  const copy = getTour(lang);
  return <Tour lang={lang} copy={copy} />;
}
