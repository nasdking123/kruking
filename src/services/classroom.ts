import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

export type ClassroomRow = Database['public']['Tables']['classrooms']['Row'];
export type LessonRow = Database['public']['Tables']['lessons']['Row'];

export interface ClassroomWithLessons extends ClassroomRow {
  lessons?: LessonRow[];
}

export async function getClassrooms(): Promise<ClassroomWithLessons[]> {
  try {
    const supabase = createClient();
    const { data: classrooms, error } = await supabase
      .from('classrooms')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error || !classrooms) {
      return [];
    }

    // Fetch lessons for all classrooms
    const { data: allLessons } = await supabase
      .from('lessons')
      .select('*')
      .order('sort_order', { ascending: true });

    const lessonsList = allLessons || [];

    return classrooms.map((cls) => ({
      ...cls,
      lessons: lessonsList.filter((l) => l.classroom_id === cls.id),
    }));
  } catch (err) {
    console.error('getClassrooms exception:', err);
    return [];
  }
}

export async function getClassroomBySlug(slug: string): Promise<ClassroomWithLessons | null> {
  try {
    const supabase = createClient();
    const { data: cls, error } = await supabase
      .from('classrooms')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !cls) {
      return null;
    }

    const { data: lessons } = await supabase
      .from('lessons')
      .select('*')
      .eq('classroom_id', cls.id)
      .order('sort_order', { ascending: true });

    return {
      ...cls,
      lessons: lessons || [],
    };
  } catch (err) {
    console.error('getClassroomBySlug exception:', err);
    return null;
  }
}

export async function getClassroomByJoinCode(code: string): Promise<ClassroomWithLessons | null> {
  try {
    const supabase = createClient();
    const { data: cls, error } = await supabase
      .from('classrooms')
      .select('*')
      .eq('join_code', code.trim().toUpperCase())
      .maybeSingle();

    if (error || !cls) {
      return null;
    }

    const { data: lessons } = await supabase
      .from('lessons')
      .select('*')
      .eq('classroom_id', cls.id)
      .order('sort_order', { ascending: true });

    return {
      ...cls,
      lessons: lessons || [],
    };
  } catch {
    return null;
  }
}

export async function getLessonById(
  classSlug: string,
  lessonId: string
): Promise<LessonRow | null> {
  const classroom = await getClassroomBySlug(classSlug);
  if (!classroom) return null;

  const lesson = classroom.lessons?.find((l) => l.id === lessonId);
  return lesson || null;
}
