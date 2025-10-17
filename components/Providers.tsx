// components/Providers.tsx
'use client';

// Importăm providerii de context
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "next-themes";

// Importăm componentele de layout
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster";

export function Providers({ children }: { children: React.Node }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>

        {/* Acum definim structura vizuală a paginii ÎNTR-UN SINGUR LOC */}
        <div className="flex flex-col min-h-screen">
          <Navbar />
          
          {/* pt-16 compensează înălțimea navbar-ului care este fix (h-16) */}
          <main className="flex-grow pt-16">
            {children}
          </main>
          
          <Footer />
        </div>

        <Toaster />

      </AuthProvider>
    </ThemeProvider>
  );
}