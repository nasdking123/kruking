'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  DownloadCloud, 
  Search, 
  FileText, 
  FileCode, 
  FileSpreadsheet, 
  FileArchive, 
  Download, 
  ArrowRight 
} from 'lucide-react';
import { getDownloads, trackDownloadCount, type DownloadRow } from '@/services/downloads';
import { formatBytes } from '@/lib/utils';

const CATEGORIES = [
  { id: 'all', name: 'ทั้งหมด' },
  { id: 'templates', name: 'เทมเพลตและแผน' },
  { id: 'slides', name: 'สไลด์ประกอบการสอน' },
  { id: 'assessment', name: 'การวัดและประเมินผล' },
  { id: 'media_kits', name: 'ชุดการ์ดและสื่อการสอน' },
  { id: 'official_docs', name: 'คู่มือและเอกสาร ว.PA' },
];

const FILE_TYPES = [
  { id: 'all', name: 'ทุกประเภทไฟล์' },
  { id: 'pdf', name: 'PDF' },
  { id: 'docx', name: 'Word (.docx)' },
  { id: 'pptx', name: 'PowerPoint (.pptx)' },
  { id: 'xlsx', name: 'Excel (.xlsx)' },
  { id: 'zip', name: 'ZIP Archive' },
];

export default function DownloadCenterPage() {
  const [downloads, setDownloads] = useState<DownloadRow[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFileType, setSelectedFileType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let ignore = false;
    getDownloads().then((data) => {
      if (!ignore) setDownloads(data);
    });
    return () => {
      ignore = true;
    };
  }, []);

  const filteredDownloads = useMemo(() => {
    return downloads.filter((item) => {
      const matchCat = selectedCategory === 'all' || item.category_id === selectedCategory;
      const matchType = selectedFileType === 'all' || item.file_type.toLowerCase() === selectedFileType.toLowerCase();
      const matchQuery =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCat && matchType && matchQuery;
    });
  }, [downloads, selectedCategory, selectedFileType, searchQuery]);

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <FileText className="w-6 h-6 text-rose-500" />;
      case 'docx':
        return <FileText className="w-6 h-6 text-blue-500" />;
      case 'pptx':
        return <FileCode className="w-6 h-6 text-orange-500" />;
      case 'xlsx':
        return <FileSpreadsheet className="w-6 h-6 text-emerald-500" />;
      case 'zip':
        return <FileArchive className="w-6 h-6 text-amber-500" />;
      default:
        return <FileText className="w-6 h-6 text-slate-500" />;
    }
  };

  const handleDownloadClick = (item: DownloadRow) => {
    trackDownloadCount(item.id);
    setDownloads((prev) =>
      prev.map((d) => (d.id === item.id ? { ...d, download_count: d.download_count + 1 } : d))
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-tr from-cyan-700 via-blue-800 to-indigo-950 text-white shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs">
          <DownloadCloud className="w-3.5 h-3.5" />
          <span>Kru King Educational Download Center & Archives</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
          ศูนย์ดาวน์โหลดสื่อและเอกสารการศึกษา
        </h1>
        <p className="text-sm sm:text-base text-cyan-100 max-w-2xl leading-relaxed font-normal">
          คลังไฟล์สื่อการสอน เทมเพลตแผนการจัดการเรียนรู้ สไลด์นำเสนอ บัตรกิจกรรม และเครื่องมือช่วยสอน ดาวน์โหลดฟรีไม่มีค่าใช้จ่าย
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
        {/* Search row */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่อไฟล์, สื่อการสอน, หรือคำสำคัญ..."
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Categories Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-semibold shrink-0 pr-1">หมวดหมู่:</span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* File Types row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-semibold shrink-0 pr-1">ประเภทไฟล์:</span>
          {FILE_TYPES.map((ft) => (
            <button
              key={ft.id}
              type="button"
              onClick={() => setSelectedFileType(ft.id)}
              className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-colors cursor-pointer ${
                selectedFileType === ft.id
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {ft.name}
            </button>
          ))}
        </div>
      </div>

      {/* Downloads List / Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            ไฟล์ทั้งหมด ({filteredDownloads.length} รายการ)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDownloads.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 shrink-0">
                    {getFileIcon(item.file_type)}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-mono text-[10px] font-bold uppercase">
                        .{item.file_type}
                      </span>
                      {item.grade_level && (
                        <span className="text-[11px] font-semibold text-slate-500">
                          {item.grade_level}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                      <Link href={`/downloads/${item.slug}`} className="hover:text-blue-600 transition-colors">
                        {item.title}
                      </Link>
                    </h3>
                  </div>
                </div>

                {item.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                )}

                <div className="flex items-center gap-4 pt-1 text-xs text-slate-400">
                  <span>ขนาด: {formatBytes(item.file_size)}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Download className="w-3 h-3 text-blue-500" />
                    <span>{item.download_count} ดาวน์โหลด</span>
                  </span>
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <Link
                  href={`/downloads/${item.slug}`}
                  className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1"
                >
                  <span>รายละเอียด</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <a
                  href={item.file_url}
                  download
                  onClick={() => handleDownloadClick(item)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ดาวน์โหลดไฟล์</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
