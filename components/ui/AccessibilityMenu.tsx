'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Accessibility, 
  X, 
  Type, 
  Minus, 
  Plus, 
  Eye, 
  Link as LinkIcon, 
  AlignLeft, 
  MonitorOff, 
  MousePointer2, 
  RotateCcw,
  Sun,
  Moon,
  Droplets,
  Palette,
  Contrast
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Tipuri de setări
type A11ySettings = {
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  contrast: 'normal' | 'high' | 'dark' | 'light';
  saturation: 'normal' | 'high' | 'low' | 'grayscale';
  highlightLinks: boolean;
  highlightTitles: boolean;
  readableFont: boolean;
  bigCursor: boolean;
  stopAnimations: boolean;
  nightMode: boolean;
};

const defaultSettings: A11ySettings = {
  fontSize: 100,
  lineHeight: 1.5,
  letterSpacing: 0,
  contrast: 'normal',
  saturation: 'normal',
  highlightLinks: false,
  highlightTitles: false,
  readableFont: false,
  bigCursor: false,
  stopAnimations: false,
  nightMode: false,
};

export default function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<A11ySettings>(defaultSettings);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    // 1. Font Size
    html.style.fontSize = `${settings.fontSize}%`;

    // 2. Line Height & Letter Spacing
    body.style.lineHeight = `${settings.lineHeight}`;
    body.style.letterSpacing = `${settings.letterSpacing}px`;

    // 3. Contrast & Colors (Clase CSS)
    html.classList.remove('contrast-high', 'contrast-dark', 'contrast-light');
    if (settings.contrast !== 'normal') html.classList.add(`contrast-${settings.contrast}`);

    // --- LOGICA FILTRE VIZUALE ---
    let filters = '';

    // Saturație
    if (settings.saturation === 'grayscale') filters += 'grayscale(100%) ';
    else if (settings.saturation === 'high') filters += 'saturate(200%) ';
    else if (settings.saturation === 'low') filters += 'saturate(50%) ';

    // Night Mode (Filtrul ROȘU INTENS)
    if (settings.nightMode) {
      // sepia(1) = face totul maroniu complet
      // hue-rotate(-50deg) = mută maroniul spre roșu/purpuriu
      // saturate(3) = face roșul foarte intens (să nu pară gri)
      // contrast(0.8) = scade puțin contrastul ca să nu fie strident pe negru
      filters += 'sepia(1) hue-rotate(-50deg) saturate(3) contrast(0.8) ';
    }

    // Aplicăm filtrele
    html.style.filter = filters;
    // -------------------------------------------------------------------

    // 4. Highlight Links
    if (settings.highlightLinks) body.classList.add('highlight-links');
    else body.classList.remove('highlight-links');

    // 5. Highlight Titles
    if (settings.highlightTitles) body.classList.add('highlight-titles');
    else body.classList.remove('highlight-titles');

    // 6. Readable Font
    if (settings.readableFont) body.classList.add('readable-font');
    else body.classList.remove('readable-font');

    // 7. Big Cursor
    if (settings.bigCursor) body.classList.add('big-cursor');
    else body.classList.remove('big-cursor');

    // 8. Stop Animations
    if (settings.stopAnimations) body.classList.add('stop-animations');
    else body.classList.remove('stop-animations');

  }, [settings]);

  const resetSettings = () => {
    setSettings(defaultSettings);
    document.documentElement.style.filter = '';
  };

  return (
    <>
      {/* Butonul Flotant */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-blue-600 text-white shadow-xl hover:scale-110 transition-transform focus:outline-none focus:ring-4 focus:ring-blue-300"
        aria-label="Meniu Accesibilitate"
        title="Meniu Accesibilitate"
      >
        <Accessibility className="w-8 h-8" />
      </button>

      {/* Meniul Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center sm:justify-end sm:items-end sm:p-6 bg-black/20 backdrop-blur-sm">
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-[#1a1a2e] w-full max-w-md max-h-[85vh] overflow-y-auto rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 bg-blue-600 text-white sticky top-0 z-10">
                <div className="flex items-center gap-2">
                   <Accessibility className="w-6 h-6" />
                   <h2 className="text-xl font-bold">Accesibilitate</h2>
                </div>
                <button type="button" onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded-full" aria-label="Închide meniu">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-8 text-gray-800 dark:text-gray-200">
                
                {/* 1. Ajustare Text */}
                <div className="space-y-4">
                  <h3 className="font-bold text-lg flex items-center gap-2 border-b pb-2">
                    <Type className="w-5 h-5 text-blue-500" /> Ajustări Text
                  </h3>
                  
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl flex items-center justify-between">
                    <span className="font-medium">Mărime Font</span>
                    <div className="flex items-center gap-3">
                      <Button size="icon" variant="outline" onClick={() => setSettings(s => ({ ...s, fontSize: Math.max(80, s.fontSize - 10) }))}>
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-12 text-center font-bold">{settings.fontSize}%</span>
                      <Button size="icon" variant="outline" onClick={() => setSettings(s => ({ ...s, fontSize: Math.min(150, s.fontSize + 10) }))}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                     <OptionButton 
                       active={settings.highlightTitles} 
                       onClick={() => setSettings(s => ({ ...s, highlightTitles: !s.highlightTitles }))}
                       icon={<Type />} 
                       label="Evidențiază Titluri" 
                     />
                     <OptionButton 
                       active={settings.highlightLinks} 
                       onClick={() => setSettings(s => ({ ...s, highlightLinks: !s.highlightLinks }))}
                       icon={<LinkIcon />} 
                       label="Evidențiază Link-uri" 
                     />
                     <OptionButton 
                       active={settings.readableFont} 
                       onClick={() => setSettings(s => ({ ...s, readableFont: !s.readableFont }))}
                       icon={<AlignLeft />} 
                       label="Font Dislexie" 
                     />
                     <OptionButton 
                       active={settings.letterSpacing > 0} 
                       onClick={() => setSettings(s => ({ ...s, letterSpacing: s.letterSpacing === 0 ? 2 : 0 }))}
                       icon={<Eye />} 
                       label="Spațiere Litere" 
                     />
                  </div>
                </div>

                {/* 2. Culori & Contrast */}
                <div className="space-y-4">
                  <h3 className="font-bold text-lg flex items-center gap-2 border-b pb-2">
                    <Palette className="w-5 h-5 text-purple-500" /> Culori & Lumină
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {/* BUTON MOD ROȘU */}
                    <OptionButton 
                       active={settings.nightMode} 
                       onClick={() => setSettings(s => ({ ...s, nightMode: !s.nightMode }))}
                       icon={<Moon className="text-red-500" />} 
                       label="Protecție Ochi (Roșu)" 
                    />
                    
                    <OptionButton 
                       active={settings.contrast === 'dark'} 
                       onClick={() => setSettings(s => ({ ...s, contrast: s.contrast === 'dark' ? 'normal' : 'dark' }))}
                       icon={<Contrast />} 
                       label="Contrast Întunecat" 
                    />
                    <OptionButton 
                       active={settings.contrast === 'light'} 
                       onClick={() => setSettings(s => ({ ...s, contrast: s.contrast === 'light' ? 'normal' : 'light' }))}
                       icon={<Sun />} 
                       label="Contrast Deschis" 
                    />
                    <OptionButton 
                       active={settings.saturation === 'grayscale'} 
                       onClick={() => setSettings(s => ({ ...s, saturation: s.saturation === 'grayscale' ? 'normal' : 'grayscale' }))}
                       icon={<Droplets className="text-gray-400" />} 
                       label="Monocrom" 
                    />
                  </div>
                </div>

                {/* 3. Navigare */}
                <div className="space-y-4">
                  <h3 className="font-bold text-lg flex items-center gap-2 border-b pb-2">
                    <MousePointer2 className="w-5 h-5 text-green-500" /> Navigare
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <OptionButton 
                       active={settings.bigCursor} 
                       onClick={() => setSettings(s => ({ ...s, bigCursor: !s.bigCursor }))}
                       icon={<MousePointer2 />} 
                       label="Cursor Mare" 
                    />
                    <OptionButton 
                       active={settings.stopAnimations} 
                       onClick={() => setSettings(s => ({ ...s, stopAnimations: !s.stopAnimations }))}
                       icon={<MonitorOff />} 
                       label="Oprește Animațiile" 
                    />
                  </div>
                </div>

                {/* Reset */}
                <Button 
                  variant="destructive" 
                  className="w-full py-6 text-lg rounded-xl"
                  onClick={resetSettings}
                >
                  <RotateCcw className="mr-2 h-5 w-5" /> Resetează Setările
                </Button>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

// Componenta Helper pentru Butoane
function OptionButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all
        ${active 
          ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-105' 
          : 'bg-gray-50 dark:bg-gray-800 border-transparent hover:border-blue-300 hover:bg-gray-100 dark:hover:bg-gray-700'
        }
      `}
    >
      <div className={`p-2 rounded-full ${active ? 'bg-white/20' : 'bg-white dark:bg-black/20'} `}>
        {React.cloneElement(icon as React.ReactElement, { className: "w-6 h-6" })}
      </div>
      <span className="text-xs font-semibold text-center leading-tight">{label}</span>
    </button>
  );
}