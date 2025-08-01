// app/materii/[subjectSlug]/[lessonSlug]/page.tsx

'use client';

import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ALL_SUBJECTS, Lesson } from '@/lib/lessons';
import { useTaskTracker } from '@/hooks/useTaskTracker';
import { ChevronLeft, CheckCircle, PencilRuler, Sparkles, Lightbulb } from 'lucide-react';

// ============================================================================
// == CONȚINUTUL PENTRU LECȚIILE DE ROMÂNĂ - COMPLETAT
// ============================================================================
const ContentWrapper = ({ children }: { children: React.ReactNode }) => (
    <motion.article 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-lora prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-ul:list-disc prose-li:my-1 prose-blockquote:border-l-blue-500"
    >
        {children}
    </motion.article>
);

const ComingSoonContent = () => <ContentWrapper><p>Conținutul pentru această lecție este în curs de pregătire.</p></ContentWrapper>;

// --- CAPITOLUL 1: TIPURI DE COMPUNERE ---
const RezumatulContent = () => (
    <ContentWrapper>
        <h2>I. Redactarea Rezumatului</h2>
        <p>Rezumatul reprezintă prezentarea concisă și obiectivă a informațiilor esențiale dintr-un text, de obicei narativ.</p>
        <h3>Trăsături</h3>
        <ul>
            <li><strong>Respectarea cronologiei:</strong> Evenimentele sunt prezentate în ordinea în care apar în textul original.</li>
            <li><strong>Folosirea persoanei a III-a:</strong> Narațiunea se face la persoana a III-a, eliminând implicarea subiectivă.</li>
            <li><strong>Modul de expunere:</strong> Se folosește exclusiv narațiunea.</li>
            <li><strong>Timpuri verbale:</strong> Predomină perfectul compus și imperfectul.</li>
            <li><strong>Fără citate:</strong> Nu se preiau fragmente din text. Ideile se reformulează.</li>
            <li><strong>Concizie:</strong> Se elimină detaliile nesemnificative și dialogurile.</li>
        </ul>
        <blockquote>
            <p><strong>Exemplu:</strong> Fragment din "Cuore-inimă de copil" de Edmondo de Amicis</p>
            <p>Profesorul le-a spus elevilor săi că vor lucra împreună un an și și-ar dori ca ei să învețe și să fie buni. Le-a mărturisit că, după moartea mamei sale, a rămas singur, iar ei reprezintă acum singura sa familie.</p>
        </blockquote>
    </ContentWrapper>
);

const JurnalulContent = () => (
    <ContentWrapper>
        <h2>II. Redactarea unei pagini de jurnal</h2>
        <p>Jurnalul conține însemnări zilnice despre evenimente personale, gânduri și sentimente.</p>
        <h3>Trăsături</h3>
        <ul>
            <li><strong>Caracter personal și cronologic:</strong> Notează evenimente din viața autorului, în ordine temporală.</li>
            <li><strong>Datarea:</strong> Fiecare intrare este marcată cu data.</li>
            <li><strong>Adresare directă:</strong> Poate include formule precum "Dragă jurnalule,".</li>
            <li><strong>Subiectivitate:</strong> Scris la persoana I, exprimă sentimente și opinii sincere.</li>
        </ul>
        <blockquote>
            <p><strong>Exemplu:</strong> 8 martie 2021</p>
            <p>Dragă jurnalule,</p>
            <p>Astăzi, de 8 martie, am vrut să-i fac o bucurie mamei și am decis să-i pregătesc tortul preferat. Cu ajutorul surorii mele, am analizat rețeta și am început prepararea. Chiar dacă am făcut puțină dezordine, rezultatul final a fost delicios și, cel mai important, i-a plăcut foarte mult mamei. Mă gândesc deja la următoarea surpriză culinară.</p>
        </blockquote>
    </ContentWrapper>
);

