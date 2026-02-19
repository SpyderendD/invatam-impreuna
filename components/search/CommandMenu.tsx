'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { useAuth } from '@/context/AuthContext';
import { BookMarked, Calculator, LineChart, HelpCircle, User, Settings, LogOut, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

// Tip pentru a putea extinde props-urile dialogului
interface CommandMenuProps extends React.ComponentPropsWithoutRef<typeof Dialog> {}

export function CommandMenu({ ...props }: CommandMenuProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { setTheme } = useTheme();

  // Funcție pentru a rula acțiuni (navigare, etc.) și a închide dialogul
  const runCommand = React.useCallback((command: () => unknown) => {
    // Aici, onOpenChange este primit prin {...props} de la Navbar
    (props.onOpenChange as (open: boolean) => void)?.(false);
    command();
  }, [props]);

  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0 shadow-2xl">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground">
          <CommandInput placeholder="Caută o pagină sau o acțiune..." />
          <CommandList>
            <CommandEmpty>Niciun rezultat găsit.</CommandEmpty>
            <CommandGroup heading="Navigație">
              <CommandItem onSelect={() => runCommand(() => router.push('/#materii'))}><BookMarked className="mr-2 h-4 w-4" /><span>Materii</span></CommandItem>
              <CommandItem onSelect={() => runCommand(() => router.push('/modele-teste-EN'))}><Calculator className="mr-2 h-4 w-4" /><span>Modele teste E.N.</span></CommandItem>
              <CommandItem onSelect={() => runCommand(() => router.push('/dashboard'))}><LineChart className="mr-2 h-4 w-4" /><span>Monitorizare</span></CommandItem>
            </CommandGroup>
            {user && (
              <>
                <CommandSeparator />
                <CommandGroup heading="Contul meu">
                  <CommandItem onSelect={() => runCommand(() => router.push('/profil'))}><User className="mr-2 h-4 w-4" /><span>Profil</span></CommandItem>
                  <CommandItem onSelect={() => runCommand(() => router.push('/setari'))}><Settings className="mr-2 h-4 w-4" /><span>Setări</span></CommandItem>
                  <CommandItem onSelect={() => runCommand(logout)} className="!text-destructive"><LogOut className="mr-2 h-4 w-4" /><span>Deconectare</span></CommandItem>
                </CommandGroup>
              </>
            )}
            <CommandSeparator />
            <CommandGroup heading="Temă">
              <CommandItem onSelect={() => runCommand(() => setTheme('light'))}><Sun className="mr-2 h-4 w-4" /><span>Luminos</span></CommandItem>
              <CommandItem onSelect={() => runCommand(() => setTheme('dark'))}><Moon className="mr-2 h-4 w-4" /><span>Întunecat</span></CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}