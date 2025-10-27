/**
 * @type {import('next').NextConfig}
 */

// =======================================================================
// PASUL 1: Importă și configurează PWA
// Se importă pachetul, se accesează funcția din `.default` și se APELEAZĂ imediat
// cu opțiunile PWA. Aceasta returnează o nouă funcție (un "wrapper").
// =======================================================================
const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

// =======================================================================
// PASUL 2: Definește configurația ta pentru Next.js
// Aici rămân setările tale normale.
// =======================================================================
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
};

// =======================================================================
// PASUL 3: Exportă configurația finală "îmbrăcată"
// Aici apelăm funcția "wrapper" creată la Pasul 1 și îi dăm ca parametru
// configurația ta Next.js.
// =======================================================================
module.exports = withPWA(nextConfig);