const ScrisoareaContent = () => (
    <ContentWrapper>
        <h2>III. Redactarea unei scrisori</h2>
        <p>Scrisoarea este o formă de comunicare scrisă, trimisă unei persoane, care respectă o structură formală.</p>
        <h3>Structura</h3>
        <ol>
            <li><strong>Localitatea și data:</strong> În partea din dreapta sus.</li>
            <li><strong>Formula de adresare:</strong> "Dragă Mircea," (urmată de virgulă).</li>
            <li><strong>Introducere, Cuprins, Încheiere:</strong> Corpul textului, structurat logic.</li>
            <li><strong>Formula de încheiere:</strong> "Cu drag,"</li>
            <li><strong>Semnătura:</strong> Numele expeditorului, sub formula de încheiere.</li>
            <li><strong>Post-scriptum (P.S.):</strong> (Opțional) Se adaugă după semnătură.</li>
        </ol>
    </ContentWrapper>
);

const EmailContent = () => (
    <ContentWrapper>
        <h2>IV. Redactarea unui e-mail</h2>
        <p>E-mailul este o scrisoare în format electronic, cu o structură specifică mediului digital.</p>
        <h3>Trăsături</h3>
        <ul>
            <li><strong>Header:</strong> Conține informații esențiale: <em>De la:</em> (expeditor), <em>Către:</em> (destinatar), <em>Subiect:</em>.</li>
            <li><strong>Conținut:</strong> Mesajul propriu-zis, care de obicei păstrează o structură similară cu scrisoarea (formulă de adresare, cuprins, formulă de încheiere).</li>
            <li><strong>Claritate și Corectitudine:</strong> Exprimarea trebuie să fie clară și corectă gramatical.</li>
        </ul>
    </ContentWrapper>
);

const TextArgumentativContent = () => (
    <ContentWrapper>
        <h2>V. Redactarea unui text argumentativ</h2>
        <p>Textul argumentativ are scopul de a convinge cititorul cu privire la validitatea unei opinii, prin prezentarea de argumente logice și dovezi.</p>
        <h3>Structura</h3>
        <ol>
            <li><strong>Ipoteza:</strong> Formularea tezei/opiniei care urmează a fi susținută.</li>
            <li><strong>Demonstrația (Argumentarea):</strong> Prezentarea a cel puțin două argumente, dezvoltate și susținute de exemple. Se folosesc conectori precum "în primul rând", "în al doilea rând", "deoarece", "de exemplu".</li>
            <li><strong>Concluzia:</strong> Reluarea și întărirea ipotezei, pe baza argumentelor prezentate. Se folosesc conectori precum "în concluzie", "așadar", "prin urmare".</li>
        </ol>
    </ContentWrapper>
);

const TextNarativContent = () => (
    <ContentWrapper>
        <h2>VI. Redactarea unui text narativ</h2>
        <p>Textul narativ prezintă o succesiune de evenimente, reale sau imaginare, petrecute într-un anumit cadru spațio-temporal.</p>
        <h3>Structura</h3>
        <ul>
            <li><strong>Titlul:</strong> Sugestiv pentru conținutul textului.</li>
            <li><strong>Introducere:</strong> Prezintă contextul inițial (timp, loc, personaje).</li>
            <li><strong>Cuprins:</strong> Relatează întâmplările în ordine logică și cronologică.</li>
            <li><strong>Încheiere:</strong> Prezintă finalul evenimentelor și o concluzie.</li>
        </ul>
    </ContentWrapper>
);

const TextDialogatContent = () => (
    <ContentWrapper>
        <h2>VII. Redactarea unui text dialogat</h2>
        <p>Textul dialogat redă schimbul de replici dintre două sau mai multe personaje.</p>
        <h3>Trăsături</h3>
        <ul>
            <li><strong>Mod de expunere:</strong> Dialogul este predominant.</li>
            <li><strong>Linia de dialog:</strong> Marchează începutul fiecărei replici.</li>
            <li><strong>Mărci ale adresării directe:</strong> Folosirea de vocative, verbe la persoana a II-a, interjecții.</li>
            <li><strong>Punctuație specifică:</strong> Semnul întrebării, semnul exclamării, puncte de suspensie.</li>
        </ul>
    </ContentWrapper>
);

