// Mirrors corridor frames + corridor.mp4 + room photos + brand logos into apps/portfolio/public.
// Source-of-truth lives in repo root (`website-next/frames/corridor/`,
// `brand-imagery/generated/sequences/videos/corridor.mp4`,
// `brand-imagery/generated/contrast/`, `brand-assets/`).
import { mkdir, copyFile, readdir, stat, access } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = resolve(__dirname, '..');
const REPO_ROOT = resolve(APP_ROOT, '..', '..', '..');

const sources = [
  {
    label: 'corridor-frames',
    from: join(REPO_ROOT, 'website-next', 'frames', 'corridor'),
    to: join(APP_ROOT, 'public', 'frames', 'corridor'),
  },
  {
    label: 'corridor-mp4',
    from: join(REPO_ROOT, 'brand-imagery', 'generated', 'sequences', 'videos'),
    to: join(APP_ROOT, 'public', 'corridor'),
    filter: (name) => name === 'corridor.mp4',
  },
  {
    label: 'room-photos',
    from: join(REPO_ROOT, 'brand-imagery', 'generated', 'contrast'),
    to: join(APP_ROOT, 'public', 'rooms'),
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
  console.log('[copy-assets] mirroring portfolio assets into apps/portfolio/public');
  const start = Date.now();
  for (const s of sources) {
    const { copied, skipped } = await copyTree(s.from, s.to, s.filter);
    console.log(`[copy-assets] ${s.label}: copied ${copied}, skipped ${skipped}`);
  }
  console.log(`[copy-assets] done in ${Date.now() - start}ms`);
})();
