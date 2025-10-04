'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faRocket, faVial, faFilePowerpoint, faSlidersH, faCopy, faMagic, faChalkboardTeacher, faCube, 
    faFilm, faUserShield, faCat, faVrCardboard, faEnvelopeOpenText, faUserPlus, 
    faBalanceScaleLeft, faPenFancy, faTools, faMailBulk, faCode, 
    faProjectDiagram, faFileCode, faSyncAlt, faTasks, faInfinity 
} from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

// VOM FOLOSI STILUL DE LA CLASA A 5-A
import './Clasa5.css';

// Lista lecțiilor, cu slug-uri și iconițe
const lessons = [
    { slug: "test-initial", icon: faVial, title: "1. Test inițial" },
    { slug: "prezentare-si-aplicatii", icon: faFilePowerpoint, title: "2. Prezentare și aplicații de prezentare" },
    { slug: "prezentarea-detaliata-a-barelor", icon: faSlidersH, title: "3. Prezentarea detaliată a barelor de opțiuni" },
    { slug: "operatii-de-lucru-cu-diapozitivele", icon: faCopy, title: "4. Operații de lucru cu diapozitivele" },
    { slug: "elemente-de-design-al-prezentarii", icon: faMagic, title: "5. Elemente de design al prezentării" },
    { slug: "realizarea-unei-prezentari", icon: faChalkboardTeacher, title: "6. Realizarea unei prezentări" },
    { slug: "grafica-3d-scop-si-avantaje", icon: faCube, title: "7. Grafica 3d-scop și avantaje" },
    { slug: "structura-unei-animatii-grafice", icon: faFilm, title: "8. Structura unei animații grafice" },
    { slug: "masuri-de-securitate", icon: faUserShield, title: "9. Măsuri de securitate pe Internet" },
    { slug: "animatii-grafice-in-scratch", icon: faCat, title: "10. Animații grafice în Scratch" },
    { slug: "obiecte-3d-in-powerpoint", icon: faVrCardboard, title: "11. Obiecte 3D în PowerPoint" },
    { slug: "toontastic", icon: faVrCardboard, title: "12. Toontastic" },
    { slug: "posta-electronica", icon: faEnvelopeOpenText, title: "13. Poșta electronică" },
    { slug: "crearea-unui-cont-de-email", icon: faUserPlus, title: "14. Crearea unui cont de e-mail" },
    { slug: "avantaje-si-dezavantaje-email", icon: faBalanceScaleLeft, title: "15. Avantaje și dezavantaje e-mail" },
    { slug: "reguli-de-comunicare", icon: faPenFancy, title: "16. Reguli de comunicare" },
    { slug: "gmail-elemente-de-interfata", icon: faGoogle, title: "17. Gmail-elemente de interfață" },
    { slug: "configurare-outlook-2007", icon: faTools, title: "18. Configurare Outlook 2007" },
    { slug: "aplicatia-microsoft-outlook", icon: faMailBulk, title: "19. Aplicația Microsoft Outlook" },
    { slug: "elementele-de-baza-algoritmilor", icon: faCode, title: "20. Elemente de bază utilizate în exersarea algoritmilor" },
    { slug: "schema-logica", icon: faProjectDiagram, title: "21. Schema logică" },
    { slug: "limbajul-pseudocod", icon: faFileCode, title: "22. Limbajul pseudocod" },
    { slug: "structuri-repetitive", icon: faSyncAlt, title: "23. Structuri repetitive" },
    { slug: "structura-repetitiva-cu-nr-cunoscut", icon: faTasks, title: "24. Structura repetitivă cu număr cunoscut de pași" },
    { slug: "reprezentarea-structurilor-repetitive", icon: faProjectDiagram, title: "25. Reprezentarea structurilor într-un mediu grafic" },
    { slug: "realizarea-unui-material-digital", icon: faChalkboardTeacher, title: "26. Realizarea unui material digital" },
    { slug: "structura-repetitiva-cu-test-final", icon: faInfinity, title: "27. Structura repetitivă cu test final" },
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
        // Folosim clasa CSS de la clasa a 5-a
        <div className="clasa5-page-wrapper">
            <div className="container">
                <header className="site-header">
                    <h1><FontAwesomeIcon icon={faRocket} className="header-icon" /> LECȚII DE INFORMATICĂ</h1>
                    {/* Schimbăm titlul să fie Clasa a VI-a */}
                    <h2>Clasa a VI-a</h2>
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
                    {/* Folosim exact aceeași structură de grid ca la clasa a 5-a */}
                    <ul className="lesson-grid">
                        {lessons.map((lesson, index) => (
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