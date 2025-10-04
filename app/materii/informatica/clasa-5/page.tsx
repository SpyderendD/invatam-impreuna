'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRocket, faLaptop, faHourglassHalf, faKeyboard, faPrint, faHeadset,
  faPuzzlePiece, faGlobeEurope, faNetworkWired, faSearchLocation, faPalette,
  faPaintBrush, faFileSignature, faLightbulb, faShapes, faCalculator,
  faBrain, faBalanceScale, faRoute, faWindowMaximize, faCodeBranch,
  faProjectDiagram, faCat, faClipboardCheck, faAward
} from '@fortawesome/free-solid-svg-icons';

import './Clasa5.css';

const lessons = [
    { slug: "sistem-de-calcul", icon: faLaptop, title: "1. Ce este un Sistem de Calcul?" },
    { slug: "istoric-calculatoare", icon: faHourglassHalf, title: "2. O Scurtă Istorie a Calculatoarelor" },
    { slug: "dispozitive-de-intrare", icon: faKeyboard, title: "3. Dispozitive de Intrare (Input)" },
    { slug: "dispozitive-de-iesire", icon: faPrint, title: "4. Dispozitive de Ieșire (Output)" },
    { slug: "dispozitive-mixte", icon: faHeadset, title: "5. Dispozitive Mixte (Intrare/Ieșire)" },
    { slug: "descrierea-software", icon: faPuzzlePiece, title: "6. Înțelegerea Părții Software" },
    { slug: "internetul", icon: faGlobeEurope, title: "7. Internetul: Cum ne Conectăm?" },
    { slug: "world-wide-web", icon: faNetworkWired, title: "8. Explorând World Wide Web (WWW)" },
    { slug: "cautarea-informatiilor", icon: faSearchLocation, title: "9. Arta Căutării de Informații Online" },
    { slug: "editare-grafica", icon: faPalette, title: "10. Introducere în Grafica pe Calculator" },
    { slug: "instrumente-de-desenare", icon: faPaintBrush, title: "11. Unelte Digitale pentru Desen" },
    { slug: "inserare-formatare-text", icon: faFileSignature, title: "12. Cum Lucrăm cu Textul în Documente" },
    { slug: "algoritmi-proprietati", icon: faLightbulb, title: "13. Ce sunt Algoritmii și la ce Folosesc?" },
    { slug: "clasificarea-datelor", icon: faShapes, title: "14. Tipuri de Date în Lumea Algoritmilor" },
    { slug: "expresii-aritmetice", icon: faCalculator, title: "15. Facem Calcule: Expresii Aritmetice" },
    { slug: "expresii-logice", icon: faBrain, title: "16. Gândire Logică: Expresii Adevărat/Fals" },
    { slug: "operatori-relationali", icon: faBalanceScale, title: "17. Operatori Relaționali" },
    { slug: "structura-liniara", icon: faRoute, title: "18. Structura Liniară" },
    { slug: "mediu-grafic-interactiv", icon: faWindowMaximize, title: "19. Medii Vizuale pentru Programare" },
    { slug: "structura-alternativa", icon: faCodeBranch, title: "20. Structura Alternativă" },
    { slug: "reprezentarea-deciziilor", icon: faProjectDiagram, title: "21. Cum Reprezentăm Deciziile?" },
    { slug: "aplicatii-scratch", icon: faCat, title: "22. Să Creăm cu Scratch!" },
    { slug: "recapitulare-generala", icon: faClipboardCheck, title: "23. Recapitulare: Ce Am Învățat?" },
    { slug: "recapitulare-finala", icon: faAward, title: "Recapitulare Finală ;)" },
];

const navigationLinks = [
    { name: "Clasa a V-a", href: "/materii/informatica/clasa-5" },
    { name: "Clasa a VI-a", href: "/materii/informatica/clasa-6" },
    { name: "Clasa a VII-a", href: "/materii/informatica/clasa-7" },
    { name: "Clasa a VIII-a", href: "/materii/informatica/clasa-8" },
];

export default function Clasa5Page() {
    const pathname = usePathname();
    const copyrightYear = new Date().getFullYear();

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
                            // ATENȚIE: Am înlocuit <a> cu <Link> și am folosit lesson.slug
                            <li key={index} className="lesson-item" data-item-index={index}>
                                <Link href={`${pathname}/${lesson.slug}`}> 
                                    <span className="lesson-icon">
                                        <FontAwesomeIcon icon={lesson.icon} />
                                    </span>
                                    <span>{lesson.title}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </main>
            </div>
        </div>
    );
}