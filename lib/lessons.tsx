// lib/lessons.tsx

import { JSX } from "react";
import {
  PenSquare, BookOpen, Languages, Waypoints, Calculator, InfinityIcon,
  Ruler, Cuboid, Sparkles, Drama, Mic, Heart, Scale, ClipboardList, SpellCheck
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
  // ========================================================================
  // PILONUL 1: FUNDAȚIA LIMBII
  // ========================================================================
  {
    id: "fonetica-ortografie",
    title: "Fonetică și Ortografie",
    description: "Înțelege sunetele, literele, silabele și regulile de scriere corectă.",
    icon: <Languages className="h-8 w-8 text-primary" />,
    lessons: [
      { id: "com-01", title: "Ortografie și Ortoepie", slug: "ortografie-si-ortoepie", duration: "20 min", type: "Teorie" },
      { id: "com-02", title: "Semne de Ortoepie și Punctuație", slug: "semne-ortografie-punctuatie", duration: "15 min", type: "Teorie" },
    ],
  },
  {
    id: "vocabular",
    title: "Vocabular (Lexic)",
    description: "Explorează universul cuvintelor, de la formare la relațiile de sens.",
    icon: <SpellCheck className="h-8 w-8 text-primary" />, // Iconiță nouă și relevantă
    lessons: [
      { id: "com-03", title: "Mijloace de Îmbogățire a Vocabularului", slug: "vocabularul", duration: "25 min", type: "Teorie" },
      { id: "com-04", title: "Categorii Semantice (Sinonime, etc.)", slug: "categorii-semantice", duration: "20 min", type: "Teorie" },
    ],
  },

  // ========================================================================
  // PILONUL 2: CONSTRUCȚIA PROPOZIȚIILOR
  // ========================================================================
  {
    id: "morfologie",
    title: "Morfologie",
    description: "Stăpânește părțile de vorbire și caracteristicile lor gramaticale.",
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
    id: "sintaxa",
    title: "Sintaxa",
    description: "Învață cum se combină cuvintele pentru a forma propoziții și fraze corecte.",
    icon: <Waypoints className="h-8 w-8 text-primary" />,
    lessons: [
      // Lecțiile tale de sintaxă vor veni aici
      { id: "sin-01", title: "Vorbirea directă și indirectă", slug: "vorbirea-directa-indirecta", duration: "15 min", type: "Teorie", worksheetSlug: "fisa-vorbirea-directa" },
    ],
  },

  // ========================================================================
  // PILONUL 3: ARTA SCRISULUI ȘI A ANALIZEI
  // ========================================================================
  {
    id: "teoria-literaturii",
    title: "Teoria Literaturii și a Textului",
    description: "Diferențiază tipurile de text și înțelege marile genuri literare.",
    icon: <Sparkles className="h-8 w-8 text-primary" />,
    lessons: [
      { id: "lit-01", title: "Textul Literar vs. Nonliterar", slug: "textul-literar-vs-nonliterar", duration: "10 min", type: "Teorie", worksheetSlug: "fisa-text-literar-nonliterar" },
      { id: "gen-01", title: "Genul Epic", slug: "genul-epic", duration: "20 min", type: "Teorie", worksheetSlug: "fisa-genul-epic" },
      { id: "gen-02", title: "Genul Liric", slug: "genul-liric", duration: "15 min", type: "Teorie", worksheetSlug: "fisa-genul-liric" },
      { id: "gen-03", title: "Genul Dramatic", slug: "genul-dramatic", duration: "15 min", type: "Teorie", worksheetSlug: "fisa-genul-dramatic" },
    ],
  },
  {
    id: "tehnici-redactare",
    title: "Tehnici de Redactare",
    description: "Învață să structurezi și să scrii corect diverse tipuri de compuneri.",
    icon: <PenSquare className="h-8 w-8 text-primary" />,
    lessons: [
      { id: "red-01", title: "Planul simplu și dezvoltat de idei", slug: "planul-de-idei", duration: "15 min", type: "Teorie", worksheetSlug: "fisa-planul-de-idei" },
      { id: "red-02", title: "Redactarea Rezumatului", slug: "redactarea-rezumatului", duration: "10 min", type: "Teorie", quizSlug: "test-rezumat", worksheetSlug: "fisa-rezumatul" },
      { id: "red-03", title: "Redactarea Paginii de Jurnal", slug: "redactarea-paginii-de-jurnal", duration: "10 min", type: "Teorie", quizSlug: "test-jurnal" },
      { id: "red-04", title: "Redactarea Scrisorii", slug: "redactarea-scrisorii", duration: "10 min", type: "Teorie", quizSlug: "test-scrisoare" },
      { id: "red-05", title: "Redactarea E-mailului", slug: "redactarea-emailului", duration: "5 min", type: "Teorie", quizSlug: "test-email" },
      { id: "red-06", title: "Textul Narativ", slug: "textul-narativ", duration: "20 min", type: "Teorie", quizSlug: "test-narativ", worksheetSlug: "fisa-text-narativ" },
      { id: "red-07", title: "Textul Descriptiv", slug: "textul-descriptiv", duration: "15 min", type: "Teorie", quizSlug: "test-descriptiv", worksheetSlug: "fisa-text-descriptiv" },
      { id: "red-08", title: "Textul Dialogat", slug: "textul-dialogat", duration: "10 min", type: "Teorie", quizSlug: "test-dialogat", worksheetSlug: "fisa-text-dialogat" },
      { id: "red-09", title: "Textul Argumentativ", slug: "textul-argumentativ", duration: "15 min", type: "Teorie", quizSlug: "test-argumentativ", worksheetSlug: "fisa-text-argumentativ" },
      { id: "red-10", title: "Textul Explicativ", slug: "textul-explicativ", duration: "10 min", type: "Teorie", worksheetSlug: "fisa-text-explicativ" },
      { id: "red-11", title: "Textul Multimodal", slug: "textul-multimodal", duration: "10 min", type: "Teorie", worksheetSlug: "fisa-text-multimodal" },
    ],
  },
  {
    id: "instrumente-stilistice",
    title: "Instrumente Stilistice",
    description: "Explorează uneltele care aduc expresivitate și emoție textelor literare.",
    icon: <Heart className="h-8 w-8 text-primary" />,
    lessons: [
      { id: "stil-01", title: "Figuri de Stil", slug: "figuri-de-stil", duration: "20 min", type: "Teorie", worksheetSlug: "fisa-figuri-de-stil" },
      { id: "stil-02", title: "Imagini Artistice", slug: "imagini-artistice", duration: "15 min", type: "Teorie", worksheetSlug: "fisa-imagini-artistice" },
      { id: "proz-01", title: "Elemente de Prozodie (Rima, Ritm)", slug: "elemente-de-prozodie", duration: "15 min", type: "Teorie", worksheetSlug: "fisa-elemente-prozodie" },
      { id: "stil-03", title: "Variante Stilistice ale Limbii", slug: "variante-stilistice", duration: "15 min", type: "Teorie" },
      { id: "stil-04", title: "Calitățile Stilului", slug: "calitatile-stilului", duration: "15 min", type: "Teorie" },
    ],
  },
];
// ============================================================================
// == DATELE PENTRU MATERIA "MATEMATICĂ" (rămân neschimbate)
// ============================================================================

