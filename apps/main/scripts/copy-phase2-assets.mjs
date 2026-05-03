// Mirror Phase 2 assets/projects/ home-* phases into the main app public folder.
import { mkdir, copyFile, readdir, stat, access } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = resolve(__dirname, '..');
const REPO_ROOT = resolve(APP_ROOT, '..', '..');
const SRC = join(REPO_ROOT, 'assets', 'projects');
const DST = join(APP_ROOT, 'public', 'assets', 'projects');

const HOME_PHASES = [
  'home-c1-threshold',
  'home-c2-imprint',
  'home-c3-workshop',
  'home-c4-motion',
  'home-c5-kingdom',
  'home-c6-capabilities',
  'home-c7-proof',
  'home-c8-invitation',
];

async function copyTree(from, to) {
  if (!existsSync(from)) return { copied: 0, skipped: 0 };
  await mkdir(to, { recursive: true });
  const entries = await readdir(from, { withFileTypes: true });
  let copied = 0;
  let skipped = 0;
  for (const entry of entries) {
    const src = join(from, entry.name);
    const dst = join(to, entry.name);
    if (entry.isDirectory()) {
      const sub = await copyTree(src, dst);
      copied += sub.copied;
      skipped += sub.skipped;
    } else {
      try {
        const sStat = await stat(src);
        let dstMtime = 0;
        try { await access(dst); dstMtime = (await stat(dst)).mtimeMs; } catch {}
        if (dstMtime && dstMtime >= sStat.mtimeMs) { skipped++; continue; }
        await copyFile(src, dst);
        copied++;
      } catch (e) {
        console.warn(`[copy-phase2] copy failed ${src}: ${e.message}`);
      }
    }
  }
  return { copied, skipped };
}

(async () => {
  console.log('[copy-phase2] mirroring home assets into apps/main/public/assets/projects');
  const start = Date.now();
  for (const phase of HOME_PHASES) {
    const from = join(SRC, phase);
    const to = join(DST, phase);
    if (!existsSync(from)) continue;
    const { copied, skipped } = await copyTree(from, to);
    console.log(`[copy-phase2] ${phase}: copied ${copied}, skipped ${skipped}`);
  }
  console.log(`[copy-phase2] done in ${Date.now() - start}ms`);
})();
