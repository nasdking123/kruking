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
  Clock,
  Award,
  Globe,
  Lock,
  CheckCircle2,
  School,
  Sparkles
} from 'lucide-react';
import { getClassroomBySlug, isClassroomPublic } from '@/services/classroom';
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
    title: `${classroom.title} | Thai MOOC ห้องเรียนครูคิง`,
    description: classroom.description || undefined,
  };
}

export default async function ThaiMOOCCourseLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const classroom = await getClassroomBySlug(slug);

  if (!classroom) {
    notFound();
  }

  const isPublic = isClassroomPublic(classroom);
  const lessons = classroom.lessons || [];
  const firstLesson = lessons[0];
  const firstLessonUrl = firstLesson
    ? `/classroom/${classroom.slug}/lessons/${firstLesson.id}`
    : `/classroom/${classroom.slug}`;

  const hours = classroom.estimated_hours || 6;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 animate-in fade-in">
      {/* 1. Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-blue-600 transition-colors">หน้าแรก</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/classroom" className="hover:text-blue-600 transition-colors">คลังรายวิชา MOOC</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 dark:text-white font-bold truncate max-w-xs">{classroom.title}</span>
      </nav>

      {/* 2. Top Header Hero Box (Thai MOOC Style) */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-tr from-slate-950 via-blue-950 to-indigo-950 text-white shadow-xl space-y-4 border border-blue-900/40">
        <div className="flex items-center gap-2 flex-wrap">
          {isPublic ? (
            <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-extrabold shadow-md flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              <span>🌐 Open Access (เรียนฟรี ไม่ต้องล็อกอิน)</span>
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-extrabold shadow-md flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>🔐 คอร์สในชั้นเรียน (ต้องล็อกอินเก็บคะแนน)</span>
            </span>
          )}

          <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold backdrop-blur-xs">
            {classroom.grade_level || 'ทุกระดับชั้น'}
          </span>
          
          <span className="px-3 py-1 rounded-full bg-blue-500/30 text-xs font-semibold">
            {classroom.subject || 'กลุ่มสาระการเรียนรู้'}
          </span>

          {classroom.join_code && (
            <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-mono font-bold flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Join Code: {classroom.join_code}</span>
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
          {classroom.title}
        </h1>

        {classroom.description && (
          <p className="text-sm sm:text-base text-blue-100 max-w-4xl leading-relaxed font-normal">
            {classroom.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-blue-200 border-t border-white/10 font-semibold">
          <span className="flex items-center gap-1.5">
            <School className="w-4 h-4 text-teal-400" />
            <span>โรงเรียนวัดบางโฉลงใน • ครูจักรพงษ์ สำรองพันธ์</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>ประมาณ {hours} ชั่วโมงการเรียนรู้</span>
          </span>
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span>{lessons.length} บทเรียนวิดีโอ</span>
          </span>
        </div>
      </div>

      {/* 3. Thai MOOC Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Main Column (2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section A: What You'll Learn (สิ่งที่จะได้รับ) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>วัตถุประสงค์และสิ่งที่จะได้เรียนรู้ (Learning Outcomes)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/50">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>เข้าใจแนวคิดและหลักการสำคัญตามตัวชี้วัดกระทรวงศึกษาธิการ</span>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/50">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>ฝึกทักษะการคิดเชิงวิเคราะห์และการแก้ปัญหาผ่าน Active Learning</span>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/50">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>สามารถทำแบบฝึกหัด ใบงาน และส่งชิ้นงานผ่านระบบออนไลน์ได้</span>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/50">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>ผ่านการทดสอบวัดผลสัมฤทธิ์และรับเกียรติบัตรออนไลน์ (E-Certificate)</span>
              </div>
            </div>
          </div>

          {/* Section B: Course Syllabus (สารบัญและโครงสร้างบทเรียน) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span>โครงสร้างเนื้อหาและบทเรียน (Course Syllabus)</span>
              </h2>
              <span className="text-xs text-slate-500 font-bold">
                {lessons.length} บทเรียน
              </span>
            </div>

            <div className="space-y-3">
              {lessons.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  ยังไม่มีบทเรียนในรายวิชานี้
                </div>
              ) : (
                lessons.map((lsn, idx) => {
                  const ytThumb = getYouTubeThumbnail(lsn.video_url);

                  return (
                    <div
                      key={lsn.id}
                      className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-300 dark:hover:border-blue-700 transition-all group"
                    >
                      <div className="flex items-start sm:items-center gap-4 min-w-0">
                        {/* Thumbnail or Number badge */}
                        {ytThumb ? (
                          <div className="relative w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-200 dark:border-slate-800">
                            <Image
                              src={ytThumb}
                              alt={lsn.title}
                              fill
                              unoptimized
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                              <PlayCircle className="w-5 h-5 text-white drop-shadow-sm" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 font-bold flex items-center justify-center shrink-0 text-xs">
                            {idx + 1}
                          </div>
                        )}

                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                              บทที่ {lsn.sort_order || idx + 1}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              วิดีโอ & สื่อประกอบ
                            </span>
                          </div>

                          <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                            {lsn.title}
                          </h3>

                          {lsn.description && (
                            <p className="text-[11px] text-slate-500 line-clamp-1">
                              {lsn.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <Link
                        href={`/classroom/${classroom.slug}/lessons/${lsn.id}`}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1 shrink-0 self-end sm:self-auto"
                      >
                        <span>เข้าเรียน</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Section C: Target Audience & Criteria */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-2">
              <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-500" />
                <span>กลุ่มเป้าหมายผู้เรียน</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                นักเรียนระดับชั้น {classroom.grade_level || 'ประถมศึกษา'}, คุณครูผู้สอน, ผู้ปกครอง และบุคคลทั่วไปที่สนใจพัฒนาทักษะ
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-2">
              <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>เกณฑ์การรับเกียรติบัตร</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                เข้าเรียนครบทุกบทเรียน และทำแบบทดสอบวัดผลสัมฤทธิ์ได้คะแนนตั้งแต่ 60% ขึ้นไป
              </p>
            </div>
          </div>
        </div>

        {/* Right Sticky Sidebar (1 col) */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-lg space-y-6 sticky top-24">
            
            {/* Preview Cover */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-inner">
              {classroom.cover_image ? (
                <Image
                  src={classroom.cover_image}
                  alt={classroom.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-900 text-white">
                  <PlayCircle className="w-12 h-12" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Access Badge & CTA Button */}
            <div className="space-y-3">
              <div className="text-center">
                {isPublic ? (
                  <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold inline-flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800">
                    <Globe className="w-3.5 h-3.5" />
                    <span>คอร์สสาธารณะ (เรียนได้ทันที)</span>
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold inline-flex items-center gap-1.5 border border-blue-200 dark:border-blue-800">
                    <Lock className="w-3.5 h-3.5" />
                    <span>คอร์สในชั้นเรียน (ล็อกอินเก็บคะแนน)</span>
                  </span>
                )}
              </div>

              <Link
                href={firstLessonUrl}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <PlayCircle className="w-5 h-5" />
                <span>เข้าสู่บทเรียนทันที</span>
              </Link>
            </div>

            {/* Course Specs Quick List */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>ชั่วโมงเรียนรู้</span>
                </span>
                <span className="font-bold text-slate-900 dark:text-white">{hours} ชั่วโมง</span>
              </div>

              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  <span>จำนวนบทเรียน</span>
                </span>
                <span className="font-bold text-slate-900 dark:text-white">{lessons.length} บทเรียน</span>
              </div>

              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <span>ภาษาการสอน</span>
                </span>
                <span className="font-bold text-slate-900 dark:text-white">ภาษาไทย (Thai)</span>
              </div>

              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-slate-400" />
                  <span>ใบประกาศนียบัตร</span>
                </span>
                <span className="font-bold text-emerald-600">มีให้เมื่อผ่านเกณฑ์</span>
              </div>
            </div>

            {/* Institution Info */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-100 dark:border-slate-800 space-y-1 text-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">สถาบันผู้พัฒนาบทเรียน</span>
              <p className="font-extrabold text-slate-900 dark:text-white">
                โรงเรียนวัดบางโฉลงใน
              </p>
              <p className="text-[11px] text-slate-500">
                ผู้รับผิดชอบ: ครูจักรพงษ์ สำรองพันธ์
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
