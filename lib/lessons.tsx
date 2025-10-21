// lib/lessons.tsx

import { JSX } from "react";
import {
  PenSquare, BookOpen, Languages, Waypoints, Calculator, InfinityIcon,
  Ruler, Cuboid, Sparkles, Drama, Mic, Heart, Scale, ClipboardList
} from "lucide-react";

// ============================================================================
// == TIPURI DE DATE (INTERFEȚE)
// ============================================================================

export interface Lesson {
  id: string;
  title: string;
  slug: string;
  duration: string;
  type: "Teorie" | "Formule" | "Exerciții";
  quizSlug?: string;
  worksheetSlug?: string;
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  lessons: Lesson[];
}

export interface Subject {
  id: "romana" | "matematica";
  title: string;
  chapters: Chapter[];
  icon: JSX.Element;
  isActive: boolean;
}

// ============================================================================
// == DATELE PENTRU MATERIA "LIMBA ROMÂNĂ" (completate)
// ============================================================================

const romanaChapters: Chapter[] = [
  {
    id: "redactare",
    title: "Redactare și Tipuri de Text",
    description: "Învață să structurezi și să redactezi diverse tipuri de compuneri.",
    icon: <PenSquare className="h-8 w-8 text-primary" />,
    lessons: [
      { id: "red-01", title: "Redactarea Rezumatului", slug: "redactarea-rezumatului", duration: "10 min", type: "Teorie", quizSlug: "test-rezumat", worksheetSlug: "fisa-rezumatul" },
      { id: "red-02", title: "Redactarea Paginii de Jurnal", slug: "redactarea-paginii-de-jurnal", duration: "10 min", type: "Teorie", quizSlug: "test-jurnal" },
      { id: "red-03", title: "Redactarea Scrisorii", slug: "redactarea-scrisorii", duration: "10 min", type: "Teorie", quizSlug: "test-scrisoare" },
      { id: "red-04", title: "Redactarea E-mailului", slug: "redactarea-emailului", duration: "5 min", type: "Teorie", quizSlug: "test-email" },
      { id: "red-05", title: "Textul Narativ: Teorie și Redactare", slug: "textul-narativ", duration: "20 min", type: "Teorie", quizSlug: "test-narativ", worksheetSlug: "fisa-text-narativ" },
      { id: "red-06", title: "Textul Descriptiv: Teorie și Redactare", slug: "textul-descriptiv", duration: "15 min", type: "Teorie", quizSlug: "test-descriptiv", worksheetSlug: "fisa-text-descriptiv" },
      { id: "red-07", title: "Textul Dialogat (Dialogul)", slug: "textul-dialogat", duration: "10 min", type: "Teorie", quizSlug: "test-dialogat", worksheetSlug: "fisa-text-dialogat" },
      { id: "red-08", title: "Textul Argumentativ (Argumentarea)", slug: "textul-argumentativ", duration: "15 min", type: "Teorie", quizSlug: "test-argumentativ", worksheetSlug: "fisa-text-argumentativ" },
      { id: "red-09", title: "Textul Explicativ", slug: "textul-explicativ", duration: "10 min", type: "Teorie", worksheetSlug: "fisa-text-explicativ" },
      { id: "red-10", title: "Textul Multimodal", slug: "textul-multimodal", duration: "10 min", type: "Teorie", worksheetSlug: "fisa-text-multimodal" },
    ],
  },
  {
    id: "literatura-teorie",
    title: "Teoria Literaturii",
    description: "Concepte fundamentale despre textul literar, nonliterar și genuri.",
    icon: <Sparkles className="h-8 w-8 text-primary" />,
    lessons: [
      { id: "lit-01", title: "Textul Literar vs. Nonliterar", slug: "textul-literar-vs-nonliterar", duration: "10 min", type: "Teorie", worksheetSlug: "fisa-text-literar-nonliterar" },
      { id: "lit-02", title: "Genul Epic", slug: "genul-epic", duration: "20 min", type: "Teorie", worksheetSlug: "fisa-genul-epic" },
      { id: "lit-03", title: "Genul Liric", slug: "genul-liric", duration: "15 min", type: "Teorie", worksheetSlug: "fisa-genul-liric" },
      { id: "lit-04", title: "Genul Dramatic", slug: "genul-dramatic", duration: "15 min", type: "Teorie", worksheetSlug: "fisa-genul-dramatic" },
    ],
  },
  {
    id: "figuri-stil",
    title: "Figuri de Stil și Imagini Artistice",
    description: "Descoperă instrumentele care dau expresivitate textului literar.",
    icon: <Heart className="h-8 w-8 text-primary" />,
    lessons: [
      { id: "fs-01", title: "Figuri de Stil (Epitete, Personificări, etc.)", slug: "figuri-de-stil", duration: "20 min", type: "Teorie" },
      { id: "fs-02", title: "Imagini Artistice (Vizuale, Auditive, etc.)", slug: "imagini-artistice", duration: "15 min", type: "Teorie" },
    ],
  },
  {
    id: "prozodie",
    title: "Elemente de Prozodie",
    description: "Înțelege muzicalitatea poeziei: rimă, ritm, măsură și strofă.",
    icon: <Mic className="h-8 w-8 text-primary" />,
    lessons: [
      { id: "proz-01", title: "Versificația: Strofa, Măsura, Ritmul", slug: "versificatia", duration: "10 min", type: "Teorie", worksheetSlug: "fisa-elemente-prozodie" },
      { id: "proz-02", title: "Tipuri de Rimă", slug: "tipuri-de-rima", duration: "10 min", type: "Teorie" },
    ],
  },
  {
    id: "morfologie",
    title: "Morfologie",
    description: "Aprofundează părțile de vorbire și caracteristicile lor.",
    icon: <BookOpen className="h-8 w-8 text-primary" />,
    lessons: [
      // Aici poți adăuga fișe de lucru pe măsură ce le creezi
      { id: "morf-01", title: "Verbul", slug: "verbul", duration: "25 min", type: "Teorie", quizSlug: "test-verbul" },
      { id: "morf-02", title: "Substantivul", slug: "substantivul", duration: "20 min", type: "Teorie", quizSlug: "test-substantivul" },
      { id: "morf-03", title: "Articolul", slug: "articolul", duration: "10 min", type: "Teorie" },
      { id: "morf-04", title: "Pronumele și Adjectivul Pronominal", slug: "pronumele", duration: "30 min", type: "Teorie" },
      { id: "morf-05", title: "Adjectivul", slug: "adjectivul", duration: "15 min", type: "Teorie", quizSlug: "test-adjectivul" },
      { id: "morf-06", title: "Numeralul", slug: "numeralul", duration: "15 min", type: "Teorie" },
      { id: "morf-07", title: "Adverbul", slug: "adverbul", duration: "10 min", type: "Teorie" },
      { id: "morf-08", title: "Părți de vorbire neflexibile", slug: "parti-de-vorbire-neflexibile", duration: "15 min", type: "Teorie" },
    ],
  },
  {
    id: "sintaxa",
    title: "Sintaxa",
    description: "Înțelege cum se combină cuvintele pentru a forma propoziții și fraze.",
    icon: <Waypoints className="h-8 w-8 text-primary" />,
    lessons: [
      { id: "sin-01", title: "Vorbirea directă și indirectă", slug: "vorbirea-directa-indirecta", duration: "15 min", type: "Teorie", worksheetSlug: "fisa-vorbirea-directa" },
      // Aici poți adăuga alte lecții de sintaxă din manual, dacă există
    ],
  },
  {
    id: "idei-plan",
    title: "Analiza Textului",
    description: "Extrage ideile principale și secundare și creează un plan de idei.",
    icon: <ClipboardList className="h-8 w-8 text-primary" />,
    lessons: [
      { id: "plan-01", title: "Planul simplu și dezvoltat de idei", slug: "planul-de-idei", duration: "15 min", type: "Teorie", worksheetSlug: "fisa-planul-de-idei" },
    ]
  },
];
// ============================================================================
// == DATELE PENTRU MATERIA "MATEMATICĂ" (rămân neschimbate)
// ============================================================================

const matematicaChapters: Chapter[] = [
  // ... capitolele tale de matematică rămân aici ...
];

// ============================================================================
// == STRUCTURA FINALĂ CARE VA FI FOLOSITĂ ÎN APLICAȚIE
// ============================================================================

export const ALL_SUBJECTS_OBJECT = {
  romana: {
    id: "romana",
    title: "Limba și Literatura Română",
    icon: <PenSquare />,
    chapters: romanaChapters,
    isActive: true,
  },
  matematica: {
    id: "matematica",
    title: "Matematică",
    icon: <Calculator />,
    chapters: matematicaChapters,
    isActive: true,
  },
} as const;
  
export const ALL_SUBJECTS: Subject[] = Object.values(ALL_SUBJECTS_OBJECT);