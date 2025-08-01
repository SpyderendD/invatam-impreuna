// app/layout.tsx (MODIFICAT și SIMPLIFICAT)

import './globals.css';
import { Inter, Lora } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import { cn } from '@/lib/utils';
import { Providers } from '@/components/Providers';
import { Navbar } from '@/components/layout/navbar';

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

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang="ro">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}