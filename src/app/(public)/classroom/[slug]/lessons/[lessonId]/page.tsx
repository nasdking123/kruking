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
  BookOpen 
} from 'lucide-react';
import { getClassroomBySlug, getLessonById } from '@/services/classroom';

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
  const resources = (lesson.resources as { name: string; url: string }[]) || [];

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
        <span className="text-slate-900 dark:text-white font-medium truncate max-w-xs">{lesson.title}</span>
      </nav>

      {/* Lesson Header Title */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-bold">
          <BookOpen className="w-4 h-4" />
          <span>บทที่ {lesson.sort_order} จาก {allLessons.length}</span>
          <span>•</span>
          <span className="flex items-center gap-1 text-slate-500 font-normal">
            <Clock className="w-3.5 h-3.5" />
            <span>{lesson.duration_minutes} นาที</span>
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {lesson.title}
        </h1>
        {lesson.description && (
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            {lesson.description}
          </p>
        )}
      </div>

      {/* Video Player Box */}
      {lesson.video_url && (
        <div className="rounded-3xl overflow-hidden shadow-2xl bg-black border border-slate-800 aspect-16/9">
          <iframe
            src={lesson.video_url}
            title={lesson.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {/* Attached Files & Worksheets */}
      {resources.length > 0 && (
        <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 space-y-3">
          <h3 className="text-xs font-bold text-blue-900 dark:text-blue-200 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>เอกสารและใบงานประกอบบทเรียน</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {resources.map((res, rIdx) => (
              <a
                key={rIdx}
                href={res.url}
                download
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-blue-200/80 dark:border-blue-800/80 hover:bg-blue-50 dark:hover:bg-blue-900/40 shadow-xs flex items-center justify-between text-xs transition-colors"
              >
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate pr-2">
                  {res.name}
                </span>
                <Download className="w-4 h-4 text-blue-600 shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Markdown Notes */}
      <article className="prose prose-slate dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        {lesson.content?.split('\n\n').map((para, idx) => {
          if (para.startsWith('# ')) {
            return <h1 key={idx} className="text-2xl font-bold mt-6 mb-2 text-slate-900 dark:text-white">{para.replace('# ', '')}</h1>;
          }
          if (para.startsWith('## ')) {
            return <h2 key={idx} className="text-xl font-bold mt-5 mb-2 text-slate-900 dark:text-white">{para.replace('## ', '')}</h2>;
          }
          if (para.startsWith('- ')) {
            return (
              <ul key={idx} className="list-disc pl-5 space-y-1">
                {para.split('\n').map((li, lIdx) => (
                  <li key={lIdx}>{li.replace('- ', '')}</li>
                ))}
              </ul>
            );
          }
          return <p key={idx} className="text-slate-700 dark:text-slate-300">{para}</p>;
        })}
      </article>

      {/* Next / Previous Navigation Bar */}
      <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
        {prevLesson ? (
          <Link
            href={`/classroom/${classroom.slug}/lessons/${prevLesson.id}`}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">บทก่อนหน้า:</span>
            <span className="truncate max-w-[120px]">{prevLesson.title}</span>
          </Link>
        ) : (
          <div />
        )}

        {nextLesson ? (
          <Link
            href={`/classroom/${classroom.slug}/lessons/${nextLesson.id}`}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span>บทถัดไป:</span>
            <span className="truncate max-w-[140px]">{nextLesson.title}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <Link
            href={`/classroom/${classroom.slug}`}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>จบหลักสูตรบทเรียน</span>
          </Link>
        )}
      </div>
    </div>
  );
}
