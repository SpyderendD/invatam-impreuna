"use client";

import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
// @ts-ignore
import 'react-pdf/dist/Page/TextLayer.css';
// @ts-ignore
import 'react-pdf/dist/Page/AnnotationLayer.css';

// Setăm worker-ul extern ca să nu mai ai problema cu 404
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;


export default function PDFViewer({ pdfPath }: { pdfPath: string }) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [pageWidth, setPageWidth] = useState(900);

  // Setăm lățimea doar pe client
  useEffect(() => {
    setPageWidth(Math.min(window.innerWidth * 0.9, 900));
  }, []);


  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
    setError(null);
  }

  function onDocumentLoadError(error: Error) {
    console.error('Eroare la încărcarea PDF:', error);
    setError(`Eroare la încărcarea documentului: ${error.message}`);
  }

  const changePage = (offset: number) => {
    if (numPages) {
      setPageNumber(prevPageNumber => {
        const newPage = (prevPageNumber || 1) + offset;
        if (newPage >= 1 && newPage <= numPages) { return newPage; }
        return prevPageNumber || 1;
      });
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {error && (
        <div className="text-red-600 border border-red-600 bg-red-50 p-3 rounded-md mb-6 text-center w-full max-w-2xl">
          {error}
        </div>
      )}

      {/* Butoanele de paginare */}
      <div className="flex justify-center mb-4 gap-4">
        <button 
          onClick={() => changePage(-1)} 
          disabled={pageNumber <= 1} 
          className="px-4 py-2 bg-secondary text-secondary-foreground font-semibold rounded-lg transition-colors hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          &larr; Pagina anterioară
        </button>
        <span className="px-4 py-2 text-foreground font-medium">
          Pagina {pageNumber} din {numPages || '--'}
        </span>
        <button 
          onClick={() => changePage(1)} 
          disabled={pageNumber >= (numPages || 1)} 
          className="px-4 py-2 bg-secondary text-secondary-foreground font-semibold rounded-lg transition-colors hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Pagina următoare &rarr;
        </button>
      </div>

      {/* Documentul PDF */}
      <div className="border border-border shadow-xl mb-10">
        <Document 
          file={pdfPath} 
          onLoadSuccess={onDocumentLoadSuccess} 
          onLoadError={onDocumentLoadError} 
          loading={<div className="p-20 text-center text-muted-foreground">Se încarcă documentul...</div>}
        >
          <Page pageNumber={pageNumber} width={pageWidth} renderTextLayer={true} renderAnnotationLayer={true} />
        </Document>
      </div>
    </div>
  );
}