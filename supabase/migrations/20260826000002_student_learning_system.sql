-- ==============================================================================
-- MIGRATION: ระบบการเรียนรู้และผลงานนักเรียน (Student Learning & Achievement System)
-- ==============================================================================

-- 1. Schools (ระบบโรงเรียน)
CREATE TABLE IF NOT EXISTS public.schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    code TEXT UNIQUE,
    logo_url TEXT,
    province TEXT DEFAULT 'สมุทรปราการ',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Student Groups (ระบบจัดกลุ่มนักเรียนสำหรับการแข่งขัน)
CREATE TABLE IF NOT EXISTS public.student_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.student_group_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES public.student_groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);

-- 3. Assignments (ระบบการบ้านและชิ้นงานประจำบทเรียน)
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
    classroom_id UUID REFERENCES public.classrooms(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    instructions TEXT NOT NULL,
    max_score NUMERIC(5,2) NOT NULL DEFAULT 20,
    due_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Assignment Submissions (ระบบส่งการบ้านและผลงาน)
CREATE TABLE IF NOT EXISTS public.assignment_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE SET NULL,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
    classroom_id UUID REFERENCES public.classrooms(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    submission_type TEXT NOT NULL DEFAULT 'link' CHECK (submission_type IN ('link', 'image', 'file', 'text')),
    content_url TEXT,
    notes TEXT,
    score NUMERIC(5,2),
    max_score NUMERIC(5,2) DEFAULT 20,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'passed', 'graded', 'needs_revision')),
    teacher_feedback TEXT,
    is_in_portfolio BOOLEAN NOT NULL DEFAULT true,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    graded_at TIMESTAMPTZ
);

-- 5. Student Certificates (ระบบเกียรติบัตรและ Approval Workflow)
CREATE TABLE IF NOT EXISTS public.student_certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    title TEXT NOT NULL,
    issuer TEXT NOT NULL DEFAULT 'โรงเรียนวัดบางโฉลงใน',
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    image_url TEXT,
    competition_level TEXT DEFAULT 'ระดับสถานศึกษา',
    award_tier TEXT DEFAULT 'เหรียญทอง',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reject_reason TEXT,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Point Transactions (ระบบบัญชีแยกประเภทคะแนนสะสม)
CREATE TABLE IF NOT EXISTS public.point_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount NUMERIC(8,2) NOT NULL,
    point_type TEXT NOT NULL DEFAULT 'learning' CHECK (point_type IN ('learning', 'bonus', 'assignment', 'quiz', 'competition', 'award', 'adjustment')),
    source_id TEXT,
    description TEXT NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Student Awards (ระบบรางวัลและตราสัญลักษณ์)
CREATE TABLE IF NOT EXISTS public.student_awards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    award_name TEXT NOT NULL,
    award_type TEXT NOT NULL DEFAULT 'gold' CHECK (award_type IN ('winner', 'runner_up', 'outstanding', 'top_score', 'consistent', 'gold', 'silver', 'bronze')),
    description TEXT,
    badge_icon TEXT DEFAULT '🏆',
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Competitions & Results (ระบบการแข่งขัน)
CREATE TABLE IF NOT EXISTS public.competitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    subject TEXT NOT NULL DEFAULT 'วิทยาการคำนวณ',
    grade_level TEXT DEFAULT 'ประถมศึกษาปีที่ 6',
    school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL,
    points_reward NUMERIC(8,2) DEFAULT 50,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'completed')),
    start_date TIMESTAMPTZ DEFAULT NOW(),
    end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.competition_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    competition_id UUID NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rank INTEGER NOT NULL DEFAULT 1,
    score NUMERIC(8,2) NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(competition_id, user_id)
);

-- 9. Module Settings (ระบบตั้งค่าการแสดงผลและ Privacy)
CREATE TABLE IF NOT EXISTS public.module_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_settings ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public can view schools" ON public.schools FOR SELECT USING (true);
CREATE POLICY "Public can view assignments" ON public.assignments FOR SELECT USING (true);
CREATE POLICY "Public can view competitions" ON public.competitions FOR SELECT USING (true);
CREATE POLICY "Public can view module settings" ON public.module_settings FOR SELECT USING (true);
CREATE POLICY "Public can view approved certificates" ON public.student_certificates FOR SELECT USING (status = 'approved' OR auth.uid() = user_id);
CREATE POLICY "Public can view awards" ON public.student_awards FOR SELECT USING (true);

-- Authenticated Student & Admin Policies
CREATE POLICY "Users view own submissions" ON public.assignment_submissions FOR SELECT TO authenticated USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'teacher')));
CREATE POLICY "Users insert own submissions" ON public.assignment_submissions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own submissions" ON public.assignment_submissions FOR UPDATE TO authenticated USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'teacher')));

CREATE POLICY "Users view own point transactions" ON public.point_transactions FOR SELECT TO authenticated USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'teacher')));
CREATE POLICY "Admins manage point transactions" ON public.point_transactions FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'teacher')));

CREATE POLICY "Users submit own certificates" ON public.student_certificates FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage certificates" ON public.student_certificates FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'teacher')));
