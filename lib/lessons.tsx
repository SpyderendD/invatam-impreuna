// lib/lessons.tsx

import { JSX } from "react";
import {
  PenSquare, BookOpen, Languages, Waypoints, Calculator, InfinityIcon,
  Ruler, Cuboid, Sparkles, Drama, Mic, Heart, Scale, ClipboardList, SpellCheck, Link2, AudioWaveform, Network, Quote, Gem, Sigma, Percent, GitCompareArrows, FunctionSquare
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
      { id: "fs-01", title: "Predicatul si fraza", slug: "predicatul", duration: "15 min", type: "Teorie", worksheetSlug: "fisa-predicat" },
      { id: "fs-02", title: "Subiectul", slug: "subiectul", duration: "15 min", type: "Teorie", worksheetSlug: "fisa-subiect" },
      { id: "fs-03", title: "Atributul și Propoziția Atributivă", slug: "atributul", duration: "15 min", type: "Teorie", worksheetSlug: "fisa-atribut" },
      { id: "fs-04", title: "Complementul și Propozițiile Completive", slug: "complementul", duration: "25 min", type: "Teorie", worksheetSlug: "fisa-complement" },
      { id: "fs-05", title: "Circumstanțialul și Propozițiile Circumstanțiale", slug: "circumstantialele", duration: "25 min", type: "Teorie", worksheetSlug: "fisa-circumstantiale" },
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
// == DATELE PENTRU MATEMATICĂ (ALINIATE CU PROGRAMA DE EXAMEN)
// ============================================================================

const matematicaChapters: Chapter[] = [
  {
    id: "numere",
    title: "Mulțimi și Numere",
    description: "De la numere naturale la numere reale. Operații, divizibilitate și intervale.",
    icon: <Sigma className="h-8 w-8 text-primary" />,
    lessons: [
      { id: "mate_num_01", title: "Mulțimi: Relații și Operații", slug: "multimi-relatii-operatii", duration: "20 min", type: "Teorie" },
      { id: "mate_num_02", title: "Mulțimea Numerelor Naturale (ℕ)", slug: "numere-naturale", duration: "25 min", type: "Teorie" },
      { id: "mate_num_03", title: "Mulțimea Numerelor Întregi (ℤ)", slug: "numere-intregi", duration: "15 min", type: "Teorie" },
      { id: "mate_num_04", title: "Mulțimea Numerelor Raționale (ℚ)", slug: "numere-rationale", duration: "25 min", type: "Teorie" },
      { id: "mate_num_05", title: "Mulțimea Numerelor Reale (ℝ)", slug: "numere-reale", duration: "20 min", type: "Teorie" },
      { id: "mate_num_06", title: "Intervale Numerice în ℝ", slug: "intervale-numerice", duration: "15 min", type: "Exerciții" },
    ],
  },
  {
    id: "rapoarte-procente",
    title: "Rapoarte, Proporții și Organizarea Datelor",
    description: "Mărimi proporționale, procente, probabilități și elemente de statistică.",
    icon: <Percent className="h-8 w-8 text-primary" />,
    lessons: [
      { id: "mate_rap_01", title: "Rapoarte și Proporții", slug: "rapoarte-si-proportii", duration: "20 min", type: "Teorie" },
      { id: "mate_rap_02", title: "Mărimi Direct/Invers Proporționale", slug: "marimi-proportionale", duration: "20 min", type: "Exerciții" },
      { id: "mate_rap_03", title: "Procente. Calcul Procentual", slug: "procente-si-calcul", duration: "25 min", type: "Exerciții" },
      { id: "mate_rap_04", title: "Probabilități și Statistică", slug: "probabilitati-si-statistica", duration: "15 min", type: "Teorie" },
    ],
  },
  {
    id: "calcul-algebric",
    title: "Calcul Algebric și Funcții",
    description: "Operații cu numere reale, formule, descompuneri, ecuații și funcții.",
    icon: <Calculator className="h-8 w-8 text-primary" />,
    lessons: [
      { id: "mate_alg_01", title: "Operații cu numere reale reprezentate prin litere", slug: "operatii-algebrice", duration: "20 min", type: "Exerciții" },
      { id: "mate_alg_02", title: "Formule de Calcul Prescurtat", slug: "formule-calcul-prescurtat", duration: "20 min", type: "Formule" },
      { id: "mate_alg_03", title: "Descompunerea în factori", slug: "descompunere-in-factori", duration: "25 min", type: "Exerciții" },
      { id: "mate_alg_04", title: "Ecuații, Inecuații și Sisteme de ecuații", slug: "ecuatii-inecuatii-sisteme", duration: "30 min", type: "Teorie" },
      { id: "mate_alg_05", title: "Funcții. Reprezentare grafică", slug: "functii-si-grafice", duration: "25 min", type: "Teorie" },
    ],
  },
  {
    id: "geometrie-plana",
    title: "Geometrie Plană",
    description: "Unghiuri, triunghiuri, patrulatere și cercul. Proprietăți și arii.",
    icon: <Ruler className="h-8 w-8 text-primary" />,
    lessons: [
      { id: "mate_geo_01", title: "Unghiuri și Drepte paralele", slug: "unghiuri-si-drepte", duration: "20 min", type: "Teorie" },
      { id: "mate_geo_02", title: "Triunghiul: Proprietăți și Linii Importante", slug: "triunghiul-proprietati-linii", duration: "25 min", type: "Teorie" },
      { id: "mate_geo_03", title: "Patrulatere: Proprietăți și Arii", slug: "patrulatere-proprietati-arii", duration: "25 min", type: "Formule" },
      { id: "mate_geo_04", title: "Cercul: Elemente și Proprietăți", slug: "cercul-elemente-proprietati", duration: "20 min", type: "Teorie" },
    ],
  },
  {
    id: "relatii-metrice-trigonometrie",
    title: "Asemănare, Relații Metrice și Trigonometrie",
    description: "Teorema lui Thales, Pitagora, Catetei, Înălțimii și funcțiile trigonometrice.",
    icon: <GitCompareArrows className="h-8 w-8 text-primary" />,
    lessons: [
      { id: "mate_rel_01", title: "Segmente proporționale. Teorema lui Thales", slug: "thales-si-proportionalitate", duration: "20 min", type: "Teorie" },
      { id: "mate_rel_02", title: "Asemănarea Triunghiurilor", slug: "asemanarea-triunghiurilor", duration: "20 min", type: "Teorie" },
      { id: "mate_rel_03", title: "Relații metrice în triunghiul dreptunghic", slug: "relatii-metrice-triunghi-dreptunghic", duration: "30 min", type: "Formule" },
      { id: "mate_rel_04", title: "Noțiuni de Trigonometrie (sin, cos, tg, ctg)", slug: "trigonometrie", duration: "25 min", type: "Formule" },
      { id: "mate_rel_05", title: "Arii: Triunghiuri și Patrulatere", slug: "arii-triunghiuri-patrulatere", duration: "20 min", type: "Formule" },
    ],
  },
  {
    id: "geometrie-in-spatiu",
    title: "Geometrie în Spațiu",
    description: "Paralelism, perpendicularitate, proiecții și calculul de arii și volume.",
    icon: <Cuboid className="h-8 w-8 text-primary" />,
    lessons: [
      { id: "mate_spatiu_01", title: "Relații între puncte, drepte și plane", slug: "relatii-puncte-drepte-plane", duration: "25 min", type: "Teorie" },
      { id: "mate_spatiu_02", title: "Proiecții, Unghiuri diedre, Teorema celor 3 ⊥", slug: "proiectii-unghiuri-t3p", duration: "25 min", type: "Teorie" },
      { id: "mate_spatiu_03", title: "Corpuri Geometrice: Prisma", slug: "prisma-arii-volume", duration: "20 min", type: "Formule" },
      { id: "mate_spatiu_04", title: "Corpuri Geometrice: Piramida", slug: "piramida-arii-volume", duration: "20 min", type: "Formule" },
      { id: "mate_spatiu_05", title: "Corpuri Geometrice: Corpuri Rotunde", slug: "corpuri-rotunde", duration: "20 min", type: "Formule" },
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