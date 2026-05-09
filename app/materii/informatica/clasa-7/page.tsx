'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faLaptopCode, faVial, faFileAlt, faWindowMaximize, faCogs, faImage, faEdit, faCropAlt, faTable, 
    faUsers, faPhotoVideo, faVideo, faFileAudio, faFolderOpen, faSlidersH, faShareAlt, faLink, 
    faTasks, faTerminal, faCalculator, faFileCode, faExchangeAlt, faCodeBranch, faSyncAlt, 
    faRedo, faHistory,
    faDownload 
} from '@fortawesome/free-solid-svg-icons';

const lessons = [
    { slug: "editorul-de-texte", icon: faFileAlt, title: "1. Ce este un Editor de Texte?", pdfFile: "editorul de texte.pdf" },
    { slug: "interfata-word", icon: faWindowMaximize, title: "2. Interfața Aplicației Word", pdfFile: "interfata word.pdf" },
    { slug: "operatii-in-word", icon: faCogs, title: "3. Operații de Bază în Word", pdfFile: "Operatii in word.pdf" },
    { slug: "inserarea-obiectelor", icon: faImage, title: "4. Inserarea Obiectelor (Imagini, Tabele)", pdfFile: "inserarea obiectelor in document.pdf" },
    { slug: "operatii-de-editare", icon: faEdit, title: "5. Editarea Avansată a Documentelor", pdfFile: "operatii de editare intr-un doc.pdf" },
    { slug: "formatarea-imaginilor", icon: faCropAlt, title: "6. Formatarea Imaginilor", pdfFile: "formatarea imaginilor.pdf" },
    { slug: "formatarea-tabelelor-si-paginilor", icon: faTable, title: "7. Formatarea Tabelelor și Paginilor", pdfFile: "formatarea tabelelor si a paginilor.pdf" },
    { slug: "lucrul-colaborativ", icon: faUsers, title: "8. Lucrul Colaborativ pe Documente", pdfFile: "lucrul colaborativ cu documente.pdf" },
    { slug: "elemente-multimedia", icon: faPhotoVideo, title: "9. Elemente de Bază Multimedia", pdfFile: "elemente de baza multimedia.pdf" },
    { slug: "aplicatia-openshot", icon: faVideo, title: "10. Aplicația OpenShot", pdfFile: "Aplicația_OpenShot.pdf" },
    { slug: "tipuri-fisiere-multimedia", icon: faFileAudio, title: "11. Tipuri de Fișiere Multimedia", pdfFile: "Tipuri de fisiere multimedia.pdf" },
    { slug: "gestionarea-fisierelor-multimedia", icon: faFolderOpen, title: "12. Gestionarea Fișierelor Multimedia", pdfFile: "Gestionarea fisierelor multimedia.pdf" },
    { slug: "particularizarea-fisierelor-multimedia", icon: faSlidersH, title: "13. Particularizarea Fișierelor Multimedia", pdfFile: "particularizarea fisierelor multimedia.pdf" },
    { slug: "colaborare-fisiere-multimedia", icon: faShareAlt, title: "14. Colaborare pe Fișiere Multimedia", pdfFile: "lucrul colaborativ cu fisierele multimedia.pdf" },
    { slug: "conectarea-la-aplicatii-colaborative", icon: faLink, title: "15. Conectarea la Aplicații Colaborative", pdfFile: "Conectarea la aplicatia colaborativa.pdf" },
    { slug: "operatii-in-aplicatii-colaborative", icon: faTasks, title: "16. Operații în Aplicații Colaborative", pdfFile: "operatii permise in aplicatia colaborativa.pdf" },
    { slug: "mediu-dezvoltare-codeblocks", icon: faTerminal, title: "17. Mediul de Dezvoltare Code::Blocks", pdfFile: "mediu de dezvoltare codeblocks.pdf" },
    { slug: "operatori", icon: faCalculator, title: "18. Operatori în Programare", pdfFile: "operatori.pdf" },
    { slug: "structura-programelor", icon: faFileCode, title: "19. Structura unui Program C++", pdfFile: "structura programelor.pdf" },
    { slug: "citire-afisare-date", icon: faExchangeAlt, title: "20. Citirea și Afișarea Datelor (cin/cout)", pdfFile: "Operatii de citire si afisare a datelor.pdf" },
    { slug: "structura-alternativa-if", icon: faCodeBranch, title: "21. Structura Alternativă (if)", pdfFile: "structura alternativa if.pdf" },
    { slug: "structuri-repetitive-cpp", icon: faSyncAlt, title: "22. Structuri Repetitive în C++", pdfFile: "structuri repetitive in C++.pdf" },
    { slug: "instructiunea-for", icon: faRedo, title: "23. Instrucțiunea Repetitivă `for`", pdfFile: "instructiunea repetitiva for.pdf" },
    { slug: "instructiunea-do-while", icon: faHistory, title: "24. Instrucțiunea Repetitivă `do-while`", pdfFile: "instructiunea repetitiva do while.pdf" },
];

const navigationLinks = [
    { name: "Clasa a V-a", href: "/materii/informatica/clasa-5" },
    { name: "Clasa a VI-a", href: "/materii/informatica/clasa-6" },
    { name: "Clasa a VII-a", href: "/materii/informatica/clasa-7" },
    { name: "Clasa a VIII-a", href: "/materii/informatica/clasa-8" },
];

