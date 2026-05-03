/**
 * genKeyframes — Phase 2b. Generates ALL nano-banana keyframes for the
 * approved prompt set in pipeline/prompts.preview.md.
 *
 * For every project:
 *   1. Hero foundation frame (no reference image — first generation seeds
 *      the project's identity).
 *   2. Walk-start frame (passes hero as reference; "same scene, ONLY
 *      change: remove the installation").
 *   3. Walk-end frame (passes hero as reference; equals hero or near-hero,
 *      depending on project).
 * For every cross-project bridge:
 *   - Bridge frame referencing both adjacent project heroes.
 *
 * Output: pipeline/keyframes/{phaseId}/{hero|start|end|bridge}.jpg
 * Plus per-project contact-sheet PDF at pipeline/keyframes/contact-sheets/.
 *
 * Phase 1: SCAFFOLD ONLY. The actual nano-banana calls are wired via the
 * MCP tool when Phase 2 runs. This script reads pipeline/prompts.preview.md,
 * validates structure, and prints what it would generate. Used as a dry
 * run today.
 *
 * Run: pnpm tsx pipeline/scripts/genKeyframes.ts [--dry-run]
 */

import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(__dirname, '..', '..');
const PROMPTS_FILE = join(ROOT, 'pipeline', 'prompts.preview.md');
const OUT_ROOT = join(ROOT, 'pipeline', 'keyframes');

interface PromptEntry {
  phaseId: string;
  kind: 'hero' | 'start' | 'end' | 'bridge';
  prompt: string;
  refImagePaths: string[];
}

function parsePromptsMd(text: string): PromptEntry[] {
  // Markdown sections shaped as:
  //   ## phaseId / kind
  //   ref: path1, path2  (optional)
  //   <prompt body...>
  //   ---
  const entries: PromptEntry[] = [];
  const blocks = text.split(/^---\s*$/m);
  for (const block of blocks) {
    const m = block.match(/^##\s+(\S+)\s*\/\s*(hero|start|end|bridge)\s*$/m);
    if (!m) continue;
    const phaseId = m[1];
    const kind = m[2] as PromptEntry['kind'];
    const refMatch = block.match(/^ref:\s*(.+)$/m);
    const refImagePaths = refMatch ? refMatch[1].split(',').map((s) => s.trim()) : [];
    const promptStart = block.indexOf(m[0]) + m[0].length;
    const promptBody = block.slice(promptStart).replace(/^ref:.*$/m, '').trim();
    entries.push({ phaseId, kind, prompt: promptBody, refImagePaths });
  }
  return entries;
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');

  if (!existsSync(PROMPTS_FILE)) {
    console.error(`genKeyframes: missing ${PROMPTS_FILE}. Phase 2a writes this.`);
    process.exit(2);
  }

  const text = readFileSync(PROMPTS_FILE, 'utf8');
  const entries = parsePromptsMd(text);
  if (entries.length === 0) {
    console.error('genKeyframes: no entries found in prompts.preview.md');
    process.exit(2);
  }

  console.log(`genKeyframes: parsed ${entries.length} entries.`);
  for (const e of entries) {
    const outDir = join(OUT_ROOT, e.phaseId);
    if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
    const outFile = join(outDir, `${e.kind}.jpg`);
    if (dryRun) {
      console.log(`  WOULD GENERATE  ${e.phaseId}/${e.kind}.jpg`);
      console.log(`    prompt: ${e.prompt.slice(0, 100)}...`);
      if (e.refImagePaths.length) console.log(`    refs:   ${e.refImagePaths.join(', ')}`);
    } else {
      console.log(`  call_nano_banana phaseId=${e.phaseId} kind=${e.kind} -> ${outFile}`);
      // Phase 2 wires the actual mcp__nano-banana__generate_image call here.
      // The MCP tool is invoked by the orchestrating Claude, not this Node
      // script — keep this stub as a manifest writer.
    }
  }

  console.log('genKeyframes: done.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
