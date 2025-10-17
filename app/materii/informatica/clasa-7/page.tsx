// app/materii/informatica/clasa-7/page.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faLaptopCode, faVial, faFileAlt, faWindowMaximize, faCogs, faImage, faEdit, faCropAlt, faTable, 
    faUsers, faPhotoVideo, faVideo, faFileAudio, faFolderOpen, faSlidersH, faShareAlt, faLink, 
    faTasks, faTerminal, faCalculator, faFileCode, faExchangeAlt, faCodeBranch, faSyncAlt, 
    faRedo, faHistory,
    faDownload // NOU: Am importat iconița de descărcare
} from '@fortawesome/free-solid-svg-icons';

import './Clasa7.css';

// NOU: Am adăugat proprietatea `pdfFile` la fiecare lecție
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
        <div className="clasa7-page-wrapper">
            <main>
                <div className="container">
                    <h1>
                        <span className="title-text">LECȚII DE INFORMATICĂ</span>
                        <span className="title-icon"><FontAwesomeIcon icon={faLaptopCode} /></span>
                    </h1>
                    <h2>Clasa a VII-a</h2>

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
                            <li key={index} className="lesson-item" data-item-index={index}>
                                {/* NOU: Link-ul principal ocupă acum doar textul */}
                                <Link href={`${pathname}/${lesson.slug}`} className="lesson-link-main">
                                    <i><FontAwesomeIcon icon={lesson.icon} /></i>
                                    <span>{lesson.title}</span>
                                </Link>

                                {/* NOU: Butonul de descărcare animat */}
                                <a
                                    href={`/lectii/informatica/clasa-7/${lesson.pdfFile}`}
                                    download
                                    className="download-link-animated"
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