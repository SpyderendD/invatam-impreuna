'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, MessageSquare, Send, Loader2, Star } from 'lucide-react';
import HeartRating from '@/components/HeartRating';

// AICI ESTE IMPORTUL CORECTAT
import InteractiveHeroIllustration from '@/components/animations/InteractiveHeroIllustration';

// ... restul codului rămâne la fel ...
const sectionFadeIn = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "circOut" } }, };
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } }, };

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
      <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 items-center" variants={staggerContainer} initial="hidden" animate="visible">
        <motion.div variants={sectionFadeIn} className="space-y-6 lg:col-span-1">
          <h2 className="text-3xl font-bold text-foreground">Un proiect născut din luptă</h2>
          <div className="text-lg text-muted-foreground leading-relaxed space-y-5 font-lora">
            <p>„Acest site nu a apărut peste noapte. În spatele lui sunt ore lungi de muncă, momente de oboseală, frustrare și gânduri de a renunța. Dar, de fiecare dată, mi-am amintit de ce am început.</p>
            <p>Am vrut să creez un loc unde învățarea să fie mai clară și mai ușoară, nu doar pentru mine, ci și pentru oricine are nevoie. Pentru mine, fiecare rând scris aici, fiecare pagină creată, a însemnat o luptă între a mă simți pierdut și dorința de a reuși.</p>
            <p>Poate nu este un site perfect, dar este plin de suflet. Este o parte din mine, din dorința mea de a face bine și de a lăsa ceva care să rămână și după ce eu nu voi mai fi doar „un elev”.</p>
            <p>Dacă citești asta, înseamnă că ai ajuns într-un loc construit cu multă trudă și cu speranța că va ajuta, măcar puțin. Și dacă te-a atins cumva, te rog să duci mai departe acest mesaj: să fim mai buni unii cu alții, să nu fim răi, să nu uităm că fiecare om poartă o luptă pe care ceilalți nu o văd.</p>
            <p>Acest site e dovada mea că, oricât de greu ar fi, poți să transformi durerea și efortul în ceva frumos. Și dacă într-o zi cineva îl va promova, nu va fi despre mine, ci despre ideea că și din lupta unui singur om poate să se nască o lumină pentru alții. <Star className="inline-block h-5 w-5 text-yellow-500 fill-yellow-500 -mt-1" />”</p>
          </div>
        </motion.div>
        <motion.div variants={sectionFadeIn} className="hidden lg:flex items-center justify-center lg:col-span-1">
          <InteractiveHeroIllustration />
        </motion.div>
        <motion.div variants={sectionFadeIn} className="lg:col-span-1">
          <Card className="shadow-lg shadow-foreground/5">
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
                <a href="mailto:spyderend@gmail.com" className="font-semibold text-primary hover:underline">spyderend0@gmail.com</a> <br />
                <p>VĂ ROG FĂRĂ SPAM!</p>
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