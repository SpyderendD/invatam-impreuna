'use client';

// Importăm providerii de context
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "next-themes";
import { useState, useEffect } from 'react';

// Importăm componentele de layout
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster";
// Importăm componenta Preloader creată de tine
import Preloader from '@/components/ui/Preloader';

export function Providers({ children }: { children: React.ReactNode }) {
  // Stare pentru a controla vizibilitatea loaderului
  const [isLoading, setIsLoading] = useState(true);

  // Folosim useEffect pentru a ne asigura că loaderul rulează doar pe client
  // și că dispare după ce a terminat
  useEffect(() => {
    // Opțional: Poți ascunde scrollbar-ul cât timp e loaderul activ
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isLoading]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>

        {/* 1. PRELOADER - Apare peste tot */}
        {isLoading && <Preloader onFinish={() => setIsLoading(false)} />}

        {/* 2. STRUCTURA PAGINII - Apare după ce loaderul termină */}
        {/* Folosim opacity-0 inițial pentru o tranziție fină când dispare loaderul */}
        <div 
          className={`flex flex-col min-h-screen transition-opacity duration-700 ease-in-out ${
            isLoading ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'
          }`}
        >
          <Navbar />
          
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