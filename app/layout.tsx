import './globals.css';
import { Inter, Lora } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Navbar } from '@/components/layout/navbar';
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/context/ThemeContext';
import CustomCursor from '@/components/animations/CustomCursor';

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
      <body className={cn("bg-white text-gray-900", inter.variable, lora.variable)}>
        <AuthProvider>
          <ThemeProvider> {/* <-- NOU: Învelește aplicația cu ThemeProvider */}
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