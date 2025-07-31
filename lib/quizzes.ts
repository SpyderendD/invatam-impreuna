// lib/quizzes.ts

export interface QuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz {
  title: string;
  questions: QuizQuestion[];
}

interface QuizzesData {
  [key: string]: Quiz;
}

export const quizzes: QuizzesData = {
  // =======================================================
  // == TESTE CAPITOLUL I: TIPURI DE COMPUNERE
  // =======================================================
  'test-rezumat': {
    title: 'Test: Redactarea Rezumatului',
    questions: [
      { id: 'q1', questionText: 'Ce persoană gramaticală se folosește în redactarea unui rezumat?', options: ['Persoana I', 'Persoana a II-a', 'Persoana a III-a', 'Oricare dintre ele'], correctAnswerIndex: 2, explanation: 'Un rezumat trebuie să fie obiectiv, deci se folosește exclusiv persoana a III-a.' },
      { id: 'q2', questionText: 'Este permisă folosirea citatelor din textul original într-un rezumat?', options: ['Da, dacă sunt scurte', 'Nu, niciodată', 'Doar dacă se specifică autorul', 'Da, pentru a demonstra lectura'], correctAnswerIndex: 1, explanation: 'Rezumatul presupune reformularea ideilor cu propriile cuvinte, fără a prelua citate.' },
      { id: 'q3', questionText: 'Care este principalul mod de expunere folosit într-un rezumat al unui text narativ?', options: ['Descrierea', 'Dialogul', 'Monologul', 'Narațiunea'], correctAnswerIndex: 3, explanation: 'Rezumatul se concentrează pe relatarea evenimentelor, deci folosește narațiunea.' },
    ]
  },
  'test-jurnal': {
    title: 'Test: Pagina de Jurnal',
    questions: [
      { id: 'q1', questionText: 'Ce element este esențial la începutul fiecărei însemnări de jurnal?', options: ['Titlul', 'Data', 'Semnătura', 'O concluzie'], correctAnswerIndex: 1, explanation: 'Datarea este crucială pentru a menține ordinea cronologică a evenimentelor.' },
      { id: 'q2', questionText: 'La ce persoană este scris, de regulă, un jurnal?', options: ['Persoana a III-a (obiectiv)', 'Persoana I (subiectiv)', 'Persoana a II-a (adresare)', 'Se pot alterna persoanele'], correctAnswerIndex: 1, explanation: 'Jurnalul este o formă de scriere personală, intimă, deci folosește persoana I.' },
      { id: 'q3', questionText: 'Ce caracteristică definește cel mai bine stilul unui jurnal?', options: ['Obiectivitate și formalism', 'Sinceritate și subiectivitate', 'Limbaj tehnic', 'Exclusiv narativ'], correctAnswerIndex: 1, explanation: 'Scopul jurnalului este de a înregistra trăiri autentice, deci sinceritatea este esențială.' },
    ]
  },
  'test-scrisoare': {
    title: 'Test: Redactarea Scrisorii',
    questions: [
      { id: 'q1', questionText: 'Unde se plasează localitatea și data într-o scrisoare?', options: ['În stânga sus', 'În dreapta jos', 'În dreapta sus', 'La centru, sub titlu'], correctAnswerIndex: 2, explanation: 'Conform convențiilor, localitatea și data se scriu întotdeauna în colțul din dreapta sus.' },
      { id: 'q2', questionText: 'Ce urmează imediat după formula de adresare (ex: "Dragă mamă,")?', options: ['Semnătura', 'Un punct', 'Introducerea (corpul textului)', 'P.S.'], correctAnswerIndex: 2, explanation: 'După formula de adresare, urmată de virgulă, începe paragraful de introducere.' },
      { id: 'q3', questionText: 'Ce este un "P.S." (Post Scriptum)?', options: ['O formulă de încheiere', 'O informație adăugată după semnătură', 'O prescurtare pentru "Salut"', 'Un alt mod de a semna'], correctAnswerIndex: 1, explanation: 'P.S. se folosește pentru a adăuga o idee sau o informație omisă din corpul principal al scrisorii, după ce aceasta a fost deja semnată.' },
    ]
  },
  'test-email': {
    title: 'Test: Redactarea E-mailului',
    questions: [
      { id: 'q1', questionText: 'Ce componentă a unui e-mail NU este prezentă într-o scrisoare tradițională?', options: ['Formula de adresare', 'Data', 'Câmpul "Subiect"', 'Semnătura'], correctAnswerIndex: 2, explanation: 'Header-ul unui e-mail conține câmpuri specifice precum "Subiect", esențial pentru a sumariza conținutul mesajului.' },
      { id: 'q2', questionText: 'Ce înseamnă "header-ul" unui e-mail?', options: ['Conținutul principal al mesajului', 'Informațiile necesare transmiterii (De la, Către, Subiect)', 'Fișierele atașate', 'Formula de încheiere'], correctAnswerIndex: 1, explanation: 'Header-ul conține metadatele necesare serverelor de e-mail pentru a direcționa și afișa corect mesajul.' },
    ]
  },
  'test-argumentativ': {
    title: 'Test: Textul Argumentativ',
    questions: [
      { id: 'q1', questionText: 'Care este scopul principal al unui text argumentativ?', options: ['Să povestească o întâmplare', 'Să descrie un peisaj', 'Să convingă cititorul de o opinie', 'Să transmită emoții'], correctAnswerIndex: 2, explanation: 'Argumentarea are rol persuasiv, adică încearcă să convingă publicul de validitatea unui punct de vedere.' },
      { id: 'q2', questionText: 'Ce parte a textului argumentativ formulează opinia/teza?', options: ['Concluzia', 'Dezvoltarea argumentelor', 'Anexa', 'Ipoteza'], correctAnswerIndex: 3, explanation: 'Ipoteza este punctul de plecare, unde se enunță clar opinia ce va fi susținută.' },
      { id: 'q3', questionText: 'Cuvinte precum "în primul rând", "deoarece", "de exemplu" sunt specifice:', options: ['Descrierii', 'Narațiunii', 'Argumentării', 'Dialogului'], correctAnswerIndex: 2, explanation: 'Acești conectori logici sunt esențiali pentru a structura argumentele și a le lega de exemple concrete.' },
    ]
  },
  'test-narativ': {
    title: 'Test: Textul Narativ',
    questions: [
      { id: 'q1', questionText: 'Ce prezintă un text narativ?', options: ['O succesiune de evenimente', 'Trăsăturile unui obiect', 'O opinie personală', 'Un schimb de replici'], correctAnswerIndex: 0, explanation: 'Esența narațiunii este relatarea unor întâmplări într-o ordine cronologică.' },
      { id: 'q2', questionText: 'Care sunt elementele esențiale ale cadrului într-un text narativ?', options: ['Figurile de stil', 'Rima și ritmul', 'Reperele spațio-temporale', 'Argumentele'], correctAnswerIndex: 2, explanation: 'Orice acțiune narativă este plasată într-un anumit loc (spațiu) și se desfășoară într-un anumit moment (timp).' },
    ]
  },
  'test-dialogat': {
    title: 'Test: Textul Dialogat',
    questions: [
      { id: 'q1', questionText: 'Ce marchează începutul fiecărei replici într-un text dialogat?', options: ['Ghilimelele', 'O steluță (*)', 'Linia de dialog (—)', 'Două puncte (:)'], correctAnswerIndex: 2, explanation: 'Conform normelor ortografice românești, linia de dialog este semnul grafic care introduce replica unui personaj.' },
      { id: 'q2', questionText: 'Verbele "a spune", "a răspunde", "a întreba" se numesc verbe:', options: ['Declarative (dicendi)', 'Copulative', 'Auxiliare', 'Impersonale'], correctAnswerIndex: 0, explanation: 'Aceste verbe, numite și "verbe dicendi", sunt specifice dialogului și ajută la atribuirea replicilor către personaje.' },
    ]
  },
  'test-descriptiv': {
    title: 'Test: Textul Descriptiv',
    questions: [
      { id: 'q1', questionText: 'Care este scopul principal al unui text descriptiv?', options: ['Să convingă', 'Să povestească', 'Să prezinte trăsături detaliate', 'Să exprime o poruncă'], correctAnswerIndex: 2, explanation: 'Descrierea se concentrează pe crearea unei imagini mentale a unui obiect, peisaj sau ființă prin prezentarea caracteristicilor acestora.' },
      { id: 'q2', questionText: 'Ce grup de cuvinte este cel mai frecvent folosit într-o descriere?', options: ['Verb + Adverb', 'Substantiv + Adjectiv', 'Pronume + Numeral', 'Conjuncție + Interjecție'], correctAnswerIndex: 1, explanation: 'Grupul nominal format dintr-un substantiv (obiectul descris) și un adjectiv (însușirea sa) este fundamental în textul descriptiv.' },
      { id: 'q3', questionText: 'O descriere a unei persoane se numește:', options: ['Tablou', 'Peisaj', 'Portret', 'Rezumat'], correctAnswerIndex: 2, explanation: 'Descrierea literară a unei ființe, cu trăsături fizice și morale, se numește portret.' },
    ]
  },

  // Aici poți adăuga testele pentru celelalte capitole
};