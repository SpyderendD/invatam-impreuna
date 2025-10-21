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
import { Alert } from '@/components/mdx/Alert';
import { ExampleBlock } from '@/components/mdx/ExampleBlock';

const mdxComponents = { Alert, ExampleBlock };

type WorksheetPageParams = {
  params: {
    subjectSlug: keyof typeof ALL_SUBJECTS_OBJECT;
    worksheetSlug: string;
  };
};

export default async function WorksheetPage({ params }: WorksheetPageParams) {
  const { subjectSlug, worksheetSlug } = params;

  // Găsim lecția care corespunde acestei fișe, pentru a afișa titlul
  const lesson = ALL_SUBJECTS_OBJECT[subjectSlug]?.chapters
    .flatMap(c => c.lessons)
    .find(l => l.worksheetSlug === worksheetSlug);
  
  const title = lesson ? `Fișă de Lucru: ${lesson.title}` : "Fișă de Lucru";

  const filePath = path.join(process.cwd(), 'content', subjectSlug, 'fise-de-lucru', `${worksheetSlug}.mdx`);

  let mdxSource: string;
  try {
    mdxSource = fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    notFound(); // Dacă fișierul MDX nu există, afișăm 404
  }

  const { content } = await compileMDX({
    source: mdxSource,
    components: mdxComponents,
  });

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12 md:py-20">
      <Button asChild variant="outline" className="mb-8 group">
        <Link href={`/materii/${subjectSlug}/${lesson?.slug || ''}`}>
          <ChevronLeft className="h-4 w-4 mr-2" /> Înapoi la Lecție
        </Link>
      </Button>
      <h1 className="font-lora text-4xl md:text-5xl font-medium text-foreground mb-12">{title}</h1>
      
      <article className="prose prose-lg max-w-none dark:prose-invert">
        {content}
      </article>
    </div>
  );
}