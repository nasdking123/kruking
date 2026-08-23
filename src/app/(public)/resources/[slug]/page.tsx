import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  ChevronRight, 
  Calendar, 
  Eye, 
  Download, 
  ArrowLeft, 
  FileCheck
} from 'lucide-react';
import { getWorkBySlug, trackWorkView } from '@/services/works';
import { formatDateThai } from '@/lib/utils';
import { ShareButtons } from '@/components/public/share-buttons';
import { Badge } from '@/components/ui/badge';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const work = await getWorkBySlug(slug);
  if (!work) return { title: 'ไม่พบสื่อการสอนนี้' };

  return {
    title: `${work.title} | คลังสื่อการสอนครูคิง`,
    description: work.description || undefined,
  };
}

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = await getWorkBySlug(slug);

  if (!work) {
    notFound();
  }

  await trackWorkView(work.id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-blue-600 transition-colors">หน้าแรก</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/resources" className="hover:text-blue-600 transition-colors">คลังสื่อการสอน</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 dark:text-white font-medium truncate max-w-xs">{work.title}</span>
      </nav>

      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="primary">สื่อการสอน</Badge>
          {work.grade_level && <Badge variant="outline">{work.grade_level}</Badge>}
          {work.subject && <Badge variant="outline">{work.subject}</Badge>}
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          {work.title}
        </h1>

        {work.description && (
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {work.description}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 pb-4 border-y border-slate-200 dark:border-slate-800 text-xs text-slate-500">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              <span>{formatDateThai(work.published_at || work.created_at)}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>{work.view_count} ครั้ง</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>{work.download_count} ดาวน์โหลด</span>
            </span>
          </div>

          <ShareButtons title={work.title} />
        </div>
      </div>

      {/* Action Download Box */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200/80 dark:border-blue-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <FileCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>ไฟล์สื่อประกอบการสอนพร้อมใช้งาน</span>
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            ดาวน์โหลดไฟล์สไลด์/เอกสาร สำหรับนำไปจัดกิจกรรมในชั้นเรียน
          </p>
        </div>

        <a
          href={work.details?.file_url ? String(work.details.file_url) : '#'}
          download
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>ดาวน์โหลดสื่อการสอน</span>
        </a>
      </div>

      {/* Cover Image */}
      {work.cover_image && (
        <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={work.cover_image}
            alt={work.title}
            className="w-full max-h-[450px] object-cover"
          />
        </div>
      )}

      {/* Content */}
      <article className="prose prose-slate dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed space-y-4">
        {work.content?.split('\n\n').map((para, idx) => {
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

      {/* Back Button */}
      <div className="pt-4">
        <Link
          href="/resources"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับคลังสื่อการสอน</span>
        </Link>
      </div>
    </div>
  );
}
