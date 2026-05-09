'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRocket, faLaptop, faHourglassHalf, faKeyboard, faPrint, faHeadset,
  faPuzzlePiece, faGlobeEurope, faNetworkWired, faSearchLocation, faPalette,
  faPaintBrush, faFileSignature, faLightbulb, faShapes, faCalculator,
  faBrain, faBalanceScale, faRoute, faWindowMaximize, faCodeBranch,
  faProjectDiagram, faCat, faClipboardCheck, faAward,
  faDownload 
} from '@fortawesome/free-solid-svg-icons';

const lessons =[
    { slug: "sistem-de-calcul", icon: faLaptop, title: "1. Ce este un Sistem de Calcul?", pdfFile: "sistem de calcul.pdf" },
    { slug: "istoric-calculatoare", icon: faHourglassHalf, title: "2. O Scurtă Istorie a Calculatoarelor", pdfFile: "Sisteme de calcul_Istoric.pdf" },
    { slug: "dispozitive-de-intrare", icon: faKeyboard, title: "3. Dispozitive de Intrare (Input)", pdfFile: "Dispozitive de intrare.pdf" },
    { slug: "dispozitive-de-iesire", icon: faPrint, title: "4. Dispozitive de Ieșire (Output)", pdfFile: "Dispozitive_de_iesire.pdf" },
    { slug: "dispozitive-mixte", icon: faHeadset, title: "5. Dispozitive Mixte (Intrare/Ieșire)", pdfFile: "Dispozitive de intrare-iesire.pdf" },
    { slug: "descrierea-software", icon: faPuzzlePiece, title: "6. Înțelegerea Părții Software", pdfFile: "Descrierea componentei software.pdf" },
    { slug: "internetul", icon: faGlobeEurope, title: "7. Internetul: Cum ne Conectăm?", pdfFile: "Internetul.pdf" },
    { slug: "world-wide-web", icon: faNetworkWired, title: "8. Explorând World Wide Web (WWW)", pdfFile: "Serviciul WORLD WIDE WEB.pdf" },
    { slug: "cautarea-informatiilor", icon: faSearchLocation, title: "9. Arta Căutării de Informații Online", pdfFile: "căutarea_informațiilor_pe_Internet.pdf" },
    { slug: "editare-grafica", icon: faPalette, title: "10. Introducere în Grafica pe Calculator", pdfFile: "Editoare grafice.pdf" },
    { slug: "instrumente-de-desenare", icon: faPaintBrush, title: "11. Unelte Digitale pentru Desen", pdfFile: "instrumente de desenare.pdf" },
    { slug: "inserare-formatare-text", icon: faFileSignature, title: "12. Cum Lucrăm cu Textul în Documente", pdfFile: "inserarea_și_formatarea_textului.pdf" },
    { slug: "algoritmi-proprietati", icon: faLightbulb, title: "13. Ce sunt Algoritmii și la ce Folosesc?", pdfFile: "Algoritmi- proprietăți.pdf" },
    { slug: "clasificarea-datelor", icon: faShapes, title: "14. Tipuri de Date în Lumea Algoritmilor", pdfFile: "clasificarea datelor algoritmilor.pdf" },
    { slug: "expresii-aritmetice", icon: faCalculator, title: "15. Facem Calcule: Expresii Aritmetice", pdfFile: "expresii  aritmetice.pdf" },
    { slug: "expresii-logice", icon: faBrain, title: "16. Gândire Logică: Expresii Adevărat/Fals", pdfFile: "expresii logice.pdf" },
    { slug: "operatori-relationali", icon: faBalanceScale, title: "17. Operatori Relaționali", pdfFile: "Operatori_relaționali.pdf" },
    { slug: "structura-liniara", icon: faRoute, title: "18. Structura Liniară", pdfFile: "structura_liniară.pdf" },
    { slug: "mediu-grafic-interactiv", icon: faWindowMaximize, title: "19. Medii Vizuale pentru Programare", pdfFile: "prezentarea mediului grafic interactiv.pdf" },
    { slug: "structura-alternativa", icon: faCodeBranch, title: "20. Structura Alternativă", pdfFile: "structura alternativa.pdf" },
    { slug: "reprezentarea-deciziilor", icon: faProjectDiagram, title: "21. Cum Reprezentăm Deciziile?", pdfFile: "Reprezentarea_structurii_alternative_înt.pdf" },
    { slug: "aplicatii-scratch", icon: faCat, title: "22. Să Creăm cu Scratch!", pdfFile: "Aplicații_Scratch.pdf" },
    { slug: "recapitulare-generala", icon: faClipboardCheck, title: "23. Recapitulare: Ce Am Învățat?", pdfFile: "Recapitulare.pdf" },
    { slug: "recapitulare-finala", icon: faAward, title: "Recapitulare Finală ;)", pdfFile: "recapitulare_finală.pdf" },
];

const navigationLinks =[
    { name: "Clasa a V-a", href: "/materii/informatica/clasa-5" },
    { name: "Clasa a VI-a", href: "/materii/informatica/clasa-6" },
    { name: "Clasa a VII-a", href: "/materii/informatica/clasa-7" },
    { name: "Clasa a VIII-a", href: "/materii/informatica/clasa-8" },
];