const TextDescriptivContent = () => (
    <ContentWrapper>
        <h2>VIII. Redactarea unui text descriptiv</h2>
        <p>Textul descriptiv prezintă în detaliu trăsăturile unui obiect, ale unei ființe sau ale unui tablou din natură.</p>
        <h3>Clasificare și Structură</h3>
        <ul>
            <li><strong>Tipuri:</strong> Poate fi de tip tablou (peisaj) or de tip portret (ființă).</li>
            <li><strong>Structura:</strong>
                <ol>
                    <li><strong>Titlu</strong></li>
                    <li><strong>Introducere:</strong> Tema generală a descrierii.</li>
                    <li><strong>Cuprins:</strong> Prezentarea detaliată a trăsăturilor, folosind grupul nominal (substantiv + adjectiv).</li>
                    <li><strong>Încheiere:</strong> Un punct de vedere personal sau o impresie generală.</li>
                </ol>
            </li>
        </ul>
    </ContentWrapper>
);


// ============================================================================
// == COMPONENTA DISPECER (LessonContent)
// ============================================================================
const LessonContent = ({ lesson }: { lesson: Lesson }) => {
    switch (lesson.slug) {
        // Capitolul I
        case 'redactarea-rezumatului': return <RezumatulContent />;
        case 'redactarea-paginii-de-jurnal': return <JurnalulContent />;
        case 'redactarea-scrisorii': return <ScrisoareaContent />;
        case 'redactarea-emailului': return <EmailContent />;
        case 'textul-argumentativ': return <TextArgumentativContent />;
        case 'textul-narativ': return <TextNarativContent />;
        case 'textul-dialogat': return <TextDialogatContent />;
        case 'textul-descriptiv': return <TextDescriptivContent />;
        
        // Alte capitole - Placeholder
        default: return <ComingSoonContent />;
    }
};

// ============================================================================
// == COMPONENTA PRINCIPALĂ A PAGINII
// ============================================================================
type LessonPageParams = {
  params: {
    subjectSlug: keyof typeof ALL_SUBJECTS;
    lessonSlug: string;
  };
};

export default function LessonPage({ params }: LessonPageParams) {
    const { completedTasks, toggleTask } = useTaskTracker();
    const subjectData = ALL_SUBJECTS[params.subjectSlug];
    const lesson = subjectData?.chapters.flatMap(c => c.lessons).find(l => l.slug === params.lessonSlug);

    if (!lesson) {
        notFound();
    }

    const isCompleted = completedTasks.has(lesson.id);

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <main className="flex-1 pt-12 md:pt-20">
                <div className="container max-w-4xl mx-auto px-4">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                        <Button asChild variant="outline" className="mb-8 group transition-all duration-300 hover:border-primary">
                            <Link href={`/materii/${params.subjectSlug}`}>
                                <ChevronLeft className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" /> Înapoi la listă
                            </Link>
                        </Button>
                        <Badge variant="secondary" className="mb-2">{lesson.type}</Badge>
                        <h1 className="font-lora text-4xl md:text-5xl font-medium text-foreground">{lesson.title}</h1>
                        <p className="mt-4 text-lg text-muted-foreground">Durata estimată: {lesson.duration}.</p>
                    </motion.div>
                    
                    <Separator className="my-12" />

                    <LessonContent lesson={lesson} />

                    <Separator className="my-12" />
                    
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="bg-accent/50 p-8 rounded-2xl text-center border"
                    >
                        <Sparkles className="h-10 w-10 text-amber-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-foreground">Ai parcurs teoria!</h2>
                        <p className="text-muted-foreground mt-2">E timpul să-ți testezi cunoștințele.</p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
                            <Button size="lg" variant={isCompleted ? "secondary" : "default"} onClick={() => toggleTask(lesson.id)}>
                                <CheckCircle className="h-5 w-5 mr-2" />
                                {isCompleted ? 'Lecție completată' : 'Marchează ca terminat'}
                            </Button>
                            {lesson.quizSlug && (
                                <Button size="lg" variant="outline" asChild className="group">
                                    <Link href={`/materii/${params.subjectSlug}/test/${lesson.quizSlug}`}>
                                        <PencilRuler className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-[-15deg]" /> Mergi la Test
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}