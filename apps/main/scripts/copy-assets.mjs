// copy-assets.mjs
// Mirrors the existing repo's frame sequences, showcase photos, and logo SVGs
// into apps/main/public so Next.js can serve them at /frames/, /showcase/, /logo/.
//
// On Windows we copy. On macOS/Linux we'd symlink, but copying is universal and
// the disk cost is acceptable (~30MB total for 605 webp frames).
//
// Idempotent — skips files that already exist with identical mtime.

import { mkdir, copyFile, readdir, stat, access } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = resolve(__dirname, '..');
const REPO_ROOT = resolve(APP_ROOT, '..', '..', '..');

const sources = [
  {
    label: 'frames',
    from: join(REPO_ROOT, 'website-next', 'frames'),
    to: join(APP_ROOT, 'public', 'frames'),
  },
  {
    label: 'showcase',
    from: join(REPO_ROOT, 'website-next', 'showcase'),
    to: join(APP_ROOT, 'public', 'showcase'),
  },
  {
    label: 'logo',
    from: join(REPO_ROOT, 'brand-assets'),
    to: join(APP_ROOT, 'public', 'logo'),
    filter: (name) => name.endsWith('.svg'),
  },
];

async function copyTree(from, to, filter) {
  if (!existsSync(from)) {
    console.warn(`[copy-assets] source missing: ${from}`);
    return { copied: 0, skipped: 0 };
  }
  await mkdir(to, { recursive: true });
  const entries = await readdir(from, { withFileTypes: true });
  let copied = 0;
  let skipped = 0;
  for (const entry of entries) {
    const src = join(from, entry.name);
    const dst = join(to, entry.name);
    if (entry.isDirectory()) {
      const sub = await copyTree(src, dst, filter);
      copied += sub.copied;
      skipped += sub.skipped;
    } else {
      if (filter && !filter(entry.name)) continue;
      try {
        const sStat = await stat(src);
        let dstMtime = 0;
        try {
          await access(dst);
          const dStat = await stat(dst);
          dstMtime = dStat.mtimeMs;
        } catch {
          // missing
        }
        if (dstMtime && dstMtime >= sStat.mtimeMs) {
          skipped++;
          continue;
        }
        await copyFile(src, dst);
        copied++;
      } catch (e) {
        console.warn(`[copy-assets] copy failed ${src}: ${e.message}`);
      }
    }
  }
  return { copied, skipped };
}

(async () => {
  console.log('[copy-assets] mirroring assets into apps/main/public');
  const start = Date.now();
  for (const s of sources) {
    const { copied, skipped } = await copyTree(s.from, s.to, s.filter);
    console.log(`[copy-assets] ${s.label}: copied ${copied}, skipped ${skipped}`);
  }
  console.log(`[copy-assets] done in ${Date.now() - start}ms`);
})();
