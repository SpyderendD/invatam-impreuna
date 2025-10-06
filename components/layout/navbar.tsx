'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { CommandMenu } from '@/components/search/CommandMenu'; // NOU: Importăm bara de căutare

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { BookOpen, Menu, X, Instagram, Facebook, LogOut, User, Settings, Calculator, BookMarked, LineChart, HelpCircle, Youtube, Search } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Skeleton } from '@/components/ui/skeleton';

const navLinks = [
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
  const { user, loading: authLoading, logout } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openCommand, setOpenCommand] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  // Efect pentru blocarea scroll-ului și shortcut-uri
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || e.key === '/') {
        e.preventDefault();
        setOpenCommand((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', down);
    };
  }, [isOpen]);

  // Efect pentru stilul la scroll
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  const headerClass = cn(
    'sticky top-0 z-40 border-b transition-all duration-300',
    isScrolled || isOpen
      ? 'bg-card/70 supports-[backdrop-filter]:bg-card/40 backdrop-blur-xl border-border'
      : 'bg-transparent border-transparent'
  );

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className={headerClass}
      >
        <nav className="container h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-primary">
            <BookOpen className="h-5 w-5" />
            <span className="hidden sm:inline">Învățăm Împreună</span>
          </Link>

          {/* Navigație Desktop cu "Magic Link" Effect */}
          <div 
            className="hidden lg:flex items-center gap-2 bg-card/50 border border-border rounded-full px-2 shadow-sm"
            onMouseLeave={() => setHoveredLink(null)}
          >
            {navLinks.map((link) => {
              const isActive = (pathname === '/' && link.href === '/#materii') || (link.href !== '/#materii' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onMouseEnter={() => setHoveredLink(link.href)}
                  className={cn('relative text-sm font-medium px-4 py-2 rounded-full transition-colors', isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground')}
                >
                  {isActive || hoveredLink === link.href ? (
                    <motion.div
                      layoutId="active-link-pill"
                      className="absolute inset-0 bg-primary rounded-full z-0"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  ) : null}
                  <span className="relative z-10 transition-colors duration-300">
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setOpenCommand(true)} aria-label="Deschide căutarea">
              <Search className="h-5 w-5" />
            </Button>
            <ThemeToggle />
            
            <div className="hidden lg:flex items-center">
              {authLoading ? (
                <Skeleton className="h-10 w-24 rounded-full" />
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button aria-label="Deschide meniul utilizatorului">
                      <Avatar className="cursor-pointer h-9 w-9 border-2 border-transparent hover:border-primary transition-colors"><AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} /><AvatarFallback>{(user.displayName || 'U').charAt(0)}</AvatarFallback></Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel><p className="font-semibold">{user.displayName}</p><p className="text-xs text-muted-foreground font-normal">{user.email}</p></DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild><Link href="/profil"><User className="mr-2 h-4 w-4" /> Profil</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/setari"><Settings className="mr-2 h-4 w-4" /> Setări</Link></DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive focus:bg-destructive/10"><LogOut className="mr-2 h-4 w-4" /> Deconectare</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="ghost" asChild><Link href="/login">Autentificare</Link></Button>
                  <Button asChild><Link href="/register">Înregistrare</Link></Button>
                </>
              )}
            </div>

            <div className="lg:hidden">
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)} aria-label="Deschide meniul">
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Meniu Mobil */}
      <AnimatePresence>
        {isOpen && (
          <motion.div key="mobile-menu" className="fixed inset-0 z-50 lg:hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="absolute inset-0 bg-black/50" />
            <motion.aside
              initial={{ x: '100%' }} animate={{ x: '0%' }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-5/6 max-w-sm bg-card flex flex-col border-l border-border"
            >
              <div className="p-4 flex items-center justify-between border-b border-border">
                <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-lg font-bold text-primary"><BookOpen className="h-5 w-5" /><span>Învățăm Împreună</span></Link>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Închide meniul"><X className="h-5 w-5" /></Button>
              </div>
              <div className="flex-1 p-4 overflow-y-auto">
                {user ? (
                  <Link href="/profil" onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 mb-4">
                    <Avatar className="h-12 w-12"><AvatarImage src={user.photoURL || ''} /><AvatarFallback className="text-lg">{user.displayName?.charAt(0)}</AvatarFallback></Avatar>
                    <div><p className="font-bold text-foreground">{user.displayName}</p><p className="text-sm text-muted-foreground">{user.email}</p></div>
                  </Link>
                ) : (
                  <div className="grid grid-cols-2 gap-3 p-2 mb-4">
                    <Button asChild className="w-full"><Link href="/login" onClick={() => setIsOpen(false)}>Autentificare</Link></Button>
                    <Button variant="outline" asChild className="w-full"><Link href="/register" onClick={() => setIsOpen(false)}>Înregistrare</Link></Button>
                  </div>
                )}
                <nav className="flex flex-col gap-2">
                  {navLinks.map((link) => {
                    const isActive = (pathname === '/' && link.href === '/#materii') || (link.href !== '/#materii' && pathname.startsWith(link.href));
                    return(
                      <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className={cn('flex items-center gap-4 text-lg font-medium p-4 rounded-md transition-colors', isActive ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted/50')}>
                        <link.icon className="h-6 w-6" />
                        <span>{link.label}</span>
                      </Link>
                    )
                  })}
                </nav>
                {user && (
                  <>
                    <hr className="my-4 border-border" />
                    <div className="flex flex-col gap-2">
                      <Link href="/setari" onClick={() => setIsOpen(false)} className="flex items-center gap-4 text-lg font-medium text-foreground p-4 rounded-md hover:bg-muted/50"><Settings className="h-6 w-6" /><span>Setări</span></Link>
                      <button onClick={handleLogout} className="flex items-center gap-4 text-lg font-medium text-destructive p-4 rounded-md hover:bg-destructive/10 w-full text-left"><LogOut className="h-6 w-6" /><span>Deconectare</span></button>
                    </div>
                  </>
                )}
              </div>
              <div className="p-6 mt-auto border-t border-border">
                <div className="flex justify-center gap-6">
                  {socialLinks.map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="text-muted-foreground hover:text-primary transition"><s.icon className="h-5 w-5" /></a>
                  ))}
                </div>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
      <CommandMenu open={openCommand} onOpenChange={setOpenCommand} />
    </>
  );
}