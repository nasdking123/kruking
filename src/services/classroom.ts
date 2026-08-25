import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

export type ClassroomRow = Database['public']['Tables']['classrooms']['Row'];
export type CourseRow = Database['public']['Tables']['courses']['Row'];
export type LessonRow = Database['public']['Tables']['lessons']['Row'];

export interface ClassroomWithLessons extends ClassroomRow {
  courses?: (CourseRow & { lessons: LessonRow[] })[];
  lessons?: LessonRow[];
}

export async function getClassrooms(): Promise<ClassroomWithLessons[]> {
  try {
    const supabase = createClient();
    const { data: classrooms, error: errCls } = await supabase
      .from('classrooms')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (errCls || !classrooms) {
      console.warn('getClassrooms error:', errCls);
      return [];
    }

    const { data: courses } = await supabase
      .from('courses')
      .select('*')
      .order('sort_order', { ascending: true });

    const { data: lessons } = await supabase
      .from('lessons')
      .select('*')
      .order('sort_order', { ascending: true });

    const allCourses = courses || [];
    const allLessons = lessons || [];

    return classrooms.map((cls) => {
      const clsCourses = allCourses.filter((c) => c.classroom_id === cls.id);
      const courseIds = new Set(clsCourses.map((c) => c.id));
      const clsLessons = allLessons.filter((l) => courseIds.has(l.course_id));

      const enrichedCourses = clsCourses.map((c) => ({
        ...c,
        lessons: allLessons.filter((l) => l.course_id === c.id),
      }));

      return {
        ...cls,
        courses: enrichedCourses,
        lessons: clsLessons,
      };
    });
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

    const { data: courses } = await supabase
      .from('courses')
      .select('*')
      .eq('classroom_id', cls.id)
      .order('sort_order', { ascending: true });

    const clsCourses = courses || [];
    const courseIds = clsCourses.map((c) => c.id);

    let clsLessons: LessonRow[] = [];
    if (courseIds.length > 0) {
      const { data: lessons } = await supabase
        .from('lessons')
        .select('*')
        .in('course_id', courseIds)
        .order('sort_order', { ascending: true });

      clsLessons = lessons || [];
    }

    const enrichedCourses = clsCourses.map((c) => ({
      ...c,
      lessons: clsLessons.filter((l) => l.course_id === c.id),
    }));

    return {
      ...cls,
      courses: enrichedCourses,
      lessons: clsLessons,
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

    return getClassroomBySlug(cls.slug);
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

export async function createLessonForClassroom({
  classroomId,
  title,
  description,
  videoUrl,
  content,
}: {
  classroomId: string;
  title: string;
  description?: string;
  videoUrl?: string;
  content?: string;
}): Promise<{ success: boolean; data?: LessonRow; error?: string }> {
  try {
    const supabase = createClient();

    // 1. Find or create Course for this classroom
    let { data: course } = await supabase
      .from('courses')
      .select('id')
      .eq('classroom_id', classroomId)
      .order('sort_order', { ascending: true })
      .maybeSingle();

    if (!course) {
      const { data: newCourse, error: errCourse } = await supabase
        .from('courses')
        .insert([{
          classroom_id: classroomId,
          title: 'สารบัญบทเรียนหลัก',
          description: 'รวมคลิปวิดีโอและเอกสารประกอบการสอน',
          sort_order: 1,
          published: true,
        }])
        .select()
        .single();

      if (errCourse || !newCourse) {
        return { success: false, error: errCourse?.message || 'Cannot create course container' };
      }
      course = newCourse;
    }

    // 2. Count existing lessons in this course for sort_order
    const { data: existingLessons } = await supabase
      .from('lessons')
      .select('id')
      .eq('course_id', course.id);

    const nextSortOrder = (existingLessons?.length || 0) + 1;

    // 3. Insert lesson with course_id
    const { data: createdLesson, error: errLsn } = await supabase
      .from('lessons')
      .insert([{
        course_id: course.id,
        title: title.trim(),
        description: description?.trim() || null,
        video_url: videoUrl?.trim() || null,
        content: content?.trim() || null,
        sort_order: nextSortOrder,
        published: true,
      }])
      .select()
      .single();

    if (errLsn || !createdLesson) {
      return { success: false, error: errLsn?.message || 'Cannot insert lesson' };
    }

    return { success: true, data: createdLesson };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
