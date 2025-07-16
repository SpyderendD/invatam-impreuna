// app/politica-confidentialitate/page.tsx

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { FileText } from 'lucide-react';

export default function PoliticaConfidentialitatePage() {
  return (
    <>
      <Navbar />
      <main className="container py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-3 mb-4">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold md:text-4xl">
            Politică de Confidențialitate
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Documentul nostru privind politica de confidențialitate este în curs de actualizare.
            Vă mulțumim pentru răbdare și vă invităm să reveniți în curând.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}