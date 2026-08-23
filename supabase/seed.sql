-- ============================================================
-- SEED DATA: ห้องสื่อครูคิง (Demo Data)
-- ============================================================

-- 1. SITE SETTINGS
INSERT INTO public.site_settings (key, value, description) VALUES
('general', '{
    "site_name": "ห้องสื่อครูคิง",
    "tagline": "แหล่งรวมสื่อการเรียนรู้ ผลงาน นวัตกรรม และประสบการณ์การสอน",
    "logo_url": "/images/logo.png",
    "favicon_url": "/favicon.ico",
    "primary_color": "#2563eb",
    "contact_email": "kruking.teaching@gmail.com",
    "contact_phone": "081-234-5678",
    "school_name": "โรงเรียนตัวอย่างวิทยา",
    "social_links": {
        "facebook": "https://facebook.com/kruking",
        "youtube": "https://youtube.com/@kruking",
        "line": "@kruking",
        "tiktok": "@kruking"
    },
    "footer_text": "© 2026 ห้องสื่อครูคิง. All rights reserved. มุ่งมั่นพัฒนาการศึกษาไทยด้วยเทคโนโลยีและนวัตกรรมการเรียนรู้"
}'::jsonb, 'ตั้งค่าทั่วไปของเว็บไซต์'),
('seo', '{
    "default_title": "ห้องสื่อครูคิง - แหล่งรวมสื่อการเรียนรู้และนวัตกรรมการศึกษา",
    "default_description": "เว็บไซต์ศูนย์รวมสื่อการเรียนรู้ ใบงาน นวัตกรรม แผนการสอน และห้องเรียนออนไลน์ โดยครูคิง",
    "og_image": "/images/og-cover.png",
    "keywords": ["สื่อการสอน", "ใบงาน", "แผนการสอน", "วิทยาการคำนวณ", "ครูคิง", "ห้องเรียนออนไลน์", "AI เพื่อการศึกษา"]
}'::jsonb, 'ตั้งค่า SEO เริ่มต้น')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 2. MODULE REGISTRY
INSERT INTO public.modules (key, name, description, icon, version, enabled, sort_order) VALUES
('portfolio', 'ผลงานครู', 'รวบรวมผลงานครูและผลงานทางวิชาการ', 'Award', '1.0.0', true, 1),
('resources', 'สื่อการสอน', 'คลังสื่อการสอน สื่อมัลติมีเดีย และสื่อสไลด์', 'FolderOpen', '1.0.0', true, 2),
('worksheets', 'ใบงาน', 'คลังใบงาน แบบฝึกหัด พร้อมไฟล์ดาวน์โหลด', 'FileText', '1.0.0', true, 3),
('games', 'เกมการเรียนรู้', 'เกมการศึกษา บอร์ดเกม และเกม Unplugged Coding', 'Gamepad2', '1.0.0', true, 4),
('lesson_plans', 'แผนการจัดการเรียนรู้', 'แผนการสอน วิทยาการคำนวณและเทคโนโลยี', 'BookOpen', '1.0.0', true, 5),
('research', 'งานวิจัย', 'งานวิจัยในชั้นเรียน และงานวิจัยเชิงวิชาการ', 'GraduationCap', '1.0.0', true, 6),
('innovation', 'นวัตกรรม', 'นวัตกรรมการจัดการเรียนรู้และเทคโนโลยีการศึกษา', 'Sparkles', '1.0.0', true, 7),
('awards', 'รางวัลและความภาคภูมิใจ', 'รางวัล เกียรติบัตร และผลงานดีเด่น', 'Trophy', '1.0.0', true, 8),
('activities', 'กิจกรรม', 'ภาพกิจกรรมการสอน อบรม และสัมมนา', 'Camera', '1.0.0', true, 9),
('articles', 'บทความ', 'บทความวิชาการ และเทคนิคการสอน', 'Newspaper', '1.0.0', true, 10),
('teaching', 'การจัดการเรียนรู้', 'โชว์เคสการจัดการเรียนรู้แบบ Active Learning', 'Presentation', '1.0.0', true, 11),
('classroom', 'ห้องเรียนออนไลน์', 'ระบบจัดการห้องเรียน บทเรียน และผู้เรียน', 'School', '1.0.0', true, 12),
('quiz', 'แบบทดสอบ', 'ระบบทำแบบทดสอบและคลังข้อสอบ', 'CheckSquare', '1.0.0', true, 13),
('downloads', 'ศูนย์ดาวน์โหลด', 'ศูนย์รวมไฟล์ดาวน์โหลด เอกสาร และสื่อการสอน', 'Download', '1.0.0', true, 14),
('ai_teacher', 'AI สำหรับครู', 'เครื่องมือ AI ช่วยสร้างแผนการสอน ใบงาน และแบบทดสอบ', 'Bot', '1.0.0', true, 15)
ON CONFLICT (key) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, enabled = EXCLUDED.enabled;

