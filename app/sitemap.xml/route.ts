// app/sitemap.xml/route.ts
import { ALL_SUBJECTS_OBJECT } from '@/lib/lessons';
import { MetadataRoute } from 'next';

const SITE_URL = 'https://invatam-impreuna.vercel.app';

export async function GET() {
  const staticRoutes = [
    '/', '/login', '/register', '/dashboard', '/profil', '/modele-teste',
    '/studiu', '/studiu-inteligent', '/contact', '/termeni', 
    '/politica-confidentialitate', '/cookies', '/blog',
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date().toISOString(),
  }));

  const dynamicRoutes = Object.entries(ALL_SUBJECTS_OBJECT || {}).flatMap(([subjectSlug, subjectData]) => {
    if (typeof subjectData !== 'object' || !subjectData || !Array.isArray(subjectData.chapters)) {
      return [];
    }
    
    const subjectRoute = {
      url: `${SITE_URL}/materii/${subjectSlug}`,
      lastModified: new Date().toISOString(),
    };

    const lessonRoutes = subjectData.chapters.flatMap((chapter: any) => {
      if (typeof chapter !== 'object' || !chapter || !Array.isArray(chapter.lessons)) {
        return [];
      }
      return chapter.lessons.map((lesson: any) => ({
        url: `${SITE_URL}/materii/${subjectSlug}/${lesson.slug}`,
        lastModified: new Date().toISOString(),
      }));
    });

    return [subjectRoute, ...lessonRoutes];
  });

  const allUrls = [...staticRoutes, ...dynamicRoutes];

  // Construim manual string-ul XML
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls.map(item => `
    <url>
      <loc>${item.url}</loc>
      <lastmod>${item.lastModified}</lastmod>
    </url>
  `).join('')}
</urlset>`;

  return new Response(xmlContent, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}