'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShieldCheck, Globe } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const [language, setLanguage] = useState<'ro' | 'en'>('en'); // Default EN conform textului tău

  return (
    <main className="min-h-screen bg-background py-24 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        
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
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground font-lora">
                {language === 'en' ? 'PRIVACY POLICY' : 'POLITICA DE CONFIDENȚIALITATE'}
              </h1>
            </div>
            <p className="text-muted-foreground">
              {language === 'en' ? 'Last updated July 01, 2025' : 'Ultima actualizare: 01 Iulie 2025'}
            </p>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center bg-muted p-1 rounded-lg self-start md:self-center">
            <button
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
              // ================= ENGLISH CONTENT (BASED ON YOUR INPUT) =================
              <>
                <p>
                  This Privacy Notice for <strong>ÎNVĂȚĂM ÎMPREUNĂ</strong> (doing business as <strong>Învățăm Împreună</strong>) (&quot;<strong>we</strong>,&quot; &quot;<strong>us</strong>,&quot; or &quot;<strong>our</strong>&quot;), describes how and why we might access, collect, store, use, and/or share (&quot;<strong>process</strong>&quot;) your personal information when you use our services (&quot;<strong>Services</strong>&quot;), including when you:
                </p>
                <ul>
                  <li>Visit our website at <a href="https://invatam-impreuna.netlify.app">https://invatam-impreuna.netlify.app</a> or any website of ours that links to this Privacy Notice</li>
                  <li>Use our educational platform that offers learning resources and interactive exercises.</li>
                  <li>Engage with us in other related ways, including any sales, marketing, or events.</li>
                </ul>
                <p>
                  <strong>Questions or concerns?</strong> Reading this Privacy Notice will help you understand your privacy rights and choices. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at <a href="mailto:spyderend0@gmail.com">spyderend0@gmail.com</a>.
                </p>

                <h2>SUMMARY OF KEY POINTS</h2>
                <p>
                  <strong>What personal information do we process?</strong> When you visit, use, or navigate our Services, we may process personal information depending on how you interact with us and the Services, the choices you make, and the products and features you use.
                </p>
                <p>
                  <strong>Do we process any sensitive personal information?</strong> We do not process sensitive personal information.
                </p>
                <p>
                  <strong>Do we collect any information from third parties?</strong> We may collect information from public databases, marketing partners, social media platforms, and other outside sources.
                </p>
                <p>
                  <strong>How do we process your information?</strong> We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent.
                </p>

                <hr />

                <h2>1. WHAT INFORMATION DO WE COLLECT?</h2>
                <h3>Personal information you disclose to us</h3>
                <p>We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.</p>
                <p>The personal information we collect may include the following:</p>
                <ul>
                  <li>Names</li>
                  <li>Email addresses</li>
                  <li>Usernames</li>
                  <li>Passwords</li>
                  <li>Contact or authentication data</li>
                  <li>Contact preferences</li>
                </ul>
                <p><strong>Sensitive Information.</strong> We do not process sensitive information.</p>
                <p><strong>Social Media Login Data.</strong> We may provide you with the option to register with us using your existing social media account details, like your Facebook, X, or other social media account.</p>

                <h3>Information automatically collected</h3>
                <p>
                  We automatically collect certain information when you visit, use, or navigate the Services. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our Services, and other technical information.
                </p>

                <h2>2. HOW DO WE PROCESS YOUR INFORMATION?</h2>
                <p>We process your personal information for a variety of reasons, depending on how you interact with our Services, including:</p>
                <ul>
                  <li><strong>To facilitate account creation and authentication and otherwise manage user accounts.</strong> We may process your information so you can create and log in to your account.</li>
                  <li><strong>To deliver and facilitate delivery of services to the user.</strong> We may process your information to provide you with the requested service.</li>
                  <li><strong>To respond to user inquiries/offer support to users.</strong></li>
                  <li><strong>To send administrative information to you.</strong></li>
                  <li><strong>To request feedback.</strong></li>
                  <li><strong>To protect our Services.</strong> Including fraud monitoring and prevention.</li>
                  <li><strong>To identify usage trends.</strong></li>
                  <li><strong>To save or protect an individual&apos;s vital interest.</strong></li>
                </ul>

                <h2>3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR INFORMATION?</h2>
                <p>We only process your personal information when we believe it is necessary and we have a valid legal reason (i.e., legal basis) to do so under applicable law, like with your consent, to comply with laws, to provide you with services to enter into or fulfill our contractual obligations, to protect your rights, or to fulfill our legitimate business interests.</p>

                <h2>4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</h2>
                <p>We may share your data with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf and require access to such information to do that work. Categories include:</p>
                <ul>
                  <li>Cloud Computing Services</li>
                  <li>Data Analytics Services</li>
                  <li>Data Storage Service Providers</li>
                  <li>Performance Monitoring Tools</li>
                  <li>User Account Registration & Authentication Services</li>
                  <li>Website Hosting Service Providers</li>
                </ul>

                <h2>5. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</h2>
                <p>We may use cookies and similar tracking technologies (like web beacons and pixels) to gather information when you interact with our Services. For detailed information, please refer to our <Link href="/cookies">Cookie Policy</Link>.</p>

                <h2>6. HOW DO WE HANDLE YOUR SOCIAL LOGINS?</h2>
                <p>Our Services offer you the ability to register and log in using your third-party social media account details (like your Facebook or X logins). Where you choose to do this, we will receive certain profile information about you from your social media provider.</p>

                <h2>7. IS YOUR INFORMATION TRANSFERRED INTERNATIONALLY?</h2>
                <p>Our servers are located in the United States, Germany, and United Kingdom (FIREBASE). If you are accessing our Services from outside, please be aware that your information may be transferred to, stored by, and processed by us in our facilities and in the facilities of the third parties with whom we may share your personal information.</p>

                <h2>8. HOW LONG DO WE KEEP YOUR INFORMATION?</h2>
                <p>We will only keep your personal information for as long as it is necessary for the purposes set out in this Privacy Notice, unless a longer retention period is required or permitted by law. No purpose in this notice will require us keeping your personal information for longer than the period of time in which users have an account with us.</p>

                <h2>9. HOW DO WE KEEP YOUR INFORMATION SAFE?</h2>
                <p>We have implemented appropriate and reasonable technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.</p>

                <h2>10. WHAT ARE YOUR PRIVACY RIGHTS?</h2>
                <p>In some regions (like the EEA, UK, and Switzerland), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; (iv) if applicable, to data portability; and (v) not to be subject to automated decision-making.</p>
                <p>You can verify, change, or terminate your account at any time by logging in to your account settings.</p>

                <h2>11. CONTROLS FOR DO-NOT-TRACK FEATURES</h2>
                <p>Most web browsers and some mobile operating systems include a Do-Not-Track (&quot;DNT&quot;) feature. At this stage, no uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals.</p>

                <h2>12. DO WE MAKE UPDATES TO THIS NOTICE?</h2>
                <p>Yes, we will update this notice as necessary to stay compliant with relevant laws. The updated version will be indicated by an updated &quot;Revised&quot; date.</p>

                <h2>13. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</h2>
                <p>If you have questions or comments about this notice, you may email us at <a href="mailto:spyderend0@gmail.com">spyderend0@gmail.com</a></p>
                

                <h2>14. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</h2>
                <p>You have the right to request access to the personal information we collect from you, change that information, or delete it. To request to review, update, or delete your personal information, please visit: <a href="https://invatam-impreuna.vercel.app/contact">https://invatam-impreuna.vercel.app/contact</a>.</p>
              </>
            ) : (
              // ================= ROMANIAN CONTENT (TRANSLATED SUMMARY) =================
              <>
                 <p>
                  Această Notificare de Confidențialitate pentru <strong>ÎNVĂȚĂM ÎMPREUNĂ</strong> descrie modul în care am putea accesa, colecta, stoca, utiliza și/sau partaja (&quot;<strong>procesa</strong>&quot;) informațiile dvs. personale atunci când utilizați serviciile noastre (&quot;<strong>Servicii</strong>&quot;).
                </p>

                <h2>REZUMATUL PUNCTELOR CHEIE</h2>
                <p>
                  <strong>Ce informații personale procesăm?</strong> Atunci când vizitați, utilizați sau navigați prin Serviciile noastre, putem procesa informații personale în funcție de modul în care interacționați cu noi.
                </p>
                <p>
                  <strong>Procesăm informații sensibile?</strong> Nu procesăm informații personale sensibile.
                </p>
                <p>
                  <strong>Colectăm informații de la terți?</strong> Putem colecta informații din baze de date publice, parteneri de marketing, platforme de social media și alte surse externe.
                </p>
                
                <hr />

                <h2>1. CE INFORMAȚII COLECTĂM?</h2>
                <h3>Informații personale pe care ni le divulgați</h3>
                <p>Colectăm informații personale pe care ni le furnizați voluntar atunci când vă înregistrați pentru Servicii. Acestea pot include:</p>
                <ul>
                  <li>Nume</li>
                  <li>Adrese de email</li>
                  <li>Nume de utilizator</li>
                  <li>Parole</li>
                  <li>Date de autentificare</li>
                </ul>

                <h3>Informații colectate automat</h3>
                <p>Colectăm automat anumite informații (adresa IP, tipul de browser, dispozitiv) atunci când vizitați Serviciile noastre. Acestea sunt necesare pentru securitatea și funcționarea site-ului.</p>

                <h2>2. CUM PROCESĂM INFORMAȚIILE DVS.?</h2>
                <p>Procesăm informațiile pentru a furniza și îmbunătăți Serviciile, pentru a comunica cu dvs., pentru securitate și prevenirea fraudelor și pentru a respecta legea.</p>

                <h2>3. TEMEIURI LEGALE</h2>
                <p>Procesăm informațiile dvs. personale doar atunci când avem un motiv legal valid (consimțământ, obligație contractuală, obligație legală sau interes legitim).</p>

                <h2>4. CU CINE PARTAJĂM INFORMAȚIILE?</h2>
                <p>Putem partaja datele cu furnizori de servicii (hosting, analize date, stocare cloud) care lucrează în numele nostru.</p>

                <h2>5. COOKIE-URI</h2>
                <p>Utilizăm cookie-uri pentru a îmbunătăți experiența. Vedeți <Link href="/cookies">Politica de Cookie-uri</Link>.</p>

                <h2>6. LOGARE SOCIAL MEDIA</h2>
                <p>Dacă alegeți să vă înregistrați folosind Facebook sau alte rețele sociale, vom primi informații de profil de la aceștia.</p>

                <h2>7. TRANSFER INTERNAȚIONAL</h2>
                <p>Serverele noastre pot fi localizate în SUA, Germania și UK (FIREBASE). Luăm măsuri pentru a proteja datele transferate.</p>

                <h2>8. PĂSTRAREA DATELOR</h2>
                <p>Păstrăm informațiile atâta timp cât aveți un cont la noi sau cât este necesar legal.</p>

                <h2>9. SECURITATE</h2>
                <p>Am implementat măsuri de securitate tehnice și organizaționale pentru a proteja datele dvs.</p>

                <h2>10. DREPTURILE DVS.</h2>
                <p>Aveți dreptul de a accesa, rectifica sau șterge datele dvs. personale. Puteți face acest lucru din setările contului sau contactându-ne.</p>

                <h2>11. ACTUALIZĂRI</h2>
                <p>Vom actualiza această notificare pe măsură ce este necesar pentru a rămâne în conformitate cu legile relevante.</p>

                <h2>12. CONTACT</h2>
                <p>Pentru întrebări, ne puteți contacta la <a href="mailto:spyderend0@gmail.com">spyderend0@gmail.com</a></p>
                <h2>13. ȘTERGEREA DATELOR</h2>
                <p>Pentru a revizui, actualiza sau șterge datele pe care le colectăm, vă rugăm să vizitați: <a href="https://invatam-impreuna.vercel.app/contact">https://invatam-impreuna.vercel.app/contact</a></p>
              </>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}