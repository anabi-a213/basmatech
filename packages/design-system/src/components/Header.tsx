'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LiquidMark } from './LiquidMark';

export type HeaderProps = {
  /** current language */
  lang: 'ar' | 'en';
  /** href that toggles language (e.g. /en if currently ar) */
  toggleHref: string;
  /** label of the toggle button (e.g. 'EN' or 'AR') */
  toggleLabel: string;
  /** brand wordmark text */
  brandLabel: string;
  /** optional secondary nav items */
  nav?: { href: string; label: string }[];
};

export function Header({ lang, toggleHref, toggleLabel, brandLabel, nav = [] }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px clamp(20px, 4vw, 40px)',
        background: scrolled
          ? 'linear-gradient(180deg, rgba(245,245,248,0.92) 0%, rgba(245,245,248,0.0) 100%)'
          : 'linear-gradient(180deg, rgba(245,245,248,0.6) 0%, rgba(245,245,248,0.0) 100%)',
        backdropFilter: scrolled ? 'blur(12px)' : 'blur(6px)',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'blur(6px)',
        pointerEvents: 'none',
        transition: 'background 300ms var(--ease-out), backdrop-filter 300ms var(--ease-out)',
      }}
    >
      <Link
        href={`/${lang}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          pointerEvents: 'auto',
        }}
        aria-label={brandLabel}
      >
        <LiquidMark size={36} />
        <span
          style={{
            fontFamily: lang === 'ar' ? 'var(--font-ar)' : 'var(--font-display)',
            fontWeight: lang === 'ar' ? 900 : 800,
            fontSize: 18,
            letterSpacing: lang === 'ar' ? 0 : '-0.01em',
            color: 'var(--ink)',
          }}
        >
          {brandLabel}
        </span>
      </Link>

      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          pointerEvents: 'auto',
        }}
      >
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--ink-soft)',
              transition: 'color var(--dur-short) var(--ease-out)',
            }}
          >
            {item.label}
          </Link>
        ))}
        <Link
          href={toggleHref}
          aria-label={`Switch to ${toggleLabel === 'EN' ? 'English' : 'Arabic'}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '6px 14px',
            borderRadius: 'var(--radius-pill)',
            background: 'rgba(245,245,248,0.7)',
            border: '1px solid var(--border-soft)',
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--ink-soft)',
            transition: 'all var(--dur-short) var(--ease-out)',
          }}
        >
          {toggleLabel}
        </Link>
      </nav>
    </header>
  );
}
