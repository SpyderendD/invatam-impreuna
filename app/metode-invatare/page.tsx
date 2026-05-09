'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  BrainCircuit, 
  Timer, 
  Repeat, 
  MessageCircle, 
  Zap, 
  Moon, 
  Droplets,
  ArrowRight,
  CheckCircle2,
  Wind,       // Pentru respiratie
  Eye,        // Pentru focus vizual
  PauseCircle // Pentru pauza mentala
} from 'lucide-react';

// --- Varianțe de animație ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

// ==========================================
// DATE: Ritual de Pregătire (NOU)
// ==========================================
const prepSteps = [
  {
    step: "01",
    title: "Oxigenare",
    instruction: "Ia 31 de respirații adânci pe nas.",
    detail: "La ultima respirație, ține aerul în piept timp de 15 secunde. Asta îți trezește creierul instant.",
    icon: <Wind className="w-6 h-6 text-cyan-400" />
  },
  {
    step: "02",
    title: "Focus Vizual",
    instruction: "Alege un obiect și privește-l fix.",
    detail: "Stai focusat pe el timp de 30 de secunde fără să-ți muți privirea. Îți antrenezi atenția.",
    icon: <Eye className="w-6 h-6 text-purple-400" />
  },
  {
    step: "03",
    title: "Calibrare Mentală",
    instruction: "Ciclul 15/15 de liniște.",
    detail: "La fiecare 15 minute de activitate mentală, ia o pauză de 15 secunde în care nu gândești și nu faci absolut nimic.",
    icon: <PauseCircle className="w-6 h-6 text-emerald-400" />
  }
];

// ==========================================
// DATE: Metode de Învățare
// ==========================================
const methods = [
  {
    title: "Tehnica Pomodoro",
    subtitle: "Pentru Focus Suprem",
    description: "Nu poți fi atent 5 ore continuu. Creierul are nevoie de pauze pentru a 'salva' informația.",
    steps: ["25 minute învățat intens (fără telefon!)", "5 minute pauză totală", "Repetă de 4 ori", "Pauză lungă (15-30 min)"],
    icon: <Timer className="w-8 h-8 text-white" />,
    gradient: "from-rose-500 to-orange-500",
    badge: "Anti-Procrastinare"
  },
  {
    title: "Active Recall",
    subtitle: "Secretul Notelor de 10",
    description: "Cititul pasiv e ineficient. Trebuie să te testezi singur ca să muți informația în memoria de lungă durată.",
    // Textul actualizat de tine
    steps: [
      "Citește un paragraf apoi închide cartea",
      "Spune cu voce tare ce ai reținut",
      "Verifică și corectează unde ai greșit",
      "Exersează foarte bine întrebări făcute de tine sau de AI",
      "Dacă vrei să se fixeze foarte bine, scrie scheme simple din ce ai reținut!"
    ],
    icon: <BrainCircuit className="w-8 h-8 text-white" />,
    gradient: "from-blue-500 to-cyan-500",
    badge: "Cea mai eficientă"
  },
  {
    title: "Metoda Feynman",
    subtitle: "Dacă nu poți explica simplu, nu știi.",
    description: "Încearcă să explici lecția ca și cum ai vorbi cu un copil de 5 ani. Așa îți dai seama unde ai lacune.",
    steps: ["Alege un concept", "Explică-l simplu (pe foaie sau voce)", "Identifică ce nu știi", "Reia materialul"],
    icon: <MessageCircle className="w-8 h-8 text-white" />,
    gradient: "from-emerald-500 to-teal-500",
    badge: "Pentru Înțelegere"
  },
  {
    title: "Spaced Repetition",
    subtitle: "Hackuiește Curba Uitării",
    description: "Nu toci totul într-o noapte. Repetă informația la intervale specifice pentru a nu o uita niciodată.",
    steps: ["Ziua 1: Înveți lecția", "Ziua 2: Repetare rapidă (10 min)", "Ziua 7: Repetare (5 min)", "Ziua 30: E deja în sânge"],
    icon: <Repeat className="w-8 h-8 text-white" />,
    gradient: "from-purple-500 to-indigo-500",
    badge: "Pentru Memorie"
  }
];

const lifestyleTips = [
  { icon: <Moon className="w-5 h-5" />, title: "Somnul e Save Button", text: "Informația se consolidează în timp ce dormi. Dormi, de preferat, 8-10 ore, dar minim 7, nu mai puțin." },
  { icon: <Droplets className="w-5 h-5" />, title: "Hidratează-te", text: "Un creier deshidratat lucrează cu 20% mai greu. Bea apă!" },
  { icon: <Zap className="w-5 h-5" />, title: "Fără Multitasking", text: "Nu poți învăța și sta pe TikTok simultan. Pune telefonul în altă cameră." },
];

