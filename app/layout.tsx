import './globals.css';
import { Inter, Lora } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Navbar } from '@/components/layout/navbar';
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/context/ThemeContext';
import { CustomCursor } from '@/components/animations/CustomCursor'; // Asigură-te că importul e corect (named export)

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const lora = Lora({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-lora' });

export const metadata = {
  title: 'Învăţăm Împreună | Platformă Educațională',
  description: 'Platformă personală pentru Evaluarea Națională.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro">
      <body className={cn("bg-background text-foreground", inter.variable, lora.variable)}>
        {/* Filtrul SVG pentru GooeyNav - Plasat aici pentru a fi disponibil global */}
        <svg width="0" height="0" className="absolute"> {/* Hidden from view */}
          <defs>
            <filter id="gooey-nav-filter">
              <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="gooey" />
              <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
            </filter>
          </defs>
        </svg>

        <AuthProvider>
          <ThemeProvider>
            <CustomCursor />
            <Navbar />
            <main>
              {children}
            </main>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}