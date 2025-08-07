// lib/lessons.tsx

import { JSX } from "react";
import {
  PenSquare,
  BookOpen,
  Languages,
  Waypoints,
  Calculator,
  InfinityIcon,
  Ruler,
  Cuboid,
  Sparkles,
} from "lucide-react";

// ============================================================================
// == TIPURI DE DATE (INTERFEȚE) - EXPORTATE PENTRU A FI FOLOSITE GLOBAL
// ============================================================================

export interface Lesson {
  id: string;
  title: string;
  slug: string;
  duration: string;
  type: "Teorie" | "Formule" | "Exerciții";
  quizSlug?: string;
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
// == DATELE PENTRU FIECARE MATERIE (constante interne)
// ============================================================================

const romanaChapters: Chapter[] = [
  {
    id: "compunere",
    title: "Tipuri de Compunere",
    description: "Învață să structurezi și să redactezi corect diverse tipuri de texte.",
    icon: <PenSquare className="h-8 w-8 text-primary" />,
    lessons: [
      { id: "comp-01", title: "Redactarea rezumatului", slug: "redactarea-rezumatului", duration: "10 min", type: "Teorie", quizSlug: "test-rezumat" },
      { id: "comp-02", title: "Redactarea unei pagini de jurnal", slug: "redactarea-paginii-de-jurnal", duration: "10 min", type: "Teorie", quizSlug: "test-jurnal" },
      { id: "comp-03", title: "Redactarea unei scrisori", slug: "redactarea-scrisorii", duration: "10 min", type: "Teorie", quizSlug: "test-scrisoare" },
      { id: "comp-04", title: "Redactarea unui e-mail", slug: "redactarea-emailului", duration: "5 min", type: "Teorie", quizSlug: "test-email" },
      { id: "comp-05", title: "Textul argumentativ", slug: "textul-argumentativ", duration: "15 min", type: "Teorie", quizSlug: "test-argumentativ" },
      { id: "comp-06", title: "Textul narativ", slug: "textul-narativ", duration: "10 min", type: "Teorie", quizSlug: "test-narativ" },
      { id: "comp-07", title: "Textul dialogat", slug: "textul-dialogat", duration: "10 min", type: "Teorie", quizSlug: "test-dialogat" },
      { id: "comp-08", title: "Textul descriptiv", slug: "textul-descriptiv", duration: "10 min", type: "Teorie", quizSlug: "test-descriptiv" },
    ],
  },
  {
    id: "morfologie",
    title: "Morfologie",
    description: "Aprofundează părțile de vorbire și caracteristicile lor gramaticale.",
    icon: <BookOpen className="h-8 w-8 text-primary" />,
    lessons: [
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
    id: "fonetica-lexic",
    title: "Fonetică și Lexic",
    description: "Descoperă sunetele limbii române și bogăția vocabularului.",
    icon: <Languages className="h-8 w-8 text-primary" />,
    lessons: [
      { id: "fon-01", title: "Ortoepie și Ortografie", slug: "ortoepie-si-ortografie", duration: "15 min", type: "Teorie" },
      { id: "fon-02", title: "Vocabular și Mijloace de Îmbogățire", slug: "vocabularul", duration: "20 min", type: "Teorie" },
      { id: "fon-03", title: "Categorii Semantice", slug: "categorii-semantice", duration: "20 min", type: "Teorie" },
    ],
  },
  {
    id: "sintaxa",
    title: "Sintaxa",
    description: "Înțelege cum se combină cuvintele pentru a forma propoziții și fraze.",
    icon: <Waypoints className="h-8 w-8 text-primary" />,
    lessons: [
      { id: "sin-01", title: "Propoziția și Fraza", slug: "propozitia-si-fraza", duration: "15 min", type: "Teorie" },
      { id: "sin-02", title: "Părți de Propoziție Principale", slug: "parti-de-propozitie-principale", duration: "15 min", type: "Teorie" },
      { id: "sin-03", title: "Părți de Propoziție Secundare", slug: "parti-de-propozitie-secundare", duration: "25 min", type: "Teorie" },
      { id: "sin-04", title: "Relații Sintactice", slug: "relatii-sintactice", duration: "10 min", type: "Teorie" },
    ],
  },
  {
    id: "literatura",
    title: "Literatură",
    description: "Explorează genurile literare și magia textelor scrise.",
    icon: <Sparkles className="h-8 w-8 text-primary" />,
    lessons: [
      { id: "lit-01", title: "Textul Literar vs. Nonliterar", slug: "textul-literar-vs-nonliterar", duration: "10 min", type: "Teorie" },
      { id: "lit-02", title: "Genul Epic", slug: "genul-epic", duration: "20 min", type: "Teorie" },
      { id: "lit-03", title: "Genul Liric", slug: "genul-liric", duration: "20 min", type: "Teorie" },
      { id: "lit-04", title: "Genul Dramatic", slug: "genul-dramatic", duration: "15 min", type: "Teorie" },
      { id: "lit-05", title: "Figuri de Stil și Imagini Artistice", slug: "figuri-de-stil-si-imagini-artistice", duration: "15 min", type: "Teorie" },
    ],
  },
];

const matematicaChapters: Chapter[] = [
  {
    id: "algebra-fundamente",
    title: "Algebră: Fundamente și Numere",
    description: "Explorează mulțimile numerice, divizibilitatea și operațiile de bază.",
    icon: <InfinityIcon className="h-8 w-8 text-primary" />,
    lessons: [
      { id: "alg-01", title: "Mulțimi numerice", slug: "multimi-numerice", duration: "15 min", type: "Teorie" },
      { id: "alg-02", title: "Unități de măsură", slug: "unitati-de-masura", duration: "10 min", type: "Formule" },
      { id: "alg-03", title: "Numere naturale și Divizibilitate", slug: "numere-naturale-divizibilitate", duration: "20 min", type: "Teorie" },
      { id: "alg-04", title: "Fracții (ordinare și zecimale)", slug: "fractii", duration: "15 min", type: "Teorie" },
      { id: "alg-05", title: "Modul, Partea Întreagă și Fracționară", slug: "modul-si-parti", duration: "15 min", type: "Teorie" },
      { id: "alg-06", title: "Puteri și Radicali", slug: "puteri-si-radicali", duration: "20 min", type: "Formule" },
    ],
  },
  {
    id: "algebra-calcul",
    title: "Algebră: Calcul Algebric și Funcții",
    description: "De la formule de calcul la ecuații, sisteme și funcții.",
    icon: <Calculator className="h-8 w-8 text-primary" />,
    lessons: [
      { id: "alg-07", title: "Formule de calcul prescurtat", slug: "calcul-prescurtat", duration: "15 min", type: "Formule" },
      { id: "alg-08", title: "Medii (aritmetică, geometrică, etc.)", slug: "medii", duration: "10 min", type: "Formule" },
      { id: "alg-09", title: "Intervale în ℝ", slug: "intervale-in-r", duration: "10 min", type: "Teorie" },
      { id: "alg-10", title: "Ecuații și Inecuații", slug: "ecuatii-si-inecuatii", duration: "25 min", type: "Teorie" },
      { id: "alg-11", title: "Produsul Cartezian și Funcții", slug: "produs-cartezian-functii", duration: "20 min", type: "Teorie" },
      { id: "alg-12", title: "Funcția de gradul I", slug: "functia-de-gradul-1", duration: "15 min", type: "Teorie" },
      { id: "alg-13", title: "Ecuația de gradul II", slug: "ecuatia-de-gradul-2", duration: "15 min", type: "Teorie" },
      { id: "alg-14", title: "Sisteme de ecuații", slug: "sisteme-de-ecuatii", duration: "20 min", type: "Exerciții" },
    ],
  },
  {
    id: "geometrie-plan",
    title: "Geometrie în Plan",
    description: "Proprietățile figurilor geometrice plane, de la unghiuri la poligoane.",
    icon: <Ruler className="h-8 w-8 text-primary" />,
    lessons: [
      { id: "geo-01", title: "Puncte, drepte și unghiul", slug: "puncte-drepte-unghiul", duration: "15 min", type: "Teorie" },
      { id: "geo-02", title: "Triunghiul: Clasificare și congruență", slug: "triunghiul-clasificare", duration: "20 min", type: "Teorie" },
      { id: "geo-03", title: "Linii importante în triunghi", slug: "linii-importante-triunghi", duration: "20 min", type: "Teorie" },
      { id: "geo-04", title: "Arii și Relații metrice în triunghi", slug: "arii-si-relatii-metrice", duration: "25 min", type: "Formule" },
      { id: "geo-05", title: "Patrulatere", slug: "patrulatere", duration: "20 min", type: "Teorie" },
      { id: "geo-06", title: "Arii și Perimetre (Patrulatere)", slug: "arii-perimetre-patrulatere", duration: "15 min", type: "Formule" },
      { id: "geo-07", title: "Cercul", slug: "cercul", duration: "15 min", type: "Teorie" },
      { id: "geo-08", title: "Poligoane Regulate", slug: "poligoane-regulate", duration: "15 min", type: "Formule" },
    ],
  },
  {
    id: "geometrie-spatiu",
    title: "Geometrie în Spațiu",
    description: "Calculează arii și volume pentru principalele corpuri geometrice.",
    icon: <Cuboid className="h-8 w-8 text-primary" />,
    lessons: [
      { id: "geo-09", title: "Relații între puncte, drepte și plane", slug: "geometrie-spatiu-intro", duration: "15 min", type: "Teorie" },
      { id: "geo-10", title: "Prisma", slug: "prisma", duration: "15 min", type: "Formule" },
      { id: "geo-11", title: "Cubul și Paralelipipedul dreptunghic", slug: "cub-paralelipiped", duration: "15 min", type: "Formule" },
      { id: "geo-12", title: "Piramida", slug: "piramida", duration: "20 min", type: "Formule" },
      { id: "geo-13", title: "Trunchiul de piramidă", slug: "trunchi-piramida", duration: "15 min", type: "Formule" },
      { id: "geo-14", title: "Cilindrul", slug: "cilindrul", duration: "10 min", type: "Formule" },
      { id: "geo-15", title: "Conul", slug: "conul", duration: "10 min", type: "Formule" },
      { id: "geo-16", title: "Trunchiul de Con", slug: "trunchi-con", duration: "10 min", type: "Formule" },
      { id: "geo-17", title: "Sfera", slug: "sfera", duration: "5 min", type: "Formule" },
    ],
  },
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