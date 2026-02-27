// app/materii/[subjectSlug]/[lessonSlug]/page.tsx
// ROL: Server Component - Prelucrează datele și conținutul pe server.

import { notFound } from 'next/navigation';
import { ALL_SUBJECTS_OBJECT } from '@/lib/lessons';
import fs from 'fs';
import path from 'path';
import { compileMDX } from 'next-mdx-remote/rsc';
import LessonClientPage from './LessonClientPage';
import { Alert } from '@/components/mdx/Alert';
import { StepByStep } from '@/components/mdx/StepByStep';
import { ExampleBlock } from '@/components/mdx/ExampleBlock';
import { EmailBlock } from '@/components/mdx/EmailBlock';
import { TransformationBlock } from '@/components/mdx/TransformationBlock';

// 1. IMPORT PLUGIN-URI MATEMATICĂ
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const mdxComponents = {
    Alert,
    StepByStep,
    ExampleBlock,
    EmailBlock,
    TransformationBlock,
};

type LessonPageParams = {
  params: {
    subjectSlug: keyof typeof ALL_SUBJECTS_OBJECT;
    lessonSlug: string;
  };
};

export default async function LessonPage({ params }: LessonPageParams) {
    const { subjectSlug, lessonSlug } = params;

    // --- Pasul 1: Găsește metadatele lecției ---
    const subjectData = ALL_SUBJECTS_OBJECT[subjectSlug];
    const lesson = subjectData?.chapters
        .flatMap(chapter => chapter.lessons)
        .find(l => l.slug === lessonSlug);

    if (!lesson) {
        notFound();
    }

    // --- Pasul 2: Citește conținutul fișierului .mdx ---
    const filePath = path.join(process.cwd(), 'content', subjectSlug, `${lessonSlug}.mdx`);
    
    let mdxSource: string;
    try {
        mdxSource = fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        mdxSource = `
## Conținut în Curs de Pregătire

Ne cerem scuze, conținutul pentru lecția **"${lesson.title}"** nu este încă disponibil. 
Revenim în curând cu informații complete!
        `;
    }

    // --- Pasul 3: Compilează sursa MDX (CU SUPORT MATEMATICĂ) ---
    const { content } = await compileMDX({
        source: mdxSource,
        components: mdxComponents,
        options: {
            parseFrontmatter: true,
            // AICI ESTE SCHIMBAREA IMPORTANTĂ:
            mdxOptions: {
                remarkPlugins: [remarkMath], // Permite scrierea $...$
                rehypePlugins: [rehypeKatex], // Transformă în HTML matematic frumos
            },
        },
    });

    // --- Pasul 4: Randează componenta Client ---
    return (
        <LessonClientPage
            lesson={lesson}
            subjectSlug={subjectSlug}
            contentComponent={content}
        />
    );
}