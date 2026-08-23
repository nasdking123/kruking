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
  Target,
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
  if (!work) return { title: 'ไม่พบแผนการสอนนี้' };

  return {
    title: `${work.title} | แผนการจัดการเรียนรู้ครูคิง`,
    description: work.description || undefined,
  };
}

export default async function LessonPlanDetailPage({
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
        <Link href="/lesson-plans" className="hover:text-blue-600 transition-colors">แผนการจัดการเรียนรู้</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 dark:text-white font-medium truncate max-w-xs">{work.title}</span>
      </nav>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="primary">แผนการจัดการเรียนรู้</Badge>
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

      {/* Academic Alignment Card */}
      <div className="p-6 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/60 space-y-3">
        <div className="flex items-center gap-2 text-sky-800 dark:text-sky-300 font-bold text-sm">
          <Target className="w-4 h-4" />
          <span>ข้อมูลมาตรฐานและตัวชี้วัดหลักสูตร</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="font-semibold text-slate-500 block">หน่วยการเรียนรู้:</span>
            <span className="font-bold text-slate-900 dark:text-white">{work.details?.unit ? `${work.details.unit}` : 'หน่วยที่ 3'}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-500 block">มาตรฐานการเรียนรู้:</span>
            <span className="font-bold text-slate-900 dark:text-white">{work.details?.standard ? `${work.details.standard}` : 'มาตรฐาน ว 4.2'}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-500 block">ตัวชี้วัด:</span>
            <span className="font-bold text-slate-900 dark:text-white">{work.details?.indicator ? `${work.details.indicator}` : 'ป.4/2'}</span>
          </div>
        </div>
        {Boolean(work.details?.objective) && (
          <div className="pt-2 border-t border-sky-200/60 dark:border-sky-900/40 text-xs">
            <span className="font-semibold text-slate-500">จุดประสงค์การเรียนรู้: </span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">{`${work.details?.objective}`}</span>
          </div>
        )}
      </div>

      {/* Download Action Box */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <FileCheck className="w-4 h-4 text-sky-600" />
            <span>ดาวน์โหลดเอกสารแผนการจัดการเรียนรู้</span>
          </h3>
          <p className="text-xs text-slate-500">
            เอกสารไฟล์ Word (.docx) สำหรับนำไปปรับใช้ และไฟล์ PDF พร้อมพิมพ์
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={work.details?.doc_url ? String(work.details.doc_url) : '#'}
            download
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ดาวน์โหลด Word (.docx)</span>
          </a>
          <a
            href={work.details?.pdf_url ? String(work.details.pdf_url) : '#'}
            download
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF</span>
          </a>
        </div>
      </div>

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
          href="/lesson-plans"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับคลังแผนการสอน</span>
        </Link>
      </div>
    </div>
  );
}
