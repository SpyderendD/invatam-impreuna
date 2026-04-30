'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faAtom, faVial, faTable, faFillDrip, faCalculator, faChartPie, faCode, faWindowMaximize, 
    faSitemap, faEdit, faListUl, faPaintRoller, faStream, faDigitalTachograph, faDivide, 
    faSortNumericUp, faRandom, faKeyboard, faMicroscope, faRobot, faSatelliteDish, faRoad, faMapSigns,
    faDownload 
} from '@fortawesome/free-solid-svg-icons';
import { faCss3Alt } from '@fortawesome/free-brands-svg-icons';

const lessons = [
    { slug: "test-initial", icon: faVial, title: "1. Test Inițial Aprofundat", pdfFile: "TEST_DE_EVALUARE_INIȚIALĂ_a_8-a.pdf" },
    { slug: "aplicatia-calcul-tabelar", icon: faTable, title: "2. Calcul Tabelar: Expertiză", pdfFile: "Aplicatia de calcul tabelar.pdf" },
    { slug: "formatare-tipuri-de-date", icon: faFillDrip, title: "3. Formatare Avansată & Tipuri de Date", pdfFile: "operatii de formatare si tipuri de date.pdf" },
    { slug: "formule-si-functii", icon: faCalculator, title: "4. Maeștri în Formule și Funcții", pdfFile: "Formule si functii.pdf" },
    { slug: "serii-de-date-si-grafice", icon: faChartPie, title: "5. Vizualizarea Datelor: Grafice Dinamice", pdfFile: "Serii de date si grafice.pdf" },
    { slug: "editorul-de-pagini-web", icon: faCode, title: "6. Arhitectura Web: HTML Esențial", pdfFile: "Editorul de pagini Web.pdf" },
    { slug: "elemente-de-interfata-editoare", icon: faWindowMaximize, title: "7. Interfețe Moderne pentru Web Design", pdfFile: "Elemente de interfata ale editoarelor de site.pdf" },
    { slug: "structura-paginii-web", icon: faSitemap, title: "8. Scheletul Paginilor Web Profi", pdfFile: "Structura paginii Web.pdf" },
    { slug: "editarea-elementelor-web", icon: faEdit, title: "9. Manipularea Elementelor HTML", pdfFile: "Editarea elementelor din pagina Web.pdf" },
    { slug: "liste-si-imagini-html", icon: faListUl, title: "10. Liste Inteligente și Imagini Optimizate", pdfFile: "Liste si imagini in HTML.pdf" },
    { slug: "formatarea-elementelor-web", icon: faCss3Alt, title: "11. Stiluri CSS: Design Captivant", pdfFile: "Formatarea elementelor din pagina Web.pdf" },
    { slug: "activitate-practica-formatare", icon: faPaintRoller, title: "12. Lab: Stiluri Web Creative", pdfFile: "activitate practica- formatarea elementelor din pagina web.pdf" },
    { slug: "sirul-de-valori", icon: faStream, title: "13. Procesarea Șirurilor de Valori", pdfFile: "Sirul de valori.pdf" },
    { slug: "prelucrarea-cifrelor", icon: faDigitalTachograph, title: "14. Algoritmi pe Cifrele Numerelor", pdfFile: "Prelucrarea cifrelor unui numar.pdf" },
    { slug: "prelucrarea-divizorilor", icon: faDivide, title: "15. Explorarea Divizorilor: Algoritmi", pdfFile: "Prelucrarea divizorilor unui numar.pdf" },
    { slug: "numararea-unui-eveniment", icon: faSortNumericUp, title: "16. Contorizarea Evenimentelor în Algoritmi", pdfFile: "Numararea unui eveniment.pdf" },
    { slug: "siruri-de-valori-generate", icon: faRandom, title: "17. Generarea Dinamică a Șirurilor", pdfFile: "Siruri de valori generate.pdf" },
    { slug: "siruri-de-valori-citite", icon: faKeyboard, title: "18. Interacțiunea cu Utilizatorul: Citirea Șirurilor", pdfFile: "Siruri de valori citite.pdf" },
    { slug: "algoritmi-interdisciplinari", icon: faMicroscope, title: "19. Conexiuni: Algoritmi Interdisciplinari", pdfFile: "Algoritmi interdisciplinari.pdf" },
    { slug: "robotul-didactic-obstacole", icon: faRobot, title: "20. Robotică: Navigare Inteligentă", pdfFile: "Robotul didactic - detectarea si evitarea obstacolelor.pdf" },
    { slug: "activitate-practica-evitarea-obstacolelor", icon: faRobot, title: "21. Lab: Evitarea Obstacolelor", pdfFile: "activitate practica - evitarea obstacolelor.pdf" },
    { slug: "urmarirea-liniei-traseu", icon: faRoad, title: "22. Roboți Urmăritori de Linie", pdfFile: "urmarirea liniei unui traseu marcat.pdf" },
    { slug: "parcurgerea-unui-traseu", icon: faMapSigns, title: "23. Parcurgerea Autonomă a Traseelor", pdfFile: "Parcurgerea unui traseu marcat.pdf" },
];

