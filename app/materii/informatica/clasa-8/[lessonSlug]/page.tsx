'use client';

import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

// MAPA CORECTĂ PENTRU CLASA A 8-A
const fileMap: { [slug: string]: string } = {
    'test-initial': 'TEST_DE_EVALUARE_INIȚIALĂ_a_8-a.pdf',
    'aplicatia-calcul-tabelar': 'Aplicatia de calcul tabelar.pdf',
    'formatare-tipuri-de-date': 'operatii de formatare si tipuri de date.pdf',
    'formule-si-functii': 'Formule si functii.pdf',
    'serii-de-date-si-grafice': 'Serii de date si grafice.pdf',
    'editorul-de-pagini-web': 'Editorul de pagini Web.pdf',
    'elemente-de-interfata-editoare': 'Elemente de interfata ale editoarelor de site.pdf',
    'structura-paginii-web': 'Structura paginii Web.pdf',
    'editarea-elementelor-web': 'Editarea elementelor din pagina Web.pdf',
    'liste-si-imagini-html': 'Liste si imagini in HTML.pdf',
    'formatarea-elementelor-web': 'Formatarea elementelor din pagina Web.pdf',
    'activitate-practica-formatare': 'activitate practica- formatarea elementelor din pagina web.pdf',
    'sirul-de-valori': 'Sirul de valori.pdf',
    'prelucrarea-cifrelor': 'Prelucrarea cifrelor unui numar.pdf',
    'prelucrarea-divizorilor': 'Prelucrarea divizorilor unui numar.pdf',
    'numararea-unui-eveniment': 'Numararea unui eveniment.pdf',
    'siruri-de-valori-generate': 'Siruri de valori generate.pdf',
    'siruri-de-valori-citite': 'Siruri de valori citite.pdf',
    'algoritmi-interdisciplinari': 'Algoritmi interdisciplinari.pdf',
    'robotul-didactic-obstacole': 'Robotul didactic - detectarea si evitarea obstacolelor.pdf',
    'activitate-practica-evitarea-obstacolelor': 'activitate practica - evitarea obstacolelor.pdf',
    'urmarirea-liniei-traseu': 'urmarirea liniei unui traseu marcat.pdf',
    'parcurgerea-unui-traseu': 'Parcurgerea unui traseu marcat.pdf',
};

export default function PdfViewerPageClasa8({ params }: { params: { lessonSlug: string } }) {
    const { lessonSlug } = params;

    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [error, setError] = useState<string | null>(null);

    const fileName = fileMap[lessonSlug] || null;

    if (!fileName) {
        return (
            <div className="p-12 text-center">
                <h1 className="text-3xl font-bold text-red-600">Eroare: 404 Lecție negăsită</h1>
                <p className="mt-4 text-muted-foreground">Clasa: clasa-8, Lecția: {lessonSlug}</p>
            </div>
        );
    }

    const pdfPath = `/lectii/informatica/clasa-8/${fileName}`; 

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