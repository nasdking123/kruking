-- Send public CMS changes to connected visitors via Supabase Realtime.
-- Private student data is intentionally excluded; it requires user-scoped channels.
DO $$
DECLARE
  table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
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
    'competition_results'
  ]
  LOOP
    IF EXISTS (
      SELECT 1
      FROM pg_tables
      WHERE schemaname = 'public' AND tablename = table_name
    ) AND NOT EXISTS (
      SELECT 1
      FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime'
        AND schemaname = 'public'
        AND tablename = table_name
    ) THEN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', table_name);
    END IF;
  END LOOP;
END $$;
