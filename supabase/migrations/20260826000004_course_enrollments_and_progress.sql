-- ==============================================================================
-- MIGRATION 20260826000004: COURSE ENROLLMENTS & LESSON PROGRESS
-- ==============================================================================

-- 1. Create Course Enrollments Table
CREATE TABLE IF NOT EXISTS public.course_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  classroom_id uuid NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
  progress_percentage numeric(5, 2) NOT NULL DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  last_accessed_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT course_enrollments_user_classroom_unique UNIQUE (user_id, classroom_id)
);

CREATE INDEX IF NOT EXISTS idx_course_enrollments_user ON public.course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_classroom ON public.course_enrollments(classroom_id);

-- 2. Create Lesson Progress Table
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  classroom_id uuid NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  is_completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  time_spent_seconds integer NOT NULL DEFAULT 0,
  last_position_seconds integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT lesson_progress_user_lesson_unique UNIQUE (user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON public.lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_classroom ON public.lesson_progress(classroom_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson ON public.lesson_progress(lesson_id);

-- 3. RLS Policies
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

-- course_enrollments RLS
DROP POLICY IF EXISTS "enrollment_select" ON public.course_enrollments;
CREATE POLICY "enrollment_select" ON public.course_enrollments
  FOR SELECT
  USING (
    auth.uid() = user_id 
    OR public.is_admin_or_teacher()
  );

DROP POLICY IF EXISTS "enrollment_insert" ON public.course_enrollments;
CREATE POLICY "enrollment_insert" ON public.course_enrollments
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id 
    OR public.is_admin_or_teacher()
  );

DROP POLICY IF EXISTS "enrollment_update" ON public.course_enrollments;
CREATE POLICY "enrollment_update" ON public.course_enrollments
  FOR UPDATE
  USING (
    auth.uid() = user_id 
    OR public.is_admin_or_teacher()
  );

-- lesson_progress RLS
DROP POLICY IF EXISTS "progress_select" ON public.lesson_progress;
CREATE POLICY "progress_select" ON public.lesson_progress
  FOR SELECT
  USING (
    auth.uid() = user_id 
    OR public.is_admin_or_teacher()
  );

DROP POLICY IF EXISTS "progress_insert" ON public.lesson_progress;
CREATE POLICY "progress_insert" ON public.lesson_progress
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id 
    OR public.is_admin_or_teacher()
  );

DROP POLICY IF EXISTS "progress_update" ON public.lesson_progress;
CREATE POLICY "progress_update" ON public.lesson_progress
  FOR UPDATE
  USING (
    auth.uid() = user_id 
    OR public.is_admin_or_teacher()
  );
