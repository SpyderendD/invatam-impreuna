/** @type {import('next').NextConfig} */

// Mai întâi, importăm funcția de configurare PWA din pachetul instalat
const withPWA = require('@ducanh2912/next-pwa')({
  dest: 'public', // Directorul unde vor fi generate fișierele PWA (service worker, etc.)
  register: true, // Înregistrează automat service worker-ul
  skipWaiting: true, // Forțează service worker-ul să se activeze imediat
  // Poți dezactiva PWA pentru mediul de dezvoltare pentru a evita probleme de caching
  disable: process.env.NODE_ENV === 'development', 
});

// Aici este configurația ta existentă
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
};

// La final, exportăm configurația "îmbrăcată" în withPWA
module.exports = withPWA(nextConfig);