export default function Clasa5Page() {
    const pathname = usePathname();

    return (
        <div className="relative min-h-screen bg-background text-foreground py-10 overflow-hidden z-0">
            {/* STILURI INJECTATE PENTRU ANIMAȚII (MAGIA WOW) */}
            <style jsx>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob { animation: blob 7s infinite; }
                .animation-delay-2000 { animation-delay: 2s; }
                .animation-delay-4000 { animation-delay: 4s; }
                
                @keyframes gradient-x {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient-x {
                    background-size: 200% 200%;
                    animation: gradient-x 4s ease infinite;
                }

                @keyframes fade-in-up {
                    0% { opacity: 0; transform: translateY(30px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    opacity: 0;
                    animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }

                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
                .group:hover .animate-shimmer {
                    animation: shimmer 1s forwards;
                }
            `}</style>

            {/* FUNDAL ANIMAT CU SFERE (ORBS) BLURATE */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob -z-10"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-2000 -z-10"></div>
            <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-4000 -z-10"></div>

            <div className="container mx-auto px-4 max-w-6xl relative z-10">
                
                {/* ANTET CU GRADIENT ANIMAT */}
                <header className="text-center mb-14 animate-fade-in-up" style={{ animationDelay: '0ms' }}>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 flex items-center justify-center gap-4">
                        <FontAwesomeIcon icon={faRocket} className="text-primary animate-bounce" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-purple-600 animate-gradient-x drop-shadow-sm">
                            LECȚII DE INFORMATICĂ
                        </span>
                    </h1>
                    <h2 className="text-xl md:text-2xl font-bold text-muted-foreground/80 tracking-wide uppercase tracking-widest">
                        Clasa a V-a
                    </h2>
                </header>

                {/* NAVIGARE STILIZATĂ (PILL DESIGN) */}
                <nav className="flex flex-wrap justify-center gap-2 mb-14 bg-secondary/40 backdrop-blur-md p-2.5 rounded-[2rem] w-fit mx-auto border border-border/50 shadow-lg animate-fade-in-up" style={{ animationDelay: '150ms' }} aria-label="Selectează clasa">
                    {navigationLinks.map((link) => (
                        <Link 
                            key={link.name}
                            href={link.href}
                            className={`px-6 py-2.5 rounded-full font-bold transition-all duration-500 ${
                                pathname === link.href 
                                    ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-[0_0_20px_rgba(0,0,0,0.2)] scale-105' 
                                    : 'text-muted-foreground hover:bg-background/80 hover:text-foreground hover:shadow-sm'
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                <main>
                    {/* GRID DE LECȚII CU INTRARE ÎN CASCADĂ (STAGGERED) ȘI GLASSMORPHISM */}
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {lessons.map((lesson, index) => (
                            <li 
                                key={index} 
                                // Calculăm un delay crescător pentru ca elementele să apară pe rând
                                style={{ animationDelay: `${250 + index * 50}ms` }}
                                className="animate-fade-in-up group relative flex items-center justify-between bg-card/60 backdrop-blur-xl border border-border/40 rounded-3xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-2 hover:border-primary/50 transition-all duration-500 overflow-hidden"
                            >
                                {/* Efect de rază de lumină (Shimmer) la hover */}
                                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer z-0 pointer-events-none"></div>

                                <Link href={`${pathname}/${lesson.slug}`} className="flex items-center gap-5 flex-1 pr-4 relative z-10"> 
                                    
                                    {/* Iconița cu rotație și glow */}
                                    <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6 group-hover:shadow-[0_0_20px_rgba(var(--primary),0.4)] group-hover:text-primary-foreground group-hover:from-primary group-hover:to-blue-600 border border-primary/10">
                                        <FontAwesomeIcon icon={lesson.icon} className="text-2xl transition-transform duration-500" />
                                    </div>

                                    {/* Textul lecției */}
                                    <span className="font-bold text-[16px] sm:text-[17px] leading-snug text-foreground/90 transition-colors duration-300 group-hover:text-primary group-hover:drop-shadow-sm">
                                        {lesson.title}
                                    </span>
                                </Link>

                                {/* Butonul de descărcare mai interactiv */}
                                <a 
                                    href={`/lectii/informatica/clasa-5/${encodeURI(lesson.pdfFile)}`}
                                    download
                                    className="relative z-10 flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-secondary/80 text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110 hover:rotate-12 hover:shadow-[0_0_15px_rgba(var(--primary),0.4)] active:scale-95"
                                    aria-label={`Descarcă lecția ${lesson.title}`}
                                    title={`Descarcă lecția ${lesson.title}`}
                                    onClick={(e) => e.stopPropagation()} 
                                >
                                    <FontAwesomeIcon icon={faDownload} className="text-lg" />
                                </a>
                            </li>
                        ))}
                    </ul>
                </main>
                
                {/* Subsol plutitor */}
                <div className="mt-20 flex justify-center pb-10 animate-fade-in-up" style={{ animationDelay: `${250 + lessons.length * 50}ms` }}>
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-card/60 backdrop-blur-md text-foreground font-bold text-sm border border-border/50 shadow-lg transition-transform hover:scale-110 hover:shadow-primary/20 cursor-default">
                        <span className="text-xl">👨‍🏫</span> Prof. Cosin Daniel
                    </div>
                </div>

            </div>
        </div>
    );
}