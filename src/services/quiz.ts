import { createClient } from '@/lib/supabase/client';
import type { Database, Json } from '@/types/database';

export type QuizRow = Database['public']['Tables']['quizzes']['Row'];
export type QuestionRow = Database['public']['Tables']['quiz_questions']['Row'];
export type ChoiceRow = Database['public']['Tables']['quiz_choices']['Row'];
export type QuizAttemptRow = Database['public']['Tables']['quiz_attempts']['Row'];

export interface QuestionWithChoices extends QuestionRow {
  choices: ChoiceRow[];
}

export interface QuizWithQuestions extends QuizRow {
  questions?: QuestionWithChoices[];
  attemptsCount?: number;
}

export interface AdminQuizAttemptItem {
  id: string;
  quizId: string;
  quizTitle: string;
  userId: string | null;
  studentName: string;
  studentGrade: string;
  studentRoom: string;
  studentSchool: string;
  score: number;
  totalScore: number;
  percentage: number;
  passed: boolean;
  timeSpentSeconds: number;
  submittedAt: string;
  answersSummary?: Record<string, string>;
}

// 1. Get Quizzes for Public and Admin
export async function getQuizzes(): Promise<QuizWithQuestions[]> {
  try {
    const supabase = createClient();
    const [quizzesRes, attemptsRes] = await Promise.all([
      supabase
        .from('quizzes')
        .select('*, questions:quiz_questions(*, choices:quiz_choices(*))')
        .order('created_at', { ascending: false }),
      supabase.from('quiz_attempts').select('quiz_id'),
    ]);

    if (quizzesRes.error || !quizzesRes.data) {
      return [];
    }

    const attempts = (attemptsRes.data || []) as Array<{ quiz_id: string }>;
    const attemptsMap: Record<string, number> = {};
    attempts.forEach((a) => {
      attemptsMap[a.quiz_id] = (attemptsMap[a.quiz_id] || 0) + 1;
    });

    return (quizzesRes.data as unknown as QuizWithQuestions[]).map((q) => ({
      ...q,
      attemptsCount: attemptsMap[q.id] || 0,
    }));
  } catch {
    return [];
  }
}

// 2. Get Quiz by ID or Slug
export async function getQuizById(idOrSlug: string): Promise<QuizWithQuestions | null> {
  try {
    const supabase = createClient();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    
    const query = supabase
      .from('quizzes')
      .select('*, questions:quiz_questions(*, choices:quiz_choices(*))');

    const { data, error } = isUuid 
      ? await query.eq('id', idOrSlug).maybeSingle()
      : await query.eq('slug', idOrSlug).maybeSingle();

    if (error || !data) {
      return null;
    }
    return data as unknown as QuizWithQuestions;
  } catch {
    return null;
  }
}

// 3. Verify Access Code / Passcode
export function verifyQuizPasscode(quiz: QuizWithQuestions, inputCode?: string): boolean {
  if (!quiz.access_code || !quiz.is_passcode_required) {
    return true; // No password required
  }
  const cleanInput = (inputCode || '').trim();
  const cleanPasscode = (quiz.access_code || '').trim();
  return cleanInput.toLowerCase() === cleanPasscode.toLowerCase();
}

