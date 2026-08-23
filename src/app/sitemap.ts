import { MetadataRoute } from 'next';
import { getWorks } from '@/services/works';
import { getClassrooms } from '@/services/classroom';
import { getQuizzes } from '@/services/quiz';
import { getDownloads } from '@/services/downloads';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kruking.com';

  const staticRoutes = [
    '',
    '/portfolio',
    '/resources',
    '/worksheets',
    '/games',
    '/lesson-plans',
    '/teaching',
    '/research',
    '/innovation',
    '/awards',
    '/activities',
    '/articles',
    '/classroom',
    '/quiz',
    '/downloads',
    '/ai',
    '/search',
    '/p/about',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const [works, classrooms, quizzes, downloads] = await Promise.all([
    getWorks(),
    getClassrooms(),
    getQuizzes(),
    getDownloads(),
  ]);

  const workRoutes = works.map((w) => {
    let prefix = 'resources';
    if (w.type === 'lesson_plan') prefix = 'lesson-plans';
    else if (w.type === 'teaching') prefix = 'teaching';
    else if (w.type === 'research') prefix = 'research';
    else if (w.type === 'innovation') prefix = 'innovation';
    else if (w.type === 'worksheet') prefix = 'worksheets';
    else if (w.type === 'game') prefix = 'games';
    else if (w.type === 'activity') prefix = 'activities';
    else if (w.type === 'article') prefix = 'articles';
    else if (w.type === 'portfolio') prefix = 'portfolio';

    return {
      url: `${baseUrl}/${prefix}/${w.slug}`,
      lastModified: new Date(w.updated_at || w.created_at),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    };
  });

  const classroomRoutes = classrooms.map((c) => ({
    url: `${baseUrl}/classroom/${c.slug}`,
    lastModified: new Date(c.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const quizRoutes = quizzes.map((q) => ({
    url: `${baseUrl}/quiz/${q.id}`,
    lastModified: new Date(q.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const downloadRoutes = downloads.map((d) => ({
    url: `${baseUrl}/downloads/${d.slug}`,
    lastModified: new Date(d.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...workRoutes, ...classroomRoutes, ...quizRoutes, ...downloadRoutes];
}
