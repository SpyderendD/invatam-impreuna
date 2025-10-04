'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faAtom, faVial, faTable, faFillDrip, faCalculator, faChartPie, faCode, faWindowMaximize, 
    faSitemap, faEdit, faListUl, faPaintRoller, faStream, faDigitalTachograph, faDivide, 
    faSortNumericUp, faRandom, faKeyboard, faMicroscope, faRobot, faSatelliteDish, faRoad, faMapSigns 
} from '@fortawesome/free-solid-svg-icons';
import { faCss3Alt } from '@fortawesome/free-brands-svg-icons';

import './Clasa8.css';

// LISTA CORECTĂ, cu slug-uri curate și titluri numerotate
const lessons = [
    { slug: "test-initial", icon: faVial, title: "1. Test Inițial Aprofundat" },
    { slug: "aplicatia-calcul-tabelar", icon: faTable, title: "2. Calcul Tabelar: Expertiză" },
    { slug: "formatare-tipuri-de-date", icon: faFillDrip, title: "3. Formatare Avansată & Tipuri de Date" },
    { slug: "formule-si-functii", icon: faCalculator, title: "4. Maeștri în Formule și Funcții" },
    { slug: "serii-de-date-si-grafice", icon: faChartPie, title: "5. Vizualizarea Datelor: Grafice Dinamice" },
    { slug: "editorul-de-pagini-web", icon: faCode, title: "6. Arhitectura Web: HTML Esențial" },
    { slug: "elemente-de-interfata-editoare", icon: faWindowMaximize, title: "7. Interfețe Moderne pentru Web Design" },
    { slug: "structura-paginii-web", icon: faSitemap, title: "8. Scheletul Paginilor Web Profi" },
    { slug: "editarea-elementelor-web", icon: faEdit, title: "9. Manipularea Elementelor HTML" },
    { slug: "liste-si-imagini-html", icon: faListUl, title: "10. Liste Inteligente și Imagini Optimizate" },
    { slug: "formatarea-elementelor-web", icon: faCss3Alt, title: "11. Stiluri CSS: Design Captivant" },
    { slug: "activitate-practica-formatare", icon: faPaintRoller, title: "12. Lab: Stiluri Web Creative" },
    { slug: "sirul-de-valori", icon: faStream, title: "13. Procesarea Șirurilor de Valori" },
    { slug: "prelucrarea-cifrelor", icon: faDigitalTachograph, title: "14. Algoritmi pe Cifrele Numerelor" },
    { slug: "prelucrarea-divizorilor", icon: faDivide, title: "15. Explorarea Divizorilor: Algoritmi" },
    { slug: "numararea-unui-eveniment", icon: faSortNumericUp, title: "16. Contorizarea Evenimentelor în Algoritmi" },
    { slug: "siruri-de-valori-generate", icon: faRandom, title: "17. Generarea Dinamică a Șirurilor" },
    { slug: "siruri-de-valori-citite", icon: faKeyboard, title: "18. Interacțiunea cu Utilizatorul: Citirea Șirurilor" },
    { slug: "algoritmi-interdisciplinari", icon: faMicroscope, title: "19. Conexiuni: Algoritmi Interdisciplinari" },
    { slug: "robotul-didactic-obstacole", icon: faRobot, title: "20. Robotică: Navigare Inteligentă" },
    { slug: "activitate-practica-evitarea-obstacolelor", icon: faRobot, title: "21. Lab: Evitarea Obstacolelor" },
    { slug: "urmarirea-liniei-traseu", icon: faRoad, title: "22. Roboți Urmăritori de Linie" },
    { slug: "parcurgerea-unui-traseu", icon: faMapSigns, title: "23. Parcurgerea Autonomă a Traseelor" },
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
        <div className="clasa8-page-wrapper">
            <main>
                <div className="container">
                    <h1>
                        <span className="title-text">LECȚII DE INFORMATICĂ</span>
                        <span className="title-icon"><FontAwesomeIcon icon={faAtom} /></span>
                    </h1>
                    <h2>Clasa a VIII-a</h2>

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

                    <ol className="lista-lectii">
                        {lessons.map((lesson, index) => (
                            <li key={index} className={`lesson-item item-index-${index}`}>
                                <Link href={`${pathname}/${lesson.slug}`}>
                                    <i><FontAwesomeIcon icon={lesson.icon} /></i>
                                    <span>{lesson.title}</span>
                                </Link>
                            </li>
                        ))}
                    </ol>
                </div>
            </main>
        </div>
    );
}