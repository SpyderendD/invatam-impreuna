'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Cookie, Globe } from 'lucide-react';

export default function CookiePolicyPage() {
  const [language, setLanguage] = useState<'ro' | 'en'>('en'); // Default engleză (cum e textul original)

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
                <Cookie className="w-8 h-8" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground font-lora">
                {language === 'en' ? 'COOKIE POLICY' : 'POLITICA DE COOKIES'}
              </h1>
            </div>
            <p className="text-muted-foreground">
              {language === 'en' ? 'Last updated December 18, 2025' : 'Ultima actualizare: 18 Decembrie 2025'}
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

        {/* Content Wrapper with Animation */}
        <AnimatePresence mode='wait'>
          <motion.div 
            key={language} // Cheia forțează re-randarea animației la schimbarea limbii
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
                <p>
                  This Cookie Policy explains how <strong>Învățăm Împreună</strong> (&quot;<strong>Company</strong>,&quot; &quot;<strong>we</strong>,&quot; &quot;<strong>us</strong>,&quot; and &quot;<strong>our</strong>&quot;) uses cookies and similar technologies to recognize you when you visit our website at <a href="https://invatam-impreuna.vercel.app">https://invatam-impreuna.vercel.app</a> (&quot;<strong>Website</strong>&quot;). It explains what these technologies are and why we use them, as well as your rights to control our use of them.
                </p>
                <p>
                  In some cases we may use cookies to collect personal information, or that becomes personal information if we combine it with other information.
                </p>

                <h2 id="what-are-cookies">What are cookies?</h2>
                <p>
                  Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
                </p>
                <p>
                  Cookies set by the website owner (in this case, Învățăm Împreună) are called &quot;first-party cookies.&quot; Cookies set by parties other than the website owner are called &quot;third-party cookies.&quot; Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics). The parties that set these third-party cookies can recognize your computer both when it visits the website in question and also when it visits certain other websites.
                </p>

                <h2 id="why-cookies">Why do we use cookies?</h2>
                <p>
                  We use first- and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate, and we refer to these as &quot;essential&quot; or &quot;strictly necessary&quot; cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Online Properties. Third parties serve cookies through our Website for advertising, analytics, and other purposes. This is described in more detail below.
                </p>

                <h2 id="control-cookies">How can I control cookies?</h2>
                <p>
                  You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Manager. The Cookie Consent Manager allows you to select which categories of cookies you accept or reject. Essential cookies cannot be rejected as they are strictly necessary to provide you with services.
                </p>
                <p>
                  The specific types of first- and third-party cookies served through our Website and the purposes they perform are described in the table below:
                </p>

                {/* TABLE EN */}
                <h3>Performance and functionality cookies:</h3>
                <div className="overflow-x-auto border border-border rounded-lg mb-8 not-prose">
                  <table className="min-w-full text-sm text-left">
                    <tbody className="divide-y divide-border">
                      <tr>
                        <th className="bg-muted/50 p-3 font-semibold w-32 text-foreground">Name:</th>
                        <td className="p-3 font-mono text-primary">rc::h</td>
                      </tr>
                      <tr>
                        <th className="bg-muted/50 p-3 font-semibold text-foreground">Provider:</th>
                        <td className="p-3 text-muted-foreground">www.google.com</td>
                      </tr>
                      <tr>
                        <th className="bg-muted/50 p-3 font-semibold text-foreground">Type:</th>
                        <td className="p-3 text-muted-foreground">html_local_storage</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3>Analytics and customization cookies:</h3>
                <div className="overflow-x-auto border border-border rounded-lg mb-8 not-prose">
                  <table className="min-w-full text-sm text-left">
                    <tbody className="divide-y divide-border">
                      <tr>
                        <th className="bg-muted/50 p-3 font-semibold w-32 text-foreground">Name:</th>
                        <td className="p-3 font-mono text-primary">_ga</td>
                      </tr>
                      <tr>
                        <th className="bg-muted/50 p-3 font-semibold text-foreground">Purpose:</th>
                        <td className="p-3 text-muted-foreground">Records a particular ID used to come up with data about website usage by the user</td>
                      </tr>
                      <tr>
                        <th className="bg-muted/50 p-3 font-semibold text-foreground">Provider:</th>
                        <td className="p-3 text-muted-foreground">.invatam-impreuna.vercel.app</td>
                      </tr>
                      <tr><td colSpan={2} className="bg-background h-2 border-none"></td></tr>
                      <tr className="border-t border-border">
                        <th className="bg-muted/50 p-3 font-semibold text-foreground">Name:</th>
                        <td className="p-3 font-mono text-primary">themePreference</td>
                      </tr>
                      <tr>
                        <th className="bg-muted/50 p-3 font-semibold text-foreground">Purpose:</th>
                        <td className="p-3 text-muted-foreground">Stores user theme preference (dark/light mode).</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h2 id="browser-control">How can I control cookies on my browser?</h2>
                <p>
                  As the means by which you can refuse cookies through your web browser controls vary from browser to browser, you should visit your browser&apos;s help menu for more information.
                </p>

                <h2 id="more-info">Where can I get further information?</h2>
                <p>
                  If you have any questions about our use of cookies or other technologies, please contact us at: <a href="mailto:spyderend0@gmail.com">spyderend0@gmail.com</a>
                </p>
              </>
            ) : (
              // ================= ROMANIAN CONTENT =================
              <>
                <p>
                  Această Politică de Cookie-uri explică modul în care <strong>Învățăm Împreună</strong> (&quot;<strong>Compania</strong>,&quot; &quot;<strong>noi</strong>,&quot;) utilizează cookie-uri și tehnologii similare pentru a vă recunoaște atunci când vizitați site-ul nostru la <a href="https://invatam-impreuna.vercel.app">https://invatam-impreuna.vercel.app</a> (&quot;<strong>Website-ul</strong>&quot;). Explică ce sunt aceste tehnologii și de ce le folosim, precum și drepturile dvs. de a controla utilizarea lor.
                </p>

                <h2 id="ce-sunt-cookie">Ce sunt cookie-urile?</h2>
                <p>
                  Cookie-urile sunt fișiere mici de date care sunt plasate pe computerul sau dispozitivul dvs. mobil atunci când vizitați un site web. Cookie-urile sunt utilizate pe scară largă de proprietarii de site-uri web pentru a face ca site-urile lor să funcționeze, sau să funcționeze mai eficient, precum și pentru a furniza informații de raportare.
                </p>
                <p>
                  Cookie-urile setate de proprietarul site-ului (în acest caz, Învățăm Împreună) se numesc &quot;cookie-uri first-party&quot;. Cookie-urile setate de alte părți decât proprietarul site-ului se numesc &quot;cookie-uri third-party&quot;. Cookie-urile terțe permit furnizarea de caracteristici sau funcționalități terțe pe sau prin intermediul site-ului web (de exemplu, publicitate, conținut interactiv și analize).
                </p>

                <h2 id="de-ce-cookie">De ce folosim cookie-uri?</h2>
                <p>
                  Folosim cookie-uri first-party și third-party din mai multe motive. Unele cookie-uri sunt necesare din motive tehnice pentru ca site-ul nostru să funcționeze, iar noi ne referim la acestea ca fiind cookie-uri &quot;esențiale&quot; sau &quot;strict necesare&quot;. Alte cookie-uri ne permit, de asemenea, să urmărim și să vizăm interesele utilizatorilor noștri pentru a îmbunătăți experiența pe proprietățile noastre online.
                </p>

                <h2 id="control-cookie">Cum pot controla cookie-urile?</h2>
                <p>
                  Aveți dreptul de a decide dacă acceptați sau respingeți cookie-urile. Vă puteți exercita drepturile privind cookie-urile setând preferințele în browserul dumneavoastră. Cookie-urile esențiale nu pot fi respinse, deoarece sunt strict necesare pentru a vă oferi servicii.
                </p>

                {/* TABLE RO */}
                <h3>Cookie-uri de performanță și funcționalitate:</h3>
                <div className="overflow-x-auto border border-border rounded-lg mb-8 not-prose">
                  <table className="min-w-full text-sm text-left">
                    <tbody className="divide-y divide-border">
                      <tr>
                        <th className="bg-muted/50 p-3 font-semibold w-32 text-foreground">Nume:</th>
                        <td className="p-3 font-mono text-primary">rc::h</td>
                      </tr>
                      <tr>
                        <th className="bg-muted/50 p-3 font-semibold text-foreground">Furnizor:</th>
                        <td className="p-3 text-muted-foreground">www.google.com</td>
                      </tr>
                      <tr>
                        <th className="bg-muted/50 p-3 font-semibold text-foreground">Tip:</th>
                        <td className="p-3 text-muted-foreground">stocare locală HTML</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3>Cookie-uri de analiză și personalizare:</h3>
                <div className="overflow-x-auto border border-border rounded-lg mb-8 not-prose">
                  <table className="min-w-full text-sm text-left">
                    <tbody className="divide-y divide-border">
                      <tr>
                        <th className="bg-muted/50 p-3 font-semibold w-32 text-foreground">Nume:</th>
                        <td className="p-3 font-mono text-primary">_ga</td>
                      </tr>
                      <tr>
                        <th className="bg-muted/50 p-3 font-semibold text-foreground">Scop:</th>
                        <td className="p-3 text-muted-foreground">Înregistrează un ID unic pentru a genera date statistice despre utilizarea site-ului.</td>
                      </tr>
                      <tr>
                        <th className="bg-muted/50 p-3 font-semibold text-foreground">Furnizor:</th>
                        <td className="p-3 text-muted-foreground">.invatam-impreuna.vercel.app</td>
                      </tr>
                      <tr><td colSpan={2} className="bg-background h-2 border-none"></td></tr>
                      <tr className="border-t border-border">
                        <th className="bg-muted/50 p-3 font-semibold text-foreground">Nume:</th>
                        <td className="p-3 font-mono text-primary">themePreference</td>
                      </tr>
                      <tr>
                        <th className="bg-muted/50 p-3 font-semibold text-foreground">Scop:</th>
                        <td className="p-3 text-muted-foreground">Stochează preferința utilizatorului pentru tema site-ului (întunecat/luminos).</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h2 id="control-browser">Cum pot controla cookie-urile din browser?</h2>
                <p>
                  Deoarece mijloacele prin care puteți refuza cookie-urile prin intermediul controalelor browserului web variază de la un browser la altul, ar trebui să vizitați meniul de ajutor al browserului dvs. pentru mai multe informații.
                </p>

                <h2 id="info-suplimentare">Unde pot obține informații suplimentare?</h2>
                <p>
                  Dacă aveți întrebări despre utilizarea cookie-urilor sau a altor tehnologii, vă rugăm să ne trimiteți un e-mail la: <a href="mailto:spyderend0@gmail.com">spyderend0@gmail.com</a>
                </p>
              </>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}