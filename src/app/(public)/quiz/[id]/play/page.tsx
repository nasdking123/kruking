'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle, 
  Send,
  LogIn,
  Loader2,
  Lock
} from 'lucide-react';
import { getQuizById, saveQuizAttempt, type QuizWithQuestions } from '@/services/quiz';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';
import { createClient } from '@/lib/supabase/client';

export default function QuizRunnerPage() {
  const params = useParams();
  const quizId = params.id as string;
  const router = useRouter();
  const toast = useToast();

  const [quiz, setQuiz] = useState<QuizWithQuestions | null>(null);
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string } | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function init() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!ignore) {
        if (user) {
          setCurrentUser({
            id: user.id,
            name: user.user_metadata?.full_name || 'นักเรียน',
          });
        }
        setAuthChecking(false);
      }

      const data = await getQuizById(quizId);
      if (!ignore && data) {
        setQuiz(data);
        setTimeLeft(data.time_limit * 60);
      }
    }

    init();

    return () => {
      ignore = true;
    };
  }, [quizId]);

  const handleSubmit = useCallback(async () => {
    if (!quiz || !quiz.questions || isSubmitting) return;

    if (!currentUser) {
      toast.error('กรุณาเข้าสู่ระบบ', 'ต้องเข้าสู่ระบบก่อนส่งคำตอบ');
      router.push(`/student/login?redirectTo=/quiz/${quizId}/play`);
      return;
    }

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

    await saveQuizAttempt({
      quiz_id: quiz.id,
      user_id: currentUser.id,
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
          timeSpent: timeSpent > 0 ? timeSpent : 1,
          answers: selectedAnswers,
        })
      );
    }

    toast.success('ส่งคำตอบสำเร็จ!', 'ระบบบันทึกคะแนนลงสมุดรายงานผลการเรียนเรียบร้อย');
    router.push(`/quiz/${quiz.id}/result`);
  }, [quiz, isSubmitting, currentUser, selectedAnswers, timeLeft, quizId, router, toast]);

  // Timer Tick
  useEffect(() => {
    if (!quiz || timeLeft <= 0 || !currentUser) return;

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
  }, [quiz, timeLeft, currentUser, handleSubmit]);

  if (authChecking) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-xs text-slate-500 font-bold">กำลังตรวจสอบสิทธิ์การเข้าทำแบบทดสอบ...</span>
        </div>
      </div>
    );
  }

  // Not Logged In Auth Gate Screen
  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6 animate-in fade-in">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center mx-auto shadow-md">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            กรุณาเข้าสู่ระบบก่อนทำแบบทดสอบ
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            ระบบกำหนดให้นักเรียนต้องเข้าสู่ระบบก่อนทำข้อสอบ เพื่อบันทึกคะแนนสอบลงสมุดรายงานผลการเรียน และส่งให้ครูจักรพงษ์นำไปตัดเกรดลง ปพ.5
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-md space-y-4">
          <Link
            href={`/student/login?redirectTo=/quiz/${quizId}/play`}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span>เข้าสู่ระบบนักเรียน (Student Login)</span>
          </Link>

          <div className="text-xs text-slate-400">
            ยังไม่มีชื่อผู้ใช้นักเรียน?{' '}
            <Link
              href="/student/register"
              className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
            >
              สมัครสมาชิกที่นี่ (ไม่ต้องใช้อีเมล)
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
          ไม่พบข้อมูลแบบทดสอบ
        </h2>
        <button
          type="button"
          onClick={() => router.push('/quiz')}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
        >
          กลับหน้ารวมแบบทดสอบ
        </button>
      </div>
    );
  }

  const questions = quiz.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercent = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);

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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header & Timer Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
            ผู้ทำแบบทดสอบ: {currentUser.name}
          </span>
          <h1 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate max-w-[200px] sm:max-w-md">
            {quiz.title}
          </h1>
        </div>

        {/* Countdown Timer */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold ${
          timeLeft <= 120 
            ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950 dark:border-rose-800 dark:text-rose-400 animate-pulse' 
            : 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-300'
        }`}>
          <Clock className="w-3.5 h-3.5" />
          <span>{formatTimer(timeLeft)}</span>
        </div>
      </div>

      {/* Progress Line */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
          <span>ข้อที่ {currentQuestionIndex + 1} จาก {questions.length}</span>
          <span>ตอบแล้ว {answeredCount}/{questions.length} ข้อ</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      {currentQuestion ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-md space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                {currentQuestionIndex + 1}
              </span>
              <span className="text-xs text-slate-400">คำถาม ({currentQuestion.points} คะแนน)</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Choices Grid */}
          <div className="grid grid-cols-1 gap-3">
            {currentQuestion.choices.map((choice, index) => {
              const isSelected = selectedAnswers[currentQuestion.id] === choice.id;
              const choiceLabels = ['ก.', 'ข.', 'ค.', 'ง.', 'จ.'];

              return (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => handleSelectChoice(currentQuestion.id, choice.id)}
                  className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 dark:border-blue-500 text-blue-900 dark:text-blue-200 shadow-xs ring-1 ring-blue-600 dark:ring-blue-500'
                      : 'bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:border-slate-300'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {choiceLabels[index] || index + 1}
                  </span>
                  <span className="flex-1 leading-normal">{choice.choice_text}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-slate-400">ไม่มีข้อคำถามในแบบทดสอบนี้</div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          disabled={currentQuestionIndex === 0}
          onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>ข้อก่อนหน้า</span>
        </button>

        {currentQuestionIndex < questions.length - 1 ? (
          <button
            type="button"
            onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1 cursor-pointer"
          >
            <span>ข้อถัดไป</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>ส่งแบบทดสอบ</span>
          </button>
        )}
      </div>

      {/* Question Palette (Quick Jump) */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-3">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
          แผนผังข้อสอบ (คลิกเพื่อข้ามไปยังข้อที่ต้องการ)
        </span>
        <div className="flex flex-wrap gap-2">
          {questions.map((q, idx) => {
            const isAnswered = !!selectedAnswers[q.id];
            const isCurrent = idx === currentQuestionIndex;

            let btnStyle = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';
            if (isCurrent) {
              btnStyle = 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-400/50';
            } else if (isAnswered) {
              btnStyle = 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 font-bold';
            }

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`w-8 h-8 rounded-xl border text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${btnStyle}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Confirmation Submit Modal */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="ยืนยันการส่งแบบทดสอบ"
      >
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <p>
            คุณได้ตอบคำถามไปแล้ว <span className="font-bold text-blue-600">{answeredCount}</span> จากทั้งหมด{' '}
            <span className="font-bold">{questions.length}</span> ข้อ
          </p>

          {answeredCount < questions.length && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-amber-800 dark:text-amber-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>ยังมีข้อที่ยังไม่ได้ตอบอีก {questions.length - answeredCount} ข้อ ต้องการส่งเลยหรือไม่?</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 text-xs font-semibold"
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
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              {isSubmitting ? 'กำลังส่ง...' : 'ยืนยันและส่งคำตอบ'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
