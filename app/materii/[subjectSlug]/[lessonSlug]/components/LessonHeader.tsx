// app/materii/[subjectSlug]/[lessonSlug]/components/LessonHeader.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft } from 'lucide-react';
import type { Lesson } from '@/lib/lessons';

interface LessonHeaderProps {
  lesson: Lesson;
  subjectSlug: string;
}

export function LessonHeader({ lesson, subjectSlug }: LessonHeaderProps) {
  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
      <Button asChild variant="outline" className="mb-8 group transition-all duration-300 hover:border-primary">
        <Link href={`/materii/${subjectSlug}`}>
          <ChevronLeft className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
          Înapoi la listă
        </Link>
      </Button>
      <Badge variant="secondary" className="mb-2">{lesson.type}</Badge>
      <h1 className="font-lora text-4xl md:text-5xl font-medium text-foreground">
        {lesson.title}
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Durata estimată: {lesson.duration}.
      </p>
    </motion.div>
  );
}