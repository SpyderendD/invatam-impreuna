'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faRocket, faVial, faFilePowerpoint, faSlidersH, faCopy, faMagic, faChalkboardTeacher, faCube, 
    faFilm, faUserShield, faCat, faVrCardboard, faEnvelopeOpenText, faUserPlus, 
    faBalanceScaleLeft, faPenFancy, faTools, faMailBulk, faCode, 
    faProjectDiagram, faFileCode, faSyncAlt, faTasks, faInfinity,
    faDownload 
} from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

const lessons = [
    { slug: "test-initial", icon: faVial, title: "1. Test inițial", pdfFile: "TEST_DE_EVALUARE_INIȚIALĂ a 6-a.pdf" },
    { slug: "prezentare-si-aplicatii", icon: faFilePowerpoint, title: "2. Prezentare și aplicații de prezentare", pdfFile: "Prezentare_și_aplicații_de_prezentare-l1.pdf" },
    { slug: "prezentarea-detaliata-a-barelor", icon: faSlidersH, title: "3. Prezentarea detaliată a barelor de opțiuni", pdfFile: "Prezentarea_detaliată_a_barelor_de_opțiu.pdf" },
    { slug: "operatii-de-lucru-cu-diapozitivele", icon: faCopy, title: "4. Operații de lucru cu diapozitivele", pdfFile: "Operații_de_lucru_cu_diapozitivele.pdf" },
    { slug: "elemente-de-design-al-prezentarii", icon: faMagic, title: "5. Elemente de design al prezentării", pdfFile: "Elemente_de_design_al_prezentării.pdf" },
    { slug: "realizarea-unei-prezentari", icon: faChalkboardTeacher, title: "6. Realizarea unei prezentări", pdfFile: "Realizarea_unei_prezentări.pdf" },
    { slug: "grafica-3d-scop-si-avantaje", icon: faCube, title: "7. Grafica 3d-scop și avantaje", pdfFile: "Grafica 3D - scop si avantaje.pdf" },
    { slug: "structura-unei-animatii-grafice", icon: faFilm, title: "8. Structura unei animații grafice", pdfFile: "structura unei animatii grafice.pdf" },
    { slug: "masuri-de-securitate", icon: faUserShield, title: "9. Măsuri de securitate pe Internet", pdfFile: "Măsuri_de_siguranță_în_utilizarea_Intern.pdf" },
    { slug: "animatii-grafice-in-scratch", icon: faCat, title: "10. Animații grafice în Scratch", pdfFile: "Animații_grafice_în_Scratch.pdf" },
    { slug: "obiecte-3d-in-powerpoint", icon: faVrCardboard, title: "11. Obiecte 3D în PowerPoint", pdfFile: "Obiecte_3D_în_PowerPoint.pdf" },
    { slug: "toontastic", icon: faVrCardboard, title: "12. Toontastic", pdfFile: "toontastic-elemente_de_interfață.pdf" },
    { slug: "posta-electronica", icon: faEnvelopeOpenText, title: "13. Poșta electronică", pdfFile: "posta electronica.pdf" },
    { slug: "crearea-unui-cont-de-email", icon: faUserPlus, title: "14. Crearea unui cont de e-mail", pdfFile: "Crearea unui cont de e-mail.pdf" },
    { slug: "avantaje-si-dezavantaje-email", icon: faBalanceScaleLeft, title: "15. Avantaje și dezavantaje e-mail", pdfFile: "avantaje si dezavantaje e-mail.pdf" },
    { slug: "reguli-de-comunicare", icon: faPenFancy, title: "16. Reguli de comunicare", pdfFile: "structura unui e-mail. reguli de comunic.pdf" },
    { slug: "gmail-elemente-de-interfata", icon: faGoogle, title: "17. Gmail-elemente de interfață", pdfFile: "Gmail-elemente_de_interfață.pdf" },
    { slug: "configurare-outlook-2007", icon: faTools, title: "18. Configurare Outlook 2007", pdfFile: "configurare outlook 2007.pdf" },
    { slug: "aplicatia-microsoft-outlook", icon: faMailBulk, title: "19. Aplicația Microsoft Outlook", pdfFile: "Aplicația_Microsoft_Outlook.pdf" },
    { slug: "elementele-de-baza-algoritmilor", icon: faCode, title: "20. Elemente de bază utilizate în exersarea algoritmilor", pdfFile: "Elementele_de_bază_utilizate_în_exersare.pdf" },
    { slug: "schema-logica", icon: faProjectDiagram, title: "21. Schema logică", pdfFile: "Schema_logică.pdf" },
    { slug: "limbajul-pseudocod", icon: faFileCode, title: "22. Limbajul pseudocod", pdfFile: "Limbajul pseudocod.pdf" },
    { slug: "structuri-repetitive", icon: faSyncAlt, title: "23. Structuri repetitive", pdfFile: "structuri repetitive.pdf" },
    { slug: "structura-repetitiva-cu-nr-cunoscut", icon: faTasks, title: "24. Structura repetitivă cu număr cunoscut de pași", pdfFile: "structura repetitiva cu nr cunoscut de p.pdf" },
    { slug: "reprezentarea-structurilor-repetitive", icon: faProjectDiagram, title: "25. Reprezentarea structurilor într-un mediu grafic", pdfFile: "reprezentarea structurilor repetitive.do.pdf" },
    { slug: "realizarea-unui-material-digital", icon: faChalkboardTeacher, title: "26. Realizarea unui material digital", pdfFile: "Realizarea unui material digital.pdf" },
    { slug: "structura-repetitiva-cu-test-final", icon: faInfinity, title: "27. Structura repetitivă cu test final", pdfFile: "Structura_repetitivă_cu_test_final.pdf" },
];

