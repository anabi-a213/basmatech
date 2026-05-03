'use client';

import { motion } from 'framer-motion';
import type { LocaleCopy } from '@basmatech/content';

export type Chapter07Props = {
  lang: 'ar' | 'en';
  copy: LocaleCopy['chapters']['proof'];
};

/**
 * Chapter 07 — Proof.
 *
 * Three full-bleed 100vh sticky scenes, one per case study. Each scene
 * is dark with a single magenta accent strip, year + venue + outcome
 * laid over a generated pastel-field gradient backdrop. No card grid —
 * each case earns its own viewport so visitors actually read it.
 */
export function Chapter07Proof({ lang, copy }: Chapter07Props) {
  return (
    <section id="chapter-07" style={{ background: '#0F1020' }}>
      <div style={{ textAlign: 'center', padding: 'clamp(80px, 12vh, 160px) 24px 80px' }}>
        <p
          className="section-eyebrow"
          style={{ color: 'rgba(245, 245, 248, 0.7)', justifyContent: 'center' }}
        >
          {copy.eyebrow}
        </p>
        {lang === 'ar' ? (
          <h2 className="chapter-headline-ar" style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}>
            {copy.headline}
          </h2>
        ) : (
          <h2 className="chapter-headline-en" style={{ fontSize: 'clamp(32px, 4.5vw, 56px)' }}>
            {copy.headline}
          </h2>
        )}
        <p className="chapter-sub" style={{ maxWidth: 640, margin: '16px auto 0' }}>
          {copy.subhead}
        </p>
      </div>

      {copy.cases.map((c, i) => (
        <CaseScene key={c.title} lang={lang} caseData={c} index={i} total={copy.cases.length} />
      ))}
    </section>
  );
}

function CaseScene({
  lang,
  caseData,
  index,
  total,
}: {
  lang: 'ar' | 'en';
  caseData: { title: string; venue: string; year: string; outcome: string };
  index: number;
  total: number;
}) {
  const palettes = [
    'radial-gradient(ellipse at 30% 30%, rgba(95, 233, 154, 0.25) 0%, transparent 55%), radial-gradient(ellipse at 70% 70%, rgba(255, 90, 158, 0.22) 0%, transparent 55%)',
    'radial-gradient(ellipse at 70% 30%, rgba(95, 169, 240, 0.28) 0%, transparent 55%), radial-gradient(ellipse at 30% 70%, rgba(159, 134, 224, 0.22) 0%, transparent 55%)',
    'radial-gradient(ellipse at 50% 30%, rgba(255, 212, 226, 0.25) 0%, transparent 55%), radial-gradient(ellipse at 50% 80%, rgba(255, 90, 158, 0.25) 0%, transparent 55%)',
  ];
  const bg = palettes[index % palettes.length];

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(64px, 10vh, 120px) clamp(24px, 6vw, 80px)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: bg,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '50%',
          height: 1,
          background: 'linear-gradient(90deg, transparent 0%, rgba(255, 90, 158, 0.6) 50%, transparent 100%)',
          transform: 'translateY(-50%)',
        }}
      />

      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'relative',
          maxWidth: 880,
          textAlign: 'center',
          color: '#F5F5F8',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--magenta)',
            marginBottom: 24,
          }}
        >
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')} · {caseData.year}
        </p>
        <h3
          style={{
            fontFamily: lang === 'ar' ? 'var(--font-ar)' : 'var(--font-display)',
            fontWeight: lang === 'ar' ? 900 : 800,
            fontSize: 'clamp(36px, 5.5vw, 72px)',
            letterSpacing: lang === 'ar' ? 0 : '-0.02em',
            lineHeight: 1.1,
            margin: '0 0 16px',
            textShadow: '0 4px 32px rgba(0, 0, 0, 0.5)',
          }}
        >
          {caseData.title}
        </h3>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 14,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(245, 245, 248, 0.65)',
            margin: '0 0 32px',
          }}
        >
          {caseData.venue}
        </p>
        <p
          style={{
            fontFamily: lang === 'ar' ? 'var(--font-ar)' : 'var(--font-editorial)',
            fontStyle: lang === 'ar' ? 'normal' : 'italic',
            fontWeight: lang === 'ar' ? 700 : 400,
            fontSize: 'clamp(20px, 2vw, 28px)',
            lineHeight: 1.5,
            color: 'rgba(245, 245, 248, 0.95)',
            maxWidth: 640,
            margin: '0 auto',
          }}
        >
          {caseData.outcome}
        </p>
      </motion.article>
    </section>
  );
}
