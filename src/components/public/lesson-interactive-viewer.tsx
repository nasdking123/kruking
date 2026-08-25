'use client';

import React, { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  Circle, 
  ArrowLeft, 
  ArrowRight, 
  BookOpen, 
  Sparkles, 
  School, 
  CheckSquare, 
  FileText, 
  ChevronRight,
  PlayCircle
} from 'lucide-react';
import { YouTubePlayer } from '@/components/common/youtube-player';
import type { ClassroomWithLessons, LessonRow } from '@/services/classroom';
import { useToast } from '@/components/ui/toast';

interface Props {
  classroom: ClassroomWithLessons;
  lesson: LessonRow;
}

function subscribeToStorage(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

export function LessonInteractiveViewer({ classroom, lesson }: Props) {
  const toast = useToast();
  const [showSelfCheck, setShowSelfCheck] = useState(false);

  const storageKey = `kruking_lesson_completed_${lesson.id}`;

  const isCompleted = useSyncExternalStore(
    subscribeToStorage,
    () => {
      if (typeof window === 'undefined') return false;
      return localStorage.getItem(storageKey) === 'true';
    },
    () => false
  );

  const toggleCompleted = () => {
    const nextState = !isCompleted;
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, String(nextState));
      window.dispatchEvent(new Event('storage'));
    }
    if (nextState) {
      toast.success('🎉 ยินดีด้วย!', `คุณได้เรียนจบบทเรียน "${lesson.title}" เรียบร้อยแล้ว`);
    } else {
      toast.info('อัปเดตสถานะ', 'เปลี่ยนสถานะเป็นยังไม่จบ');
    }
  };

  const allLessons = classroom.lessons || [];
  const currentIndex = allLessons.findIndex((l) => l.id === lesson.id);
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

      {/* Lesson Header with Completion Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-xs">
              บทที่ {lesson.sort_order || currentIndex + 1}
            </span>
            <span className="px-3 py-1 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold text-xs flex items-center gap-1">
              <School className="w-3.5 h-3.5" />
              <span>{classroom.subject}</span>
            </span>
            {classroom.grade_level && (
              <span className="px-3 py-1 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs">
                {classroom.grade_level}
              </span>
            )}
          </div>

          {/* Completion Toggle Button */}
          <button
            type="button"
            onClick={toggleCompleted}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
              isCompleted
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
            }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white animate-in zoom-in" />
                <span>เรียนจบแล้ว (Completed)</span>
              </>
            ) : (
              <>
                <Circle className="w-4 h-4 text-slate-400" />
                <span>ทำเครื่องหมายว่าเรียนจบ</span>
              </>
            )}
          </button>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
          {lesson.title}
        </h1>

        {lesson.description && (
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {lesson.description}
          </p>
        )}
      </div>

      {/* Embedded YouTube Video Player */}
      {lesson.video_url && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <PlayCircle className="w-4 h-4 text-rose-600" />
              <span>วิดีโอคลิปการสอนจาก YouTube</span>
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
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span>สรุปเนื้อหาและสาระสำคัญของบทเรียน (Learning Notes)</span>
            </h2>
          </div>

          <article className="prose prose-slate dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed space-y-4">
            {lesson.content.split('\n\n').map((para: string, idx: number) => {
              if (para.startsWith('## ')) {
                return (
                  <h2 key={idx} className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-6 mb-3 pb-1 border-b border-slate-200 dark:border-slate-800">
                    {para.replace('## ', '')}
                  </h2>
                );
              }
              if (para.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-base font-bold text-blue-700 dark:text-blue-400 mt-4 mb-2">
                    {para.replace('### ', '')}
                  </h3>
                );
              }
              if (para.startsWith('> ')) {
                return (
                  <div key={idx} className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border-l-4 border-blue-600 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-medium my-4">
                    {para.replace('> ', '')}
                  </div>
                );
              }
              if (para.startsWith('- ')) {
                return (
                  <ul key={idx} className="space-y-2 my-2">
                    {para.split('\n').map((li: string, lIdx: number) => (
                      <li key={lIdx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                        <span>{li.replace(/^- /, '')}</span>
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={idx} className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {para}
                </p>
              );
            })}
          </article>
        </div>
      )}

      {/* Self-Check Question Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-tr from-indigo-950 via-slate-900 to-blue-950 text-white shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>คำถามทบทวนความเข้าใจหลังจบคลิป (Self-Check Quiz)</span>
          </div>
          <button
            type="button"
            onClick={() => setShowSelfCheck(!showSelfCheck)}
            className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold backdrop-blur-xs transition-colors cursor-pointer"
          >
            {showSelfCheck ? 'ซ่อนเฉลย' : 'กดเพื่อดูคำถาม & เฉลย'}
          </button>
        </div>

        {showSelfCheck ? (
          <div className="space-y-3 pt-2 text-xs sm:text-sm animate-in fade-in">
            <div className="p-4 rounded-2xl bg-white/10 space-y-2">
              <span className="font-bold text-blue-200">คำถาม: จุดกึ่งกลางของเวที (Stage) ในโปรแกรม Scratch มีพิกัดเป็นเท่าใด?</span>
              <p className="text-emerald-300 font-bold">✅ เฉลย: พิกัด (X: 0, Y: 0)</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 space-y-2">
              <span className="font-bold text-blue-200">คำถาม: หากต้องการให้คำสั่งเริ่มทำงานเมื่อผู้ใช้กดธงเขียว ต้องเลือกใช้บล็อกในกลุ่มสีใด?</span>
              <p className="text-emerald-300 font-bold">✅ เฉลย: กลุ่มบล็อก Events (สีเหลือง) เช่น บล็อก &quot;When Green Flag Clicked&quot;</p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-300">
            หลังจากดูคลิปวิดีโอจบแล้ว ให้ลองคลิกปุ่มเพื่อตอบคำถามทบทวนความเข้าใจด้วยตนเอง
          </p>
        )}
      </div>

      {/* Extra Learning Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/quiz"
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:border-purple-400 hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-purple-600 transition-colors">
                ทำแบบทดสอบวัดผลสัมฤทธิ์
              </span>
              <span className="text-[10px] text-slate-400">Quiz & Assessment ทันที</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
        </Link>

        <Link
          href="/worksheets"
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-emerald-600 transition-colors">
                ดาวน์โหลดใบงานประกอบ
              </span>
              <span className="text-[10px] text-slate-400">ใบงาน & กิจกรรมฝึกทักษะ</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
        </Link>
      </div>

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
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>บทถัดไป</span>
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
