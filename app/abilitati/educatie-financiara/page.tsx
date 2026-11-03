'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ArrowRight,
  TrendingUp, 
  Wallet, 
  PiggyBank, 
  Calculator, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles, 
  Coins, 
  Lightbulb, 
  Percent, 
  ShieldCheck, 
  Ban, 
  BookOpen, 
  ExternalLink, 
  Search, 
  PlayCircle, 
  Building2, 
  AlertTriangle,
  Scale,
  Compass,
  Zap,
  HelpCircle,
  Clock,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// ==========================================
// GLOSAR DE TERMENI FINANCIARI
// ==========================================
const GLOSSARY_TERMS = [
  {
    term: 'ETF (Exchange Traded Fund)',
    cat: 'Investiții',
    def: 'Un coș care conține sute sau mii de acțiuni simultan. În loc să cumperi o singură companie (risc mare), cumperi o bucățică din întreaga economie mondială (ex: S&P 500, VWCE).'
  },
  {
    term: 'Dobândă Compusă',
    cat: 'Fundamente',
    def: 'Efectul de „bulgăre de zăpadă”. Câștigi dobândă nu doar la banii depuși de tine, ci și la dobânda acumulată anterior în anii trecuți.'
  },
  {
    term: 'DAE (Dobânda Anuală Efectivă)',
    cat: 'Credite',
    def: 'Costul REAL total al unui împrumut. Include dobânda de bază plus toate comisioanele ascunse de administrare și dosar. Cu cât DAE e mai mare, cu atât te costă mai mult creditul.'
  },
  {
    term: 'Titluri de Stat (Tezaur / Fidelis)',
    cat: 'Siguranță',
    def: 'Împrumuți bani statului român pe o perioadă fixă (1-5 ani). În schimb, statul îți garantează o dobândă anuală fixă, 100% neimpozabilă.'
  },
  {
    term: 'Dividende',
    cat: 'Investiții',
    def: 'Partea din profitul net al unei companii pe care aceasta alege să o distribuie acționarilor săi. Sunt o sursă clasică de venit pasiv.'
  },
  {
    term: 'Inflație',
    cat: 'Economie',
    def: 'Ritmul în care cresc prețurile în timp. O inflație de 8% înseamnă că lucrurile care costau 100 lei anul trecut te costă acum 108 lei.'
  },
  {
    term: 'IFN (Instituție Financiară Nebancară)',
    cat: 'Avertisment',
    def: 'Firme de împrumuturi rapide („bani până la salariu”). Au adesea dobânzi astronomice (DAE de 200% - 2000%). Trebuie evitate categoric.'
  },
  {
    term: 'Fond de Urgență',
    cat: 'Securitate',
    def: 'O sumă de bani lichizi (3-6 luni de cheltuieli) păstrată exclusiv pentru evenimente critice neprevăzute, separată de contul curent.'
  },
  {
    term: 'Active vs. Pasive',
    cat: 'Mindset',
    def: 'Activele îți aduc bani în buzunar în timp (investiții, proiecte). Pasivele îți scot constant bani din buzunar (haine scumpe pe datorie, mașini costisitoare).'
  },
  {
    term: 'Lichiditate',
    cat: 'Fundamente',
    def: 'Cât de repede poți transforma un bun în bani gheață fără să pierzi din valoarea lui. Banii pe card sunt ultra-lichizi; o casă are lichiditate mică.'
  }
];

