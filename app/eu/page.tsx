'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Code, Terminal, Globe, 
  ChevronDown, Zap, Shield, Laptop, Database, BrainCircuit, Gamepad2,
  Cpu, ArrowRight 
} from 'lucide-react';

// --- MATRIX RAIN EFFECT COMPONENT ---
const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = '01ABCDEFXYZ';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.ceil(columns)).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0F0';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };
    const interval = setInterval(draw, 33);
    return () => clearInterval(interval);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 opacity-20 pointer-events-none" />;
};

export default function PovesteaMeaPage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const [text, setText] = useState('');
  
  // TEXT MODIFICAT: Mai prietenos
  const fullText = "> Salut! Eu sunt Spyderend.";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-black text-gray-200 overflow-x-hidden selection:bg-[#00ff41] selection:text-black font-mono">
      
      {/* Progress Bar Neon */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#00ff41] origin-left z-50 shadow-[0_0_20px_#00ff41]"
        style={{ scaleX }}
      />

      {/* --- HERO SECTION --- */}
      <section className="relative h-screen flex flex-col items-center justify-center px-4 overflow-hidden border-b border-[#333]">
        <MatrixRain />
        
        {/* Glowing Orb Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00ff41] rounded-full blur-[200px] opacity-10 animate-pulse pointer-events-none" />

        <div className="z-10 text-center space-y-8 max-w-5xl relative">
          
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 border border-[#00ff41]/50 bg-[#00ff41]/5 px-6 py-2 rounded-none text-[#00ff41] text-sm tracking-[0.2em] uppercase backdrop-blur-md"
          >
            <span className="w-2 h-2 bg-[#00ff41] animate-ping rounded-full"></span>
            Profil Creator
          </motion.div>

          <div className="relative">
             {/* GLITCH TITLE */}
             <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white glitch-text relative z-10" data-text="MERA ALIN DAVID">
                MERA ALIN <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff41] to-emerald-600">DAVID</span>
             </h1>
          </div>

          <div className="h-8 md:h-12 text-xl md:text-2xl text-[#00ff41] font-bold flex items-center justify-center">
            {text}<span className="animate-blink w-3 h-6 md:h-8 bg-[#00ff41] ml-2 block"></span>
          </div>

          {/* TEXT MODIFICAT: Mai simplu și direct */}
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed border-l-4 border-[#00ff41] pl-6 text-left bg-white/5 p-4 rounded-r-xl backdrop-blur-sm">
            Elev pasionat. Creator digital.<br/>
            Îmi place să construiesc lucruri care ajută. Cred că tehnologia, folosită corect, poate face școala mai ușoară și mai interesantă.
          </p>

          <div className="pt-8 flex flex-col sm:flex-row gap-6 justify-center">
            <Button asChild size="lg" className="bg-[#00ff41] text-black hover:bg-[#00cc33] font-bold text-lg rounded-none px-10 h-14 shadow-[0_0_30px_rgba(0,255,65,0.3)] hover:shadow-[0_0_50px_rgba(0,255,65,0.6)] transition-all transform hover:-translate-y-1">
              <Link href="#poveste">CITEȘTE POVESTEA</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-gray-700 text-gray-300 hover:border-white hover:text-white font-bold text-lg rounded-none px-10 h-14 backdrop-blur-sm">
              <Link href="/contact">CONTACTEAZĂ-MĂ</Link>
            </Button>
          </div>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#00ff41] opacity-50"
        >
          <ChevronDown className="w-12 h-12" />
        </motion.div>
      </section>

      {/* --- POVESTEA REALĂ (Terminal Style) --- */}
      <section id="poveste" className="py-32 px-6 relative bg-[#050505]">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* TEXT MODIFICAT: Mai puțin dramatic */}
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                <span className="text-[#00ff41]">&gt;</span> De ce am <br/>
                făcut <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">acest site?</span>
              </h2>
              
              <div className="space-y-6 text-gray-300 text-lg leading-relaxed font-sans">
                <p>
                  Totul a pornit dintr-o nevoie personală. Ca elev, am simțit de multe ori că resursele pentru examene sunt împrăștiate și greu de urmărit. Am vrut să creez locul pe care mi l-aș fi dorit eu să-l am când învățam.
                </p>
                <p className="border-l-2 border-purple-500 pl-4 italic bg-purple-500/5 p-2">
                  Au fost momente când am vrut să renunț, când codul nu mergea sau eram prea obosit după școală.
                </p>
                <p>
                  Dar am continuat, pas cu pas. Am învățat programare din mers, am greșit, am reparat și am mers mai departe. Satisfacția de a vedea platforma funcționând și de a ști că poate ajuta și alți colegi a meritat tot efortul.
                </p>
              </div>
            </motion.div>

            {/* Fereastra de Terminal */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#00ff41] to-blue-600 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
              
              <div className="relative bg-[#0a0a0a] border border-[#333] rounded-lg shadow-2xl overflow-hidden font-mono text-sm">
                <div className="bg-[#1a1a1a] px-4 py-2 flex items-center gap-2 border-b border-[#333]">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="ml-2 text-gray-500 text-xs">scopul_meu.txt</span>
                </div>
                
                {/* TEXT MODIFICAT ÎN TERMINAL */}
                <div className="p-6 space-y-4 text-gray-300">
                  <div>
                    <span className="text-green-500">➜</span> <span className="text-blue-400">~</span> <span className="text-yellow-500">cat</span> obiective.txt
                  </div>
                  <p>
                    Vreau să fac învățarea mai accesibilă și mai modernă pentru toți elevii.
                  </p>
                  <div className="pl-4 border-l border-gray-700 space-y-2">
                     <p><span className="text-[#00ff41]">✔</span> O platformă gratuită și utilă.</p>
                     <p><span className="text-[#00ff41]">✔</span> Informație structurată clar.</p>
                     <p><span className="text-[#00ff41]">✔</span> Unelte care chiar ajută la studiu.</p>
                  </div>
                  <div>
                    <span className="text-green-500">➜</span> <span className="text-blue-400">~</span> <span className="animate-pulse">_</span>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* --- TIMELINE --- */}
      <section className="py-32 px-6 bg-[#030303] relative overflow-hidden">
        <svg className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 100 H 200 V 400 H 600" fill="none" stroke="#00ff41" strokeWidth="2" />
            <path d="M1000 800 H 800 V 500 H 400" fill="none" stroke="#00ff41" strokeWidth="2" />
        </svg>

        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-center mb-24"
          >
            Cum am ajuns <span className="text-[#00ff41]">aici</span>
          </motion.h2>

          <div className="space-y-16 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#00ff41] before:via-purple-500 before:to-transparent">
            
            {/* ITEM 1 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#00ff41] bg-black shadow-[0_0_15px_#00ff41] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <Zap className="w-5 h-5 text-[#00ff41]" />
              </div>
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-xl border border-[#333] bg-[#0a0a0a] hover:border-[#00ff41] hover:shadow-[0_0_20px_rgba(0,255,65,0.1)] transition-all duration-300"
              >
                <div className="flex items-center justify-between space-x-2 mb-2">
                  <div className="font-bold text-xl text-white">Începutul</div>
                  <time className="font-mono text-xs text-[#00ff41] bg-[#00ff41]/10 px-2 py-1 rounded">2020 - 2023</time>
                </div>
                {/* TEXT MODIFICAT */}
                <div className="text-gray-400">
                  Totul a început din curiozitate. M-am jucat cu servere de Minecraft, am încercat să înțeleg cum funcționează codul și am început să experimentez cu mici scripturi. A fost o joacă, dar una serioasă.
                </div>
              </motion.div>
            </div>

            {/* ITEM 2 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#00d2ff] bg-black shadow-[0_0_15px_#00d2ff] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <Code className="w-5 h-5 text-[#00d2ff]" />
              </div>
              <motion.div 
                 initial={{ opacity: 0, x: 50 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-xl border border-[#333] bg-[#0a0a0a] hover:border-[#00d2ff] hover:shadow-[0_0_20px_rgba(0,210,255,0.1)] transition-all duration-300"
              >
                <div className="flex items-center justify-between space-x-2 mb-2">
                  <div className="font-bold text-xl text-white">Proiectul</div>
                  <time className="font-mono text-xs text-[#00d2ff] bg-[#00d2ff]/10 px-2 py-1 rounded">Late 2024</time>
                </div>
                {/* TEXT MODIFICAT */}
                <div className="text-gray-400">
                  Am decis să fac ceva concret. Am început să învăț Next.js și React pentru a construi &quot;Învățăm Împreună&quot;. A fost o provocare mare, dar am vrut să demonstrez că pot duce un proiect de la zero până la capăt.
                </div>
              </motion.div>
            </div>

            {/* ITEM 3 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-purple-500 bg-black shadow-[0_0_15px_purple] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <Globe className="w-5 h-5 text-purple-500" />
              </div>
              <motion.div 
                 initial={{ opacity: 0, x: -50 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-xl border border-[#333] bg-[#0a0a0a] hover:border-purple-500 hover:shadow-[0_0_20px_rgba(168,85,247,0.1)] transition-all duration-300"
              >
                <div className="flex items-center justify-between space-x-2 mb-2">
                  <div className="font-bold text-xl text-white">Prezent</div>
                  <time className="font-mono text-xs text-purple-500 bg-purple-500/10 px-2 py-1 rounded">2025</time>
                </div>
                {/* TEXT MODIFICAT */}
                <div className="text-gray-400">
                  Platforma este online! Am reușit să vând primul meu site și continui să învăț. Sunt mai disciplinat și mai motivat să creez lucruri utile în domeniul IT.
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* --- TECH STACK GRID --- */}
      <section className="py-24 px-6 relative bg-black">
        <div className="container mx-auto max-w-6xl">
          <motion.h2 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true }}
             className="text-3xl md:text-5xl font-bold text-center mb-16"
          >
            Ce Folosesc <span className="text-gray-600">{'//'}</span> Tech Stack
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Next.js", icon: <Globe className="w-6 h-6"/>, color: "text-[#00ff41]", border: "group-hover:border-[#00ff41]" },
              { name: "React", icon: <Code className="w-6 h-6"/>, color: "text-blue-400", border: "group-hover:border-blue-400" },
              { name: "Tailwind", icon: <Laptop className="w-6 h-6"/>, color: "text-cyan-400", border: "group-hover:border-cyan-400" },
              { name: "Firebase", icon: <Database className="w-6 h-6"/>, color: "text-yellow-500", border: "group-hover:border-yellow-500" },
              { name: "AI Tools", icon: <BrainCircuit className="w-6 h-6"/>, color: "text-pink-500", border: "group-hover:border-pink-500" },
              { name: "Vercel", icon: <Shield className="w-6 h-6"/>, color: "text-white", border: "group-hover:border-white" },
              { name: "Minecraft", icon: <Gamepad2 className="w-6 h-6"/>, color: "text-green-600", border: "group-hover:border-green-600" },
              { name: "Pasiune", icon: <Terminal className="w-6 h-6"/>, color: "text-gray-400", border: "group-hover:border-gray-400" },
            ].map((tech, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05, rotateX: 10, rotateY: 10 }}
                className={`p-8 rounded-2xl bg-[#0a0a0a] border border-[#222] ${tech.border} transition-all duration-300 group cursor-default relative overflow-hidden`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className={`mb-4 ${tech.color}`}>{tech.icon}</div>
                <div className={`text-xl font-bold text-white group-hover:${tech.color.split(' ')[0]} transition-colors`}>{tech.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER CTA --- */}
      <section className="py-40 px-6 text-center bg-[#050505] relative border-t border-[#333]">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
        
        <div className="relative z-10 container mx-auto max-w-3xl">
          <Cpu className="w-16 h-16 mx-auto text-[#00ff41] mb-8 animate-pulse" />
          
          <h2 className="text-3xl md:text-5xl font-bold mb-10 leading-tight text-white font-sans">
            &ldquo;Nu trebuie să fii expert ca să începi, <br/>
            dar trebuie să <span className="text-[#00ff41] underline decoration-4 underline-offset-8 decoration-wavy">începi</span> ca să devii expert.&rdquo;
          </h2>

          <p className="text-gray-400 mb-12 text-lg">
            Acesta este proiectul meu de suflet. Dar este doar începutul.
          </p>

          <Button asChild size="lg" className="bg-white text-black hover:bg-gray-200 font-bold px-12 py-8 rounded-full text-xl shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform">
            <Link href="/#materii">
              Vezi ce am construit <ArrowRight className="ml-3 w-6 h-6" />
            </Link>
          </Button>
        </div>
      </section>

      <style jsx global>{`
        .glitch-text {
          position: relative;
        }
        .glitch-text::before,
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .glitch-text::before {
          left: 2px;
          text-shadow: -1px 0 #ff00c1;
          clip: rect(44px, 450px, 56px, 0);
          animation: glitch-anim 5s infinite linear alternate-reverse;
        }
        .glitch-text::after {
          left: -2px;
          text-shadow: -1px 0 #00fff9;
          clip: rect(44px, 450px, 56px, 0);
          animation: glitch-anim2 5s infinite linear alternate-reverse;
        }
        @keyframes glitch-anim {
          0% { clip: rect(30px, 9999px, 10px, 0); }
          5% { clip: rect(80px, 9999px, 90px, 0); }
          10% { clip: rect(10px, 9999px, 30px, 0); }
          15% { clip: rect(90px, 9999px, 100px, 0); }
          20% { clip: rect(20px, 9999px, 60px, 0); }
          100% { clip: rect(60px, 9999px, 80px, 0); }
        }
        @keyframes glitch-anim2 {
          0% { clip: rect(10px, 9999px, 30px, 0); }
          5% { clip: rect(90px, 9999px, 100px, 0); }
          10% { clip: rect(30px, 9999px, 10px, 0); }
          15% { clip: rect(60px, 9999px, 80px, 0); }
          20% { clip: rect(10px, 9999px, 50px, 0); }
          100% { clip: rect(80px, 9999px, 70px, 0); }
        }
      `}</style>
    </main>
  );
}