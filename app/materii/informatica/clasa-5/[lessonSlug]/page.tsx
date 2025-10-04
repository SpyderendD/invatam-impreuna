// app/materii/informatica/clasa-5/[lessonSlug]/page.tsx
'use client';

import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

interface PdfViewerPageProps {
    params: {
        lessonSlug: string;
    };
}

const fileMap: { [key: string]: string } = {
    'sistem-de-calcul': 'Sistem de calcul.pdf',
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
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const { lessonSlug } = params; 

  const fileName = fileMap[lessonSlug] || null;

  if (!fileName) {
      return (
        <div className="p-12 text-center">
            <h1 className="text-3xl font-bold text-red-600">Eroare: 404 Lecție negăsită</h1>
            <p className="mt-4 text-muted-foreground">Slug: {lessonSlug}</p>
        </div>
      );
  }

  // AICI ESTE CORECȚIA CRITICĂ: Calea trebuie să fie absolută (să înceapă cu /)
  const pdfPath = `/lectii/informatica/clasa-5/${fileName}`; 

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
    setError(null);
  }

  function onDocumentLoadError(error: Error) {
    console.error('Eroare la încărcarea PDF:', error);
    setError(`Eroare la încărcarea documentului: ${error.message}. Asigură-te că fișierul ${pdfPath} există în folderul public.`);
  }

  const changePage = (offset: number) => {
    if (numPages) {
        setPageNumber(prevPageNumber => {
            const newPage = (prevPageNumber || 1) + offset;
            if (newPage >= 1 && newPage <= numPages) {
                return newPage;
            }
            return prevPageNumber || 1;
        });
    }
  };

  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);
  
  const formattedTitle = lessonSlug.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div className="pdf-viewer-page p-5 md:p-10 bg-background min-h-screen flex flex-col items-center">
      <h1 className="text-2xl md:text-3xl font-bold text-primary mb-6 text-center">
        Lecție: {formattedTitle}
      </h1>

      {error && (
        <div className="text-red-600 border border-red-600 bg-red-50 p-3 rounded-md mb-6 text-center w-full max-w-2xl">
          {error}
        </div>
      )}

      <div className="flex justify-center mb-4 gap-4">
          <button 
              onClick={previousPage} 
              disabled={pageNumber <= 1}
              className="px-4 py-2 bg-secondary text-secondary-foreground font-semibold rounded-lg transition-colors hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
              &larr; Pagina anterioară
          </button>
          <span className="px-4 py-2 text-foreground font-medium">
              Pagina {pageNumber} din {numPages || '--'}
          </span>
          <button 
              onClick={nextPage} 
              disabled={pageNumber >= (numPages || 1)}
              className="px-4 py-2 bg-secondary text-secondary-foreground font-semibold rounded-lg transition-colors hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
              Pagina următoare &rarr;
          </button>
      </div>

      <div className="border border-border shadow-xl mb-10">
          <Document
            file={pdfPath}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={<div className="p-20 text-center text-muted-foreground">Se încarcă documentul...</div>}
            error={error ? null : "Eroare la încărcare."}
          >
            <Page 
                pageNumber={pageNumber} 
                width={typeof window !== 'undefined' ? Math.min(window.innerWidth * 0.9, 900) : 900} 
            />
          </Document>
      </div>
    </div>
  );
}