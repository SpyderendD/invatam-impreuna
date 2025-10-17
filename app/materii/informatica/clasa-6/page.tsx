// app/materii/informatica/clasa-6/page.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faRocket, faVial, faFilePowerpoint, faSlidersH, faCopy, faMagic, faChalkboardTeacher, faCube, 
    faFilm, faUserShield, faCat, faVrCardboard, faEnvelopeOpenText, faUserPlus, 
    faBalanceScaleLeft, faPenFancy, faTools, faMailBulk, faCode, 
    faProjectDiagram, faFileCode, faSyncAlt, faTasks, faInfinity,
    faDownload // NOU: Am importat iconița de descărcare
} from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

import './Clasa5.css'; // Reutilizăm stilurile

// NOU: Am adăugat proprietatea `pdfFile` pentru fiecare lecție
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
        <div className="clasa5-page-wrapper">
            <div className="container">
                <header className="site-header">
                    <h1><FontAwesomeIcon icon={faRocket} className="header-icon" /> LECȚII DE INFORMATICĂ</h1>
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
                                    href={`/lectii/informatica/clasa-6/${lesson.pdfFile}`}
                                    download
                                    className="download-button"
                                    aria-label={`Descarcă lecția ${lesson.title}`}
                                    title={`Descarcă lecția ${lesson.title}`}
                                    onClick={(e) => e.stopPropagation()}
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