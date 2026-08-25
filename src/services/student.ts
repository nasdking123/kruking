import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

export interface StudentProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  avatar_url?: string | null;
  school?: string | null;
  grade_level?: string;
  student_number?: string;
  classroom_name?: string;
  created_at: string;
}

export interface StudentEnrollment {
  id: string;
  classroom_id: string;
  user_id: string;
  joined_at: string;
  classroom?: Database['public']['Tables']['classrooms']['Row'];
}

export interface StudentQuizAttempt {
  id: string;
  quiz_id: string;
  user_id: string | null;
  guest_name?: string | null;
  score: number;
  total_score: number;
  percentage: number;
  correct_count?: number;
  incorrect_count?: number;
  time_spent_seconds: number;
  started_at: string;
  submitted_at?: string | null;
  quiz_title?: string;
  grade_level?: string | null;
  subject?: string | null;
}

export interface StudentLearningLog {
  id: string;
  user_id: string;
  lesson_id: string;
  action: 'view' | 'complete';
  created_at: string;
  lesson_title?: string;
}

export interface StudentAnalyticsItem extends StudentProfile {
  enrollments: StudentEnrollment[];
  attempts: StudentQuizAttempt[];
  learning_logs: Array<{ id: string; user_id: string | null; entity_type: string; entity_id: string; created_at: string }>;
  completed_lessons_count: number;
  average_score: number;
}

interface SocialLinksMetadata {
  grade_level?: string;
  student_number?: string;
  classroom_name?: string;
}

/**
 * Register new student account
 */
