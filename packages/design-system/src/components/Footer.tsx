'use client';

import Link from 'next/link';
import { LiquidMark } from './LiquidMark';

export type FooterProps = {
  lang: 'ar' | 'en';
  /** Six rows of strings: brand line, address, contact, copyright, etc. */
  lines: {
    brandLabel: string;
    legalEntity: string;
    address: string;
    contactLabel: string;
    contactEmail: string;
    contactPhone?: string;
    parentLabel: string;
    parentName: string;
    copyright: string;
    legal: { href: string; label: string }[];
  };
};

export function Footer({ lang, lines }: FooterProps) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  return (
    <footer
      dir={dir}
      style={{
        background: 'var(--canvas-deep)',
        color: 'var(--ink)',
        padding: '64px clamp(20px, 5vw, 60px) 32px',
        marginTop: 0,
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 32,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <LiquidMark size={48} animate={false} />
            <span
              style={{
                fontFamily: lang === 'ar' ? 'var(--font-ar)' : 'var(--font-display)',
                fontWeight: lang === 'ar' ? 900 : 800,
                fontSize: 22,
              }}
            >
              {lines.brandLabel}
            </span>
          </div>
          <p
            style={{
              color: 'var(--ink-soft)',
              fontSize: 13,
              maxWidth: 280,
              lineHeight: 1.6,
            }}
          >
            {lines.legalEntity}
          </p>
        </div>

        <div>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--ink-mute)',
              marginBottom: 12,
            }}
          >
            {lang === 'ar' ? 'الاستوديو' : 'Studio'}
          </p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.7 }}>
            {lines.address}
          </p>
        </div>

        <div>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--ink-mute)',
              marginBottom: 12,
            }}
          >
            {lines.contactLabel}
          </p>
          <a
            href={`mailto:${lines.contactEmail}`}
            style={{ color: 'var(--ink)', fontSize: 14, display: 'block', marginBottom: 4 }}
          >
            {lines.contactEmail}
          </a>
          {lines.contactPhone && (
            <a href={`tel:${lines.contactPhone.replace(/\s+/g, '')}`} style={{ color: 'var(--ink-soft)', fontSize: 14 }}>
              {lines.contactPhone}
            </a>
          )}
        </div>

        <div>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--ink-mute)',
              marginBottom: 12,
            }}
          >
            {lines.parentLabel}
          </p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14 }}>{lines.parentName}</p>
        </div>
      </div>

      <div
        style={{
          maxWidth: 1280,
          margin: '48px auto 0',
          paddingTop: 24,
          borderTop: '1px solid var(--border-soft)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 24,
          flexWrap: 'wrap',
          fontSize: 12,
          color: 'var(--ink-mute)',
        }}
      >
        <p>{lines.copyright}</p>
        <ul style={{ display: 'flex', gap: 20, listStyle: 'none', margin: 0, padding: 0 }}>
          {lines.legal.map((l) => (
            <li key={l.href}>
              <Link href={l.href} style={{ color: 'var(--ink-soft)' }}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
