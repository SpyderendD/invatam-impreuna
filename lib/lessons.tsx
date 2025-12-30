// lib/lessons.tsx

import { JSX } from "react";
import {
  PenSquare, BookOpen, Languages, Waypoints, Calculator, InfinityIcon,
  Ruler, Cuboid, Sparkles, Drama, Mic, Heart, Scale, ClipboardList, SpellCheck, Link2, AudioWaveform, Network, Quote, Gem
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
  // CAPITOL: FONETICĂ
  // ========================================================================
  {
    id: "fonetica",
    title: "Fonetică",
    description: "Studiul sunetelor limbii române: vocale, consoane, diftongi și silabe.",
    icon: <AudioWaveform className="h-8 w-8 text-primary" />,
    lessons: [
      { id: "fon-01", title: "Vocale, Consoane, Semivocale, I șoptit", slug: "fonetica-sunete", duration: "15 min", type: "Teorie", worksheetSlug: "fisa-sunete" },
      { id: "fon-02", title: "Diftong, Triftong, Hiat", slug: "diftong-triftong-hiat", duration: "10 min", type: "Teorie", worksheetSlug: "fisa-diftong-triftong-hiat" },
      { id: "fon-03", title: "Reguli de Despărțire în Silabe", slug: "reguli-despartire", duration: "15 min", type: "Teorie", worksheetSlug: "fisa-despartire" },
      { id: "fon-04", title: "Accentul și Excepții", slug: "accentul", duration: "10 min", type: "Teorie", worksheetSlug: "fisa-accent" },
    ],
  },
  
  // ========================================================================
  // CAPITOL: RESPECTAREA NORMELOR DE ORTOGRAFIE ȘI PUNCTUAȚIE
  // ========================================================================
  {
    id: "ortografie-punctuatie",
    title: "Ortografie și Punctuație",
    description: "Ghid complet pentru scrierea corectă, de la cratimă la utilizarea virgulei.",
    icon: <Quote className="h-8 w-8 text-primary" />,
    lessons: [
      { id: "norm-01", title: "Semnele de Ortografie si punctuatie", slug: "semne-ortografie", duration: "15 min", type: "Teorie", worksheetSlug: "fisa-ortografie" },
    ],
  },
  
  // ========================================================================
  // CAPITOL: VOCABULAR
  // ========================================================================
  {
    id: "vocabular",
    title: "Vocabular",
    description: "Înțelege cum se formează cuvinte noi și relațiile de sens dintre ele.",
    icon: <SpellCheck className="h-8 w-8 text-primary" />,
    lessons: [
      { id: "vocab-01", title: "Derivare", slug: "derivare", duration: "10 min", type: "Teorie", worksheetSlug: "fisa-derivare" },
      { id: "vocab-02", title: "Compunere", slug: "compunere", duration: "10 min", type: "Teorie", worksheetSlug: "fisa-compunere" },
      { id: "vocab-03", title: "Conversiune", slug: "conversiunea", duration: "10 min", type: "Teorie", worksheetSlug: "fisa-conversiune" },
      { id: "vocab-04", title: "Imprumuturi", slug: "imprumuturi", duration: "10 min", type: "Teorie",  worksheetSlug: "fisa-imprumuturi" },
    ],
  },

  // ========================================================================
  // CAPITOL: MORFOLOGIE
  // ========================================================================
  {
    id: "morfologie",
    title: "Morfologie",
    description: "Analiza detaliată a fiecărei părți de vorbire și a caracteristicilor sale.",
    icon: <BookOpen className="h-8 w-8 text-primary" />,
    lessons: [
      { id: "morf-01", title: "Verbul", slug: "verbul", duration: "25 min", type: "Teorie", worksheetSlug: "fisa-verbul" },
      { id: "morf-02", title: "Substantivul și Articolul", slug: "substantivul-si-articolul", duration: "25 min", type: "Teorie", worksheetSlug: "fisa-substantivul" },
      { id: "morf-03", title: "Adjectivul și Gradele de Comparație", slug: "adjectivul", duration: "20 min", type: "Teorie", worksheetSlug: "fisa-adjectivul" },
      { id: "morf-04", title: "Pronumele și Adjectivul Pronominal", slug: "pronumele-si-adjectivul-pronominal", duration: "30 min", type: "Teorie", worksheetSlug: "fisa-pronumele" },
      { id: "morf-05", title: "Numeralul", slug: "numeralul", duration: "15 min", type: "Teorie", worksheetSlug: "fisa-numeralul" },
      { id: "morf-06", title: "Adverbul", slug: "adverbul", duration: "15 min", type: "Teorie", worksheetSlug: "fisa-adverbul" },
      { id: "morf-07", title: "Prepoziția", slug: "prepozitia", duration: "10 min", type: "Teorie", worksheetSlug: "fisa-prepozitie" },
      { id: "morf-08", title: "Conjuncția", slug: "conjunctia", duration: "10 min", type: "Teorie", worksheetSlug: "fisa-conjunctia" },
      { id: "morf-09", title: "Interjecția", slug: "interjectia", duration: "10 min", type: "Teorie", worksheetSlug: "fisa-interjectia" },
    ],
  },
  
  // ========================================================================
  // CAPITOL: SINTAXA
  // ========================================================================
  {
    id: "sintaxa",
    title: "Sintaxa",
    description: "Învață despre propoziții, fraze, relații și construcții sintactice.",
    icon: <Waypoints className="h-8 w-8 text-primary" />,
    lessons: [
      { id: "sin-01", title: "Tipuri de propozitii si enunturi", slug: "propozitia", duration: "20 min", type: "Teorie" , worksheetSlug: "fisa-propozitia" },
      { id: "sin-02", title: "Relatii sinctactice", slug: "relatii-sintactice", duration: "15 min", type: "Teorie", worksheetSlug: "fisa-sintactica" },
      { id: "sin-03", title: "Constructii", slug: "constructii", duration: "15 min", type: "Teorie", worksheetSlug: "fisa-constructii" },
      { id: "sin-04", title: "Apozitia", slug: "apozitia", duration: "15 min", type: "Teorie", worksheetSlug: "fisa-apozitie" },
    ],
  },
  
  // ========================================================================
  // CAPITOL: FUNCȚII SINTACTICE
  // ========================================================================
  {
    id: "functii-sintactice",
    title: "Funcții Sintactice și Realizările Lor",
    description: "Analiza părților de propoziție și a propozițiilor subordonate corespondente.",
    icon: <Network className="h-8 w-8 text-primary" />,
    lessons: [
      { id: "fs-01", title: "Predicatul si fraza", slug: "functii-sintactice-predicatul", duration: "15 min", type: "Teorie", worksheetSlug: "fisa-predicatul" },
      { id: "fs-02", title: "Subiectul", slug: "functii-sintactice-subiectul", duration: "15 min", type: "Teorie", worksheetSlug: "fisa-subiectul" },
      { id: "fs-03", title: "Atributul și Propoziția Atributivă", slug: "functii-sintactice-atributul", duration: "15 min", type: "Teorie", worksheetSlug: "fisa-atributul" },
      { id: "fs-04", title: "Complementul și Propozițiile Completive", slug: "functii-sintactice-complementul", duration: "25 min", type: "Teorie", worksheetSlug: "fisa-complementul" },
      { id: "fs-05", title: "Circumstanțialul și Propozițiile Circumstanțiale", slug: "functii-sintactice-circumstantialul", duration: "25 min", type: "Teorie", worksheetSlug: "fisa-circumstantialul" },
    ],
  },

  // ========================================================================
  // CAPITOL: REDACTARE
  // ========================================================================
  {
    id: "redactare",
    title: "Redactare, Stil și Teorie Literară",
    description: "Ghid complet pentru a scrie, analiza și înțelege diverse tipuri de texte.",
    icon: <PenSquare className="h-8 w-8 text-primary" />,
    lessons: [
      { id: "red-01", title: "Tipuri de Texte (Narativ, Descriptiv, etc.)", slug: "tipuri-texte", duration: "15 min", type: "Teorie", worksheetSlug: "fisa-tipuri-text" },
      { id: "red-02", title: "Planul de Idei", slug: "planul-de-idei", duration: "10 min", type: "Teorie", worksheetSlug: "fisa-planul-de-idei" },
      { id: "red-02", title: "Mesajul textului", slug: "mesajul-textului", duration: "10 min", type: "Teorie", worksheetSlug: "fisa-mesaj" },
      { id: "red-03", title: "Redactarea unui Rezumat", slug: "redactarea-rezumatului", duration: "10 min", type: "Teorie", worksheetSlug: "fisa-rezumatul" },
      { id: "red-04", title: "Caracterizarea Personajului", slug: "caracterizarea", duration: "15 min", type: "Teorie", worksheetSlug: "fisa-caracterizare" },
      { id: "red-05", title: "Scrisoarea, E-mailul, Jurnalul", slug: "scrisoare-email-jurnal", duration: "15 min", type: "Teorie", worksheetSlug: "fisa-scrisoare-email-jurnal" },
      { id: "red-06", title: "Cererea și Stilul", slug: "cererea", duration: "10 min", type: "Teorie", worksheetSlug: "fisa-cerere" },
    ],
  },
  
  // ========================================================================
  // CAPITOL: VALORI CULTURALE / MORALE
  // ========================================================================
  {
    id: "valori-culturale",
    title: "Valori Culturale și Morale",
    description: "Analiza ideilor și valorilor transmise prin texte literare.",
    icon: <Gem className="h-8 w-8 text-primary" />,
    lessons: [
      { id: "val-01", title: "Identificarea Valorilor în Text", slug: "valori-culturale", duration: "15 min", type: "Teorie", worksheetSlug: "fisa-valori" },
    ],
  },

// ========================================================================
  // CAPITOL: CATEGORII SEMANTICE
  // ========================================================================
  {
    id: "categorii-semantice",
    title: "Categorii Semantice",
    description: "Explorează relațiile de sens dintre cuvinte: sinonime, antonime, omonime etc.",
    icon: <Link2 className="h-8 w-8 text-primary" />,
    lessons: [
      { id: "sem-01", title: "Sinonime, Antonime, Omonime, Omofone, Omografe, Paronime, Pleonasmul, Campul lexical, Locutiunea", slug: "categorii-semantice", duration: "20 min", type: "Teorie", worksheetSlug: "fisa-categorii-semantice" },
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