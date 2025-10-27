// app/layout.tsx
import './globals.css';
import { Inter, Lora } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Providers } from '@/components/Providers';

// =======================================================================
// 1. FONTURI
// Definim fonturile care vor fi folosite în aplicație.
// =======================================================================
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const lora = Lora({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-lora' });

// =======================================================================
// 2. METADATE (SEO)
// Aceste informații sunt esențiale pentru motoarele de căutare (Google).
// Codul tău de aici este excelent.
// =======================================================================
export const metadata: Metadata = {
  // ADAUGAT: Această linie este esențială pentru a activa PWA.
  // Îi spune browserului unde să găsească fișierul de configurare al aplicației.
  manifest: '/manifest.json',

  metadataBase: new URL('https://invatam-impreuna.vercel.app'),
  title: {
    default: 'Învățăm Împreună | Platformă Educațională',
    template: '%s | Învățăm Împreună',
  },
  description: 'Platformă educațională online pentru pregătire la Evaluarea Națională, Bacalaureat și alte materii. Lecții interactive, teste și resurse.',
  // Poți adăuga înapoi restul metadatelor tale (keywords, openGraph, etc.) aici.
  // Le-am scos pentru a păstra codul mai scurt, dar structura ta era corectă.

  // ADAUGAT (Opțional, dar Recomandat): Acesta specifică iconița care va fi
  // folosită când un utilizator adaugă aplicația pe ecranul de pornire pe iOS.
  icons: {
    apple: '/icon-192x192.png',
  },
};

// =======================================================================
// 3. VIEWPORT
// Controlează cum se afișează site-ul pe dispozitive mobile.
// =======================================================================
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
};

// =======================================================================
// 4. COMPONENTA ROOT LAYOUT
// Acesta este "șablonul" principal pentru TOATE paginile din site.
// =======================================================================
export default function RootLayout({ children }: { children: React.ReactNode }) {

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Învățăm Împreună',
    url: 'https://invatam-impreuna.vercel.app',
  };

  return (
    <html
      lang="ro"
      // `suppressHydrationWarning` este necesar pentru a preveni o eroare
      // cauzată de scriptul care schimbă tema (dark/light).
      suppressHydrationWarning
      className={`${inter.variable} ${lora.variable}`}
    >
      {/* 
        Plasăm scripturile necesare în interiorul tag-ului <head>.
        Aceasta este soluția care rezolvă eroarea de hidratare pe care o primeai.
      */}
      <head>
        <Script
          id="json-ld-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {/* Script pentru a preveni "clipirea" temei la încărcarea paginii. */}
        {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem('theme');var e=window.matchMedia('(prefers-color-scheme: dark)').matches;var d=document.documentElement;d.classList.add(t==='dark'||(!t&&e)?'dark':'light');d.classList.remove(t==='dark'||(!t&&e)?'light':'dark');}catch(t){}})()`}
        </Script>
      </head>
      
      <body>
        {/* Componenta <Providers> învelește totul și oferă contextele
            de Autentificare și Temă pentru întreaga aplicație. */}
        <Providers>
          {children}
        </Providers>
        
        <SpeedInsights />
      </body>
    </html>
  );
}