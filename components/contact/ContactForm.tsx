'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, MessageSquare, Send, Loader2, Star } from 'lucide-react';
import HeartRating from '@/components/HeartRating';
import InteractiveHeroIllustration from '@/components/animations/InteractiveHeroIllustration';
import Image from 'next/image';

const sectionFadeIn = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "circOut" } }, };
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } }, };

// --- COMPONENTA CARDULUI CU BUTONUL CONTACT ---
const FounderCard = () => {
  return (
    <div className="founder-card-wrapper">
      <style jsx>{`
        .uiverse-card {
          width: 280px;
          height: 340px;
          background: hsl(var(--card));
          border-radius: 32px;
          padding: 4px;
          position: relative;
          box-shadow: 0px 10px 30px -10px hsl(var(--primary) / 0.3);
          transition: all 0.5s ease-in-out;
          border: 1px solid hsl(var(--border));
          margin: 0 auto;
          overflow: hidden;
        }

        /* Butonul de Mail (Sus Dreapta) */
        .uiverse-card .mail {
          position: absolute;
          right: 2rem;
          top: 1.4rem;
          background: transparent;
          border: none;
          cursor: pointer;
          z-index: 10;
        }

        .uiverse-card .mail svg {
          stroke: #ffffff;
          stroke-width: 3px;
          filter: drop-shadow(0 2px 3px rgba(0,0,0,0.5));
          transition: all 0.3s ease;
        }

        .uiverse-card .mail:hover {
          transform: scale(1.2);
        }

        /* Poza */
        .uiverse-card .profile-pic {
          position: absolute;
          width: calc(100% - 8px);
          height: calc(100% - 8px);
          top: 4px;
          left: 4px;
          border-radius: 29px;
          z-index: 1;
          border: 0px solid hsl(var(--primary));
          overflow: hidden;
          transition: all 0.5s ease-in-out 0.2s, z-index 0.5s ease-in-out 0.2s;
        }

        .uiverse-card .profile-pic img {
          object-fit: cover;
          width: 100%;
          height: 100%;
          object-position: top center;
          transition: all 0.5s ease-in-out 0s;
        }

        /* Panoul de jos */
        .uiverse-card .bottom {
          position: absolute;
          bottom: 4px;
          left: 4px;
          right: 4px;
          top: 68%; 
          background: hsl(var(--primary));
          border-radius: 29px;
          z-index: 2;
          box-shadow: inset 0px 5px 5px 0px rgba(0,0,0,0.1);
          overflow: hidden;
          transition: all 0.5s cubic-bezier(0.645, 0.045, 0.355, 1) 0s;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 15px;
        }

        .uiverse-card .bottom .name {
          font-size: 1.2rem;
          color: hsl(var(--primary-foreground));
          font-weight: 800;
          margin-top: 5px;
        }
        
        .uiverse-card .bottom .nickname {
           font-size: 0.85rem;
           color: hsl(var(--primary-foreground) / 0.8);
           font-weight: 600;
           font-family: monospace;
           margin-bottom: 12px;
        }

        /* Social Icons */
        .uiverse-card .bottom .social-links-container {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-bottom: 15px;
        }

        .uiverse-card .bottom .social-links-container svg {
          height: 22px;
          width: 22px;
          fill: hsl(var(--primary-foreground));
          filter: drop-shadow(0 2px 2px rgba(0,0,0,0.2));
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .uiverse-card .bottom .social-links-container svg:hover {
          fill: #ffffff;
          transform: scale(1.2);
        }

        .uiverse-card .bottom .about-me {
          font-size: 0.8rem;
          color: hsl(var(--primary-foreground) / 0.9);
          line-height: 1.3;
          opacity: 0;
          height: 0;
          transform: translateY(20px);
          transition: all 0.3s ease;
        }

        /* BUTONUL CONTACT */
        .uiverse-card .bottom .contact-btn {
          background: hsl(var(--primary-foreground));
          color: hsl(var(--primary));
          border: none;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: bold;
          padding: 8px 24px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          cursor: pointer;
          text-decoration: none;
          margin-top: auto; /* Împinge la fund */
          
          /* Ascuns inițial */
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.3s ease;
          pointer-events: none;
        }
        
        .uiverse-card .bottom .contact-btn:hover {
            background: #ffffff;
            transform: scale(1.05);
        }

        /* --- ANIMATII LA HOVER --- */
        .uiverse-card:hover {
          border-top-left-radius: 55px;
        }

        .uiverse-card:hover .bottom {
          top: 20%; 
          border-radius: 80px 29px 29px 29px;
        }

        .uiverse-card:hover .profile-pic {
          width: 100px;
          height: 100px;
          aspect-ratio: 1;
          top: 10px;
          left: 10px;
          border-radius: 50%;
          z-index: 3;
          border: 4px solid hsl(var(--primary));
          box-shadow: 0px 5px 10px 0px rgba(0,0,0, 0.2);
        }

        .uiverse-card:hover .profile-pic img {
          transform: scale(1.5);
          object-position: top center;
        }

        /* Apar elementele ascunse */
        .uiverse-card:hover .bottom .about-me {
          opacity: 1;
          height: auto;
          transform: translateY(0);
          transition-delay: 0.2s;
        }

        .uiverse-card:hover .bottom .contact-btn {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
          transition-delay: 0.3s;
        }

      `}</style>

      <div className="uiverse-card group">
        <a href="mailto:spyderend0@gmail.com" className="mail" aria-label="Trimite email">
          <Mail className="h-5 w-5" />
        </a>

        <div className="profile-pic">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/EU.jpg"
            alt="Mera Alin David"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <div className="bottom">
          <span className="name">Mera Alin David</span>
          <span className="nickname">@Spyderend 🕷️</span>

          <div className="social-links-container">
            <a href="https://instagram.com/mera_alin" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.5 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" /></svg>
            </a>
            <a href="https://tiktok.com/@spyderend" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M448 209.91a210.06 210.06 0 0 1-122.77-39.25V349.38A162.55 162.55 0 1 1 185 188.31V278.2a74.62 74.62 0 1 0 52.23 71.18V0l88 0a121.18 121.18 0 0 0 1.86 22.17h0A122.18 122.18 0 0 0 381 102.39a121.43 121.43 0 0 0 67 20.14z" /></svg>
            </a>
          </div>

          <span className="about-me">
            Founder & Developer.<br />
            Elev, pasionat de educație, tehnologie și Minecraft.
          </span>

          <a href="/eu" className="contact-btn">Despre mine</a>
        </div>
      </div>
    </div>
  );
};
// --- FINAL COMPONENTA CARD ---

