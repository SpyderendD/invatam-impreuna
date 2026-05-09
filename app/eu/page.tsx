'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { 
  Code, Terminal, Globe, ChevronDown, Zap, Shield, BrainCircuit,
  Gamepad2, Cpu, ArrowRight, Heart, Feather, Sparkles, Cross, Music, Camera 
} from 'lucide-react';
import { ParticlesBackground } from '@/components/animations/ParticlesBackground';

// --- MATRIX RAIN EFFECT (ADAPTIV) ---
const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const chars = '01ABCXYZ†♥$</>'; 
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.ceil(columns)).fill(1);
    
    const draw = () => {
      // Dacă e light mode, fundalul șters e alb/transparent, dacă e dark e negru
      ctx.fillStyle = resolvedTheme === 'light' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Verdele de matrix (un pic mai închis pe light mode ca să se vadă)
      ctx.fillStyle = resolvedTheme === 'light' ? '#00cc33' : '#00ff41';
      ctx.font = `${fontSize}px monospace`;
      
      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };
    const interval = setInterval(draw, 33);
    return () => clearInterval(interval);
  }, [resolvedTheme]);

  return <canvas ref={canvasRef} className="absolute inset-0 opacity-20 pointer-events-none" />;
};

export default function PovesteaMeaPage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const [text, setText] = useState('');
  const fullText = "> Salut! Sunt Spyderend.";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-[#00ff41] selection:text-black font-mono transition-colors duration-500">
      <ParticlesBackground />
      {/* Bara de progres neon sus */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-[#00ff41] origin-left z-50 shadow-[0_0_20px_#00ff41]" style={{ scaleX }} />

      {/* ========================================== */}
      {/* 1. HERO SECTION */}
      {/* ========================================== */}
      <section className="relative h-screen flex flex-col items-center justify-center px-4 overflow-hidden border-b border-border">
        <MatrixRain />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00ff41] rounded-full blur-[200px] opacity-10 pointer-events-none animate-pulse" />

        <div className="z-10 text-center space-y-8 max-w-5xl relative">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-2 border border-[#00ff41]/50 bg-[#00ff41]/10 px-6 py-2 text-[#008822] dark:text-[#00ff41] font-bold text-sm tracking-[0.2em] uppercase backdrop-blur-md">
            <span className="w-2 h-2 bg-[#00ff41] animate-ping rounded-full"></span>
            PROFIL CREATOR
          </motion.div>

          <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-foreground glitch-text" data-text="MERA ALIN DAVID">
            MERA ALIN <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00cc33] dark:from-[#00ff41] to-emerald-600">DAVID</span>
          </h1>

          <div className="h-8 text-xl md:text-2xl text-[#00cc33] dark:text-[#00ff41] font-bold flex items-center justify-center">
            {text}<span className="animate-blink w-3 h-6 md:h-8 bg-[#00cc33] dark:bg-[#00ff41] ml-2 block"></span>
          </div>

          <p className="font-sans text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed border-l-4 border-[#00ff41] pl-6 text-left bg-muted/30 p-4 backdrop-blur-sm shadow-sm">
            Sunt un elev la profil economic cu o pasiune uriașă. Îmi place să construiesc lucruri utile, și încerc să găsesc un echilibru prin credință și disciplină. Mă ghidez după un principiu simplu: ce fac, fac bine.
          </p>

          <div className="pt-8 flex flex-col sm:flex-row gap-6 justify-center">
            <Button asChild size="lg" className="bg-[#00ff41] text-black hover:bg-[#00cc33] font-bold rounded-none px-10 h-14 shadow-[0_0_30px_rgba(0,255,65,0.3)] hover:scale-105 transition-all">
              <Link href="#viziune">CITEȘTE POVESTEA</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-border text-foreground hover:bg-muted font-bold rounded-none px-10 h-14 transition-colors">
              <Link href="/contact">CONTACTEAZĂ-MĂ</Link>
            </Button>
          </div>
        </div>

        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#00ff41] opacity-50">
          <ChevronDown className="w-12 h-12" />
        </motion.div>
      </section>

      {/* ========================================== */}
      {/* 2. POZA TA ȘI VIZIUNEA (SISTEMUL) */}
      {/* ========================================== */}
      <section id="viziune" className="py-32 px-6 relative max-w-7xl mx-auto border-b border-border">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* POZA TA CU EFECT DE SCANNER */}
          <div className="lg:col-span-5 relative group">
            <div className="absolute -inset-4 bg-[#00ff41]/20 blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <div className="relative aspect-[3/4] w-full overflow-hidden border-2 border-[#00ff41] bg-black shadow-[0_0_50px_rgba(0,255,65,0.1)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/images/EU.jpg" 
                alt="Mera Alin David" 
                className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              
              {/* Efect de Scanlines peste poză */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 bg-[size:100%_4px,3px_100%] pointer-events-none mix-blend-overlay"></div>
              
              {/* Badges UI pe poză */}
              <div className="absolute top-4 left-4 bg-[#00ff41] text-black px-3 py-1 text-[10px] font-black z-30 uppercase tracking-widest">LIVE_FEED</div>
              <div className="absolute bottom-4 right-4 text-[#00ff41] bg-black/50 px-2 py-1 text-[10px] font-mono z-30 font-bold tracking-tighter backdrop-blur-sm border border-[#00ff41]/30">ID: SPYDEREND_001</div>
            </div>
          </div>

          {/* TEXT ȘI CODUL VIEȚII */}
          <div className="lg:col-span-7 space-y-8">
            <motion.h2 
                initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="text-4xl md:text-5xl font-bold text-foreground tracking-tighter uppercase italic"
            >
              Logica din spatele <span className="text-[#00cc33] dark:text-[#00ff41]">Sistemului</span>
            </motion.h2>
            
            <p className="text-muted-foreground text-lg leading-relaxed font-sans border-l-2 border-border pl-6">
              Nu am vrut să fac doar un site. Am vrut să creez un refugiu digital pentru elevii care simt că materia îi copleșește. Sunt la profil economic, dar am învățat programare din dorința de a demonstra că educația de top trebuie să fie gratuită.
            </p>

            {/* BLOCUL DE COD AL VIEȚII (RĂMÂNE ÎNTUNECAT ȘI PE LIGHT MODE PENTRU STIL) */}
            <div className="bg-[#0a0a0a] border border-[#333] p-6 rounded-lg font-mono text-sm relative overflow-hidden group hover:border-[#00ff41]/50 transition-colors shadow-2xl">
               <div className="absolute top-0 right-0 p-2 text-[10px] text-[#00ff41] uppercase font-black bg-[#00ff41]/10">Life_Logic.ts</div>
               <div className="space-y-1.5 mt-2">
                 <p><span className="text-pink-500 font-bold">while</span> (<span className="text-blue-400">me</span>.<span className="text-yellow-400">isAlive</span>) {'{'}</p>
                 <p className="pl-6 text-gray-500 italic">{"// Indiferent de chef, disciplină bate motivația"}</p>
                 <p className="pl-6"><span className="text-pink-500 font-bold">if</span> (<span className="text-blue-400">me</span>.<span className="text-yellow-400">feelingLazy</span>) {'{'}</p>
                 <p className="pl-12 text-blue-400">me.<span className="text-[#00ff41]">workHarder</span>();</p>
                 <p className="pl-6">{'}'}</p>
                 <p className="pl-6 text-blue-400">me.<span className="text-[#00ff41]">trustGod</span>(); <span className="text-gray-500 italic">{"// Sursa puterii mele"}</span></p>
                 <p className="pl-6 text-blue-400">me.<span className="text-[#00ff41]">buildFuture</span>();</p>
                 <p>{'}'}</p>
               </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 font-sans text-[10px] font-bold uppercase tracking-widest">
               <div className="flex flex-col items-center gap-2 text-foreground bg-muted/50 p-3 border border-border rounded-lg shadow-sm"><Shield className="text-[#00cc33] dark:text-[#00ff41] w-5 h-5"/> Disciplină</div>
               <div className="flex flex-col items-center gap-2 text-foreground bg-muted/50 p-3 border border-border rounded-lg shadow-sm"><Cross className="text-blue-500 w-5 h-5"/> Credință</div>
               <div className="flex flex-col items-center gap-2 text-foreground bg-muted/50 p-3 border border-border rounded-lg shadow-sm"><Zap className="text-yellow-500 dark:text-yellow-400 w-5 h-5"/> Energie</div>
               <div className="flex flex-col items-center gap-2 text-foreground bg-muted/50 p-3 border border-border rounded-lg shadow-sm"><Cpu className="text-purple-500 w-5 h-5"/> Inovație</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 3. POVESTEA REALĂ & TERMINALUL */}
      {/* ========================================== */}
      <section className="py-32 px-6 relative bg-zinc-50 dark:bg-[#050505] border-b border-border transition-colors duration-500">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-8">
              <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                <span className="text-[#00cc33] dark:text-[#00ff41]">&gt;</span> De ce am <br/>
                făcut <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">acest site?</span>
              </h2>
              
              <div className="space-y-6 text-muted-foreground text-lg leading-relaxed font-sans">
                <p>
                  Sincer, totul a pornit dintr-o frustrare. În clasa a 8-a, când învățam pentru examen, nu găseam nicăieri resurse bune, gratuite și puse toate la un loc. Și da, sunt un pic &quot;zgârcit&quot; – nu cred că ar trebui să plătești pentru informația de bază.
                </p>
                <p className="border-l-2 border-indigo-500 pl-4 italic bg-indigo-500/5 p-4 rounded-r-lg text-foreground font-medium">
                  Așa că m-am gândit: dacă nu există, îl fac eu. Am învățat programare singur, cu ajutorul lui Dumnezeu. Au fost multe momente grele, dar am continuat.
                </p>
                <p>
                  Răbdarea și pacea pe care le simt când merg la biserică m-au ajutat să trec peste orice bug și orice noapte nedormită. Acest site este modul meu de a lăsa o amprentă de bunătate.
                </p>
              </div>
            </motion.div>

            {/* TERMINAL WINDOW (RĂMÂNE ÎNTUNECAT) */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#00ff41] to-blue-600 blur-2xl opacity-10 group-hover:opacity-30 transition-opacity duration-500"></div>
              
              <div className="relative bg-[#0a0a0a] border border-[#333] rounded-xl shadow-2xl overflow-hidden font-mono text-sm">
                <div className="bg-[#111] px-4 py-3 flex items-center gap-2 border-b border-[#333]">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="ml-4 text-gray-500 text-xs font-bold">bash - spyderend@server</span>
                </div>
                
                <div className="p-6 space-y-4 text-gray-300">
                  <div><span className="text-[#00ff41] font-bold">spyderend@MeraAlinDavid</span><span className="text-white">:</span><span className="text-blue-400">~/projects/invatam-impreuna</span>$ cat scopul_meu.txt</div>
                  <p className="text-white font-bold pb-2">Vreau să fac învățarea mai accesibilă și mai modernă pentru toți elevii.</p>
                  <div className="pl-4 border-l-2 border-gray-800 space-y-3">
                     <p className="flex items-center gap-2"><span className="text-[#00ff41]">✔</span> O platformă gratuită, din suflet.</p>
                     <p className="flex items-center gap-2"><span className="text-[#00ff41]">✔</span> Materie clară, fără &quot;umplutură&quot;.</p>
                     <p className="flex items-center gap-2"><span className="text-[#00ff41]">✔</span> Să las pe Dumnezeu să mă ghideze.</p>
                  </div>
                  <div className="pt-2"><span className="text-[#00ff41] font-bold">spyderend@MeraAlinDavid</span><span className="text-white">:</span><span className="text-blue-400">~/projects/invatam-impreuna</span>$ <span className="animate-pulse bg-white/80 w-2 h-4 inline-block align-middle"></span></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 4. AXA TIMPULUI (TIMELINE) */}
      {/* ========================================== */}
      <section className="py-32 px-6 bg-zinc-100 dark:bg-[#020202] relative overflow-hidden border-b border-border transition-colors duration-500">
        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-black text-center mb-24 uppercase tracking-tighter text-foreground">
            Cum am ajuns <span className="text-[#00cc33] dark:text-[#00ff41]">aici</span>
          </motion.h2>

          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#00cc33] dark:before:from-[#00ff41] before:via-indigo-500 before:to-transparent">
            
            {/* 2020 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-[#00cc33] dark:bg-[#00ff41] shadow-[0_0_15px_rgba(0,204,51,0.5)] dark:shadow-[0_0_15px_#00ff41] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10" />
              <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border border-border bg-card shadow-md hover:border-[#00cc33] dark:hover:border-[#00ff41] transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-bold text-xl text-foreground">Curiozitatea</div>
                  <time className="font-mono text-xs text-white font-bold bg-[#00cc33] dark:bg-[#00ff41] dark:text-black px-2 py-1 rounded-sm">2020 - 2023</time>
                </div>
                <div className="text-muted-foreground font-sans text-sm leading-relaxed">
                  Totul a început ca o joacă. M-am băgat pe servere de Minecraft, am încercat să înțeleg codul din spate și am început să experimentez cu scripturi simple.
                </div>
              </motion.div>
            </div>

            {/* 2024 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10" />
              <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border border-border bg-card shadow-md hover:border-blue-500 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-bold text-xl text-foreground">Proiectul</div>
                  <time className="font-mono text-xs text-white font-bold bg-blue-500 px-2 py-1 rounded-sm">Late 2024</time>
                </div>
                <div className="text-muted-foreground font-sans text-sm leading-relaxed">
                  Am decis să fac ceva concret. Am început să învăț HTML, CSS, JavaScript pentru a construi &quot;Învățăm Împreună&quot;. Am vrut să demonstrez că pot duce un proiect de la zero la capăt.
                </div>
              </motion.div>
            </div>

            {/* 2025 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10" />
              <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border border-border bg-card shadow-md hover:border-purple-500 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-bold text-xl text-foreground">Evoluția</div>
                  <time className="font-mono text-xs text-white font-bold bg-purple-500 px-2 py-1 rounded-sm">2025</time>
                </div>
                <div className="text-muted-foreground font-sans text-sm leading-relaxed">
                  Migrarea de pe Netlify pe Vercel. Trecerea la Next.js și React. A fost greu să învăț totul singur și să reconstruiesc platforma, dar am continuat să adaug funcționalități noi.
                </div>
              </motion.div>
            </div>

            {/* 2026 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10" />
              <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border border-border bg-card shadow-md hover:border-indigo-500 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-bold text-xl text-foreground">Prezent</div>
                  <time className="font-mono text-xs text-white font-bold bg-indigo-500 px-2 py-1 rounded-sm">2026</time>
                </div>
                <div className="text-muted-foreground font-sans text-sm leading-relaxed">
                  Acum mă străduiesc să fac platforma cât mai bună pentru elevi și profesori. Am învățat că perseverența e cheia și nu trebuie să te oprești din construit.
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 5. TECH STACK & VALUES GRID */}
      {/* ========================================== */}
      <section className="py-32 px-6 relative bg-zinc-50 dark:bg-[#050505] transition-colors duration-500">
        <div className="container mx-auto max-w-6xl">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-black text-center mb-16 uppercase tracking-tighter text-foreground">
            Ce Folosesc <span className="text-muted-foreground font-light lowercase font-mono">{'// my_stack'}</span>
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Next.js", icon: <Globe className="w-8 h-8"/>, color: "text-zinc-800 dark:text-white", border: "border-border hover:border-zinc-800 dark:hover:border-white" },
              { name: "React", icon: <Code className="w-8 h-8"/>, color: "text-blue-500 dark:text-[#61DAFB]", border: "border-border hover:border-blue-500" },
              { name: "Node JS", icon: <Feather className="w-8 h-8"/>, color: "text-emerald-600 dark:text-[#339933]", border: "border-border hover:border-emerald-600" },
              { name: "Vercel", icon: <Shield className="w-8 h-8"/>, color: "text-zinc-800 dark:text-white", border: "border-border hover:border-zinc-800 dark:hover:border-white" },
              { name: "Credință", icon: <Cross className="w-8 h-8"/>, color: "text-blue-600 dark:text-blue-500", border: "border-border hover:border-blue-600" },
              { name: "Echilibru", icon: <BrainCircuit className="w-8 h-8"/>, color: "text-purple-600 dark:text-purple-500", border: "border-border hover:border-purple-600" },
              { name: "Minecraft", icon: <Gamepad2 className="w-8 h-8"/>, color: "text-emerald-600 dark:text-emerald-500", border: "border-border hover:border-emerald-600" },
              { name: "Clasică", icon: <Music className="w-8 h-8"/>, color: "text-amber-600 dark:text-yellow-500", border: "border-border hover:border-amber-600" },
            ].map((tech, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`p-6 rounded-2xl bg-card border ${tech.border} shadow-sm hover:shadow-md transition-all duration-300 group cursor-default text-center flex flex-col items-center justify-center`}
              >
                <div className={`mb-3 ${tech.color} group-hover:scale-110 transition-transform`}>{tech.icon}</div>
                <div className={`text-sm font-bold text-muted-foreground group-hover:${tech.color.split(' ')[0]} transition-colors font-sans uppercase tracking-widest`}>{tech.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 6. FOOTER CTA */}
      {/* ========================================== */}
      <section className="py-40 px-6 text-center bg-zinc-100 dark:bg-[#020202] relative border-t border-border transition-colors duration-500">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
        
        <div className="relative z-10 container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-5xl font-black mb-10 leading-tight text-foreground font-sans uppercase tracking-tighter">
            &ldquo;Nu trebuie să fii expert ca să începi, <br/>
            <span className="text-muted-foreground">dar trebuie să începi ca să</span> <span className="text-[#00cc33] dark:text-[#00ff41]">devii expert.</span>&rdquo;
          </h2>

          <p className="text-muted-foreground mb-12 text-lg font-sans font-medium">
            Acesta este proiectul meu de suflet. Și suntem abia la început.
          </p>

          <Button asChild size="lg" className="bg-[#00cc33] dark:bg-[#00ff41] text-white dark:text-black hover:bg-[#00aa22] dark:hover:bg-white dark:hover:text-black font-black px-12 h-16 rounded-full text-lg shadow-[0_0_30px_rgba(0,204,51,0.3)] dark:shadow-[0_0_40px_rgba(0,255,65,0.2)] hover:scale-105 transition-all">
            <Link href="/contact">
              VREI SĂ VORBIM? <ArrowRight className="ml-3 w-5 h-5" />
            </Link>
          </Button>
          <p className="mt-16 text-muted-foreground text-[10px] font-bold uppercase tracking-[0.5em]">SpyderendD System</p>
        </div>
      </section>

      <style jsx global>{`
        .glitch-text { position: relative; }
        .glitch-text::before, .glitch-text::after {
          content: attr(data-text); position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        }
        .glitch-text::before { left: 2px; text-shadow: -1px 0 #00ff41; clip: rect(44px, 450px, 56px, 0); animation: glitch-anim 5s infinite linear alternate-reverse; }
        .glitch-text::after { left: -2px; text-shadow: -1px 0 #00fff9; clip: rect(44px, 450px, 56px, 0); animation: glitch-anim2 5s infinite linear alternate-reverse; }
        
        /* Pentru Light Mode schimbăm puțin umbrele glitch-ului ca să se vadă pe alb */
        .light .glitch-text::before { text-shadow: -1px 0 #ff00c1; opacity: 0.7; }
        .light .glitch-text::after { text-shadow: -1px 0 #0088ff; opacity: 0.7; }

        @keyframes glitch-anim { 0% { clip: rect(30px, 9999px, 10px, 0); } 100% { clip: rect(60px, 9999px, 80px, 0); } }
        @keyframes glitch-anim2 { 0% { clip: rect(10px, 9999px, 30px, 0); } 100% { clip: rect(80px, 9999px, 70px, 0); } }
        .animate-blink { animation: blink 1s step-end infinite; }
        @keyframes blink { 50% { opacity: 0; } }
      `}</style>
    </main>
  );
}