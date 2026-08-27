import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

export type DownloadRow = Database['public']['Tables']['downloads']['Row'];

export async function getDownloads(options?: {
  fileType?: string;
  category?: string;
  query?: string;
}): Promise<DownloadRow[]> {
  try {
    const supabase = createClient();
    let q = supabase
      .from('downloads')
      .select('*')
      .eq('visibility', 'public')
      .order('created_at', { ascending: false });

    if (options?.fileType) {
      q = q.eq('file_type', options.fileType);
    }
    if (options?.category) {
      q = q.eq('category_id', options.category);
    }

    const { data, error } = await q;

    if (error || !data) {
      return [];
    }

    let results = data as DownloadRow[];
    if (options?.query) {
      const kw = options.query.toLowerCase();
      results = results.filter(
        (item) =>
          item.title.toLowerCase().includes(kw) ||
          (item.description && item.description.toLowerCase().includes(kw)) ||
          (item.subject && item.subject.toLowerCase().includes(kw))
      );
    }

    return results;
  } catch {
    return [];
  }
}

export async function getDownloadBySlug(slug: string): Promise<DownloadRow | null> {
  try {
    if (!slug) return null;
    let decodedSlug = slug.trim();
    try {
      decodedSlug = decodeURIComponent(decodedSlug);
    } catch {
      // ignore
    }

    const supabase = createClient();
    let { data, error } = await supabase
      .from('downloads')
      .select('*')
      .eq('slug', decodedSlug)
      .maybeSingle();

    if ((!data || error) && decodedSlug !== slug) {
      const res = await supabase
        .from('downloads')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
      if (res.data) data = res.data;
    }

    if (error || !data) {
      return null;
    }
    return data as DownloadRow;
  } catch {
    return null;
  }
}

export async function incrementDownloadCount(id: string): Promise<void> {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from('downloads')
      .select('download_count')
      .eq('id', id)
      .single();

    const currentCount = data?.download_count || 0;

    await supabase
      .from('downloads')
      .update({ download_count: currentCount + 1 })
      .eq('id', id);
  } catch {
    // silently catch
  }
}

export const trackDownloadCount = incrementDownloadCount;
