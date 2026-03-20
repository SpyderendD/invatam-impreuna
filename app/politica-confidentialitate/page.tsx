'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShieldCheck, Mail, Globe, ExternalLink } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
                <ShieldCheck className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-3xl md:text-5xl font-extrabold text-foreground font-lora tracking-tight">
                  {language === 'ro' ? 'POLITICA DE CONFIDENȚIALITATE' : 'PRIVACY POLICY'}
                </h1>
                <p className="text-muted-foreground mt-1 font-medium">
                  {language === 'ro' ? 'Ultima actualizare: 01 Iulie 2025' : 'Last updated July 01, 2025'}
                </p>
              </div>
            </div>
          </div>

          {/* Selector Limbă Îmbunătățit */}
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
              <div className="space-y-8">
                <section>
                  <p className="text-lg">
                    Această Notificare de Confidențialitate pentru <strong>ÎNVĂȚĂM ÎMPREUNĂ</strong> (operând sub numele de <strong>Învățăm Împreună</strong>) (&quot;<strong>noi</strong>,&quot; &quot;<strong>ne</strong>,&quot; sau &quot;<strong>nostru</strong>&quot;), descrie modul în care și de ce am putea accesa, colecta, stoca, utiliza și/sau partaja (&quot;<strong>procesa</strong>&quot;) informațiile dvs. personale atunci când utilizați serviciile noastre (&quot;<strong>Servicii</strong>&quot;), inclusiv când:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Vizitați site-ul nostru la <a href="https://invatam-impreuna.vercel.app" className="flex-inline items-center gap-1">https://invatam-impreuna.vercel.app <ExternalLink className="w-3 h-3 inline" /></a></li>
                    <li>Utilizați platforma noastră educațională care oferă resurse de învățare și exerciții interactive.</li>
                    <li>Interacționați cu noi în alte moduri conexe, inclusiv vânzări, marketing sau evenimente.</li>
                  </ul>
                  <div className="bg-primary/5 p-4 rounded-xl border-l-4 border-primary mt-6">
                    <strong>Aveți întrebări sau nelămuriri?</strong> Citirea acestei notificări vă va ajuta să înțelegeți drepturile și opțiunile dvs. privind confidențialitatea. Dacă nu sunteți de acord cu politicile noastre, vă rugăm să nu utilizați Serviciile noastre. Contact: <a href="mailto:spyderend0@gmail.com">spyderend0@gmail.com</a>.
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl border-b pb-2">REZUMATUL PUNCTELOR CHEIE</h2>
                  <p><strong>Ce informații personale procesăm?</strong> Procesăm informații în funcție de modul în care interacționați cu Serviciile, alegerile pe care le faceți și funcțiile utilizate.</p>
                  <p><strong>Procesăm informații sensibile?</strong> Nu colectăm și nu procesăm informații personale sensibile (ex. date medicale, religie).</p>
                  <p><strong>Colectăm informații de la terți?</strong> Putem primi informații din baze de date publice, parteneri de marketing sau platforme sociale (ex. Google Login).</p>
                  <p><strong>Cum procesăm informațiile?</strong> Pentru a furniza, îmbunătăți și administra Serviciile, pentru comunicare, securitate și conformitate legală.</p>
                </section>

                <section>
                  <h2 className="text-2xl border-b pb-2">1. CE INFORMAȚII COLECTĂM?</h2>
                  <h3 className="text-xl font-semibold mt-4">Informații pe care ni le furnizați voluntar</h3>
                  <p>Colectăm datele pe care ni le oferiți la înregistrare, când vă exprimați interesul pentru produsele noastre sau când ne contactați direct. Acestea includ:</p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 list-none pl-0">
                    <li className="flex items-center gap-2">✅ Nume și prenume</li>
                    <li className="flex items-center gap-2">✅ Adrese de email</li>
                    <li className="flex items-center gap-2">✅ Nume de utilizator</li>
                    <li className="flex items-center gap-2">✅ Parole securizate</li>
                    <li className="flex items-center gap-2">✅ Preferințe de contact</li>
                  </ul>

                  <h3 className="text-xl font-semibold mt-6">Informații colectate automat</h3>
                  <p>Colectăm automat date tehnice la navigare: adresa IP, tipul browserului, sistemul de operare, setările de limbă, locația aproximativă (țară/oraș) și modul în care utilizați platforma.</p>
                </section>

                <section>
                  <h2 className="text-2xl border-b pb-2">2. CUM PROCESĂM INFORMAȚIILE DVS.?</h2>
                  <p>Motivele principale pentru procesarea datelor includ:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Crearea și gestionarea conturilor:</strong> Pentru a vă permite să vă autentificați și să vă salvați progresul.</li>
                    <li><strong>Furnizarea Serviciilor:</strong> Pentru a vă livra resursele educaționale solicitate.</li>
                    <li><strong>Suport utilizatori:</strong> Pentru a răspunde la întrebări și a rezolva probleme tehnice.</li>
                    <li><strong>Securitate:</strong> Pentru monitorizarea și prevenirea fraudelor sau atacurilor cibernetice.</li>
                    <li><strong>Îmbunătățirea experienței:</strong> Identificarea tendințelor de utilizare pentru a crea funcții noi.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl border-b pb-2">3. TEMEIURI LEGALE</h2>
                  <p>Procesăm datele dvs. doar sub temeiuri legale valide conform GDPR:</p>
                  <ul className="list-disc pl-6">
                    <li><strong>Consimțământ:</strong> Când ne-ați dat permisiunea explicită.</li>
                    <li><strong>Executarea unui contract:</strong> Pentru a vă oferi accesul la platformă.</li>
                    <li><strong>Interes legitim:</strong> Pentru îmbunătățirea securității și a calității serviciului.</li>
                    <li><strong>Obligații legale:</strong> Când legea ne cere acest lucru.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl border-b pb-2">4. PARTAJAREA DATELOR CU TERȚI</h2>
                  <p>Putem partaja datele cu furnizori esențiali, cum ar fi:</p>
                  <ul className="list-disc pl-6">
                    <li>Servicii de Cloud Computing (ex. Vercel, Firebase)</li>
                    <li>Instrumente de Analiză (ex. Google Analytics)</li>
                    <li>Servicii de Autentificare (ex. Google/Facebook Login)</li>
                    <li>Servicii de Publicitate (ex. Google AdSense)</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl border-b pb-2">5. COOKIE-URI ȘI TEHNOLOGII DE MONITORIZARE</h2>
                  <p>Folosim cookie-uri pentru a vă menține logat și pentru a analiza traficul. Detalii complete găsiți în <Link href="/cookies" className="font-bold underline decoration-primary/50 text-primary">Politica de Cookie-uri</Link>.</p>
                </section>

                <section>
                  <h2 className="text-2xl border-b pb-2">6. TRANSFERURI INTERNAȚIONALE</h2>
                  <p>Serverele noastre sunt localizate în SUA, Germania și Marea Britanie (prin Firebase/Google Cloud). Ne asigurăm că datele dvs. sunt protejate conform standardelor europene de siguranță.</p>
                </section>

                <section>
                  <h2 className="text-2xl border-b pb-2">7. DREPTURILE DVS. DE CONFIDENȚIALITATE</h2>
                  <p>Conform GDPR, aveți dreptul de a:</p>
                  <ul className="list-disc pl-6">
                    <li>Solicita accesul la datele dvs. personale.</li>
                    <li>Solicita rectificarea sau ștergerea datelor.</li>
                    <li>Restricționa sau obiecta la procesarea datelor.</li>
                    <li>Portabilitatea datelor către un alt serviciu.</li>
                  </ul>
                  <p>Vă puteți gestiona datele direct din setările contului sau contactându-ne prin email.</p>
                </section>

                <section>
                  <h2 className="text-2xl border-b pb-2">8. CONTACT ȘI ȘTERGERE DATE</h2>
                  <p>Pentru orice întrebări sau pentru a solicita ștergerea definitivă a contului și a datelor asociate, contactați-ne la:</p>
                  <div className="flex flex-col gap-3 mt-4">
                    <a href="mailto:spyderend0@gmail.com" className="flex items-center gap-2 text-primary font-bold">
                      <Mail className="w-5 h-5" /> spyderend0@gmail.com
                    </a>
                    <Link href="/contact" className="flex items-center gap-2 text-primary font-bold">
                      <Globe className="w-5 h-5" /> Pagina de Contact
                    </Link>
                  </div>
                </section>
              </div>
            ) : (
              /* ================= CONȚINUT COMPLET ÎN ENGLEZĂ ================= */
              <div className="space-y-8">
                <section>
                  <p className="text-lg">
                    This Privacy Notice for <strong>ÎNVĂȚĂM ÎMPREUNĂ</strong> (doing business as <strong>Învățăm Împreună</strong>) (&quot;<strong>we</strong>,&quot; &quot;<strong>us</strong>,&quot; or &quot;<strong>our</strong>&quot;), describes how and why we might access, collect, store, use, and/or share (&quot;<strong>process</strong>&quot;) your personal information when you use our services (&quot;<strong>Services</strong>&quot;), including when you:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Visit our website at <a href="https://invatam-impreuna.vercel.app">https://invatam-impreuna.vercel.app</a></li>
                    <li>Use our educational platform that offers learning resources and interactive exercises.</li>
                    <li>Engage with us in other related ways, including any sales, marketing, or events.</li>
                  </ul>
                  <div className="bg-primary/5 p-4 rounded-xl border-l-4 border-primary mt-6">
                    <strong>Questions or concerns?</strong> Reading this notice will help you understand your privacy rights and choices. If you do not agree with our policies, please do not use our Services. Contact: <a href="mailto:spyderend0@gmail.com">spyderend0@gmail.com</a>.
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl border-b pb-2">SUMMARY OF KEY POINTS</h2>
                  <p><strong>What personal information do we process?</strong> We process information depending on how you interact with the Services, your choices, and the features you use.</p>
                  <p><strong>Do we process sensitive info?</strong> We do not process sensitive personal information.</p>
                  <p><strong>Do we collect info from third parties?</strong> We may collect info from public databases, marketing partners, and social media platforms.</p>
                  <p><strong>How do we process your info?</strong> To provide, improve, and administer our Services, for communication, security, and legal compliance.</p>
                </section>

                <section>
                  <h2 className="text-2xl border-b pb-2">1. WHAT INFORMATION DO WE COLLECT?</h2>
                  <h3 className="text-xl font-semibold mt-4">Personal information you disclose to us</h3>
                  <p>We collect personal information that you voluntarily provide when you register on the Services. This includes:</p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 list-none pl-0">
                    <li className="flex items-center gap-2">✅ Names and Surnames</li>
                    <li className="flex items-center gap-2">✅ Email addresses</li>
                    <li className="flex items-center gap-2">✅ Usernames</li>
                    <li className="flex items-center gap-2">✅ Secure passwords</li>
                    <li className="flex items-center gap-2">✅ Contact preferences</li>
                  </ul>

                  <h3 className="text-xl font-semibold mt-6">Information automatically collected</h3>
                  <p>We automatically collect technical data: IP address, browser type, operating system, language preferences, location (country/city), and usage patterns.</p>
                </section>

                <section>
                  <h2 className="text-2xl border-b pb-2">2. HOW DO WE PROCESS YOUR INFORMATION?</h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Account Management:</strong> Facilitating account creation and authentication.</li>
                    <li><strong>Service Delivery:</strong> Providing requested educational resources.</li>
                    <li><strong>User Support:</strong> Responding to inquiries and technical issues.</li>
                    <li><strong>Security:</strong> Monitoring for fraud and cyber threats.</li>
                    <li><strong>Improvement:</strong> Identifying usage trends for new features.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl border-b pb-2">3. LEGAL BASES</h2>
                  <p>We process your data under valid legal reasons such as Consent, Performance of a Contract, Legitimate Interests, and Legal Obligations.</p>
                </section>

                <section>
                  <h2 className="text-2xl border-b pb-2">4. SHARING WITH THIRD PARTIES</h2>
                  <p>We share data with cloud providers (Vercel, Firebase), Analytics tools, Social Logins, and Advertising services (AdSense).</p>
                </section>

                <section>
                  <h2 className="text-2xl border-b pb-2">5. COOKIES</h2>
                  <p>We use cookies to keep you logged in and analyze traffic. See our <Link href="/cookies" className="text-primary font-bold">Cookie Policy</Link>.</p>
                </section>

                <section>
                  <h2 className="text-2xl border-b pb-2">6. INTERNATIONAL TRANSFERS</h2>
                  <p>Our servers are located in the US, Germany, and UK (Firebase). We ensure your data is protected according to EU safety standards.</p>
                </section>

                <section>
                  <h2 className="text-2xl border-b pb-2">7. YOUR PRIVACY RIGHTS</h2>
                  <p>Under GDPR, you have the right to access, rectify, or delete your personal data. You can manage this via account settings or by contacting us.</p>
                </section>

                <section>
                  <h2 className="text-2xl border-b pb-2">8. CONTACT & DATA DELETION</h2>
                  <p>For questions or to request account deletion, contact us at:</p>
                  <div className="flex flex-col gap-3 mt-4">
                    <a href="mailto:spyderend0@gmail.com" className="flex items-center gap-2 text-primary font-bold">
                      <Mail className="w-5 h-5" /> spyderend0@gmail.com
                    </a>
                  </div>
                </section>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}