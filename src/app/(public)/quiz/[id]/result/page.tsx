'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowLeft, 
  Clock, 
  Award,
  Sparkles
} from 'lucide-react';
import { getQuizById, type QuizWithQuestions } from '@/services/quiz';
import { Badge } from '@/components/ui/badge';

interface LocalQuizResult {
  score: number;
  totalPoints: number;
  timeSpent: number;
  answers: Record<string, string>;
}

export default function QuizResultPage() {
  const params = useParams();
  const quizId = params.id as string;

  const [quiz, setQuiz] = useState<QuizWithQuestions | null>(null);
  const [result] = useState<LocalQuizResult | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem(`quiz_result_${quizId}`);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return null;
        }
      }
    }
    return null;
  });

  useEffect(() => {
    let ignore = false;

    getQuizById(quizId).then((data) => {
      if (!ignore) setQuiz(data);
    });

    return () => {
      ignore = true;
    };
  }, [quizId]);

  if (!quiz || !result) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
          กำลังโหลดผลการทดสอบ...
        </h2>
        <Link
          href={`/quiz/${quizId}`}
          className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-bold hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับไปหน้าแบบทดสอบ</span>
        </Link>
      </div>
    );
  }

  const percentage = Math.round((result.score / result.totalPoints) * 100);
  const isPassed = percentage >= 60;
  const questions = quiz.questions || [];

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} นาที ${secs} วินาที`;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Score Summary Box */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xl text-center space-y-6">
        <div className="inline-flex p-4 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-white shadow-lg shadow-amber-500/20">
          <Trophy className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            ผลการประเมินแบบทดสอบ
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {quiz.title}
          </p>
        </div>

        {/* Big Score Display */}
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 max-w-sm mx-auto space-y-3">
          <div className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
            {result.score} <span className="text-2xl text-slate-400">/ {result.totalPoints}</span>
          </div>

          <div className="flex items-center justify-center gap-2">
            <Badge variant={isPassed ? 'success' : 'danger'}>
              {isPassed ? 'ผ่านเกณฑ์การประเมิน (Passed)' : 'ไม่ผ่านเกณฑ์การประเมิน'}
            </Badge>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              ({percentage}%)
            </span>
          </div>

          <div className="text-xs text-slate-400 flex items-center justify-center gap-1.5 pt-1">
            <Clock className="w-3.5 h-3.5" />
            <span>เวลาที่ใช้: {formatTimer(result.timeSpent)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href={`/quiz/${quiz.id}/play`}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ทำแบบทดสอบอีกครั้ง</span>
          </Link>

          <Link
            href="/quiz"
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
          >
            กลับหน้ารวมแบบทดสอบ
          </Link>
        </div>
      </div>

      {/* Detailed Question Review List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-600" />
          <span>เฉลยละเอียดและทบทวนคำตอบ (Answer Review)</span>
        </h2>

        <div className="space-y-4">
          {questions.map((q, idx) => {
            const userChoiceId = result.answers[q.id];
            const correctChoice = q.choices.find((c) => c.is_correct);
            const isCorrect = userChoiceId === correctChoice?.id;

            return (
              <div
                key={q.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0">
                      {idx + 1}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {q.question}
                    </h3>
                  </div>

                  <div className="shrink-0">
                    {isCorrect ? (
                      <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>ถูกต้อง (+{q.points})</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-rose-600 text-xs font-bold">
                        <XCircle className="w-4 h-4" />
                        <span>ตอบผิด (0)</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Choices list review */}
                <div className="space-y-2 text-xs">
                  {q.choices.map((c) => {
                    const isUserPick = c.id === userChoiceId;
                    const isAnswer = c.is_correct;

                    let rowStyle = 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-600 dark:text-slate-400';
                    if (isAnswer) {
                      rowStyle = 'border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 font-semibold';
                    } else if (isUserPick && !isAnswer) {
                      rowStyle = 'border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200';
                    }

                    return (
                      <div
                        key={c.id}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-2 ${rowStyle}`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{c.choice_text}</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] shrink-0 font-bold">
                          {isUserPick && !isAnswer && <span className="text-rose-600">คำตอบของคุณ ✗</span>}
                          {isAnswer && <span className="text-emerald-600">คำตอบที่ถูกต้อง ✓</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Teacher Explanation */}
                {q.explanation && (
                  <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60 text-xs space-y-1">
                    <div className="font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>คำอธิบายเฉลยจากครู:</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
