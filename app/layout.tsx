// app/layout.tsx
import './globals.css';
import { Inter, Lora } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Providers } from '@/components/Providers';
import { ThemeProvider as AppThemeProvider } from '@/context/ThemeContext';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const lora = Lora({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-lora' });

// =======================================================================
// 1. METADATE SEO AVANSATE
// =======================================================================
export const metadata: Metadata = {

  metadataBase: new URL('https://invatam-impreuna.vercel.app'),
  // Link către manifest-ul PWA
  manifest: '/images/site.webmanifest',

  title: {
    default: 'Învățăm Împreună | Platformă Educațională',
    template: '%s | Învățăm Împreună',
  },
  description: 'Platformă educațională online pentru pregătire la Evaluarea Națională, Bacalaureat și alte materii. Lecții interactive, teste și resurse pentru Limba Română, Matematică, Informatică și multe altele.',
  keywords: ['pregatire evaluare nationala', 'invatam impreuna', 'platforma educationala', 'lectii online', 'teste matematica', 'subiecte romana', 'meditatii online', 'informatica', 'chimie', 'fizica', 'elevi', 'scoala online', 'evaluare nationala', 'resurse educationale', 'examen', 'profesori', 'educatie', 'platforma invatare', 'lectii interactive', 'teste online', 'suport elevi', 'materii scolare', 'pregatire examene', 'invatamant digital', 'educatie online', 'platforma pentru elevi', 'invatam impreuna platforma', 'educatie romania', 'pregatire examen', 'lectii romana', 'teste matematica online', 'resurse invatare', 'meditatii matematica', 'informatica pentru elevi', 'chimie online', 'fizica pentru gimnaziu', 'platforma educatie digitala'],

  creator: 'Mera Alin David ( Spyderend )',
  publisher: 'Mera Alin David ( Spyderend )',

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

  openGraph: {
    title: 'Învățăm Împreună | Platformă Educațională',
    description: 'Pregătire completă pentru examenele naționale și aprofundarea materiilor școlare. Lecții, teste și suport, toate într-un singur loc.',
    url: 'https://invatam-impreuna.vercel.app',
    siteName: 'Învățăm Împreună',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Platforma Educațională Învățăm Împreună',
      },
    ],
    locale: 'ro_RO',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Învățăm Împreună | Platformă Educațională pentru Elevi',
    description: 'Pregătire completă pentru examenele naționale și aprofundarea materiilor școlare.',
    site: '@handle_twitter',
    creator: '@handle_twitter',
    images: ['/images/twitter-image.png'],
  },

  alternates: {
    canonical: 'https://invatam-impreuna.vercel.app',
  },

  icons: {
    icon: [
      { url: '/images/favicon.ico', sizes: 'any' },
      { url: '/images/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/images/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: '/images/apple-touch-icon.png',
    other: [
      { rel: 'android-chrome-192x192', url: '/images/android-chrome-192x192.png' },
      { rel: 'android-chrome-512x512', url: '/images/android-chrome-512x512.png' },
    ],
  },
};

// =======================================================================
// 2. VIEWPORT PENTRU RESPONSIVITATE ȘI CULOAREA TEMEI
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
// 3. COMPONENTA ROOT LAYOUT
// =======================================================================
export default function RootLayout({ children }: { children: React.ReactNode }) {

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Învățăm Împreună',
    url: 'https://invatam-impreuna.vercel.app',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://invatam-impreuna.vercel.app/cauta?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: 'invatam impreuna',
      logo: {
        '@type': 'ImageObject',
        url: 'https://invatam-impreuna.vercel.app/images/logo.png',
      },
    },
  };

  return (
    <html
      lang="ro"
      suppressHydrationWarning
      className={`${inter.variable} ${lora.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var s=localStorage.getItem('theme');var m=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;var t=(s==='light'||s==='dark')?s:(m?'dark':'light');var r=document.documentElement;if(t==='dark'){r.classList.add('dark');}else{r.classList.remove('dark');}r.setAttribute('data-theme',t);}catch(e){}})();`}
        </Script>

        <link rel="stylesheet" href="/styles/AnnotationLayer.css" />
        <link rel="stylesheet" href="/styles/TextLayer.css" />
      </head>
      <body suppressHydrationWarning>
        <AppThemeProvider>
          <Providers>{children}</Providers>
        </AppThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}