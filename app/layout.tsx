// app/layout.tsx

// =======================================================================
// IMPORTURILE NECESARE
// =======================================================================
import './globals.css';
import { Inter, Lora } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script'; 
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import { Providers } from '@/components/Providers';
import CustomCursor from '@/components/animations/CustomCursor';
import { Toaster } from '@/components/ui/toaster';

// =======================================================================
// 1. CONFIGURARE FONTURI
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
// 2. METADATE SEO AVANSATE
// =======================================================================
export const metadata: Metadata = {
  metadataBase: new URL('https://invatam-impreuna.vercel.app'),
  title: {
    default: 'Învățăm Împreună | Platformă Educațională Gratuită',
    template: '%s | Învățăm Împreună',
  },
  description: 'Platformă educațională online completă pentru pregătire la Evaluarea Națională și Bacalaureat. Lecții interactive, teste gratuite, monitorizare progres și resurse vizuale pentru elevi.',
  keywords: [
    'educatie online', 'evaluare nationala', 'bacalaureat', 'lectii video',
    'teste online', 'mate', 'romana', 'informatica', 'chimie', 'fizica',
    'invatam impreuna', 'platforma elevi', 'pregatire examene', 'resurse scolare',
    'invatare interactiva', 'flashcarduri', 'timer studiu', 'progres monitorizat', 'lectii interactive',
    'bacalaureat', 'evaluare nationala', 'elevi', 'pregatire examene', 'resurse scolare',
    'mate', 'romana', 'informatica', 'chimie', 'fizica', 'invatam impreuna',
    'platforma educatie', 'teste gratuite', 'lectii video', 'invatare online',
    'Spyderend', 'Mera Alin David', 'Romania', 'scoala', 'educatie gratuita',
  ],
  authors: [{ name: 'Mera Alin David', url: 'https://invatam-impreuna.vercel.app' }],
  creator: 'Mera Alin David (Spyderend)',
  publisher: 'Învățăm Împreună',
  alternates: {
    canonical: '/',
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
  openGraph: {
    type: 'website',
    locale: 'ro_RO',
    url: 'https://invatam-impreuna.vercel.app',
    siteName: 'Învățăm Împreună',
    title: 'Învățăm Împreună - Viitorul tău începe azi',
    description: 'Pregătește-te pentru Evaluarea Națională și BAC cu lecții interactive și teste gratuite. Platformă creată de elevi, pentru elevi.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Invatam Impreuna Platforma',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Învățăm Împreună | Platformă Educațională',
    description: 'Resurse gratuite pentru examenele tale. Învață inteligent.',
    images: ['/og-image.png'],
    creator: '@spyderend', 
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: "/images/favicon.ico", type: "image/x-icon", sizes: "any" },
      { url: "/images/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/images/favicon-32x32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: "/images/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    title: "Învățăm Împreună",
    statusBarStyle: "default",
  },
  verification: {
    google: 'sOjUUt5BdjJ2F4A64Tw9HkCX8kxANp8fKncbXCoXnvA',
  },
  category: 'education',
};

// =======================================================================
// 3. VIEWPORT
// =======================================================================
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0D2440' },
  ],
};

// =======================================================================
// 4. ROOT LAYOUT
// =======================================================================
export default function RootLayout({ children }: { children: React.ReactNode }) {

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: 'Învățăm Împreună',
        url: 'https://invatam-impreuna.vercel.app',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://invatam-impreuna.vercel.app/search?q={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
      },
      {
        '@type': 'Organization',
        name: 'Învățăm Împreună',
        url: 'https://invatam-impreuna.vercel.app',
        logo: 'https://invatam-impreuna.vercel.app/icon-192x192.png',
        sameAs: [
          "https://tiktok.com/@spyderend",
          "https://instagram.com/mera_alin"
        ],
        founder: {
          '@type': 'Person',
          name: 'Mera Alin David'
        }
      }
    ]
  };

  return (
    <html
      lang="ro"
      suppressHydrationWarning
      className={`${inter.variable} ${lora.variable} scroll-smooth`}
    >
      <head>
        <Script
          id="json-ld-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {/* Anti-FOUC Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      
      <body className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden selection:bg-primary/30 selection:text-primary-foreground">
        
        {/* --- GOOGLE ANALYTICS START --- */}
        {/* 1. Încărcăm scriptul extern de la Google */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-4T2MY0SSCB"
        />
        
        {/* 2. Configurăm Analytics */}
        <Script
          id="google-analytics"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-4T2MY0SSCB');
          `}
        </Script>
        {/* --- GOOGLE ANALYTICS END --- */}

        <Providers>
          {children}
          <CustomCursor />
          <Toaster />
        </Providers>

        <Analytics />
        <SpeedInsights />
        
      </body>
    </html>
  );
}