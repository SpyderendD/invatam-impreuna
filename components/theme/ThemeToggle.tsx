// src/components/theme/ThemeToggle.tsx
'use client';

import { useTheme } from '@/context/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        className="sr-only peer"
        type="checkbox"
        checked={theme === 'dark'} // Controlează starea checkbox-ului
        onChange={toggleTheme}     // Comută tema la click
        aria-label="Comută tema întunecată/luminoasă"
      />
      <div
        // Stiluri direct din exemplul tău, adaptate pentru a folosi variabile HSL
        className="
          w-24 h-12 rounded-full ring-0 peer duration-500 outline-none
          
          /* Fundalul comutatorului */
          bg-gray-200 /* Light mode: gri deschis */
          peer-checked:bg-[hsl(var(--background))] /* Dark mode: devine fundalul aplicației (negru) */
          
          overflow-hidden
          
          /* Stiluri pentru Soare (light mode) */
          before:flex before:items-center before:justify-center 
          before:content-['☀️'] 
          before:absolute before:h-10 before:w-10 before:top-1/2 
          before:bg-white before:rounded-full before:left-1 
          before:-translate-y-1/2 before:transition-all before:duration-700 
          
          /* Stiluri pentru Lună (dark mode) */
          after:flex after:items-center after:justify-center
          after:content-['🌑'] 
          after:absolute after:rounded-full after:top-[4px] after:right-1 
          after:translate-y-full after:w-10 after:h-10 
          after:opacity-0 after:transition-all after:duration-700 
          after:bg-[hsl(var(--card))] /* Luna va avea culoarea cardului din tema dark (negru) */
          
          /* Umbre */
          shadow-lg shadow-gray-400 /* Umbra în light mode */
          peer-checked:shadow-lg peer-checked:shadow-gray-700 /* Umbra în dark mode */
          
          /* Animații de comutare */
          peer-checked:before:opacity-0 peer-checked:before:rotate-90 
          peer-checked:before:-translate-y-full /* Ascunde soarele */
          
          peer-checked:after:opacity-100 peer-checked:after:rotate-180 
          peer-checked:after:translate-y-0 /* Arată luna */
          "
      ></div>
    </label>
  );
}