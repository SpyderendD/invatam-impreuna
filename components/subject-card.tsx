// components/subject-card.tsx
import Link from 'next/link';
import { Card, CardTitle } from './ui/card'; // Am simplificat importurile
import { ScrollAnimation } from '@/components/scroll-animation';

interface SubjectCardProps {
  title: string;
  icon: React.ReactNode;
  href: string;
  delay: number;
  
  // Adăugăm o prop opțională pentru a specifica deschiderea în tab nou
  openInNewTab?: boolean; 
}

export const SubjectCard = ({ title, icon, href, delay, openInNewTab = false }: SubjectCardProps) => {
  
  // 1. Determinăm dacă link-ul este extern sau dacă trebuie să se deschidă în tab nou
  const isExternal = openInNewTab || href.startsWith('http') || href.startsWith('https');

  // Conținutul cardului (elementele vizuale interne)
  const CardContent = (
    <Card className="p-6 h-full text-center card-hover">
      <div className="text-primary group-hover:scale-110 transition-transform duration-300 mb-4 inline-block">
        {icon}
      </div>
      <CardTitle>{title}</CardTitle>
    </Card>
  );

  // 2. Alegem elementul de wrapping în funcție de destinație
  let LinkWrapper;

  if (isExternal) {
    // Dacă este extern sau cere tab nou, folosim <a> standard
    LinkWrapper = (
      <a 
        href={href} 
        className="block group" 
        target="_blank" 
        rel="noopener noreferrer" // Securitate obligatorie
      >
        {CardContent}
      </a>
    );
  } else {
    // Dacă este intern, folosim Next.js Link
    LinkWrapper = (
      <Link href={href} className="block group">
        {CardContent}
      </Link>
    );
  }

  // 3. Returnăm animația care încapsulează wrapper-ul ales
  return (
    <ScrollAnimation delay={delay / 1000}>
      {LinkWrapper}
    </ScrollAnimation>
  );
};