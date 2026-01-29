'use client';

import { useState, useEffect } from 'react';
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "next-themes";

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster";
import Preloader from '@/components/ui/Preloader';
import CookieBanner from '@/components/ui/CookieBanner';
import AccessibilityMenu from '@/components/ui/AccessibilityMenu';

export function Providers({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isLoading]);

  // Evităm randarea pe server pentru componentele strict client-side
  if (!mounted) return null;

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AuthProvider>
        
        {/* LOADER */}
        {isLoading && <Preloader onFinish={() => setIsLoading(false)} />}

        {/* SITE CONTENT */}
        <div 
          // Folosim 'invisible' în loc de 'hidden' pentru a păstra layout-ul calculat
          className={`flex flex-col min-h-screen transition-opacity duration-700 ${
            isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <Navbar />
          <main className="flex-grow pt-16 relative z-10">
            {children}
          </main>
          <Footer />
        </div>

        {/* FIXED OVERLAYS - LAYER SUPERIOR */}
        {/* Doar dacă loader-ul a terminat, afișăm butoanele */}
        {!isLoading && (
            <div className="fixed inset-0 pointer-events-none z-[99999]">
                {/* 
                   pointer-events-none pe containerul mare ca să poți da click prin el 
                   dar elementele din interior (butoanele) vor avea pointer-events-auto automat
                */}
                
                {/* TOASTER (Notificări) */}
                <div className="absolute top-0 right-0 p-4 pointer-events-auto">
                    <Toaster />
                </div>

                {/* COOKIE BANNER (Jos) */}
                <div className="pointer-events-auto">
                    <CookieBanner />
                </div>

                {/* ACCESIBILITATE (Dreapta Jos) */}
                <div className="pointer-events-auto">
                    <AccessibilityMenu />
                </div>
            </div>
        )}

      </AuthProvider>
    </ThemeProvider>
  );
}