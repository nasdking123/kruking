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
  FileText,
  KeyRound,
  Printer
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
  if (!work) return { title: 'ไม่พบใบงานนี้' };

  return {
    title: `${work.title} | คลังใบงานครูคิง`,
    description: work.description || undefined,
  };
}

export default async function WorksheetDetailPage({
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
        <Link href="/worksheets" className="hover:text-blue-600 transition-colors">คลังใบงาน</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 dark:text-white font-medium truncate max-w-xs">{work.title}</span>
      </nav>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="success">ใบงานดาวน์โหลดฟรี</Badge>
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

      {/* Dual Download Action Box */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-200/80 dark:border-emerald-900/60 space-y-4">
        <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
          <Printer className="w-4 h-4" />
          <span>ดาวน์โหลดไฟล์ PDF คุณภาพสูง</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href={work.details?.pdf_url ? String(work.details.pdf_url) : '#'}
            download
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 shadow-xs flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                <FileText className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  ใบงานสำหรับนักเรียน (PDF)
                </div>
                <div className="text-[11px] text-slate-500">พร้อมพิมพ์ขาวดำ/สี</div>
              </div>
            </div>
            <Download className="w-4 h-4 text-emerald-600 group-hover:translate-y-0.5 transition-transform" />
          </a>

          <a
            href={work.details?.answer_key_url ? String(work.details.answer_key_url) : '#'}
            download
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-teal-300 dark:border-teal-800/80 hover:bg-teal-50 dark:hover:bg-teal-950/50 shadow-xs flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300">
                <KeyRound className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  เฉลยละเอียดสำหรับคุณครู (PDF)
                </div>
                <div className="text-[11px] text-slate-500">พร้อมคำอธิบายเฉลย</div>
              </div>
            </div>
            <Download className="w-4 h-4 text-teal-600 group-hover:translate-y-0.5 transition-transform" />
          </a>
        </div>
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
          href="/worksheets"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับคลังใบงาน</span>
        </Link>
      </div>
    </div>
  );
}
