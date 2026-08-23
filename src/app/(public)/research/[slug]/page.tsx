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
  FileCheck2
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
  if (!work) return { title: 'ไม่พบงานวิจัยนี้' };

  return {
    title: `${work.title} | งานวิจัยครูคิง`,
    description: work.description || undefined,
  };
}

export default async function ResearchDetailPage({
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
        <Link href="/research" className="hover:text-blue-600 transition-colors">งานวิจัยในชั้นเรียน</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 dark:text-white font-medium truncate max-w-xs">{work.title}</span>
      </nav>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="primary">งานวิจัยในชั้นเรียน (CAR)</Badge>
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

      {/* Abstract Card */}
      {Boolean(work.details?.abstract) && (
        <div className="p-6 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/60 space-y-2">
          <div className="flex items-center gap-2 text-purple-800 dark:text-purple-300 font-bold text-sm">
            <FileText className="w-4 h-4" />
            <span>บทคัดย่อ (Abstract)</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {`${work.details?.abstract}`}
          </p>
        </div>
      )}

      {/* Download Action Box */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <FileCheck2 className="w-4 h-4 text-purple-600" />
            <span>ดาวน์โหลดเล่มรายงานวิจัยฉบับสมบูรณ์ (Full Paper)</span>
          </h3>
          <p className="text-xs text-slate-500">
            เอกสารไฟล์ PDF 5 บท พร้อมเครื่องมือวิจัยและภาคผนวก
          </p>
        </div>

        <a
          href={work.details?.paper_pdf_url ? String(work.details.paper_pdf_url) : '#'}
          download
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-2 shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>ดาวน์โหลดเล่มวิจัยฉบับเต็ม</span>
        </a>
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
          href="/research"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับคลังงานวิจัย</span>
        </Link>
      </div>
    </div>
  );
}
