// components/study/CreateDeckDialog.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Definim tipul pentru un pachet nou
interface Deck {
    id: string;
    name: string;
    description: string;
    cardCount: number;
}

// Definim ce props va primi componenta
interface CreateDeckDialogProps {
  onDeckCreated: (newDeck: Deck) => void; // O funcție care va fi apelată cu noul pachet
}

export function CreateDeckDialog({ onDeckCreated }: CreateDeckDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user || !name.trim()) return;

    setIsSubmitting(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/study/decks', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Nu am putut crea pachetul.');
      }

      toast({
        title: 'Succes!',
        description: `Pachetul "${name}" a fost creat.`,
      });
      
      onDeckCreated(data); // Trimitem noul pachet înapoi la componenta părinte
      setName('');
      setDescription('');
      setOpen(false); // Închidem dialogul

    } catch (error: any) {
      toast({
        title: 'Eroare la creare',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Creează Pachet Nou
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Creează un Pachet Nou de Studiu</DialogTitle>
          <DialogDescription>
            Dă-i un nume și o descriere pachetului tău de flashcarduri. Poți adăuga cardurile mai târziu.
          </DialogDescription>
        </DialogHeader>
        <form id="create-deck-form" onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nume
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="Ex: Verbe neregulate"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Descriere
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="(Opțional) Ex: Timpurile verbelor la modul indicativ"
            />
          </div>
        </form>
        <DialogFooter>
          <Button type="submit" form="create-deck-form" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isSubmitting ? 'Se creează...' : 'Creează Pachet'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}