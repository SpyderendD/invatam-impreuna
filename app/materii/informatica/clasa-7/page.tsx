'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faLaptopCode, faVial, faFileAlt, faWindowMaximize, faCogs, faImage, faEdit, faCropAlt, faTable, 
    faUsers, faPhotoVideo, faVideo, faFileAudio, faFolderOpen, faSlidersH, faShareAlt, faLink, 
    faTasks, faTerminal, faCalculator, faFileCode, faExchangeAlt, faCodeBranch, faSyncAlt, 
    faRedo, faHistory 
} from '@fortawesome/free-solid-svg-icons';

import './Clasa7.css';

// LISTA CORECTĂ, cu titluri numerotate
const lessons = [
    { slug: "editorul-de-texte", icon: faFileAlt, title: "1. Ce este un Editor de Texte?" },
    { slug: "interfata-word", icon: faWindowMaximize, title: "2. Interfața Aplicației Word" },
    { slug: "operatii-in-word", icon: faCogs, title: "3. Operații de Bază în Word" },
    { slug: "inserarea-obiectelor", icon: faImage, title: "4. Inserarea Obiectelor (Imagini, Tabele)" },
    { slug: "operatii-de-editare", icon: faEdit, title: "5. Editarea Avansată a Documentelor" },
    { slug: "formatarea-imaginilor", icon: faCropAlt, title: "6. Formatarea Imaginilor" },
    { slug: "formatarea-tabelelor-si-paginilor", icon: faTable, title: "7. Formatarea Tabelelor și Paginilor" },
    { slug: "lucrul-colaborativ", icon: faUsers, title: "8. Lucrul Colaborativ pe Documente" },
    { slug: "elemente-multimedia", icon: faPhotoVideo, title: "9. Elemente de Bază Multimedia" },
    { slug: "aplicatia-openshot", icon: faVideo, title: "10. Aplicația OpenShot" },
    { slug: "tipuri-fisiere-multimedia", icon: faFileAudio, title: "11. Tipuri de Fișiere Multimedia" },
    { slug: "gestionarea-fisierelor-multimedia", icon: faFolderOpen, title: "12. Gestionarea Fișierelor Multimedia" },
    { slug: "particularizarea-fisierelor-multimedia", icon: faSlidersH, title: "13. Particularizarea Fișierelor Multimedia" },
    { slug: "colaborare-fisiere-multimedia", icon: faShareAlt, title: "14. Colaborare pe Fișiere Multimedia" },
    { slug: "conectarea-la-aplicatii-colaborative", icon: faLink, title: "15. Conectarea la Aplicații Colaborative" },
    { slug: "operatii-in-aplicatii-colaborative", icon: faTasks, title: "16. Operații în Aplicații Colaborative" },
    { slug: "mediu-dezvoltare-codeblocks", icon: faTerminal, title: "17. Mediul de Dezvoltare Code::Blocks" },
    { slug: "operatori", icon: faCalculator, title: "18. Operatori în Programare" },
    { slug: "structura-programelor", icon: faFileCode, title: "19. Structura unui Program C++" },
    { slug: "citire-afisare-date", icon: faExchangeAlt, title: "20. Citirea și Afișarea Datelor (cin/cout)" },
    { slug: "structura-alternativa-if", icon: faCodeBranch, title: "21. Structura Alternativă (if)" },
    { slug: "structuri-repetitive-cpp", icon: faSyncAlt, title: "22. Structuri Repetitive în C++" },
    { slug: "instructiunea-for", icon: faRedo, title: "23. Instrucțiunea Repetitivă `for`" },
    { slug: "instructiunea-do-while", icon: faHistory, title: "24. Instrucțiunea Repetitivă `do-while`" },
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