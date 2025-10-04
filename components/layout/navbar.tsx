'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

import { Button, buttonVariants } from '@/components/ui/button';
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
  BookOpen,
  Menu,
  X,
  Instagram,
  Facebook,
  LogOut,
  User,
  Settings as SettingsIcon,
  Calculator,
  BookMarked,
  LineChart,
  HelpCircle,
  Youtube,
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Skeleton } from '@/components/ui/skeleton';

const navLinksDesktop = [
  { href: '/#materii', label: 'Materii' },
  { href: '/modele-teste', label: 'Modele teste E.N.' },
  { href: '/dashboard', label: 'Monitorizare' },
  { href: '/quizuri', label: 'Quizuri' },
  { href: '/contact', label: 'Contact' },
] as const;

const mobileNavLinks = [
  { href: '/#materii', label: 'Materii', icon: BookMarked },
  { href: '/modele-teste', label: 'Modele teste E.N.', icon: Calculator },
  { href: '/dashboard', label: 'Monitorizare', icon: LineChart },
  { href: '/quizuri', label: 'Quizuri', icon: HelpCircle },
  { href: '/contact', label: 'Contact', icon: HelpCircle },
] as const;

const socialLinks = [
  { href: 'https://www.instagram.com/spyder.end/', label: 'Instagram', icon: Instagram },
  { href: 'https://www.facebook.com/profile.php?id=61574503234752', label: 'Facebook', icon: Facebook },
  { href: 'https://www.youtube.com/@Spyderend_', label: 'YouTube', icon: Youtube },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth(); // Am adăugat authLoading

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const burgerButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (burgerButtonRef.current) {
      burgerButtonRef.current.setAttribute('aria-expanded', String(isOpen));
    }
  }, [isOpen]);

  const userName = user?.displayName || 'Utilizator';
  const userEmail = user?.email || '';
  const userImage = user?.photoURL || '';
  const userInitial = (userName || 'U').charAt(0).toUpperCase();

  const sidebarVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: { x: '0%', opacity: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  };
  const contentVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } } };
  const itemVariants = { hidden: { opacity: 0, x: 24 }, visible: { opacity: 1, x: 0, transition: { duration: 0.28 } } };

  async function handleLogout() {
    await logout(); // Funcția logout din context se ocupă de tot
    setIsOpen(false);
  }

  const headerClass = cn(
    'sticky top-0 z-40 border-b transition-colors',
    isScrolled || isOpen
      ? 'bg-card/70 supports-[backdrop-filter]:bg-card/40 backdrop-blur-xl border-border'
      : 'bg-transparent border-transparent'
  );

  const LinkDesktop = ({ href, label }: { href: string; label: string }) => {
    const active =
      (href === '/#materii' && pathname === '/') ||
      (href !== '/#materii' && pathname?.startsWith(href));

    return (
      <Link href={href} className={cn('relative text-sm font-medium px-3 py-2 rounded-full group overflow-hidden transition-colors', active ? 'text-primary-foreground' : 'text-foreground')}>
        <span className={cn('absolute inset-0 rounded-full opacity-0 scale-90 transition-all duration-300 ease-out -z-10', active ? 'bg-primary opacity-100 scale-100' : 'group-hover:opacity-100 group-hover:scale-100 bg-primary')} />
        <span className={cn('relative z-10 transition-colors', active ? 'text-primary-foreground' : 'group-hover:text-primary-foreground')}>{label}</span>
      </Link>
    );
  };

  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20, delay: 0.05 }}
        className={headerClass}
      >
        <nav className="container h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-primary">
            <BookOpen className="h-5 w-5" />
            <span className="hidden sm:inline">Învățăm Împreună</span>
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {navLinksDesktop.map((link) => (
              <LinkDesktop key={link.href} href={link.href} label={link.label} />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="hidden lg:flex items-center">
              {/* AICI ESTE FIX-UL: afișăm skeleton cât timp se încarcă starea */}
              {authLoading ? (
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-24 rounded-md" />
                  <Skeleton className="h-8 w-24 rounded-md" />
                </div>
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button aria-label="Deschide meniul utilizatorului">
                      <Avatar className="cursor-pointer h-9 w-9"><AvatarImage src={userImage} alt={userName} /><AvatarFallback>{userInitial}</AvatarFallback></Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel><p className="font-semibold">{userName}</p>{userEmail && <p className="text-xs text-muted-foreground font-normal">{userEmail}</p>}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild><Link href="/profil"><User className="mr-2 h-4 w-4" /> Profil</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/setari"><SettingsIcon className="mr-2 h-4 w-4" /> Setări</Link></DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive focus:bg-destructive/10"><LogOut className="mr-2 h-4 w-4" /> Deconectare</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="ghost" asChild><Link href="/login" className="text-primary">Autentificare</Link></Button>
                  <Button asChild><Link href="/register">Înregistrare</Link></Button>
                </>
              )}
            </div>

            <div className="lg:hidden">
              <button ref={burgerButtonRef} onClick={() => setIsOpen(true)} aria-label="Deschide meniul" aria-haspopup="dialog" aria-controls={isOpen ? 'mobile-drawer' : undefined} className="p-2 -mr-2 text-foreground">
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div key="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/40 z-[99] lg:hidden" aria-hidden>
            <motion.aside
              id="mobile-drawer"
              role="dialog"
              aria-modal="true"
              aria-labelledby="mobile-drawer-title"
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={(e) => e.stopPropagation()}
              className="fixed top-0 right-0 bottom-0 w-5/6 max-w-sm bg-card/70 supports-[backdrop-filter]:bg-card/50 backdrop-blur-xl z-[100] shadow-2xl flex flex-col border-l border-border"
            >
              <h2 id="mobile-drawer-title" className="sr-only">Meniu navigație</h2>
              <div className="p-4 flex items-center justify-end border-b border-border">
                <button onClick={() => setIsOpen(false)} aria-label="Închide meniul" className="p-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"><X className="h-5 w-5" /></button>
              </div>
              <motion.div className="flex flex-col flex-1 px-4" variants={contentVariants} initial="hidden" animate="visible">
                <motion.div variants={itemVariants}>
                  {user ? (
                    <Link href="/profil" onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-4 rounded-lg hover:bg-card/50 transition-colors">
                      <Avatar className="h-12 w-12 border-2 border-primary"><AvatarImage src={userImage} alt={userName} /><AvatarFallback className="text-lg bg-muted">{userInitial}</AvatarFallback></Avatar>
                      <div><p className="font-bold text-foreground">{userName}</p>{userEmail && <p className="text-sm text-muted-foreground">{userEmail}</p>}</div>
                    </Link>
                  ) : (
                    <div className="flex flex-col gap-3 p-4">
                      <Button asChild className="w-full"><Link href="/login" onClick={() => setIsOpen(false)}>Autentificare</Link></Button>
                      <Button variant="outline" asChild className="w-full bg-transparent"><Link href="/register" onClick={() => setIsOpen(false)}>Înregistrare</Link></Button>
                    </div>
                  )}
                </motion.div>
                <motion.hr variants={itemVariants} className="my-4 border-border" />
                <motion.nav variants={itemVariants} className="flex flex-col gap-2">
                  {mobileNavLinks.map((link) => (
                    <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className={cn('flex items-center gap-4 text-lg font-medium p-4 rounded-md hover:bg-card/50 transition-colors', pathname === link.href ? 'text-primary' : 'text-foreground')}>
                      <link.icon className="h-6 w-6 text-primary" />
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </motion.nav>
                <motion.hr variants={itemVariants} className="my-4 border-border" />
                {user && (
                  <motion.div variants={itemVariants} className="flex flex-col gap-2">
                    <Link href="/setari" onClick={() => setIsOpen(false)} className="flex items-center gap-4 text-lg font-medium text-foreground p-4 rounded-md hover:bg-card/50 transition-colors"><SettingsIcon className="h-6 w-6 text-primary" /><span>Setări</span></Link>
                    <button onClick={handleLogout} className="flex items-center gap-4 text-lg font-medium text-destructive p-4 rounded-md hover:bg-destructive/10 transition-colors w-full text-left"><LogOut className="h-6 w-6 text-destructive" /><span>Deconectare</span></button>
                  </motion.div>
                )}
              </motion.div>
              <motion.div className="p-6 mt-auto border-t border-border" variants={itemVariants}>
                <div className="flex justify-center gap-6">
                  {socialLinks.map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="text-muted-foreground hover:text-primary transition"><s.icon className="h-5 w-5" /></a>
                  ))}
                </div>
              </motion.div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}