-- 3. DYNAMIC MENUS (10 Menus with Submenus)
INSERT INTO public.menus (id, title, slug, url, icon, parent_id, sort_order, type, module_key, is_active) VALUES
('a0000001-0000-0000-0000-000000000001', 'หน้าแรก', 'home', '/', 'Home', NULL, 1, 'custom', NULL, true),
('a0000001-0000-0000-0000-000000000002', 'สื่อและใบงาน', 'media-worksheet', '/resources', 'FolderOpen', NULL, 2, 'module', 'resources', true),
('a0000001-0000-0000-0000-000000000003', 'สื่อการสอนทั้งหมด', 'all-resources', '/resources', 'Folder', 'a0000001-0000-0000-0000-000000000002', 1, 'module', 'resources', true),
('a0000001-0000-0000-0000-000000000004', 'ใบงาน / แบบฝึกหัด', 'all-worksheets', '/worksheets', 'FileText', 'a0000001-0000-0000-0000-000000000002', 2, 'module', 'worksheets', true),
('a0000001-0000-0000-0000-000000000005', 'เกมการเรียนรู้', 'all-games', '/games', 'Gamepad2', 'a0000001-0000-0000-0000-000000000002', 3, 'module', 'games', true),
('a0000001-0000-0000-0000-000000000006', 'แผนและนวัตกรรม', 'plans-innovations', '/lesson-plans', 'BookOpen', NULL, 3, 'module', 'lesson_plans', true),
('a0000001-0000-0000-0000-000000000007', 'ห้องเรียนออนไลน์', 'online-classroom', '/classroom', 'School', NULL, 4, 'module', 'classroom', true),
('a0000001-0000-0000-0000-000000000008', 'แบบทดสอบ', 'quizzes', '/quizzes', 'CheckSquare', NULL, 5, 'module', 'quiz', true),
('a0000001-0000-0000-0000-000000000009', 'ศูนย์ดาวน์โหลด', 'downloads', '/downloads', 'Download', NULL, 6, 'module', 'downloads', true),
('a0000001-0000-0000-0000-000000000010', 'AI สำหรับครู', 'ai-teacher', '/ai', 'Bot', NULL, 7, 'module', 'ai_teacher', true)
ON CONFLICT (id) DO NOTHING;