export default function LearningMethodsPage() {
  return (
    <main className="min-h-screen bg-background overflow-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-10 px-6">
        {/* Background Blobs */}
        <div className="absolute inset-0 pointer-events-none">
           <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[100px] animate-blob" />
           <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-blue-400/10 rounded-full blur-[100px] animate-blob animation-delay-2000" />
        </div>

        <div className="container mx-auto relative z-10 text-center max-w-4xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold border border-primary/20 mb-6 backdrop-blur-md">
              <BrainCircuit className="w-4 h-4" /> Science-Based Learning
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="font-lora text-4xl md:text-6xl font-bold mb-6">
              Învață să Înveți: <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-purple-600 animate-gradient">
                Ghidul Super-Elevului
              </span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
              Nu e vorba de cât de mult stai cu cartea în brațe, ci de <strong>cum</strong> folosești acel timp. 
              Am adunat metodele dovedite științific care te ajută să reții mai mult, cu mai puțin efort.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* --- NOU: RITUALUL DE PREGĂTIRE --- */}
      <section className="py-12 px-6">
        <div className="container mx-auto">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mb-10 text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Ritualul de Activare</h2>
            <p className="text-muted-foreground">Fă asta înainte să deschizi caietul pentru a intra în &ldquo;Zonă&rdquo;.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {prepSteps.map((item, index) => (
               <motion.div 
                 key={index}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: index * 0.2 }}
                 className="bg-card/50 backdrop-blur-sm border border-border p-6 rounded-2xl relative overflow-hidden group hover:border-primary/50 transition-colors"
               >
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                    {item.icon}
                 </div>
                 
                 <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-primary/80 to-transparent">
                      {item.step}
                    </span>
                    <h3 className="text-lg font-bold">{item.title}</h3>
                 </div>
                 
                 <p className="text-primary font-semibold text-sm mb-2">{item.instruction}</p>
                 <p className="text-muted-foreground text-sm leading-relaxed">{item.detail}</p>
               </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- METHODS GRID --- */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
            <motion.div 
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true }}
                variants={fadeInUp}
                className="mb-12"
            >
                <h2 className="text-3xl font-bold mb-4">Metode de Învățare Propriu-zise</h2>
            </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {methods.map((method, idx) => (
              <motion.div 
                key={idx}
                variants={fadeInUp}
                className="group relative rounded-3xl overflow-hidden border border-white/10 bg-card/40 backdrop-blur-xl hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
              >
                {/* Gradient Top Bar */}
                <div className={`h-2 w-full bg-gradient-to-r ${method.gradient}`} />
                
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${method.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                      {method.icon}
                    </div>
                    <span className="px-3 py-1 rounded-full bg-muted text-xs font-bold uppercase tracking-widest text-muted-foreground border border-border">
                      {method.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold mb-2">{method.title}</h3>
                  <p className="text-primary font-medium mb-4">{method.subtitle}</p>
                  <p className="text-muted-foreground mb-8 leading-relaxed">
                    {method.description}
                  </p>

                  <div className="bg-background/50 rounded-2xl p-6 border border-border/50">
                    <h4 className="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-4">Cum aplici:</h4>
                    <ul className="space-y-3">
                      {method.steps.map((step, sIdx) => (
                        <li key={sIdx} className="flex items-start gap-3 text-sm">
                          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- LIFESTYLE TIPS --- */}
      <section className="py-24 bg-secondary/20 relative">
        <div className="container mx-auto px-6">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Combustibil pentru Creier</h2>
            <p className="text-muted-foreground">Tehnica e importantă, dar &ldquo;mașinăria&rdquo; (corpul tău) trebuie să funcționeze perfect.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {lifestyleTips.map((tip, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-card border border-border/60 p-6 rounded-2xl flex flex-col items-center text-center hover:bg-card/80 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                  {tip.icon}
                </div>
                <h4 className="text-lg font-bold mb-2">{tip.title}</h4>
                <p className="text-sm text-muted-foreground">{tip.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-24 px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto bg-gradient-to-br from-slate-900 to-slate-800 p-12 rounded-3xl text-white shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-6">Gata să pui în practică?</h2>
            <p className="text-gray-300 mb-8">
              Acum ai uneltele. Alege o materie și începe o sesiune folosind metoda <strong>Active Recall</strong>.
            </p>
            <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-gray-100 font-bold rounded-full px-8 h-12">
              <Link href="/#materii">
                Mergi la Materii <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>

    </main>
  );
}