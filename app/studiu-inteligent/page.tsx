'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

// --- Componente UI/Custom ---
import { Button } from '@/components/ui/button';
import CustomCursor from '@/components/animations/CustomCursor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// --- Iconițe ---
import { 
    Bot, 
    Sparkles, 
    Rocket, 
    ArrowRight,
    Download,
    UploadCloud,
    HelpCircle,
    FileText,
    FlaskConical,
    Swords,
    ChevronRight,
    Settings,
    CheckCircle,
    BookMarked,
    Presentation // <-- Am adăugat iconița nouă
} from 'lucide-react'; 

// --- Varianțe de animație reutilizabile ---
const sectionFadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "circOut" }
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

// =======================================================================
// Date Centralizate pentru Toate Instrumentele AI
// =======================================================================
const aiToolsData = [
  {
    id: "notebooklm",
    name: "Google NotebookLM",
    tagline: "Tutorul tău personal, bazat pe documente.",
    description: "Încarci o lecție de pe platforma noastră, iar NotebookLM devine un expert exclusiv în acel material. Pune-i întrebări, cere-i rezumate sau explicații și va răspunde folosind doar informațiile din documentul tău.",
    href: "https://notebooklm.google.com/",
    icon: <FileText className="h-6 w-6" />,
    steps: [
      { title: "Descarcă Lecția", description: "Alege orice material în format PDF de pe platforma noastră.", icon: <Download className="h-5 w-5"/> },
      { title: "Încarcă în NotebookLM", description: "Creează un 'notebook' nou și adaugă fișierul PDF.", icon: <UploadCloud className="h-5 w-5"/> },
      { title: "Pune Întrebări", description: "Dialoghează cu AI-ul despre conținutul lecției.", icon: <HelpCircle className="h-5 w-5"/> },
    ],
    prompts: [
      "Fă-mi un rezumat al acestui document în 5 puncte cheie.",
      "Explică-mi conceptul de 'fotosinteză' ca și cum aș avea 10 ani.",
      "Generează 5 întrebări de tip grilă din acest capitol.",
      "Care sunt cele mai importante formule/date din acest material?",
    ]
  },
  {
    id: "aistudio",
    name: "Google AI Studio",
    tagline: "Terenul de joacă pentru a experimenta cu AI.",
    description: "AI Studio este un instrument mai avansat unde poți interacționa direct cu modelele AI de la Google, precum Gemini. Poți să-i ajustezi 'creativitatea', să-i dai instrucțiuni complexe și să vezi cum reacționează.",
    href: "https://aistudio.google.com/",
    icon: <FlaskConical className="h-6 w-6" />,
    steps: [
      { title: "Accesează Platforma", description: "Intră pe AI Studio și alege un 'prompt' nou.", icon: <Rocket className="h-5 w-5"/> },
      { title: "Scrie o Instrucțiune", description: "Cere-i să scrie un eseu, un cod, sau să rezolve o problemă.", icon: <Sparkles className="h-5 w-5"/> },
      { title: "Ajustează Parametrii", description: "Modifică setări precum 'temperatura' pentru rezultate diferite.", icon: <Settings className="h-5 w-5"/> },
    ],
    prompts: [
      "Scrie un script Python care sortează o listă de numere.",
      "Creează un dialog între Platon și un programator modern despre AI.",
      "Transformă acest text tehnic într-o explicație pentru un public larg.",
      "Generează 10 idei de proiecte pentru ora de informatică.",
    ]
  },
  {
    id: "chatbotarena",
    name: "LMSys Chatbot Arena",
    tagline: "Compară cei mai puternici AIs, față în față.",
    description: "Aici, poți discuta simultan cu doi AIs anonimi. Le pui aceeași întrebare și votezi răspunsul care ți se pare mai bun. Este cea mai bună metodă de a vedea diferențele de performanță între diverse modele.",
    href: "https://chat.lmsys.org/",
    icon: <Swords className="h-6 w-6" />,
    steps: [
      { title: "Intră în Arenă", description: "Alege modul 'Arena (Side-by-side)' pentru a începe.", icon: <Swords className="h-5 w-5"/> },
      { title: "Pune o Întrebare", description: "Adresează aceeași provocare ambilor AIs (Model A și Model B).", icon: <HelpCircle className="h-5 w-5"/> },
      { title: "Votează Câștigătorul", description: "Alege răspunsul superior și contribuie la clasamentul global.", icon: <CheckCircle className="h-5 w-5"/> },
    ],
    prompts: [
      "Rezolvă această problemă de logică: [problemă].",
      "Scrie o poezie în stilul lui Mihai Eminescu despre internet.",
      "Care sunt avantajele și dezavantajele energiei nucleare?",
      "Planifică o excursie de 3 zile la Brașov cu un buget de 500 RON.",
    ]
  },
  // =======================================================================
  // --- INSERȚIE NOUĂ --- Instrumentul adăugat pe baza link-ului
  // =======================================================================
  {
    id: "aidocmaker",
    name: "AI Doc Maker",
    tagline: "Generatorul tău de prezentări și documente.",
    description: "Transformă o simplă idee într-o prezentare PowerPoint (PPT) sau un document Word (DOC) complet, în doar câteva secunde. Scrie despre ce vrei să fie materialul, iar AI-ul va genera structura, textul și chiar imaginile potrivite.",
    href: "https://www.aidocmaker.com/ai-powerpoint-generator",
    icon: <Presentation className="h-6 w-6" />,
    steps: [
      { title: "Descrie Subiectul", description: "Scrie o instrucțiune clară despre tema dorită.", icon: <Sparkles className="h-5 w-5"/> },
      { title: "Alege Formatul", description: "Selectează dacă vrei o prezentare (PPT) sau un document (DOC).", icon: <FileText className="h-5 w-5"/> },
      { title: "Descarcă Rezultatul", description: "Downloadează fișierul generat și personalizează-l.", icon: <Download className="h-5 w-5"/> },
    ],
    prompts: [
      "O prezentare despre Revoluția Franceză în 10 slide-uri.",
      "Creează un document Word care explică ciclul apei în natură.",
      "Generează o prezentare despre importanța reciclării pentru ora de ecologie.",
      "Fă un scurt rezumat al romanului 'Ion' de Liviu Rebreanu într-un format de document.",
    ]
  }
];

