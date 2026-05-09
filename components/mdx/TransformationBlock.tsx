// components/mdx/TransformationBlock.tsx
import { ArrowRight } from "lucide-react";

interface TransformationBlockProps {
  direct: React.ReactNode;
  indirect: React.ReactNode;
}

export function TransformationBlock({ direct, indirect }: TransformationBlockProps) {
  return (
    <div className="my-6 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-lg border p-4 bg-card/50">
      <div className="prose-p:my-0">
        <h4 className="font-semibold text-sm text-muted-foreground">Vorbire Directă</h4>
        {direct}
      </div>
      <div className="flex justify-center">
        <ArrowRight className="h-6 w-6 text-primary" />
      </div>
      <div className="prose-p:my-0">
        <h4 className="font-semibold text-sm text-muted-foreground">Vorbire Indirectă</h4>
        {indirect}
      </div>
    </div>
  );
}