export default function EducatieFinanciaraPage() {
  // ==========================================
  // 1. CALCULATOR DOBÂNDĂ COMPUSĂ
  // ==========================================
  const [monthlyDeposit, setMonthlyDeposit] = useState<number>(150);
  const [years, setYears] = useState<number>(15);
  const [annualReturn, setAnnualReturn] = useState<number>(8);

  const compoundResult = useMemo(() => {
    const monthlyRate = annualReturn / 100 / 12;
    const months = years * 12;
    const totalInvested = monthlyDeposit * months;
    
    let futureValue = 0;
    if (monthlyRate > 0) {
      futureValue = monthlyDeposit * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    } else {
      futureValue = totalInvested;
    }

    const interestEarned = Math.max(0, futureValue - totalInvested);

    return {
      totalInvested: Math.round(totalInvested),
      interestEarned: Math.round(interestEarned),
      futureValue: Math.round(futureValue),
    };
  }, [monthlyDeposit, years, annualReturn]);

  // ==========================================
  // 2. CALCULATOR REGULA 50 / 30 / 20
  // ==========================================
  const [income, setIncome] = useState<number>(600);

  // ==========================================
  // 3. CALCULATOR SALARIU BRUT -> NET (ROMÂNIA)
  // ==========================================
  const [grossSalary, setGrossSalary] = useState<number>(4000);
  
  const taxBreakdown = useMemo(() => {
    const cas = Math.round(grossSalary * 0.25); // Pensii 25%
    const cass = Math.round(grossSalary * 0.10); // Sănătate 10%
    const taxableBase = Math.max(0, grossSalary - cas - cass);
    const tax = Math.round(taxableBase * 0.10); // Impozit pe venit 10%
    const net = grossSalary - cas - cass - tax;
    const totalTaxes = cas + cass + tax;

    return { cas, cass, tax, net, totalTaxes };
  }, [grossSalary]);

  // ==========================================
  // 4. JOCUL DE DECIZII (SCENARII INTERACTIVE)
  // ==========================================
  const [selectedScenario, setSelectedScenario] = useState<number>(0);

  const SCENARIOS = [
    {
      title: 'Scenariul 1: Ai primit 2.000 lei la majorat',
      options: [
        {
          label: 'A) Dai avans pentru cel mai nou telefon în rate pe 2 ani',
          outcome: 'Telefonul își pierde 40% din valoare în primul an. Plătești rate de 180 lei/lună + dobânzi. Peste 2 ani telefonul valorează 900 lei, iar tu ai cheltuit 4.300 lei.',
          type: 'danger'
        },
        {
          label: 'B) Îi lași în contul curent să cheltui când ieși cu prietenii',
          outcome: 'Fără un plan clar, banii se evaporă pe ieșiri mici și sucuri în 2-3 luni. Nu ai economisit nimic, iar inflația a devalorizat ce a mai rămas.',
          type: 'warning'
        },
        {
          label: 'C) Pui 1.000 lei fond de urgență și 1.000 lei într-un ETF cu 8% randament',
          outcome: 'Ești protejat dacă ți se strică laptopul de școală. Ceilalți 1.000 lei încep să lucreze. La 30 de ani, acea mică decizie reprezintă startul independenței tale financiare!',
          type: 'success'
        }
      ]
    },
    {
      title: 'Scenariul 2: Un coleg îți propune o „oportunitate crypto cu 30% pe lună”',
      options: [
        {
          label: 'A) Bagi toți banii economisiți pentru că arată grafice impresionante pe Instagram',
          outcome: 'Schema funcționează 2 luni (plătind primii oameni cu banii noilor veniți), apoi platforma se închide brusc. Ai pierdut 100% din bani. Este o schemă Ponzi clasică.',
          type: 'danger'
        },
        {
          label: 'B) Refuzi și îi explici că dacă cineva avea o metodă de 30%/lună, era cel mai bogat om din lume',
          outcome: 'Felicitări! Ai demonstrat gândire critică. O dobândă anuală realistă pe piețe internaționale este 7-10% pe an, nu pe lună. Ți-ai salvat economiile.',
          type: 'success'
        }
      ]
    }
  ];

  // ==========================================
  // 5. CĂUTARE ÎN GLOSAR
  // ==========================================
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredGlossary = useMemo(() => {
    if (!searchTerm.trim()) return GLOSSARY_TERMS;
    const term = searchTerm.toLowerCase();
    return GLOSSARY_TERMS.filter(
      item => item.term.toLowerCase().includes(term) || item.def.toLowerCase().includes(term) || item.cat.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground font-sans selection:bg-emerald-500/20 selection:text-emerald-400">
      
      {/* Background Lights */}
      <div className="fixed inset-0 -z-50 opacity-25 pointer-events-none transform-gpu overflow-hidden">
        <div 
          className="absolute left-1/2 -top-24 h-[650px] w-[650px] -translate-x-1/2 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%)'
          }}
        />
        <div 
          className="absolute right-0 top-1/3 h-[500px] w-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.16) 0%, transparent 70%)'
          }}
        />
        <div className="absolute inset-0 [background-image:linear-gradient(to_right,#8080800c_1px,transparent_1px),linear-gradient(to_bottom,#8080800c_1px,transparent_1px)] [background-size:44px_44px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 pt-10 pb-28 max-w-6xl">
        
        {/* NAVIGARE ÎNAPOI */}
        <div className="mb-10">
          <Button asChild variant="ghost" size="sm" className="rounded-full hover:bg-muted/40 text-muted-foreground hover:text-foreground">
            <Link href="/#skills">
              <ArrowLeft className="mr-2 w-4 h-4" /> Înapoi la Pagina Principală
            </Link>
          </Button>
        </div>

        {/* HERO TITLE */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md shadow-sm mb-6">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] font-black uppercase tracking-[0.35em] text-emerald-400">
              Unitate Completă de Studiu
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[0.92] mb-6">
            Gândește Banii <br />
            <span className="italic bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Înainte Să-i Cheltui.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-muted-foreground leading-relaxed font-normal">
            Banii nu sunt doar o hârtie pe care o dai la magazin, ci un mecanism de libertate. 
            Acesta este ghidul complet, onest și nefiltrat: de la cum funcționează salariul și taxele în România, până la dobânda compusă, investiții pasive și evitarea capcanelor în care pică 90% din tineri.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <span className="px-3 py-1.5 rounded-xl border border-border/70 bg-card/60">3 Calculatoare Interactive</span>
            <span className="px-3 py-1.5 rounded-xl border border-border/70 bg-card/60">15+ Resurse Externe Recomandate</span>
            <span className="px-3 py-1.5 rounded-xl border border-border/70 bg-card/60">Dicționar Financiar A-Z</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CUPRINS RAPID (QUICK JUMP) */}
        {/* ========================================================================= */}
        <div className="mb-20 p-6 sm:p-8 rounded-[2.5rem] border border-border/70 bg-card/75 backdrop-blur-md">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400 mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4" /> Cuprinsul Modulului
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-semibold">
            <a href="#dobanda-compusa" className="p-3 rounded-xl bg-muted/20 border border-border/50 hover:border-emerald-500/40 hover:text-emerald-400 transition-colors block">
              1. Dobânda Compusă
            </a>
            <a href="#bugetare-50-30-20" className="p-3 rounded-xl bg-muted/20 border border-border/50 hover:border-emerald-500/40 hover:text-emerald-400 transition-colors block">
              2. Regula 50 / 30 / 20
            </a>
            <a href="#brut-vs-net" className="p-3 rounded-xl bg-muted/20 border border-border/50 hover:border-emerald-500/40 hover:text-emerald-400 transition-colors block">
              3. Salariu Brut vs. Net
            </a>
            <a href="#investitii-incepatori" className="p-3 rounded-xl bg-muted/20 border border-border/50 hover:border-emerald-500/40 hover:text-emerald-400 transition-colors block">
              4. Cum Investești De La 0
            </a>
            <a href="#tepe-si-scamuri" className="p-3 rounded-xl bg-muted/20 border border-border/50 hover:border-rose-500/40 hover:text-rose-400 transition-colors block">
              5. Capcane & Scam-uri
            </a>
            <a href="#decizii-interactive" className="p-3 rounded-xl bg-muted/20 border border-border/50 hover:border-emerald-500/40 hover:text-emerald-400 transition-colors block">
              6. Simulator de Decizii
            </a>
            <a href="#hub-resurse" className="p-3 rounded-xl bg-muted/20 border border-border/50 hover:border-emerald-500/40 hover:text-emerald-400 transition-colors block">
              7. Hub Resurse (Cărți & YouTube)
            </a>
            <a href="#dictionar-financiar" className="p-3 rounded-xl bg-muted/20 border border-border/50 hover:border-emerald-500/40 hover:text-emerald-400 transition-colors block">
              8. Dicționar Financiar
            </a>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECȚIUNEA 1: DOBÂNDA COMPUSĂ + CALCULATOR */}
        {/* ========================================================================= */}
        <section id="dobanda-compusa" className="mb-24 p-8 sm:p-12 rounded-[3.5rem] border border-emerald-500/30 bg-gradient-to-b from-card/90 via-card/60 to-emerald-950/15 backdrop-blur-md shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none text-emerald-500">
            <Coins size={200} />
          </div>

          <div className="max-w-2xl mb-10">
            <span className="text-xs font-black uppercase tracking-[0.4em] text-emerald-400">Capitolul 1 • Matematica Bogăției</span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight mt-2 mb-3">
              Dobânda Compusă: Secretul Celor Ce Încep Devreme
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Albert Einstein numea dobânda compusă „a opta minune a lumii”. Dacă investești regulat, banii produși din dobândă încep să producă și ei dobândă. 
              Trage de cursoare și vezi cum o sumă mică lunară devine o avere:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Controale */}
            <div className="lg:col-span-6 space-y-6">
              
              <div className="p-5 rounded-2xl border border-border/60 bg-muted/20">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Depui lunar
                  </label>
                  <span className="text-xl font-black text-emerald-400">{monthlyDeposit} lei</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="1000" 
                  step="25" 
                  value={monthlyDeposit} 
                  onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>50 lei</span>
                  <span>500 lei</span>
                  <span>1000 lei</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-border/60 bg-muted/20">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Orizont de timp
                  </label>
                  <span className="text-xl font-black text-cyan-400">{years} ani</span>
                </div>
                <input 
                  type="range" 
                  min="3" 
                  max="40" 
                  step="1" 
                  value={years} 
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>3 ani</span>
                  <span>20 ani</span>
                  <span>40 ani</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-border/60 bg-muted/20">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Randament anual estimat (Media istorică a pieței)
                  </label>
                  <span className="text-xl font-black text-foreground">{annualReturn}% / an</span>
                </div>
                <input 
                  type="range" 
                  min="4" 
                  max="14" 
                  step="0.5" 
                  value={annualReturn} 
                  onChange={(e) => setAnnualReturn(Number(e.target.value))}
                  className="w-full accent-foreground cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>Conservator (4%)</span>
                  <span>Istoric S&P 500 (8-10%)</span>
                  <span>Agresiv (14%)</span>
                </div>
              </div>

            </div>

            {/* Rezultate */}
            <div className="lg:col-span-6 p-8 rounded-3xl border border-emerald-500/30 bg-card/90 shadow-xl space-y-6">
              <div>
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                  Valoare Totală Acumulată
                </span>
                <p className="text-4xl sm:text-6xl font-black tracking-tight text-emerald-400 mt-2">
                  {compoundResult.futureValue.toLocaleString('ro-RO')} lei
                </p>
              </div>

              <div className="pt-4 border-t border-border/40 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                    Bani depuși de tine
                  </span>
                  <span className="text-xl font-black text-foreground">
                    {compoundResult.totalInvested.toLocaleString('ro-RO')} lei
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">
                    Bani aduși de dobândă
                  </span>
                  <span className="text-xl font-black text-emerald-400">
                    +{compoundResult.interestEarned.toLocaleString('ro-RO')} lei
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 leading-relaxed">
                <strong>Comparația reală:</strong> Ana începe la 16 ani punând 100 lei/lună până la 26 de ani (apoi se oprește). Mihai începe abia la 30 de ani punând 200 lei/lună până la 50 de ani. Deși Mihai a depus de 3 ori mai mulți bani din buzunar, Ana va avea mai mulți bani la pensie datorită anilor în care dobânda a lucrat nestingherită!
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECȚIUNEA 2: REGULA 50 / 30 / 20 */}
        {/* ========================================================================= */}
        <section id="bugetare-50-30-20" className="mb-24 p-8 sm:p-12 rounded-[3.5rem] border border-border/80 bg-card/85 backdrop-blur-md shadow-xl">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-black uppercase tracking-[0.4em] text-cyan-400">Capitolul 2 • Organizare</span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight mt-2 mb-3">
              Regula de Aur 50 / 30 / 20
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Cea mai ușoară formulă de buget din lume. Indiferent că ai 300 de lei alocație sau un salariu de 5.000 de lei, dacă împarți banii așa, nu vei fi niciodată falit:
            </p>
          </div>

          <div className="mb-8 max-w-md">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
              Venitul tău lunar (alocație, bursă, job, cadouri):
            </label>
            <div className="flex items-center gap-3">
              <input 
                type="number"
                value={income}
                onChange={(e) => setIncome(Math.max(0, Number(e.target.value)))}
                className="w-full px-5 py-3 rounded-2xl bg-muted/30 border border-border/70 text-xl font-black text-foreground focus:outline-none focus:border-cyan-500"
              />
              <span className="text-lg font-black text-muted-foreground">lei</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-3xl border border-border/60 bg-muted/20 space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-blue-400">50% • Nevoi Reale</span>
              <p className="text-3xl font-black text-foreground">{Math.round(income * 0.5)} lei</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Mâncare, cartelă telefon, abonament transport, haine strict necesare. Lucrurile fără de care nu poți funcționa zi de zi.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-border/60 bg-muted/20 space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-amber-400">30% • Dorințe & Distracție</span>
              <p className="text-3xl font-black text-foreground">{Math.round(income * 0.3)} lei</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Ieșiri la cafea/film cu prietenii, un joc pe calculator, hobby-uri. Bani pe care îi cheltui pentru sufletul tău, fără vinovăție.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-emerald-500/40 bg-emerald-500/5 space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400">20% • Viitorul Tău</span>
              <p className="text-3xl font-black text-emerald-400">{Math.round(income * 0.2)} lei</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Bani pentru fondul de urgență și investiții. Aceștia sunt banii care îți vor cumpăra libertatea peste câțiva ani.
              </p>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECȚIUNEA 3: SALARIUL BRUT VS. NET ÎN ROMÂNIA */}
        {/* ========================================================================= */}
        <section id="brut-vs-net" className="mb-24 p-8 sm:p-12 rounded-[3.5rem] border border-border/80 bg-card/85 backdrop-blur-md shadow-xl">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-black uppercase tracking-[0.4em] text-amber-400">Capitolul 3 • Realitatea Pieței Muncii</span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight mt-2 mb-3">
              Ce Înseamnă Salariul Brut vs. Net?
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              La primul interviu de angajare, angajatorul îți va spune adesea salariul <strong>BRUT</strong>. 
              Însă banii care îți intră efectiv pe card sunt salariul <strong>NET</strong>. Iată de ce aproape 42% din munca ta merge către stat:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                Introdu un salariu BRUT ipotetic:
              </label>
              <div className="flex items-center gap-3">
                <input 
                  type="number"
                  step="200"
                  value={grossSalary}
                  onChange={(e) => setGrossSalary(Math.max(0, Number(e.target.value)))}
                  className="w-full px-5 py-3 rounded-2xl bg-muted/30 border border-border/70 text-2xl font-black text-foreground focus:outline-none focus:border-amber-500"
                />
                <span className="text-lg font-black text-muted-foreground">lei</span>
              </div>

              <div className="p-4 rounded-2xl bg-muted/20 border border-border/50 text-xs text-muted-foreground leading-relaxed">
                💡 <strong>Știai că?</strong> România are una dintre cele mai mari taxe pe munca mică și medie din Uniunea Europeană (aprox. 42.8% taxe totale angajat).
              </div>
            </div>

            <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl border border-amber-500/30 bg-muted/15 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-border/40">
                <span className="text-sm font-semibold text-muted-foreground">CAS (Pensii - 25%)</span>
                <span className="text-sm font-black text-rose-400">-{taxBreakdown.cas} lei</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border/40">
                <span className="text-sm font-semibold text-muted-foreground">CASS (Sănătate - 10%)</span>
                <span className="text-sm font-black text-rose-400">-{taxBreakdown.cass} lei</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border/40">
                <span className="text-sm font-semibold text-muted-foreground">Impozit pe venit (10%)</span>
                <span className="text-sm font-black text-rose-400">-{taxBreakdown.tax} lei</span>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <div>
                  <span className="text-xs uppercase font-bold text-muted-foreground block">Banii tăi în mână (NET)</span>
                  <span className="text-3xl sm:text-4xl font-black text-emerald-400">{taxBreakdown.net} lei</span>
                </div>
                <div className="text-right">
                  <span className="text-xs uppercase font-bold text-muted-foreground block">Total taxe oprite</span>
                  <span className="text-lg font-black text-rose-400">-{taxBreakdown.totalTaxes} lei</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECȚIUNEA 4: CUM INVESTEȘTI DE LA ZERO */}
        {/* ========================================================================= */}
        <section id="investitii-incepatori" className="mb-24">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-black uppercase tracking-[0.4em] text-emerald-400">Capitolul 4 • Creștere</span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight mt-2 mb-3">
              Cum Investești Legal Când Ai 18 Ani
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Nu ai nevoie de mii de euro. Poți începe cu 50 de lei. Iată pașii simpli și siguri pentru un începător:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-8 rounded-[2.5rem] border border-border/70 bg-card/80 backdrop-blur-sm space-y-4">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400 block">Nivelul 1 • Risc Minim</span>
              <h3 className="text-2xl font-black uppercase tracking-tight">Titluri de Stat Tezaur & Fidelis</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Împrumuți statul român. Primești 6-7% dobândă anuală fixă direct pe card sau prin Poșta Română. Banii sunt garantați 100% și nu plătești niciun leu impozit.
              </p>
              <div className="text-[11px] font-bold text-emerald-400">Recomandat pentru: Fondul de rezervă</div>
            </div>

            <div className="p-8 rounded-[2.5rem] border border-border/70 bg-card/80 backdrop-blur-sm space-y-4">
              <span className="text-xs font-black uppercase tracking-widest text-cyan-400 block">Nivelul 2 • Standardul Mondial</span>
              <h3 className="text-2xl font-black uppercase tracking-tight">ETF-uri Globale (ex: S&P 500 / All-World)</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Cumperi o fracțiune din cele mai mari 500 de companii din lume (Apple, Microsoft, Google, etc.). 
                Dacă economia mondială crește pe termen lung, și banii tăi cresc.
              </p>
              <div className="text-[11px] font-bold text-cyan-400">Recomandat pentru: Orizont de peste 5-10 ani</div>
            </div>

            <div className="p-8 rounded-[2.5rem] border border-border/70 bg-card/80 backdrop-blur-sm space-y-4">
              <span className="text-xs font-black uppercase tracking-widest text-blue-400 block">Nivelul 3 • Local</span>
              <h3 className="text-2xl font-black uppercase tracking-tight">Bursa de Valori București (BVB)</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Investești în companii românești de top (Banca Transilvania, Hidroelectrica, OMV Petrom). Multe dintre ele plătesc dividende consistente an de an.
              </p>
              <div className="text-[11px] font-bold text-blue-400">Recomandat pentru: Diversificare locală</div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECȚIUNEA 5: ZONA ROȘIE (CAPCANE & SCAM-URI) */}
        {/* ========================================================================= */}
        <section id="tepe-si-scamuri" className="mb-24 p-8 sm:p-12 rounded-[3.5rem] border border-rose-500/30 bg-rose-950/15 backdrop-blur-md">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-black uppercase tracking-[0.4em] text-rose-400 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> Zona Roșie • Păcăleli Frecvente
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mt-2 mb-3">
              Cum Să Nu Fii Furat Pe Internet
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Banii se fac greu și se pierd într-o secundă. Ferește-te de aceste 3 industrii care trăiesc de pe urma naivității tinerilor:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-3xl bg-zinc-950/60 border border-rose-500/20 space-y-3">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <Ban className="w-4 h-4" /> Păcănele & Pariuri Sportive
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Toate jocurile de noroc au un algoritm integrat numit <strong>RTP (Return to Player)</strong> de aprox. 92-96%. 
                Asta înseamnă că la fiecare 100 de lei pariați, matematica îți garantează că vei pierde 4-8 lei pe termen lung. Casa câștigă întotdeauna.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-zinc-950/60 border border-rose-500/20 space-y-3">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <Ban className="w-4 h-4" /> Grupuri de „Semnale VIP” pe Telegram
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Persoane care închiriază mașini scumpe pentru video-uri pe TikTok și îți cer 50€ ca să-ți dea „ponturi garantate de trading”. 
                În realitate, profitul lor e abonamentul tău de 50€, nu tranzacțiile de pe bursă.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-zinc-950/60 border border-rose-500/20 space-y-3">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <Ban className="w-4 h-4" /> Credite Rapide / IFN-uri
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Reclamele care îți spun „ia 1.000 lei doar cu buletinul în 10 minute”. Dacă întârzii o săptămână cu plata, dobânda penalizatoare te poate duce la datorii de 5 ori mai mari decât suma împrumutată.
              </p>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECȚIUNEA 6: SIMULATOR DE DECIZII (JOCUL) */}
        {/* ========================================================================= */}
        <section id="decizii-interactive" className="mb-24 p-8 sm:p-12 rounded-[3.5rem] border border-border/80 bg-card/85 backdrop-blur-md">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-black uppercase tracking-[0.4em] text-emerald-400">Simulator Practic</span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight mt-2 mb-3">
              Ce Ai Face În Această Situație?
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Alege un scenariu și vezi consecințele directe ale deciziilor tale:
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-2">
              {SCENARIOS.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedScenario(idx)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedScenario === idx 
                      ? 'bg-emerald-500 text-black font-black' 
                      : 'bg-muted/40 text-muted-foreground hover:bg-muted'
                  }`}
                >
                  Scenariul {idx + 1}
                </button>
              ))}
            </div>

            <div className="p-6 rounded-3xl border border-border/60 bg-muted/15 space-y-4">
              <h3 className="text-lg sm:text-xl font-black text-foreground">
                {SCENARIOS[selectedScenario].title}
              </h3>

              <div className="space-y-3">
                {SCENARIOS[selectedScenario].options.map((opt, i) => (
                  <div key={i} className="p-4 rounded-2xl border border-border/60 bg-card/60 space-y-2">
                    <p className="text-sm font-bold text-foreground">{opt.label}</p>
                    <p className={`text-xs leading-relaxed ${
                      opt.type === 'danger' ? 'text-rose-400' : opt.type === 'warning' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      ➔ {opt.outcome}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECȚIUNEA 7: MARELE HUB DE RESURSE RECOMANDATE */}
        {/* ========================================================================= */}
        <section id="hub-resurse" className="mb-24">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-black uppercase tracking-[0.4em] text-emerald-400">Curatoriat De Încredere</span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight mt-2 mb-3">
              Unde Înveți Mai Departe (Cărți, Canale, Cursuri)
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Nu trebuie să ne crezi pe cuvânt. Iată cele mai bune resurse din România și internațional, selectate pentru calitate, fără reclame ascunse:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* CĂRȚI FUNDAMENTALE */}
            <div className="p-8 rounded-[3rem] border border-border/70 bg-card/80 backdrop-blur-md space-y-6">
              <div className="flex items-center gap-3 text-emerald-400">
                <BookOpen className="w-6 h-6" />
                <h3 className="text-xl font-black uppercase tracking-tight">Cărți Care Îți Schimbă Gândirea</h3>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl border border-border/50 bg-muted/15 space-y-1">
                  <span className="text-xs font-black uppercase text-foreground block">1. „Psihologia Banilor” – Morgan Housel</span>
                  <p className="text-xs text-muted-foreground">Cea mai bună carte despre cum comportamentul și emoțiile noastre contează mult mai mult decât matematica când vine vorba de bani.</p>
                </div>

                <div className="p-4 rounded-2xl border border-border/50 bg-muted/15 space-y-1">
                  <span className="text-xs font-black uppercase text-foreground block">2. „Cel Mai Bogat Om Din Babilon” – George S. Clason</span>
                  <p className="text-xs text-muted-foreground">O carte scurtă de povești simple cu reguli atemporale: plătește-te pe tine primul și pune fiecare ban să lucreze.</p>
                </div>

                <div className="p-4 rounded-2xl border border-border/50 bg-muted/15 space-y-1">
                  <span className="text-xs font-black uppercase text-foreground block">3. „Investitorul Inteligent” – Benjamin Graham</span>
                  <p className="text-xs text-muted-foreground">Biblia investițiilor pe valoare, recomandată constant de Warren Buffett (mai potrivită după ce ai înțeles bazele).</p>
                </div>
              </div>
            </div>

            {/* CANALE YOUTUBE & PODCASTURI */}
            <div className="p-8 rounded-[3rem] border border-border/70 bg-card/80 backdrop-blur-md space-y-6">
              <div className="flex items-center gap-3 text-cyan-400">
                <PlayCircle className="w-6 h-6" />
                <h3 className="text-xl font-black uppercase tracking-tight">Canale YouTube & Podcasturi Gratuite</h3>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl border border-border/50 bg-muted/15 space-y-1">
                  <span className="text-xs font-black uppercase text-foreground block">🇷🇴 Bani în Mișcare – Iancu Guda</span>
                  <p className="text-xs text-muted-foreground">Videoclipuri de 3-5 minute cu explicații super clare despre bugete, rate, inflație și investiții în România.</p>
                </div>

                <div className="p-4 rounded-2xl border border-border/50 bg-muted/15 space-y-1">
                  <span className="text-xs font-black uppercase text-foreground block">🇷🇴 Știința Banilor – Valentin Nedelcu</span>
                  <p className="text-xs text-muted-foreground">Ghiduri detaliate despre bursă, fonduri de pensii private (Pilonul 2 & 3), ETF-uri și independență financiară.</p>
                </div>

                <div className="p-4 rounded-2xl border border-border/50 bg-muted/15 space-y-1">
                  <span className="text-xs font-black uppercase text-foreground block">🌍 Ali Abdaal / Andrei Jikh (Internațional)</span>
                  <p className="text-xs text-muted-foreground">Perspective moderne despre productivitate, generare de venituri paralele (side hustles) și investiții pasive pe piețe globale.</p>
                </div>
              </div>
            </div>

            {/* CURSURI & PLATFORME OFICIALE */}
            <div className="p-8 rounded-[3rem] border border-border/70 bg-card/80 backdrop-blur-md space-y-6">
              <div className="flex items-center gap-3 text-blue-400">
                <Building2 className="w-6 h-6" />
                <h3 className="text-xl font-black uppercase tracking-tight">Platforme Oficiale & Educație Gratuită</h3>
              </div>

              <div className="space-y-3">
                <a href="https://www.bvb.ro" target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 rounded-2xl border border-border/50 bg-muted/15 hover:border-blue-400/50 transition-colors">
                  <div>
                    <span className="text-xs font-black uppercase text-foreground block">Bursa de Valori București (BVB)</span>
                    <span className="text-xs text-muted-foreground">Ghiduri oficiale și cursuri gratuite pentru primul investitor</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-blue-400 shrink-0" />
                </a>

                <a href="https://eduteca.asfromania.ro" target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 rounded-2xl border border-border/50 bg-muted/15 hover:border-blue-400/50 transition-colors">
                  <div>
                    <span className="text-xs font-black uppercase text-foreground block">ASF Eduteca (Autoritatea de Supraveghere)</span>
                    <span className="text-xs text-muted-foreground">Materiale oficiale de educație financiară pentru școli și licee</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-blue-400 shrink-0" />
                </a>

                <a href="https://www.khanacademy.org/college-careers-more/personal-finance" target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 rounded-2xl border border-border/50 bg-muted/15 hover:border-blue-400/50 transition-colors">
                  <div>
                    <span className="text-xs font-black uppercase text-foreground block">Khan Academy – Personal Finance</span>
                    <span className="text-xs text-muted-foreground">Curs video gratuit de la 0: taxe, credite, asigurări și investiții</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-blue-400 shrink-0" />
                </a>
              </div>
            </div>

            {/* UNELTE & BROKERI AUTORIZAȚI */}
            <div className="p-8 rounded-[3rem] border border-border/70 bg-card/80 backdrop-blur-md space-y-6">
              <div className="flex items-center gap-3 text-amber-400">
                <Scale className="w-6 h-6" />
                <h3 className="text-xl font-black uppercase tracking-tight">Instrumente & Brokeri Reglementați</h3>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl border border-border/50 bg-muted/15">
                  <span className="text-xs font-black uppercase text-foreground block">Brokeri cu reținere la sursă în România (1% - 3%)</span>
                  <p className="text-xs text-muted-foreground mt-1">Tradeville (pentru BVB și internațional) sau XTB. Sunt reglementați de ASF și nu trebuie să depui declarații complicate la ANAF pentru câștiguri.</p>
                </div>

                <div className="p-4 rounded-2xl border border-border/50 bg-muted/15">
                  <span className="text-xs font-black uppercase text-foreground block">JustETF.com</span>
                  <p className="text-xs text-muted-foreground mt-1">Cel mai mare motor de căutare gratuit din Europa pentru fonduri ETF. Vezi comisioanele și randamentele exacte.</p>
                </div>

                <div className="p-4 rounded-2xl border border-border/50 bg-muted/15">
                  <span className="text-xs font-black uppercase text-foreground block">Aplicații de Bugetare Zilnică</span>
                  <p className="text-xs text-muted-foreground mt-1">Spendee, Wallet by BudgetBakers sau un simplu Google Sheet. Important este să știi exact pe ce se duc banii.</p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECȚIUNEA 8: DICȚIONAR FINANCIAR INTERACTIV A-Z */}
        {/* ========================================================================= */}
        <section id="dictionar-financiar" className="mb-24 p-8 sm:p-12 rounded-[3.5rem] border border-border/80 bg-card/85 backdrop-blur-md shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.4em] text-emerald-400">Dicționarul Tău De Buzunar</span>
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight mt-2">Termeni Financiari Explicați Simplu</h2>
            </div>

            {/* Input Căutare */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Caută termen (ex: ETF, DAE)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-muted/30 border border-border/70 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGlossary.map((g, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-border/50 bg-muted/15 space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-base font-black uppercase tracking-tight text-foreground">{g.term}</h4>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{g.cat}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{g.def}</p>
              </div>
            ))}
          </div>

          {filteredGlossary.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">Nu am găsit niciun termen pentru căutarea ta.</p>
          )}
        </section>

        {/* ========================================================================= */}
        {/* SECȚIUNEA 9: PLANUL ÎN 5 PAȘI DE APLICAT AZI */}
        {/* ========================================================================= */}
        <section className="mb-20 p-8 sm:p-12 rounded-[3.5rem] border border-emerald-500/30 bg-gradient-to-r from-card/90 to-emerald-950/20 shadow-xl">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-black uppercase tracking-[0.4em] text-emerald-400">Ghid Practic Imediat</span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight mt-2">
              Ce Poți Face Chiar Astăzi:
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { step: '1', title: 'Notează cheltuielile', desc: 'Notează timp de 30 de zile fiecare leu cheltuit. Vei fi șocat unde dispar banii.' },
              { step: '2', title: 'Fond de 500 lei', desc: 'Pune deoparte 500 lei într-un plic sau cont separat. Nu te atinge de ei.' },
              { step: '3', title: 'Aplică 50/30/20', desc: 'Când primești alocația sau bani, pune primii 20% deoparte înainte să cheltui.' },
              { step: '4', title: 'Citește 1 carte', desc: 'Începe cu „Psihologia Banilor”. Îți va schimba complet modul în care iei decizii.' },
              { step: '5', title: 'Investește la 18 ani', desc: 'Deschide un cont la un broker autorizat și cumpără primul tău ETF global.' },
            ].map((p, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-border/50 bg-card/60 space-y-2">
                <span className="text-2xl font-black text-emerald-400">{p.step}.</span>
                <h4 className="text-sm font-black uppercase tracking-tight">{p.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA FINAL */}
        <div className="text-center p-10 rounded-[3rem] border border-border/70 bg-card/60 backdrop-blur-md space-y-4">
          <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">Continuă Să Înveți Inteligent</h3>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Educația financiară este doar una dintre abilitățile care îți asigură succesul în lumea reală. Explorează și restul materiilor și uneltelor noastre gratuite.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Button asChild size="lg" className="rounded-full px-8 text-sm font-black uppercase bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg">
              <Link href="/#skills">Explorează Alte Abilități <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}