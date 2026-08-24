import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

export type ClassroomRow = Database['public']['Tables']['classrooms']['Row'];
export type LessonRow = Database['public']['Tables']['lessons']['Row'];

export interface ClassroomWithLessons extends ClassroomRow {
  lessons: LessonRow[];
}

export async function getClassrooms(): Promise<ClassroomWithLessons[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('classrooms')
      .select('*, lessons(*)')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error || !data) {
      return [];
    }
    return data as unknown as ClassroomWithLessons[];
  } catch {
    return [];
  }
}

export async function getClassroomBySlug(slug: string): Promise<ClassroomWithLessons | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('classrooms')
      .select('*, lessons(*)')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !data) {
      return null;
    }
    return data as unknown as ClassroomWithLessons;
  } catch {
    return null;
  }
}

export async function getClassroomByJoinCode(code: string): Promise<ClassroomWithLessons | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('classrooms')
      .select('*, lessons(*)')
      .eq('join_code', code.trim().toUpperCase())
      .maybeSingle();

    if (error || !data) {
      return null;
    }
    return data as unknown as ClassroomWithLessons;
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
