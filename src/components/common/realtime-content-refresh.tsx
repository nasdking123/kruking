'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

// Keep this limited to content that is safe to refresh for every visitor.
// Student records and other private data must use scoped subscriptions instead.
const PUBLIC_CONTENT_TABLES = [
  'site_settings',
  'homepage_sections',
  'works',
  'categories',
  'tags',
  'pages',
  'menus',
  'modules',
  'classrooms',
  'courses',
  'lessons',
  'quizzes',
  'downloads',
  'competitions',
  'competition_results',
] as const;

/**
 * Refreshes the active route when public CMS content changes in Supabase.
 * The debounce groups one CMS save that touches several tables into one refresh.
 */
export function RealtimeContentRefresh() {
  const router = useRouter();
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const supabase = createClient();
    const refresh = () => {
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
      refreshTimer.current = setTimeout(() => router.refresh(), 150);
    };

    const channel = supabase.channel('public-content-refresh');

    for (const table of PUBLIC_CONTENT_TABLES) {
      channel.on('postgres_changes', { event: '*', schema: 'public', table }, refresh);
    }

    channel.subscribe();

    return () => {
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
      void supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}
