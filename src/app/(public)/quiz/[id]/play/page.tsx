'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  AlertTriangle, 
  Send,
  HelpCircle
} from 'lucide-react';
import { getQuizById, saveQuizAttempt, type QuizWithQuestions, type QuestionWithChoices } from '@/services/quiz';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';

export default function QuizRunnerPage() {
  const params = useParams();
  const quizId = params.id as string;
  const router = useRouter();
  const toast = useToast();

  const [quiz, setQuiz] = useState<QuizWithQuestions | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let ignore = false;
    getQuizById(quizId).then((data) => {
      if (!ignore && data) {
        setQuiz(data);
        setTimeLeft(data.time_limit * 60);
      }
    });
    return () => {
      ignore = true;
    };
  }, [quizId]);

  const handleSubmit = useCallback(async () => {
    if (!quiz || !quiz.questions || isSubmitting) return;

    setIsSubmitting(true);
    let calculatedScore = 0;
    const totalPoints = quiz.questions.length;

    quiz.questions.forEach((q) => {
      const selectedChoiceId = selectedAnswers[q.id];
      const correctChoice = q.choices.find((c) => c.is_correct);
      if (selectedChoiceId && correctChoice && selectedChoiceId === correctChoice.id) {
        calculatedScore += q.points;
      }
    });

    const timeSpent = quiz.time_limit * 60 - timeLeft;

    const attempt = await saveQuizAttempt({
      quiz_id: quiz.id,
      score: calculatedScore,
      total_points: totalPoints,
      time_spent_seconds: timeSpent > 0 ? timeSpent : 1,
      answers: selectedAnswers,
    });

    // save attempt details to sessionStorage for the result view
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(
        `quiz_result_${quiz.id}`,
        JSON.stringify({
          score: calculatedScore,
          totalPoints,
          timeSpent,
          answers: selectedAnswers,
        })
      );
    }

    toast.success('ส่งแบบทดสอบเรียบร้อย', `คุณได้คะแนน ${calculatedScore}/${totalPoints} คะแนน`);
    router.push(`/quiz/${quiz.id}/result?attemptId=${attempt.id}`);
  }, [quiz, isSubmitting, selectedAnswers, timeLeft, toast, router]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0 || !quiz) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, quiz, handleSubmit]);

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center text-slate-400 text-xs">
        กำลังโหลดชุดแบบทดสอบ...
      </div>
    );
  }

  const questions: QuestionWithChoices[] = quiz.questions;
  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercent = Math.round((answeredCount / questions.length) * 100);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectChoice = (questionId: string, choiceId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: choiceId,
    }));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Sticky Timer & Progress Header */}
      <div className="sticky top-16 z-30 p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-slate-900 dark:text-white block">
            ข้อที่ {currentQuestionIndex + 1} จาก {questions.length}
          </span>
          <span className="text-[11px] text-slate-400">
            ตอบแล้ว {answeredCount}/{questions.length} ข้อ ({progressPercent}%)
          </span>
        </div>

        {/* Timer Badge */}
        <div
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold shadow-xs transition-colors ${
            timeLeft < 120
              ? 'bg-rose-500 text-white animate-pulse'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{formatTimer(timeLeft)}</span>
        </div>
      </div>

      {/* Question Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-md space-y-6">
        {/* Question Text */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-[11px] font-bold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>คำถามข้อที่ {currentQuestionIndex + 1} ({currentQuestion.points} คะแนน)</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
            {currentQuestion.question}
          </h2>
        </div>

        {/* Choices List */}
        <div className="space-y-3">
          {currentQuestion.choices.map((choice, cIdx) => {
            const isSelected = selectedAnswers[currentQuestion.id] === choice.id;
            return (
              <button
                key={choice.id}
                type="button"
                onClick={() => handleSelectChoice(currentQuestion.id, choice.id)}
                className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500'
                    }`}
                  >
                    {String.fromCharCode(65 + cIdx)}
                  </div>
                  <span className="text-xs sm:text-sm font-medium leading-relaxed">
                    {choice.choice_text}
                  </span>
                </div>

                {isSelected && (
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="pt-6 flex items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            disabled={currentQuestionIndex === 0}
            onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>ข้อก่อนหน้า</span>
          </button>

          {currentQuestionIndex < questions.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
              className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold shadow-xs flex items-center gap-1 cursor-pointer"
            >
              <span>ข้อถัดไป</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(true)}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>ส่งข้อสอบ</span>
            </button>
          )}
        </div>
      </div>

      {/* Question Number Quick Grid */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-2">
        <span className="text-[11px] font-semibold text-slate-500 block">
          เลือกข้ามไปข้อที่ต้องการ:
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          {questions.map((q, idx) => {
            const isAnswered = Boolean(selectedAnswers[q.id]);
            const isCurrent = currentQuestionIndex === idx;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center transition-all cursor-pointer ${
                  isCurrent
                    ? 'ring-2 ring-blue-500 ring-offset-2 bg-blue-600 text-white shadow-xs'
                    : isAnswered
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="ยืนยันการส่งแบบทดสอบ"
        description="ตรวจสอบความเรียบร้อยก่อนส่งคะแนนประเมินผล"
      >
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>ตอบแล้ว:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {answeredCount} / {questions.length} ข้อ
              </span>
            </div>
            {answeredCount < questions.length && (
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 pt-1 font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>ยังมีอีก {questions.length - answeredCount} ข้อที่ยังไม่ได้ตอบ</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
            >
              กลับไปทำต่อ
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                setIsSubmitModalOpen(false);
                handleSubmit();
              }}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
            >
              {isSubmitting ? 'กำลังส่ง...' : 'ยืนยันส่งข้อสอบ'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
