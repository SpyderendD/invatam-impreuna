// app/materii/informatica/clasa-5/page.tsx
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
  faDownload // NOU: Am importat iconița de descărcare
} from '@fortawesome/free-solid-svg-icons';

import './Clasa5.css';

// NOU: Am adăugat proprietatea `pdfFile` pentru fiecare lecție.
// Acum, acest array este singura sursă de adevăr.
const lessons = [
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

const navigationLinks = [
    { name: "Clasa a V-a", href: "/materii/informatica/clasa-5" },
    { name: "Clasa a VI-a", href: "/materii/informatica/clasa-6" },
    { name: "Clasa a VII-a", href: "/materii/informatica/clasa-7" },
    { name: "Clasa a VIII-a", href: "/materii/informatica/clasa-8" },
];

export default function Clasa5Page() {
    const pathname = usePathname();

    return (
        <div className="clasa5-page-wrapper">
            <div className="container">
                <header className="site-header">
                    <h1><FontAwesomeIcon icon={faRocket} className="header-icon" /> LECȚII DE INFORMATICĂ</h1>
                    <h2>Clasa a V-a</h2>
                </header>

                <nav className="class-selector-nav" aria-label="Selectează clasa">
                    {navigationLinks.map((link) => (
                        <Link 
                            key={link.name}
                            href={link.href}
                            className={pathname === link.href ? 'active-class' : ''}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                <main className="site-content">
                    <ul className="lesson-grid">
                        {lessons.map((lesson, index) => (
                            <li key={index} className="lesson-item" data-item-index={index}>
                                {/* NOU: Link-ul principal ocupă acum doar textul */}
                                <Link href={`${pathname}/${lesson.slug}`} className="lesson-link"> 
                                    <span className="lesson-icon">
                                        <FontAwesomeIcon icon={lesson.icon} />
                                    </span>
                                    <span>{lesson.title}</span>
                                </Link>

                                {/* NOU: Butonul de descărcare */}
                                <a 
                                    href={`/lectii/informatica/clasa-5/${lesson.pdfFile}`}
                                    download
                                    className="download-button"
                                    aria-label={`Descarcă lecția ${lesson.title}`}
                                    title={`Descarcă lecția ${lesson.title}`}
                                    onClick={(e) => e.stopPropagation()} // Previne navigarea la click
                                >
                                    <FontAwesomeIcon icon={faDownload} />
                                </a>
                            </li>
                        ))}
                    </ul>
                </main>
            </div>
        </div>
    );
}