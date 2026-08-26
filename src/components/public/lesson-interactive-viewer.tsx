'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
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
  Award,
  Lock,
  LogIn,
  Loader2
} from 'lucide-react';
import { YouTubePlayer } from '@/components/common/youtube-player';
import type { ClassroomWithLessons, LessonRow } from '@/services/classroom';
import { useToast } from '@/components/ui/toast';
import { createClient } from '@/lib/supabase/client';
import { logLessonActivity } from '@/services/student';
import { AssignmentSubmissionCard } from './assignment-submission-card';
import { CertificateModal } from './certificate-modal';
import { generateCertificateCode, getThaiCertificateDate, type CertificateData } from '@/services/certificate';

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
  const [showCertModal, setShowCertModal] = useState(false);
  const [studentInfo, setStudentInfo] = useState<{ id: string; name: string; grade?: string; school?: string } | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  const storageKey = `kruking_lesson_completed_${lesson.id}`;

  const isCompleted = useSyncExternalStore(
    subscribeToStorage,
    () => {
      if (typeof window === 'undefined') return false;
      return localStorage.getItem(storageKey) === 'true';
    },
    () => false
  );

  useEffect(() => {
    let ignore = false;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!ignore) {
        if (user) {
          const info = {
            id: user.id,
            name: user.user_metadata?.full_name || 'นักเรียนยอดเยี่ยม',
            grade: classroom.grade_level || 'ประถมศึกษาปีที่ 6',
            school: 'โรงเรียนวัดบางโฉลงใน',
          };
          setStudentInfo(info);
          logLessonActivity({
            userId: user.id,
            lessonId: lesson.id,
            action: 'view',
          });
        }
        setAuthChecking(false);
      }
    });

    return () => {
      ignore = true;
    };
  }, [lesson.id, classroom.grade_level]);

  const handleToggleComplete = async () => {
    if (!studentInfo) {
      toast.error('กรุณาเข้าสู่ระบบ', 'นักเรียนต้องเข้าสู่ระบบก่อนบันทึกความก้าวหน้า');
      return;
    }

    const nextState = !isCompleted;
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, String(nextState));
      window.dispatchEvent(new Event('storage'));
    }

    if (nextState) {
      toast.success('บันทึกความก้าวหน้าสำเร็จ!', `คุณได้เรียนจบ "${lesson.title}" แล้ว`);
      logLessonActivity({
        userId: studentInfo.id,
        lessonId: lesson.id,
        action: 'complete',
      });
    }
  };

  if (authChecking) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-xs text-slate-500 font-bold">กำลังตรวจสอบสิทธิ์การเข้าสู่ห้องเรียนออนไลน์...</span>
        </div>
      </div>
    );
  }

  // Auth Gate: Student must be logged in to access online classroom lessons
  if (!studentInfo) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6 animate-in fade-in">
        <div className="w-16 h-16 rounded-3xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center mx-auto shadow-md">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-bold">
            {classroom.title}
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white pt-1">
            กรุณาเข้าสู่ระบบก่อนเข้าเรียน
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            ระบบจำเป็นต้องระบุตัวตนนามสกุลและระดับชั้นของนักเรียน เพื่อบันทึกเวลาดูคลิปวิดีโอ (Log), บันทึกการเรียนจบ, ส่งการบ้าน และสะสมคะแนนบน Leaderboard
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-md space-y-4">
          <Link
            href={`/student/login?redirectTo=/classroom/${classroom.slug}/lessons/${lesson.id}`}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span>เข้าสู่ระบบนักเรียน (Student Login)</span>
          </Link>

          <div className="text-xs text-slate-400">
            ยังไม่มีชื่อผู้ใช้นักเรียน?{' '}
            <Link
              href="/student/register"
              className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
            >
              สมัครสมาชิกที่นี่ (ไม่ต้องใช้อีเมล)
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const allLessons = classroom.lessons || [];
  const currentIndex = allLessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const certData: CertificateData = {
    certificateNo: generateCertificateCode('KCL-COURSE'),
    studentName: studentInfo.name,
    gradeLevel: classroom.grade_level || 'ประถมศึกษาปีที่ 6',
    schoolName: 'โรงเรียนวัดบางโฉลงใน',
    title: `ผ่านการศึกษาและเรียนรู้ครบตามหลักสูตร "${classroom.title}"`,
    issueDate: getThaiCertificateDate(),
    teacherName: 'ครูจักรพงษ์ สำรองพันธ์',
    teacherTitle: 'ครูผู้สอนกลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี',
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* 1. Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-blue-600 transition-colors">หน้าแรก</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/classroom" className="hover:text-blue-600 transition-colors">ห้องเรียนออนไลน์</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/classroom/${classroom.slug}`} className="hover:text-blue-600 transition-colors truncate max-w-[150px]">
          {classroom.title}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 dark:text-white font-bold truncate max-w-[200px]">
          {lesson.title}
        </span>
      </nav>

      {/* 2. Header & Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xs mb-1">
            <School className="w-4 h-4" />
            <span>{classroom.title} ({classroom.grade_level || 'ประถมศึกษา'}) • ผู้เรียน: {studentInfo.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {lesson.title}
          </h1>
        </div>

        {/* Completion & Certificate Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleComplete}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
              isCompleted
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 border border-emerald-200 dark:border-emerald-800'
                : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800'
            }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>เรียนจบแล้ว ✅</span>
              </>
            ) : (
              <>
                <Circle className="w-4 h-4" />
                <span>ทำเครื่องหมายว่าเรียนจบ</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowCertModal(true)}
            className="px-3.5 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Award className="w-4 h-4" />
            <span>รับเกียรติบัตร</span>
          </button>
        </div>
      </div>

      {/* 3. Responsive YouTube Player */}
      <div className="overflow-hidden rounded-3xl bg-slate-900 shadow-2xl border border-slate-200/80 dark:border-slate-800/80">
        <YouTubePlayer
          url={lesson.video_url || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'}
          title={lesson.title}
        />
      </div>

      {/* 4. Lesson Description & Content */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-extrabold text-sm border-b border-slate-100 dark:border-slate-800 pb-3">
          <BookOpen className="w-4 h-4 text-blue-600" />
          <span>เนื้อหาและสาระสำคัญของบทเรียน (Active Learning Notes)</span>
        </div>

        {lesson.description && (
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
            {lesson.description}
          </p>
        )}

        {lesson.content && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed font-sans">
            {lesson.content}
          </div>
        )}
      </div>

      {/* 5. Assignment Submission Card (ส่งการบ้าน) */}
      <AssignmentSubmissionCard 
        lessonId={lesson.id} 
        classroomId={classroom.id} 
        lessonTitle={lesson.title} 
      />

      {/* 6. Self-Check Question Box */}
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

      {/* 7. Extra Learning Links */}
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

      {/* 8. Next / Previous Navigation Bar */}
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

      {/* E-Certificate Modal */}
      <CertificateModal
        isOpen={showCertModal}
        onClose={() => setShowCertModal(false)}
        data={certData}
      />
    </div>
  );
}