-- 4. HOMEPAGE SECTIONS
INSERT INTO public.homepage_sections (section_key, title, subtitle, is_enabled, sort_order, config) VALUES
('hero', 'ยินดีต้อนรับสู่ ห้องสื่อครูคิง', 'แหล่งรวมสื่อการเรียนรู้ นวัตกรรม และคลังความรู้สำหรับคุณครูและนักเรียน', true, 1, '{"cta_text": "สำรวจสื่อการสอน", "cta_link": "/resources", "secondary_cta_text": "ห้องเรียนออนไลน์", "secondary_cta_link": "/classroom"}'::jsonb),
('search', 'ค้นหาสื่อและบทเรียน', 'ค้นหาใบงาน สื่อการสอน แผนการสอน และข้อสอบได้ทันที', true, 2, '{"placeholder": "พิมพ์คำค้น เช่น วิทยาการคำนวณ, ใบงาน ป.1..."}'::jsonb),
('categories', 'หมวดหมู่ยอดนิยม', 'เลือกดูสื่อตามกลุ่มสาระและระดับชั้น', true, 3, '{"limit": 8}'::jsonb),
('featured_works', 'ผลงานและสื่อนวัตกรรมเด่น', 'ผลงานคัดสรรที่ได้รับรางวัลและยอดนิยม', true, 4, '{"limit": 4}'::jsonb),
('latest_worksheets', 'ใบงานล่าสุด', 'ใบงานดาวน์โหลดฟรีพร้อมเฉลย', true, 5, '{"limit": 4}'::jsonb),
('latest_games', 'เกมการเรียนรู้และ Coding', 'เกมเสริมทักษะความคิดสร้างสรรค์และการแก้ปัญหา', true, 6, '{"limit": 3}'::jsonb),
('online_classroom', 'ห้องเรียนออนไลน์', 'เข้าเรียนวิชาวิทยาการคำนวณและเทคโนโลยี', true, 7, '{"limit": 2}'::jsonb),
('ai_for_teachers', 'AI สำหรับครู', 'เครื่องมืออัจฉริยะช่วยเขียนแผน สร้างใบงาน และออกแบบกิจกรรม', true, 8, '{"cta": "ลองใช้งานฟรี"}'::jsonb),
('awards', 'รางวัลและความภาคภูมิใจ', 'การันตีคุณภาพด้วยผลงานและรางวัลระดับประเทศ', true, 9, '{"limit": 3}'::jsonb),
('about_teacher', 'เกี่ยวกับครูคิง', 'ผู้สอนกลุ่มสาระวิทยาศาสตร์และเทคโนโลยี', true, 10, '{"experience_years": 8, "students_count": "2,000+"}'::jsonb)
ON CONFLICT (section_key) DO UPDATE SET title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, is_enabled = EXCLUDED.is_enabled;

-- 5. CATEGORIES (8 Categories with Parent-Child)
INSERT INTO public.categories (id, name, slug, description, icon, parent_id, sort_order) VALUES
('b0000001-0000-0000-0000-000000000001', 'วิทยาการคำนวณ', 'computational-thinking', 'การคิดเชิงคำนวณและการแก้ปัญหา', 'Code', NULL, 1),
('b0000001-0000-0000-0000-000000000002', 'ประถมศึกษาตอนต้น (ป.1 - ป.3)', 'primary-lower', 'สื่อและใบงานสำหรับ ป.1 - ป.3', 'Smile', 'b0000001-0000-0000-0000-000000000001', 1),
('b0000001-0000-0000-0000-000000000003', 'ประถมศึกษาตอนปลาย (ป.4 - ป.6)', 'primary-upper', 'สื่อและใบงานสำหรับ ป.4 - ป.6', 'Book', 'b0000001-0000-0000-0000-000000000001', 2),
('b0000001-0000-0000-0000-000000000004', 'มัธยมศึกษา (ม.1 - ม.3)', 'secondary', 'สื่อและใบงานสำหรับ มัธยมศึกษา', 'Laptop', 'b0000001-0000-0000-0000-000000000001', 3),
('b0000001-0000-0000-0000-000000000005', 'Unplugged Coding', 'unplugged-coding', 'การเรียนโค้ดดิ้งโดยไม่ใช้คอมพิวเตอร์', 'Puzzle', NULL, 2),
('b0000001-0000-0000-0000-000000000006', 'นวัตกรรมการสอน', 'innovative-teaching', 'นวัตกรรม Active Learning และโมเดลการสอน', 'Lightbulb', NULL, 3),
('b0000001-0000-0000-0000-000000000007', 'งานวิจัยในชั้นเรียน', 'classroom-research', 'รายงานผลและงานวิจัยพัฒนาการเรียนรู้', 'FileSearch', NULL, 4),
('b0000001-0000-0000-0000-000000000008', 'AI & เทคโนโลยีการศึกษา', 'ai-edtech', 'เทคโนโลยี AI และเครื่องมือดิจิทัลสำหรับครู', 'Cpu', NULL, 5)
ON CONFLICT (id) DO NOTHING;

