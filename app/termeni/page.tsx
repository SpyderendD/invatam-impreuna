'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Scale, Mail, Globe, FileText, ShieldAlert, Zap } from 'lucide-react';

export default function TermsOfUsePage() {
  // SETARE IMPLICITĂ: ROMÂNĂ
  const [language, setLanguage] = useState<'ro' | 'en'>('ro');

  const toggleLanguage = (lang: 'ro' | 'en') => setLanguage(lang);

  return (
    <main className="min-h-screen bg-background py-16 px-4 md:px-8 lg:py-24" lang={language}>
      <div className="max-w-5xl mx-auto">
        
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
                <Scale className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-3xl md:text-5xl font-extrabold text-foreground font-lora tracking-tight">
                  {language === 'ro' ? 'TERMENI ȘI CONDIȚII' : 'TERMS OF USE'}
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

        {/* Conținut Termeni */}
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
                  <h2 className="text-2xl border-b pb-2 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-primary" /> ACORD PRIVIND TERMENII LEGALI
                  </h2>
                  <p className="text-lg">
                    Noi suntem echipa de dezvoltare din spatele platformei <strong>Învățăm Împreună</strong> (&quot;<strong>Platforma</strong>,&quot; &quot;<strong>noi</strong>,&quot; &quot;<strong>ne</strong>&quot;). Acesta este un proiect educațional independent, dezvoltat de elevi pentru elevi, cu scopul de a sprijini pregătirea pentru examenele naționale în România.
                  </p>
                  <p>
                    Operăm website-ul <a href="https://invatam-impreuna.vercel.app">https://invatam-impreuna.vercel.app</a>, precum și orice alte produse sau servicii conexe (colectiv, &quot;<strong>Serviciile</strong>&quot;). Ne puteți contacta prin email la <a href="mailto:spyderend0@gmail.com">spyderend0@gmail.com</a>.
                  </p>
                  <div className="bg-destructive/5 p-6 rounded-2xl border border-destructive/20 mt-6">
                    <p className="text-foreground font-bold flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-destructive" /> ATENȚIE:
                    </p>
                    <p className="text-sm mt-1">
                      Prin accesarea Serviciilor, confirmați că ați citit, înțeles și sunteți de acord să respectați acești Termeni Legali. DACĂ NU SUNTEȚI DE ACORD CU ACEȘTI TERMENI, VĂ ESTE INTERZISĂ UTILIZAREA SERVICIILOR ȘI TREBUIE SĂ ÎNCETAȚI IMEDIAT FOLOSIREA PLATFORMEI.
                    </p>
                  </div>
                </section>

                <div className="bg-muted/30 p-8 rounded-3xl border border-border not-prose my-12 shadow-inner">
                  <h3 className="text-xl font-bold mb-6 font-lora text-foreground flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" /> CUPRINS
                  </h3>
                  <ol className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 text-sm font-medium text-muted-foreground list-decimal pl-5">
                    <li className="hover:text-primary transition-colors">SERVICIILE NOASTRE</li>
                    <li className="hover:text-primary transition-colors">PROPRIETATE INTELECTUALĂ</li>
                    <li className="hover:text-primary transition-colors">DECLARAȚIILE UTILIZATORULUI</li>
                    <li className="hover:text-primary transition-colors">ACTIVITĂȚI INTERZISE</li>
                    <li className="hover:text-primary transition-colors">TEHNOLOGIE ȘI SERVICII TERȚE</li>
                    <li className="hover:text-primary transition-colors">LICENȚA PENTRU CONȚINUT</li>
                    <li className="hover:text-primary transition-colors">TERMEN ȘI ÎNCETARE</li>
                    <li className="hover:text-primary transition-colors">LEGEA APLICABILĂ</li>
                    <li className="hover:text-primary transition-colors">DISCLAIMER (AVERTIZARE)</li>
                    <li className="hover:text-primary transition-colors">LIMITAREA RĂSPUNDERII</li>
                    <li className="hover:text-primary transition-colors">DATELE UTILIZATORULUI</li>
                    <li className="hover:text-primary transition-colors">CONTACTAȚI-NE</li>
                  </ol>
                </div>

                <section>
                  <h2 className="text-2xl border-b pb-2">1. SERVICIILE NOASTRE</h2>
                  <p>Informațiile furnizate sunt destinate exclusiv suportului educațional. Deși depunem eforturi pentru acuratețe, această platformă este un proiect condus de elevi și nu garantează succesul la examene.</p>
                </section>

                <section>
                  <h2 className="text-2xl border-b pb-2">2. DREPTURI DE PROPRIETATE INTELECTUALĂ</h2>
                  <p>Suntem proprietarii codului sursă, designului și materialelor educaționale originale de pe platformă. Acestea sunt protejate de legile drepturilor de autor. Puteți folosi materialele doar pentru <strong>uz personal, necomercial (studiu individual)</strong>.</p>
                </section>

                <section>
                  <h2 className="text-2xl border-b pb-2">3. DECLARAȚIILE UTILIZATORULUI</h2>
                  <p>Prin utilizarea platformei, confirmați că: (1) Aveți capacitatea legală de a accepta acești termeni sau aveți acordul părinților (pentru sub 16 ani); (2) Nu veți folosi platforma în scopuri ilegale; (3) Nu veți folosi script-uri sau boți pentru a extrage date.</p>
                </section>

                <section>
                  <h2 className="text-2xl border-b pb-2">4. ACTIVITĂȚI INTERZISE</h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Copierea sistematică a conținutului pentru a crea baze de date concurente.</li>
                    <li>Încercarea de a sparge securitatea site-ului sau a conturilor altor utilizatori.</li>
                    <li>Postarea de conținut ofensator sau dăunător în secțiunile interactive.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl border-b pb-2">5. TEHNOLOGIE ȘI SERVICII TERȚE</h2>
                  <p>Platforma utilizează infrastructură externă pentru funcționare:</p>
                  <ul className="list-disc pl-6">
                    <li><strong>Google Firebase:</strong> Pentru baza de date și securitatea contului.</li>
                    <li><strong>Vercel:</strong> Pentru găzduire și viteză de încărcare.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl border-b pb-2 text-destructive">9. DISCLAIMER (LIMITAREA RESPONSABILITĂȚII)</h2>
                  <div className="bg-muted p-6 rounded-2xl italic border-l-4 border-primary">
                    &quot;Serviciile sunt furnizate CA ATARE. Utilizarea lor este pe propriul risc. Nu garantăm că materialele sunt fără erori. Nu ne asumăm responsabilitatea pentru notele obținute la examenele oficiale; platforma este doar un instrument de sprijin.&quot;
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl border-b pb-2">12. CONTACTAȚI-NE</h2>
                  <p>Pentru orice nelămurire sau reclamație, echipa noastră vă stă la dispoziție:</p>
                  <div className="flex flex-col gap-3 mt-4">
                    <a href="mailto:spyderend0@gmail.com" className="flex items-center gap-2 text-primary font-bold">
                      <Mail className="w-5 h-5" /> spyderend0@gmail.com
                    </a>
                    <Link href="/contact" className="flex items-center gap-2 text-primary font-bold">
                      <Globe className="w-5 h-5" /> Pagina Oficială de Contact
                    </Link>
                  </div>
                </section>
              </div>
            ) : (
              /* ================= CONȚINUT COMPLET ÎN ENGLEZĂ ================= */
              <div className="space-y-10">
                <section>
                  <h2 className="text-2xl border-b pb-2 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-primary" /> AGREEMENT TO OUR LEGAL TERMS
                  </h2>
                  <p className="text-lg">
                    We are the development team behind <strong>Învățăm Împreună</strong> (&quot;<strong>The Platform</strong>,&quot; &quot;<strong>we</strong>,&quot; &quot;<strong>us</strong>&quot;). This project is an independent educational initiative developed by students for students.
                  </p>
                  <p>
                    We operate the website <a href="https://invatam-impreuna.vercel.app">https://invatam-impreuna.vercel.app</a>. Contact us at <a href="mailto:spyderend0@gmail.com">spyderend0@gmail.com</a>.
                  </p>
                </section>

                <div className="bg-muted/30 p-8 rounded-3xl border border-border not-prose my-12">
                  <h3 className="text-xl font-bold mb-6 font-lora text-foreground">TABLE OF CONTENTS</h3>
                  <ol className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 text-sm font-medium text-muted-foreground list-decimal pl-5">
                    <li>OUR SERVICES</li>
                    <li>INTELLECTUAL PROPERTY</li>
                    <li>USER REPRESENTATIONS</li>
                    <li>PROHIBITED ACTIVITIES</li>
                    <li>TECHNOLOGY & THIRD PARTIES</li>
                    <li>CONTRIBUTION LICENSE</li>
                    <li>TERM AND TERMINATION</li>
                    <li>GOVERNING LAW</li>
                    <li>DISCLAIMER</li>
                    <li>LIMITATIONS OF LIABILITY</li>
                    <li>USER DATA</li>
                    <li>CONTACT US</li>
                  </ol>
                </div>

                <section>
                  <h2 className="text-2xl border-b pb-2">1. OUR SERVICES</h2>
                  <p>Our platform provides educational resources for personal study. The Services are provided &quot;AS IS&quot; and intended for exam preparation support only.</p>
                </section>

                <section>
                  <h2 className="text-2xl border-b pb-2">2. INTELLECTUAL PROPERTY RIGHTS</h2>
                  <p>We own the source code, design, and original materials. You are granted a limited license for personal, non-commercial use only.</p>
                </section>

                <section>
                  <h2 className="text-2xl border-b pb-2">9. DISCLAIMER</h2>
                  <p>THE SERVICES ARE PROVIDED ON AN AS-IS BASIS. WE DISCLAIM ALL WARRANTIES. WE DO NOT WARRANT THAT EDUCATIONAL CONTENT IS ERROR-FREE. WE ARE NOT RESPONSIBLE FOR EXAM RESULTS.</p>
                </section>

                <section>
                  <h2 className="text-2xl border-b pb-2">12. CONTACT US</h2>
                  <p>For inquiries, please contact the team:</p>
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