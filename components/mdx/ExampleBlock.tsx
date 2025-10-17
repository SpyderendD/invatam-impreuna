// components/mdx/ExampleBlock.tsx
import { cn } from '@/lib/utils';

interface ExampleBlockProps {
  title: string;
  type: 'original' | 'summary';
  children: React.ReactNode;
}

const typeConfig = {
  original: {
    className: 'bg-stone-50 border-stone-200 dark:bg-stone-900/40 dark:border-stone-700',
    titleClass: 'text-stone-700 dark:text-stone-300',
  },
  summary: {
    className: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-700',
    titleClass: 'text-emerald-800 dark:text-emerald-300',
  },
};

export function ExampleBlock({ title, type, children }: ExampleBlockProps) {
  const { className, titleClass } = typeConfig[type];

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