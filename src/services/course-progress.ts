import { createClient } from '@/lib/supabase/client';

export interface CourseProgressInfo {
  isEnrolled: boolean;
  enrollmentStatus: 'active' | 'completed' | 'dropped' | null;
  progressPercentage: number;
  completedLessonIds: string[];
  enrolledAt: string | null;
  completedAt: string | null;
}

export interface EnrolledCourseCardItem {
  classroomId: string;
  slug: string;
  title: string;
  coverImage: string | null;
  gradeLevel: string | null;
  progressPercentage: number;
  status: 'active' | 'completed';
  totalLessons: number;
  completedLessons: number;
  lastAccessedAt: string;
}

// 1. Get Course Progress for a student
export async function getCourseProgress(userId: string, classroomId: string): Promise<CourseProgressInfo> {
  const supabase = createClient();

  const { data: enrollment } = await supabase
    .from('course_enrollments')
    .select('*')
    .eq('user_id', userId)
    .eq('classroom_id', classroomId)
    .maybeSingle();

  const { data: progressList } = await supabase
    .from('lesson_progress')
    .select('lesson_id')
    .eq('user_id', userId)
    .eq('classroom_id', classroomId)
    .eq('is_completed', true);

  const completedLessonIds = (progressList || []).map((p) => p.lesson_id);

  if (!enrollment) {
    return {
      isEnrolled: false,
      enrollmentStatus: null,
      progressPercentage: 0,
      completedLessonIds,
      enrolledAt: null,
      completedAt: null,
    };
  }

  return {
    isEnrolled: true,
    enrollmentStatus: enrollment.status,
    progressPercentage: Number(enrollment.progress_percentage || 0),
    completedLessonIds,
    enrolledAt: enrollment.enrolled_at,
    completedAt: enrollment.completed_at,
  };
}

// 2. Get All Enrolled Courses for a Student Dashboard
export async function getStudentEnrolledCourses(userId: string): Promise<EnrolledCourseCardItem[]> {
  const supabase = createClient();

  const { data: enrollments } = await supabase
    .from('course_enrollments')
    .select('*, classrooms(id, slug, title, cover_image, grade_level, lessons(id))')
    .eq('user_id', userId)
    .order('last_accessed_at', { ascending: false });

  if (!enrollments) return [];

  return enrollments.map((en: Record<string, unknown>) => {
    const cr = en.classrooms as {
      id?: string;
      slug?: string;
      title?: string;
      cover_image?: string | null;
      grade_level?: string | null;
      lessons?: Array<{ id: string }>;
    } || {};

    const totalLessons = cr.lessons?.length || 0;
    const progressPct = Number(en.progress_percentage || 0);
    const completedLessons = totalLessons > 0 ? Math.round((progressPct / 100) * totalLessons) : 0;

    return {
      classroomId: (cr.id as string) || (en.classroom_id as string),
      slug: (cr.slug as string) || '',
      title: (cr.title as string) || 'คอร์สเรียนออนไลน์',
      coverImage: cr.cover_image || null,
      gradeLevel: cr.grade_level || 'ประถมศึกษาปีที่ 6',
      progressPercentage: progressPct,
      status: (en.status as 'active' | 'completed') || 'active',
      totalLessons,
      completedLessons,
      lastAccessedAt: en.last_accessed_at as string,
    };
  });
}
