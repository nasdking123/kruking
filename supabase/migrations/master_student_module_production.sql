-- ==============================================================================
-- MASTER PRODUCTION SCRIPT: KRUKING STUDENT LEARNING & REWARD MODULE (ROUND 1-6)
-- Target Database: Supabase PostgreSQL (Production Ready)
-- ==============================================================================

-- 1. Helper Security Function
CREATE OR REPLACE FUNCTION public.is_admin_or_teacher()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND is_active = true
      AND role IN ('admin', 'teacher')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Assignment Submissions & Revisions
CREATE TABLE IF NOT EXISTS public.assignment_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id text NOT NULL,
  classroom_id text,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_name text NOT NULL,
  submission_type text NOT NULL DEFAULT 'link' CHECK (submission_type IN ('link', 'image', 'text')),
  content_url text,
  notes text,
  score numeric(5,2),
  max_score numeric(5,2) NOT NULL DEFAULT 20,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'passed', 'graded', 'needs_revision')),
  teacher_feedback text,
  is_in_portfolio boolean NOT NULL DEFAULT true,
  revision_count integer NOT NULL DEFAULT 1,
  submitted_revisions jsonb DEFAULT '[]'::jsonb,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  graded_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_submissions_user ON public.assignment_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_lesson ON public.assignment_submissions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON public.assignment_submissions(status);

-- 3. Point Transactions (Gamification Ledger)
CREATE TABLE IF NOT EXISTS public.point_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount numeric(8,2) NOT NULL DEFAULT 0,
  point_type text NOT NULL DEFAULT 'assignment' CHECK (point_type IN ('assignment', 'quiz', 'competition', 'attendance', 'bonus', 'adjustment')),
  source_id text,
  description text NOT NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_point_tx_user ON public.point_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_point_tx_source ON public.point_transactions(source_id);

-- 4. Student Certificates
CREATE TABLE IF NOT EXISTS public.student_certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_name text NOT NULL,
  title text NOT NULL,
  issuer text NOT NULL DEFAULT 'โรงเรียนวัดบางโฉลงใน',
  issue_date date NOT NULL DEFAULT CURRENT_DATE,
  certificate_url text,
  image_url text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reject_reason text,
  award_tier text,
  competition_level text,
  created_at timestamptz NOT NULL DEFAULT now(),
  approved_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_certificates_user ON public.student_certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_status ON public.student_certificates(status);

-- 5. Competitions & Results
CREATE TABLE IF NOT EXISTS public.competitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'coding',
  level text NOT NULL DEFAULT 'school',
  start_date timestamptz,
  end_date timestamptz,
  status text NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  rules text,
  rewards text,
  points_reward numeric(8,2) NOT NULL DEFAULT 100,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.competition_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id uuid NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rank integer NOT NULL,
  score numeric(6,2) NOT NULL DEFAULT 0,
  notes text,
  awarded_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(competition_id, user_id)
);

-- 6. Course Enrollments & Lesson Progress
CREATE TABLE IF NOT EXISTS public.course_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  classroom_id text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
  progress_percentage numeric(5,2) NOT NULL DEFAULT 0,
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  last_accessed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, classroom_id)
);

CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  classroom_id text NOT NULL,
  lesson_id text NOT NULL,
  is_completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  time_spent_seconds integer NOT NULL DEFAULT 0,
  last_position_seconds integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- 7. Notifications & Audit Logs
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'info',
  link text,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_name text,
  action text NOT NULL,
  target_type text NOT NULL,
  target_id text,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 8. Enable Row Level Security (RLS) on all tables
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 9. Complete Production RLS Policies
-- Submissions
DROP POLICY IF EXISTS "Students can insert own submissions" ON public.assignment_submissions;
CREATE POLICY "Students can insert own submissions" ON public.assignment_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Students can view own submissions" ON public.assignment_submissions;
CREATE POLICY "Students can view own submissions" ON public.assignment_submissions FOR SELECT USING (auth.uid() = user_id OR public.is_admin_or_teacher() OR is_in_portfolio = true);

DROP POLICY IF EXISTS "Students can update own un-graded submissions" ON public.assignment_submissions;
CREATE POLICY "Students can update own un-graded submissions" ON public.assignment_submissions FOR UPDATE USING (auth.uid() = user_id AND status IN ('pending', 'needs_revision'));

DROP POLICY IF EXISTS "Teachers can manage all submissions" ON public.assignment_submissions;
CREATE POLICY "Teachers can manage all submissions" ON public.assignment_submissions FOR ALL USING (public.is_admin_or_teacher());

-- Point Transactions
DROP POLICY IF EXISTS "Users can view own points" ON public.point_transactions;
CREATE POLICY "Users can view own points" ON public.point_transactions FOR SELECT USING (auth.uid() = user_id OR public.is_admin_or_teacher());

DROP POLICY IF EXISTS "Teachers can manage points" ON public.point_transactions;
CREATE POLICY "Teachers can manage points" ON public.point_transactions FOR ALL USING (public.is_admin_or_teacher());

-- Certificates
DROP POLICY IF EXISTS "Users can view certificates" ON public.student_certificates;
CREATE POLICY "Users can view certificates" ON public.student_certificates FOR SELECT USING (auth.uid() = user_id OR status = 'approved' OR public.is_admin_or_teacher());

DROP POLICY IF EXISTS "Students can insert own certificates" ON public.student_certificates;
CREATE POLICY "Students can insert own certificates" ON public.student_certificates FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Teachers can manage certificates" ON public.student_certificates;
CREATE POLICY "Teachers can manage certificates" ON public.student_certificates FOR ALL USING (public.is_admin_or_teacher());

-- Enrollments & Progress
DROP POLICY IF EXISTS "Users can view own enrollments" ON public.course_enrollments;
CREATE POLICY "Users can view own enrollments" ON public.course_enrollments FOR SELECT USING (auth.uid() = user_id OR public.is_admin_or_teacher());

DROP POLICY IF EXISTS "Users can manage own enrollments" ON public.course_enrollments;
CREATE POLICY "Users can manage own enrollments" ON public.course_enrollments FOR ALL USING (auth.uid() = user_id OR public.is_admin_or_teacher());

DROP POLICY IF EXISTS "Users can view own lesson progress" ON public.lesson_progress;
CREATE POLICY "Users can view own lesson progress" ON public.lesson_progress FOR SELECT USING (auth.uid() = user_id OR public.is_admin_or_teacher());

DROP POLICY IF EXISTS "Users can manage own lesson progress" ON public.lesson_progress;
CREATE POLICY "Users can manage own lesson progress" ON public.lesson_progress FOR ALL USING (auth.uid() = user_id OR public.is_admin_or_teacher());

-- Notifications
DROP POLICY IF EXISTS "Users can read own notifications" ON public.notifications;
CREATE POLICY "Users can read own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;
CREATE POLICY "System can insert notifications" ON public.notifications FOR INSERT WITH CHECK (true);

-- Audit Logs
DROP POLICY IF EXISTS "Admins and Teachers can view audit logs" ON public.audit_logs;
CREATE POLICY "Admins and Teachers can view audit logs" ON public.audit_logs FOR SELECT USING (public.is_admin_or_teacher());

DROP POLICY IF EXISTS "System can insert audit logs" ON public.audit_logs;
CREATE POLICY "System can insert audit logs" ON public.audit_logs FOR INSERT WITH CHECK (true);