const navigationLinks = [
    { name: "Clasa a V-a", href: "/materii/informatica/clasa-5" },
    { name: "Clasa a VI-a", href: "/materii/informatica/clasa-6" },
    { name: "Clasa a VII-a", href: "/materii/informatica/clasa-7" },
    { name: "Clasa a VIII-a", href: "/materii/informatica/clasa-8" },
];

export default function Clasa6Page() {
    const pathname = usePathname();

    return (
        <div className="relative min-h-screen bg-background text-foreground py-10 overflow-hidden z-0">
            {/* STILURI ANIMATII WOW */}
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

            {/* FUNDAL ANIMAT ORBS */}
            <div className="absolute top-10 right-20 w-80 h-80 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob -z-10"></div>
            <div className="absolute bottom-20 left-10 w-80 h-80 bg-primary/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-2000 -z-10"></div>
            <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-400 -z-10"></div>

            <div className="container mx-auto px-4 max-w-6xl relative z-10">
                
                {/* ANTET CU GRADIENT */}
                <header className="text-center mb-14 animate-fade-in-up">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 flex items-center justify-center gap-4">
                        <FontAwesomeIcon icon={faRocket} className="text-primary animate-bounce" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-indigo-600 animate-gradient-x">
                            LECȚII DE INFORMATICĂ
                        </span>
                    </h1>
                    <h2 className="text-xl md:text-2xl font-bold text-muted-foreground/80 tracking-[0.2em] uppercase">
                        Clasa a VI-a
                    </h2>
                </header>

                {/* NAVIGARE MODERNA */}
                <nav className="flex flex-wrap justify-center gap-2 mb-14 bg-card/40 backdrop-blur-md p-2 rounded-full w-fit mx-auto border border-border/50 shadow-xl animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    {navigationLinks.map((link) => (
                        <Link 
                            key={link.name}
                            href={link.href}
                            className={`px-6 py-2 rounded-full font-bold transition-all duration-500 ${
                                pathname === link.href 
                                    ? 'bg-gradient-to-r from-primary to-indigo-600 text-white shadow-lg scale-105' 
                                    : 'text-muted-foreground hover:bg-background/80 hover:text-foreground'
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                <main>
                    {/* GRID LECTII REPARAT + ANIMAT */}
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {lessons.map((lesson, index) => (
                            <li 
                                key={index} 
                                style={{ animationDelay: `${200 + index * 40}ms` }}
                                className="animate-fade-in-up group relative flex items-center justify-between bg-card/50 backdrop-blur-xl border border-border/40 rounded-[2rem] p-5 shadow-sm hover:shadow-2xl hover:-translate-y-2 hover:border-primary/40 transition-all duration-500 overflow-hidden"
                            >
                                {/* Shimmer Effect */}
                                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-shimmer z-0 pointer-events-none"></div>

                                <Link href={`${pathname}/${lesson.slug}`} className="flex items-center gap-5 flex-1 pr-4 relative z-10"> 
                                    
                                    {/* Icon Container */}
                                    <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-transparent text-primary transition-all duration-500 group-hover:scale-110 group-hover:-rotate-12 group-hover:bg-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/30">
                                        <FontAwesomeIcon icon={lesson.icon} className="text-2xl" />
                                    </div>

                                    {/* Titlu lectie */}
                                    <span className="font-bold text-[15px] sm:text-base leading-snug text-foreground/90 group-hover:text-primary transition-colors duration-300">
                                        {lesson.title}
                                    </span>
                                </Link>

                                {/* Download Button */}
                                <a 
                                    href={`/lectii/informatica/clasa-6/${encodeURI(lesson.pdfFile)}`}
                                    download
                                    className="relative z-10 flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-full bg-secondary/80 text-secondary-foreground hover:bg-primary hover:text-white transition-all duration-300 hover:scale-110 active:scale-95 shadow-sm"
                                    aria-label={`Descarcă ${lesson.title}`}
                                    title={`Descarcă ${lesson.title}`}
                                    onClick={(e) => e.stopPropagation()} 
                                >
                                    <FontAwesomeIcon icon={faDownload} />
                                </a>
                            </li>
                        ))}
                    </ul>
                </main>
                
                {/* Footer Badge */}
                <div className="mt-20 flex justify-center pb-10 animate-fade-in-up" style={{ animationDelay: '1000ms' }}>
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-card/40 backdrop-blur-md text-foreground font-bold text-sm border border-border/50 shadow-lg hover:scale-105 transition-transform cursor-default">
                        <span className="bg-primary/20 p-1 rounded-full text-lg">👨‍🏫</span> 
                        Prof. Cosin Daniel
                    </div>
                </div>

            </div>
        </div>
    );
}