import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  ChevronRight, 
  Download, 
  Calendar, 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';
import { getDownloadBySlug } from '@/services/downloads';
import { formatBytes, formatDateThai } from '@/lib/utils';
import { ShareButtons } from '@/components/public/share-buttons';
import { Badge } from '@/components/ui/badge';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const file = await getDownloadBySlug(slug);
  if (!file) return { title: 'ไม่พบไฟล์ดาวน์โหลด' };

  return {
    title: `${file.title} | ศูนย์ดาวน์โหลดครูคิง`,
    description: file.description || undefined,
  };
}

export default async function DownloadDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const file = await getDownloadBySlug(slug);

  if (!file) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-blue-600 transition-colors">หน้าแรก</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/downloads" className="hover:text-blue-600 transition-colors">ศูนย์ดาวน์โหลด</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 dark:text-white font-medium truncate max-w-xs">{file.title}</span>
      </nav>

      {/* Header Box */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-md space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-mono text-xs font-bold uppercase shadow-xs">
              .{file.file_type}
            </span>
            {file.grade_level && <Badge variant="outline">{file.grade_level}</Badge>}
            {file.subject && <Badge variant="outline">{file.subject}</Badge>}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
            {file.title}
          </h1>

          {file.description && (
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {file.description}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 pb-4 border-y border-slate-100 dark:border-slate-800 text-xs text-slate-500">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                <span>วันที่เผยแพร่: {formatDateThai(file.created_at)}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>ดาวน์โหลดไปแล้ว {file.download_count} ครั้ง</span>
              </span>
            </div>

            <ShareButtons title={file.title} />
          </div>
        </div>

        {/* File Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60">
            <span className="text-slate-400 block text-[11px]">ขนาดไฟล์</span>
            <span className="font-bold text-slate-900 dark:text-white">{formatBytes(file.file_size)}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60">
            <span className="text-slate-400 block text-[11px]">รูปแบบไฟล์</span>
            <span className="font-bold text-slate-900 dark:text-white uppercase">.{file.file_type}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60">
            <span className="text-slate-400 block text-[11px]">ปีการศึกษา</span>
            <span className="font-bold text-slate-900 dark:text-white">{file.year || '2568'}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60">
            <span className="text-slate-400 block text-[11px]">สัญญาอนุญาต</span>
            <span className="font-bold text-slate-900 dark:text-white">CC-BY-NC 4.0</span>
          </div>
        </div>

        {/* Big Download Button */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-blue-500/20">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base font-bold flex items-center justify-center sm:justify-start gap-1.5">
              <ShieldCheck className="w-5 h-5 text-emerald-300" />
              <span>ไฟล์ปลอดภัย ปลอดไวรัส 100%</span>
            </h3>
            <p className="text-xs text-blue-100">
              คลิกเพื่อดาวน์โหลดไฟล์ต้นฉบับความละเอียดสูง
            </p>
          </div>

          <a
            href={file.file_url}
            download
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-blue-700 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>ดาวน์โหลดทันที ({formatBytes(file.file_size)})</span>
          </a>
        </div>
      </div>

      {/* Usage Tips */}
      <div className="p-6 rounded-3xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60 space-y-3">
        <h3 className="text-sm font-bold text-blue-900 dark:text-blue-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>คำแนะนำในการนำไฟล์ไปใช้งาน</span>
        </h3>
        <ul className="text-xs space-y-1.5 text-slate-700 dark:text-slate-300 list-disc pl-5">
          <li>ไฟล์เอกสาร Word (.docx) และสไลด์ (.pptx) สามารถแก้ไขข้อความ รูปภาพ และปรับแต่งตามบริบทห้องเรียนของท่านได้ทันที</li>
          <li>สามารถนำไปใช้เพื่อการจัดการเรียนการสอนและเผยแพร่ต่อได้โดยไม่ต้องเสียค่าใช้จ่าย (Non-Commercial)</li>
          <li>หากมีข้อสงสัยหรือต้องการไฟล์ต้นฉบับเพิ่มเติม สามารถติดต่อครูคิงผ่านหน้าติดต่อเราได้ครับ</li>
        </ul>
      </div>

      {/* Back Button */}
      <div className="pt-2">
        <Link
          href="/downloads"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับศูนย์ดาวน์โหลด</span>
        </Link>
      </div>
    </div>
  );
}
