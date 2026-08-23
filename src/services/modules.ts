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
  { id: 'mod-12', key: 'classroom', name: 'ห้องเรียนออนไลน์ (Online Classroom)', description: 'ระบบจัดการห้องเรียน บทเรียน และผู้เรียน', icon: 'School', version: '1.0.0', enabled: true, sort_order: 12, config: {} },
  { id: 'mod-13', key: 'quiz', name: 'แบบทดสอบ (Quiz & Exam)', description: 'ระบบทำแบบทดสอบและคลังข้อสอบ', icon: 'CheckSquare', version: '1.0.0', enabled: true, sort_order: 13, config: {} },
  { id: 'mod-14', key: 'downloads', name: 'ศูนย์ดาวน์โหลด (Downloads)', description: 'ศูนย์รวมไฟล์ดาวน์โหลด เอกสาร และสื่อการสอน', icon: 'Download', version: '1.0.0', enabled: true, sort_order: 14, config: {} },
  { id: 'mod-15', key: 'ai_teacher', name: 'AI สำหรับครู (AI for Teachers)', description: 'เครื่องมือ AI ช่วยสร้างแผนการสอน ใบงาน และแบบทดสอบ', icon: 'Bot', version: '1.0.0', enabled: true, sort_order: 15, config: {} },
];

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
    return data.map((d) => ({
      ...d,
      config: (d.config as Record<string, unknown>) || {},
    }));
  } catch {
    return INITIAL_MODULES;
  }
}

export async function toggleModuleStatus(key: string, enabled: boolean): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('modules')
      .update({ enabled, updated_at: new Date().toISOString() })
      .eq('key', key);

    return !error;
  } catch {
    return true;
  }
}

export async function updateModuleConfig(key: string, config: Record<string, unknown>): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('modules')
      .update({ config: config as Json, updated_at: new Date().toISOString() })
      .eq('key', key);

    return !error;
  } catch {
    return true;
  }
}
