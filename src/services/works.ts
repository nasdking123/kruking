import { createClient } from '@/lib/supabase/client';
import { parseWorkContent } from '@/lib/work-metadata';
import type { Database } from '@/types/database';

export type WorkRow = Database['public']['Tables']['works']['Row'];
export type CategoryRow = Database['public']['Tables']['categories']['Row'];
export type TagRow = Database['public']['Tables']['tags']['Row'];

export interface WorkWithRelations extends WorkRow {
  category?: CategoryRow | null;
  tags?: TagRow[];
  details?: Record<string, unknown>;
}

export async function getWorks(options?: {
  type?: string;
  category?: string;
  grade?: string;
  gradeLevel?: string;
  search?: string;
  limit?: number;
  featured?: boolean;
}): Promise<WorkWithRelations[]> {
  try {
    const supabase = createClient();
    let query = supabase
      .from('works')
      .select('*, category:categories(*)')
      .order('created_at', { ascending: false });

    if (options?.type && options.type !== 'all') {
      query = query.eq('type', options.type);
    }
    if (options?.category && options.category !== 'all') {
      query = query.eq('category_id', options.category);
    }
    const targetGrade = options?.grade || options?.gradeLevel;
    if (targetGrade && targetGrade !== 'all') {
      query = query.eq('grade_level', targetGrade);
    }
    if (options?.featured !== undefined) {
      query = query.eq('featured', options.featured);
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error || !data) {
      return [];
    }

    let filtered = (data as unknown as WorkRow[]).map((w) => {
      const { cleanContent, metadata } = parseWorkContent(w.content);
      return {
        ...w,
        content: cleanContent,
        details: {
          ...metadata,
          file_url: metadata.file_url || null,
          youtube_url: metadata.youtube_url || null,
        },
      } as WorkWithRelations;
    });

    if (options?.search) {
      const q = options.search.toLowerCase();
      filtered = filtered.filter(
        (w) =>
          w.title.toLowerCase().includes(q) ||
          (w.description && w.description.toLowerCase().includes(q)) ||
          (w.subject && w.subject.toLowerCase().includes(q))
      );
    }

    return filtered;
  } catch {
    return [];
  }
}

export async function getWorkBySlug(slug: string): Promise<WorkWithRelations | null> {
  try {
    if (!slug) return null;
    const rawSlug = String(slug).trim();
    let decodedSlug = rawSlug;
    try {
      decodedSlug = decodeURIComponent(rawSlug).trim();
    } catch {
      decodedSlug = rawSlug;
    }

    const supabase = createClient();
    
    // 1. Query with decoded slug
    let { data, error } = await supabase
      .from('works')
      .select('*, category:categories(*)')
      .eq('slug', decodedSlug)
      .maybeSingle();

    // 2. Fallback to raw slug if different
    if ((!data || error) && decodedSlug !== rawSlug) {
      const res = await supabase
        .from('works')
        .select('*, category:categories(*)')
        .eq('slug', rawSlug)
        .maybeSingle();
      if (res.data) data = res.data;
    }

    // 3. Fallback to ID match if UUID
    if (!data) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(decodedSlug);
      if (isUuid) {
        const res = await supabase
          .from('works')
          .select('*, category:categories(*)')
          .eq('id', decodedSlug)
          .maybeSingle();
        if (res.data) data = res.data;
      }
    }

    if (!data) {
      return null;
    }

    const workRow = data as unknown as WorkRow;
    const { cleanContent, metadata } = parseWorkContent(workRow.content);

    return {
      ...workRow,
      content: cleanContent,
      details: {
        ...metadata,
        file_url: metadata.file_url || null,
        youtube_url: metadata.youtube_url || null,
      },
    } as unknown as WorkWithRelations;
  } catch {
    return null;
  }
}

export async function getWorkById(id: string): Promise<WorkWithRelations | null> {
  try {
    if (!id) return null;
    const supabase = createClient();
    const { data, error } = await supabase
      .from('works')
      .select('*, category:categories(*)')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    const workRow = data as unknown as WorkRow;
    const { cleanContent, metadata } = parseWorkContent(workRow.content);

    return {
      ...workRow,
      content: cleanContent,
      details: {
        ...metadata,
        file_url: metadata.file_url || null,
        youtube_url: metadata.youtube_url || null,
      },
    } as unknown as WorkWithRelations;
  } catch {
    return null;
  }
}

export async function getCategories(): Promise<CategoryRow[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error || !data) {
      return [];
    }
    return data as CategoryRow[];
  } catch {
    return [];
  }
}

export interface CategoryWithCount extends CategoryRow {
  workCount?: number;
}

export async function getCategoriesWithWorkCount(): Promise<CategoryWithCount[]> {
  try {
    const supabase = createClient();
    const [catsRes, worksRes] = await Promise.all([
      supabase.from('categories').select('*').order('sort_order', { ascending: true }),
      supabase.from('works').select('category_id'),
    ]);

    const cats = (catsRes.data || []) as CategoryRow[];
    const works = (worksRes.data || []) as Array<{ category_id: string | null }>;

    const countMap: Record<string, number> = {};
    works.forEach((w) => {
      if (w.category_id) {
        countMap[w.category_id] = (countMap[w.category_id] || 0) + 1;
      }
    });

    return cats.map((c) => ({
      ...c,
      workCount: countMap[c.id] || 0,
    }));
  } catch {
    return [];
  }
}

export async function createCategory(data: {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  module_key?: string;
  sort_order?: number;
}): Promise<{ success: boolean; data?: CategoryRow; error?: string }> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('categories')
      .insert({
        name: data.name.trim(),
        slug: data.slug.trim(),
        description: data.description?.trim() || null,
        icon: data.icon || 'FolderOpen',
        module_key: data.module_key || 'resources',
        sort_order: data.sort_order || 1,
      });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

export async function updateCategory(
  id: string,
  data: {
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    sort_order?: number;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('categories')
      .update({
        name: data.name.trim(),
        slug: data.slug.trim(),
        description: data.description?.trim() || null,
        icon: data.icon || 'FolderOpen',
        sort_order: data.sort_order || 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

export async function deleteCategory(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

export async function getTags(): Promise<TagRow[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('tags').select('*');
    if (error || !data) {
      return [];
    }
    return data as TagRow[];
  } catch {
    return [];
  }
}

export async function trackWorkView(id: string): Promise<void> {
  try {
    const supabase = createClient();
    await supabase.from('views').insert([
      {
        entity_type: 'work',
        entity_id: id,
        created_at: new Date().toISOString(),
      },
    ]);
  } catch {
    // silently catch
  }
}
