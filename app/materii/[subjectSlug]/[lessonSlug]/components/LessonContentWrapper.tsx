// app/materii/[subjectSlug]/[lessonSlug]/components/LessonContentWrapper.tsx
'use client';

import { motion } from 'framer-motion';

interface LessonContentWrapperProps {
  children: React.ReactNode;
}

export function LessonContentWrapper({ children }: LessonContentWrapperProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-lora prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-ul:list-disc prose-li:my-1 prose-blockquote:border-l-blue-500"
    >
      {children}
    </motion.article>
  );
}