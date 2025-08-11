// app/layout.tsx
import './globals.css';
import { Inter, Lora } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Providers } from '@/components/Providers';
import { ThemeProvider as AppThemeProvider } from '@/context/ThemeContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const lora = Lora({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-lora' });

export const metadata: Metadata = {
  title: 'Învăţăm Împreună | Platformă Educațională',
  description: 'Platformă personală pentru Evaluarea Națională.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ro"
      suppressHydrationWarning
      className={`${inter.variable} ${lora.variable}`}
    >
      <head>
        {/* Aplică tema înainte de hidratare (preferința salvată sau tema sistemului) */}
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var s=localStorage.getItem('theme');var m=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;var t=(s==='light'||s==='dark')?s:(m?'dark':'light');var r=document.documentElement;if(t==='dark'){r.classList.add('dark');}else{r.classList.remove('dark');}r.setAttribute('data-theme',t);}catch(e){}})();`}
        </Script>
      </head>
      <body suppressHydrationWarning>
        <AppThemeProvider>
          <Providers>{children}</Providers>
        </AppThemeProvider>
      </body>
    </html>
  );
}