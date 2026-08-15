'use client';

import React from 'react';
import { Download, ArrowLeft } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// AICI SE ÎNTÂMPLĂ MAGIA: Importăm vizualizatorul FĂRĂ SSR
const PDFViewer = dynamic(() => import('@/components/PDFViewer'), {
  ssr: false,
  loading: () => <div className="p-20 text-center text-muted-foreground animate-pulse">Se pregătește vizualizatorul...</div>
});

interface PdfViewerPageProps {
    params: {
        lessonSlug: string;
    };
}

const fileMap: { [key: string]: string } = {
    'test-evaluare-initiala-clasa-5': 'test-evaluare-initiala-clasa-5.pdf',
    'sistem-de-calcul': 'sistem_de_calcul.pdf',
    'istoric-calculatoare': 'sisteme de calcul_istoric.pdf',
    'dispozitive-de-intrare': 'dispozitive de intrare.pdf',
    'dispozitive-de-iesire': 'dispozitive_de_iesire.pdf',
    'dispozitive-mixte': 'dispozitive_de_intrare-iesire.pdf',
    'descrierea-software': 'descrierea_componentei_software.pdf',
    'internetul': 'internetul.pdf',
    'world-wide-web': 'serviciul_world_wide_web.pdf',
    'cautarea-informatiilor': 'cautarea_informatiilor_pe_internet.pdf',
    'editare-grafica': 'editoare_grafice.pdf',
    'instrumente-de-desenare': 'instrumente_de_desenare.pdf',
    'inserare-formatare-text': 'inserarea_și_formatarea_textului.pdf',
    'algoritmi-proprietati': 'algoritmi_proprietăți.pdf',
    'clasificarea-datelor': 'clasificarea_datelor_algoritmilor.pdf',
    'expresii-aritmetice': 'expresii_aritmetice.pdf',
    'expresii-logice': 'expresii_logice.pdf',
    'operatori-relationali': 'operatori_relationali.pdf',
    'structura-liniara': 'structura_liniara.pdf',
    'mediu-grafic-interactiv': 'prezentarea_mediuului_grafic_interactiv.pdf',
    'structura-alternativa': 'structura_alternativa.pdf',
    'reprezentarea-deciziilor': 'reprezentarea_structurii_alternative_int.pdf',
    'aplicatii-scratch': 'aplicatii_scratch.pdf',
    'recapitulare-generala': 'recapitulare.pdf',
    'recapitulare-finala': 'recapitulare_finala.pdf',
};

export default function PdfViewerPage({ params }: PdfViewerPageProps) {
  const { lessonSlug } = params; 
  const fileName = fileMap[lessonSlug] || null;

  if (!fileName) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-12 text-center animate-in fade-in duration-500">
            <h1 className="text-4xl font-extrabold text-red-600 mb-4">Eroare: 404</h1>
            <p className="text-xl text-muted-foreground mb-8">Lecția &quot;{lessonSlug}&quot; nu a fost găsită.</p>
            <Link href="/materii/informatica/clasa-5" className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                Întoarce-te la lista de lecții
            </Link>
        </div>
      );
  }
  
  const pdfPath = encodeURI(`/lectii/informatica/clasa-5/${fileName}`); 
  const formattedTitle = lessonSlug.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div className="pdf-viewer-page p-4 md:p-8 bg-background min-h-screen flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="w-full max-w-5xl flex flex-col gap-6 mb-8">
        {/* NOU: Buton de înapoi */}
        <div className="self-start">
            <Link 
                href="/materii/informatica/clasa-5" 
                className="group flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 hover:bg-secondary text-secondary-foreground transition-all duration-300"
            >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                <span className="font-medium">Înapoi la lecții</span>
            </Link>
        </div>

        {/* NOU: Container modern pentru Titlu și Buton Descărcare */}
        <div className="flex flex-col sm:flex-row justify-between items-center p-6 bg-card border border-border shadow-sm rounded-2xl gap-4 relative overflow-hidden">
            {/* Un mic accent vizual de design */}
            <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
            
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground text-center sm:text-left">
                <span className="text-primary mr-2">|</span> {formattedTitle}
            </h1>
            
            <a 
                href={pdfPath} 
                download 
                className="group flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-105 hover:shadow-primary/40 active:scale-95"
            >
                <Download className="h-5 w-5 transition-transform group-hover:-translate-y-1" />
                Descarcă PDF
            </a>
        </div>
      </div>

      {/* COMPONENTA DINAMICĂ PDF */}
      <div className="w-full max-w-5xl bg-card p-2 md:p-6 rounded-2xl border border-border shadow-sm">
          <PDFViewer pdfPath={pdfPath} />
      </div>

    </div>
  );
}