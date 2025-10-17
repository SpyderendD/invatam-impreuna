'use client';

// --- PASUL 1: Importă `useTheme` din `next-themes` ---
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  // --- PASUL 2: Extrage `theme` și `setTheme` din noul hook ---
  const { theme, setTheme } = useTheme();

  // --- PASUL 3: Creează o funcție `toggleTheme` simplă ---
  // Aceasta va schimba tema între 'dark' și 'light'
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        className="sr-only peer"
        type="checkbox"
        // Controlează starea pe baza temei curente
        checked={theme === 'dark'}
        // Apelează funcția noastră de toggle la schimbare
        onChange={toggleTheme}
        aria-label="Comută tema întunecată/luminoasă"
      />
      <div
        // Stilurile tale CSS custom rămân exact la fel.
        className="
          w-24 h-12 rounded-full ring-0 peer duration-500 outline-none
          bg-gray-200 
          overflow-hidden
          before:flex before:items-center before:justify-center 
          before:content-['☀️'] 
          before:absolute before:h-10 before:w-10 before:top-1/2 
          before:bg-white 
          before:rounded-full before:left-1 
          before:-translate-y-1/2 before:transition-all before:duration-700 
          after:flex after:items-center after:justify-center
          after:content-['🌑'] 
          after:absolute after:rounded-full after:top-[4px] after:right-1 
          after:translate-y-full after:w-10 after:h-10 
          after:opacity-0 after:transition-all after:duration-700 
          after:bg-[hsl(var(--card))] 
          shadow-lg shadow-gray-400 
          peer-checked:shadow-lg peer-checked:shadow-gray-700 
          peer-checked:before:opacity-0 peer-checked:before:rotate-90 
          peer-checked:before:-translate-y-full 
          peer-checked:bg-[hsl(var(--muted))] 
          peer-checked:after:opacity-100 peer-checked:after:rotate-180 
          peer-checked:after:translate-y-0 
          "
      ></div>
    </label>
  );
}