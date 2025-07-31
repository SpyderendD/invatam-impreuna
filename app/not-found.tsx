'use client'; // <-- AICI ESTE CORECȚIA CRUCIALĂ

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Compass, Home, BookOpen, BarChart2, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

// --- Componenta de Link Util ---
const UsefulLink = ({ href, icon: Icon, text }: { href: string; icon: React.ElementType; text: string }) => (
  <Link href={href} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
    <Icon className="h-5 w-5 text-primary" />
    <span className="font-medium text-foreground">{text}</span>
  </Link>
);

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.2 }}
        className="flex flex-col items-center"
      >
        {/* Animație de plutire pentru iconiță */}
        <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Compass className="h-24 w-24 text-primary/70 mb-8" />
        </motion.div>
        
        {/* Numărul 404 cu gradient */}
        <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-primary">
          404
        </h1>
        
        <p className="mt-4 text-2xl md:text-3xl font-bold text-foreground">
          Oops! Pagina nu a fost găsită.
        </p>
        <p className="mt-2 max-w-md text-muted-foreground">
          Se pare că te-ai rătăcit puțin. Link-ul pe care l-ai urmat este posibil să fie greșit sau pagina a fost mutată.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.5 }}
        className="mt-12 flex flex-col items-center gap-10 w-full max-w-md"
      >
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link href="/">
            <Home className="mr-2 h-5 w-5" />
            Înapoi la Pagina Principală
          </Link>
        </Button>

        {/* Link-uri utile sugerate */}
        <div className="w-full text-left">
            <p className="text-sm font-semibold text-muted-foreground mb-4 text-center">SAU, POȚI EXPLORA UNA DINTRE ACESTE SECȚIUNI:</p>
            <div className="bg-card border rounded-xl p-4 space-y-2">
                <UsefulLink href="/materii/romana" icon={BookOpen} text="Vezi Materia la Română" />
                <UsefulLink href="/monitorizare" icon={BarChart2} text="Vezi Progresul Tău" />
                <UsefulLink href="/contact" icon={Mail} text="Contactează-ne" />
            </div>
        </div>
      </motion.div>
    </div>
  );
}