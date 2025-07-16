/** @type {import('next').NextConfig} */
const nextConfig = {};
nextConfig.reactStrictMode = true; // Activați modul strict React pentru a ajuta la identificarea problemelor în aplicație
nextConfig.swcMinify = true; // Activați minificarea SWC pentru a reduce dimensiunea bundle-ului JavaScript
nextConfig.output = 'standalone'; // Asigurați-vă că aplicația este pregătită pentru a fi rulată în mod standalone
nextConfig.typescript = {
  ignoreBuildErrors: true, // Ignoră erorile de tip TypeScript în  
  // timpul construcției, util pentru dezvoltare, dar nu recomandat în producție
};

module.exports = nextConfig;