// app/modele-teste/page.tsx
'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Globe, ExternalLink, Copy, Check, Search, Link as LinkIcon, ShieldAlert } from 'lucide-react';

type SiteLink = {
  id: string;
  title: string;
  url: string;
  tags?: string[];
};

type SiteGroup = {
  id: string;
  domain: string;
  label: string;
  description: string;
  links: SiteLink[];
};

// Surse recomandate (poți ajusta titlurile/URL-urile)
const SOURCES: SiteGroup[] = [
  {
    id: 'subiecte',
    domain: 'subiecte.edu.ro',
    label: 'Subiecte.edu.ro (Ministerul Educației)',
    description: 'Arhivele anuale cu subiecte și bareme pentru Evaluarea Națională.',
    links: [
      { id: 'sub-2024', title: 'Arhivă 2024 – EN', url: 'https://subiecte.edu.ro/2024/', tags: ['oficial', 'arhivă', '2024'] },
      { id: 'sub-2023', title: 'Arhivă 2023 – EN', url: 'https://subiecte.edu.ro/2023/', tags: ['oficial', 'arhivă', '2023'] },
      { id: 'sub-2022', title: 'Arhivă 2022 – EN', url: 'https://subiecte.edu.ro/2022/', tags: ['oficial', 'arhivă', '2022'] },
    ],
  },
  {
    id: 'edu',
    domain: 'www.edu.ro',
    label: 'Edu.ro (Ministerul Educației)',
    description: 'Informații oficiale despre examene și calendare pentru EN.',
    links: [
      { id: 'edu-root', title: 'Pagina principală – informații EN', url: 'https://www.edu.ro/', tags: ['oficial', 'informații'] },
      // Poți adăuga aici pagini specifice pentru EN, dacă ai URL-uri directe.
    ],
  },
  {
    id: 'heiprofu',
    domain: 'heiprofu.ro',
    label: 'HeiProfu – Subiecte EN VIII (Matematică)',
    description: 'Colecție utilă de linkuri pentru subiecte EN8 la Matematică.',
    links: [
      {
        id: 'heiprofu-en8',
        title: 'Subiecte EN8 – Matematică',
        url: 'https://heiprofu.ro/examene-matematica/evaluare-nationala-clasa-a-8-a/subiecte-en8/',
        tags: ['matematică', 'subiecte', 'barem'],
      },
    ],
  },
  {
    id: 'e3',
    domain: 'www.e3.ro',
    label: 'E3 – Resurse Evaluarea Națională',
    description: 'Materiale și resurse utile pentru EN.',
    links: [
      { id: 'e3-root', title: 'E3 – Pagina principală', url: 'https://www.e3.ro/', tags: ['resurse', 'materiale'] },
    ],
  },
];

export default function ModeleTesteLinksPage() {
  const [q, setQ] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();
    if (!text) return SOURCES;
    return SOURCES.map(group => {
      const matchGroup = group.label.toLowerCase().includes(text) || group.domain.toLowerCase().includes(text);
      const matchedLinks = group.links.filter(
        l =>
          l.title.toLowerCase().includes(text) ||
          l.url.toLowerCase().includes(text) ||
          (l.tags || []).some(t => t.toLowerCase().includes(text))
      );
      if (matchGroup) return { ...group, links: group.links };
      if (matchedLinks.length) return { ...group, links: matchedLinks };
      return { ...group, links: [] };
    }).filter(g => g.links.length > 0);
  }, [q]);

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-lora tracking-tight">Modele teste Evaluarea Națională</h1>
          <p className="text-muted-foreground mt-1">
            Găsești mai jos linkuri direct către site-urile sursă (subiecte + bareme). Descarci de acolo varianta corectă.
          </p>
        </motion.div>

        {/* Căutare */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-8 flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Caută după site, titlu sau tag (ex: 2024, matematică, română)..."
              value={q}
              onChange={e => setQ(e.target.value)}
            />
          </div>
          <div className="md:col-span-4 flex items-center justify-end text-xs text-muted-foreground gap-2">
            <ShieldAlert className="h-4 w-4" />
            Dacă un link nu mai funcționează, intră pe pagina principală a site-ului și navighează la secțiunea Evaluarea Națională.
          </div>
        </div>

        {/* Liste surse */}
        <div className="space-y-6">
          {filtered.map(group => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border"
            >
              <Card className="border-0">
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-lg">{group.label}</CardTitle>
                        <CardDescription className="flex flex-wrap items-center gap-2">
                          <Badge variant="secondary">{group.domain}</Badge>
                          <span className="text-xs">{group.description}</span>
                        </CardDescription>
                      </div>
                    </div>
                    <Button asChild variant="outline">
                      <a href={`https://${group.domain}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Deschide site
                      </a>
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {group.links.map(link => (
                    <div
                      key={link.id}
                      className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 rounded-md border p-3"
                    >
                      <div className="space-y-1">
                        <p className="font-medium flex items-center gap-2">
                          <LinkIcon className="h-4 w-4 text-muted-foreground" />
                          {link.title}
                        </p>
                        <p className="text-xs text-muted-foreground break-all">{link.url}</p>
                        <div className="flex flex-wrap gap-1">
                          {(link.tags || []).map(t => (
                            <Badge key={t} variant="outline" className="text-[10px]">
                              {t}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 md:justify-end">
                        <Button asChild variant="outline">
                          <a href={link.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Deschide
                          </a>
                        </Button>
                        <Button
                          variant={copied === link.url ? 'default' : 'secondary'}
                          onClick={() => handleCopy(link.url)}
                        >
                          {copied === link.url ? (
                            <>
                              <Check className="h-4 w-4 mr-2" /> Copiat
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-2" /> Copiază link
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="mt-10 text-center text-muted-foreground">
            Nu am găsit rezultate pentru filtrul introdus. Încearcă alt cuvânt sau resetează căutarea.
          </div>
        )}
      </main>
    </div>
  );
}