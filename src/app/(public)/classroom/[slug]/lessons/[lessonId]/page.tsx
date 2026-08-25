import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  ChevronRight, 
  ArrowLeft, 
  ArrowRight, 
  FileText, 
  CheckCircle2, 
  Download, 
  Clock, 
  BookOpen,
  Sparkles,
  School
} from 'lucide-react';
import { getClassroomBySlug, getLessonById } from '@/services/classroom';
import { YouTubePlayer } from '@/components/common/youtube-player';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>;
}): Promise<Metadata> {
  const { slug, lessonId } = await params;
  const classroom = await getClassroomBySlug(slug);
  const lesson = await getLessonById(slug, lessonId);
  if (!classroom || !lesson) return { title: 'ไม่พบบทเรียน' };

  return {
    title: `${lesson.title} | ${classroom.title}`,
    description: lesson.description || undefined,
  };
}

export default async function LessonViewerPage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>;
}) {
  const { slug, lessonId } = await params;
  const classroom = await getClassroomBySlug(slug);
  if (!classroom) notFound();

  const lesson = await getLessonById(slug, lessonId);
  if (!lesson) notFound();

  const allLessons = classroom.lessons || [];
  const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
        <Link href="/" className="hover:text-blue-600 transition-colors">หน้าแรก</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/classroom" className="hover:text-blue-600 transition-colors">ห้องเรียนออนไลน์</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/classroom/${classroom.slug}`} className="hover:text-blue-600 transition-colors truncate max-w-xs">{classroom.title}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 dark:text-white font-semibold truncate max-w-xs">{lesson.title}</span>
      </nav>

      {/* Lesson Header */}
      <div className="space-y-3 p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-xs">
            บทที่ {lesson.sort_order}
          </span>
          <span className="px-3 py-1 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold text-xs flex items-center gap-1">
            <School className="w-3.5 h-3.5" />
            <span>{classroom.subject}</span>
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          {lesson.title}
        </h1>

        {lesson.description && (
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
            {lesson.description}
          </p>
        )}
      </div>

      {/* Embedded YouTube Video Player */}
      {lesson.video_url && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>วิดีโอบทเรียน (YouTube Lesson)</span>
            </span>
          </div>
          <YouTubePlayer
            url={lesson.video_url}
            title={lesson.title}
          />
        </div>
      )}

      {/* Lesson Content Notes */}
      {lesson.content && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>สรุปเนื้อหาและสาระสำคัญของบทเรียน</span>
          </h2>
          <article className="prose prose-slate dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed space-y-4">
            {lesson.content.split('\n\n').map((para: string, idx: number) => {
              if (para.startsWith('# ')) {
                return <h1 key={idx} className="text-2xl font-bold mt-6 mb-2 text-slate-900 dark:text-white">{para.replace('# ', '')}</h1>;
              }
              if (para.startsWith('## ')) {
                return <h2 key={idx} className="text-xl font-bold mt-5 mb-2 text-slate-900 dark:text-white">{para.replace('## ', '')}</h2>;
              }
              if (para.startsWith('### ')) {
                return <h3 key={idx} className="text-lg font-bold mt-4 mb-1.5 text-slate-900 dark:text-white">{para.replace('### ', '')}</h3>;
              }
              if (para.startsWith('- ')) {
                return (
                  <ul key={idx} className="list-disc pl-5 space-y-1">
                    {para.split('\n').map((li: string, lIdx: number) => (
                      <li key={lIdx}>{li.replace('- ', '')}</li>
                    ))}
                  </ul>
                );
              }
              return <p key={idx} className="text-slate-700 dark:text-slate-300">{para}</p>;
            })}
          </article>
        </div>
      )}

      {/* Next / Previous Navigation Bar */}
      <div className="flex items-center justify-between gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
        {prevLesson ? (
          <Link
            href={`/classroom/${classroom.slug}/lessons/${prevLesson.id}`}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>บทก่อนหน้า: {prevLesson.title.slice(0, 24)}...</span>
          </Link>
        ) : <div />}

        {nextLesson ? (
          <Link
            href={`/classroom/${classroom.slug}/lessons/${nextLesson.id}`}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>บทถัดไป: {nextLesson.title.slice(0, 24)}...</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <Link
            href={`/classroom/${classroom.slug}`}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>จบคอร์สเรียนนี้แล้ว</span>
          </Link>
        )}
      </div>
    </div>
  );
}
