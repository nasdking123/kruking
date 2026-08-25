import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

export type HomepageSectionRow = Database['public']['Tables']['homepage_sections']['Row'];

export const INITIAL_SECTIONS: HomepageSectionRow[] = [
  { id: 'sec-1', section_key: 'hero', title: 'ยินดีต้อนรับสู่ ห้องสื่อครูคิง', subtitle: 'แหล่งรวมสื่อการเรียนรู้ นวัตกรรม และคลังความรู้สำหรับคุณครูและนักเรียน', is_enabled: true, sort_order: 1, config: {}, created_at: '', updated_at: '' },
  { id: 'sec-2', section_key: 'search', title: 'ค้นหาสื่อและบทเรียน', subtitle: 'ค้นหาใบงาน สื่อการสอน แผนการสอน และข้อสอบได้ทันที', is_enabled: true, sort_order: 2, config: {}, created_at: '', updated_at: '' },
  { id: 'sec-3', section_key: 'categories', title: 'หมวดหมู่ยอดนิยม', subtitle: 'เลือกดูสื่อตามกลุ่มสาระและระดับชั้น', is_enabled: true, sort_order: 3, config: {}, created_at: '', updated_at: '' },
  { id: 'sec-4', section_key: 'featured_works', title: 'ผลงานและสื่อนวัตกรรมเด่น', subtitle: 'ผลงานคัดสรรที่ได้รับรางวัลและยอดนิยม', is_enabled: true, sort_order: 4, config: {}, created_at: '', updated_at: '' },
  { id: 'sec-5', section_key: 'latest_worksheets', title: 'ใบงานล่าสุด', subtitle: 'ใบงานดาวน์โหลดฟรีพร้อมเฉลย', is_enabled: true, sort_order: 5, config: {}, created_at: '', updated_at: '' },
  { id: 'sec-6', section_key: 'latest_games', title: 'เกมการเรียนรู้และ Coding', subtitle: 'เกมเสริมทักษะความคิดสร้างสรรค์และการแก้ปัญหา', is_enabled: true, sort_order: 6, config: {}, created_at: '', updated_at: '' },
  { id: 'sec-7', section_key: 'online_classroom', title: 'ห้องเรียนออนไลน์', subtitle: 'เข้าเรียนวิชาวิทยาการคำนวณและเทคโนโลยี', is_enabled: true, sort_order: 7, config: {}, created_at: '', updated_at: '' },
  { id: 'sec-8', section_key: 'ai_for_teachers', title: 'AI สำหรับครู', subtitle: 'เครื่องมืออัจฉริยะช่วยเขียนแผน สร้างใบงาน และออกแบบกิจกรรม', is_enabled: true, sort_order: 8, config: {}, created_at: '', updated_at: '' },
  { id: 'sec-9', section_key: 'awards', title: 'รางวัลและความภาคภูมิใจ', subtitle: 'การันตีคุณภาพด้วยผลงานและรางวัลระดับประเทศ', is_enabled: true, sort_order: 9, config: {}, created_at: '', updated_at: '' },
  { id: 'sec-10', section_key: 'about_teacher', title: 'เกี่ยวกับครูคิง', subtitle: 'ผู้สอนกลุ่มสาระวิทยาศาสตร์และเทคโนโลยี', is_enabled: true, sort_order: 10, config: {}, created_at: '', updated_at: '' },
];

export async function getHomepageSections(): Promise<HomepageSectionRow[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('homepage_sections')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return INITIAL_SECTIONS;
    }
    return data;
  } catch {
    return INITIAL_SECTIONS;
  }
}

export async function toggleSectionStatus(section_key: string, is_enabled: boolean): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('homepage_sections')
      .update({ is_enabled, updated_at: new Date().toISOString() })
      .eq('section_key', section_key);

    return !error;
  } catch {
    return false;
  }
}

export async function updateSection(section_key: string, data: Partial<HomepageSectionRow>): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('homepage_sections')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('section_key', section_key);

    return !error;
  } catch {
    return false;
  }
}
