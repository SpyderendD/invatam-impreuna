// components/blog/VideoCard.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface VideoCardProps {
  videoId: string;
  title: string;
  index: number;
}

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  },
};

export function VideoCard({ videoId, title, index }: VideoCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      custom={index} // Poți folosi pentru stagger-delay dacă vrei
      className="group relative flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="aspect-video overflow-hidden">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={`Player video YouTube: ${title.replace(/"/g, '&quot;')}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          className="h-full w-full border-0"
        ></iframe>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 
          className="mb-3 min-h-[2.8em] font-semibold leading-tight text-foreground line-clamp-2"
          title={title}
        >
          {title}
        </h3>
        <a
          href={`https://www.youtube.com/watch?v=${videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center gap-2 self-start rounded-md bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-2.074-9.313a.75.75 0 0 1 1.05-.003l.074.063 4.5 3.75a.75.75 0 0 1 .007 1.05l-.064.074-4.5 3.75a.75.75 0 0 1-1.124-.984l.064-.073L14.053 12l-4.151-3.45a.75.75 0 0 1-.063-1.05z"></path></svg>
          Vezi pe YouTube
        </a>
      </div>
    </motion.div>
  );
}