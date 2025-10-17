'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, Facebook, Instagram, Youtube, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

// --- Componentele și Datele rămân în mare parte la fel ---

const TiktokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.73-1.52.4-.65.59-1.43.59-2.2v-4.87c-.01-1.02.03-2.04.01-3.06-.01-2.2-.42-4.36-1.12-6.36-.84-2.17-2.43-3.9-4.32-5.06-1.21-.76-2.61-1.21-4.04-1.39-1.13-.13-2.28-.01-3.39.23v-4.32c1.53-.17 3.04-.15 4.54-.03z" />
  </svg>
);

const footerLinks = {
  materii: [
    { href: '/materii/romana', label: 'Limba Română' },
    { href: '/materii/matematica', label: 'Matematică' },
    { href: '/materii/informatica', label: 'Informatică' },
    { href: 'https://www.fizichim.ro/docs/fizica/clasa6/capitolul1-introducere-in-studiul-fizicii/I-1-ce-este-fizica', label: 'Fizică' },
    { href: 'https://www.fizichim.ro/docs/chimie/clasa7/capitolul1-chimia-stiinta-a-naturii/I-1-ce-este-chimia/', label: 'Chimie' },
  ],
  resurse: [
    { href: '/contact', label: 'Contactează-ne' },
    { href: '/contact', label: 'Despre mine' },
    { href: '/blog', label: 'Blog' },
  ],
  legal: [
    { href: '/termeni', label: 'Termeni și condiții' },
    { href: '/politica-confidentialitate', label: 'Politică de confidențialitate' },
    { href: '/cookies', label: 'Politica cookies' },
  ],
};

const socialLinks = [
  { href: 'https://www.facebook.com/profile.php?id=61574503234752', icon: <Facebook className="h-4 w-4" />, label: 'Facebook' },
  { href: 'https://www.instagram.com/spyder.end/', icon: <Instagram className="h-4 w-4" />, label: 'Instagram' },
  { href: 'https://www.youtube.com/@Spyderend_', icon: <Youtube className="h-4 w-4" />, label: 'Youtube' },
  { href: 'https://www.tiktok.com/@spyderend3', icon: <TiktokIcon className="h-4 w-4" />, label: 'Tiktok' },
];

const FooterLinkColumn = ({ title, links }: { title: string; links: Array<{ href: string; label: string; }> }) => (
  <div>
    <h3 className="font-bold text-lg mb-4 text-foreground">{title}</h3>
    <ul className="space-y-2">
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href} className="text-muted-foreground hover:text-primary animated-underline inline-block">
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const SocialIcon = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
  <Link href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="h-9 w-9 rounded-lg bg-card/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all transform hover:scale-110">
    {icon}
  </Link>
);

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeOut" } 
  },
};


export function Footer() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- LOGICA ORIGINALĂ PENTRU COPYRIGHT, RESTAURATĂ ---
  const launchDate = new Date(2025, 1, 3); // 3 feb 2025 (lunile sunt 0-indexate)
  const now = new Date();
  const fmtStart = new Intl.DateTimeFormat('ro-RO', { day: 'numeric', month: 'short', year: 'numeric' });
  const fmtEnd = new Intl.DateTimeFormat('ro-RO', { month: 'short', year: 'numeric' });
  const stripDots = (s: string) => s.replaceAll('.', '');

  const startLabel = stripDots(fmtStart.format(launchDate)); // ex: “3 feb 2025”
  const endLabel = stripDots(fmtEnd.format(now)); // ex: “sep 2025”
  // --- SFÂRȘITUL BLOCULUI DE COD RESTAURAT ---

  const handleNewsletterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'A apărut o eroare necunoscută.');
      }

      toast({
        title: "Abonare reușită!",
        description: data.message || "Mulțumim pentru abonare!",
      });
      setEmail('');

    } catch (error: any) {
      toast({
        title: "Eroare la abonare",
        description: error.message || "Te rugăm să încerci din nou.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-card py-16 border-t border-border overflow-hidden">
      <div className="container">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div variants={itemVariants} className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-foreground">Învățăm Împreună</span>
            </Link>
            <p className="text-muted-foreground text-sm mb-6">
              Platforma pentru a explora, învăța și excela. Resurse complete pentru examene și materii esențiale.
            </p>
            <div className="flex space-x-2">
              {socialLinks.map(link => (
                <SocialIcon key={link.label} {...link} />
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <FooterLinkColumn title="Materii" links={footerLinks.materii} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <FooterLinkColumn title="Resurse" links={footerLinks.resurse} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="font-bold text-lg mb-4 text-foreground">Abonează-te la newsletter</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Primește noutăți și resurse utile direct în inbox.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex space-x-2">
              <Input
                name="email"
                type="email"
                placeholder="Email-ul tău"
                required
                className="bg-muted"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
              <Button type="submit" className="shrink-0 w-32" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Abonare'
                )}
              </Button>
            </form>
          </motion.div>
        </motion.div>

        <motion.div 
          className="mt-16 pt-8 border-t border-border flex flex-col-reverse md:flex-row justify-between items-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {startLabel} – {endLabel} Învățăm Împreună. Construit cu ❤️ pentru viitorul României.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center md:justify-end">
            {footerLinks.legal.map(link => (
              <Link key={link.href} href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}