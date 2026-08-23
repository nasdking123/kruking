import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  ChevronRight, 
  BookOpen, 
  PlayCircle, 
  Clock, 
  ArrowLeft, 
  KeyRound,
  User,
  ArrowRight
} from 'lucide-react';
import { getClassroomBySlug } from '@/services/classroom';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const classroom = await getClassroomBySlug(slug);
  if (!classroom) return { title: 'ไม่พบห้องเรียนนี้' };

  return {
    title: `${classroom.title} | ห้องเรียนออนไลน์ครูคิง`,
    description: classroom.description || undefined,
  };
}

export default async function ClassroomDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const classroom = await getClassroomBySlug(slug);

  if (!classroom) {
    notFound();
  }

  const lessons = classroom.lessons || [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-blue-600 transition-colors">หน้าแรก</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/classroom" className="hover:text-blue-600 transition-colors">ห้องเรียนออนไลน์</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 dark:text-white font-medium truncate max-w-xs">{classroom.title}</span>
      </nav>

      {/* Classroom Header Box */}
      <div className="p-8 rounded-3xl bg-gradient-to-tr from-blue-700 via-indigo-800 to-slate-900 text-white shadow-xl space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-xs">
            {classroom.grade_level || 'ทุกระดับชั้น'}
          </span>
          <span className="px-3 py-1 rounded-full bg-blue-500/30 text-xs font-semibold">
            {classroom.subject}
          </span>
          {classroom.join_code && (
            <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-mono font-bold flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Join Code: {classroom.join_code}</span>
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
          {classroom.title}
        </h1>

        {classroom.description && (
          <p className="text-sm sm:text-base text-blue-100 max-w-3xl leading-relaxed">
            {classroom.description}
          </p>
        )}

        <div className="flex items-center gap-6 pt-2 text-xs text-blue-200 border-t border-white/10">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            <span>{lessons.length} บทเรียน</span>
          </span>
          <span className="flex items-center gap-1.5">
            <User className="w-4 h-4" />
            <span>ผู้สอน: ครูคิง</span>
          </span>
        </div>
      </div>

      {/* Course Syllabus / Lessons List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span>สารบัญบทเรียน (Course Syllabus)</span>
          </h2>
          <span className="text-xs text-slate-500 font-semibold">
            {lessons.length} บทเรียนทั้งหมด
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
          {lessons.map((lsn, idx) => (
            <div
              key={lsn.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex items-start sm:items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shrink-0 text-sm">
                  {idx + 1}
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                    {lsn.title}
                  </h3>
                  {lsn.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {lsn.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{lsn.duration_minutes} นาที</span>
                    </span>
                    {lsn.video_url && (
                      <span className="flex items-center gap-1 text-blue-500">
                        <PlayCircle className="w-3 h-3" />
                        <span>มีคลิปวิดีโอ</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <Link
                href={`/classroom/${classroom.slug}/lessons/${lsn.id}`}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5 shrink-0 self-end sm:self-auto"
              >
                <span>เข้าเรียนบทนี้</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Back Button */}
      <div className="pt-4">
        <Link
          href="/classroom"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับหน้ารายการห้องเรียน</span>
        </Link>
      </div>
    </div>
  );
}
