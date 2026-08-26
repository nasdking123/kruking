import { createClient } from '@/lib/supabase/client';
import type { ModuleDefinition } from '@/types';
import type { Json } from '@/types/database';

export const INITIAL_MODULES: ModuleDefinition[] = [
  { id: 'mod-1', key: 'portfolio', name: 'ผลงานครู (Portfolio)', description: 'รวบรวมผลงานครูและผลงานทางวิชาการ', icon: 'Award', version: '1.0.0', enabled: true, sort_order: 1, config: {} },
  { id: 'mod-2', key: 'resources', name: 'สื่อการสอน (Resources)', description: 'คลังสื่อการสอน สื่อมัลติมีเดีย และสื่อสไลด์', icon: 'FolderOpen', version: '1.0.0', enabled: true, sort_order: 2, config: {} },
  { id: 'mod-3', key: 'worksheets', name: 'ใบงาน (Worksheets)', description: 'คลังใบงาน แบบฝึกหัด พร้อมไฟล์ดาวน์โหลดและเฉลย', icon: 'FileText', version: '1.0.0', enabled: true, sort_order: 3, config: {} },
  { id: 'mod-4', key: 'games', name: 'เกมการเรียนรู้ (Games)', description: 'เกมการศึกษา บอร์ดเกม และเกม Unplugged Coding', icon: 'Gamepad2', version: '1.0.0', enabled: true, sort_order: 4, config: {} },
  { id: 'mod-5', key: 'lesson_plans', name: 'แผนการจัดการเรียนรู้ (Lesson Plans)', description: 'แผนการสอน Active Learning วิทยาการคำนวณและเทคโนโลยี', icon: 'BookOpen', version: '1.0.0', enabled: true, sort_order: 5, config: {} },
  { id: 'mod-6', key: 'research', name: 'งานวิจัย (Research)', description: 'งานวิจัยในชั้นเรียน และงานวิจัยเชิงวิชาการ', icon: 'GraduationCap', version: '1.0.0', enabled: true, sort_order: 6, config: {} },
  { id: 'mod-7', key: 'innovation', name: 'นวัตกรรม (Innovation)', description: 'นวัตกรรมการจัดการเรียนรู้และเทคโนโลยีการศึกษา', icon: 'Sparkles', version: '1.0.0', enabled: true, sort_order: 7, config: {} },
  { id: 'mod-8', key: 'awards', name: 'รางวัลและความภาคภูมิใจ (Awards)', description: 'รางวัล เกียรติบัตร และผลงานดีเด่น', icon: 'Trophy', version: '1.0.0', enabled: true, sort_order: 8, config: {} },
  { id: 'mod-9', key: 'activities', name: 'กิจกรรม (Activities)', description: 'ภาพกิจกรรมการสอน อบรม และสัมมนา', icon: 'Camera', version: '1.0.0', enabled: true, sort_order: 9, config: {} },
  { id: 'mod-10', key: 'articles', name: 'บทความ (Articles)', description: 'บทความวิชาการ และเทคนิคการสอน', icon: 'Newspaper', version: '1.0.0', enabled: true, sort_order: 10, config: {} },
  { id: 'mod-11', key: 'teaching', name: 'การจัดการเรียนรู้ (Teaching Showcase)', description: 'โชว์เคสการจัดการเรียนรู้แบบ Active Learning บูรณาการ', icon: 'Presentation', version: '1.0.0', enabled: true, sort_order: 11, config: {} },
  { id: 'mod-12', key: 'classroom', name: 'ห้องเรียนออนไลน์ (Online Classroom)', description: 'ระบบจัดการห้องเรียน บทเรียน และผู้เรียน Thai MOOC', icon: 'School', version: '1.0.0', enabled: true, sort_order: 12, config: {} },
  { id: 'mod-13', key: 'quiz', name: 'แบบทดสอบ (Quiz & Exam)', description: 'ระบบทำแบบทดสอบและคลังข้อสอบ', icon: 'CheckSquare', version: '1.0.0', enabled: true, sort_order: 13, config: {} },
  { id: 'mod-14', key: 'downloads', name: 'ศูนย์ดาวน์โหลด (Downloads)', description: 'ศูนย์รวมไฟล์ดาวน์โหลด เอกสาร และสื่อการสอน', icon: 'Download', version: '1.0.0', enabled: true, sort_order: 14, config: {} },
  { id: 'mod-15', key: 'ai_teacher', name: 'AI สำหรับครู (AI for Teachers)', description: 'เครื่องมือ AI ช่วยสร้างแผนการสอน ใบงาน และแบบทดสอบ', icon: 'Bot', version: '1.0.0', enabled: true, sort_order: 15, config: {} },
  { id: 'mod-16', key: 'competitions', name: 'การแข่งขันและภารกิจ (Competitions)', description: 'ระบบจัดการแข่งขัน ท้าประลอง และบันทึกรางวัลคะแนนพิเศษ', icon: 'Swords', version: '1.0.0', enabled: true, sort_order: 16, config: {} },
  { id: 'mod-17', key: 'certificates', name: 'เกียรติบัตรนักเรียน (Certificates)', description: 'ระบบออกและอนุมัติเกียรติบัตรดิจิทัลพร้อม QR Code', icon: 'Award', version: '1.0.0', enabled: true, sort_order: 17, config: {} },
  { id: 'mod-18', key: 'submissions', name: 'ส่งการบ้านและตรวจงาน (Submissions)', description: 'ระบบตรวจการบ้าน ให้คะแนน และส่งงานซ้ำแบบ Multi-Revision', icon: 'Send', version: '1.0.0', enabled: true, sort_order: 18, config: {} },
  { id: 'mod-19', key: 'students', name: 'ทะเบียนนักเรียน (Student Profiles)', description: 'ระบบบริหารรายชื่อนักเรียน ระดับชั้น และแต้มสะสม', icon: 'Users', version: '1.0.0', enabled: true, sort_order: 19, config: {} },
  { id: 'mod-20', key: 'categories', name: 'หมวดหมู่สื่อการเรียนรู้ (Categories)', description: 'ระบบจัดระเบียบกลุ่มสาระการเรียนรู้ และประเภทสื่อ', icon: 'FolderTree', version: '1.0.0', enabled: true, sort_order: 20, config: {} },
];

