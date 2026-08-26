import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

export type PageRow = Database['public']['Tables']['pages']['Row'];
type PageInsert = Database['public']['Tables']['pages']['Insert'];
type PageUpdate = Database['public']['Tables']['pages']['Update'];

export const INITIAL_PAGES: PageRow[] = [
  {
    id: 'e1000000-0000-0000-0000-000000000001',
    title: 'เกี่ยวกับครูคิง (About Teacher)',
    slug: 'about',
    excerpt: 'ประวัติ ผลงาน ประสบการณ์การสอน และวิสัยทัศน์ทางการศึกษาของครูคิง',
    content: `
# ประวัติและผลงาน ครูจักรพงษ์ สำรองพันธ์ (ครูคิง)

ยินดีต้อนรับสู่ห้องสื่อการเรียนรู้และพื้นที่แบ่งปันประสบการณ์การจัดการเรียนรู้ของ **ครูคิง** 

## ข้อมูลทั่วไป
- **กลุ่มสาระการเรียนรู้:** วิทยาศาสตร์และเทคโนโลยี (วิทยาการคำนวณ)
- **สถานศึกษา:** โรงเรียนวัดบางโฉลงใน
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
    id: 'e1000000-0000-0000-0000-000000000002',
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
- **โรงเรียน:** โรงเรียนวัดบางโฉลงใน
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
    return data as PageRow[];
  } catch {
    return INITIAL_PAGES;
  }
}

export async function getPageBySlug(slug: string): Promise<PageRow | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .is('deleted_at', null)
      .maybeSingle();

    if (!error && data) {
      return data as PageRow;
    }
    return INITIAL_PAGES.find((p) => p.slug === slug) || null;
  } catch {
    return INITIAL_PAGES.find((p) => p.slug === slug) || null;
  }
}

export async function getPageById(id: string): Promise<PageRow | null> {
  try {
    const supabase = createClient();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    
    if (isUuid) {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('id', id)
        .is('deleted_at', null)
        .maybeSingle();

      if (!error && data) {
        return data as PageRow;
      }
    }

    const pages = await getPages();
    return pages.find((p) => p.id === id || p.slug === id) || null;
  } catch {
    return INITIAL_PAGES.find((p) => p.id === id || p.slug === id) || null;
  }
}

export async function savePage(pageData: Partial<PageRow>): Promise<{ success: boolean; data?: PageRow; error?: string }> {
  try {
    const supabase = createClient();
    const isUuid = pageData.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(pageData.id);

    const cleanTitle = (pageData.title || 'หน้าใหม่').trim();
    const cleanSlug = (pageData.slug || `page-${Date.now()}`)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s\u0E00-\u0E7F-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const recordData = {
      title: cleanTitle,
      slug: cleanSlug,
      excerpt: pageData.excerpt?.trim() || null,
      content: pageData.content || '',
      cover_image: pageData.cover_image?.trim() || null,
      template: pageData.template || 'default',
      status: pageData.status || 'published',
      visibility: pageData.visibility || 'public',
      seo_title: pageData.seo_title?.trim() || cleanTitle,
      seo_description: pageData.seo_description?.trim() || pageData.excerpt?.trim() || null,
      og_image: pageData.og_image?.trim() || pageData.cover_image?.trim() || null,
      updated_at: new Date().toISOString(),
    };

    if (isUuid && pageData.id) {
      // Update by ID
      const { error: updateError } = await supabase
        .from('pages')
        .update(recordData as PageUpdate)
        .eq('id', pageData.id);

      if (updateError) {
        // Fallback upsert by slug
        const { error: upsertError } = await supabase
          .from('pages')
          .upsert({ ...recordData, id: pageData.id } as PageInsert, { onConflict: 'slug' });

        if (upsertError) return { success: false, error: upsertError.message };
      }
      return { success: true };
    } else {
      // Upsert by slug
      const { error: insertError } = await supabase
        .from('pages')
        .upsert(
          {
            ...recordData,
            created_at: new Date().toISOString(),
          } as PageInsert,
          { onConflict: 'slug' }
        );

      if (insertError) {
        return { success: false, error: insertError.message };
      }
      return { success: true };
    }
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

export async function deletePage(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    
    let query = supabase.from('pages').update({ deleted_at: new Date().toISOString() });
    query = isUuid ? query.eq('id', id) : query.eq('slug', id);

    const { error } = await query;
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}
