import { createClient } from '@/lib/supabase/client';
import { awardPoints } from './student-learning';

export interface AssignmentItem {
  id: string;
  lessonId: string | null;
  classroomId: string | null;
  title: string;
  instructions: string;
  maxScore: number;
  dueDate: string | null;
  createdAt: string;
}

export interface SubmissionGradingItem {
  id: string;
  assignmentId: string | null;
  lessonId: string | null;
  classroomId: string | null;
  userId: string;
  studentName: string;
  studentGrade?: string;
  studentRoom?: string;
  studentSchool?: string;
  studentNumber?: string;
  submissionType: string;
  contentUrl: string | null;
  notes: string | null;
  score: number | null;
  maxScore: number;
  status: 'pending' | 'passed' | 'graded' | 'needs_revision';
  teacherFeedback: string | null;
  isInPortfolio: boolean;
  revisionCount?: number;
  submittedRevisions?: Array<Record<string, unknown>>;
  submittedAt: string;
  gradedAt: string | null;
  lessonTitle?: string;
  classroomTitle?: string;
}

// 1. Get all Submissions for Admin
export async function getAllSubmissions(filters?: {
  status?: string;
  school?: string;
  grade?: string;
  room?: string;
}): Promise<SubmissionGradingItem[]> {
  const supabase = createClient();
  let query = supabase
    .from('assignment_submissions')
    .select('*, lessons(title), classrooms(title)')
    .order('submitted_at', { ascending: false });

  if (filters?.status && filters.status !== 'ALL') {
    query = query.eq('status', filters.status as 'pending' | 'passed' | 'graded' | 'needs_revision');
  }

  const { data: rawSubmissions, error } = await query;
  if (error || !rawSubmissions) return [];

  const submissions = rawSubmissions as unknown as Array<Record<string, unknown>>;
  const userIds = Array.from(new Set(submissions.map((s) => s.user_id as string)));
  
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, grade_level, classroom, student_number, school_name')
    .in('id', userIds);

  const profileMap: Record<string, Record<string, string | null>> = {};
  (profiles || []).forEach((p) => {
    profileMap[p.id] = {
      grade: p.grade_level || null,
      room: p.classroom || null,
      school: p.school_name || null,
      studentNumber: p.student_number || null,
    };
  });

  return submissions.map((s) => {
    const prof = profileMap[s.user_id as string] || {};

    return {
      id: s.id as string,
      assignmentId: (s.assignment_id as string) || null,
      lessonId: (s.lesson_id as string) || null,
      classroomId: (s.classroom_id as string) || null,
      userId: s.user_id as string,
      studentName: (s.student_name as string) || 'นักเรียน',
      studentGrade: prof.grade || 'ประถมศึกษาปีที่ 6',
      studentRoom: prof.room || 'ห้อง 1',
      studentSchool: prof.school || 'โรงเรียนวัดบางโฉลงใน',
      studentNumber: prof.studentNumber || '1',
      submissionType: (s.submission_type as string) || 'link',
      contentUrl: (s.content_url as string) || null,
      notes: (s.notes as string) || null,
      score: s.score !== null && s.score !== undefined ? Number(s.score) : null,
      maxScore: Number(s.max_score || 20),
      status: (s.status as SubmissionGradingItem['status']) || 'pending',
      teacherFeedback: (s.teacher_feedback as string) || null,
      isInPortfolio: s.is_in_portfolio !== false,
      revisionCount: Number(s.revision_count || 1),
      submittedRevisions: (s.submitted_revisions as Array<Record<string, unknown>>) || [],
      submittedAt: s.submitted_at as string,
      gradedAt: (s.graded_at as string) || null,
      lessonTitle: (s.lessons as { title?: string })?.title || 'บทเรียน Scratch',
      classroomTitle: (s.classrooms as { title?: string })?.title || 'วิทยาการคำนวณ',
    };
  });
}

// 2. Grade a Submission (Updates score + automatically awards points to student ledger!)
export async function gradeStudentSubmission(params: {
  submissionId: string;
  userId: string;
  score: number;
  teacherFeedback: string;
  status: 'passed' | 'graded' | 'needs_revision';
  gradedByAdminId?: string;
  lessonTitle?: string;
}) {
  const supabase = createClient();

  const { error } = await supabase
    .from('assignment_submissions')
    .update({
      score: params.score,
      teacher_feedback: params.teacherFeedback,
      status: params.status,
      graded_at: new Date().toISOString(),
    })
    .eq('id', params.submissionId);

  if (error) {
    return { success: false, error: error.message };
  }

  // If score > 0, award points to student ledger!
  if (params.score > 0) {
    await awardPoints({
      userId: params.userId,
      amount: params.score,
      pointType: 'assignment',
      sourceId: params.submissionId,
      description: `คะแนนส่งการบ้านบทเรียน "${params.lessonTitle || 'บทเรียนออนไลน์'}" (+${params.score} คะแนน)`,
      createdBy: params.gradedByAdminId,
    });
  }

  return { success: true };
}
