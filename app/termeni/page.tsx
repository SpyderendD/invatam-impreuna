// app/termeni/page.tsx

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { FileText } from 'lucide-react';

export default function TermeniConditiiPage() {
  return (
    <>
      <main className="container py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-3 mb-4">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold md:text-4xl">
            Termeni și Condiții
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Acest document este în curs de elaborare.
            Vă mulțumim pentru înțelegere și vă invităm să reveniți în curând pentru a consulta versiunea finală.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}