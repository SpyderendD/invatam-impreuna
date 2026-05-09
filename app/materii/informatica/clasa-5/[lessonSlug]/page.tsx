'use client';

import React from 'react';
import { Download, ArrowLeft } from 'lucide-react'; // NOU: Am importat ArrowLeft
import dynamic from 'next/dynamic';
import Link from 'next/link'; // NOU: Importăm Link pentru butonul de înapoi

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
    'sistem-de-calcul': 'sistem de calcul.pdf',
    'istoric-calculatoare': 'Sisteme de calcul_Istoric.pdf',
    'dispozitive-de-intrare': 'Dispozitive de intrare.pdf',
    'dispozitive-de-iesire': 'Dispozitive_de_iesire.pdf',
    'dispozitive-mixte': 'Dispozitive de intrare-iesire.pdf',
    'descrierea-software': 'Descrierea componentei software.pdf',
    'internetul': 'Internetul.pdf',
    'world-wide-web': 'Serviciul WORLD WIDE WEB.pdf',
    'cautarea-informatiilor': 'căutarea_informațiilor_pe_Internet.pdf',
    'editare-grafica': 'Editoare grafice.pdf',
    'instrumente-de-desenare': 'instrumente de desenare.pdf',
    'inserare-formatare-text': 'inserarea_și_formatarea_textului.pdf',
    'algoritmi-proprietati': 'Algoritmi- proprietăți.pdf',
    'clasificarea-datelor': 'clasificarea datelor algoritmilor.pdf',
    'expresii-aritmetice': 'expresii  aritmetice.pdf',
    'expresii-logice': 'expresii logice.pdf',
    'operatori-relationali': 'Operatori_relaționali.pdf',
    'structura-liniara': 'structura_liniară.pdf',
    'mediu-grafic-interactiv': 'prezentarea mediului grafic interactiv.pdf',
    'structura-alternativa': 'structura alternativa.pdf',
    'reprezentarea-deciziilor': 'Reprezentarea_structurii_alternative_înt.pdf',
    'aplicatii-scratch': 'Aplicații_Scratch.pdf',
    'recapitulare-generala': 'Recapitulare.pdf',
    'recapitulare-finala': 'recapitulare_finală.pdf',
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