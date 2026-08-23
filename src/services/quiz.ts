import { createClient } from '@/lib/supabase/client';
import type { Database, Json } from '@/types/database';

export type QuizRow = Database['public']['Tables']['quizzes']['Row'];
export type QuizQuestionRow = Database['public']['Tables']['quiz_questions']['Row'];
export type QuizChoiceRow = Database['public']['Tables']['quiz_choices']['Row'];
export type QuizAttemptRow = Database['public']['Tables']['quiz_attempts']['Row'];

export interface QuestionWithChoices extends QuizQuestionRow {
  choices: QuizChoiceRow[];
}

export interface QuizWithQuestions extends QuizRow {
  questions?: QuestionWithChoices[];
}

export const INITIAL_QUIZZES: QuizWithQuestions[] = [
  {
    id: 'quiz-1',
    work_id: null,
    classroom_id: 'cls-1',
    title: 'แบบทดสอบเก็บคะแนน: พื้นฐานการคิดเชิงคำนวณและ Scratch ป.4',
    slug: 'quiz-ct-scratch-basics-p4',
    description: 'ทดสอบความรู้ความเข้าใจเรื่อง 4 เสาหลักการคิดเชิงคำนวณ และการใช้งานบล็อกคำสั่งพื้นฐานใน Scratch (10 ข้อ)',
    grade_level: 'ประถมศึกษาปีที่ 4',
    subject: 'วิทยาการคำนวณ',
    time_limit: 15, // 15 minutes
    attempt_limit: 3,
    shuffle_questions: true,
    shuffle_choices: true,
    published: true,
    visibility: 'public',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    questions: [
      {
        id: 'q-1',
        quiz_id: 'quiz-1',
        question: 'ข้อใดคือความหมายของ "Decomposition (การแบ่งย่อยปัญหา)" ในแนวคิดเชิงคำนวณ?',
        explanation: 'Decomposition คือการแยกย่อยปัญหาหรือระบบที่ซับซ้อนออกเป็นส่วนย่อยๆ เพื่อให้ง่ายต่อการทำความเข้าใจและแก้ไข',
        points: 1,
        sort_order: 1,
        created_at: '',
        choices: [
          { id: 'c-1', question_id: 'q-1', choice_text: 'การแตกปัญหาใหญ่ออกเป็นปัญหาย่อยๆ ที่จัดการได้ง่าย', is_correct: true, sort_order: 1 },
          { id: 'c-2', question_id: 'q-1', choice_text: 'การมองหารูปแบบที่เกิดขึ้นซ้ำๆ ในปัญหา', is_correct: false, sort_order: 2 },
          { id: 'c-3', question_id: 'q-1', choice_text: 'การตัดรายละเอียดที่ไม่จำเป็นออก เหลือเฉพาะสิ่งสำคัญ', is_correct: false, sort_order: 3 },
          { id: 'c-4', question_id: 'q-1', choice_text: 'การเขียนลำดับขั้นตอนการแก้ปัญหาเป็นข้อๆ', is_correct: false, sort_order: 4 },
        ],
      },
      {
        id: 'q-2',
        quiz_id: 'quiz-1',
        question: 'หากนักเรียนต้องการให้ตัวละครใน Scratch เดินหน้า 50 ก้าว ต้องใช้บล็อกคำสั่งใดในกลุ่ม Motion?',
        explanation: 'บล็อก "move (50) steps" ใช้สำหรับสั่งให้ตัวละครเคลื่อนที่ไปข้างหน้าตามจำนวนก้าวที่ระบุ',
        points: 1,
        sort_order: 2,
        created_at: '',
        choices: [
          { id: 'c-5', question_id: 'q-2', choice_text: 'move (50) steps', is_correct: true, sort_order: 1 },
          { id: 'c-6', question_id: 'q-2', choice_text: 'turn right (50) degrees', is_correct: false, sort_order: 2 },
          { id: 'c-7', question_id: 'q-2', choice_text: 'go to x: 50 y: 50', is_correct: false, sort_order: 3 },
          { id: 'c-8', question_id: 'q-2', choice_text: 'glide (50) secs', is_correct: false, sort_order: 4 },
        ],
      },
      {
        id: 'q-3',
        quiz_id: 'quiz-1',
        question: 'บล็อกคำสั่งใดใน Scratch ที่ทำหน้าที่เป็น "จุดเริ่มต้น" เมื่อกดปุ่มธงเขียว?',
        explanation: 'บล็อก "when green flag clicked" อยู่ในกลุ่ม Events ทำหน้าที่เริ่มรันสคริปต์เมื่อคลิกธงเขียว',
        points: 1,
        sort_order: 3,
        created_at: '',
        choices: [
          { id: 'c-9', question_id: 'q-3', choice_text: 'when [green flag] clicked', is_correct: true, sort_order: 1 },
          { id: 'c-10', question_id: 'q-3', choice_text: 'when space key pressed', is_correct: false, sort_order: 2 },
          { id: 'c-11', question_id: 'q-3', choice_text: 'forever', is_correct: false, sort_order: 3 },
          { id: 'c-12', question_id: 'q-3', choice_text: 'start sound', is_correct: false, sort_order: 4 },
        ],
      },
    ],
  },
  {
    id: 'quiz-2',
    work_id: null,
    classroom_id: 'cls-2',
    title: 'แบบทดสอบ: ความรู้เบื้องต้นเกี่ยวกับบอร์ดสมองกล Micro:bit',
    slug: 'quiz-microbit-basics-p5',
    description: 'ทดสอบความรู้เกี่ยวกับเซนเซอร์บนบอร์ด Micro:bit, ปุ่มกด, และการใช้งาน MakeCode Block',
    grade_level: 'ประถมศึกษาปีที่ 5 - 6',
    subject: 'วิทยาการคำนวณ',
    time_limit: 10,
    attempt_limit: 2,
    shuffle_questions: true,
    shuffle_choices: true,
    published: true,
    visibility: 'public',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    questions: [
      {
        id: 'q-201',
        quiz_id: 'quiz-2',
        question: 'หน้าจอแสดงผลของบอร์ด Micro:bit ประกอบด้วยหลอดไฟ LED จำนวนกี่ดวง?',
        explanation: 'จอแสดงผลของบอร์ด Micro:bit มีหลอดไฟ LED เรียงกันเป็นตารางขนาด 5x5 รวมทั้งสิ้น 25 ดวง',
        points: 1,
        sort_order: 1,
        created_at: '',
        choices: [
          { id: 'c-201', question_id: 'q-201', choice_text: '25 ดวง (ตาราง 5x5)', is_correct: true, sort_order: 1 },
          { id: 'c-202', question_id: 'q-201', choice_text: '16 ดวง (ตาราง 4x4)', is_correct: false, sort_order: 2 },
          { id: 'c-203', question_id: 'q-201', choice_text: '36 ดวง (ตาราง 6x6)', is_correct: false, sort_order: 3 },
          { id: 'c-204', question_id: 'q-201', choice_text: '10 ดวง', is_correct: false, sort_order: 4 },
        ],
      },
    ],
  },
];

