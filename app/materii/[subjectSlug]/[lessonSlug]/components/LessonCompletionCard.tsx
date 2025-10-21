// app/materii/[subjectSlug]/[lessonSlug]/components/LessonCompletionCard.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Loader2, 
  PencilRuler, 
  Sparkles,
  ClipboardList 
} from 'lucide-react';
import type { Lesson } from '@/lib/lessons';

interface LessonCompletionCardProps {
  lesson: Lesson;
  subjectSlug: string;
  isCompleted: boolean;
  isLoading: boolean;
  onToggleCompletion: () => void;
}

export function LessonCompletionCard({ 
  lesson, 
  subjectSlug, 
  isCompleted, 
  isLoading, 
  onToggleCompletion 
}: LessonCompletionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="bg-accent/50 p-6 sm:p-8 rounded-2xl text-center border"
    >
      <Sparkles className="h-10 w-10 text-amber-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-foreground">Ai parcurs teoria!</h2>
      <p className="text-muted-foreground mt-2 max-w-md mx-auto">
        Marchează lecția ca terminată pentru a-ți urmări progresul și continuă cu exercițiile practice.
      </p>
      
      {/* Container pentru butoane, se adaptează pe mobil */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
        
        {/* Butonul principal pentru marcarea progresului */}
        <Button 
          size="lg" 
          variant={isCompleted ? "secondary" : "default"} 
          onClick={onToggleCompletion} 
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <CheckCircle className="h-5 w-5 mr-2" />}
          {isCompleted ? 'Lecție completată' : 'Marchează ca terminat'}
        </Button>

        {/* Butonul pentru Fișa de Lucru (apare condiționat) */}
        {lesson.worksheetSlug && (
          <Button size="lg" variant="outline" asChild className="group">
            <Link href={`/materii/${subjectSlug}/fisa-de-lucru/${lesson.worksheetSlug}`}>
              <ClipboardList className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              Mergi la Fișa de Lucru
            </Link>
          </Button>
        )}

        {/* Butonul pentru Test (apare condiționat) */}
        {lesson.quizSlug && (
          <Button size="lg" variant="outline" asChild className="group">
            <Link href={`/materii/${subjectSlug}/test/${lesson.quizSlug}`}>
              <PencilRuler className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-[-15deg]" />
              Mergi la Test
            </Link>
          </Button>
        )}

      </div>
    </motion.div>
  );
}