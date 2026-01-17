import { MetadataRoute } from 'next';
import { ALL_SUBJECTS_OBJECT } from '@/lib/lessons';

const SITE_URL = 'https://invatam-impreuna.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  // 1. Rute Statice
  const staticRoutes = [
    '',
    '/login',
    '/register',
    '/profil',
    '/modele-teste',
    '/contact',
    '/termeni',
    '/politica-confidentialitate',
    '/cookies',
    '/metode-invatare',
    '/eu'
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // 2. Rute Dinamice (Materii și Lecții)
  const dynamicRoutes = Object.entries(ALL_SUBJECTS_OBJECT || {}).flatMap(([subjectSlug, subjectData]) => {
    // Verificări de siguranță
    // @ts-ignore
    if (typeof subjectData !== 'object' || !subjectData || !Array.isArray(subjectData.chapters)) {
      return [];
    }
    
    // Ruta Materiei (ex: /materii/romana)
    const subjectRoute = {
      url: `${SITE_URL}/materii/${subjectSlug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    };

    // Rutele Lecțiilor (ex: /materii/romana/basmul)
    // @ts-ignore
    const lessonRoutes = subjectData.chapters.flatMap((chapter: any) => {
      if (typeof chapter !== 'object' || !chapter || !Array.isArray(chapter.lessons)) {
        return [];
      }
      return chapter.lessons.map((lesson: any) => ({
        url: `${SITE_URL}/materii/${subjectSlug}/${lesson.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));
    });

    return [subjectRoute, ...lessonRoutes];
  });

  return [...staticRoutes, ...dynamicRoutes];
}