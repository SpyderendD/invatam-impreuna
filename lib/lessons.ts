import React, { JSX } from "react";
import { PenSquare, BookOpen, MessageSquareQuote } from "lucide-react";

export interface Lesson {
  id: string;
  title: string;
  slug: string;
  duration: string;
  type: 'Teorie' | 'Exerciții';
  quizSlug?: string;
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  lessons: Lesson[];
}

export const romanaChapters: Chapter[] = [
  {
    id: 'gramatica',
    title: 'Gramatică',
    description: 'Stăpânește regulile care definesc structura limbii române.',
    icon: React.createElement(PenSquare, { className: "h-8 w-8 text-blue-500" }),
    lessons: [
      { id: 'gram-01', title: 'Substantivul: Definiție și Clasificare', slug: 'substantivul', duration: '15 min', type: 'Teorie', quizSlug: 'test-substantivul' },
      { id: 'gram-02', title: 'Adjectivul și Gradele de Comparație', slug: 'adjectivul', duration: '18 min', type: 'Teorie', quizSlug: 'test-adjectivul' },
    ],
  },
  {
    id: 'literatura',
    title: 'Literatură',
    description: 'Explorează operele și autorii canonici ai literaturii române.',
    icon: React.createElement(BookOpen, { className: "h-8 w-8 text-purple-500" }),
    lessons: [
      { id: 'lit-01', title: 'Genul Liric: Figuri de Stil', slug: 'genul-liric', duration: '20 min', type: 'Teorie' },
    ],
  },
];