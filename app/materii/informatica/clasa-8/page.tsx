// app/materii/informatica/clasa-8/page.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faAtom, faVial, faTable, faFillDrip, faCalculator, faChartPie, faCode, faWindowMaximize, 
    faSitemap, faEdit, faListUl, faPaintRoller, faStream, faDigitalTachograph, faDivide, 
    faSortNumericUp, faRandom, faKeyboard, faMicroscope, faRobot, faSatelliteDish, faRoad, faMapSigns,
    faDownload // NOU: Am importat iconița de descărcare
} from '@fortawesome/free-solid-svg-icons';
import { faCss3Alt } from '@fortawesome/free-brands-svg-icons';

import './Clasa8.css';

// NOU: Am adăugat proprietatea `pdfFile` la fiecare lecție
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
                                {/* NOU: Link-ul principal are acum o clasă specifică */}
                                <Link href={`${pathname}/${lesson.slug}`} className="lesson-link-c8">
                                    <i><FontAwesomeIcon icon={lesson.icon} /></i>
                                    <span>{lesson.title}</span>
                                </Link>
                                {/* NOU: Butonul de descărcare, special stilizat pentru clasa a 8-a */}
                                <a
                                    href={`/lectii/informatica/clasa-8/${lesson.pdfFile}`}
                                    download
                                    className="download-link-c8"
                                    aria-label={`Descarcă lecția ${lesson.title}`}
                                    title={`Descarcă lecția ${lesson.title}`}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <FontAwesomeIcon icon={faDownload} />
                                </a>
                            </li>
                        ))}
                    </ol>
                </div>
            </main>
        </div>
    );
}