export function getModuleAdminRoute(key: string): string {
  switch (key) {
    case 'portfolio':
      return '/admin/works?category=portfolio';
    case 'resources':
      return '/admin/works?category=resources';
    case 'worksheets':
      return '/admin/works?category=worksheets';
    case 'games':
      return '/admin/works?category=games';
    case 'lesson_plans':
      return '/admin/works?category=lesson-plans';
    case 'research':
      return '/admin/works?category=research';
    case 'innovation':
      return '/admin/works?category=innovation';
    case 'awards':
      return '/admin/works?category=awards';
    case 'activities':
      return '/admin/works?category=activities';
    case 'articles':
      return '/admin/works?category=articles';
    case 'teaching':
      return '/admin/works?category=teaching';
    case 'classroom':
      return '/admin/classroom';
    case 'quiz':
      return '/admin/quizzes';
    case 'ai_teacher':
      return '/ai';
    case 'downloads':
      return '/downloads';
    case 'competitions':
      return '/admin/competitions';
    case 'certificates':
      return '/admin/certificates';
    case 'submissions':
      return '/admin/submissions';
    case 'students':
      return '/admin/students';
    case 'categories':
      return '/admin/categories';
    case 'homepage':
      return '/admin/homepage';
    case 'menus':
      return '/admin/menus';
    default:
      return '/admin/works';
  }
}

export function getModulePublicRoute(key: string): string {
  switch (key) {
    case 'portfolio':
      return '/portfolio';
    case 'resources':
      return '/resources';
    case 'worksheets':
      return '/worksheets';
    case 'games':
      return '/games';
    case 'lesson_plans':
      return '/lesson-plans';
    case 'research':
      return '/research';
    case 'innovation':
      return '/innovation';
    case 'awards':
      return '/awards';
    case 'activities':
      return '/activities';
    case 'articles':
      return '/articles';
    case 'teaching':
      return '/teaching';
    case 'classroom':
      return '/classroom';
    case 'quiz':
      return '/quiz';
    case 'ai_teacher':
      return '/ai';
    case 'downloads':
      return '/downloads';
    case 'competitions':
      return '/competitions';
    case 'certificates':
      return '/student/certificates';
    case 'submissions':
      return '/student/history';
    case 'students':
      return '/student/ranking';
    default:
      return '/';
  }
}

export async function getModules(): Promise<ModuleDefinition[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('modules')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return INITIAL_MODULES;
    }

    // Merge database state with INITIAL_MODULES to ensure all modules are accessible
    const dbMap = new Map(data.map((m) => [m.key, m]));
    return INITIAL_MODULES.map((initMod) => {
      const dbMod = dbMap.get(initMod.key);
      if (!dbMod) return initMod;
      return {
        ...initMod,
        id: dbMod.id || initMod.id,
        name: dbMod.name || initMod.name,
        description: dbMod.description || initMod.description,
        enabled: dbMod.enabled !== false,
        version: dbMod.version || initMod.version,
        config: (dbMod.config as Record<string, unknown>) || initMod.config,
      };
    });
  } catch {
    return INITIAL_MODULES;
  }
}

export async function toggleModuleStatus(key: string, enabled: boolean): Promise<boolean> {
  try {
    const supabase = createClient();
    const init = INITIAL_MODULES.find((m) => m.key === key);
    const { error } = await supabase
      .from('modules')
      .upsert(
        {
          key,
          name: init?.name || key,
          description: init?.description || null,
          enabled,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      );

    return !error;
  } catch {
    return true;
  }
}

export async function updateModuleDetails(params: {
  key: string;
  name: string;
  description: string;
  config?: Record<string, unknown>;
}): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('modules')
      .upsert(
        {
          key: params.key,
          name: params.name,
          description: params.description,
          config: (params.config || {}) as Json,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      );

    return !error;
  } catch {
    return true;
  }
}