const navigationLinks = [
    { name: "Clasa a V-a", href: "/materii/informatica/clasa-5" },
    { name: "Clasa a VI-a", href: "/materii/informatica/clasa-6" },
    { name: "Clasa a VII-a", href: "/materii/informatica/clasa-7" },
    { name: "Clasa a VIII-a", href: "/materii/informatica/clasa-8" },
];

export default function Clasa8Page() {
    const pathname = usePathname();

    return (
        <div className="relative min-h-screen bg-background text-foreground py-10 overflow-hidden">
            {/* ANIMAȚII CSS ADAPTIVE */}
            <style jsx>{`
                @keyframes float-slow {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    33% { transform: translate(2vw, -3vh) rotate(2deg); }
                    66% { transform: translate(-1vw, 2vh) rotate(-1deg); }
                }
                .animate-float-slow {
                    animation: float-slow 15s ease-in-out infinite;
                }

                @keyframes gradient-bg {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient-text {
                    background-size: 200% auto;
                    animation: gradient-bg 3s linear infinite;
                }

                @keyframes entrance {
                    from { opacity: 0; transform: scale(0.9) translateY(20px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .lesson-card {
                    opacity: 0;
                    animation: entrance 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                }
            `}</style>

            {/* FUNDAL ADAPTIV - Folosește culorile temei tale (Primary și Accent) */}
            <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px] animate-float-slow"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px] animate-float-slow" style={{ animationDelay: '-5s' }}></div>

            <div className="container mx-auto px-4 max-w-6xl relative z-10">
                
                {/* HEADER - Textul se adaptează culorii primare a temei */}
                <header className="text-center mb-16 lesson-card" style={{ animationDelay: '0ms' }}>
                    <div className="inline-flex items-center justify-center p-4 mb-6 rounded-3xl bg-primary/10 border border-primary/20 shadow-inner">
                        <FontAwesomeIcon icon={faAtom} className="text-4xl text-primary animate-spin" style={{ animationDuration: '8s' }} />
                    </div>
                    <h1 className="text-4xl md:text-7xl font-black tracking-tight mb-4">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-foreground to-primary animate-gradient-text">
                            LECȚII DE INFORMATICĂ
                        </span>
                    </h1>
                    <h2 className="text-sm md:text-base font-bold tracking-[0.4em] uppercase opacity-60">
                         • Clasa a VIII-a •
                    </h2>
                </header>

                {/* NAVIGARE - Complet integrată cu tema */}
                <nav className="flex flex-wrap justify-center gap-2 mb-16 bg-card/40 backdrop-blur-xl p-2 rounded-2xl border border-border shadow-xl lesson-card" style={{ animationDelay: '100ms' }}>
                    {navigationLinks.map((link) => (
                        <Link 
                            key={link.name}
                            href={link.href}
                            className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-300 ${
                                pathname === link.href 
                                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105' 
                                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                <main>
                    {/* GRID DE LECȚII - Stil Glassmorphism curat */}
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {lessons.map((lesson, index) => (
                            <li 
                                key={index} 
                                style={{ animationDelay: `${150 + index * 40}ms` }}
                                className="lesson-card group relative flex items-center justify-between bg-card/40 backdrop-blur-md border border-border/80 rounded-[2rem] p-5 transition-all duration-500 hover:-translate-y-2 hover:border-primary/50 hover:bg-card/80 hover:shadow-2xl hover:shadow-primary/10"
                            >
                                <Link href={`${pathname}/${lesson.slug}`} className="flex items-center gap-5 flex-1 pr-4"> 
                                    
                                    {/* Icon Container */}
                                    <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-2xl bg-secondary/80 text-primary transition-all duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground group-hover:rotate-6 shadow-sm">
                                        <FontAwesomeIcon icon={lesson.icon} className="text-2xl" />
                                    </div>

                                    {/* Info Text */}
                                    <div className="flex flex-col">
                                        <span className="font-bold text-[15px] leading-tight text-foreground transition-colors group-hover:text-primary">
                                            {lesson.title}
                                        </span>
                                        <span className="text-[10px] font-semibold text-muted-foreground uppercase mt-1 tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                            Explorează modulul
                                        </span>
                                    </div>
                                </Link>

                                {/* Buton Descărcare */}
                                <a 
                                    href={`/lectii/informatica/clasa-8/${encodeURI(lesson.pdfFile)}`}
                                    download
                                    className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary/5 text-primary border border-primary/10 hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110 active:scale-90"
                                    aria-label={`Descarcă ${lesson.title}`}
                                    onClick={(e) => e.stopPropagation()} 
                                >
                                    <FontAwesomeIcon icon={faDownload} />
                                </a>
                            </li>
                        ))}
                    </ul>
                </main>
                
                {/* FOOTER BADGE - Adaptive */}
                <div className="mt-24 flex justify-center pb-10 lesson-card" style={{ animationDelay: '1000ms' }}>
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-card/60 backdrop-blur-md text-foreground font-bold text-sm border border-border shadow-lg transition-transform hover:scale-105">
                        <span className="text-primary animate-pulse text-lg">●</span> 
                        Prof. Cosin Daniel
                    </div>
                </div>

            </div>
        </div>
    );
}