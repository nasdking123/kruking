-- Migration: Add assignment_submissions table
CREATE TABLE IF NOT EXISTS public.assignment_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    classroom_id UUID REFERENCES public.classrooms(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    submission_type TEXT NOT NULL DEFAULT 'link' CHECK (submission_type IN ('link', 'image', 'text')),
    content_url TEXT,
    notes TEXT,
    score NUMERIC(5,2),
    max_score NUMERIC(5,2) DEFAULT 10,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'graded', 'needs_revision')),
    teacher_feedback TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    graded_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Students can view own submissions"
    ON public.assignment_submissions
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Students can insert own submissions"
    ON public.assignment_submissions
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can update own submissions"
    ON public.assignment_submissions
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins and teachers full access to assignment submissions"
    ON public.assignment_submissions
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'teacher')
        )
    );
