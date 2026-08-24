import { createClient } from '@/lib/supabase/client';
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

    let filtered = data as unknown as WorkWithRelations[];
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
    const supabase = createClient();
    const { data, error } = await supabase
      .from('works')
      .select('*, category:categories(*)')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !data) {
      return null;
    }
    return data as unknown as WorkWithRelations;
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
