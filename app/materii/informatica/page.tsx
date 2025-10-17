// app/materii/informatica/page.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Computer, GraduationCap, ArrowRight, ExternalLink } from 'lucide-react';

// NOU: Am ajustat importurile pentru a folosi iconițele corecte
import {
    SiHtml5, SiCss3, SiJavascript, SiReact, SiPython, SiTensorflow, SiVuedotjs,
    SiMongodb, SiGit, SiCplusplus, SiPhp, SiAngular, SiGnubash, SiSololearn
} from 'react-icons/si';
// NOU: Am mutat iconițele care nu erau în 'si' în colecția 'fa' (Font Awesome)
import { FaJava, FaShieldAlt, FaBook, FaDatabase, FaAws } from 'react-icons/fa';


// --- Varianțe de animație reutilizabile ---
const sectionFadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: "circOut" }
    },
};

const staggerContainer = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
};

// Componenta pentru cardul de clasă
const ClassCard = ({ name, description, href, isActive }: { name: string; description: string; href: string; isActive: boolean }) => (
    <motion.div variants={sectionFadeIn} className="h-full">
        <Link href={isActive ? href : '#'} className={`block group h-full ${!isActive ? 'pointer-events-none' : ''}`}>
            <motion.div
                whileHover={{ y: -8, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`p-6 h-full text-left flex flex-col justify-between relative overflow-hidden rounded-xl transition-shadow duration-300 shadow-md ${isActive ? 'bg-card shadow-foreground/10' : 'bg-muted shadow-transparent'}`}
            >
                <div>
                    <div className={`bg-primary/10 rounded-lg p-3 mb-4 w-fit ${isActive ? 'text-primary' : 'text-muted-foreground opacity-50'}`}>
                        <GraduationCap className="h-7 w-7" />
                    </div>
                    <h3 className={`text-xl font-bold ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>{name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{description}</p>
                </div>
                <p className={`text-sm mt-4 flex items-center gap-1 transition-all ${isActive ? 'text-primary group-hover:gap-2' : 'font-semibold text-muted-foreground'}`}>
                    {isActive ? 'Vezi Lecțiile' : 'În curând'}
                    {isActive && <ArrowRight className="h-4 w-4" />}
                </p>
            </motion.div>
        </Link>
    </motion.div>
);

// Componenta pentru cardul de resursă externă
const ResourceCard = ({ name, href, Icon, color }: { name: string; href: string; Icon: React.ElementType; color: string }) => (
    <motion.div variants={sectionFadeIn} className="h-full">
        <a href={href} target="_blank" rel="noopener noreferrer" className="block group h-full">
            <motion.div
                whileHover={{ y: -8, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="p-6 h-full text-left flex flex-col justify-between relative overflow-hidden rounded-xl transition-shadow duration-300 shadow-md bg-card shadow-foreground/10"
            >
                <div>
                    <div className={`p-3 rounded-lg w-fit mb-4 ${color}`}>
                        <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{name}</h3>
                    <p className="mt-1 text-xs text-muted-foreground break-all">{href.replace('https://', '').replace('www.', '')}</p>
                </div>
                <p className="text-sm mt-4 text-primary flex items-center gap-1 transition-all group-hover:gap-2">
                    Vizitează Resursa <ExternalLink className="h-4 w-4" />
                </p>
            </motion.div>
        </a>
    </motion.div>
);


export default function InformaticaHomePage() {
    const clase = [
        { name: "Clasa a 5-a", description: "Introducere în algoritmi și gândire computațională. Primii pași în lumea digitală.", href: "/materii/informatica/clasa-5", isActive: true },
        { name: "Clasa a 6-a", description: "Elemente de bază în programare. Structuri simple și logică secvențială.", href: "/materii/informatica/clasa-6", isActive: true },
        { name: "Clasa a 7-a", description: "Aprofundarea algoritmilor. Structuri de control repetitive și condiționale.", href: "/materii/informatica/clasa-7", isActive: true },
        { name: "Clasa a 8-a", description: "Pregătire avansată, probleme complexe și recapitulare pentru evaluare.", href: "/materii/informatica/clasa-8", isActive: true },
    ];

    // NOU: Lista de resurse cu iconițele corectate
    const learningResources = [
        { name: 'W3Schools', href: 'https://www.w3schools.com', Icon: FaBook, color: 'bg-green-600 text-white' },
        { name: 'HTML', href: 'https://www.html.com', Icon: SiHtml5, color: 'bg-orange-600 text-white' },
        { name: 'CSS', href: 'https://www.codecademy.com/learn/learn-css', Icon: SiCss3, color: 'bg-blue-600 text-white' },
        { name: 'JavaScript', href: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/', Icon: SiJavascript, color: 'bg-yellow-400 text-black' },
        { name: 'React', href: 'https://react.dev', Icon: SiReact, color: 'bg-cyan-400 text-black' },
        { name: 'Python', href: 'https://www.learnpython.org', Icon: SiPython, color: 'bg-yellow-500 text-blue-900' },
        { name: 'Java', href: 'https://www.sololearn.com/learn/java', Icon: FaJava, color: 'bg-purple-600 text-white' }, // CORECTAT
        { name: 'AI / ML', href: 'https://www.coursera.org/browse/data-science/machine-learning', Icon: SiTensorflow, color: 'bg-orange-500 text-white' },
        { name: 'Vue', href: 'https://learnvue.co', Icon: SiVuedotjs, color: 'bg-green-500 text-white' },
        { name: 'MongoDB', href: 'https://learn.mongodb.com', Icon: SiMongodb, color: 'bg-green-700 text-white' },
        { name: 'Git', href: 'https://learngitbranching.js.org', Icon: SiGit, color: 'bg-red-500 text-white' },
        { name: 'C++', href: 'https://www.learncpp.com', Icon: SiCplusplus, color: 'bg-blue-800 text-white' },
        { name: 'SQL', href: 'https://sqlbolt.com', Icon: FaDatabase, color: 'bg-indigo-500 text-white' }, // CORECTAT
        { name: 'Cybersecurity', href: 'https://tryhackme.com', Icon: FaShieldAlt, color: 'bg-yellow-600 text-white' },
        { name: 'PHP', href: 'https://www.php.net', Icon: SiPhp, color: 'bg-indigo-400 text-white' },
        { name: 'AWS', href: 'https://skillbuilder.aws', Icon: FaAws, color: 'bg-orange-400 text-black' }, // CORECTAT
        { name: 'Angular', href: 'https://web.dev/learn/angular', Icon: SiAngular, color: 'bg-red-600 text-white' },
        { name: 'C', href: 'https://www.learn-c.org', Icon: SiGnubash, color: 'bg-pink-600 text-white' },
    ];

    return (
        <main className="bg-background">
            {/* Secțiunea pentru clase */}
            <div className="container py-24 md:py-32">
                <motion.div className="text-center mb-16 max-w-3xl mx-auto" initial="hidden" animate="visible" variants={staggerContainer}>
                    <motion.div variants={sectionFadeIn} className="flex justify-center mb-6"><div className="bg-primary/10 text-primary rounded-full p-4"><Computer className="h-10 w-10" /></div></motion.div>
                    <motion.h1 variants={sectionFadeIn} className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl text-foreground">Explorează Lumea Informaticii</motion.h1>
                    <motion.p variants={sectionFadeIn} className="mt-6 text-lg text-muted-foreground">Selectează clasa pentru a începe călătoria în lumea programării și a tehnologiei digitale. Fiecare pas te aduce mai aproape de a deveni un creator de tehnologie.</motion.p>
                </motion.div>

                <motion.div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" initial="hidden" animate="visible" variants={staggerContainer}>
                    {clase.map((clasa) => <ClassCard key={clasa.name} {...clasa} />)}
                </motion.div>
            </div>

            {/* Secțiunea pentru resurse externe */}
            <div className="border-t border-border">
                <div className="container py-24 md:py-32">
                    <motion.div className="text-center mb-16 max-w-3xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={staggerContainer}>
                        <motion.h2 variants={sectionFadeIn} className="text-4xl font-extrabold tracking-tighter sm:text-5xl text-foreground">Învață ca un Profesionist</motion.h2>
                        <motion.p variants={sectionFadeIn} className="mt-6 text-lg text-muted-foreground">Explorează cele mai bune platforme gratuite pentru a-ți dezvolta abilitățile în diverse tehnologii, direct de la sursă.</motion.p>
                    </motion.div>

                    <motion.div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}>
                        {learningResources.map((resource) => <ResourceCard key={resource.name} {...resource} />)}
                    </motion.div>
                </div>
            </div>
        </main>
    );
}