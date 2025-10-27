/**
 * @type {import('next').NextConfig}
 */

// Pasul 1: Importă funcția 'withPWA' din pachetul instalat.
// Acum, constanta 'withPWA' conține funcția necesară.
const withPWA = require('@ducanh2912/next-pwa');

// Pasul 2: Definește configurația ta standard pentru Next.js.
// Acestea sunt setările pe care le aveai deja.
const nextConfig = {
  reactStrictMode: true, // Activează modul strict React
  swcMinify: true,       // Folosește compilatorul SWC pentru a minifica codul mai rapid
  output: 'standalone',  // Optimizează output-ul pentru deployment-uri standalone (ex: Docker)
  typescript: {
    // Ignoră erorile de TypeScript în timpul build-ului.
    // Recomandat să fie 'false' în producția finală pentru a prinde erori.
    ignoreBuildErrors: true,
  },
};

// Pasul 3: Exportă configurația finală, combinată.
// Apelăm funcția 'withPWA' și îi dăm un obiect de configurare.
// Acest obiect conține atât opțiunile pentru PWA, cât și configurația ta Next.js.
module.exports = withPWA({
  // --- ÎNCEPUT Configurare PWA ---
  dest: 'public', // Directorul unde vor fi generate fișierele PWA (ex: sw.js)
  register: true, // Înregistrează automat Service Worker-ul în browserul clientului
  skipWaiting: true, // Forțează noul Service Worker să se activeze imediat după instalare
  disable: process.env.NODE_ENV === 'development', // Dezactivează PWA în mediul de dezvoltare pentru a evita probleme de cache
  // --- SFÂRȘIT Configurare PWA ---

  // Aici includem restul configurației tale Next.js folosind "spread operator" (...)
  ...nextConfig,
});