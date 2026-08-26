-- ==============================================================================
-- MIGRATION 20260826000007: QUIZ ACCESS CODE & ADVANCED RESULTS LOGGING
-- ==============================================================================

-- 1. Add Access Code & Points config to Quizzes table
ALTER TABLE public.quizzes
  ADD COLUMN IF NOT EXISTS access_code text,
  ADD COLUMN IF NOT EXISTS is_passcode_required boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS passing_score integer NOT NULL DEFAULT 60,
  ADD COLUMN IF NOT EXISTS points_reward integer NOT NULL DEFAULT 20;

-- 2. Add Student info and answers summary to Quiz Attempts table
ALTER TABLE public.quiz_attempts
  ADD COLUMN IF NOT EXISTS student_name text,
  ADD COLUMN IF NOT EXISTS student_grade text,
  ADD COLUMN IF NOT EXISTS student_room text,
  ADD COLUMN IF NOT EXISTS student_school text,
  ADD COLUMN IF NOT EXISTS answers_summary jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS passed boolean NOT NULL DEFAULT false;

-- 3. Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_quizzes_access_code ON public.quizzes(access_code);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_id ON public.quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON public.quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_created ON public.quiz_attempts(submitted_at DESC);

-- 4. RLS for Quiz Attempts
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own quiz attempts" ON public.quiz_attempts;
CREATE POLICY "Users can view own quiz attempts"
  ON public.quiz_attempts FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin_or_teacher());

DROP POLICY IF EXISTS "Users can insert own quiz attempts" ON public.quiz_attempts;
CREATE POLICY "Users can insert own quiz attempts"
  ON public.quiz_attempts FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage all quiz attempts" ON public.quiz_attempts;
CREATE POLICY "Admins can manage all quiz attempts"
  ON public.quiz_attempts FOR ALL
  USING (public.is_admin_or_teacher());
