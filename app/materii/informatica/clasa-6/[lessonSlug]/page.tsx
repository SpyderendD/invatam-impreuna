'use client';

import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

// MAPA CORECTĂ PENTRU CLASA A 6-A
const fileMap: { [slug: string]: string } = {
    'test-initial': 'TEST_DE_EVALUARE_INIȚIALĂ a 6-a.pdf',
    'prezentare-si-aplicatii': 'Prezentare_și_aplicații_de_prezentare-l1.pdf',
    'prezentarea-detaliata-a-barelor': 'Prezentarea_detaliată_a_barelor_de_opțiu.pdf',
    'operatii-de-lucru-cu-diapozitivele': 'Operații_de_lucru_cu_diapozitivele.pdf',
    'elemente-de-design-al-prezentarii': 'Elemente_de_design_al_prezentării.pdf',
    'realizarea-unei-prezentari': 'Realizarea_unei_prezentări.pdf',
    'grafica-3d-scop-si-avantaje': 'Grafica 3D - scop si avantaje.pdf',
    'structura-unei-animatii-grafice': 'structura unei animatii grafice.pdf',
    'masuri-de-securitate': 'Măsuri_de_siguranță_în_utilizarea_Intern.pdf',
    'animatii-grafice-in-scratch': 'Animații_grafice_în_Scratch.pdf',
    'obiecte-3d-in-powerpoint': 'Obiecte_3D_în_PowerPoint.pdf',
    'toontastic': 'toontastic-elemente_de_interfață.pdf',
    'posta-electronica': 'posta electronica.pdf',
    'crearea-unui-cont-de-email': 'Crearea unui cont de e-mail.pdf',
    'avantaje-si-dezavantaje-email': 'avantaje si dezavantaje e-mail.pdf',
    'reguli-de-comunicare': 'structura unui e-mail. reguli de comunic.pdf',
    'gmail-elemente-de-interfata': 'Gmail-elemente_de_interfață.pdf',
    'configurare-outlook-2007': 'configurare outlook 2007.pdf',
    'aplicatia-microsoft-outlook': 'Aplicația_Microsoft_Outlook.pdf',
    'elementele-de-baza-algoritmilor': 'Elementele_de_bază_utilizate_în_exersare.pdf',
    'schema-logica': 'Schema_logică.pdf',
    'limbajul-pseudocod': 'Limbajul pseudocod.pdf',
    'structuri-repetitive': 'structuri repetitive.pdf',
    'structura-repetitiva-cu-nr-cunoscut': 'structura repetitiva cu nr cunoscut de p.pdf',
    'reprezentarea-structurilor-repetitive': 'reprezentarea structurilor repetitive.do.pdf',
    'realizarea-unui-material-digital': 'Realizarea unui material digital.pdf',
    'structura-repetitiva-cu-test-final': 'Structura_repetitivă_cu_test_final.pdf',
};

export default function PdfViewerPageClasa6({ params }: { params: { lessonSlug: string } }) {
    const { lessonSlug } = params;

    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [error, setError] = useState<string | null>(null);

    const fileName = fileMap[lessonSlug] || null;

    if (!fileName) {
        return (
            <div className="p-12 text-center">
                <h1 className="text-3xl font-bold text-red-600">Eroare: 404 Lecție negăsită</h1>
                <p className="mt-4 text-muted-foreground">Clasa: clasa-6, Lecția: {lessonSlug}</p>
            </div>
        );
    }

    const pdfPath = `/lectii/informatica/clasa-6/${fileName}`; 

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