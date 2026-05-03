/**
 * runKling — Phase 2c. Submits all approved keyframe pairs as Kling 2.1
 * Master image-to-video jobs via Fal.ai's queue.
 *
 * - Endpoint: fal-ai/kling-video/v2.1/master/image-to-video
 *   Fallback if v2.1/master rejects tail_image_url at runtime:
 *   fal-ai/kling-video/o1/image-to-video (purpose-built first-last-frame mode).
 * - Per job: duration "5", aspect_ratio "16:9", cfg_scale 0.5, negative
 *   prompt = pipeline/prompts/negative.txt verbatim.
 * - Max 4 parallel. Webhook callback per job (configured at fal.ai/dashboard).
 * - Hard $60 spend cap. Estimator runs first; aborts if total estimate
 *   exceeds the cap.
 * - Failure: 504 / runner crash / QA flag > 2 frames out of 121 = retry
 *   with seed bumped by +1, max 3 retries, then escalate to human.
 *
 * Phase 1 SCAFFOLD: this file is the orchestration plan. It reads the
 * keyframe manifest and prints the job plan with cost estimate. The
 * actual Fal.ai submission code is wired in Phase 2, gated behind the
 * BUDGET-GATE check the human approves at GATE 2b.
 *
 * Run: pnpm tsx pipeline/scripts/runKling.ts [--estimate-only]
 */

import { existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(__dirname, '..', '..');
const KEYFRAMES_ROOT = join(ROOT, 'pipeline', 'keyframes');
const JOBS_FILE = join(ROOT, 'pipeline', 'jobs.jsonl');
const HARD_BUDGET_USD = 60;
const COST_PER_VIDEO = 1.4; // observed average for v2.1/master via Fal.ai

function listProjects(): string[] {
  if (!existsSync(KEYFRAMES_ROOT)) return [];
  return readdirSync(KEYFRAMES_ROOT)
    .filter((entry) => entry !== 'contact-sheets')
    .filter((entry) => {
      const stat = require('node:fs').statSync(join(KEYFRAMES_ROOT, entry));
      return stat.isDirectory();
    });
}

function planJobs(): Array<{ phaseId: string; kind: 'walk' | 'bridge'; estimateUsd: number }> {
  const projects = listProjects();
  const out: Array<{ phaseId: string; kind: 'walk' | 'bridge'; estimateUsd: number }> = [];
  for (const p of projects) {
    if (p.startsWith('bridge-')) {
      out.push({ phaseId: p, kind: 'bridge', estimateUsd: COST_PER_VIDEO });
    } else {
      out.push({ phaseId: p, kind: 'walk', estimateUsd: COST_PER_VIDEO });
    }
  }
  return out;
}

async function main() {
  const estimateOnly = process.argv.includes('--estimate-only');
  const jobs = planJobs();
  if (jobs.length === 0) {
    console.error(`runKling: no projects found under ${KEYFRAMES_ROOT}.`);
    console.error('  Phase 2b must run genKeyframes.ts first and produce keyframes.');
    process.exit(2);
  }

  const totalUsd = jobs.reduce((s, j) => s + j.estimateUsd, 0);
  console.log(`runKling: planning ${jobs.length} jobs at ~$${COST_PER_VIDEO.toFixed(2)} each.`);
  console.log(`  Estimate: $${totalUsd.toFixed(2)}`);
  console.log(`  Hard cap: $${HARD_BUDGET_USD.toFixed(2)}`);

  if (totalUsd > HARD_BUDGET_USD) {
    console.error(`runKling: ABORT. Estimate $${totalUsd.toFixed(2)} exceeds $60 cap.`);
    console.error('  Reduce job count or split into multiple human-approved batches.');
    process.exit(3);
  }

  if (estimateOnly) {
    console.log('runKling: estimate-only mode. Exiting before submission.');
    process.exit(0);
  }

  // Phase 2 wires the actual Fal.ai submission via @fal-ai/client.
  // The implementing Claude will call fal.queue.submit per job, log the
  // request_id to JOBS_FILE (jobs.jsonl), and poll status until READY.
  console.log(`runKling: submission step not yet wired. Phase 1 scaffold only.`);
  console.log(`  Next step: implement fal.queue.submit + webhook handler`);
  console.log(`  Output ledger: ${JOBS_FILE}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
