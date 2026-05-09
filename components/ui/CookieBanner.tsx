'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Cookie, X } from 'lucide-react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verificăm dacă există deja o preferință salvată
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Afișăm bannerul cu o mică întârziere pentru efect
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
    // Aici poți activa analytics (ex: window.gtag('consent', 'update', ...))
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:left-4 md:bottom-6 z-[9998] w-auto md:max-w-md"
        >
          <div className="relative bg-card/80 backdrop-blur-xl border border-primary/20 p-6 rounded-2xl shadow-2xl overflow-hidden">
            {/* Glow Effect */}
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-primary/20 rounded-full blur-xl pointer-events-none" />
            
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl shrink-0">
                <Cookie className="w-6 h-6 text-primary" />
              </div>
              
              <div className="space-y-2">
                <h3 className="font-bold text-foreground">Cookie-uri & Confidențialitate 🍪</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Folosim cookie-uri pentru a îmbunătăți experiența ta. Continuând navigarea, ești de acord cu utilizarea lor.
                  <br />
                  <Link href="/cookies" className="text-primary hover:underline text-xs mt-1 inline-block">
                    Citește politica completă
                  </Link>
                </p>
              </div>
              
              <button 
                onClick={handleDecline} 
                className="text-muted-foreground hover:text-foreground shrink-0"
                aria-label="Închide"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-6 flex gap-3">
              <Button onClick={handleAccept} className="flex-1 bg-primary text-primary-foreground hover:opacity-90">
                Acceptă Tot
              </Button>
              <Button onClick={handleDecline} variant="outline" className="flex-1 border-primary/20 hover:bg-primary/5">
                Refuză
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}