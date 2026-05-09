'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Computer, GraduationCap, ArrowRight } from 'lucide-react';

// --- Varianțe de animație reutilizabile (le poți importa dintr-un fișier comun dacă vrei) ---
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


export default function InformaticaHomePage() {
    const clase = [
        {
            name: "Clasa a 5-a",
            description: "Introducere în algoritmi și gândire computațională. Primii pași în lumea digitală.",
            href: "/materii/informatica/clasa-5",
            isActive: true
        },
        {
            name: "Clasa a 6-a",
            description: "Elemente de bază în programare. Structuri simple și logică secvențială.",
            href: "/materii/informatica/clasa-6",
            isActive: true
        },
        {
            name: "Clasa a 7-a",
            description: "Aprofundarea algoritmilor. Structuri de control repetitive și condiționale.",
            href: "/materii/informatica/clasa-7",
            isActive: true
        },
        {
            name: "Clasa a 8-a",
            description: "Pregătire avansată, probleme complexe și recapitulare pentru evaluare.",
            href: "/materii/informatica/clasa-8",
            isActive: true
        },
    ];

    return (
        <main className="bg-background">
            <div className="container py-24 md:py-32">
                {/* Antetul paginii */}
                <motion.div
                    className="text-center mb-16 max-w-3xl mx-auto"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                >
                    <motion.div variants={sectionFadeIn} className="flex justify-center mb-6">
                        <div className="bg-primary/10 text-primary rounded-full p-4">
                            <Computer className="h-10 w-10" />
                        </div>
                    </motion.div>
                    <motion.h1
                        variants={sectionFadeIn}
                        className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl text-foreground"
                    >
                        Explorează Lumea Informaticii
                    </motion.h1>
                    <motion.p
                        variants={sectionFadeIn}
                        className="mt-6 text-lg text-muted-foreground"
                    >
                        Selectează clasa pentru a începe călătoria în lumea programării și a tehnologiei digitale. Fiecare pas te aduce mai aproape de a deveni un creator de tehnologie.
                    </motion.p>
                </motion.div>

                {/* Grila cu clase */}
                <motion.div
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                >
                    {clase.map((clasa) => (
                        <ClassCard
                            key={clasa.name}
                            name={clasa.name}
                            description={clasa.description}
                            href={clasa.href}
                            isActive={clasa.isActive}
                        />
                    ))}
                </motion.div>
            </div>
        </main>
    );
}