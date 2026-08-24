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
  const resources = Array.isArray(lesson.resources) ? (lesson.resources as unknown as { name: string; url: string }[]) : [];

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
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold text-xs">
            บทที่ {lesson.sort_order}
          </span>
          {lesson.duration_minutes && (
            <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>{lesson.duration_minutes} นาที</span>
            </span>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          {lesson.title}
        </h1>
        {lesson.description && (
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            {lesson.description}
          </p>
        )}
      </div>

      {/* Video Player */}
      {lesson.video_url && (
        <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 bg-slate-950 aspect-video">
          <iframe
            src={lesson.video_url}
            title={lesson.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>
      )}

      {/* Attached Resources */}
      {resources.length > 0 && (
        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 space-y-3">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>เอกสารและใบงานประกอบบทเรียน</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {resources.map((res: { name: string; url: string }, idx: number) => (
              <a
                key={idx}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-blue-500 transition-colors shadow-xs group"
              >
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 truncate flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                  <span className="truncate">{res.name}</span>
                </span>
                <Download className="w-4 h-4 text-blue-600 shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Markdown Notes */}
      <article className="prose prose-slate dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        {lesson.content?.split('\n\n').map((para: string, idx: number) => {
          if (para.startsWith('# ')) {
            return <h1 key={idx} className="text-2xl font-bold mt-6 mb-2 text-slate-900 dark:text-white">{para.replace('# ', '')}</h1>;
          }
          if (para.startsWith('## ')) {
            return <h2 key={idx} className="text-xl font-bold mt-5 mb-2 text-slate-900 dark:text-white">{para.replace('## ', '')}</h2>;
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

      {/* Next / Previous Navigation Bar */}
      <div className="flex items-center justify-between gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
        {prevLesson ? (
          <Link
            href={`/classroom/${classroom.slug}/lessons/${prevLesson.id}`}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>บทก่อนหน้า</span>
          </Link>
        ) : <div />}

        {nextLesson ? (
          <Link
            href={`/classroom/${classroom.slug}/lessons/${nextLesson.id}`}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
          >
            <span>จบบทเรียนนี้ • ไปบทถัดไป</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <Link
            href={`/classroom/${classroom.slug}`}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>จบคอร์สเรียนนี้แล้ว</span>
          </Link>
        )}
      </div>
    </div>
  );
}
