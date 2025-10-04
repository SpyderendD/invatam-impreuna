'use client';

import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

// MAPA CORECTĂ PENTRU CLASA A 7-A
const fileMap: { [slug: string]: string } = {
    'editorul-de-texte': 'editorul de texte.pdf',
    'interfata-word': 'interfata word.pdf',
    'operatii-in-word': 'Operatii in word.pdf',
    'inserarea-obiectelor': 'inserarea obiectelor in document.pdf',
    'operatii-de-editare': 'operatii de editare intr-un doc.pdf',
    'formatarea-imaginilor': 'formatarea imaginilor.pdf',
    'formatarea-tabelelor-si-paginilor': 'formatarea tabelelor si a paginilor.pdf',
    'lucrul-colaborativ': 'lucrul colaborativ cu documente.pdf',
    'elemente-multimedia': 'elemente de baza multimedia.pdf',
    'aplicatia-openshot': 'Aplicația_OpenShot.pdf',
    'tipuri-fisiere-multimedia': 'Tipuri de fisiere multimedia.pdf',
    'gestionarea-fisierelor-multimedia': 'Gestionarea fisierelor multimedia.pdf',
    'particularizarea-fisierelor-multimedia': 'particularizarea fisierelor multimedia.pdf',
    'colaborare-fisiere-multimedia': 'lucrul colaborativ cu fisierele multimedia.pdf',
    'conectarea-la-aplicatii-colaborative': 'Conectarea la aplicatia colaborativa.pdf',
    'operatii-in-aplicatii-colaborative': 'operatii permise in aplicatia colaborativa.pdf',
    'mediu-dezvoltare-codeblocks': 'mediu de dezvoltare codeblocks.pdf',
    'operatori': 'operatori.pdf',
    'structura-programelor': 'structura programelor.pdf',
    'citire-afisare-date': 'Operatii de citire si afisare a datelor.pdf',
    'structura-alternativa-if': 'structura alternativa if.pdf',
    'structuri-repetitive-cpp': 'structuri repetitive in C++.pdf',
    'instructiunea-for': 'instructiunea repetitiva for.pdf',
    'instructiunea-do-while': 'instructiunea repetitiva do while.pdf',
};

export default function PdfViewerPageClasa7({ params }: { params: { lessonSlug: string } }) {
    const { lessonSlug } = params;

    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [error, setError] = useState<string | null>(null);

    const fileName = fileMap[lessonSlug] || null;

    if (!fileName) {
        return (
            <div className="p-12 text-center">
                <h1 className="text-3xl font-bold text-red-600">Eroare: 404 Lecție negăsită</h1>
                <p className="mt-4 text-muted-foreground">Clasa: clasa-7, Lecția: {lessonSlug}</p>
            </div>
        );
    }

    const pdfPath = `/lectii/informatica/clasa-7/${fileName}`; 

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setPageNumber(1);
        setError(null);
    }

    function onDocumentLoadError(error: Error) {
        setError(`Eroare la încărcarea documentului: ${error.message}. Asigură-te că fișierul ${pdfPath} există în folderul public.`);
    }

    const changePage = (offset: number) => {
        setPageNumber(prev => (prev || 1) + offset);
    };

    const previousPage = () => changePage(-1);
    const nextPage = () => changePage(1);
    
    const formattedTitle = lessonSlug.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return (
        <div className="pdf-viewer-page p-5 md:p-10 bg-background min-h-screen flex flex-col items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-primary mb-6 text-center">
                Lecție: {formattedTitle}
            </h1>

            {error && <div className="text-red-600 border border-red-600 bg-red-50 p-3 rounded-md mb-6 text-center w-full max-w-2xl">{error}</div>}

            <div className="flex justify-center mb-4 gap-4">
                <button onClick={previousPage} disabled={pageNumber <= 1} className="px-4 py-2 bg-secondary text-secondary-foreground font-semibold rounded-lg transition-colors hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed">&larr; Pagina anterioară</button>
                <span className="px-4 py-2 text-foreground font-medium">Pagina {pageNumber} din {numPages || '--'}</span>
                <button onClick={nextPage} disabled={pageNumber >= (numPages || 1)} className="px-4 py-2 bg-secondary text-secondary-foreground font-semibold rounded-lg transition-colors hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed">Pagina următoare &rarr;</button>
            </div>

            <div className="border border-border shadow-xl mb-10">
                <Document file={pdfPath} onLoadSuccess={onDocumentLoadSuccess} onLoadError={onDocumentLoadError} loading={<div className="p-20 text-center text-muted-foreground">Se încarcă documentul...</div>}>
                    <Page pageNumber={pageNumber} width={typeof window !== 'undefined' ? Math.min(window.innerWidth * 0.9, 900) : 900} />
                </Document>
            </div>
        </div>
    );
}