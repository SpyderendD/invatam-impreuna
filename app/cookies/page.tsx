// app/cookies/page.tsx

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Cookie } from 'lucide-react'; // Folosim o iconiță diferită pentru varietate

export default function PoliticaCookiesPage() {
  return (
    <>
      <main className="container py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-3 mb-4">
            <Cookie className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold md:text-4xl">
            Politică de Utilizare a Cookie-urilor
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Informațiile detaliate despre modulele cookie utilizate de platforma noastră sunt în curs de actualizare.
            Vă invităm să reveniți în curând.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}