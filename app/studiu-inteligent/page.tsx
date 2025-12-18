'use client';

import Link from 'next/link';
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import CustomCursor from '@/components/animations/CustomCursor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// --- Iconițe ---
import { 
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
    BookCopy,
    Presentation
} from 'lucide-react'; 

// Variante animații
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

// Datele pentru uneltele AI
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
                Studiu Inteligent
              </motion.h1>
              
              <motion.p variants={sectionFadeIn} className="mt-6 text-lg text-muted-foreground">
                Descoperă instrumente AI și unelte de studiu personalizate pentru a învăța mai rapid și mai eficient.
              </motion.p>
              
              <motion.div variants={sectionFadeIn} className="mt-10 flex items-center justify-center gap-4">
                <Button asChild size="lg">
                  <Link href="#instrumente-ai">Unelte AI</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="#instrumente-studiu">Flashcarduri & Timer</Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link href="/metode-invatare">Metode de învățare</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Secțiunea cu Tab-uri pentru Instrumente AI */}
      <section id="instrumente-ai" className="py-24 bg-background border-y border-border">
        <div className="container">
          <motion.div className="text-center mb-16 max-w-3xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={sectionFadeIn}>
            <h2 className="text-4xl font-extrabold tracking-tighter sm:text-5xl text-foreground">Alege-ți Asistentul AI</h2>
            <p className="mt-4 text-lg text-muted-foreground">Fiecare unealtă are un scop diferit. Descoperă care ți se potrivește cel mai bine.</p>
          </motion.div>

          <Tabs defaultValue="notebooklm" className="w-full max-w-5xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto sm:h-20 p-2">
              {aiToolsData.map(tool => (
                <TabsTrigger key={tool.id} value={tool.id} className="text-base sm:text-sm h-full py-3 sm:py-0 flex flex-col sm:flex-row gap-2 items-center justify-center">
                  {tool.icon} {tool.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* AICI ESTE PARTEA CARE LIPSEA - GENERAREA CONȚINUTULUI */}
            {aiToolsData.map(tool => (
              <TabsContent key={tool.id} value={tool.id} className="mt-8 focus-visible:outline-none">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="rounded-3xl border bg-card/80 backdrop-blur-sm p-6 md:p-10 shadow-2xl"
                >
                  {/* Header Area */}
                  <div className="flex flex-col md:flex-row gap-8 items-start justify-between mb-12 border-b border-border pb-8">
                    <div className="max-w-2xl">
                      <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">{tool.tagline}</h3>
                      <p className="text-muted-foreground text-lg leading-relaxed">{tool.description}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <Button size="lg" className="w-full md:w-auto" asChild>
                        <a href={tool.href} target="_blank" rel="noopener noreferrer">
                          Încearcă {tool.name} <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Stânga: Pașii */}
                    <div className="space-y-6">
                      <h4 className="text-xl font-semibold flex items-center gap-2">
                        <Settings className="h-5 w-5 text-primary" /> Cum funcționează?
                      </h4>
                      <div className="grid gap-6">
                        {tool.steps.map((step, idx) => (
                          <div key={idx} className="flex gap-4 p-4 rounded-xl bg-muted/50 border border-transparent hover:border-primary/20 transition-colors">
                            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background text-primary shadow-sm">
                              {step.icon}
                            </div>
                            <div>
                              <h5 className="font-semibold text-foreground">{step.title}</h5>
                              <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Dreapta: Prompt-uri */}
                    <div className="space-y-6">
                      <h4 className="text-xl font-semibold flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" /> Ce să-i ceri? (Exemple)
                      </h4>
                      <div className="grid gap-3">
                        {tool.prompts.map((prompt, idx) => (
                          <div key={idx} className="group flex items-start gap-3 rounded-lg border border-border bg-background p-4 transition-all hover:bg-primary/5 hover:border-primary/50">
                            <ChevronRight className="h-5 w-5 mt-0.5 text-muted-foreground group-hover:text-primary transition-colors" />
                            <p className="text-sm text-foreground/80 group-hover:text-foreground font-medium italic">
                              &ldquo;{prompt}&rdquo;
                            </p>
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

      {/* Secțiunea Flashcarduri */}
      <section id="instrumente-studiu" className="py-24 bg-background">
        <div className="container">
          <motion.div 
            className="text-center mb-16 max-w-3xl mx-auto" 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, amount: 0.3 }} 
            variants={sectionFadeIn}
          >
            <h2 className="text-4xl font-extrabold tracking-tighter sm:text-5xl text-foreground">Instrumente Proprii de Învățare</h2>
            <p className="mt-4 text-lg text-muted-foreground">Creează-ți propriile seturi de studiu, pornește un cronometru și memorează informațiile cheie.</p>
          </motion.div>

          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, amount: 0.5 }} 
            variants={sectionFadeIn}
          >
            <Link href="/studiu" className="block group">
              <div className="relative overflow-hidden rounded-2xl border bg-card p-8 md:p-12 transition-all duration-300 group-hover:shadow-xl group-hover:border-primary">
                {/* Efect de gradient la hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                  <div className="flex flex-col items-center md:items-start text-center md:text-left">
                     <div className="flex items-center gap-3 mb-4">
                        <div className="grid h-12 w-12 place-items-center rounded-lg bg-primary/10 text-primary">
                           <BookCopy className="h-6 w-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-foreground">Flashcarduri & Timer</h3>
                     </div>
                     <p className="text-muted-foreground">
                        Cea mai eficientă metodă de a memora. Creează pachete de carduri, adaugă un cronometru și transformă studiul într-un joc.
                     </p>
                  </div>
                  <div className="hidden md:flex justify-center items-center text-primary opacity-20 group-hover:opacity-100 transition-opacity">
                     <Sparkles className="h-24 w-24" />
                  </div>
                   <div className="flex justify-center md:justify-end">
                     <Button size="lg" className="transition-transform group-hover:scale-105">
                        Mergi la Zona de Studiu <ArrowRight className="ml-2 h-4 w-4" />
                     </Button>
                   </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Secțiunea CTA */}
      <section className="py-20 bg-background border-t border-border">
        <div className="container text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-6">Gata să înveți mai inteligent?</h2>
            <Button size="lg" asChild className="rounded-full px-8 text-lg">
                <Link href="/register">Creează Cont Gratuit</Link>
            </Button>
        </div>
      </section>
    </>
  );
}