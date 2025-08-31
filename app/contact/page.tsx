'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Mail,
    MapPin,
    Clock,
    Send,
    CheckCircle2,
    AlertCircle,
    Facebook,
    Instagram,
    Youtube,
    Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import HeartRating from '@/components/HeartRating'; // vezi componenta trimisă anterior

export default function ContactPage() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        // Snapshot stabil al formularului, înainte de await (ca să nu devină null)
        const formEl = e.currentTarget;
        const form = new FormData(formEl);

        const payload = {
            name: String(form.get('name') || ''),
            email: String(form.get('email') || ''),
            subject: String(form.get('subject') || ''),
            message: String(form.get('message') || ''),
            company: String(form.get('company') || ''), // honeypot anti-bot
        };

        if (!payload.name || !payload.email || !payload.message) {
            toast({
                title: 'Completează câmpurile obligatorii',
                description: 'Nume, Email și Mesaj sunt obligatorii.',
                variant: 'destructive',
            });
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            let data: any = {};
            try {
                data = await res.json();
            } catch { }

            if (!res.ok) {
                throw new Error(data?.error || 'Eroare necunoscută');
            }

            toast({
                title: 'Mesaj trimis!',
                description: data?.message || 'Îți mulțumim, îți voi răspunde cât pot de repede.',
                duration: 3500,
            });

            formEl.reset();
        } catch (err: any) {
            toast({
                title: 'Nu am reușit să trimitem mesajul',
                description: err?.message || 'Te rog încearcă din nou.',
                variant: 'destructive',
                duration: 5000,
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-full bg-background text-foreground">
            <div className="mx-auto max-w-5xl px-4 py-12">
                {/* Header + scurt context */}
                <header className="text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Contactează-ne</h1>
                    <p className="mt-3 text-muted-foreground">
                        Sunt elev și am construit acest loc ca să învăț și să ajut. Răspund cu drag când am timp.
                    </p>
                </header>

                {/* Mesajul tău personal */}
                <section className="mt-8">
                    <div className="rounded-2xl border bg-card/70 p-6 md:p-8">
                        <div className="flex items-center gap-2 text-primary font-semibold">
                            <Heart className="h-5 w-5" />
                            <span>Un mesaj de la mine</span>
                        </div>
                        <div className="mt-3 space-y-3 text-sm sm:text-base leading-relaxed text-foreground/90">
                            <p>Bine ai venit! 🌍</p>
                            <p>
                                „Acest site nu a apărut peste noapte. În spatele lui sunt ore lungi de muncă, momente de oboseală, frustrare și gânduri de a renunța. Dar, de fiecare dată, mi-am amintit de ce am început.

                                Am vrut să creez un loc unde învățarea să fie mai clară și mai ușoară, nu doar pentru mine, ci și pentru oricine are nevoie. Pentru mine, fiecare rând scris aici, fiecare pagină creată, a însemnat o luptă între a mă simți pierdut și dorința de a reuși.

                                Poate nu este un site perfect, dar este plin de suflet. Este o parte din mine, din dorința mea de a face bine și de a lăsa ceva care să rămână și după ce eu nu voi mai fi doar „un elev”.

                                Dacă citești asta, înseamnă că ai ajuns într-un loc construit cu multă trudă și cu speranța că va ajuta, măcar puțin. Și dacă te-a atins cumva, te rog să duci mai departe acest mesaj: să fim mai buni unii cu alții, să nu fim răi, să nu uităm că fiecare om poartă o luptă pe care ceilalți nu o văd.

                                Acest site e dovada mea că, oricât de greu ar fi, poți să transformi durerea și efortul în ceva frumos. Și dacă într-o zi cineva îl va promova, nu va fi despre mine, ci despre ideea că și din lupta unui singur om poate să se nască o lumină pentru alții. 🌟✨ ”
                            </p>
                        </div>
                    </div>
                </section>

                <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Info de contact */}
                    <aside className="lg:col-span-1">
                        <div className="rounded-2xl border bg-card p-6 space-y-6">
                            <section className="space-y-3">
                                <h2 className="font-semibold text-lg">Date de contact</h2>
                                <div className="flex items-start gap-3">
                                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                                    <div>
                                        <div className="text-sm text-muted-foreground">Email</div>
                                        <Link href="mailto:spyderend0@gmail.com" className="hover:underline">
                                            spyderend0@gmail.com
                                        </Link>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Clock className="h-5 w-5 text-primary mt-0.5" />
                                    <div>
                                        <div className="text-sm text-muted-foreground">Program răspuns</div>
                                        <div>Sunt elev; răspund când am timp (de obicei Luni–Vineri, 09:00–18:00).</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                                    <div>
                                        <div className="text-sm text-muted-foreground">Din România, pentru toți</div>
                                        <div>Online, oriunde te afli</div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3 className="font-semibold text-lg mb-3">Urmărește-ne</h3>
                                <div className="flex items-center gap-2">
                                    <Link
                                        href="https://www.facebook.com/profile.php?id=61574503234752"
                                        target="_blank"
                                        className="h-9 w-9 rounded-lg bg-card/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition"
                                    >
                                        <Facebook className="h-4 w-4" />
                                    </Link>
                                    <Link
                                        href="https://www.instagram.com/spyder.end/"
                                        target="_blank"
                                        className="h-9 w-9 rounded-lg bg-card/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition"
                                    >
                                        <Instagram className="h-4 w-4" />
                                    </Link>
                                    <Link
                                        href="https://www.youtube.com/@Spyderend_"
                                        target="_blank"
                                        className="h-9 w-9 rounded-lg bg-card/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition"
                                    >
                                        <Youtube className="h-4 w-4" />
                                    </Link>
                                </div>
                            </section>

                            <div className="rounded-xl border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                                Preferi email direct? Scrie la adresa de mai sus; formularul trimite în același inbox.
                            </div>
                        </div>
                    </aside>

                    {/* Formular */}
                    <section className="lg:col-span-2">
                        <form onSubmit={onSubmit} className="rounded-2xl border bg-card p-6 md:p-8">
                            {/* Honeypot anti-bot */}
                            <input
                                type="text"
                                name="company"
                                tabIndex={-1}
                                autoComplete="off"
                                className="hidden"
                                aria-hidden="true"
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="name">Nume</Label>
                                    <Input id="name" name="name" placeholder="Numele tău" required />
                                </div>
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" name="email" type="email" placeholder="exemplu@email.com" required />
                                </div>
                            </div>

                            <div className="mt-4">
                                <Label htmlFor="subject">Subiect</Label>
                                <Input id="subject" name="subject" placeholder="Ex: Feedback, Întrebare, Colaborare..." />
                            </div>

                            <div className="mt-4">
                                <Label htmlFor="message">Mesaj</Label>
                                <Textarea id="message" name="message" placeholder="Spune-mi cu ce te pot ajuta" rows={6} required />
                            </div>

                            <div className="mt-6 flex flex-col-reverse sm:flex-row items-center gap-3">
                                <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                                    {loading ? (
                                        <>
                                            <Send className="mr-2 h-4 w-4 animate-pulse" />
                                            Se trimite...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="mr-2 h-4 w-4" />
                                            Trimite mesajul
                                        </>
                                    )}
                                </Button>

                                <div className="w-full sm:flex-1 text-center sm:text-right text-xs text-muted-foreground">
                                    Datele tale sunt în siguranță. Nu trimitem spam.
                                </div>
                            </div>
                        </form>

                        {/* Cards info + Rating */}
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="rounded-xl border p-4 bg-muted/20">
                                <div className="flex items-center gap-2 font-medium">
                                    <AlertCircle className="h-4 w-4 text-primary" />
                                    Raportare erori
                                </div>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Ai găsit un bug sau o lecție cu probleme? Descrie pașii și pagina – mă ajuți enorm!
                                </p>
                            </div>
                        </div>

                        <div className="mt-10 text-center">
                            <p className="text-sm text-muted-foreground mb-2">
                                Îți place proiectul? Dă-i o notă (1 = slab, 10 = foarte bun):
                            </p>
                            <HeartRating slug="contact-feedback" />
                        </div>
                    </section>
                </div>

                {/* CTA secundar */}
                <div className="mt-12 text-center text-sm text-muted-foreground">
                    Sau scrie direct la{' '}
                    <Link href="mailto:spyderend0@gmail.com" className="text-primary hover:underline">
                        spyderend0@gmail.com
                    </Link>
                    .
                </div>
            </div>
        </div>
    );
}