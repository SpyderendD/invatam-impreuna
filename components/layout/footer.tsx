'use client';

import Link from 'next/link';
import React from 'react';
import { ScrollAnimation } from '@/components/scroll-animation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, Facebook, Instagram, Mail, Youtube } from 'lucide-react';
import { cn } from '@/lib/utils';

// Iconița TikTok ca o componentă SVG
const TiktokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.73-1.52.4-.65.59-1.43.59-2.2v-4.87c-.01-1.02.03-2.04.01-3.06-.01-2.2-.42-4.36-1.12-6.36-.84-2.17-2.43-3.9-4.32-5.06-1.21-.76-2.61-1.21-4.04-1.39-1.13-.13-2.28-.01-3.39.23v-4.32c1.53-.17 3.04-.15 4.54-.03z" />
  </svg>
);


// Datele pentru link-uri (centralizate pentru a fi ușor de modificat)
const footerLinks = {
  materii: [
    { href: '/materii/romana', label: 'Limba Română', hoverColor: 'hover:text-primary' },
    { href: '/materii/matematica', label: 'Matematică', hoverColor: 'hover:text-secondary' },
    // Adaugă alte materii aici ușor
  ],
  resurse: [
    { href: '/contact', label: 'Contactează-ne' },
    { href: '/despre', label: 'Despre noi' },
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

// Componente mici, reutilizabile pentru un cod mai curat
const FooterLinkColumn = ({ title, links }: { title: string; links: Array<{ href: string; label: string; hoverColor?: string }> }) => (
  <div>
    <h3 className="font-bold text-lg mb-4 text-foreground">{title}</h3> {/* text-foreground */}
    <ul className="space-y-2">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className={cn(
              "text-muted-foreground hover:text-primary animated-underline inline-block",
              link.hoverColor // Aplică clasa de hover specifică dacă există
            )}
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const SocialIcon = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
  <Link
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    // Folosim bg-card/10 și text-primary, care se adaptează temei
    className="h-9 w-9 rounded-lg bg-card/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all transform hover:scale-110"
  >
    {icon}
  </Link>
);

export function Footer() {
  const currentYear = new Date().getFullYear();

  const handleNewsletterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = event.currentTarget.email.value;
    alert(`Mulțumim pentru abonare, ${email}!`);
    event.currentTarget.reset();
  };

  return (
    // Footer-ul va folosi bg-card și border-border
    <footer className="bg-card py-16 border-t border-border"> 
      <div className="container">
        <ScrollAnimation>
          {/* Partea de sus a footer-ului */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            <div className="md:col-span-1">
              <Link href="/" className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-foreground">Învățăm Împreună</span> {/* text-foreground */}
              </Link>
              <p className="text-muted-foreground text-sm mb-6">
                Platforma educațională care îți aduce succesul la Evaluarea Națională.
              </p>
              <div className="flex space-x-2">
                {socialLinks.map(link => (
                  <SocialIcon key={link.label} {...link} />
                ))}
              </div>
            </div>

            <FooterLinkColumn title="Materii" links={footerLinks.materii} />
            <FooterLinkColumn title="Resurse" links={footerLinks.resurse} />

            <div>
              <h3 className="font-bold text-lg mb-4 text-foreground">Abonează-te la newsletter</h3> {/* text-foreground */}
              <p className="text-muted-foreground text-sm mb-4">
                Primește noutăți și resurse utile direct în inbox.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex space-x-2">
                {/* Input-ul și butonul folosesc culorile temei automat */}
                <Input name="email" type="email" placeholder="Email-ul tău" required className="bg-muted" /> 
                <Button type="submit" className="shrink-0">Abonare</Button>
              </form>
            </div>
          </div>

          {/* Partea de jos a footer-ului */}
          <div className="mt-16 pt-8 border-t border-border flex flex-col-reverse md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} Învățăm Împreună. Construit cu ❤️ pentru viitorul României.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center md:justify-end">
              {footerLinks.legal.map(link => (
                 <Link key={link.href} href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                   {link.label}
                 </Link>
              ))}
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </footer>
  );
}