// components/mdx/Alert.tsx
import { Info, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertProps {
  type: 'info' | 'warning' | 'success' | 'tip';
  title?: string;
  children: React.ReactNode;
}

const alertConfig = {
  info: { icon: Info, className: 'bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-700' },
  warning: { icon: AlertTriangle, className: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-700' },
  success: { icon: CheckCircle, className: 'bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-700' },
  tip: { icon: Lightbulb, className: 'bg-purple-50 border-purple-200 dark:bg-purple-900/30 dark:border-purple-700' },
};

export function Alert({ type = 'info', title, children }: AlertProps) {
  const { icon: Icon, className } = alertConfig[type];

  return (
    <div className={cn("my-6 flex items-start gap-4 rounded-lg border p-4", className)}>
      <Icon className="h-5 w-5 flex-shrink-0 mt-1" />
      <div className="flex-1">
        {title && <h5 className="font-bold text-lg mt-0 mb-2">{title}</h5>}
        <div className="prose-p:my-0">{children}</div>
      </div>
    </div>
  );
}