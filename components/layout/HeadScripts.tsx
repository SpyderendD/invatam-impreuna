// components/Providers.tsx
'use client'; // Esențial, deoarece conține provideri de context și layout-ul vizual

// Importăm providerii de context
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "next-themes"; // Folosim pachetul recomandat pentru Next.js

// Importăm componentele de layout vizual
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster";

/**
 * Componenta `Providers` are un singur rol: să învelească întreaga aplicație
 * în toți providerii de context necesari (Autentificare, Temă, etc.)
 * și să definească structura vizuală de bază (Navbar, Footer).
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // 1. ThemeProvider (de la `next-themes`) - gestionează dark/light mode.
    // `attribute="class"` îi spune să adauge clasa 'dark' pe tag-ul <html>.
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    
      {/* 2. AuthProvider - gestionează starea utilizatorului (logat/delogat). */}
      <AuthProvider>

        {/* 3. Structura vizuală a paginii. */}
        {/* Acum, Navbar și Footer au acces la contextul de temă și autentificare. */}
        <div className="flex min-h-screen flex-col">
          <Navbar />
          
          <main className="flex-grow pt-16">
            {/* `{children}` este locul unde va fi redat conținutul specific
                fiecărei pagini (ex: pagina de profil, o lecție, etc.) */}
            {children}
          </main>
          
          <Footer />
        </div>

        {/* 4. Toaster-ul pentru notificări. Stă în afara structurii flex
            pentru a se afișa corect peste tot conținutul. */}
        <Toaster />

      </AuthProvider>
    </ThemeProvider>
  );
}