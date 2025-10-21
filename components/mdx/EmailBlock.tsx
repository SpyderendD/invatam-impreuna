// components/mdx/EmailBlock.tsx
import { Mail } from 'lucide-react';

interface EmailFieldProps {
  label: string;
  value: string;
}

const EmailField = ({ label, value }: EmailFieldProps) => (
  <div className="flex border-b border-border/60 py-2 text-sm">
    <span className="w-20 flex-shrink-0 text-muted-foreground">{label}:</span>
    <span>{value}</span>
  </div>
);

interface EmailBlockProps {
  from: string;
  to: string;
  subject: string;
  children: React.ReactNode;
}

export function EmailBlock({ from, to, subject, children }: EmailBlockProps) {
  return (
    <div className="my-6 rounded-lg border bg-card shadow-sm">
      {/* Header-ul e-mailului */}
      <div className="p-4">
        <EmailField label="De la" value={from} />
        <EmailField label="Către" value={to} />
        <EmailField label="Subiect" value={subject} />
      </div>
      
      {/* Divider */}
      <hr />
      
      {/* Conținutul e-mailului */}
      <div className="p-4 prose-p:my-2">
        {children}
      </div>
    </div>
  );
}