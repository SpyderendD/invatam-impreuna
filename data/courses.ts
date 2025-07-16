// data/courses.ts
// ===================================================================================
// ACESTA ESTE SINGURUL FIȘIER PE CARE TREBUIE SĂ-L MODIFICI PENTRU A ADĂUGA CONȚINUT
// ===================================================================================

import React from 'react';
import { BookOpen, Sigma, FlaskConical, Dna } from 'lucide-react'; // Importăm iconițele pe care le vom folosi

// -----------------------------------------------------------------------------------
// PASUL 1: DEFINIM STRUCTURA DATELOR (TIPURILE)
// Acest lucru ne oferă siguranță și autocompletare în cod. Nu trebuie să modifici aici.
// -----------------------------------------------------------------------------------

export interface Lesson {
  id: string;      // ID unic global pentru fiecare lecție. Convenție: 'materie_capitol_lectie'
  title: string;   // Titlul lecției, ex: "Substantivul"
  slug: string;    // Partea din URL, ex: "substantivul"
}

export interface Chapter {
  id:string;       // ID unic pentru capitol, ex: 'gramatica'
  title: string;   // Titlul capitolului, ex: "Gramatică"
  lessons: Lesson[]; // O listă cu toate lecțiile din acest capitol
}

export interface Subject {
  id: string;      // ID-ul materiei, folosit în URL, ex: 'romana'
  title: string;   // Numele complet al materiei, ex: "Limba Română"
  description: string; // O descriere scurtă pentru cardurile de pe pagina principală
  longDescription: string; // O descriere mai lungă pentru pagina materiei
  icon: React.ReactNode; // Componenta React pentru iconiță
  gradientClass: string; // O clasă CSS pentru culorile specifice materiei
  chapters: Chapter[]; // O listă cu toate capitolele din această materie
}


// -----------------------------------------------------------------------------------
// PASUL 2: ADAUGĂ AICI TOT CONȚINUTUL PENTRU MATERIILE TALE
// Acesta este "panoul de control". Modifică, adaugă sau șterge obiecte din această listă.
// -----------------------------------------------------------------------------------

export const allSubjects: Subject[] = [
  
  // ===================================
  // MATERIA 1: Limba Română
  // ===================================
  {
    id: 'romana',
    title: 'Limba Română',
    description: 'Gramatică, literatură și comunicare.',
    longDescription: 'Stăpânește limba română pentru Evaluarea Națională, de la analiza gramaticală la comentarii literare.',
    icon: React.createElement(BookOpen, { className: "h-8 w-8" }),
    gradientClass: 'gradient-romana', // Asigură-te că ai definit 'gradient-romana' în CSS
    
    // --- CAPITOLELE PENTRU Limba Română ---
    chapters: [
      {
        id: 'gramatica',
        title: 'Gramatică',
        // --- LECȚIILE din capitolul Gramatică ---
        lessons: [
          { id: 'romana_gramatica_substantivul', title: 'Substantivul', slug: 'substantivul' },
          { id: 'romana_gramatica_adjectivul', title: 'Adjectivul', slug: 'adjectivul' },
          { id: 'romana_gramatica_verbul', title: 'Verbul', slug: 'verbul' },
          // Adaugă mai multe lecții aici, respectând formatul...
        ],
      },
      {
        id: 'literatura',
        title: 'Literatură',
        // --- LECȚIILE din capitolul Literatură ---
        lessons: [
          { id: 'romana_literatura_eminescu', title: 'Mihai Eminescu - Luceafărul', slug: 'eminescu-luceafarul' },
          { id: 'romana_literatura_creanga', title: 'Ion Creangă - Amintiri din copilărie', slug: 'creanga-amintiri' },
          // Adaugă mai multe lecții aici...
        ],
      },
      // Poți adăuga un capitol nou aici, de ex. 'Comunicare'...
    ],
  },

  // ===================================
  // MATERIA 2: Matematică
  // ===================================
  {
    id: 'matematica',
    title: 'Matematică',
    description: 'Algebră, geometrie și analiză matematică.',
    longDescription: 'Dezvoltă-ți gândirea logică și rezolvă orice problemă de algebră sau geometrie cu încredere.',
    icon: React.createElement(Sigma, { className: "h-8 w-8" }),
    gradientClass: 'gradient-matematica',
    
    // --- CAPITOLELE PENTRU Matematică ---
    chapters: [
      {
        id: 'algebra',
        title: 'Algebră',
        // --- LECȚIILE din capitolul Algebră ---
        lessons: [
          { id: 'matematica_algebra_ecuatii', title: 'Ecuații de gradul I', slug: 'ecuatii-gradul-1' },
          { id: 'matematica_algebra_functii', title: 'Funcții și grafice', slug: 'functii-si-grafice' },
          { id: 'matematica_algebra_procente', title: 'Procente și proporții', slug: 'procente-si-proportii' },
        ],
      },
      {
        id: 'geometrie',
        title: 'Geometrie',
        // --- LECȚIILE din capitolul Geometrie ---
        lessons: [
          { id: 'matematica_geometrie_pitagora', title: 'Teorema lui Pitagora', slug: 'teorema-lui-pitagora' },
          { id: 'matematica_geometrie_cercul', title: 'Cercul și proprietățile sale', slug: 'cercul' },
        ],
      },
    ],
  },

  /*
  // =========================================================================
  // EXEMPLU: CUM SĂ ADĂUGI O MATERIE NOUĂ (ex: Chimie)
  // Pur și simplu copiezi un bloc de materie de mai sus, îl lipești aici și modifici datele.
  // =========================================================================
  {
    id: 'chimie',
    title: 'Chimie',
    description: 'Elemente, compuși și reacții chimice.',
    longDescription: 'Explorează lumea fascinantă a atomilor și moleculelor.',
    icon: <FlaskConical className="h-8 w-8" />,
    gradientClass: 'gradient-chimie',
    
    chapters: [
      {
        id: 'chimie_organica',
        title: 'Chimie Organică',
        lessons: [
          { id: 'chimie_organica_alcani', title: 'Alcanii', slug: 'alcanii' },
          { id: 'chimie_organica_alchene', title: 'Alchenele', slug: 'alchene' },
        ],
      },
    ],
  },
  */
];