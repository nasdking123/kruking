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
import { CertificateModal } from '@/components/public/certificate-modal';
import { generateCertificateCode, getThaiCertificateDate, type CertificateData } from '@/services/certificate';
import { createClient } from '@/lib/supabase/client';

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
  const [showCertModal, setShowCertModal] = useState(false);
  const [studentName, setStudentName] = useState('นักเรียนยอดเยี่ยม');

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

    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.user_metadata?.full_name) {
        setStudentName(user.user_metadata.full_name);
      }
    });

    return () => {
      ignore = true;
    };
  }, [quizId]);

  if (!quiz || !result) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
          ไม่พบข้อมูลผลการทดสอบ
        </h2>
        <p className="text-xs text-slate-500">
          กรุณาทำแบบทดสอบให้เสร็จสมบูรณ์ก่อนดูหน้านี้
        </p>
        <Link
          href={`/quiz/${quizId}/play`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>เริ่มทำแบบทดสอบ</span>
        </Link>
      </div>
    );
  }

  const percentage = result.totalPoints > 0 ? Math.round((result.score / result.totalPoints) * 100) : 0;
  const isPassed = percentage >= 60;
  const isHonor = percentage >= 80;
  const questions = quiz.questions || [];

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} นาที ${secs} วินาที`;
  };

  const certData: CertificateData = {
    certificateNo: generateCertificateCode('KCL-QUIZ'),
    studentName,
    gradeLevel: quiz.grade_level || 'ประถมศึกษาปีที่ 6',
    schoolName: 'โรงเรียนวัดบางโฉลงใน',
    title: `ผ่านการทดสอบวัดผลสัมฤทธิ์ทางการเรียน "${quiz.title}"`,
    score: result.score,
    totalScore: result.totalPoints,
    percentage,
    issueDate: getThaiCertificateDate(),
    teacherName: 'ครูจักรพงษ์ สำรองพันธ์',
    teacherTitle: 'ครูผู้สอนกลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี',
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

        {/* E-Certificate Banner if passed */}
        {isPassed && (
          <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-amber-950 dark:text-amber-300">
                  🎉 ยินดีด้วย! คุณผ่านเกณฑ์การทดสอบ {isHonor && '(ระดับดีเยี่ยม)'}
                </h4>
                <p className="text-[11px] text-amber-800 dark:text-amber-400">
                  คุณสามารถกดรับและพิมพ์เกียรติบัตรออนไลน์ได้ทันที
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowCertModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold shadow-md shadow-amber-500/20 flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>กดรับเกียรติบัตร</span>
            </button>
          </div>
        )}

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

                {/* Choices */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {q.choices.map((choice) => {
                    const isSelected = userChoiceId === choice.id;
                    const isChoiceCorrect = choice.is_correct;

                    let choiceStyle = 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-700 dark:text-slate-300';
                    if (isChoiceCorrect) {
                      choiceStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 font-bold';
                    } else if (isSelected && !isChoiceCorrect) {
                      choiceStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-300 line-through';
                    }

                    return (
                      <div
                        key={choice.id}
                        className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between gap-2 ${choiceStyle}`}
                      >
                        <span>{choice.choice_text}</span>
                        {isChoiceCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        {isSelected && !isChoiceCorrect && (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                {q.explanation && (
                  <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 text-xs text-blue-900 dark:text-blue-300 leading-relaxed">
                    <span className="font-bold">💡 คำอธิบายเฉลย: </span>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={showCertModal}
        onClose={() => setShowCertModal(false)}
        data={certData}
      />
    </div>
  );
}
