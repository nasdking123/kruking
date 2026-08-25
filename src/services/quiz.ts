import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

export type QuizRow = Database['public']['Tables']['quizzes']['Row'];
export type QuestionRow = Database['public']['Tables']['quiz_questions']['Row'];
export type ChoiceRow = Database['public']['Tables']['quiz_choices']['Row'];

export interface QuestionWithChoices extends QuestionRow {
  choices: ChoiceRow[];
}

export interface QuizWithQuestions extends QuizRow {
  questions?: QuestionWithChoices[];
}

export async function getQuizzes(): Promise<QuizWithQuestions[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('quizzes')
      .select('*, questions:quiz_questions(*, choices:quiz_choices(*))')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error || !data) {
      return [];
    }
    return data as unknown as QuizWithQuestions[];
  } catch {
    return [];
  }
}

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
    if (!currentUserId) {
      const { data: { user } } = await supabase.auth.getUser();
      currentUserId = user?.id;
    }

    const percentage = attempt.total_points > 0 ? Math.round((attempt.score / attempt.total_points) * 100) : 0;
    
    const { data, error } = await supabase
      .from('quiz_attempts')
      .insert([{
        quiz_id: attempt.quiz_id,
        user_id: currentUserId || null,
        score: attempt.score,
        total_score: attempt.total_points,
        percentage,
        correct_count: attempt.score,
        incorrect_count: Math.max(0, attempt.total_points - attempt.score),
        time_spent_seconds: attempt.time_spent_seconds,
        started_at: new Date().toISOString(),
        submitted_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message, id: `attempt-${Date.now()}` };
    }
    return { success: true, data, id: data?.id || `attempt-${Date.now()}` };
  } catch (err) {
    return { success: false, error: String(err), id: `attempt-${Date.now()}` };
  }
}
