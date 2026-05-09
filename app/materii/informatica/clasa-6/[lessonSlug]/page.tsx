'use client';

import React from 'react';
import { Download, ArrowLeft, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Importăm vizualizatorul PDF fără SSR pentru a evita erorile de server (DOMMatrix)
const PDFViewer = dynamic(() => import('@/components/PDFViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center p-20 text-muted-foreground">
      <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
      <p className="animate-pulse font-medium">Se deschide manualul digital...</p>
    </div>
  )
});

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
    const fileName = fileMap[lessonSlug] || null;

    if (!fileName) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
                <div className="p-8 bg-card border border-border rounded-3xl text-center shadow-2xl animate-in zoom-in duration-300">
                    <h1 className="text-4xl font-black text-red-500 mb-4">404</h1>
                    <p className="text-xl font-bold mb-6">Lecția nu a fost găsită</p>
                    <Link href="/materii/informatica/clasa-6" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all">
                        <ArrowLeft size={18} /> Înapoi la listă
                    </Link>
                </div>
            </div>
        );
    }

    const pdfPath = encodeURI(`/lectii/informatica/clasa-6/${fileName}`); 
    const formattedTitle = lessonSlug.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return (
        <div className="relative min-h-screen bg-background text-foreground py-6 md:py-12 overflow-hidden">
            {/* STILURI PENTRU ANIMATII AVANSATE */}
            <style jsx>{`
                @keyframes orbit {
                    0% { transform: rotate(0deg) translateY(20px) rotate(0deg); }
                    100% { transform: rotate(360deg) translateY(20px) rotate(-360deg); }
                }
                .bg-orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(100px);
                    z-index: 0;
                    opacity: 0.15;
                    animation: orbit 20s linear infinite;
                }
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slide-up {
                    animation: slide-up 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                }
            `}</style>

            {/* ELEMENTE DE FUNDAL DINAMICE */}
            <div className="bg-orb top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary"></div>
            <div className="bg-orb bottom-[-5%] right-[-5%] w-[400px] h-[400px] bg-blue-500" style={{ animationDirection: 'reverse', animationDuration: '25s' }}></div>

            <div className="container mx-auto px-4 max-w-5xl relative z-10 flex flex-col items-center">
                
                {/* HEADER CU BUTON DE BACK SI DOWNLOAD */}
                <div className="w-full flex flex-col gap-6 mb-10 animate-slide-up">
                    <Link 
                        href="/materii/informatica/clasa-6" 
                        className="group self-start flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 hover:bg-primary hover:text-primary-foreground transition-all duration-300 backdrop-blur-md border border-border/50"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        <span className="font-bold text-sm">Înapoi la lista de lecții</span>
                    </Link>

                    <div className="flex flex-col md:flex-row justify-between items-center p-8 bg-card/60 backdrop-blur-xl border border-border rounded-[2.5rem] shadow-2xl shadow-primary/5 gap-6">
                        <div className="flex items-center gap-5 text-center md:text-left">
                            <div className="hidden sm:flex w-16 h-16 bg-primary/10 rounded-2xl items-center justify-center text-primary">
                                <FileText size={32} />
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.3em] text-primary/70 mb-1">Informatica • Clasa VI</p>
                                <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
                                    {formattedTitle}
                                </h1>
                            </div>
                        </div>

                        <a 
                            href={pdfPath} 
                            download 
                            className="group flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-black rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 hover:shadow-primary/40 active:scale-95"
                        >
                            <Download className="h-5 w-5 animate-bounce" />
                            DESCARCĂ PDF
                        </a>
                    </div>
                </div>

                {/* CONTAINER VIZUALIZATOR PDF CU DESIGN GLASSMORPHISM */}
                <div className="w-full bg-card/40 backdrop-blur-md p-2 md:p-8 rounded-[3rem] border border-border shadow-inner animate-slide-up" style={{ animationDelay: '200ms' }}>
                    <div className="overflow-hidden rounded-2xl shadow-2xl border border-border">
                        <PDFViewer pdfPath={pdfPath} />
                    </div>
                </div>

                {/* FOOTER BADGE */}
                <div className="mt-12 opacity-50 hover:opacity-100 transition-opacity animate-slide-up" style={{ animationDelay: '400ms' }}>
                    <div className="px-6 py-2 rounded-full border border-border bg-card/20 text-sm font-mono">
                        Source: /lectii/informatica/clasa-6/
                    </div>
                </div>
            </div>
        </div>
    );
}