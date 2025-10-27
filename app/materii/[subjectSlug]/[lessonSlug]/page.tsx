// app/materii/[subjectSlug]/[lessonSlug]/page.tsx
// ROL: Server Component - Prelucrează datele și conținutul pe server.

import { notFound } from 'next/navigation';
import { ALL_SUBJECTS_OBJECT } from '@/lib/lessons';
import fs from 'fs';
import path from 'path';
import { compileMDX } from 'next-mdx-remote/rsc';
import LessonClientPage from './LessonClientPage'; // Componenta Client pe care o vom crea/folosi
import { Alert } from '@/components/mdx/Alert';
import { StepByStep } from '@/components/mdx/StepByStep';
import { ExampleBlock } from '@/components/mdx/ExampleBlock';
import { EmailBlock } from '@/components/mdx/EmailBlock';
import { TransformationBlock } from '@/components/mdx/TransformationBlock';

const mdxComponents = {
    Alert,
    StepByStep,
    ExampleBlock,
    EmailBlock,
    TransformationBlock,
};

// ============================================================================
// == COMPONENTA PRINCIPALĂ A PAGINII (SERVER COMPONENT)
// ============================================================================
type LessonPageParams = {
  params: {
    subjectSlug: keyof typeof ALL_SUBJECTS_OBJECT;
    lessonSlug: string;
  };
};

export default async function LessonPage({ params }: LessonPageParams) {
    const { subjectSlug, lessonSlug } = params;

    // --- Pasul 1: Găsește metadatele lecției din sursa ta de date ---
    const subjectData = ALL_SUBJECTS_OBJECT[subjectSlug];
    const lesson = subjectData?.chapters
        .flatMap(chapter => chapter.lessons)
        .find(l => l.slug === lessonSlug);

    // Dacă lecția nu există în `lib/lessons.tsx`, afișează pagina 404.
    if (!lesson) {
        notFound();
    }

    // --- Pasul 2: Citește conținutul fișierului .mdx de pe server ---
    const filePath = path.join(process.cwd(), 'content', subjectSlug, `${lessonSlug}.mdx`);
    
    let mdxSource: string;
    try {
        // Încearcă să citești fișierul corespunzător lecției.
        mdxSource = fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        // Dacă fișierul .mdx nu există, oferă un conținut implicit.
        // Astfel, platforma nu va "crăpa" dacă uiți să creezi un fișier de conținut.
        mdxSource = `
## Conținut în Curs de Pregătire

Ne cerem scuze, conținutul pentru lecția **"${lesson.title}"** nu este încă disponibil. 
Revenim în curând cu informații complete!
        `;
    }

    // --- Pasul 3: Compilează sursa MDX într-un component React ---
    const { content } = await compileMDX({
        source: mdxSource,
        components: mdxComponents, // Pasează componentele custom definite mai sus
        options: {
            parseFrontmatter: true, // Permite citirea de metadate din fișierul MDX (ex: --- title: ... ---)
        },
    });

    // --- Pasul 4: Randează componenta Client și pasează-i toate datele necesare ---
    // Logica de interacțiune (butoane, stare, hook-uri) va sta în `LessonClientPage`.
    return (
        <LessonClientPage
            lesson={lesson}
            subjectSlug={subjectSlug}
            contentComponent={content}
        />
    );
}