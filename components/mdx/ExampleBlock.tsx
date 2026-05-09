// components/mdx/ExampleBlock.tsx
import { cn } from '@/lib/utils';

interface ExampleBlockProps {
  title: string;
  // Adăugăm 'math' la tipurile acceptate
  type?: 'original' | 'summary' | 'math'; 
  children: React.ReactNode;
}

const typeConfig = {
  // 1. ORIGINAL (Gri) - Pentru texte literare la Română (RĂMÂNE NESCHIMBAT)
  original: {
    className: 'bg-stone-50 border-stone-200 dark:bg-stone-900/40 dark:border-stone-700',
    titleClass: 'text-stone-700 dark:text-stone-300',
  },
  // 2. SUMMARY (Verde) - Pentru idei principale/rezumate (RĂMÂNE NESCHIMBAT)
  summary: {
    className: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-700',
    titleClass: 'text-emerald-800 dark:text-emerald-300',
  },
  // 3. MATH (Albastru) - Stil NOU special pentru Matematică
  math: {
    className: 'bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-700',
    titleClass: 'text-blue-800 dark:text-blue-300',
  }
};

export function ExampleBlock({ title, type = 'original', children }: ExampleBlockProps) {
  // Dacă nu specifici tipul, ia 'original'. Dacă pui un tip greșit, ia tot 'original'.
  const config = typeConfig[type] || typeConfig['original'];
  
  const { className, titleClass } = config;

  return (
    <div className={cn("my-6 rounded-lg border", className)}>
      <div className={cn("border-b px-4 py-2", className)}>
        <h4 className={cn("font-bold text-md mt-0", titleClass)}>{title}</h4>
      </div>
      <div className="p-4 prose-p:my-0">
        {children}
      </div>
    </div>
  );
}