const matematicaChapters: Chapter[] = [
  {
    id: "algebra-fundamente",
    title: "Algebră: Fundamente și Numere",
    description: "Explorează mulțimile numerice, divizibilitatea și operațiile de bază.",
    icon: <InfinityIcon className="h-8 w-8 text-primary" />,
    lessons: [
      { id: "alg-01", title: "Mulțimi numerice (ℕ, ℤ, ℚ, ℝ)", slug: "multimi-numerice", duration: "15 min", type: "Teorie" },
      { id: "alg-02", title: "Divizibilitate în ℕ", slug: "divizibilitate", duration: "20 min", type: "Teorie" },
      { id: "alg-03", title: "Fracții ordinare și zecimale", slug: "fractii", duration: "15 min", type: "Teorie" },
      { id: "alg-04", title: "Rapoarte, Proporții, Procente", slug: "rapoarte-proportii-procente", duration: "15 min", type: "Formule" },
      { id: "alg-05", title: "Puteri și Radicali", slug: "puteri-si-radicali", duration: "20 min", type: "Formule" },
      { id: "alg-06", title: "Calcul cu numere reale", slug: "calcul-numere-reale", duration: "20 min", type: "Exerciții" },
    ],
  },
  {
    id: "algebra-calcul",
    title: "Algebră: Calcul Algebric și Funcții",
    description: "De la formule de calcul la ecuații, sisteme și funcții.",
    icon: <Calculator className="h-8 w-8 text-primary" />,
    lessons: [
      { id: "alg-07", title: "Formule de calcul prescurtat", slug: "formule-calcul-prescurtat", duration: "15 min", type: "Formule" },
      { id: "alg-08", title: "Descompunerea în factori", slug: "descompunere-factori", duration: "15 min", type: "Exerciții" },
      { id: "alg-09", title: "Ecuații și inecuații de gradul I", slug: "ecuatii-inecuatii-grad-1", duration: "25 min", type: "Teorie" },
      { id: "alg-10", title: "Ecuația de gradul II", slug: "ecuatia-grad-2", duration: "15 min", type: "Teorie" },
      { id: "alg-11", title: "Sisteme de ecuații", slug: "sisteme-de-ecuatii", duration: "20 min", type: "Exerciții" },
      { id: "alg-12", title: "Funcții și elemente de grafic", slug: "functii-si-grafice", duration: "20 min", type: "Teorie" },
    ],
  },
  {
    id: "geometrie-plan",
    title: "Geometrie în Plan",
    description: "Proprietățile figurilor geometrice plane, de la unghiuri la poligoane.",
    icon: <Ruler className="h-8 w-8 text-primary" />,
    lessons: [
      { id: "geo-01", title: "Unghiuri și Drepte paralele", slug: "unghiuri-drepte-paralele", duration: "15 min", type: "Teorie" },
      { id: "geo-02", title: "Triunghiul: Clasificare și proprietăți", slug: "triunghiul-proprietati", duration: "20 min", type: "Teorie" },
      { id: "geo-03", title: "Linii importante în triunghi", slug: "linii-importante-triunghi", duration: "20 min", type: "Teorie" },
      { id: "geo-04", title: "Relații metrice în triunghiul dreptunghic", slug: "relatii-metrice-triunghi", duration: "25 min", type: "Formule" },
      { id: "geo-05", title: "Asemănarea triunghiurilor", slug: "asemanarea-triunghiurilor", duration: "15 min", type: "Teorie" },
      { id: "geo-06", title: "Patrulatere: Proprietăți și arii", slug: "patrulatere", duration: "20 min", type: "Formule" },
      { id: "geo-07", title: "Cercul și Poligoane regulate", slug: "cercul-si-poligoane", duration: "15 min", type: "Formule" },
    ],
  },
  {
    id: "geometrie-spatiu",
    title: "Geometrie în Spațiu",
    description: "Calculează arii și volume pentru principalele corpuri geometrice.",
    icon: <Cuboid className="h-8 w-8 text-primary" />,
    lessons: [
      { id: "geo-08", title: "Puncte, drepte, plane", slug: "puncte-drepte-plane-spatiu", duration: "15 min", type: "Teorie" },
      { id: "geo-09", title: "Prisma: Arie și Volum", slug: "prisma", duration: "15 min", type: "Formule" },
      { id: "geo-10", title: "Piramida: Arie și Volum", slug: "piramida", duration: "20 min", type: "Formule" },
      { id: "geo-11", title: "Trunchiul de piramidă", slug: "trunchi-piramida", duration: "15 min", type: "Formule" },
      { id: "geo-12", title: "Corpuri rotunde (Cilindru, Con, Sferă)", slug: "corpuri-rotunde", duration: "20 min", type: "Formule" },
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