export async function getQuizzes(): Promise<QuizWithQuestions[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('published', true)
      .eq('visibility', 'public')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return INITIAL_QUIZZES;
    }
    return data as unknown as QuizWithQuestions[];
  } catch {
    return INITIAL_QUIZZES;
  }
}

export async function getQuizById(idOrSlug: string): Promise<QuizWithQuestions | null> {
  const all = await getQuizzes();
  return all.find((q) => q.id === idOrSlug || q.slug === idOrSlug) || null;
}

export async function saveQuizAttempt(data: {
  quiz_id: string;
  score: number;
  total_points: number;
  time_spent_seconds: number;
  answers: Record<string, string>;
}): Promise<QuizAttemptRow> {
  const percentage = Math.round((data.score / data.total_points) * 100);
  const attempt: QuizAttemptRow = {
    id: 'att-' + Date.now(),
    quiz_id: data.quiz_id,
    user_id: null,
    score: data.score,
    total_points: data.total_points,
    percentage,
    time_spent_seconds: data.time_spent_seconds,
    answers: data.answers as unknown as Json,
    created_at: new Date().toISOString(),
  };

  try {
    const supabase = createClient();
    await supabase.from('quiz_attempts').insert([attempt]);
  } catch {
    // fallback
  }

  return attempt;
}
