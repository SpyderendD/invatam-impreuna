'use client';

import React, { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList, 
  CommandSeparator 
} from '@/components/ui/command';
import { useAuth } from '@/context/AuthContext';
import { 
  BookMarked, 
  Calculator, 
  LineChart, 
  User, 
  Settings, 
  LogOut, 
  Sun, 
  Moon, 
  FileText, 
  Search, 
  Sparkles, 
  BookOpen,
  HelpCircle, // REPARAT: Adăugat importul lipsă
  ArrowRight,
  Zap
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { ALL_SUBJECTS_OBJECT } from '@/lib/lessons';
import { cn } from '@/lib/utils';

interface CommandMenuProps extends React.ComponentPropsWithoutRef<typeof Dialog> {}

export function CommandMenu({ ...props }: CommandMenuProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { setTheme } = useTheme();

  // Pregătim lista de lecții o singură dată (Memoized)
  const allLessons = useMemo(() => {
    return Object.values(ALL_SUBJECTS_OBJECT).flatMap((subject) => 
      subject.chapters.flatMap((chapter) => 
        chapter.lessons.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          subjectId: subject.id,
          subjectTitle: subject.title,
          chapterTitle: chapter.title
        }))
      )
    );
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    (props.onOpenChange as (open: boolean) => void)?.(false);
    command();
  }, [props]);

  // Shortcut CTRL+K / CMD+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        (props.onOpenChange as (open: boolean) => void)?.(true);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [props]);

  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0 shadow-2xl border-indigo-500/20 max-w-2xl bg-background rounded-2xl">
        <Command className="rounded-xl border-none">
          <div className="flex items-center border-b border-border/50 px-4">
            <Search className="mr-2 h-5 w-5 shrink-0 text-indigo-500" />
            <CommandInput 
              placeholder="Ce vrei să înveți azi? (ex: 'eseu', 'algoritmi', 'mate')" 
              className="h-14 border-none focus:ring-0 text-base placeholder:text-muted-foreground/60"
            />
          </div>
          
          <CommandList className="max-h-[480px] scrollbar-thin scrollbar-thumb-muted">
            <CommandEmpty className="py-14 text-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-indigo-500/5 rounded-full ring-1 ring-indigo-500/10">
                        <HelpCircle className="w-8 h-8 text-indigo-500/40" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-bold">Niciun rezultat găsit.</p>
                        <p className="text-xs text-muted-foreground">Încearcă cu alte cuvinte cheie sau caută materia.</p>
                    </div>
                </div>
            </CommandEmpty>

            {/* 1. MATERII - AFIȘATE CA CARDURI MICI */}
            <CommandGroup heading="Materiile Tale">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 p-2">
                {Object.values(ALL_SUBJECTS_OBJECT).map((subject) => (
                    <CommandItem 
                    key={subject.id}
                    onSelect={() => runCommand(() => router.push(`/materii/${subject.id}`))}
                    className="flex items-center gap-3 p-3 cursor-pointer rounded-xl hover:bg-indigo-500/5 transition-all group border border-transparent hover:border-indigo-500/20"
                    >
                    <div className="p-2 bg-indigo-600/10 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <BookOpen className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-sm">{subject.title}</span>
                    <ArrowRight className="ml-auto h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                    </CommandItem>
                ))}
              </div>
            </CommandGroup>

            <CommandSeparator className="opacity-50" />

            {/* 2. LECȚII (SUPER CAUTARE) */}
            <CommandGroup heading="Lecții Individuale">
              {allLessons.map((lesson) => (
                <CommandItem 
                  key={`${lesson.subjectId}-${lesson.id}`}
                  onSelect={() => runCommand(() => router.push(`/materii/${lesson.subjectId}/${lesson.id}`))}
                  className="flex items-center gap-4 py-3 px-4 cursor-pointer hover:bg-emerald-500/5"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-emerald-600">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <span className="font-bold text-sm truncate">{lesson.title}</span>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                        <span className="text-indigo-500">{lesson.subjectTitle}</span>
                        <span>•</span>
                        <span className="truncate">{lesson.chapterTitle}</span>
                    </div>
                  </div>
                  <Zap className="h-3 w-3 text-yellow-500 opacity-20" />
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            {/* 3. PAGINI ADMINISTRATIVE */}
            <CommandGroup heading="Navigație Rapidă">
              <CommandItem onSelect={() => runCommand(() => router.push('/modele-teste-EN'))} className="py-3">
                <Calculator className="mr-3 h-4 w-4 text-orange-500" />
                <span className="font-bold text-sm">Modele de Teste E.N.</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => router.push('/dashboard'))} className="py-3">
                <LineChart className="mr-3 h-4 w-4 text-fuchsia-500" />
                <span className="font-bold text-sm">Monitorizare Progres (Planner)</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => router.push('/blog'))} className="py-3">
                <Sparkles className="mr-3 h-4 w-4 text-yellow-500" />
                <span className="font-bold text-sm">Noutăți și Blog</span>
              </CommandItem>
            </CommandGroup>

            {user && (
              <>
                <CommandSeparator />
                <CommandGroup heading="Setări Cont">
                  <div className="grid grid-cols-2 gap-1 p-1">
                    <CommandItem onSelect={() => runCommand(() => router.push('/profil'))} className="rounded-lg">
                        <User className="mr-2 h-4 w-4 text-blue-500" />
                        <span className="text-xs font-bold uppercase">Profil</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push('/setari'))} className="rounded-lg">
                        <Settings className="mr-2 h-4 w-4 text-slate-500" />
                        <span className="text-xs font-bold uppercase">Setări</span>
                    </CommandItem>
                  </div>
                  <CommandItem onSelect={() => runCommand(logout)} className="!text-destructive mx-2 rounded-lg py-3 mt-1 bg-destructive/5 hover:!bg-destructive/10">
                    <LogOut className="mr-3 h-4 w-4" />
                    <span className="font-bold text-sm">Deconectează-mă</span>
                  </CommandItem>
                </CommandGroup>
              </>
            )}

            <CommandSeparator />

            {/* 4. PERSONALIZARE TEMĂ */}
            <CommandGroup heading="Aspect Site">
              <div className="flex gap-1 p-2">
                <CommandItem onSelect={() => runCommand(() => setTheme('light'))} className="flex-1 justify-center rounded-xl py-4 border border-border/40 hover:border-amber-500/40">
                    <Sun className="h-5 w-5 text-amber-500" />
                </CommandItem>
                <CommandItem onSelect={() => runCommand(() => setTheme('dark'))} className="flex-1 justify-center rounded-xl py-4 border border-border/40 hover:border-indigo-500/40">
                    <Moon className="h-5 w-5 text-indigo-400" />
                </CommandItem>
              </div>
            </CommandGroup>
          </CommandList>

          {/* FOOTER SMART */}
          <div className="flex items-center justify-between border-t border-border/30 px-4 py-3 bg-muted/30">
             <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
                <span className="flex items-center gap-1"><kbd className="rounded bg-background px-1.5 py-0.5 border">↵</kbd> Selectează</span>
                <span className="flex items-center gap-1"><kbd className="rounded bg-background px-1.5 py-0.5 border">↑↓</kbd> Navighează</span>
             </div>
             <div className="hidden sm:flex items-center gap-1.5">
                <span className="text-[10px] text-muted-foreground uppercase font-black">Shortcut:</span>
                <kbd className="rounded bg-background px-1.5 py-0.5 border font-mono text-[10px] font-bold">CTRL</kbd>
                <span className="text-xs">+</span>
                <kbd className="rounded bg-background px-1.5 py-0.5 border font-mono text-[10px] font-bold">K</kbd>
             </div>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}