// =======================================================================
// Componenta principală a paginii "Studiu Inteligent"
// =======================================================================
export default function StudiuInteligentPage() {
  return (
    <>
      <CustomCursor />
      {/* Secțiunea Hero */}
      <section className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-24 bg-background">
        <div className="container relative z-10">
          <div className="text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-3xl mx-auto"
            >
              <motion.h1
                className="font-lora text-5xl md:text-7xl font-medium tracking-tight text-foreground leading-tight"
                variants={sectionFadeIn}
              >
                Explorează Universul Inteligenței Artificiale
              </motion.h1>
              
              <motion.p variants={sectionFadeIn} className="mt-6 text-lg text-muted-foreground">
                Am selectat cele mai bune instrumente AI gratuite pentru a-ți accelera învățarea, a-ți testa creativitatea și a înțelege viitorul tehnologiei.
              </motion.p>
              
              <motion.div variants={sectionFadeIn} className="mt-10">
                <Button asChild size="lg" variant="outline">
                  <Link href="#instrumente">Vezi Instrumentele</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Secțiunea cu Tab-uri pentru Instrumente AI */}
      <section id="instrumente" className="py-24 bg-background border-y border-border">
        <div className="container">
          <motion.div className="text-center mb-16 max-w-3xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={sectionFadeIn}>
            <h2 className="text-4xl font-extrabold tracking-tighter sm:text-5xl text-foreground">Alege-ți Instrumentul Potrivit</h2>
            <p className="mt-4 text-lg text-muted-foreground">Fiecare unealtă are un scop diferit. Descoperă care ți se potrivește cel mai bine.</p>
          </motion.div>

          <Tabs defaultValue="notebooklm" className="w-full max-w-5xl mx-auto">
             {/* --- MODIFICARE --- Am ajustat grila pentru 4 elemente */}
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto sm:h-20 p-2">
              {aiToolsData.map(tool => (
                <TabsTrigger key={tool.id} value={tool.id} className="text-base sm:text-sm h-full py-3 sm:py-0 flex flex-col sm:flex-row gap-2 items-center justify-center">
                  {tool.icon} {tool.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {aiToolsData.map(tool => (
              <TabsContent key={tool.id} value={tool.id} className="mt-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-lg shadow-foreground/5"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Partea stângă: Descriere și Buton */}
                    <div className="flex flex-col justify-center">
                      <h3 className="text-2xl font-bold text-foreground mb-2">{tool.tagline}</h3>
                      <p className="text-muted-foreground mb-6">{tool.description}</p>
                      <Button asChild className="w-fit">
                        <a href={tool.href} target="_blank" rel="noopener noreferrer">
                          Accesează {tool.name} <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </div>

                    {/* Partea dreaptă: Ghid și Idei */}
                    <div>
                      <h4 className="font-semibold text-foreground mb-4">Cum să începi:</h4>
                      <div className="flex flex-col gap-3 mb-6">
                        {tool.steps.map((step, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                            <div className="text-primary">{step.icon}</div>
                            <div>
                              <p className="font-medium text-foreground text-sm">{step.title}</p>
                              <p className="text-muted-foreground text-xs">{step.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <h4 className="font-semibold text-foreground mb-3">Idei de încercat:</h4>
                      <div className="flex flex-col gap-2">
                         {tool.prompts.map((prompt, index) => (
                           <div key={index} className="flex items-center gap-3 text-sm">
                             <ChevronRight className="h-4 w-4 text-primary flex-shrink-0" />
                             <p className="text-muted-foreground">{prompt}</p>
                           </div>
                         ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Secțiunea CTA */}
      <section className="py-20 bg-background">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={sectionFadeIn}>
            <div className="rounded-2xl bg-primary p-10 md:p-16 text-center text-primary-foreground relative overflow-hidden">
              <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-white/10 rounded-full opacity-50"></div>
              <div className="absolute -top-16 -left-16 w-40 h-40 bg-white/10 rounded-full opacity-50"></div>
              <h2 className="text-3xl sm:text-4xl font-bold">Gata de acțiune?</h2>
              <p className="mx-auto mt-4 max-w-xl opacity-80">Cel mai bun mod de a învăța este prin practică. Alege o materie, descarcă o lecție și începe să experimentezi cu NotebookLM.</p>
              <div className="mt-8">
                <Button asChild size="lg" variant="secondary" className="shadow-lg transform hover:scale-105">
                  <Link href="/#materii"><BookMarked className="mr-2 h-5 w-5" /> Vezi Materiile</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}