'use client';

import React from 'react';
import { Download, ArrowLeft, FileCode, Sparkles, GraduationCap } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Importăm vizualizatorul PDF fără SSR pentru a evita erorile de server (DOMMatrix)
const PDFViewer = dynamic(() => import('@/components/PDFViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center p-20 text-emerald-500/60">
      <div className="w-14 h-14 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-6 shadow-[0_0_20px_rgba(16,185,129,0.3)]"></div>
      <p className="animate-pulse font-bold tracking-widest uppercase text-xs">Sistemul se inițializează...</p>
    </div>
  )
});

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
    const fileName = fileMap[lessonSlug] || null;

    if (!fileName) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
                <div className="p-10 bg-card border-2 border-emerald-500/20 rounded-[3rem] text-center shadow-2xl animate-in fade-in zoom-in duration-500">
                    <h1 className="text-5xl font-black text-emerald-500 mb-4">404</h1>
                    <p className="text-xl font-bold mb-8">Lecția nu a fost găsită!</p>
                    <Link href="/materii/informatica/clasa-7" className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-500 text-white font-bold rounded-2xl hover:scale-105 transition-all shadow-lg shadow-emerald-500/30">
                        <ArrowLeft size={18} /> Înapoi la listă
                    </Link>
                </div>
            </div>
        );
    }

    const pdfPath = encodeURI(`/lectii/informatica/clasa-7/${fileName}`); 
    const formattedTitle = lessonSlug.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return (
        <div className="relative min-h-screen bg-background text-foreground py-6 md:py-12 overflow-hidden">
            {/* ANIMAȚII CSS SUPER-WOW */}
            <style jsx>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob { animation: blob 10s infinite; }
                
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slide-up {
                    animation: slide-up 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                }

                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
                .shimmer-box::after {
                    content: '';
                    position: absolute;
                    top: 0; right: 0; bottom: 0; left: 0;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
                    transform: translateX(-100%);
                    animation: shimmer 3s infinite;
                }
            `}</style>

            {/* FUNDAL DINAMIC (EMERALD & TEAL) */}
            <div className="absolute top-[-5%] left-[-5%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] animate-blob -z-10"></div>
            <div className="absolute bottom-[-5%] right-[-5%] w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] animate-blob style={{ animationDelay: '4s' }} -z-10"></div>

            <div className="container mx-auto px-4 max-w-5xl relative z-10">
                
                {/* BUTON ÎNAPOI STILIZAT */}
                <div className="mb-8 animate-slide-up" style={{ animationDelay: '0ms' }}>
                    <Link 
                        href="/materii/informatica/clasa-7" 
                        className="group inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-card/40 backdrop-blur-md border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-sm transition-all hover:bg-emerald-500 hover:text-white hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] shadow-sm"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-2" />
                        <span>LECȚII CLASA VII</span>
                    </Link>
                </div>

                {/* CARD ANTET (Similara cu a 6-a dar mai luminoasă) */}
                <div className="w-full mb-12 animate-slide-up" style={{ animationDelay: '100ms' }}>
                    <div className="group relative flex flex-col md:flex-row justify-between items-center p-8 bg-card/50 backdrop-blur-2xl border border-emerald-500/20 rounded-[2.5rem] shadow-2xl overflow-hidden gap-8">
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:animate-shimmer pointer-events-none"></div>
                        
                        <div className="flex items-center gap-7">
                            <div className="relative">
                                <div className="absolute -inset-1 bg-emerald-500 rounded-2xl blur opacity-25 group-hover:opacity-60 transition duration-500"></div>
                                <div className="relative flex w-20 h-20 bg-emerald-500 rounded-2xl items-center justify-center text-white shadow-xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                    <FileCode size={35} />
                                </div>
                            </div>
                            
                            <div className="text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                    <Sparkles size={14} className="text-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/80">Digital Resources</span>
                                </div>
                                <h1 className="text-2xl md:text-4xl font-black tracking-tight text-foreground">
                                    {formattedTitle}
                                </h1>
                            </div>
                        </div>

                        <a 
                            href={pdfPath} 
                            download 
                            className="group flex items-center gap-3 px-10 py-5 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 hover:bg-emerald-500 active:scale-95"
                        >
                            <Download className="h-5 w-5 transition-transform group-hover:-translate-y-1" />
                            DESCARCĂ
                        </a>
                    </div>
                </div>

                {/* VIZUALIZATOR PDF (GLASS CONTAINER) */}
                <div className="w-full bg-card/30 backdrop-blur-xl p-3 md:p-10 rounded-[4rem] border border-border/50 shadow-inner animate-slide-up shimmer-box overflow-hidden" style={{ animationDelay: '200ms' }}>
                    <div className="relative bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl border-8 border-emerald-500/5">
                        <PDFViewer pdfPath={pdfPath} />
                    </div>
                </div>

                {/* FOOTER CURRICULUM */}
                <div className="mt-20 flex flex-col items-center gap-6 animate-slide-up pb-10" style={{ animationDelay: '400ms' }}>
                    <div className="h-px w-32 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent"></div>
                    <div className="flex items-center gap-3 text-emerald-500/50">
                        <GraduationCap size={20} />
                        <span className="text-[11px] font-mono tracking-[0.2em] uppercase">Curriculum Național • Informatica VII</span>
                    </div>
                </div>
            </div>
        </div>
    );
}