export default function Clasa7Page() {
    const pathname = usePathname();

    return (
        <div className="relative min-h-screen bg-background text-foreground py-10 overflow-hidden z-0">
            {/* INJECTARE ANIMATII CSS */}
            <style jsx>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(40px, -60px) scale(1.1); }
                    66% { transform: translate(-30px, 30px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob { animation: blob 8s infinite; }
                .animation-delay-2000 { animation-delay: 2s; }
                .animation-delay-4000 { animation-delay: 4s; }
                
                @keyframes gradient-text {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient-text {
                    background-size: 200% 200%;
                    animation: gradient-text 5s ease infinite;
                }

                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    opacity: 0;
                    animation: fade-in-up 0.5s ease-out forwards;
                }

                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
                .shimmer-effect::after {
                    content: '';
                    position: absolute;
                    top: 0; right: 0; bottom: 0; left: 0;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
                    transform: translateX(-100%);
                }
                .group:hover .shimmer-effect::after {
                    animation: shimmer 1s forwards;
                }
            `}</style>

            {/* FUNDAL CU SFERE ENERGETICE (VERDE/CYAN) */}
            <div className="absolute top-0 -left-10 w-96 h-96 bg-emerald-500/10 rounded-full mix-blend-screen filter blur-[120px] animate-blob -z-10"></div>
            <div className="absolute bottom-10 -right-10 w-96 h-96 bg-cyan-500/10 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000 -z-10"></div>

            <div className="container mx-auto px-4 max-w-6xl relative z-10">
                
                {/* HEADER CU ANIMATIE */}
                <header className="text-center mb-16 animate-fade-in-up">
                    <h1 className="text-4xl md:text-6xl font-black mb-4 flex items-center justify-center gap-5">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-500 animate-gradient-text">
                            LECȚII DE INFORMATICĂ
                        </span>
                        <FontAwesomeIcon icon={faLaptopCode} className="text-emerald-500 animate-bounce" />
                    </h1>
                    <div className="h-1 w-24 bg-emerald-500 mx-auto rounded-full mb-4 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                    <h2 className="text-xl md:text-2xl font-bold text-emerald-500/80 tracking-widest uppercase">Clasa a VII-a</h2>
                </header>

                {/* NAVIGARE STILIZATA */}
                <nav className="flex flex-wrap justify-center gap-3 mb-16 bg-card/30 backdrop-blur-md p-2 rounded-2xl w-fit mx-auto border border-border/40 shadow-xl animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    {navigationLinks.map((link) => (
                        <Link 
                            key={link.name}
                            href={link.href}
                            className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-500 ${
                                pathname === link.href 
                                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-600 text-white shadow-lg scale-105' 
                                    : 'text-muted-foreground hover:bg-background/60 hover:text-foreground'
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                <main>
                    {/* GRID DE LECTII WOW */}
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {lessons.map((lesson, index) => (
                            <li 
                                key={index} 
                                style={{ animationDelay: `${200 + index * 40}ms` }}
                                className="animate-fade-in-up group relative bg-card/40 backdrop-blur-md border border-border/40 rounded-[2rem] p-5 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:-translate-y-2 hover:border-emerald-500/40 transition-all duration-500 overflow-hidden"
                            >
                                {/* Shimmer overlay */}
                                <div className="shimmer-effect absolute inset-0 pointer-events-none"></div>

                                <div className="flex items-center justify-between relative z-10">
                                    <Link href={`${pathname}/${lesson.slug}`} className="flex items-center gap-5 flex-1 pr-4"> 
                                        
                                        {/* Icon Box */}
                                        <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 transition-all duration-500 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                                            <FontAwesomeIcon icon={lesson.icon} className="text-2xl" />
                                        </div>

                                        {/* Title */}
                                        <span className="font-bold text-[15px] sm:text-base leading-tight text-foreground/90 group-hover:text-emerald-400 transition-colors duration-300">
                                            {lesson.title}
                                        </span>
                                    </Link>

                                    {/* Download Circular Button */}
                                    <a 
                                        href={`/lectii/informatica/clasa-7/${encodeURI(lesson.pdfFile)}`}
                                        download
                                        className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-secondary/50 text-secondary-foreground hover:bg-emerald-500 hover:text-white transition-all duration-300 hover:scale-110 active:scale-90"
                                        aria-label={`Descarcă ${lesson.title}`}
                                        title="Descarcă PDF"
                                        onClick={(e) => e.stopPropagation()} 
                                    >
                                        <FontAwesomeIcon icon={faDownload} />
                                    </a>
                                </div>
                            </li>
                        ))}
                    </ul>
                </main>
                
                {/* FOOTER BADGE */}
                <div className="mt-20 flex flex-col items-center gap-4 pb-10 animate-fade-in-up" style={{ animationDelay: '1200ms' }}>
                    <div className="h-px w-full max-w-md bg-gradient-to-r from-transparent via-border to-transparent"></div>
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-card/40 backdrop-blur-md text-foreground font-bold text-sm border border-border/50 shadow-lg hover:scale-105 transition-all">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500">👨‍🏫</span> 
                        Prof. Cosin Daniel
                    </div>
                </div>

            </div>
        </div>
    );
}