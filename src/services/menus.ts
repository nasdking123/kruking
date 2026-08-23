import { createClient } from '@/lib/supabase/client';
import type { MenuItem } from '@/types';
import type { Database } from '@/types/database';

type MenuInsert = Database['public']['Tables']['menus']['Insert'];
type MenuUpdate = Database['public']['Tables']['menus']['Update'];

export const INITIAL_MENUS: MenuItem[] = [
  { id: 'm-1', title: 'หน้าแรก', slug: 'home', url: '/', icon: 'Home', parent_id: null, sort_order: 1, type: 'custom', module_key: null, is_active: true, open_new_tab: false },
  { id: 'm-2', title: 'สื่อและใบงาน', slug: 'media-worksheet', url: '/resources', icon: 'FolderOpen', parent_id: null, sort_order: 2, type: 'module', module_key: 'resources', is_active: true, open_new_tab: false },
  { id: 'm-3', title: 'สื่อการสอนทั้งหมด', slug: 'all-resources', url: '/resources', icon: 'Folder', parent_id: 'm-2', sort_order: 1, type: 'module', module_key: 'resources', is_active: true, open_new_tab: false },
  { id: 'm-4', title: 'ใบงาน / แบบฝึกหัด', slug: 'all-worksheets', url: '/worksheets', icon: 'FileText', parent_id: 'm-2', sort_order: 2, type: 'module', module_key: 'worksheets', is_active: true, open_new_tab: false },
  { id: 'm-5', title: 'เกมการเรียนรู้', slug: 'all-games', url: '/games', icon: 'Gamepad2', parent_id: 'm-2', sort_order: 3, type: 'module', module_key: 'games', is_active: true, open_new_tab: false },
  { id: 'm-6', title: 'แผนและนวัตกรรม', slug: 'plans-innovations', url: '/lesson-plans', icon: 'BookOpen', parent_id: null, sort_order: 3, type: 'module', module_key: 'lesson_plans', is_active: true, open_new_tab: false },
  { id: 'm-7', title: 'ห้องเรียนออนไลน์', slug: 'online-classroom', url: '/classroom', icon: 'School', parent_id: null, sort_order: 4, type: 'module', module_key: 'classroom', is_active: true, open_new_tab: false },
  { id: 'm-8', title: 'แบบทดสอบ', slug: 'quizzes', url: '/quizzes', icon: 'CheckSquare', parent_id: null, sort_order: 5, type: 'module', module_key: 'quiz', is_active: true, open_new_tab: false },
  { id: 'm-9', title: 'ศูนย์ดาวน์โหลด', slug: 'downloads', url: '/downloads', icon: 'Download', parent_id: null, sort_order: 6, type: 'module', module_key: 'downloads', is_active: true, open_new_tab: false },
  { id: 'm-10', title: 'AI สำหรับครู', slug: 'ai-teacher', url: '/ai', icon: 'Bot', parent_id: null, sort_order: 7, type: 'module', module_key: 'ai_teacher', is_active: true, open_new_tab: false },
];

export async function getFlatMenus(): Promise<MenuItem[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('menus')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return INITIAL_MENUS;
    }
    return data as MenuItem[];
  } catch {
    return INITIAL_MENUS;
  }
}

export async function getHierarchicalMenus(): Promise<MenuItem[]> {
  const flat = await getFlatMenus();
  const roots = flat.filter((m) => !m.parent_id);
  const result: MenuItem[] = roots.map((root) => ({
    ...root,
    children: flat.filter((child) => child.parent_id === root.id),
  }));
  return result;
}

export async function saveMenu(menu: Partial<MenuItem>): Promise<MenuItem> {
  const newMenu: MenuItem = {
    id: menu.id || 'm-' + Date.now(),
    title: menu.title || 'เมนูใหม่',
    slug: menu.slug || null,
    url: menu.url || '/',
    icon: menu.icon || 'Link',
    parent_id: menu.parent_id || null,
    sort_order: menu.sort_order || 99,
    target: menu.target || '_self',
    type: menu.type || 'custom',
    module_key: menu.module_key || null,
    permission: menu.permission || 'guest',
    is_active: menu.is_active ?? true,
    open_new_tab: menu.open_new_tab ?? false,
  };

  try {
    const supabase = createClient();
    if (menu.id && !menu.id.startsWith('m-')) {
      await supabase.from('menus').update(newMenu as MenuUpdate).eq('id', menu.id);
    } else {
      await supabase.from('menus').insert([newMenu as MenuInsert]);
    }
  } catch {
    // fallback
  }

  return newMenu;
}

export async function deleteMenu(id: string): Promise<boolean> {
  try {
    const supabase = createClient();
    await supabase.from('menus').delete().eq('id', id);
    return true;
  } catch {
    return true;
  }
}
