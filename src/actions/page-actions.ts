'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { Database } from '@/types/database';

export type PageRow = Database['public']['Tables']['pages']['Row'];

export async function savePageAction(pageData: {
  id?: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  cover_image?: string | null;
  template?: string;
  status?: 'draft' | 'published' | 'archived';
  visibility?: 'public' | 'unlisted' | 'private';
  seo_title?: string | null;
  seo_description?: string | null;
  og_image?: string | null;
}): Promise<{ success: boolean; data?: PageRow; error?: string }> {
  try {
    const supabase = await createClient();
    
    // Check if user is authenticated (if any)
    const { data: { user } } = await supabase.auth.getUser();

    const cleanTitle = pageData.title.trim();
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
      author_id: user?.id || null,
      updated_at: new Date().toISOString(),
    };

    // 1. Perform upsert on 'slug'
    const { data, error } = await supabase
      .from('pages')
      .upsert(
        {
          ...recordData,
          created_at: new Date().toISOString(),
        },
        { onConflict: 'slug' }
      )
      .select()
      .maybeSingle();

    if (error) {
      console.error('savePageAction error:', error);
      return { success: false, error: error.message };
    }

    // 2. Revalidate all relevant dynamic and static routes
    revalidatePath(`/p/${cleanSlug}`);
    revalidatePath('/about');
    revalidatePath('/contact');
    revalidatePath('/admin/pages');
    revalidatePath('/');

    return { success: true, data: (data || recordData) as PageRow };
  } catch (err: unknown) {
    console.error('savePageAction exception:', err);
    return { success: false, error: (err as Error).message };
  }
}

export async function deletePageAction(idOrSlug: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

    let query = supabase.from('pages').update({ deleted_at: new Date().toISOString() });
    query = isUuid ? query.eq('id', idOrSlug) : query.eq('slug', idOrSlug);

    const { error } = await query;
    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/pages');
    revalidatePath('/');
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}