export default function ContactForm() {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, message }), });
      const data = await response.json();
      if (!response.ok) { throw new Error(data.error || 'A apărut o eroare necunoscută.'); }
      toast({ title: "Mesaj trimis!", description: "Mulțumesc pentru mesaj. Voi reveni cu un răspuns în cel mai scurt timp.", });
      setName(''); setEmail(''); setMessage('');
    } catch (error: any) {
      toast({ title: "Eroare la trimitere", description: error.message || "Te rog să încerci din nou sau să folosești adresa de email directă.", variant: "destructive", });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-24 sm:py-32">
      <motion.div className="text-center max-w-3xl mx-auto mb-16" initial="hidden" animate="visible" variants={sectionFadeIn}>
        <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl font-lora">Contact & Povestea mea</h1>
        <p className="mt-4 text-lg text-muted-foreground">Un loc unde munca, pasiunea și dorința se întâlnesc.</p>
      </motion.div>

      <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 items-start" variants={staggerContainer} initial="hidden" animate="visible">

        {/* POVESTEA MEA (Stânga) */}
        <motion.div variants={sectionFadeIn} className="space-y-8 lg:col-span-1">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-4">Un proiect născut din luptă</h2>
            <div className="text-lg text-muted-foreground leading-relaxed space-y-5 font-lora">
              <p>Acest site nu s-a născut într-o clipă. Nu e un simplu proiect apărut din plictiseală. Este rezultatul unor nopți în care somnul mi-a tremurat între gene, unor ore lungi în care m-am simțit epuizat, confuz, și unor momente în care mi-am pus întrebarea: „De ce mai continui?”</p>
              <p>Au fost zile în care eram răcit, cu febră, cu gâtul în flăcări, în care corpul îmi spunea să mă opresc. Și totuși, cu ochii înroșiți și degetele tremurând, am continuat să lucrez la acest site. Nu pentru că era ușor, ci pentru că simțeam că altfel m-aș trăda pe mine însumi.</p>
              <p>Am pornit de la un vis simplu: să fac învățarea mai limpede. Mai umană. Nu doar pentru mine, ci pentru oricine are nevoie să fie ghidat, încurajat, văzut.</p>
              <p>Acest site este dovada mea că durerea, boala, oboseala și frustrarea pot fi transformate în lumină. Și dacă într-o zi cineva îl va promova, nu vreau să fie despre mine. Vreau să fie despre ideea că, din lupta unui singur om, se poate naște o punte pentru mii. <Star className="inline-block h-5 w-5 text-yellow-500 fill-yellow-500 -mt-1" /></p>
            </div>
          </div>

          {/* Cardul Personalizat Integrat Aici */}
          <div className="pt-8 border-t border-border flex justify-center lg:justify-start">
            <FounderCard />
          </div>

        </motion.div>

        {/* ILUSTRAȚIE (Centru) */}
        <motion.div variants={sectionFadeIn} className="hidden lg:flex items-center justify-center lg:col-span-1 h-full">
          <InteractiveHeroIllustration />
        </motion.div>

        {/* FORMULAR (Dreapta) */}
        <motion.div variants={sectionFadeIn} className="lg:col-span-1 sticky top-24">
          <Card className="shadow-lg shadow-foreground/5 border-primary/10">
            <CardHeader>
              <CardTitle className="text-2xl">Trimite-mi un mesaj</CardTitle>
              <CardDescription>Ai o întrebare, o sugestie sau vrei doar să saluți? Folosește formularul de mai jos.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nume</Label>
                  <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /><Input id="name" type="text" placeholder="Numele tău" required value={name} onChange={e => setName(e.target.value)} disabled={isSubmitting} className="pl-10" /></div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /><Input id="email" type="email" placeholder="email@exemplu.com" required value={email} onChange={e => setEmail(e.target.value)} disabled={isSubmitting} className="pl-10" /></div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Mesaj</Label>
                  <div className="relative"><MessageSquare className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" /><Textarea id="message" placeholder="Scrie aici mesajul tău..." required value={message} onChange={e => setMessage(e.target.value)} disabled={isSubmitting} className="pl-10 min-h-[120px]" /></div>
                </div>
                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>{isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Se trimite...</>) : (<><Send className="mr-2 h-4 w-4" /> Trimite Mesajul</>)}</Button>
              </form>
              <div className="mt-8 text-center text-sm text-muted-foreground">
                <p>Sau contactează-mă direct la adresa:</p>
                <a href="mailto:spyderend0@gmail.com" className="font-semibold text-primary hover:underline">spyderend0@gmail.com</a> <br />
                <p className="text-xs mt-1 opacity-70">VĂ ROG FĂRĂ SPAM!</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </motion.div>

      <motion.div className="mt-24 text-center" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={sectionFadeIn}>
        <p className="text-lg text-muted-foreground mb-4">Îți place proiectul? Dă-i o notă (1 = slab, 10 = foarte bun):</p>
        <HeartRating slug="contact-feedback" />
      </motion.div>
    </div>
  );
}