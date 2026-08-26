-- ==============================================================================
-- MIGRATION 20260826000005: MULTI-REVISION ASSIGNMENT SUBMISSIONS & HISTORY
-- ==============================================================================

ALTER TABLE public.assignment_submissions 
  ADD COLUMN IF NOT EXISTS revision_count integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS submitted_revisions jsonb DEFAULT '[]'::jsonb;

-- Ensure index on status and user_id
CREATE INDEX IF NOT EXISTS idx_submissions_user_lesson ON public.assignment_submissions(user_id, lesson_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON public.assignment_submissions(status);
