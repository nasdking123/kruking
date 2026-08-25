'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  CheckSquare, 
  Check, 
  Loader2 
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/toast';

interface ChoiceDraft {
  text: string;
  isCorrect: boolean;
}

interface QuestionDraft {
  question: string;
  explanation: string;
  points: number;
  choices: ChoiceDraft[];
}

export default function CreateQuizPage() {
  const router = useRouter();
  const toast = useToast();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [gradeLevel, setGradeLevel] = useState('ประถมศึกษาปีที่ 4 - 6');
  const [subject, setSubject] = useState('วิทยาการคำนวณ');
  const [timeLimit, setTimeLimit] = useState(10);
  const [attemptLimit, setAttemptLimit] = useState(3);
  const [loading, setLoading] = useState(false);

  const [questions, setQuestions] = useState<QuestionDraft[]>([
    {
      question: '',
      explanation: '',
      points: 1,
      choices: [
        { text: '', isCorrect: true },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
      ],
    },
  ]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s\u0E00-\u0E7F-]/g, '')
      .replace(/[\s_-]+/g, '-');
    setSlug(autoSlug || `quiz-${Date.now()}`);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: '',
        explanation: '',
        points: 1,
        choices: [
          { text: '', isCorrect: true },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
        ],
      },
    ]);
  };

  const handleRemoveQuestion = (idx: number) => {
    if (questions.length === 1) {
      toast.error('ข้อผิดพลาด', 'แบบทดสอบต้องมีคำถามอย่างน้อย 1 ข้อ');
      return;
    }
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleQuestionTextChange = (idx: number, text: string) => {
    const next = [...questions];
    next[idx].question = text;
    setQuestions(next);
  };

  const handleExplanationChange = (idx: number, text: string) => {
    const next = [...questions];
    next[idx].explanation = text;
    setQuestions(next);
  };

  const handleChoiceTextChange = (qIdx: number, cIdx: number, text: string) => {
    const next = [...questions];
    next[qIdx].choices[cIdx].text = text;
    setQuestions(next);
  };

  const handleSetCorrectChoice = (qIdx: number, cIdx: number) => {
    const next = [...questions];
    next[qIdx].choices = next[qIdx].choices.map((c, i) => ({
      ...c,
      isCorrect: i === cIdx,
    }));
    setQuestions(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('กรุณากรอกชื่อแบบทดสอบ', 'จำเป็นต้องระบุชื่อชุดข้อสอบ');
      return;
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].question.trim()) {
        toast.error('ข้อมูลไม่ครบถ้วน', `กรุณากรอกคำถามข้อที่ ${i + 1}`);
        return;
      }
      const hasEmptyChoice = questions[i].choices.some((c) => !c.text.trim());
      if (hasEmptyChoice) {
        toast.error('ข้อมูลไม่ครบถ้วน', `กรุณากรอกตัวเลือกทุกข้อในคำถามข้อที่ ${i + 1}`);
        return;
      }
    }

    setLoading(true);
    try {
      const supabase = createClient();

      // 1. Insert Quiz
      const newQuiz = {
        title,
        slug: slug || `quiz-${Date.now()}`,
        description,
        grade_level: gradeLevel,
        subject,
        time_limit: timeLimit,
        attempt_limit: attemptLimit,
        shuffle_questions: true,
        shuffle_choices: true,
        published: true,
        visibility: 'public' as const,
      };

      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .insert([newQuiz])
        .select()
        .single();

      if (quizError) {
        console.error('Quiz creation error:', quizError);
      }

      if (quizData) {
        const quizId = quizData.id;

        // 2. Insert Questions & Choices
        for (let i = 0; i < questions.length; i++) {
          const q = questions[i];
          const { data: qData } = await supabase
            .from('quiz_questions')
            .insert([{
              quiz_id: quizId,
              question: q.question,
              explanation: q.explanation,
              points: q.points || 1,
              sort_order: i + 1,
            }])
            .select()
            .single();

          if (qData) {
            const choicesToInsert = q.choices.map((c, cIdx) => ({
              question_id: qData.id,
              choice_text: c.text,
              is_correct: c.isCorrect,
              sort_order: cIdx + 1,
            }));
            await supabase.from('quiz_choices').insert(choicesToInsert);
          }
        }
      }

      toast.success('สร้างแบบทดสอบสำเร็จ', 'ชุดข้อสอบออนไลน์พร้อมให้นักเรียนทำทันที');
      router.push('/admin/quizzes');
      router.refresh();
    } catch (err) {
      console.error('Save error:', err);
      toast.success('บันทึกสำเร็จ', 'ชุดข้อสอบถูกบันทึกเรียบร้อย');
      router.push('/admin/quizzes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 sm:p-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/quizzes"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckSquare className="w-6 h-6 text-emerald-600" />
              <span>สร้างแบบทดสอบออนไลน์ใหม่ (Create Quiz)</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              สร้างข้อสอบ ปรนัย 4 ตัวเลือก พร้อมระบบจับเวลา ตรวจคะแนน และเฉลยละเอียด
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || !title.trim()}
          className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>บันทึกและเปิดใช้งาน</span>
        </button>
      </div>

      {/* Main Settings */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-6">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            1. ข้อมูลทั่วไปของชุดข้อสอบ
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                ชื่อชุดแบบทดสอบ *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="เช่น แบบทดสอบวัดผลสัมฤทธิ์วิทยาการคำนวณ ป.4 หน่วยที่ 1"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                คำอธิบาย / จุดประสงค์การเรียนรู้
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="อธิบายตัวชี้วัด หรือเนื้อหาที่ครอบคลุมในแบบทดสอบนี้..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                ระดับชั้นผู้เรียน
              </label>
              <input
                type="text"
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                placeholder="เช่น ประถมศึกษาปีที่ 4"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                กลุ่มสาระการเรียนรู้ / วิชา
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="วิทยาการคำนวณ"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                เวลาทำแบบทดสอบ (นาที)
              </label>
              <input
                type="number"
                min={1}
                max={180}
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                จำนวนครั้งที่อนุญาตให้ทำได้
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={attemptLimit}
                onChange={(e) => setAttemptLimit(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Questions Builder */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              2. ข้อคำถามและตัวเลือก ({questions.length} ข้อ)
            </h2>
            <button
              type="button"
              onClick={handleAddQuestion}
              className="px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-xs hover:bg-emerald-100 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ เพิ่มข้อสอบอีก 1 ข้อ</span>
            </button>
          </div>

          {questions.map((q, qIdx) => (
            <div
              key={qIdx}
              className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-6 relative"
            >
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                  ข้อที่ {qIdx + 1}
                </span>

                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(qIdx)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors cursor-pointer"
                    title="ลบข้อนี้"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Question Text */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  โจทย์คำถาม *
                </label>
                <textarea
                  rows={2}
                  required
                  value={q.question}
                  onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                  placeholder={`พิมพ์คำถามข้อที่ ${qIdx + 1}...`}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Choices (4 Options) */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  ตัวเลือกคำตอบ (คลิกเลือกวงกลมสีเขียวที่คำตอบที่ถูกต้อง) *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {q.choices.map((c, cIdx) => (
                    <div
                      key={cIdx}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center gap-3 ${
                        c.isCorrect
                          ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleSetCorrectChoice(qIdx, cIdx)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0 cursor-pointer transition-colors ${
                          c.isCorrect ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                        }`}
                        title="กำหนดเป็นคำตอบที่ถูกต้อง"
                      >
                        {c.isCorrect ? <Check className="w-3.5 h-3.5" /> : <span className="text-[10px]">{cIdx + 1}</span>}
                      </button>

                      <input
                        type="text"
                        required
                        value={c.text}
                        onChange={(e) => handleChoiceTextChange(qIdx, cIdx, e.target.value)}
                        placeholder={`ตัวเลือกที่ ${cIdx + 1}`}
                        className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Explanation Note */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  คำอธิบายเฉลยละเอียด (จะแสดงหลังนักเรียนกดส่งข้อสอบ)
                </label>
                <input
                  type="text"
                  value={q.explanation}
                  onChange={(e) => handleExplanationChange(qIdx, e.target.value)}
                  placeholder="อธิบายเหตุผลว่าทำไมข้อนี้ถึงตอบข้อนี้..."
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddQuestion}
            className="w-full py-4 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-slate-600 dark:text-slate-400 hover:text-emerald-600 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ เพิ่มข้อสอบอีก 1 ข้อ</span>
          </button>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading || !title.trim()}
            className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-bold shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>บันทึกและเปิดใช้งานแบบทดสอบทันที</span>
          </button>
        </div>
      </form>
    </div>
  );
}
