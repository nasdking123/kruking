-- ============================================================
-- 1. EXTENSIONS & SETUP
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 2. ROLES & PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

INSERT INTO public.roles (name, description) VALUES
    ('super_admin', 'ผู้ดูแลระบบสูงสุด มีสิทธิ์จัดการทุกส่วนของระบบ'),
    ('admin', 'ผู้ดูแลระบบ จัดการเนื้อหาและผู้ใช้'),
    ('teacher', 'ครูผู้สอน จัดการห้องเรียน สื่อการสอน และผลงาน'),
    ('student', 'นักเรียน เข้าเรียนและทำแบบทดสอบ'),
    ('guest', 'ผู้เยี่ยมชมทั่วไป เข้าถึงเนื้อหาสาธารณะ')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'student' REFERENCES public.roles(name) ON UPDATE CASCADE,
    avatar_url TEXT,
    bio TEXT,
    school VARCHAR(255),
    position VARCHAR(255),
    phone VARCHAR(50),
    social_links JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE (user_id, role_id)
);

-- ============================================================
-- 3. CORE CMS: MODULES, MENUS, PAGES, HOMEPAGE SECTIONS, SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50) DEFAULT 'Layers',
    version VARCHAR(20) DEFAULT '1.0.0',
    enabled BOOLEAN DEFAULT TRUE NOT NULL,
    sort_order INT DEFAULT 0 NOT NULL,
    config JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.menus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL,
    slug VARCHAR(150),
    url VARCHAR(255) NOT NULL,
    icon VARCHAR(50),
    parent_id UUID REFERENCES public.menus(id) ON DELETE CASCADE,
    sort_order INT DEFAULT 0 NOT NULL,
    target VARCHAR(20) DEFAULT '_self',
    type VARCHAR(50) DEFAULT 'module', -- 'page', 'module', 'category', 'external_link', 'custom'
    module_key VARCHAR(50) REFERENCES public.modules(key) ON DELETE SET NULL,
    permission VARCHAR(50) DEFAULT 'guest',
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    open_new_tab BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    cover_image TEXT,
    template VARCHAR(50) DEFAULT 'default', -- 'default', 'landing', 'article', 'resource', 'portfolio', 'custom'
    status VARCHAR(30) DEFAULT 'draft', -- 'draft', 'published', 'archived'
    visibility VARCHAR(30) DEFAULT 'public', -- 'public', 'unlisted', 'private'
    seo_title VARCHAR(255),
    seo_description TEXT,
    og_image TEXT,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.homepage_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(150) NOT NULL,
    subtitle TEXT,
    is_enabled BOOLEAN DEFAULT TRUE NOT NULL,
    sort_order INT DEFAULT 0 NOT NULL,
    config JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- 4. TAXONOMY: CATEGORIES & TAGS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    module_key VARCHAR(50) REFERENCES public.modules(key) ON DELETE SET NULL,
    parent_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    sort_order INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- 5. CENTRAL WORKS (PORTFOLIO & CORE CONTENT)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.works (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    content TEXT,
    type VARCHAR(50) NOT NULL, -- 'teaching', 'resource', 'worksheet', 'game', 'lesson_plan', 'research', 'innovation', 'award', 'activity', 'video', 'article'
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    cover_image TEXT,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    grade_level VARCHAR(50),
    subject VARCHAR(100),
    featured BOOLEAN DEFAULT FALSE NOT NULL,
    visibility VARCHAR(30) DEFAULT 'public', -- 'public', 'unlisted', 'private'
    published BOOLEAN DEFAULT FALSE NOT NULL,
    published_at TIMESTAMPTZ,
    view_count INT DEFAULT 0 NOT NULL,
    download_count INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.work_tags (
    work_id UUID REFERENCES public.works(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (work_id, tag_id)
);

-- ============================================================
-- 6. SPECIALIZED MODULE TABLES (LINKED TO WORKS / DIRECT)
-- ============================================================
-- Resources
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_id UUID UNIQUE REFERENCES public.works(id) ON DELETE CASCADE,
    file_url TEXT,
    preview_url TEXT,
    external_link TEXT,
    resource_type VARCHAR(50) DEFAULT 'document', -- 'slide', 'document', 'pdf', 'image', 'video', 'interactive'
    file_size BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Worksheets
CREATE TABLE IF NOT EXISTS public.worksheets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_id UUID UNIQUE REFERENCES public.works(id) ON DELETE CASCADE,
    pdf_url TEXT,
    answer_key_url TEXT,
    preview_url TEXT,
    file_size BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Games
CREATE TABLE IF NOT EXISTS public.games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_id UUID UNIQUE REFERENCES public.works(id) ON DELETE CASCADE,
    game_type VARCHAR(50) DEFAULT 'unplugged', -- 'unplugged', 'digital', 'board_game', 'card_game', 'simulation'
    objective TEXT,
    how_to_play TEXT,
    rules TEXT,
    equipment TEXT,
    game_url TEXT,
    video_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Lesson Plans
CREATE TABLE IF NOT EXISTS public.lesson_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_id UUID UNIQUE REFERENCES public.works(id) ON DELETE CASCADE,
    unit VARCHAR(255),
    standard TEXT,
    indicator TEXT,
    core_concept TEXT,
    objective TEXT,
    activities TEXT,
    media_tools TEXT,
    assessment TEXT,
    file_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Teaching Showcases (Portfolios connecting multi-assets)
CREATE TABLE IF NOT EXISTS public.teaching_showcases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    grade_level VARCHAR(50),
    subject VARCHAR(100),
    standard TEXT,
    indicator TEXT,
    objective TEXT,
    intro_step TEXT,
    teaching_step TEXT,
    activity_step TEXT,
    result TEXT,
    reflection TEXT,
    video_url TEXT,
    lesson_plan_id UUID REFERENCES public.lesson_plans(id) ON DELETE SET NULL,
    worksheet_id UUID REFERENCES public.worksheets(id) ON DELETE SET NULL,
    game_id UUID REFERENCES public.games(id) ON DELETE SET NULL,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    published BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Research
CREATE TABLE IF NOT EXISTS public.research (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_id UUID UNIQUE REFERENCES public.works(id) ON DELETE CASCADE,
    abstract TEXT,
    researcher_name VARCHAR(255) DEFAULT 'ครูคิง',
    year VARCHAR(10),
    sample_group TEXT,
    methodology TEXT,
    results TEXT,
    file_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Innovation
CREATE TABLE IF NOT EXISTS public.innovations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_id UUID UNIQUE REFERENCES public.works(id) ON DELETE CASCADE,
    concept TEXT,
    problem TEXT,
    objective TEXT,
    process TEXT,
    result TEXT,
    video_url TEXT,
    file_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Awards
CREATE TABLE IF NOT EXISTS public.awards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_id UUID UNIQUE REFERENCES public.works(id) ON DELETE CASCADE,
    organization VARCHAR(255) NOT NULL,
    award_date DATE,
    award_level VARCHAR(100), -- 'ชาติ', 'ภาค', 'เขตพื้นที่', 'โรงเรียน', 'นานาชาติ'
    certificate_image TEXT,
    evidence_file TEXT,
    display_type VARCHAR(50) DEFAULT 'card', -- 'timeline', 'card', 'portfolio'
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Activities
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_id UUID UNIQUE REFERENCES public.works(id) ON DELETE CASCADE,
    activity_date DATE,
    location VARCHAR(255),
    video_url TEXT,
    document_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.activity_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_id UUID REFERENCES public.activities(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    sort_order INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Articles / Blog
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_id UUID UNIQUE REFERENCES public.works(id) ON DELETE CASCADE,
    reading_time_min INT DEFAULT 3,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- 7. ONLINE CLASSROOM MODULE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.classrooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    cover_image TEXT,
    grade_level VARCHAR(50),
    subject VARCHAR(100),
    teacher_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    status VARCHAR(30) DEFAULT 'active', -- 'active', 'archived'
    visibility VARCHAR(30) DEFAULT 'public', -- 'public', 'private'
    join_code VARCHAR(20) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.classroom_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(30) DEFAULT 'student', -- 'teacher', 'student'
    joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE (classroom_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    sort_order INT DEFAULT 0 NOT NULL,
    published BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT,
    video_url TEXT,
    sort_order INT DEFAULT 0 NOT NULL,
    published BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.lesson_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    resource_type VARCHAR(50) NOT NULL, -- 'work', 'resource', 'worksheet', 'game', 'quiz', 'external'
    resource_id UUID, -- reference to works or quiz
    external_url TEXT,
    title VARCHAR(255) NOT NULL,
    sort_order INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- 8. QUIZ / EXAM MODULE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_id UUID REFERENCES public.works(id) ON DELETE SET NULL,
    classroom_id UUID REFERENCES public.classrooms(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    grade_level VARCHAR(50),
    subject VARCHAR(100),
    time_limit INT DEFAULT 0, -- minutes, 0 = unlimited
    attempt_limit INT DEFAULT 0, -- 0 = unlimited
    shuffle_questions BOOLEAN DEFAULT TRUE NOT NULL,
    shuffle_choices BOOLEAN DEFAULT TRUE NOT NULL,
    published BOOLEAN DEFAULT FALSE NOT NULL,
    visibility VARCHAR(30) DEFAULT 'public',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    question_type VARCHAR(50) DEFAULT 'multiple_choice', -- 'multiple_choice', 'true_false'
    points INT DEFAULT 1 NOT NULL,
    sort_order INT DEFAULT 0 NOT NULL,
    explanation TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.quiz_choices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
    choice_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE NOT NULL,
    sort_order INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    guest_name VARCHAR(150),
    score NUMERIC(5,2) DEFAULT 0 NOT NULL,
    total_score NUMERIC(5,2) DEFAULT 0 NOT NULL,
    percentage NUMERIC(5,2) DEFAULT 0 NOT NULL,
    correct_count INT DEFAULT 0 NOT NULL,
    incorrect_count INT DEFAULT 0 NOT NULL,
    time_spent_seconds INT DEFAULT 0 NOT NULL,
    attempt_number INT DEFAULT 1 NOT NULL,
    started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    submitted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.quiz_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID NOT NULL REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
    selected_choice_id UUID REFERENCES public.quiz_choices(id) ON DELETE SET NULL,
    text_answer TEXT,
    is_correct BOOLEAN DEFAULT FALSE NOT NULL,
    points_earned NUMERIC(5,2) DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- 9. DOWNLOAD CENTER & MEDIA MANAGEMENT
-- ============================================================
CREATE TABLE IF NOT EXISTS public.downloads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    file_path TEXT NOT NULL,
    file_url TEXT NOT NULL,
    preview_url TEXT,
    file_size BIGINT DEFAULT 0 NOT NULL,
    file_type VARCHAR(50) NOT NULL, -- 'pdf', 'docx', 'pptx', 'xlsx', 'zip', 'image', 'other'
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    grade_level VARCHAR(50),
    subject VARCHAR(100),
    year VARCHAR(10),
    download_count INT DEFAULT 0 NOT NULL,
    visibility VARCHAR(30) DEFAULT 'public',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.media_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size BIGINT DEFAULT 0 NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    bucket VARCHAR(100) DEFAULT 'public-media' NOT NULL,
    visibility VARCHAR(30) DEFAULT 'public' NOT NULL,
    uploader_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- 10. AI FOR TEACHERS MODULE & LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.ai_tools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    icon VARCHAR(50) DEFAULT 'Bot',
    is_enabled BOOLEAN DEFAULT TRUE NOT NULL,
    system_prompt TEXT,
    config JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.ai_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    tool VARCHAR(100) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    prompt_tokens INT DEFAULT 0,
    completion_tokens INT DEFAULT 0,
    total_tokens INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'success',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- 11. ANALYTICS & LOGGING
-- ============================================================
CREATE TABLE IF NOT EXISTS public.views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50) NOT NULL, -- 'work', 'page', 'classroom', 'quiz', 'download'
    entity_id UUID NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ip_hash VARCHAR(64),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.download_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ip_hash VARCHAR(64),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- 12. PERFORMANCE INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_works_type ON public.works(type);
CREATE INDEX IF NOT EXISTS idx_works_published ON public.works(published);
CREATE INDEX IF NOT EXISTS idx_works_featured ON public.works(featured);
CREATE INDEX IF NOT EXISTS idx_works_grade_subject ON public.works(grade_level, subject);
CREATE INDEX IF NOT EXISTS idx_works_slug ON public.works(slug);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON public.categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_menus_parent_sort ON public.menus(parent_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_classrooms_slug ON public.classrooms(slug);
CREATE INDEX IF NOT EXISTS idx_quizzes_slug ON public.quizzes(slug);
CREATE INDEX IF NOT EXISTS idx_downloads_slug ON public.downloads(slug);
CREATE INDEX IF NOT EXISTS idx_views_entity ON public.views(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_user ON public.ai_usage_logs(user_id, created_at);
