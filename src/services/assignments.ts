import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

export type AssignmentSubmissionRow = Database['public']['Tables']['assignment_submissions']['Row'];

export interface SubmitAssignmentPayload {
  lessonId: string;
  classroomId?: string | null;
  userId: string;
  studentName: string;
  submissionType: 'link' | 'image' | 'text';
  contentUrl?: string;
  notes?: string;
}

/**
 * Submit or update homework assignment for a lesson
 */
export async function submitAssignment(payload: SubmitAssignmentPayload): Promise<{ success: boolean; data?: AssignmentSubmissionRow; error?: string }> {
  try {
    const supabase = createClient();
    
    // Check if user already submitted for this lesson
    const { data: existing } = await supabase
      .from('assignment_submissions')
      .select('id')
      .eq('lesson_id', payload.lessonId)
      .eq('user_id', payload.userId)
      .maybeSingle();

    if (existing) {
      // Update submission
      const { data, error } = await supabase
        .from('assignment_submissions')
        .update({
          submission_type: payload.submissionType,
          content_url: payload.contentUrl || null,
          notes: payload.notes || null,
          student_name: payload.studentName,
          status: 'pending',
          submitted_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) return { success: false, error: error.message };
      return { success: true, data };
    }

    // Insert new submission
    const { data, error } = await supabase
      .from('assignment_submissions')
      .insert([{
        lesson_id: payload.lessonId,
        classroom_id: payload.classroomId || null,
        user_id: payload.userId,
        student_name: payload.studentName,
        submission_type: payload.submissionType,
        content_url: payload.contentUrl || null,
        notes: payload.notes || null,
        score: null,
        max_score: 10,
        status: 'pending',
        submitted_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error submitting assignment';
    return { success: false, error: message };
  }
}

/**
 * Get student's submission for a specific lesson
 */
export async function getStudentLessonSubmission(lessonId: string, userId: string): Promise<AssignmentSubmissionRow | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('assignment_submissions')
      .select('*')
      .eq('lesson_id', lessonId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
}

/**
 * Get all submissions by student across all lessons
 */
export async function getStudentAllSubmissions(userId: string): Promise<AssignmentSubmissionRow[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('assignment_submissions')
      .select('*')
      .eq('user_id', userId)
      .order('submitted_at', { ascending: false });

    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}

/**
 * Teacher: Get all student submissions with lesson titles
 */
export async function getAllAssignmentSubmissions(): Promise<Array<AssignmentSubmissionRow & { lesson_title?: string; classroom_title?: string }>> {
  try {
    const supabase = createClient();
    const { data: submissions, error } = await supabase
      .from('assignment_submissions')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error || !submissions) return [];

    const { data: lessons } = await supabase.from('lessons').select('id, title');
    const { data: classrooms } = await supabase.from('classrooms').select('id, title');

    const lessonMap = new Map((lessons || []).map((l) => [l.id, l.title]));
    const classMap = new Map((classrooms || []).map((c) => [c.id, c.title]));

    return submissions.map((s) => ({
      ...s,
      lesson_title: lessonMap.get(s.lesson_id) || 'บทเรียน',
      classroom_title: s.classroom_id ? classMap.get(s.classroom_id) : undefined,
    }));
  } catch {
    return [];
  }
}

/**
 * Teacher: Grade an assignment submission
 */
export async function gradeAssignmentSubmission({
  submissionId,
  score,
  feedback,
  status = 'graded',
}: {
  submissionId: string;
  score: number;
  feedback?: string;
  status?: 'graded' | 'needs_revision';
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('assignment_submissions')
      .update({
        score,
        teacher_feedback: feedback || null,
        status,
        graded_at: new Date().toISOString(),
      })
      .eq('id', submissionId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error grading assignment';
    return { success: false, error: message };
  }
}
