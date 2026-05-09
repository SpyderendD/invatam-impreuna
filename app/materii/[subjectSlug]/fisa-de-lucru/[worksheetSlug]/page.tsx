// app/materii/[subjectSlug]/fisa-de-lucru/[worksheetSlug]/page.tsx

import { notFound } from 'next/navigation';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { compileMDX } from 'next-mdx-remote/rsc';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { ALL_SUBJECTS_OBJECT } from '@/lib/lessons';

// Importăm componentele MDX de care am putea avea nevoie
// Asigură-te că aceste componente există la căile respective
// Daca nu le ai create, poți șterge linia cu 'components: mdxComponents' de mai jos
// import { Alert } from '@/components/mdx/Alert'; 
// import { ExampleBlock } from '@/components/mdx/ExampleBlock';

const mdxComponents = { 
  // Alert, 
  // ExampleBlock 
};

type WorksheetPageParams = {
  params: {
    subjectSlug: keyof typeof ALL_SUBJECTS_OBJECT;
    worksheetSlug: string;
  };
};

export default async function WorksheetPage({ params }: WorksheetPageParams) {
  const { subjectSlug, worksheetSlug } = params;

  // Construim calea către fișier
  // Structura: radacina/content/[materie]/fise-de-lucru/[nume-fisa].mdx
  const filePath = path.join(process.cwd(), 'content', subjectSlug, 'fise-de-lucru', `${worksheetSlug}.mdx`);

  let mdxSource: string;
  try {
    mdxSource = fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error("Nu am găsit fișierul MDX:", filePath);
    notFound(); 
  }

  // --- AICI ESTE MODIFICAREA CHEIE ---
  // Adăugăm opțiunea 'parseFrontmatter: true'
  // Asta va extrage metadatele și LE VA SCOATE din conținutul vizibil
  const { content, frontmatter } = await compileMDX<{ title?: string }>({
    source: mdxSource,
    components: mdxComponents,
    options: { parseFrontmatter: true } 
  });

  // Găsim lecția pentru butonul de "Înapoi"
  const lesson = ALL_SUBJECTS_OBJECT[subjectSlug]?.chapters
    .flatMap(c => c.lessons)
    .find(l => l.worksheetSlug === worksheetSlug);
  
  // Prioritizăm titlul din MDX, dacă nu există, folosim fallback-ul
  const displayTitle = frontmatter.title || (lesson ? `Fișă de Lucru: ${lesson.title}` : "Fișă de Lucru");

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12 md:py-20">
      <Button asChild variant="outline" className="mb-8 group">
        <Link href={`/materii/${subjectSlug}/${lesson?.slug || ''}`}>
          <ChevronLeft className="h-4 w-4 mr-2" /> Înapoi la Lecție
        </Link>
      </Button>
      
      <h1 className="font-lora text-4xl md:text-5xl font-medium text-foreground mb-12">
        {displayTitle}
      </h1>
      
      {/* Containerul pentru conținutul MDX */}
      {/* 'prose' vine de la Tailwind Typography plugin și formatează automat textul */}
      <article className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-lora prose-a:text-blue-600 dark:prose-a:text-blue-400">
        {content}
      </article>
    </div>
  );
}