export async function registerStudent(payload: {
  email: string;
  password: string;
  fullName: string;
  gradeLevel: string;
  studentNumber?: string;
  classroomName?: string;
  school?: string;
}): Promise<{ success: boolean; data?: unknown; error?: string }> {
  try {
    const res = await fetch('/api/student/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

/**
 * Get student profile
 */
export async function getStudentProfile(userId: string): Promise<StudentProfile | null> {
  try {
    const supabase = createClient();
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error || !profile) return null;

    const extra = (profile.social_links as unknown as SocialLinksMetadata) || {};

    return {
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name,
      role: profile.role || 'student',
      avatar_url: profile.avatar_url,
      school: profile.school,
      grade_level: extra.grade_level || 'ประถมศึกษาปีที่ 6',
      student_number: extra.student_number || '-',
      classroom_name: extra.classroom_name || 'ห้อง 1',
      created_at: profile.created_at,
    };
  } catch {
    return null;
  }
}

/**
 * Enroll student into a classroom using Join Code
 */
export async function enrollClassroom(payload: {
  userId: string;
  joinCode: string;
}): Promise<{ success: boolean; classroomTitle?: string; error?: string }> {
  try {
    const res = await fetch('/api/student/enroll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

/**
 * Get all classrooms student is enrolled in
 */
export async function getStudentEnrollments(userId: string): Promise<StudentEnrollment[]> {
  try {
    const supabase = createClient();
    const { data: members, error } = await supabase
      .from('classroom_members')
      .select('*, classrooms(*)')
      .eq('user_id', userId);

    if (error || !members) return [];

    const rawList = members as unknown as Array<{
      id: string;
      classroom_id: string;
      user_id: string;
      joined_at: string;
      classrooms?: Database['public']['Tables']['classrooms']['Row'];
    }>;

    return rawList.map((m) => ({
      id: m.id,
      classroom_id: m.classroom_id,
      user_id: m.user_id,
      joined_at: m.joined_at,
      classroom: m.classrooms,
    }));
  } catch {
    return [];
  }
}

/**
 * Log student lesson viewing or completion
 */
export async function logLessonActivity(payload: {
  userId: string;
  lessonId: string;
  action: 'view' | 'complete';
}): Promise<boolean> {
  try {
    const res = await fetch('/api/student/learning-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    return json.success || false;
  } catch {
    return false;
  }
}

/**
 * Get student learning logs (completed lessons & views)
 */
export async function getStudentLearningLogs(userId: string): Promise<StudentLearningLog[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('views')
      .select('*')
      .eq('user_id', userId)
      .in('entity_type', ['lesson_view', 'lesson_complete'])
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    const rawViews = data as unknown as Array<{
      id: string;
      user_id: string | null;
      entity_type: string;
      entity_id: string;
      created_at: string;
    }>;

    return rawViews.map((d) => ({
      id: d.id,
      user_id: d.user_id || userId,
      lesson_id: d.entity_id,
      action: d.entity_type === 'lesson_complete' ? 'complete' : 'view',
      created_at: d.created_at,
    }));
  } catch {
    return [];
  }
}

/**
 * Get student quiz attempts and scores
 */
export async function getStudentQuizAttempts(userId: string): Promise<StudentQuizAttempt[]> {
  try {
    const supabase = createClient();
    const { data: attempts, error } = await supabase
      .from('quiz_attempts')
      .select('*, quizzes(title, grade_level, subject)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !attempts) return [];

    const rawAttempts = attempts as unknown as Array<{
      id: string;
      quiz_id: string;
      user_id: string | null;
      guest_name?: string | null;
      score: number;
      total_points?: number;
      total_score?: number;
      percentage: number;
      correct_count?: number;
      incorrect_count?: number;
      time_spent_seconds: number;
      created_at: string;
      quizzes?: { title?: string; grade_level?: string | null; subject?: string | null };
    }>;

    return rawAttempts.map((att) => ({
      id: att.id,
      quiz_id: att.quiz_id,
      user_id: att.user_id,
      guest_name: att.guest_name,
      score: att.score,
      total_score: att.total_points || att.total_score || 10,
      percentage: att.percentage,
      correct_count: att.correct_count || att.score,
      incorrect_count: att.incorrect_count || 0,
      time_spent_seconds: att.time_spent_seconds || 60,
      started_at: att.created_at,
      submitted_at: att.created_at,
      quiz_title: att.quizzes?.title || 'แบบทดสอบออนไลน์',
      grade_level: att.quizzes?.grade_level,
      subject: att.quizzes?.subject,
    }));
  } catch {
    return [];
  }
}

/**
 * Admin / Teacher: Get all students analytics (Profiles, Enrollments, Scores, Learning Logs)
 */
export async function getAllStudentsAnalytics(): Promise<StudentAnalyticsItem[]> {
  try {
    const supabase = createClient();
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'student')
      .order('created_at', { ascending: false });

    const { data: enrollments } = await supabase
      .from('classroom_members')
      .select('*, classrooms(*)');

    const { data: attempts } = await supabase
      .from('quiz_attempts')
      .select('*, quizzes(title, grade_level, subject)')
      .order('created_at', { ascending: false });

    const { data: logs } = await supabase
      .from('views')
      .select('*')
      .in('entity_type', ['lesson_view', 'lesson_complete']);

    const students = profiles || [];
    
    const allEnrollments = (enrollments || []) as unknown as Array<{
      id: string;
      classroom_id: string;
      user_id: string;
      joined_at: string;
      classrooms?: Database['public']['Tables']['classrooms']['Row'];
    }>;

    const allAttempts = (attempts || []) as unknown as Array<{
      id: string;
      quiz_id: string;
      user_id: string | null;
      guest_name?: string | null;
      score: number;
      total_points?: number;
      total_score?: number;
      percentage: number;
      correct_count?: number;
      incorrect_count?: number;
      time_spent_seconds: number;
      created_at: string;
      quizzes?: { title?: string; grade_level?: string | null; subject?: string | null };
    }>;

    const allLogs = (logs || []) as unknown as Array<{
      id: string;
      user_id: string | null;
      entity_type: string;
      entity_id: string;
      created_at: string;
    }>;

    return students.map((std) => {
      const extra = (std.social_links as unknown as SocialLinksMetadata) || {};
      
      const stdEnrollments: StudentEnrollment[] = allEnrollments
        .filter((e) => e.user_id === std.id)
        .map((e) => ({
          id: e.id,
          classroom_id: e.classroom_id,
          user_id: e.user_id,
          joined_at: e.joined_at,
          classroom: e.classrooms,
        }));

      const stdAttempts: StudentQuizAttempt[] = allAttempts
        .filter((a) => a.user_id === std.id)
        .map((a) => ({
          id: a.id,
          quiz_id: a.quiz_id,
          user_id: a.user_id,
          guest_name: a.guest_name,
          score: a.score,
          total_score: a.total_points || a.total_score || 10,
          percentage: a.percentage,
          correct_count: a.correct_count || a.score,
          incorrect_count: a.incorrect_count || 0,
          time_spent_seconds: a.time_spent_seconds || 60,
          started_at: a.created_at,
          submitted_at: a.created_at,
          quiz_title: a.quizzes?.title || 'แบบทดสอบออนไลน์',
          grade_level: a.quizzes?.grade_level,
          subject: a.quizzes?.subject,
        }));

      const stdLogs = allLogs.filter((l) => l.user_id === std.id);
      const completedCount = stdLogs.filter((l) => l.entity_type === 'lesson_complete').length;

      const avgScore = stdAttempts.length > 0
        ? Math.round(stdAttempts.reduce((sum, a) => sum + (a.percentage || 0), 0) / stdAttempts.length)
        : 0;

      return {
        id: std.id,
        email: std.email,
        full_name: std.full_name,
        role: std.role || 'student',
        avatar_url: std.avatar_url,
        school: std.school,
        created_at: std.created_at,
        grade_level: extra.grade_level || 'ประถมศึกษาปีที่ 6',
        student_number: extra.student_number || '-',
        classroom_name: extra.classroom_name || 'ห้อง 1',
        enrollments: stdEnrollments,
        attempts: stdAttempts,
        learning_logs: stdLogs,
        completed_lessons_count: completedCount,
        average_score: avgScore,
      };
    });
  } catch (err) {
    console.error('getAllStudentsAnalytics exception:', err);
    return [];
  }
}