// 4. Save Quiz Attempt & Award Points
export async function saveQuizAttempt(attempt: {
  quiz_id: string;
  user_id?: string;
  score: number;
  total_points: number;
  answers: Record<string, string>;
  time_spent_seconds: number;
}) {
  try {
    const supabase = createClient();
    let currentUserId = attempt.user_id;
    let studentName = 'นักเรียนทั่วไป';
    let studentGrade = '-';
    let studentRoom = '-';
    let studentSchool = 'โรงเรียนวัดบางโฉลงใน';

    if (!currentUserId) {
      const { data: { user } } = await supabase.auth.getUser();
      currentUserId = user?.id;
      if (user) {
        studentName = user.user_metadata?.full_name || 'นักเรียน';
      }
    }

    // Fetch profile details if user exists
    if (currentUserId) {
      const { data: prof } = await supabase
        .from('profiles')
        .select('full_name, grade_level, classroom, school_name')
        .eq('id', currentUserId)
        .maybeSingle();

      if (prof) {
        studentName = prof.full_name || studentName;
        studentGrade = prof.grade_level || studentGrade;
        studentRoom = prof.classroom || studentRoom;
        studentSchool = prof.school_name || studentSchool;
      }
    }

    // Fetch quiz info for passing score
    const { data: quizInfo } = await supabase
      .from('quizzes')
      .select('title, passing_score, points_reward')
      .eq('id', attempt.quiz_id)
      .maybeSingle();

    const passingScore = quizInfo?.passing_score || 60;
    const pointsReward = quizInfo?.points_reward || 20;

    const percentage = attempt.total_points > 0 ? Math.round((attempt.score / attempt.total_points) * 100) : 0;
    const isPassed = percentage >= passingScore;
    
    const { error } = await supabase
      .from('quiz_attempts')
      .insert([{
        quiz_id: attempt.quiz_id,
        user_id: currentUserId || null,
        guest_name: !currentUserId ? studentName : null,
        student_name: studentName,
        student_grade: studentGrade,
        student_room: studentRoom,
        student_school: studentSchool,
        score: attempt.score,
        total_score: attempt.total_points,
        percentage,
        passed: isPassed,
        answers_summary: attempt.answers as unknown as Json,
        correct_count: attempt.score,
        incorrect_count: Math.max(0, attempt.total_points - attempt.score),
        time_spent_seconds: attempt.time_spent_seconds,
        started_at: new Date().toISOString(),
        submitted_at: new Date().toISOString(),
      }]);

    if (error) {
      return { success: false, error: error.message, id: `attempt-${Date.now()}` };
    }

    // Award Gamification Points if user is logged in & passed
    if (currentUserId && isPassed) {
      const { data: existingTx } = await supabase
        .from('point_transactions')
        .select('id')
        .eq('user_id', currentUserId)
        .eq('source_id', attempt.quiz_id)
        .eq('point_type', 'quiz')
        .maybeSingle();

      if (!existingTx) {
        await supabase.from('point_transactions').insert({
          user_id: currentUserId,
          amount: pointsReward,
          point_type: 'quiz',
          source_id: attempt.quiz_id,
          description: `ผ่านแบบทดสอบ "${quizInfo?.title || 'แบบทดสอบออนไลน์'}" (${percentage}%) (+${pointsReward} คะแนน)`,
        });

        // Add Notification
        await supabase.from('notifications').insert({
          user_id: currentUserId,
          title: `🎉 ยินดีด้วย! คุณสอบผ่าน "${quizInfo?.title || 'แบบทดสอบ'}"`,
          message: `คุณทำคะแนนได้ ${percentage}% ได้รับแต้มสะสม +${pointsReward} คะแนน`,
          type: 'points_awarded',
          link: '/student/dashboard',
        });
      }
    }

    return { success: true, id: `attempt-${Date.now()}`, isPassed, percentage };
  } catch (err) {
    return { success: false, error: String(err), id: `attempt-${Date.now()}` };
  }
}

// 5. Get Quiz Attempts for Admin
export async function getQuizAttemptsForAdmin(quizId?: string): Promise<AdminQuizAttemptItem[]> {
  try {
    const supabase = createClient();
    let query = supabase
      .from('quiz_attempts')
      .select('*, quizzes(title)')
      .order('submitted_at', { ascending: false });

    if (quizId && quizId !== 'ALL') {
      query = query.eq('quiz_id', quizId);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return (data as unknown as Array<Record<string, unknown>>).map((att) => {
      const qTitle = (att.quizzes as { title?: string })?.title || 'แบบทดสอบ';
      const pct = Number(att.percentage || 0);

      return {
        id: att.id as string,
        quizId: att.quiz_id as string,
        quizTitle: qTitle,
        userId: (att.user_id as string) || null,
        studentName: (att.student_name as string) || (att.guest_name as string) || 'นักเรียน',
        studentGrade: (att.student_grade as string) || 'ประถมศึกษาปีที่ 6',
        studentRoom: (att.student_room as string) || 'ห้อง 1',
        studentSchool: (att.student_school as string) || 'โรงเรียนวัดบางโฉลงใน',
        score: Number(att.score || 0),
        totalScore: Number(att.total_score || 0),
        percentage: pct,
        passed: att.passed !== false && pct >= 60,
        timeSpentSeconds: Number(att.time_spent_seconds || 0),
        submittedAt: (att.submitted_at as string) || (att.started_at as string) || new Date().toISOString(),
        answersSummary: (att.answers_summary as Record<string, string>) || {},
      };
    });
  } catch {
    return [];
  }
}
