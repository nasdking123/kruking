import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ChevronRight, 
  Calendar, 
  Eye, 
  Download, 
  ArrowLeft, 
  Gamepad2, 
  Award,
  Sparkles,
  Play
} from 'lucide-react';
import { getWorkBySlug, getWorks, trackWorkView } from '@/services/works';
import { getSettings } from '@/services/settings';
import { formatDateThai } from '@/lib/utils';
import { ShareButtons } from '@/components/public/share-buttons';
import { RichMarkdown } from '@/components/common/rich-markdown';
import { DocumentPdfViewer } from '@/components/public/document-pdf-viewer';
import { WorkCard } from '@/components/public/work-card';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const work = await getWorkBySlug(slug);
  if (!work) return { title: 'ไม่พบเกมนี้' };

  return {
    title: `${work.title} | เกมการเรียนรู้ครูคิง`,
    description: work.description || undefined,
    openGraph: {
      title: work.title,
      description: work.description || undefined,
      images: work.cover_image ? [work.cover_image] : undefined,
    },
  };
}

export default async function GameDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [work, settings, allWorks] = await Promise.all([
    getWorkBySlug(slug),
    getSettings(),
    getWorks({ type: 'game', limit: 6 }),
  ]);

  if (!work) {
    notFound();
  }

  await trackWorkView(work.id);

  const relatedWorks = allWorks
    .filter((w) => w.id !== work.id)
    .slice(0, 4);

  const fileUrl = work.details?.file_url 
    ? String(work.details.file_url) 
    : work.details?.pdf_url 
      ? String(work.details.pdf_url) 
      : null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
        <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          หน้าแรก
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/games" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          เกมการศึกษา & บอร์ดเกม
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 dark:text-white font-medium truncate max-w-xs sm:max-w-md">
          {work.title}
        </span>
      </nav>

      {/* Hero Header */}
      <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-tr from-purple-950 via-slate-900 to-indigo-950 text-white shadow-2xl relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-2 flex-wrap relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-bold backdrop-blur-xs">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Unplugged & Digital Game</span>
          </div>
          {work.grade_level && (
            <span className="px-3 py-1 rounded-full bg-white/10 text-white border border-white/10 text-xs font-semibold backdrop-blur-xs">
              {work.grade_level}
            </span>
          )}
          {work.subject && (
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-semibold backdrop-blur-xs">
              {work.subject}
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-snug relative z-10">
          {work.title}
        </h1>

        {work.description && (
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-3xl font-normal relative z-10">
            {work.description}
          </p>
        )}

        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300 relative z-10">
          <div className="flex items-center gap-5 flex-wrap">
            <span className="flex items-center gap-1.5 text-purple-300">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span>{formatDateThai(work.published_at || work.created_at)}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-slate-400" />
              <span>{work.view_count || 1} ครั้ง</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Download className="w-4 h-4 text-emerald-400" />
              <span>{work.download_count || 0} ดาวน์โหลด</span>
            </span>
          </div>

          <ShareButtons title={work.title} />
        </div>
      </div>

      {/* Interactive PDF & Video Viewer Engine */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-extrabold text-base sm:text-lg">
            <Play className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span>พรีวิวและดาวน์โหลดอุปกรณ์เกม (Game Media Viewer)</span>
          </div>
        </div>

        <DocumentPdfViewer
          fileUrl={fileUrl}
          youtubeUrl={work.details?.youtube_url ? String(work.details.youtube_url) : null}
          title={work.title}
          coverImage={work.cover_image}
          gradeLevel={work.grade_level}
          subject={work.subject}
          fallbackContent={work.content}
        />
      </section>

      {/* Structured Content */}
      <section className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
              กติกา อุปกรณ์ และวิธีการเล่นเกม
            </h2>
          </div>
        </div>

        <RichMarkdown content={work.content} />
      </section>

      {/* Teacher Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-50/80 via-slate-50 to-indigo-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-purple-950/40 border border-purple-200/60 dark:border-purple-900/40 flex flex-col sm:flex-row items-center gap-6 shadow-xs">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-white dark:border-slate-800 shadow-md shrink-0">
          <Image
            src={settings.teacher_avatar_url || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop"}
            alt={settings.teacher_name || "ครูคิง"}
            fill
            unoptimized
            className="object-cover"
          />
        </div>

        <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[10px] font-bold">
            <Award className="w-3 h-3 text-amber-500" />
            <span>ครูผู้ออกแบบเกมการศึกษา</span>
          </div>

          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
            {settings.teacher_name || "ครูคิง (Kru King)"}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
            {settings.teacher_bio || "ครูผู้สอนกลุ่มสาระวิทยาศาสตร์และเทคโนโลยี • สังคมศึกษา มุ่งมั่นสร้างสรรค์บอร์ดเกม Unplugged และเกมดิจิทัลเสริมทักษะ"}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs">
            <Link
              href="/about"
              className="font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
            >
              <span>ดูประวัติและผลงานครูคิง</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Related Games */}
      {relatedWorks.length > 0 && (
        <section className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                เกมการเรียนรู้อื่นๆ ที่น่าสนใจ
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                เลือกเล่นและดาวน์โหลดเกมเพิ่มเติม
              </p>
            </div>
            <Link
              href="/games"
              className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
            >
              <span>ดูทั้งหมด</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedWorks.map((rw) => (
              <WorkCard key={rw.id} work={rw} />
            ))}
          </div>
        </section>
      )}

      {/* Back Action */}
      <div className="pt-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
        <Link
          href="/games"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-800 shadow-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-purple-600" />
          <span>กลับคลังเกมทั้งหมด</span>
        </Link>
      </div>
    </div>
  );
}
