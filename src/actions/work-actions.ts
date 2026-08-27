'use server';

import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import type { Database } from '@/types/database';

export type WorkRow = Database['public']['Tables']['works']['Row'];

function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (supabaseUrl && serviceKey) {
    return createAdminClient<Database>(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return null;
}

export async function saveWorkAction(workData: {
  id?: string;
  title: string;
  slug: string;
  type: string;
  category_id?: string | null;
  grade_level?: string | null;
  subject?: string | null;
  description?: string | null;
  content?: string | null;
  cover_image?: string | null;
  file_url?: string | null;
  featured?: boolean;
}): Promise<{ success: boolean; data?: WorkRow; error?: string }> {
  try {
    const cleanTitle = workData.title.trim();
    const cleanSlug = (workData.slug || `work-${Date.now()}`)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s\u0E00-\u0E7F-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const recordData = {
      title: cleanTitle,
      slug: cleanSlug,
      type: workData.type || 'resource',
      category_id: workData.category_id || null,
      grade_level: workData.grade_level || 'ทุกระดับชั้น / ทั่วไป',
      subject: workData.subject || 'วิทยาการคำนวณ',
      description: workData.description?.trim() || null,
      content: workData.content || '',
      cover_image: workData.cover_image?.trim() || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop',
      featured: Boolean(workData.featured),
      visibility: 'public' as const,
      published: true,
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    let resultData: WorkRow | null = null;

    // 1. Try with Server Client
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('works')
      .upsert(
        {
          ...recordData,
          view_count: 1,
          download_count: 0,
          created_at: new Date().toISOString(),
        },
        { onConflict: 'slug' }
      )
      .select('*, category:categories(*)')
      .maybeSingle();

    if (error) {
      console.warn('saveWorkAction with auth client failed, attempting with admin client...', error.message);
      const adminClient = getAdminClient();
      if (adminClient) {
        const adminRes = await adminClient
          .from('works')
          .upsert(
            {
              ...recordData,
              view_count: 1,
              download_count: 0,
              created_at: new Date().toISOString(),
            },
            { onConflict: 'slug' }
          )
          .select('*, category:categories(*)')
          .maybeSingle();

        if (adminRes.error) {
          console.error('saveWorkAction admin client error:', adminRes.error);
          return { success: false, error: adminRes.error.message };
        }
        resultData = adminRes.data as unknown as WorkRow;
      } else {
        return { success: false, error: error.message };
      }
    } else {
      resultData = data as unknown as WorkRow;
    }

    // 2. Revalidate all relevant pages to reflect the new media immediately
    revalidatePath('/');
    revalidatePath('/resources');
    revalidatePath('/worksheets');
    revalidatePath('/lesson-plans');
    revalidatePath('/games');
    revalidatePath('/downloads');
    revalidatePath('/portfolio');
    revalidatePath('/admin/works');
    revalidatePath('/admin/homepage');
    revalidatePath(`/resources/${cleanSlug}`);
    revalidatePath(`/worksheets/${cleanSlug}`);
    revalidatePath(`/lesson-plans/${cleanSlug}`);
    revalidatePath(`/games/${cleanSlug}`);

    return { 
      success: true, 
      data: (resultData || { id: `work-${Date.now()}`, ...recordData, view_count: 1, download_count: 0, created_at: new Date().toISOString(), deleted_at: null, author_id: null }) as WorkRow 
    };
  } catch (err: unknown) {
    console.error('saveWorkAction exception:', err);
    return { success: false, error: (err as Error).message };
  }
}

export async function deleteWorkAction(idOrSlug: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

    let query = supabase.from('works').delete();
    query = isUuid ? query.eq('id', idOrSlug) : query.eq('slug', idOrSlug);

    const { error } = await query;
    if (error) {
      const adminClient = getAdminClient();
      if (adminClient) {
        let adminQuery = adminClient.from('works').delete();
        adminQuery = isUuid ? adminQuery.eq('id', idOrSlug) : adminQuery.eq('slug', idOrSlug);
        await adminQuery;
      }
    }

    revalidatePath('/');
    revalidatePath('/resources');
    revalidatePath('/worksheets');
    revalidatePath('/lesson-plans');
    revalidatePath('/games');
    revalidatePath('/admin/works');

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}
