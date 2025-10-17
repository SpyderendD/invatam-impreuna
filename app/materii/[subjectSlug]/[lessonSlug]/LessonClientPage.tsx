// app/materii/[subjectSlug]/[lessonSlug]/LessonClientPage.tsx
'use client';

import React from 'react';
import { useLessonProgress } from '@/hooks/useLessonProgress';
import { Separator } from '@/components/ui/separator';
import type { Lesson } from '@/lib/lessons';

// Importăm componentele noastre specializate
import { LessonHeader } from './components/LessonHeader';
import { LessonContentWrapper } from './components/LessonContentWrapper';
import { LessonCompletionCard } from './components/LessonCompletionCard';

interface LessonClientPageProps {
  lesson: Lesson;
  subjectSlug: string;
  contentComponent: React.ReactNode; // Conținutul MDX compilat de pe server
}

export default function LessonClientPage({ lesson, subjectSlug, contentComponent }: LessonClientPageProps) {
  // 1. Gestiunea stării și a logicii rămâne aici
  const { completedLessons, toggleLesson, isLoading: isProgressLoading } = useLessonProgress();
  const isCompleted = completedLessons.has(lesson.id);

  // 2. Structura paginii devine o compoziție clară și declarativă
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 pt-12 md:pt-20">
        <div className="container max-w-4xl mx-auto px-4">
          
          <LessonHeader lesson={lesson} subjectSlug={subjectSlug} />

          <Separator className="my-12" />

          <LessonContentWrapper>
            {contentComponent}
          </LessonContentWrapper>

          <Separator className="my-12" />

          <LessonCompletionCard
            lesson={lesson}
            subjectSlug={subjectSlug}
            isCompleted={isCompleted}
            isLoading={isProgressLoading}
            onToggleCompletion={() => toggleLesson(lesson.id)}
          />
          
        </div>
      </main>
    </div>
  );
}