-- 6. TAGS (15 Tags)
INSERT INTO public.tags (id, name, slug) VALUES
('c0000001-0000-0000-0000-000000000001', 'วิทยาการคำนวณ', 'cs'),
('c0000001-0000-0000-0000-000000000002', 'Coding', 'coding'),
('c0000001-0000-0000-0000-000000000003', 'Unplugged', 'unplugged'),
('c0000001-0000-0000-0000-000000000004', 'ใบงานฟรี', 'free-worksheet'),
('c0000001-0000-0000-0000-000000000005', 'ป.1', 'grade-1'),
('c0000001-0000-0000-0000-000000000006', 'ป.2', 'grade-2'),
('c0000001-0000-0000-0000-000000000007', 'ป.3', 'grade-3'),
('c0000001-0000-0000-0000-000000000008', 'ป.4', 'grade-4'),
('c0000001-0000-0000-0000-000000000009', 'Active Learning', 'active-learning'),
('c0000001-0000-0000-0000-000000000010', 'บอร์ดเกม', 'board-game'),
('c0000001-0000-0000-0000-000000000011', 'แผนการสอน', 'lesson-plan'),
('c0000001-0000-0000-0000-000000000012', 'วิจัยชั้นเรียน', 'action-research'),
('c0000001-0000-0000-0000-000000000013', 'รางวัลครูดีเด่น', 'teacher-award'),
('c0000001-0000-0000-0000-000000000014', 'AI การศึกษา', 'ai-education'),
('c0000001-0000-0000-0000-000000000015', 'Scratch', 'scratch')
ON CONFLICT (id) DO NOTHING;

-- 7. AI TOOLS CONFIGURATION
INSERT INTO public.ai_tools (key, name, description, icon, is_enabled, system_prompt) VALUES
('lesson_plan_generator', 'AI ช่วยเขียนแผนการสอน', 'สร้างโครงสร้างแผนการจัดการเรียนรู้ Active Learning ตามมาตรฐานและตัวชี้วัด', 'BookOpen', true, 'คุณคือผู้เชี่ยวชาญด้านการออกแบบหลักสูตรและการเขียนแผนการสอนตามหลักสูตรแกนกลางการศึกษาขั้นพื้นฐาน'),
('worksheet_creator', 'AI ช่วยสร้างใบงานและแบบฝึกหัด', 'ออกแบบชุดคำถาม กิจกรรม และใบงานพร้อมแนวคำตอบที่เหมาะสมกับระดับชั้น', 'FileText', true, 'คุณคือผู้เชี่ยวชาญด้านการสร้างแบบฝึกหัดและใบงานที่กระตุ้นการคิดวิเคราะห์'),
('quiz_generator', 'AI ช่วยสร้างข้อสอบและแบบทดสอบ', 'สร้างข้อสอบแบบปรนัย 4 ตัวเลือก หรือถูก/ผิด พร้อมคำอธิบายเฉลยละเอียด', 'CheckSquare', true, 'คุณคือผู้เชี่ยวชาญด้านการวัดและประเมินผลการศึกษาและการสร้างข้อสอบ'),
('activity_designer', 'AI ช่วยออกแบบกิจกรรม Active Learning', 'คิดค้นกิจกรรมการเรียนรู้ เกมในห้องเรียน และการทดลองที่น่าสนใจ', 'Sparkles', true, 'คุณคือครูผู้เชี่ยวชาญด้านการจัดกิจกรรม Active Learning'),
('content_summarizer', 'AI ช่วยสรุปเนื้อหาบทเรียน', 'สรุปเนื้อหาบทเรียนที่ยาวให้เข้าใจง่าย สรุปเป็น Mind Map หรือ Bullet Points', 'AlignLeft', true, 'คุณคือนักสรุปเนื้อหาทางการศึกษาที่กระชับและจำง่าย')
ON CONFLICT (key) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
