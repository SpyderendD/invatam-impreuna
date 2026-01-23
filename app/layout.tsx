import './globals.css';
import { Inter, Lora } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Providers } from '@/components/Providers';
import CustomCursor from '@/components/animations/CustomCursor'; // Asigură-te că ai fișierul aici

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
// Configurare robustă pentru Google, Facebook, Twitter și WhatsApp
// =======================================================================
export const metadata: Metadata = {
  metadataBase: new URL('https://invatam-impreuna.vercel.app'),
  
  title: {
    default: 'Învățăm Împreună | Platformă Educațională Interactivă',
    template: '%s | Învățăm Împreună',
  },
  
  description: 'Platformă educațională online gratuită pentru pregătire la Evaluarea Națională, Bacalaureat și alte materii. Lecții interactive, teste grilă, flashcarduri și resurse AI.',
  
  keywords: ['educatie', 'invatam impreuna', 'bacalaureat', 'evaluare nationala', 'teste', 'lectii online', 'matematica', 'romana', 'ai educatie',
    'educatie online', 'evaluare nationala', 'bacalaureat', 'lectii video',
    'teste online', 'mate', 'romana', 'informatica', 'chimie', 'fizica',
    'invatam impreuna', 'platforma elevi', 'pregatire examene', 'resurse scolare',
    'invatare interactiva', 'flashcarduri', 'timer studiu', 'progres monitorizat', 'lectii interactive',
    'bacalaureat', 'evaluare nationala', 'elevi', 'pregatire examene', 'resurse scolare',
    'mate', 'romana', 'informatica', 'chimie', 'fizica', 'invatam impreuna',
    'platforma educatie', 'teste gratuite', 'lectii video', 'invatare online',
    'Spyderend', 'Mera Alin David', 'Romania', 'scoala', 'educatie gratuita',],
  
  authors: [{ name: 'Echipa Învățăm Împreună' }],
  creator: 'Învățăm Împreună',
  publisher: 'Învățăm Împreună',

  // Configurare PWA (Progressive Web App)
  manifest: '/manifest.json',
  
  // Iconițe pentru toate dispozitivele
  icons: {
    icon: '/images/favicon.ico',
    shortcut: '/images/favicon.ico',
    apple: '/images/icon-192x192.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/images/icon-192x192.png',
    },
  },

  // Open Graph (Cum arată link-ul când îl dai pe Facebook/WhatsApp)
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

  // Twitter Cards
  twitter: {
    card: 'summary_large_image',
    title: 'Învățăm Împreună',
    description: 'Platformă educațională completă pentru elevi.',
    images: ['/images/og-image.png'],
  },

  // Indexare (Spunem roboților Google că au voie să scaneze tot)
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
};

// =======================================================================
// 3. CONFIGURARE VIEWPORT (MOBILE)
// =======================================================================
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5, // Lăsăm userul să facă zoom (accesibilitate)
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0F172A' }, // Dark mode color match
  ],
};

// =======================================================================
// 4. COMPONENTA PRINCIPALĂ
// =======================================================================
export default function RootLayout({ children }: { children: React.ReactNode }) {
  
  // Schema.org pentru Google (Structured Data)
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
        {/* A. JSON-LD pentru SEO Structurat */}
        <Script
          id="json-ld-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          strategy="worker" // Îl încărcăm în fundal să nu blocheze site-ul
        />
        
        {/* B. Script pentru evitarea Flash-ului de Temă (Dark/Light) */}
        {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem('theme');var e=window.matchMedia('(prefers-color-scheme: dark)').matches;var d=document.documentElement;d.classList.add(t==='dark'||(!t&&e)?'dark':'light');d.classList.remove(t==='dark'||(!t&&e)?'light':'dark');}catch(t){}})()`}
        </Script>

        {/* C. GOOGLE ADSENSE - Optimizat */}
        {/* Folosim strategy="afterInteractive" pentru a nu încetini încărcarea inițială a paginii */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8380681272847895"
          crossOrigin="anonymous"
          strategy="afterInteractive" 
        />
      </head>
      
      <body className="antialiased selection:bg-primary/30 selection:text-foreground">
        <Providers>
          {/* Cursorul personalizat global */}
          <CustomCursor />
          
          {/* Conținutul Paginii */}
          {children}
        </Providers>
        
        {/* Monitorizare Performanță Vercel */}
        <SpeedInsights />
      </body>
    </html>
  );
}