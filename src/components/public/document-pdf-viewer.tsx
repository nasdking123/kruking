'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  Printer, 
  Loader2, 
  Sparkles,
  Layers,
  Video
} from 'lucide-react';
import { parseDocumentUrl } from '@/lib/document-utils';
import { getYouTubeEmbedUrl } from '@/lib/youtube';

interface DocumentPdfViewerProps {
  fileUrl?: string | null;
  youtubeUrl?: string | null;
  title: string;
  coverImage?: string | null;
  gradeLevel?: string | null;
  subject?: string | null;
  fallbackContent?: string | null;
}

export function DocumentPdfViewer({
  fileUrl,
  youtubeUrl,
  title,
  coverImage,
  gradeLevel,
  subject,
  fallbackContent,
}: DocumentPdfViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);

  const docInfo = parseDocumentUrl(fileUrl);
  const hasEmbedPdf = Boolean(docInfo && docInfo.isEmbeddable && docInfo.embedUrl);
  const ytEmbedUrl = getYouTubeEmbedUrl(youtubeUrl);
  const hasEmbedYt = Boolean(ytEmbedUrl);

  const [activeTab, setActiveTab] = useState<'pdf' | 'video' | 'summary'>(() =>
    hasEmbedPdf ? 'pdf' : hasEmbedYt ? 'video' : 'summary'
  );

  const downloadLink = docInfo?.downloadUrl || fileUrl || '#';

  const handlePrint = () => {
    window.print();
  };

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  return (
    <div
      className={`transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md p-4 sm:p-6 flex flex-col justify-center'
          : 'relative my-8 rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xl'
      }`}
    >
      {/* 1. TOP VIEWER TOOLBAR */}
      <div className="px-5 py-4 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 rounded-xl bg-blue-600/30 border border-blue-500/30 text-blue-400 shrink-0">
            {activeTab === 'video' ? <Video className="w-5 h-5 text-rose-400" /> : <FileText className="w-5 h-5 text-blue-400" />}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-bold text-[10px] uppercase tracking-wider border border-blue-400/20">
                {activeTab === 'video' ? 'วิดีโอบทเรียน YouTube' : 'PDF & Interactive Document'}
              </span>
              {gradeLevel && (
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium text-[10px]">
                  {gradeLevel}
                </span>
              )}
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white truncate mt-0.5">
              {title}
            </h3>
          </div>
        </div>

        {/* Action Controls & Tab Switcher */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto flex-wrap">
          {/* Tab Switcher (PDF / Video / Summary) */}
          <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700 text-xs">
            {hasEmbedPdf && (
              <button
                type="button"
                onClick={() => {
                  setActiveTab('pdf');
                  setLoading(true);
                }}
                className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'pdf'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-blue-300" />
                <span>ไฟล์ PDF</span>
              </button>
            )}

            {hasEmbedYt && (
              <button
                type="button"
                onClick={() => setActiveTab('video')}
                className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'video'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Video className="w-3.5 h-3.5 text-rose-300" />
                <span>วิดีโอ YouTube</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setActiveTab('summary')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'summary'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-indigo-300" />
              <span>ภาพรวม</span>
            </button>
          </div>

          {/* Print Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700 cursor-pointer"
            title="พิมพ์เอกสาร"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* External Link */}
          {(fileUrl || youtubeUrl) && (
            <a
              href={activeTab === 'video' ? youtubeUrl! : docInfo?.viewUrl || fileUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
              title="เปิดในแท็บใหม่"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          {/* Fullscreen Mode */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700 cursor-pointer"
            title={isFullscreen ? 'ย่อหน้าต่าง' : 'ดูแบบเต็มหน้าจอ'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Download Button */}
          {fileUrl && (
            <a
              href={downloadLink}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ดาวน์โหลด PDF</span>
            </a>
          )}
        </div>
      </div>

      {/* 2. VIEWER MAIN CONTENT AREA */}
      <div
        className={`relative w-full bg-slate-100 dark:bg-slate-950 ${
          isFullscreen ? 'flex-1 overflow-hidden' : 'min-h-[520px] sm:min-h-[640px]'
        }`}
      >
        {/* Tab 1: PDF Viewer Embed (Google Drive / Direct PDF / Canva) */}
        {activeTab === 'pdf' && hasEmbedPdf && (
          <div className="relative w-full h-full min-h-[520px] sm:min-h-[640px]">
            {loading && (
              <div className="absolute inset-0 z-10 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center gap-3 text-white">
                <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                <span className="text-xs font-semibold">กำลังโหลดเอกสาร PDF ในระบบ...</span>
              </div>
            )}
            <iframe
              src={docInfo!.embedUrl!}
              title={title}
              onLoad={() => setLoading(false)}
              className="w-full h-full min-h-[520px] sm:min-h-[640px] border-0 rounded-b-3xl"
              allow="autoplay; encrypted-media; fullscreen"
            />
          </div>
        )}

        {/* Tab 2: YouTube Video Player Embed */}
        {activeTab === 'video' && hasEmbedYt && (
          <div className="relative w-full h-full min-h-[420px] sm:min-h-[580px] bg-slate-950 flex items-center justify-center p-2 sm:p-6">
            <div className="w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-black">
              <iframe
                src={ytEmbedUrl!}
                title={`YouTube: ${title}`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Tab 3: Summary / Overview Fallback */}
        {activeTab === 'summary' && (
          <div className="p-6 sm:p-10 space-y-6 max-w-4xl mx-auto">
            <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 text-white shadow-lg space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-200">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>คลังสื่อการสอนและแผนการจัดการเรียนรู้ ครูคิง</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold">{title}</h2>
              <div className="flex items-center gap-4 text-xs text-blue-100 flex-wrap">
                <span>ระดับชั้น: {gradeLevel || 'ประถมศึกษาปีที่ 6'}</span>
                <span>วิชา: {subject || 'วิทยาการคำนวณ'}</span>
                <span>สถานะ: พร้อมใช้งาน</span>
              </div>
            </div>

            {coverImage && (
              <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md aspect-16/9 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverImage}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-0.5 text-center sm:text-left">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  เอกสารการสอนและสื่อประกอบฉบับสมบูรณ์
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  สามารถดาวน์โหลดหรือสั่งพิมพ์เอกสารสำหรับนำไปจัดกิจกรรมในห้องเรียนได้ทันที
                </p>
                {fallbackContent && (
                  <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 whitespace-pre-line max-w-2xl">
                    {fallbackContent}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>พิมพ์</span>
                </button>
                {fileUrl && (
                  <a
                    href={downloadLink}
                    download
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>ดาวน์โหลดไฟล์</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. BOTTOM VIEWER STATUS BAR */}
      <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between flex-wrap gap-2">
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
          <span>เอกสารตรวจสอบแล้วพร้อมใช้งานสำหรับการจัดการเรียนรู้</span>
        </span>
        <span>ระบบแสดงตัวอย่างเอกสาร & สื่อวิดีโอความละเอียดสูง (Live Media Viewer Engine)</span>
      </div>
    </div>
  );
}
