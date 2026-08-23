import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  ChevronRight, 
  Clock, 
  HelpCircle, 
  ArrowLeft, 
  Play, 
  AlertCircle, 
  ShieldCheck 
} from 'lucide-react';
import { getQuizById } from '@/services/quiz';
import { Badge } from '@/components/ui/badge';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const quiz = await getQuizById(id);
  if (!quiz) return { title: 'ไม่พบแบบทดสอบ' };

  return {
    title: `${quiz.title} | ระบบแบบทดสอบครูคิง`,
    description: quiz.description || undefined,
  };
}

export default async function QuizLobbyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const quiz = await getQuizById(id);

  if (!quiz) {
    notFound();
  }

  const questionCount = quiz.questions?.length || 0;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-blue-600 transition-colors">หน้าแรก</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/quiz" className="hover:text-blue-600 transition-colors">แบบทดสอบ</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 dark:text-white font-medium truncate max-w-xs">{quiz.title}</span>
      </nav>

      {/* Lobby Box */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-md space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="success">{quiz.grade_level || 'ทุกระดับชั้น'}</Badge>
            <span className="text-xs font-semibold text-slate-500">{quiz.subject}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-snug">
            {quiz.title}
          </h1>

          {quiz.description && (
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {quiz.description}
            </p>
          )}
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
              <HelpCircle className="w-4 h-4 text-emerald-500" />
              <span>จำนวนข้อ</span>
            </div>
            <div className="text-lg font-extrabold text-slate-900 dark:text-white">
              {questionCount} ข้อ
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>เวลาทำแบบทดสอบ</span>
            </div>
            <div className="text-lg font-extrabold text-slate-900 dark:text-white">
              {quiz.time_limit} นาที
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 space-y-1 col-span-2 sm:col-span-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
              <ShieldCheck className="w-4 h-4 text-purple-500" />
              <span>จำกัดการทำ</span>
            </div>
            <div className="text-lg font-extrabold text-slate-900 dark:text-white">
              {quiz.attempt_limit} ครั้ง
            </div>
          </div>
        </div>

        {/* Instructions Alert */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold">
            <AlertCircle className="w-4 h-4" />
            <span>คำแนะนำและกติกาการทำแบบทดสอบ</span>
          </div>
          <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
            <li>เมื่อกดปุ่ม &quot;เริ่มทำแบบทดสอบ&quot; ตัวจับเวลาจะเริ่มนับถอยหลังทันที</li>
            <li>สามารถเลือกคำตอบและเปลี่ยนคำตอบได้ก่อนกดยืนยันส่งข้อสอบ</li>
            <li>ระบบจะตรวจคำตอบและแสดงคะแนนพร้อมเฉลยละเอียดทันทีหลังส่ง</li>
          </ul>
        </div>

        {/* Start Button */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800">
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับหน้ารวมแบบทดสอบ</span>
          </Link>

          <Link
            href={`/quiz/${quiz.id}/play`}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>เริ่มทำแบบทดสอบเดี๋ยวนี้</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
