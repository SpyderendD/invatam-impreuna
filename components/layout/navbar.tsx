'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation'; 
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  BookOpen, Menu, X, Instagram, Facebook, Twitter, LogOut, User, Settings,
  Calculator, BookMarked, LineChart, Mail, Youtube
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

// Link-urile de navigație pentru desktop
const navLinksDesktop = [
  { href: '/#materii', label: 'Materii' },
  { href: '/teste', label: 'Modele teste E.N.' },
  { href: '/dashboard', label: 'Monitorizare' },
  { href: '/quizuri', label: 'Quizuri' },
];

// Link-urile pentru meniul mobil
const mobileNavLinks = [
  { href: '/#materii', label: 'Materii', icon: BookMarked },
  { href: '/teste', label: 'Modele teste E.N.', icon: Calculator },
  { href: '/monitorizare', label: 'Monitorizare', icon: LineChart },
  { href: '/quizuri', label: 'Quizuri', icon: Mail },
];

const socialLinks = [
    { href: "https://www.instagram.com/spyder.end/", label: "Instagram", icon: Instagram },
    { href: "https://www.facebook.com/profile.php?id=61574503234752", label: "Facebook", icon: Facebook },
    { href: "youtube.com/@Spyderend_", label: "Youtube", icon: Youtube },

];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
  }, [isOpen]);
  
  const userName = user?.displayName || 'Utilizator';
  const userEmail = user?.email || '';
  const userImage = user?.photoURL || '';
  const userInitial = userName ? userName.charAt(0).toUpperCase() : 'U';

  const sidebarVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: { x: '0%', opacity: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  };
  
  const contentVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  };

  return (
    <>
      {/* Header - Animație de intrare + Fundal solid adaptabil */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.1 }}
        className="sticky top-0 w-full z-40 bg-card border-b border-border"
      >
        <nav className="container h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-primary">
            <BookOpen />
            <span className="hidden sm:inline">Învățăm Împreună</span>
          </Link>
          
          {/* NAVIGARE DESKTOP - Cu efect "Pill" la hover */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinksDesktop.map(link => (
              <Link 
                key={link.href} 
                href={link.href} 
                className="relative text-foreground text-sm font-medium px-3 py-2 rounded-full 
                           group overflow-hidden transition-colors duration-300"
              >
                {/* Pastila se extinde și textul devine alb */}
                <span className="absolute inset-0 bg-primary rounded-full 
                                 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 
                                 transition-all duration-300 ease-out -z-10"></span>
                {/* Textul link-ului */}
                <span className="relative z-10 group-hover:text-primary-foreground transition-colors duration-300">
                  {link.label}
                </span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-4">
              <ThemeToggle />
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><button aria-label="Deschide meniul utilizatorului"><Avatar className="cursor-pointer h-9 w-9"><AvatarImage src={userImage} alt={userName} /><AvatarFallback>{userInitial}</AvatarFallback></Avatar></button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56"><DropdownMenuLabel><p className="font-semibold">{userName}</p><p className="text-xs text-muted-foreground font-normal">{userEmail}</p></DropdownMenuLabel><DropdownMenuSeparator /><DropdownMenuItem asChild><Link href="/dashboard"><User className="mr-2 h-4 w-4" /> Profil</Link></DropdownMenuItem><DropdownMenuItem asChild><Link href="/setari"><Settings className="mr-2 h-4 w-4" /> Setări</Link></DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive focus:bg-destructive/10"><LogOut className="mr-2 h-4 w-4" /> Deconectare</DropdownMenuItem></DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="ghost" asChild><Link href="/login" className="text-primary">Autentificare</Link></Button>
                  <Button asChild><Link href="/register">Înregistrare</Link></Button>
                </>
              )}
            </div>
            <div className="lg:hidden"><button onClick={() => setIsOpen(true)} aria-label="Deschide meniul" className="p-2 -mr-2 text-foreground"><Menu className="h-6 w-6" /></button></div>
          </div>
        </nav>
      </motion.header>

      {/* Meniu Lateral Mobil */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/40 z-[99] lg:hidden">
            <motion.div variants={sidebarVariants} initial="hidden" animate="visible" exit="hidden" onClick={(e) => e.stopPropagation()} className="fixed top-0 right-0 bottom-0 w-5/6 max-w-sm bg-card/70 backdrop-blur-xl z-[100] shadow-2xl flex flex-col">
              <div className="p-4 flex items-center justify-end border-b border-border"><button onClick={() => setIsOpen(false)} aria-label="Închide meniul" className="p-2 rounded-lg bg-yellow-400 text-black"><X className="h-5 w-5" /></button></div>
              <motion.div className="flex flex-col flex-1 px-4" variants={contentVariants} initial="hidden" animate="visible">
                <motion.div variants={itemVariants}>{user ? (<Link href="/profil" onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-4 rounded-lg hover:bg-card/50 transition-colors"><Avatar className="h-12 w-12 border-2 border-primary"><AvatarImage src={userImage} alt={userName}/><AvatarFallback className="text-lg bg-muted">{userInitial}</AvatarFallback></Avatar><div><p className="font-bold text-foreground">{userName}</p>{userEmail && <p className="text-sm text-muted-foreground">{userEmail}</p>}</div></Link>) : (<div className="flex flex-col gap-3 p-4"><Button asChild className="w-full"><Link href="/login" onClick={() => setIsOpen(false)}>Autentificare</Link></Button><Button variant="outline" asChild className="w-full bg-transparent"><Link href="/register" onClick={() => setIsOpen(false)}>Înregistrare</Link></Button></div>)}</motion.div>
                <motion.hr variants={itemVariants} className="my-4 border-border" />
                <motion.nav variants={itemVariants} className="flex flex-col gap-2">{mobileNavLinks.map(link => (<Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="flex items-center gap-4 text-lg font-medium text-foreground p-4 rounded-md hover:bg-card/50 transition-colors"><link.icon className="h-6 w-6 text-primary" /><span>{link.label}</span></Link>))}</motion.nav>
                <motion.hr variants={itemVariants} className="my-4 border-border" />
                {user && (<motion.div variants={itemVariants} className="flex flex-col gap-2"><Link href="/setari" onClick={() => setIsOpen(false)} className="flex items-center gap-4 text-lg font-medium text-foreground p-4 rounded-md hover:bg-card/50 transition-colors"><Settings className="h-6 w-6 text-primary" /><span>Setări</span></Link><button onClick={async () => { await logout(); setIsOpen(false); }} className="flex items-center gap-4 text-lg font-medium text-destructive p-4 rounded-md hover:bg-destructive/10 transition-colors w-full text-left"><LogOut className="h-6 w-6 text-destructive" /><span>Deconectare</span></button></motion.div>)}
              </motion.div>
              <motion.div className="p-6 mt-auto border-t border-border"><div className="flex justify-center gap-6">{socialLinks.map(link => (<Link key={link.label} href={link.href} aria-label={link.label} className="text-muted-foreground hover:text-primary"><link.icon/></Link>))}</div></motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}