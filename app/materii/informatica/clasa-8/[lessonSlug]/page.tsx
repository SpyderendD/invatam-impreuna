'use client';

import React from 'react';
import { Download, ArrowLeft, Cpu, ShieldCheck, Zap } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Importăm vizualizatorul PDF fără SSR pentru a evita erorile de server (DOMMatrix)
const PDFViewer = dynamic(() => import('@/components/PDFViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center p-20">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin"></div>
        <Zap className="absolute inset-0 m-auto text-primary animate-pulse" size={24} />
      </div>
      <p className="mt-6 text-sm font-black tracking-[0.3em] uppercase text-primary/60">Securing Connection...</p>
    </div>
  )
});

const fileMap: { [slug: string]: string } = {
    'test-initial': 'TEST_DE_EVALUARE_INIȚIALĂ_a_8-a.pdf',
    'aplicatia-calcul-tabelar': 'Aplicatia de calcul tabelar.pdf',
    'formatare-tipuri-de-date': 'operații de formatare și tipuri de date.pdf',
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
    const fileName = fileMap[lessonSlug] || null;

    if (!fileName) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="relative p-12 bg-card border border-border rounded-[3rem] shadow-2xl text-center max-w-md animate-in fade-in zoom-in duration-500">
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-primary rounded-3xl flex items-center justify-center shadow-2xl rotate-12">
                        <Cpu className="text-white" size={40} />
                    </div>
                    <h1 className="text-4xl font-black mb-4 mt-4 text-foreground">404</h1>
                    <p className="text-muted-foreground font-medium mb-8">Protocolul de date pentru această lecție a fost întrerupt.</p>
                    <Link href="/materii/informatica/clasa-8" className="flex items-center justify-center gap-2 w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:scale-105 transition-all">
                        <ArrowLeft size={20} /> RESTORE CONNECTION
                    </Link>
                </div>
            </div>
        );
    }

    const pdfPath = encodeURI(`/lectii/informatica/clasa-8/${fileName}`); 
    const formattedTitle = lessonSlug.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return (
        <div className="relative min-h-screen bg-background text-foreground py-8 md:py-14 overflow-hidden">
            {/* CSS PENTRU EFECTE SUPERBE */}
            <style jsx>{`
                @keyframes pulse-ring {
                    0% { transform: scale(0.33); opacity: 0; }
                    80%, 100% { opacity: 0; }
                }
                .bg-glow {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(140px);
                    z-index: 0;
                    opacity: 0.15;
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-25px); }
                }
                .animate-float {
                    animation: float 8s ease-in-out infinite;
                }
                @keyframes shimmer {
                    from { left: -100%; }
                    to { left: 100%; }
                }
                .shimmer-line::after {
                    content: '';
                    position: absolute;
                    top: 0; bottom: 0; width: 100px;
                    background: linear-gradient(to right, transparent, rgba(var(--primary), 0.1), transparent);
                    animation: shimmer 4s infinite;
                }
            `}</style>

            {/* FUNDAL DINAMIC EVOLUAT */}
            <div className="bg-glow top-[-10%] right-[-10%] w-[700px] h-[700px] bg-primary/20 animate-pulse"></div>
            <div className="bg-glow bottom-[-5%] left-[-5%] w-[600px] h-[600px] bg-blue-600/10" style={{ animationDelay: '2s' }}></div>

            <div className="container mx-auto px-4 max-w-5xl relative z-10">
                
                {/* BUTON BACK MINIMALIST-TECH */}
                <div className="mb-10 flex items-center justify-between">
                    <Link 
                        href="/materii/informatica/clasa-8" 
                        className="group flex items-center gap-3 px-6 py-2.5 rounded-full bg-card/40 backdrop-blur-md border border-border/50 text-foreground transition-all hover:bg-primary hover:text-white hover:border-primary shadow-lg"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-2" />
                        <span className="text-xs font-black uppercase tracking-widest text-[10px]">Înapoi la lecții</span>
                    </Link>
                    
                    <div className="hidden md:flex items-center gap-2 text-primary/40 font-mono text-[10px] tracking-widest uppercase">
                        <ShieldCheck size={14} />
                        Verified Learning Resource
                    </div>
                </div>

                {/* CARD ANTET - DESIGN PREMIUM */}
                <div className="w-full mb-12 animate-in fade-in slide-in-from-top-6 duration-700">
                    <div className="relative group overflow-hidden p-10 bg-card/30 backdrop-blur-3xl border border-border/60 rounded-[3.5rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
                        
                        {/* Shimmer Effect pe fundalul cardului */}
                        <div className="absolute inset-0 shimmer-line opacity-30 pointer-events-none"></div>

                        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10 text-center md:text-left">
                            <div className="relative flex items-center justify-center w-20 h-20 bg-primary text-white rounded-[2rem] shadow-[0_15px_30px_rgba(var(--primary),0.3)] animate-float">
                                <Cpu size={36} />
                                <div className="absolute -inset-2 bg-primary/20 rounded-[2.2rem] animate-pulse"></div>
                            </div>
                            
                            <div>
                                <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none text-foreground">
                                    {formattedTitle}
                                </h1>
                            </div>
                        </div>

                        <a 
                            href={pdfPath} 
                            download 
                            className="relative z-10 group flex items-center gap-4 px-10 py-5 bg-foreground text-background font-black rounded-3xl transition-all hover:scale-105 hover:bg-primary hover:text-white active:scale-95 shadow-2xl"
                        >
                            <Download className="h-6 w-6 transition-transform group-hover:-translate-y-1" />
                            DESCARCĂ LECȚIA
                        </a>
                    </div>
                </div>

                {/* PDF VIEWER DEEP CONTAINER */}
                <div className="w-full p-2 md:p-6 bg-card/20 backdrop-blur-sm rounded-[4rem] border border-border shadow-inner animate-in fade-in duration-1000 slide-in-from-bottom-8">
                    <div className="relative overflow-hidden rounded-[3rem] shadow-2xl shadow-black/20 border border-border/40">
                        {/* Overlay subtil gradient peste PDF */}
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black/5 to-transparent pointer-events-none z-10"></div>
                        
                        <div className="bg-white dark:bg-[#0f172a]">
                            <PDFViewer pdfPath={pdfPath} />
                        </div>
                    </div>
                </div>

                {/* FOOTER DATA */}
                <div className="mt-20 flex flex-col items-center animate-in fade-in duration-1000 delay-500">
                    <div className="w-16 h-1 rounded-full bg-primary/20 mb-6"></div>
                    <div className="flex items-center gap-6 text-muted-foreground/40 font-mono text-[10px] tracking-[0.3em] uppercase">
                        <span>Prof. Costin Daviel</span>
                        <div className="w-2 h-2 rounded-full bg-primary animate-ping"></div>
                        <span>Mera Alin David</span>
                    </div>
                </div>
            </div>
        </div>
    );
}