// components/Providers.tsx

'use client'; // <-- Cheia succesului

// Importăm tot ce avem nevoie pentru layout-ul global
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext"; // Presupunând că aveți și un ThemeProvider
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer'; // Asigurați-vă că importați și footer-ul
import { Toaster } from "@/components/ui/toaster";
import { ClientLogicWrapper } from '@/components/layout/ClientLogicWrapper';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // Începem cu providerii de context, care sunt invizibili
    <AuthProvider>
      <ThemeProvider>
        
        {/* Aici plasăm logica globală care rulează pe client */}
        <ClientLogicWrapper />

        {/* Acum definim structura vizuală a paginii */}
        <div className="flex flex-col min-h-screen">
          <Navbar /> {/* <-- NAVBAR-UL ESTE AICI, O SINGURĂ DATĂ */}
          
          <main className="flex-grow pt-16"> {/* Am adăugat pt-16 (padding-top) pentru a compensa înălțimea navbar-ului fix */}
            {/* '{children}' este locul unde va apărea conținutul specific fiecărei pagini */}
            {children}
          </main>
          
          <Footer /> {/* <-- FOOTER-UL ESTE AICI, O SINGURĂ DATĂ */}
        </div>

        {/* Toaster-ul pentru notificări stă în afara structurii flex */}
        <Toaster />

      </ThemeProvider>
    </AuthProvider>
  );
}