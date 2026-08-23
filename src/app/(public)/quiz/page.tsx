import React from 'react';
import Link from 'next/link';
import { CheckSquare, Clock, ArrowRight, HelpCircle } from 'lucide-react';
import { getQuizzes } from '@/services/quiz';
import { Badge } from '@/components/ui/badge';

export default async function QuizCatalogPage() {
  const quizzes = await getQuizzes();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-tr from-emerald-700 via-teal-700 to-slate-900 text-white shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs">
          <CheckSquare className="w-3.5 h-3.5" />
          <span>Interactive Quiz & Assessment System</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          ระบบแบบทดสอบออนไลน์ (Quiz & Exam)
        </h1>
        <p className="text-sm text-emerald-100 max-w-2xl leading-relaxed font-normal">
          ทดสอบความรู้และประเมินผลสัมฤทธิ์ทางการเรียนรู้วิทยาการคำนวณและ Coding พร้อมระบบจับเวลา ตรวจคำตอบทันที และเฉลยละเอียด
        </p>
      </div>

      {/* Quiz Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            แบบทดสอบทั้งหมด ({quizzes.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="success">{quiz.grade_level || 'ทุกระดับชั้น'}</Badge>
                  <span className="text-[11px] font-semibold text-slate-500">{quiz.subject}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {quiz.title}
                </h3>

                {quiz.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {quiz.description}
                  </p>
                )}

                <div className="flex items-center gap-4 pt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{quiz.questions?.length || 0} ข้อ</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    <span>{quiz.time_limit} นาที</span>
                  </span>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  ทำได้สูงสุด {quiz.attempt_limit} ครั้ง
                </span>
                <Link
                  href={`/quiz/${quiz.id}`}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <span>เริ่มทำแบบทดสอบ</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
