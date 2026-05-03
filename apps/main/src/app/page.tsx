import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

// Root: pick AR or EN based on Accept-Language. Arabic-first when ambiguous.
export default async function RootPage() {
  const h = await headers();
  const accept = h.get('accept-language') ?? '';
  // Prefer English ONLY if user explicitly asks for it AND not Arabic
  const wantsEN = /\ben\b/i.test(accept) && !/\bar\b/i.test(accept);
  redirect(wantsEN ? '/en' : '/ar');
}
