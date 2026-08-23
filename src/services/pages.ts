import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

export type PageRow = Database['public']['Tables']['pages']['Row'];
type PageInsert = Database['public']['Tables']['pages']['Insert'];
type PageUpdate = Database['public']['Tables']['pages']['Update'];

export const INITIAL_PAGES: PageRow[] = [
  {
    id: 'page-1',
    title: 'เกี่ยวกับครูคิง (About Teacher)',
    slug: 'about',
    excerpt: 'ประวัติ ผลงาน ประสบการณ์การสอน และวิสัยทัศน์ทางการศึกษาของครูคิง',
    content: `
# ประวัติและผลงาน ครูคิง

ยินดีต้อนรับสู่ห้องสื่อการเรียนรู้และพื้นที่แบ่งปันประสบการณ์การจัดการเรียนรู้ของ **ครูคิง** 

## ข้อมูลทั่วไป
- **กลุ่มสาระการเรียนรู้:** วิทยาศาสตร์และเทคโนโลยี (วิทยาการคำนวณ)
- **ประสบการณ์การสอน:** มากกว่า 8 ปี
- **ความเชี่ยวชาญ:** การจัดกิจกรรม Active Learning, Unplugged Coding, การพัฒนาสื่อการเรียนรู้ และการประยุกต์ใช้ AI ในการจัดการศึกษา

## วิสัยทัศน์การศึกษา
มุ่งมั่นพัฒนาผู้เรียนให้มีทักษะการคิดเชิงคำนวณ (Computational Thinking) มีความคิดสร้างสรรค์ รู้เท่าทันเทคโนโลยี และสามารถนำทักษะด้านดิจิทัลไปประยุกต์ใช้ในการแก้ปัญหาในชีวิตจริงได้อย่างมีประสิทธิภาพ
    `,
    cover_image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop',
    template: 'portfolio',
    status: 'published',
    visibility: 'public',
    seo_title: 'เกี่ยวกับครูคิง - ครูผู้สอนวิทยาการคำนวณและเทคโนโลยี',
    seo_description: 'ประวัติ ผลงาน นวัตกรรมการสอน และช่องทางการติดต่อครูคิง',
    og_image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop',
    author_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
  },
  {
    id: 'page-2',
    title: 'ติดต่อสอบถาม (Contact Us)',
    slug: 'contact',
    excerpt: 'ช่องทางการติดต่อ ขอคำปรึกษาด้านสื่อการสอน และการจัดอบรมเชิงปฏิบัติการ',
    content: `
# ติดต่อครูคิง

หากคุณครู นักเรียน หรือผู้สนใจ มีข้อสงสัยเกี่ยวกับสื่อการสอน ใบงาน แผนการจัดการเรียนรู้ หรือสนใจให้จัดอบรมเชิงปฏิบัติการ Active Learning & AI for Teachers สามารถติดต่อได้ตามช่องทางด้านล่างครับ

- **อีเมล:** kruking.teaching@gmail.com
- **โทรศัพท์:** 081-234-5678
- **Facebook Page:** ห้องสื่อครูคิง
- **LINE Official:** @kruking
    `,
    cover_image: null,
    template: 'default',
    status: 'published',
    visibility: 'public',
    seo_title: 'ติดต่อครูคิง - ห้องสื่อครูคิง',
    seo_description: 'ช่องทางการติดต่อครูคิงเพื่อขอคำปรึกษาด้านสื่อการสอนและการศึกษา',
    og_image: null,
    author_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
  },
];

export async function getPages(): Promise<PageRow[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return INITIAL_PAGES;
    }
    return data;
  } catch {
    return INITIAL_PAGES;
  }
}

export async function getPageBySlug(slug: string): Promise<PageRow | null> {
  const pages = await getPages();
  return pages.find((p) => p.slug === slug) || null;
}

export async function getPageById(id: string): Promise<PageRow | null> {
  const pages = await getPages();
  return pages.find((p) => p.id === id) || null;
}

export async function savePage(pageData: Partial<PageRow>): Promise<PageRow> {
  const page: PageRow = {
    id: pageData.id || 'p-' + Date.now(),
    title: pageData.title || 'หน้าใหม่',
    slug: pageData.slug || 'new-page-' + Date.now(),
    excerpt: pageData.excerpt || null,
    content: pageData.content || '',
    cover_image: pageData.cover_image || null,
    template: pageData.template || 'default',
    status: pageData.status || 'published',
    visibility: pageData.visibility || 'public',
    seo_title: pageData.seo_title || pageData.title || null,
    seo_description: pageData.seo_description || pageData.excerpt || null,
    og_image: pageData.og_image || pageData.cover_image || null,
    author_id: null,
    created_at: pageData.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
  };

  try {
    const supabase = createClient();
    if (pageData.id && !pageData.id.startsWith('p-')) {
      await supabase.from('pages').update(page as PageUpdate).eq('id', pageData.id);
    } else {
      await supabase.from('pages').insert([page as PageInsert]);
    }
  } catch {
    // fallback
  }

  return page;
}

export async function deletePage(id: string): Promise<boolean> {
  try {
    const supabase = createClient();
    await supabase.from('pages').update({ deleted_at: new Date().toISOString() }).eq('id', id);
    return true;
  } catch {
    return true;
  }
}
