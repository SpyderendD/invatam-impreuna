'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';
type Ctx = {
theme: Theme;
setTheme: (t: Theme) => void;
toggleTheme: () => void;
};

const ThemeContext = createContext<Ctx | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
const [theme, setThemeState] = useState<Theme>('light');

// La prima montare: dacă avem localStorage -> folosește-l; altfel detectează tema OS.
useEffect(() => {
try {
const stored = (localStorage.getItem('theme') as Theme | null);
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const initial: Theme = stored === 'light' || stored === 'dark'
? stored
: (prefersDark ? 'dark' : 'light');


  setThemeState(initial);
  document.documentElement.classList.toggle('dark', initial === 'dark');
  document.documentElement.setAttribute('data-theme', initial);
} catch {}
}, []);

const setTheme = (t: Theme) => {
try {
setThemeState(t);
localStorage.setItem('theme', t);
document.documentElement.classList.toggle('dark', t === 'dark');
document.documentElement.setAttribute('data-theme', t);
} catch {}
};

const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

return (
<ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
{children}
</ThemeContext.Provider>
);
}

export function useTheme() {
const ctx = useContext(ThemeContext);
if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
return ctx;
}