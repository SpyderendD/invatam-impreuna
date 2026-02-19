'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Scale } from 'lucide-react';

export default function TermsOfUsePage() {
  const [language, setLanguage] = useState<'ro' | 'en'>('en'); 

  return (
    <main className="min-h-screen bg-background py-24 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header & Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <Button asChild variant="ghost" className="mb-4 pl-0 hover:bg-transparent hover:text-primary">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> {language === 'en' ? 'Back to Home' : 'Înapoi la prima pagină'}
              </Link>
            </Button>
            
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <Scale className="w-8 h-8" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground font-lora">
                {language === 'en' ? 'TERMS OF USE' : 'TERMENI ȘI CONDIȚII'}
              </h1>
            </div>
            <p className="text-muted-foreground">
              {language === 'en' ? 'Last updated December 18, 2025' : 'Ultima actualizare: 18 Decembrie 2025'}
            </p>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center bg-muted p-1 rounded-lg self-start md:self-center">
            <button
              type="button"
              onClick={() => setLanguage('ro')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                language === 'ro' 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              RO
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                language === 'en' 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Content Wrapper */}
        <AnimatePresence mode='wait'>
          <motion.div 
            key={language}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="prose prose-lg dark:prose-invert max-w-none 
              prose-headings:text-foreground prose-headings:font-bold prose-headings:font-lora
              prose-p:text-muted-foreground prose-li:text-muted-foreground
              prose-strong:text-foreground prose-a:text-primary hover:prose-a:underline
              bg-card p-8 md:p-12 rounded-3xl border border-border shadow-sm"
          >
            
            {language === 'en' ? (
              // ================= ENGLISH CONTENT =================
              <>
                <h2>AGREEMENT TO OUR LEGAL TERMS</h2>
                <p>
                  We are the development team behind <strong>Învățăm Împreună</strong> (&quot;<strong>The Platform</strong>,&quot; &quot;<strong>we</strong>,&quot; &quot;<strong>us</strong>,&quot; &quot;<strong>our</strong>&quot;). This project is an independent educational initiative developed by students for students.
                </p>
                <p>
                  We operate the website <a href="https://invatam-impreuna.vercel.app">https://invatam-impreuna.vercel.app</a>, as well as any other related products and services that refer or link to these legal terms (the &quot;<strong>Legal Terms</strong>&quot;) (collectively, the &quot;<strong>Services</strong>&quot;).
                </p>
                <p>
                  You can contact us by email at <a href="mailto:spyderend0@gmail.com">spyderend0@gmail.com</a>.
                </p>
                <p>
                  These Legal Terms constitute a legally binding agreement made between you, whether personally or on behalf of an entity (&quot;<strong>you</strong>&quot;), and the administrators of <strong>Învățăm Împreună</strong>, concerning your access to and use of the Services. You agree that by accessing the Services, you have read, understood, and agreed to be bound by all of these Legal Terms. IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.
                </p>
                <p>
                  We reserve the right, in our sole discretion, to make changes or modifications to these Legal Terms at any time and for any reason. We will alert you about any changes by updating the &quot;Last updated&quot; date of these Legal Terms.
                </p>

                <div className="bg-muted/50 p-6 rounded-xl border border-border not-prose my-8">
                  <h3 className="text-xl font-bold mb-4 font-lora text-foreground">TABLE OF CONTENTS</h3>
                  <ol className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground list-decimal pl-5">
                    <li>OUR SERVICES</li>
                    <li>INTELLECTUAL PROPERTY RIGHTS</li>
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

                <h2>1. OUR SERVICES</h2>
                <p>
                  The information provided when using the Services is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation.
                </p>
                <p>
                  <strong>Nature of the Project:</strong> Please note that this Platform is an educational project developed by a student. While we strive to provide accurate and high-quality educational content for National Evaluation and Baccalaureate, the Services are provided &quot;AS IS&quot; and intended for study support purposes.
                </p>

                <h2>2. INTELLECTUAL PROPERTY RIGHTS</h2>
                <h3>Our intellectual property</h3>
                <p>
                  We are the owner or the licensee of all intellectual property rights in our Services, including all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics in the Services (collectively, the &quot;Content&quot;).
                </p>
                <p>
                  The Content is protected by copyright and trademark laws. The Content is provided in or through the Services &quot;AS IS&quot; for your personal, non-commercial use or internal business purpose only.
                </p>

                <h3>Your use of our Services</h3>
                <p>
                  Subject to your compliance with these Legal Terms, we grant you a non-exclusive, non-transferable, revocable license to access the Services and use the educational materials solely for your personal study and preparation for exams.
                </p>

                <h2>3. USER REPRESENTATIONS</h2>
                <p>
                  By using the Services, you represent and warrant that: (1) If you are a minor under the age of 16, you confirm that you have obtained parental consent to use this Platform if not you have the legal capacity and you agree to comply with these Legal Terms; (2) you will not access the Services through automated or non-human means, whether through a bot, script or otherwise; (3) you will not use the Services for any illegal or unauthorized purpose.
                </p>

                <h2>4. PROHIBITED ACTIVITIES</h2>
                <p>
                  You may not access or use the Services for any purpose other than that for which we make the Services available. The Services may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
                </p>
                <p>As a user of the Services, you agree not to:</p>
                <ul>
                  <li>Systematically retrieve data or other content from the Services to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.</li>
                  <li>Trick, defraud, or mislead us and other users.</li>
                  <li>Circumvent, disable, or otherwise interfere with security-related features of the Services.</li>
                  <li>Upload or transmit viruses, Trojan horses, or other material that interferes with any party&apos;s uninterrupted use and enjoyment of the Services.</li>
                  <li>Attempt to impersonate another user.</li>
                </ul>

                <h2>5. TECHNOLOGY & THIRD PARTIES</h2>
                <p>
                  Our Platform utilizes third-party services to function effectively. By using our Services, you acknowledge and agree that:
                </p>
                <ul>
                  <li><strong>Google Firebase:</strong> We use Google Firebase for authentication, database management, and hosting. Your data (such as login credentials and study progress) is stored securely on Google&apos;s infrastructure.</li>
                  <li><strong>Vercel:</strong> The application is hosted and deployed via Vercel.</li>
                  <li><strong>Analytics:</strong> We may use analytics tools to understand how users interact with the platform to improve the educational experience.</li>
                </ul>

                <h2>6. CONTRIBUTION LICENSE</h2>
                <p>
                  You agree that we may access, store, process, and use any information and personal data that you provide and your choices (including settings). By submitting suggestions or other feedback regarding the Services, you agree that we can use and share such feedback for any purpose without compensation to you.
                </p>

                <h2>7. TERM AND TERMINATION</h2>
                <p>
                  These Legal Terms shall remain in full force and effect while you use the Services. WE RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION AND WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE SERVICES TO ANY PERSON FOR ANY REASON, INCLUDING WITHOUT LIMITATION FOR BREACH OF ANY REPRESENTATION.
                </p>

                <h2>8. GOVERNING LAW</h2>
                <p>
                  These Legal Terms shall be governed by and defined following the laws of <strong>Romania</strong>.
                </p>

                <h2>9. DISCLAIMER</h2>
                <p>
                  THE SERVICES ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE SERVICES WILL BE AT YOUR SOLE RISK. AS THIS IS A STUDENT-LED EDUCATIONAL PROJECT, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SERVICES. WE DO NOT WARRANT THAT THE EDUCATIONAL CONTENT IS ERROR-FREE, THOUGH WE STRIVE FOR ACCURACY.
                </p>

                <h2>10. LIMITATIONS OF LIABILITY</h2>
                <p>
                  IN NO EVENT WILL WE BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICES.
                </p>

                <h2>11. USER DATA</h2>
                <p>
                  We will maintain certain data that you transmit to the Services for the purpose of managing the performance of the Services. Although we perform regular routine backups of data (facilitated by Firebase), you are solely responsible for all data that you transmit.
                </p>

                <h2>12. CONTACT US</h2>
                <p>
                  In order to resolve a complaint regarding the Services or to receive further information regarding use of the Services, please contact us at:
                </p>
                <div className="bg-muted p-4 rounded-lg not-prose text-sm">
                  <p className="font-bold text-foreground">Învățăm Împreună Team</p>
                  <p className="mt-2">Email: <a href="mailto:spyderend0@gmail.com" className="text-primary hover:underline">spyderend0@gmail.com</a></p>
                </div>
              </>
            ) : (
              // ================= ROMANIAN CONTENT =================
              <>
                <h2>ACORD PRIVIND TERMENII LEGALI</h2>
                <p>
                  Noi suntem echipa de dezvoltare din spatele platformei <strong>Învățăm Împreună</strong> (&quot;<strong>Platforma</strong>,&quot; &quot;<strong>noi</strong>&quot;). Acesta este un proiect educațional independent, dezvoltat de elevi pentru elevi, cu scopul de a sprijini educația în România.
                </p>
                <p>
                  Operăm website-ul <a href="https://invatam-impreuna.vercel.app">https://invatam-impreuna.vercel.app</a>, precum și alte produse și servicii conexe (colectiv, &quot;<strong>Serviciile</strong>&quot;).
                </p>
                <p>
                  Ne puteți contacta exclusiv prin email la <a href="mailto:spyderend0@gmail.com">spyderend0@gmail.com</a>.
                </p>
                <p>
                  Acești Termeni Legali constituie un acord obligatoriu din punct de vedere juridic încheiat între dvs. (&quot;<strong>dvs.</strong>&quot;) și administratorii <strong>Învățăm Împreună</strong>, privind accesul și utilizarea Serviciilor. Sunteți de acord că, prin accesarea Serviciilor, ați citit, înțeles și sunteți de acord să respectați toți acești Termeni Legali. DACĂ NU SUNTEȚI DE ACORD CU TOȚI ACEȘTI TERMENI, VĂ ESTE INTERZISĂ ÎN MOD EXPRES UTILIZAREA SERVICIILOR ȘI TREBUIE SĂ ÎNCETAȚI IMEDIAT UTILIZAREA LOR.
                </p>

                <div className="bg-muted/50 p-6 rounded-xl border border-border not-prose my-8">
                  <h3 className="text-xl font-bold mb-4 font-lora text-foreground">CUPRINS</h3>
                  <ol className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground list-decimal pl-5">
                    <li>SERVICIILE NOASTRE</li>
                    <li>DREPTURI DE PROPRIETATE INTELECTUALĂ</li>
                    <li>DECLARAȚIILE UTILIZATORULUI</li>
                    <li>ACTIVITĂȚI INTERZISE</li>
                    <li>TEHNOLOGIE ȘI SERVICII TERȚE</li>
                    <li>LICENȚA PENTRU CONTRIBUȚII</li>
                    <li>TERMEN ȘI ÎNCETARE</li>
                    <li>LEGEA APLICABILĂ</li>
                    <li>DISCLAIMER</li>
                    <li>LIMITAREA RĂSPUNDERII</li>
                    <li>DATELE UTILIZATORULUI</li>
                    <li>CONTACTAȚI-NE</li>
                  </ol>
                </div>

                <h2>1. SERVICIILE NOASTRE</h2>
                <p>
                  Informațiile furnizate la utilizarea Serviciilor nu sunt destinate distribuirii sau utilizării de către nicio persoană sau entitate în nicio jurisdicție sau țară în care o astfel de distribuire sau utilizare ar fi contrară legii.
                </p>
                <p>
                  <strong>Natura Proiectului:</strong> Vă rugăm să rețineți că această Platformă este un proiect educațional dezvoltat de un elev. Deși depunem toate eforturile pentru a furniza conținut educațional corect și de înaltă calitate pentru Evaluarea Națională și Bacalaureat, Serviciile sunt furnizate &quot;CA ATARE&quot; (AS-IS) și au scop strict de suport în studiu.
                </p>

                <h2>2. DREPTURI DE PROPRIETATE INTELECTUALĂ</h2>
                <h3>Proprietatea noastră intelectuală</h3>
                <p>
                  Suntem proprietarul sau licențiatul tuturor drepturilor de proprietate intelectuală din Serviciile noastre, inclusiv codul sursă, bazele de date, funcționalitatea, software-ul, designul site-ului, audio, video, text, fotografii și grafică (&quot;Conținutul&quot;).
                </p>
                <p>
                  Conținutul este protejat de legile privind drepturile de autor. Acesta este furnizat &quot;CA ATARE&quot; doar pentru uzul dvs. personal, necomercial (studiu individual).
                </p>

                <h3>Utilizarea Serviciilor noastre</h3>
                <p>
                  Sub rezerva respectării acestor Termeni Legali, vă acordăm o licență neexclusivă, netransferabilă și revocabilă pentru a accesa Serviciile și a utiliza materialele educaționale strict în scop personal.
                </p>

                <h2>3. DECLARAȚIILE UTILIZATORULUI</h2>
                <p>
                  Prin utilizarea Serviciilor, declarați că: (1) Dacă sunteți minor cu vârsta sub 16 ani, confirmați că ați obținut consimțământul părinților pentru a utiliza această Platformă, dacă nu aveți capacitate legală, și sunteți de acord să respectați acești Termeni Legali; (2) nu veți accesa Serviciile prin mijloace automate (bot, script); (3) nu veți utiliza Serviciile în niciun scop ilegal.
                </p>

                <h2>4. ACTIVITĂȚI INTERZISE</h2>
                <p>Ca utilizator al Serviciilor, sunteți de acord să nu:</p>
                <ul>
                  <li>Preluati sistematic date sau alt conținut din Servicii pentru a crea o colecție sau bază de date fără permisiune.</li>
                  <li>Înșelați, fraudați sau induceți în eroare alți utilizatori.</li>
                  <li>Ocoliți caracteristicile de securitate.</li>
                  <li>Încărcați viruși sau alte materiale dăunătoare.</li>
                  <li>Încercați să vă dați drept alt utilizator.</li>
                </ul>

                <h2>5. TEHNOLOGIE ȘI SERVICII TERȚE</h2>
                <p>
                  Platforma noastră utilizează servicii terțe pentru a funcționa eficient. Prin utilizarea Serviciilor, luați la cunoștință că:
                </p>
                <ul>
                  <li><strong>Google Firebase:</strong> Utilizăm Firebase pentru autentificare, baza de date și stocare. Datele dvs. (precum progresul școlar) sunt stocate securizat pe infrastructura Google.</li>
                  <li><strong>Vercel:</strong> Aplicația este găzduită prin Vercel.</li>
                  <li><strong>Analiză:</strong> Putem folosi instrumente de analiză pentru a îmbunătăți experiența educațională.</li>
                </ul>

                <h2>6. LICENȚA PENTRU CONTRIBUȚII</h2>
                <p>
                  Sunteți de acord că putem accesa, stoca și procesa orice informație și date personale pe care le furnizați conform alegerilor dvs. Prin trimiterea de sugestii sau feedback, sunteți de acord că le putem utiliza fără compensații.
                </p>

                <h2>7. TERMEN ȘI ÎNCETARE</h2>
                <p>
                  Acești Termeni rămân în vigoare cât timp utilizați Serviciile. NE REZERVĂM DREPTUL DE A REFUZA ACCESUL LA SERVICII ORICĂREI PERSOANE, DIN ORICE MOTIV, INCLUSIV PENTRU ÎNCĂLCAREA ACESTOR TERMENI.
                </p>

                <h2>8. LEGEA APLICABILĂ</h2>
                <p>
                  Acești Termeni Legali vor fi guvernați și definiți în conformitate cu legile din <strong>România</strong>.
                </p>

                <h2>9. DISCLAIMER (LIMITAREA RESPONSABILITĂȚII)</h2>
                <p>
                  SERVICIILE SUNT FURNIZATE &quot;CA ATARE&quot;. SUNTEȚI DE ACORD CĂ UTILIZAREA SERVICIILOR VA FI PE RISCUL DVS. FIIND UN PROIECT EDUCAȚIONAL DEZVOLTAT DE ELEVI, NU GARANTĂM CĂ MATERIALELE SUNT COMPLET LIPSITE DE ERORI, DEȘI DEPUNEM TOATE EFORTURILE PENTRU ACURATEȚE. NU NE ASUMĂM RĂSPUNDEREA PENTRU REZULTATELE LA EXAMENE SAU LA TESTE.
                </p>

                <h2>10. LIMITAREA RĂSPUNDERII</h2>
                <p>
                  ÎN NICIUN CAZ NOI NU VOM FI RĂSPUNZĂTORI FAȚĂ DE DVS. PENTRU ORICE DAUNE DIRECTE, INDIRECTE SAU ACCIDENTALE CARE REZULTĂ DIN UTILIZAREA SERVICIILOR.
                </p>

                <h2>11. DATELE UTILIZATORULUI</h2>
                <p>
                  Vom menține anumite date pe care le transmiteți Serviciilor pentru a gestiona performanța (progres, cont). Deși efectuăm backup-uri regulate (prin Firebase), sunteți singurul responsabil pentru datele pe care le transmiteți.
                </p>

                <h2>12. CONTACTAȚI-NE</h2>
                <p>
                  Pentru a rezolva o reclamație privind Serviciile sau pentru a primi informații suplimentare, vă rugăm să ne contactați la:
                </p>
                <div className="bg-muted p-4 rounded-lg not-prose text-sm">
                  <p className="font-bold text-foreground">Echipa Învățăm Împreună</p>
                  <p className="mt-2">Email: <a href="mailto:spyderend0@gmail.com" className="text-primary hover:underline">spyderend0@gmail.com</a></p>
                </div>
              </>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}