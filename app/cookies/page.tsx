'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Cookie, Mail, Globe, Info, Lock, Settings, CheckCircle2 } from 'lucide-react';

export default function CookiePolicyPage() {
  // SETARE IMPLICITĂ: ROMÂNĂ
  const [language, setLanguage] = useState<'ro' | 'en'>('ro');

  const toggleLanguage = (lang: 'ro' | 'en') => setLanguage(lang);

  return (
    <main className="min-h-screen bg-background py-16 px-4 md:px-8 lg:py-24" lang={language}>
      <div className="max-w-4xl mx-auto">
        
        {/* Header & Navigație */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div className="space-y-4">
            <Button asChild variant="ghost" className="pl-0 hover:bg-transparent hover:text-primary transition-colors">
              <Link href="/" className="flex items-center gap-2 font-medium">
                <ArrowLeft className="w-4 h-4" /> 
                {language === 'ro' ? 'Înapoi la Pagina Principală' : 'Back to Home'}
              </Link>
            </Button>
            
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary shadow-sm">
                <Cookie className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-3xl md:text-5xl font-extrabold text-foreground font-lora tracking-tight">
                  {language === 'ro' ? 'POLITICA DE COOKIES' : 'COOKIE POLICY'}
                </h1>
                <p className="text-muted-foreground mt-1 font-medium">
                  {language === 'ro' ? 'Ultima actualizare: 18 Decembrie 2025' : 'Last updated December 18, 2025'}
                </p>
              </div>
            </div>
          </div>

          {/* Selector Limbă */}
          <div className="flex items-center bg-muted/50 backdrop-blur-sm p-1.5 rounded-xl border border-border self-start md:self-center shadow-inner">
            <button
              onClick={() => toggleLanguage('ro')}
              aria-pressed={language === 'ro'}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                language === 'ro' 
                  ? 'bg-background text-primary shadow-md scale-105' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              ROMÂNĂ
            </button>
            <button
              onClick={() => toggleLanguage('en')}
              aria-pressed={language === 'en'}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                language === 'en' 
                  ? 'bg-background text-primary shadow-md scale-105' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              ENGLISH
            </button>
          </div>
        </div>

        {/* Conținut Politică */}
        <AnimatePresence mode='wait'>
          <motion.div 
            key={language}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="prose prose-slate dark:prose-invert max-w-none 
              prose-headings:text-foreground prose-headings:font-bold prose-headings:font-lora
              prose-p:text-muted-foreground prose-p:leading-relaxed
              prose-li:text-muted-foreground prose-strong:text-foreground 
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              bg-card/50 backdrop-blur-sm p-8 md:p-16 rounded-[2rem] border border-border shadow-xl mb-12"
          >
            
            {language === 'ro' ? (
              /* ================= CONȚINUT COMPLET ÎN ROMÂNĂ ================= */
              <div className="space-y-10">
                <section>
                  <p className="text-lg">
                    Această Politică de Cookie-uri explică modul în care <strong>Învățăm Împreună</strong> (&quot;<strong>Platforma</strong>,&quot; &quot;<strong>Proiectul</strong>,&quot; &quot;<strong>noi</strong>,&quot; &quot;<strong>ne</strong>&quot;) utilizează cookie-uri și tehnologii similare pentru a vă recunoaște atunci când vizitați site-ul nostru la <a href="https://invatam-impreuna.vercel.app">https://invatam-impreuna.vercel.app</a> (&quot;<strong>Website-ul</strong>&quot;).
                  </p>
                  <div className="bg-primary/5 p-6 rounded-2xl border-l-4 border-primary mt-6 italic">
                    Utilizăm aceste tehnologii pentru a asigura funcționarea corectă a platformei, pentru a analiza traficul și pentru a vă oferi o experiență personalizată de învățare.
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl border-b pb-2 flex items-center gap-2">
                    <Info className="w-6 h-6 text-primary" /> CE SUNT COOKIE-URILE?
                  </h2>
                  <p>Cookie-urile sunt fișiere text mici plasate pe dispozitivul dvs. la vizitarea unui site. Ele sunt esențiale pentru ca site-ul să &quot;țină minte&quot; acțiunile dvs. (cum ar fi logarea sau preferințele de temă).</p>
                  <ul className="list-disc pl-6 space-y-3">
                    <li><strong>Cookie-uri First-party:</strong> Setate direct de noi (Învățăm Împreună).</li>
                    <li><strong>Cookie-uri Third-party:</strong> Setate de parteneri externi (ex. Google pentru analize sau publicitate).</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl border-b pb-2 flex items-center gap-2">
                    <Settings className="w-6 h-6 text-primary" /> DE CE LE FOLOSIM?
                  </h2>
                  <p>Folosim cookie-uri din următoarele motive:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="p-4 rounded-xl bg-muted/50 border border-border">
                      <h4 className="font-bold flex items-center gap-2 text-foreground">
                        <Lock className="w-4 h-4" /> Tehnice (Esențiale)
                      </h4>
                      <p className="text-sm mt-2">Sunt necesare pentru funcționarea site-ului, logare și securitate.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50 border border-border">
                      <h4 className="font-bold flex items-center gap-2 text-foreground">
                        <CheckCircle2 className="w-4 h-4" /> Preferințe
                      </h4>
                      <p className="text-sm mt-2">Ne permit să salvăm setările dvs., cum ar fi modul Dark/Light.</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-bold mb-4">Cookie-uri de performanță și personalizare:</h3>
                  <div className="overflow-x-auto border border-border rounded-2xl mb-8 not-prose shadow-sm">
                    <table className="min-w-full text-sm text-left">
                      <thead className="bg-muted/50 border-b border-border">
                        <tr>
                          <th className="p-4 font-bold text-foreground">Element</th>
                          <th className="p-4 font-bold text-foreground">Detalii</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        <tr>
                          <td className="p-4 font-semibold bg-muted/20">Nume:</td>
                          <td className="p-4 font-mono text-primary font-bold">_ga</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-semibold bg-muted/20">Scop:</td>
                          <td className="p-4">Utilizat de Google Analytics pentru a genera date statistice despre modul în care elevii folosesc platforma.</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-semibold bg-muted/20">Furnizor:</td>
                          <td className="p-4">.invatam-impreuna.vercel.app</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-semibold bg-muted/20">Nume:</td>
                          <td className="p-4 font-mono text-primary font-bold">themePreference</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-semibold bg-muted/20">Scop:</td>
                          <td className="p-4">Stochează alegerea dvs. între modul Întunecat sau Luminos.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl border-b pb-2">CUM POT CONTROLA COOKIE-URILE?</h2>
                  <p>Aveți dreptul de a accepta sau refuza cookie-urile. Cele esențiale (pentru logare) nu pot fi refuzate deoarece platforma nu ar putea funcționa fără ele. Puteți însă modifica setările din browserul dvs.:</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="px-3 py-1 bg-muted border rounded-full text-xs font-bold">Chrome</span>
                    <span className="px-3 py-1 bg-muted border rounded-full text-xs font-bold">Firefox</span>
                    <span className="px-3 py-1 bg-muted border rounded-full text-xs font-bold">Safari</span>
                    <span className="px-3 py-1 bg-muted border rounded-full text-xs font-bold">Edge</span>
                    <span className="px-3 py-1 bg-muted border rounded-full text-xs font-bold">Opera</span>
                    <span className="px-3 py-1 bg-muted border rounded-full text-xs font-bold">Brave</span>
                    <span className="px-3 py-1 bg-muted border rounded-full text-xs font-bold">Internet Samsung</span>
                    <span className="px-3 py-1 bg-muted border rounded-full text-xs font-bold">etc.</span>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl border-b pb-2">CONTACT</h2>
                  <p>Pentru întrebări suplimentare despre modul în care protejăm datele dvs., ne puteți contacta la:</p>
                  <a href="mailto:spyderend0@gmail.com" className="flex items-center gap-2 text-primary font-bold mt-2">
                    <Mail className="w-5 h-5" /> spyderend0@gmail.com
                  </a>
                </section>
              </div>
            ) : (
              /* ================= CONȚINUT COMPLET ÎN ENGLEZĂ ================= */
              <div className="space-y-10">
                <section>
                  <p className="text-lg">
                    This Cookie Policy explains how <strong>Învățăm Împreună</strong> (&quot;<strong>The Platform</strong>,&quot; &quot;<strong>The Project</strong>,&quot; &quot;<strong>we</strong>,&quot; &quot;<strong>us</strong>&quot;) uses cookies and similar technologies when you visit our website at <a href="https://invatam-impreuna.vercel.app">https://invatam-impreuna.vercel.app</a>.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl border-b pb-2 flex items-center gap-2">
                    <Info className="w-6 h-6 text-primary" /> WHAT ARE COOKIES?
                  </h2>
                  <p>Cookies are small data files placed on your device. They are essential for recognizing you and remembering your settings (like login status or UI theme).</p>
                </section>

                <section>
                  <h2 className="text-2xl border-b pb-2 flex items-center gap-2">
                    <Settings className="w-6 h-6 text-primary" /> WHY DO WE USE THEM?
                  </h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Essential:</strong> Required for technical reasons (security, authentication).</li>
                    <li><strong>Analytics:</strong> Helping us understand how students use the platform.</li>
                    <li><strong>Functionality:</strong> Storing preferences like Dark/Light mode.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-bold mb-4">Specific Cookies We Use:</h3>
                  <div className="overflow-x-auto border border-border rounded-2xl mb-8 not-prose">
                    <table className="min-w-full text-sm text-left">
                      <thead className="bg-muted/50 border-b border-border">
                        <tr>
                          <th className="p-4 font-bold text-foreground">Attribute</th>
                          <th className="p-4 font-bold text-foreground">Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        <tr>
                          <td className="p-4 font-semibold bg-muted/20">Name:</td>
                          <td className="p-4 font-mono text-primary font-bold">_ga</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-semibold bg-muted/20">Purpose:</td>
                          <td className="p-4">Records a particular ID used for website usage analytics via Google Analytics.</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-semibold bg-muted/20">Name:</td>
                          <td className="p-4 font-mono text-primary font-bold">themePreference</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-semibold bg-muted/20">Purpose:</td>
                          <td className="p-4">Stores your dark/light mode preference.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl border-b pb-2">HOW CAN I CONTROL COOKIES?</h2>
                  <p>You have the right to accept or refuse cookies. Essential cookies (for logging in) cannot be refused because the platform would not be able to function without them. However, you can change the settings in your browser:</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="px-3 py-1 bg-muted border rounded-full text-xs font-bold">Chrome</span>
                    <span className="px-3 py-1 bg-muted border rounded-full text-xs font-bold">Firefox</span>
                    <span className="px-3 py-1 bg-muted border rounded-full text-xs font-bold">Safari</span>
                    <span className="px-3 py-1 bg-muted border rounded-full text-xs font-bold">Edge</span>
                    <span className="px-3 py-1 bg-muted border rounded-full text-xs font-bold">Opera</span>
                    <span className="px-3 py-1 bg-muted border rounded-full text-xs font-bold">Brave</span>
                    <span className="px-3 py-1 bg-muted border rounded-full text-xs font-bold">Internet Samsung</span>
                    <span className="px-3 py-1 bg-muted border rounded-full text-xs font-bold">etc.</span>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl border-b pb-2">CONTACT</h2>
                  <p>For any questions regarding our use of cookies, please email us at:</p>
                  <a href="mailto:spyderend0@gmail.com" className="flex items-center gap-2 text-primary font-bold">
                    <Mail className="w-5 h-5" /> spyderend0@gmail.com
                  </a>
                </section>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}