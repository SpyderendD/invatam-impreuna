// components/subject-card.tsx
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from './ui/card';
import { ScrollAnimation } from '@/components/scroll-animation';

interface SubjectCardProps {
  title: string;
  icon: React.ReactNode;
  href: string;
  delay: number;
}

export const SubjectCard = ({ title, icon, href, delay }: SubjectCardProps) => {
  return (
    <ScrollAnimation delay={delay / 1000}> {/* Framer Motion folosește secunde */}
      <Link href={href} className="block group">
        <Card className="p-6 h-full text-center card-hover">
          <div className="text-primary group-hover:scale-110 transition-transform duration-300 mb-4 inline-block">
            {icon}
          </div>
          <CardTitle>{title}</CardTitle>
        </Card>
      </Link>
    </ScrollAnimation>
  );
};