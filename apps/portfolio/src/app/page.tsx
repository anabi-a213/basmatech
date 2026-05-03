import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function RootPage() {
  const h = await headers();
  const accept = h.get('accept-language') ?? '';
  const wantsEN = /\ben\b/i.test(accept) && !/\bar\b/i.test(accept);
  redirect(wantsEN ? '/en' : '/ar');
}
