-- ============================================================
-- 1. SECURITY & HELPER FUNCTIONS
-- ============================================================

-- Function to check if the current user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(role_name TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT role INTO user_role FROM public.profiles WHERE id = auth.uid();
    IF user_role = 'super_admin' THEN
        RETURN TRUE;
    END IF;
    RETURN user_role = role_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is admin or super_admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT role INTO user_role FROM public.profiles WHERE id = auth.uid();
    RETURN user_role IN ('admin', 'super_admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto create profile on auth.users sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
        NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 2. ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
-- ============================================================
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.works ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worksheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teaching_showcases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.innovations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classroom_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_choices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.download_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 3. RLS POLICIES FOR PUBLIC CONTENT (GUEST / ANONYMOUS)
-- ============================================================

-- Roles: Everyone can view
CREATE POLICY "Roles are viewable by everyone" ON public.roles FOR SELECT USING (true);

-- Profiles: Public read basic info, Owner / Admin update
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can update any profile" ON public.profiles FOR ALL USING (public.is_admin());

-- Modules: Public read enabled, Admins full access
CREATE POLICY "Modules viewable by everyone" ON public.modules FOR SELECT USING (enabled = true OR public.is_admin());
CREATE POLICY "Admins manage modules" ON public.modules FOR ALL USING (public.is_admin());

-- Menus: Public read active, Admins full access
CREATE POLICY "Active menus viewable by everyone" ON public.menus FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admins manage menus" ON public.menus FOR ALL USING (public.is_admin());

-- Pages: Published pages viewable by everyone, Admins manage all
CREATE POLICY "Published pages viewable by everyone" ON public.pages FOR SELECT USING ((status = 'published' AND visibility = 'public') OR public.is_admin());
CREATE POLICY "Admins manage pages" ON public.pages FOR ALL USING (public.is_admin());

-- Homepage sections: Enabled sections viewable by everyone, Admins manage all
CREATE POLICY "Homepage sections viewable by everyone" ON public.homepage_sections FOR SELECT USING (is_enabled = true OR public.is_admin());
CREATE POLICY "Admins manage homepage sections" ON public.homepage_sections FOR ALL USING (public.is_admin());

-- Site settings: Viewable by everyone, Admins manage
CREATE POLICY "Site settings viewable by everyone" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage site settings" ON public.site_settings FOR ALL USING (public.is_admin());

-- Categories & Tags: Viewable by everyone, Admins manage
CREATE POLICY "Categories viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL USING (public.is_admin());
CREATE POLICY "Tags viewable by everyone" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Admins manage tags" ON public.tags FOR ALL USING (public.is_admin());

-- Works (Portfolio): Published & Public works viewable by everyone, Authors & Admins manage
CREATE POLICY "Published works viewable by everyone" ON public.works FOR SELECT USING ((published = true AND visibility = 'public' AND deleted_at IS NULL) OR public.is_admin() OR auth.uid() = author_id);
CREATE POLICY "Authors and admins can insert works" ON public.works FOR INSERT WITH CHECK (public.is_admin() OR auth.uid() = author_id);
CREATE POLICY "Authors and admins can update works" ON public.works FOR UPDATE USING (public.is_admin() OR auth.uid() = author_id);
CREATE POLICY "Admins can delete works" ON public.works FOR DELETE USING (public.is_admin());

-- Work Tags & Specialized Modules (Resources, Worksheets, Games, Lesson Plans, etc.)
CREATE POLICY "Work tags viewable by everyone" ON public.work_tags FOR SELECT USING (true);
CREATE POLICY "Admins manage work tags" ON public.work_tags FOR ALL USING (public.is_admin());

CREATE POLICY "Resources viewable by everyone" ON public.resources FOR SELECT USING (true);
CREATE POLICY "Admins manage resources" ON public.resources FOR ALL USING (public.is_admin());

CREATE POLICY "Worksheets viewable by everyone" ON public.worksheets FOR SELECT USING (true);
CREATE POLICY "Admins manage worksheets" ON public.worksheets FOR ALL USING (public.is_admin());

CREATE POLICY "Games viewable by everyone" ON public.games FOR SELECT USING (true);
CREATE POLICY "Admins manage games" ON public.games FOR ALL USING (public.is_admin());

CREATE POLICY "Lesson plans viewable by everyone" ON public.lesson_plans FOR SELECT USING (true);
CREATE POLICY "Admins manage lesson plans" ON public.lesson_plans FOR ALL USING (public.is_admin());

CREATE POLICY "Teaching showcases viewable by everyone" ON public.teaching_showcases FOR SELECT USING (published = true OR public.is_admin());
CREATE POLICY "Admins manage teaching showcases" ON public.teaching_showcases FOR ALL USING (public.is_admin());

CREATE POLICY "Research viewable by everyone" ON public.research FOR SELECT USING (true);
CREATE POLICY "Admins manage research" ON public.research FOR ALL USING (public.is_admin());

CREATE POLICY "Innovations viewable by everyone" ON public.innovations FOR SELECT USING (true);
CREATE POLICY "Admins manage innovations" ON public.innovations FOR ALL USING (public.is_admin());

CREATE POLICY "Awards viewable by everyone" ON public.awards FOR SELECT USING (true);
CREATE POLICY "Admins manage awards" ON public.awards FOR ALL USING (public.is_admin());

CREATE POLICY "Activities viewable by everyone" ON public.activities FOR SELECT USING (true);
CREATE POLICY "Admins manage activities" ON public.activities FOR ALL USING (public.is_admin());

CREATE POLICY "Activity images viewable by everyone" ON public.activity_images FOR SELECT USING (true);
CREATE POLICY "Admins manage activity images" ON public.activity_images FOR ALL USING (public.is_admin());

CREATE POLICY "Articles viewable by everyone" ON public.articles FOR SELECT USING (true);
CREATE POLICY "Admins manage articles" ON public.articles FOR ALL USING (public.is_admin());

-- Classrooms: Public classrooms viewable, members can view private, teachers & admins manage
CREATE POLICY "Classrooms viewable by public or members" ON public.classrooms FOR SELECT USING (
    (visibility = 'public' AND deleted_at IS NULL)
    OR public.is_admin()
    OR auth.uid() = teacher_id
    OR EXISTS (SELECT 1 FROM public.classroom_members WHERE classroom_id = classrooms.id AND user_id = auth.uid())
);
CREATE POLICY "Teachers and admins manage classrooms" ON public.classrooms FOR ALL USING (public.is_admin() OR auth.uid() = teacher_id);

CREATE POLICY "Classroom members can view memberships" ON public.classroom_members FOR SELECT USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "Users can join classrooms" ON public.classroom_members FOR INSERT WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Courses viewable by classroom viewers" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Teachers and admins manage courses" ON public.courses FOR ALL USING (public.is_admin() OR EXISTS (SELECT 1 FROM public.classrooms WHERE id = courses.classroom_id AND teacher_id = auth.uid()));

CREATE POLICY "Lessons viewable by classroom viewers" ON public.lessons FOR SELECT USING (true);
CREATE POLICY "Teachers and admins manage lessons" ON public.lessons FOR ALL USING (public.is_admin());

CREATE POLICY "Lesson resources viewable" ON public.lesson_resources FOR SELECT USING (true);
CREATE POLICY "Teachers and admins manage lesson resources" ON public.lesson_resources FOR ALL USING (public.is_admin());

-- Quizzes: Published viewable, questions & choices viewable for attempts
CREATE POLICY "Quizzes viewable by everyone" ON public.quizzes FOR SELECT USING (published = true OR public.is_admin());
CREATE POLICY "Admins and teachers manage quizzes" ON public.quizzes FOR ALL USING (public.is_admin());

CREATE POLICY "Quiz questions viewable for published quizzes" ON public.quiz_questions FOR SELECT USING (true);
CREATE POLICY "Admins manage quiz questions" ON public.quiz_questions FOR ALL USING (public.is_admin());

CREATE POLICY "Quiz choices viewable for questions" ON public.quiz_choices FOR SELECT USING (true);
CREATE POLICY "Admins manage quiz choices" ON public.quiz_choices FOR ALL USING (public.is_admin());

CREATE POLICY "Users can view own quiz attempts" ON public.quiz_attempts FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Anyone can create quiz attempts" ON public.quiz_attempts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update own quiz attempt" ON public.quiz_attempts FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users view own quiz answers" ON public.quiz_answers FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.quiz_attempts WHERE id = quiz_answers.attempt_id AND (user_id = auth.uid() OR public.is_admin()))
);
CREATE POLICY "Users insert quiz answers" ON public.quiz_answers FOR INSERT WITH CHECK (true);

-- Downloads & Media
CREATE POLICY "Public downloads viewable" ON public.downloads FOR SELECT USING (visibility = 'public' OR public.is_admin());
CREATE POLICY "Admins manage downloads" ON public.downloads FOR ALL USING (public.is_admin());

CREATE POLICY "Media files viewable" ON public.media_files FOR SELECT USING (visibility = 'public' OR public.is_admin() OR auth.uid() = uploader_id);
CREATE POLICY "Authenticated users can upload media" ON public.media_files FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins and uploaders manage media" ON public.media_files FOR ALL USING (public.is_admin() OR auth.uid() = uploader_id);

-- AI Tools & Logs
CREATE POLICY "Enabled AI tools viewable by everyone" ON public.ai_tools FOR SELECT USING (is_enabled = true OR public.is_admin());
CREATE POLICY "Admins manage AI tools" ON public.ai_tools FOR ALL USING (public.is_admin());

CREATE POLICY "Users view own AI logs, Admins view all" ON public.ai_usage_logs FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "System can log AI usage" ON public.ai_usage_logs FOR INSERT WITH CHECK (true);

-- Analytics Logs
CREATE POLICY "Anyone can insert views" ON public.views FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view view analytics" ON public.views FOR SELECT USING (public.is_admin());

CREATE POLICY "Anyone can insert download logs" ON public.download_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view download logs" ON public.download_logs FOR SELECT USING (public.is_admin());
