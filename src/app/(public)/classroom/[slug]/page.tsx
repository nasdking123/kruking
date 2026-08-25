import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ChevronRight, 
  BookOpen, 
  PlayCircle, 
  KeyRound,
  User,
  ArrowRight,
  Sparkles,
  School
} from 'lucide-react';
import { getClassroomBySlug } from '@/services/classroom';
import { getYouTubeThumbnail } from '@/lib/youtube';

export const dynamic = 'force-dynamic';

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
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-tr from-blue-700 via-indigo-800 to-slate-900 text-white shadow-xl space-y-4">
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
          <p className="text-sm sm:text-base text-blue-100 max-w-3xl leading-relaxed font-normal">
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
            <span>สารบัญบทเรียน (Course Lessons)</span>
          </h2>
          <span className="text-xs text-slate-500 font-semibold">
            {lessons.length} บทเรียนทั้งหมด
          </span>
        </div>

        <div className="space-y-3">
          {lessons.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-center text-xs text-slate-500">
              ยังไม่มีบทเรียนในห้องเรียนนี้
            </div>
          ) : (
            lessons.map((lsn, idx) => {
              const ytThumb = getYouTubeThumbnail(lsn.video_url);

              return (
                <div
                  key={lsn.id}
                  className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-400 dark:hover:border-blue-700 transition-all group"
                >
                  <div className="flex items-start sm:items-center gap-4 min-w-0">
                    {/* Thumbnail or Icon */}
                    {ytThumb ? (
                      <div className="relative w-24 h-16 sm:w-28 sm:h-18 rounded-2xl overflow-hidden bg-slate-950 shrink-0 border border-slate-200 dark:border-slate-800">
                        <Image
                          src={ytThumb}
                          alt={lsn.title}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <PlayCircle className="w-6 h-6 text-white drop-shadow-md" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shrink-0 text-sm">
                        {idx + 1}
                      </div>
                    )}

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                          บทที่ {lsn.sort_order || idx + 1}
                        </span>
                        {lsn.video_url && (
                          <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1">
                            <PlayCircle className="w-3 h-3" />
                            <span>YouTube Video</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                        {lsn.title}
                      </h3>

                      {lsn.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                          {lsn.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <Link
                    href={`/classroom/${classroom.slug}/lessons/${lsn.id}`}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5 shrink-0 self-end sm:self-auto cursor-pointer"
                  >
                    <span>เข้าเรียนบทนี้</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Back Button */}
      <div className="pt-4">
        <Link
          href="/classroom"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
        >
          <span>← กลับหน้ารายการห้องเรียน</span>
        </Link>
      </div>
    </div>
  );
}
