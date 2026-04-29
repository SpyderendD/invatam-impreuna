// layout.tsx
import { Inter, Lora } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Providers } from '@/components/Providers';
import CustomCursor from '@/components/animations/CustomCursor';
import { GoogleAnalytics } from '@next/third-parties/google';

// =======================================================================
// REZOLVARE ERORI TYPESCRIPT: Ignorăm verificarea strictă pentru CSS
// =======================================================================
// @ts-ignore
import './globals.css';
// @ts-ignore
import 'katex/dist/katex.min.css';

// =======================================================================
// 1. OPTIMIZARE FONTURI
// Folosim 'swap' pentru a afișa textul imediat, chiar dacă fontul se încarcă
// =======================================================================
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-lora',
  display: 'swap',
});

// =======================================================================
// 2. METADATE SEO COMPLETE
// =======================================================================
export const metadata: Metadata = {
  metadataBase: new URL('https://invatam-impreuna.vercel.app'),

  title: {
    default: 'Învățăm Împreună | Platformă Educațională Interactivă',
    template: '%s | Învățăm Împreună',
  },

  description: 'Platformă educațională online gratuită pentru pregătire la Evaluarea Națională, Bacalaureat și alte materii. Lecții interactive, teste grilă, flashcarduri și resurse AI.',

  keywords: [
    'educatie', 'invatam impreuna', 'bacalaureat', 'evaluare nationala', 'teste', 'lectii online', 'matematica', 'romana', 'ai educatie',
    'educatie online', 'evaluare nationala', 'bacalaureat', 'lectii video',
    'teste online', 'mate', 'romana', 'informatica', 'chimie', 'fizica',
    'invatam impreuna', 'platforma elevi', 'pregatire examene', 'resurse scolare',
    'invatare interactiva', 'flashcarduri', 'timer studiu', 'progres monitorizat', 'lectii interactive',
    'bacalaureat', 'evaluare nationala', 'elevi', 'pregatire examene', 'resurse scolare',
    'mate', 'romana', 'informatica', 'chimie', 'fizica', 'invatam impreuna',
    'platforma educatie', 'teste gratuite', 'lectii video', 'invatare online',
    'Spyderend', 'Mera Alin David', 'Romania', 'scoala', 'educatie gratuita', 'romania', 'elevi', 'studenti', 'profesori', 'parinti', 'resurse educative',
    'platforma online', 'Romania', 'educatie', 'invatam impreuna', 'blog invatare', 'mera alin', 'spyderend', 'invatam impreuna echipa', 'echipa invatam impreuna', 'contact invatam impreuna', 'despre noi invatam impreuna',
    'invatam impreuna contact', 'invatam impreuna despre noi', 'invatam impreuna blog', 'invatam impreuna echipa', 'invatam impreuna spyderend', 'invatam impreuna mera alin',
    'invatam impreuna romania', 'invatam impreuna scoala', 'invatam impreuna educatie gratuita', 'invatam impreuna elevi', 'invatam impreuna studenti', 'invatam impreuna profesori', 'invatam impreuna parinti', 'invatam impreuna resurse educative', 
    'scoala online', 'invatam pentru evaluare nationala', 'invatam pentru bacalaureat', 'invatam pentru examene', 'invatam pentru scoala', 'invatam pentru elevi', 'invatam pentru studenti', 'invatam pentru profesori', 'invatam pentru parinti', 'invatam pentru resurse educative',
    'invatam impreuna scoala online', 'invatam impreuna pentru evaluare nationala', 'invatam impreuna pentru bacalaureat', 'invatam impreuna pentru examene', 'invatam impreuna pentru scoala', 'invatam impreuna pentru elevi', 'invatam impreuna pentru studenti', 'invatam impreuna pentru profesori', 'invatam impreuna pentru parinti', 'invatam impreuna pentru resurse educative',
    'cum pot sa ma pregatesc pentru evaluare nationala', 'cum pot sa ma pregatesc pentru bacalaureat', 'cum pot sa ma pregatesc pentru examene', 'cum pot sa ma pregatesc pentru scoala', 'cum pot sa ma pregatesc pentru elevi', 'cum pot sa ma pregatesc pentru studenti', 'cum pot sa ma pregatesc pentru profesori', 'cum pot sa ma pregatesc pentru parinti', 'cum pot sa ma pregatesc pentru resurse educative',
    'cum pot sa ma pregatesc pentru evaluare nationala cu invatam impreuna', 'cum pot sa ma pregatesc pentru bacalaureat cu invatam impreuna', 'cum pot sa ma pregatesc pentru examene cu invatam impreuna', 'cum pot sa ma pregatesc pentru scoala cu invatam impreuna', 'cum pot sa ma pregatesc pentru elevi cu invatam impreuna', 'cum pot sa ma pregatesc pentru studenti cu invatam impreuna', 'cum pot sa ma pregatesc pentru profesori cu invatam impreuna', 'cum pot sa ma pregatesc pentru parinti cu invatam impreuna', 'cum pot sa ma pregatesc pentru resurse educative cu invatam impreuna',
  ],

  authors: [{ name: 'Echipa Învățăm Împreună' }],
  creator: 'Învățăm Împreună',
  publisher: 'Învățăm Împreună',

  manifest: '/manifest.json',

  icons: {
    icon: '/images/favicon.ico',
    shortcut: '/images/favicon.ico',
    apple: '/images/icon-192x192.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/images/icon-192x192.png',
    },
  },

  openGraph: {
    type: 'website',
    locale: 'ro_RO',
    url: 'https://invatam-impreuna.vercel.app',
    title: 'Învățăm Împreună - Viitorul Educației Tale',
    description: 'Accesează resurse educaționale moderne, teste interactive și unelte AI pentru un studiu eficient.',
    siteName: 'Învățăm Împreună',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Învățăm Împreună Preview',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Învățăm Împreună',
    description: 'Platformă educațională completă pentru elevi.',
    images: ['/images/og-image.png'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'sOjUUt5BdjJ2F4A64Tw9HkCX8kxANp8fKncbXCoXnvA',
  },
};

// =======================================================================
// 3. CONFIGURARE VIEWPORT (MOBILE)
// =======================================================================
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0F172A' },
  ],
};

// =======================================================================
// 4. COMPONENTA PRINCIPALĂ
// =======================================================================
export default function RootLayout({ children }: { children: React.ReactNode }) {

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Învățăm Împreună',
    url: 'https://invatam-impreuna.vercel.app',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://invatam-impreuna.vercel.app/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <html
      lang="ro"
      suppressHydrationWarning
      className={`${inter.variable} ${lora.variable}`}
    >
      <head>
        <meta name="google-site-verification" content="sOjUUt5BdjJ2F4A64Tw9HkCX8kxANp8fKncbXCoXnvA" />
        
        <Script
          id="json-ld-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          strategy="worker"
        />

        {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem('theme');var e=window.matchMedia('(prefers-color-scheme: dark)').matches;var d=document.documentElement;d.classList.add(t==='dark'||(!t&&e)?'dark':'light');d.classList.remove(t==='dark'||(!t&&e)?'light':'dark');}catch(t){}})()`}
        </Script>

        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8380681272847895"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>

      <body className="antialiased selection:bg-primary/30 selection:text-foreground">
        <Providers>
          <CustomCursor />
          {children}
        </Providers>
        <SpeedInsights />
        <GoogleAnalytics gaId="G-4T2MY0SSCB" />
      </body>
    </html>
  );
}