/**
 * voiceLint — fail-on-violation linter for the bilingual copy modules.
 *
 * Rules per BRIEF.md and the Phase 1 plan prompt:
 *   EN banned (case-insensitive whole-word):
 *     synergy, leverage, cutting-edge
 *   AR banned (substring):
 *     ابتكار, رؤية مستقبلية
 *   No em-dash anywhere.
 *
 * Run: pnpm tsx pipeline/scripts/voiceLint.ts
 * Exit 0 on pass. Non-zero on any violation.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(__dirname, '..', '..', 'packages', 'content', 'src');
const FILES_RE = /^(copy\.home|copy\.portfolio)\.ts$/;

const EN_BANNED_WORDS = ['synergy', 'leverage', 'cutting-edge'];
const AR_BANNED = ['ابتكار', 'رؤية مستقبلية'];
const EM_DASH = '—';

interface Violation {
  file: string;
  line: number;
  col: number;
  rule: string;
  excerpt: string;
}

function* walk(dir: string): Generator<string> {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) yield* walk(p);
    else if (FILES_RE.test(entry)) yield p;
  }
}

function lint(file: string): Violation[] {
  const text = readFileSync(file, 'utf8');
  const out: Violation[] = [];
  const lines = text.split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // em-dash
    let idx = line.indexOf(EM_DASH);
    while (idx !== -1) {
      out.push({ file, line: i + 1, col: idx + 1, rule: 'em-dash', excerpt: trim(line, idx) });
      idx = line.indexOf(EM_DASH, idx + 1);
    }
    // EN banned (whole-word, case-insensitive)
    for (const word of EN_BANNED_WORDS) {
      const re = new RegExp(`\\b${word.replace(/[-]/g, '\\-')}\\b`, 'gi');
      let m: RegExpExecArray | null;
      while ((m = re.exec(line)) !== null) {
        out.push({ file, line: i + 1, col: m.index + 1, rule: `EN banned: ${word}`, excerpt: trim(line, m.index) });
      }
    }
    // AR banned (substring)
    for (const phrase of AR_BANNED) {
      let j = line.indexOf(phrase);
      while (j !== -1) {
        out.push({ file, line: i + 1, col: j + 1, rule: `AR banned: ${phrase}`, excerpt: trim(line, j) });
        j = line.indexOf(phrase, j + 1);
      }
    }
  }
  return out;
}

function trim(line: string, idx: number): string {
  const start = Math.max(0, idx - 30);
  const end = Math.min(line.length, idx + 30);
  return (start > 0 ? '…' : '') + line.slice(start, end) + (end < line.length ? '…' : '');
}

function main(): void {
  const violations: Violation[] = [];
  for (const file of walk(ROOT)) {
    violations.push(...lint(file));
  }

  if (violations.length === 0) {
    console.log('voiceLint: PASS. No violations.');
    process.exit(0);
  }

  console.error(`voiceLint: FAIL. ${violations.length} violation(s):`);
  for (const v of violations) {
    console.error(`  ${v.file}:${v.line}:${v.col}  [${v.rule}]  ${v.excerpt}`);
  }
  process.exit(1);
}

main();
