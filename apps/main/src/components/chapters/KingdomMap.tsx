'use client';

import { motion } from 'framer-motion';

/**
 * Saudi map with 6 city beacons connected by magenta lines.
 * Pure SVG, no external assets. Cities pulse on a stagger.
 *
 * Coordinates are normalized in a 100x100 viewBox approximating the Saudi peninsula.
 * Not a precise GIS rendering — a stylized brand-tonal map.
 */
const CITIES = [
  { id: 'riyadh', label: 'Riyadh', labelAr: 'الرياض', x: 56, y: 49 },
  { id: 'jeddah', label: 'Jeddah', labelAr: 'جدة', x: 26, y: 55 },
  { id: 'neom', label: 'NEOM', labelAr: 'نيوم', x: 18, y: 22 },
  { id: 'alula', label: 'AlUla', labelAr: 'العلا', x: 26, y: 35 },
  { id: 'redsea', label: 'Red Sea', labelAr: 'البحر الأحمر', x: 30, y: 46 },
  { id: 'dammam', label: 'Dammam', labelAr: 'الدمام', x: 78, y: 38 },
];

const CONNECTIONS: [string, string][] = [
  ['riyadh', 'jeddah'],
  ['riyadh', 'dammam'],
  ['riyadh', 'alula'],
  ['jeddah', 'redsea'],
  ['alula', 'neom'],
  ['neom', 'redsea'],
];

// Approximated peninsula path for SVG fill
const PENINSULA_PATH =
  'M 14 15 L 24 12 L 35 16 L 42 22 L 56 24 L 64 27 L 74 28 L 80 32 L 86 38 L 88 46 L 86 54 L 82 60 L 75 65 L 65 70 L 56 76 L 50 80 L 42 84 L 33 80 L 26 72 L 22 64 L 19 55 L 16 46 L 14 35 L 13 25 Z';

export function KingdomMap({ lang }: { lang: 'ar' | 'en' }) {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 980,
        margin: '0 auto',
        padding: '40px clamp(20px, 5vw, 60px)',
        position: 'relative',
      }}
    >
      <svg
        viewBox="0 0 100 100"
        style={{
          width: '100%',
          height: 'auto',
          aspectRatio: '1 / 1',
          maxHeight: '70vh',
        }}
      >
        <defs>
          <linearGradient id="peninsula" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(95, 169, 240, 0.18)" />
            <stop offset="50%" stopColor="rgba(212, 204, 234, 0.20)" />
            <stop offset="100%" stopColor="rgba(255, 90, 158, 0.16)" />
          </linearGradient>
          <radialGradient id="cityGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="rgba(255, 90, 158, 0.9)" />
            <stop offset="40%" stopColor="rgba(255, 90, 158, 0.4)" />
            <stop offset="100%" stopColor="rgba(255, 90, 158, 0)" />
          </radialGradient>
        </defs>

        <path d={PENINSULA_PATH} fill="url(#peninsula)" stroke="rgba(255, 255, 255, 0.18)" strokeWidth="0.18" vectorEffect="non-scaling-stroke" />

        {CONNECTIONS.map(([from, to], i) => {
          const a = CITIES.find((c) => c.id === from)!;
          const b = CITIES.find((c) => c.id === to)!;
          return (
            <motion.line
              key={`${from}-${to}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="#C73D7E"
              strokeWidth="0.25"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.7 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.4, delay: 0.4 + i * 0.18, ease: [0.22, 1, 0.36, 1] }}
            />
          );
        })}

        {CITIES.map((c, i) => (
          <g key={c.id}>
            <motion.circle
              cx={c.x}
              cy={c.y}
              r={2.4}
              fill="url(#cityGlow)"
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.12 }}
              style={{ transformOrigin: `${c.x}px ${c.y}px` }}
            />
            <motion.circle
              cx={c.x}
              cy={c.y}
              r={0.8}
              fill="#FF5A9E"
              initial={{ scale: 0 }}
              whileInView={{ scale: [0, 1.4, 1] }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, delay: 0.3 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: `${c.x}px ${c.y}px` }}
            />
            <text
              x={c.x}
              y={c.y - 3.4}
              textAnchor="middle"
              fill="rgba(245, 245, 248, 0.85)"
              fontSize={lang === 'ar' ? 2.6 : 2.2}
              fontFamily={lang === 'ar' ? 'var(--font-ar)' : 'var(--font-mono)'}
              style={{ letterSpacing: lang === 'ar' ? 0 : '0.05em' }}
            >
              {lang === 'ar' ? c.labelAr : c.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
