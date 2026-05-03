import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Cairo, Manrope, Fraunces, JetBrains_Mono } from 'next/font/google';
import '../styles/globals.css';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-display-loaded',
  display: 'swap',
});

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700', '900'],
  variable: '--font-ar-loaded',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body-loaded',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['italic', 'normal'],
  variable: '--font-editorial-loaded',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono-loaded',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://work.basmatech.sa'),
  title: {
    default: 'Basma Tech — Walk-through',
    template: '%s · Basma Tech',
  },
  description: 'Six rooms. Six capabilities. Each room holds an installation that lives in a real Saudi venue.',
};

export const viewport: Viewport = {
  themeColor: '#F5F5F8',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      className={`${bricolage.variable} ${cairo.variable} ${manrope.variable} ${fraunces.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}
