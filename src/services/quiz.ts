import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

export type QuizRow = Database['public']['Tables']['quizzes']['Row'];
export type QuizQuestionRow = Database['public']['Tables']['quiz_questions']['Row'];
export type QuizChoiceRow = Database['public']['Tables']['quiz_choices']['Row'];

export interface QuestionWithChoices extends QuizQuestionRow {
  choices: QuizChoiceRow[];
}

export interface QuizWithQuestions extends QuizRow {
  questions: QuestionWithChoices[];
}

export async function getQuizzes(): Promise<QuizWithQuestions[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('quizzes')
      .select('*, questions:quiz_questions(*, choices:quiz_choices(*))')
      .eq('published', true)
      .eq('visibility', 'public')
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
    const { data, error } = await supabase
      .from('quizzes')
      .select('*, questions:quiz_questions(*, choices:quiz_choices(*))')
      .eq('id', idOrSlug)
      .maybeSingle();

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
    const percentage = attempt.total_points > 0 ? (attempt.score / attempt.total_points) * 100 : 0;
    const { data, error } = await supabase
      .from('quiz_attempts')
      .insert([{
        quiz_id: attempt.quiz_id,
        user_id: attempt.user_id || null,
        score: attempt.score,
        total_points: attempt.total_points,
        percentage,
        time_spent_seconds: attempt.time_spent_seconds,
        answers: attempt.answers,
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
