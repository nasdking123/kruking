'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FolderOpen, 
  Search, 
  BookOpen, 
  FileText, 
  Gamepad2, 
  Sparkles, 
  Layers, 
  GraduationCap, 
  SlidersHorizontal, 
  LayoutGrid, 
  List, 
  Eye, 
  Download, 
  ArrowRight,
  CheckCircle2,
  Calendar,
  Tag,
  ExternalLink,
  Flame,
  ArrowUpDown
} from 'lucide-react';
import type { WorkWithRelations } from '@/services/works';

interface ResourceLibraryProps {
  initialWorks: WorkWithRelations[];
}

const TYPE_TABS = [
  { id: 'all', label: 'ทั้งหมด', icon: Layers },
  { id: 'resource', label: '🖥️ สื่อการสอน / สไลด์', icon: FolderOpen },
  { id: 'worksheet', label: '📚 ใบงาน & แบบฝึก', icon: FileText },
  { id: 'lesson_plan', label: '📝 แผนการสอน 5E', icon: BookOpen },
  { id: 'game', label: '🎮 เกมการเรียนรู้', icon: Gamepad2 },
  { id: 'innovation', label: '💡 นวัตกรรม & วิจัย', icon: Sparkles },
];

const SUBJECTS = [
  { id: 'all', label: 'ทุกกลุ่มสาระ' },
  { id: 'history', label: '🏛️ ประวัติศาสตร์ (ป.3 / ป.6)', keyword: 'ประวัติศาสตร์' },
  { id: 'anti_corruption', label: '⚖️ ต้านทุจริตศึกษา (ป.6)', keyword: 'ต้านทุจริต' },
  { id: 'computing', label: '💻 วิทยาการคำนวณ & Coding', keyword: 'วิทยาการคำนวณ' },
  { id: 'pa', label: '📑 ว.PA & การพัฒนาวิชาชีพ', keyword: 'PA' },
];

const GRADES = ['ทั้งหมด', 'ป.1', 'ป.2', 'ป.3', 'ป.4', 'ป.5', 'ป.6'];

export function ResourceLibrary({ initialWorks }: ResourceLibraryProps) {
  const [activeType, setActiveType] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('ทั้งหมด');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'views' | 'featured'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredWorks = useMemo(() => {
    let list = initialWorks.filter((work) => {
      // Type filter
      if (activeType !== 'all') {
        if (activeType === 'resource' && !['resource', 'media', 'teaching'].includes(work.type)) return false;
        if (activeType === 'worksheet' && work.type !== 'worksheet') return false;
        if (activeType === 'lesson_plan' && work.type !== 'lesson_plan') return false;
        if (activeType === 'game' && work.type !== 'game') return false;
        if (activeType === 'innovation' && !['innovation', 'research', 'award'].includes(work.type)) return false;
      }

      // Subject filter
      if (selectedSubject !== 'all') {
        const sub = SUBJECTS.find((s) => s.id === selectedSubject);
        if (sub?.keyword) {
          const matchTitle = work.title?.toLowerCase().includes(sub.keyword.toLowerCase());
          const matchSub = work.subject?.toLowerCase().includes(sub.keyword.toLowerCase());
          const matchDesc = work.description?.toLowerCase().includes(sub.keyword.toLowerCase());
          if (!matchTitle && !matchSub && !matchDesc) return false;
        }
      }

      // Grade filter
      if (selectedGrade !== 'ทั้งหมด') {
        const matchGrade = work.grade_level?.includes(selectedGrade);
        if (!matchGrade) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = work.title?.toLowerCase().includes(q);
        const matchDesc = work.description?.toLowerCase().includes(q);
        const matchSubject = work.subject?.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchSubject) return false;
      }

      return true;
    });

    // Sorting
    if (sortBy === 'featured') {
      list = [...list].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    } else if (sortBy === 'views') {
      list = [...list].sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
    } else {
      list = [...list].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return list;
  }, [initialWorks, activeType, selectedSubject, selectedGrade, searchQuery, sortBy]);

  const getWorkHref = (work: WorkWithRelations) => {
    if (work.type === 'resource') return `/resources/${work.slug}`;
    if (work.type === 'worksheet') return `/worksheets/${work.slug}`;
    if (work.type === 'lesson_plan') return `/lesson-plans/${work.slug}`;
    if (work.type === 'game') return `/games/${work.slug}`;
    if (work.type === 'teaching') return `/teaching/${work.slug}`;
    if (work.type === 'innovation') return `/innovation/${work.slug}`;
    if (work.type === 'research') return `/research/${work.slug}`;
    return `/portfolio/${work.slug}`;
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'lesson_plan':
        return { label: 'แผนการสอน 5E', color: 'bg-blue-500/90 text-white' };
      case 'worksheet':
        return { label: 'ใบงาน', color: 'bg-emerald-500/90 text-white' };
      case 'game':
        return { label: 'เกมการเรียนรู้', color: 'bg-amber-500/90 text-slate-950' };
      case 'innovation':
        return { label: 'นวัตกรรม', color: 'bg-purple-500/90 text-white' };
      default:
        return { label: 'สื่อการสอน', color: 'bg-slate-900/90 text-white' };
    }
  };

  return (
    <div className="space-y-10">
      
      {/* 1. HERO HEADER: MAGAZINE-GRADE BANNER WITH STATS */}
      <div className="relative overflow-hidden p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-950 text-white shadow-2xl border border-white/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 text-blue-100 text-xs font-black backdrop-blur-md border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Digital Learning Resource Hub</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              คลังสื่อและนวัตกรรมการเรียนรู้
            </h1>
            <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed font-normal max-w-2xl">
              ศูนย์รวมสื่อการสอน สไลด์บรรยาย Infographic ใบงาน แผน 5E และสื่อดิจิทัลครบวงจร จัดเรียงอย่างเป็นระเบียบ ค้นหาง่าย และพร้อมใช้งานทันที
            </p>
          </div>

          {/* Quick Stats Summary */}
          <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold">
            <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-blue-300" />
              <span>สื่อทั้งหมด: {initialWorks.length} รายการ</span>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-300" />
              <span>ดาวน์โหลดฟรี 100%</span>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-300" />
              <span>ตรงตามตัวชี้วัดหลักสูตร</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SEARCH & CONTROL BAR */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
        
        {/* Top Controls: Search + Sort + View Mode */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อสื่อ, สาระวิชา, คำอธิบาย หรือระดับชั้น..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ล้าง
              </button>
            )}
          </div>

          {/* Right Action Tools: Sort & View Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-xs font-bold">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="newest">📅 ใหม่ล่าสุด</option>
                <option value="views">🔥 ยอดเข้าชมมากสุด</option>
                <option value="featured">⭐ ผลงานเด่นแนะนำ</option>
              </select>
            </div>

            {/* View Mode Buttons */}
            <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="มุมมองตารางการ์ด (Grid)"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="มุมมองรายการนิตยสาร (List)"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Type Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-t border-slate-100 dark:border-slate-800 pt-4">
          {TYPE_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveType(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700 hover:border-blue-300 hover:bg-slate-100 dark:hover:bg-slate-750'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Subject & Grade Filter Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 border-t border-slate-100 dark:border-slate-800">
          
          {/* Subject Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
              <Tag className="w-3 h-3 text-blue-500" />
              สาระวิชา:
            </span>
            {SUBJECTS.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubject(sub.id)}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  selectedSubject === sub.id
                    ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>

          {/* Grade Level Pills */}
          <div className="flex items-center gap-1.5 flex-wrap shrink-0">
            <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
              <GraduationCap className="w-3 h-3 text-indigo-500" />
              ระดับชั้น:
            </span>
            {GRADES.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGrade(g)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  selectedGrade === g
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* 3. RESULTS STATUS BAR */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 px-1">
        <span>
          แสดงผลลัพธ์: <strong className="text-blue-600 dark:text-blue-400">{filteredWorks.length}</strong> สื่อการสอน
        </span>
        {(activeType !== 'all' || selectedSubject !== 'all' || selectedGrade !== 'ทั้งหมด' || searchQuery) && (
          <button
            onClick={() => {
              setActiveType('all');
              setSelectedSubject('all');
              setSelectedGrade('ทั้งหมด');
              setSearchQuery('');
            }}
            className="text-xs text-rose-500 hover:underline cursor-pointer"
          >
            ล้างตัวกรองทั้งหมด ✕
          </button>
        )}
      </div>

      {/* 4. RESULTS DISPLAY: GRID OR MAGAZINE LIST VIEW */}
      {filteredWorks.length === 0 ? (
        <div className="p-16 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/60 text-blue-500 flex items-center justify-center mx-auto shadow-inner">
            <FolderOpen className="w-8 h-8 opacity-60" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-200">
              ไม่พบสื่อการสอนที่ตรงกับเงื่อนไข
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              ลองค้นหาด้วยคำสำคัญอื่น หรือเลือกกลุ่มสาระและระดับชั้นใหม่
            </p>
          </div>
          <button
            onClick={() => {
              setActiveType('all');
              setSelectedSubject('all');
              setSelectedGrade('ทั้งหมด');
              setSearchQuery('');
            }}
            className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all cursor-pointer"
          >
            แสดงสื่อการสอนทั้งหมด
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredWorks.map((work) => {
            const badge = getTypeBadge(work.type);
            const href = getWorkHref(work);
            return (
              <div
                key={work.id}
                className="group flex flex-col justify-between rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:shadow-2xl hover:border-blue-400 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
              >
                <div>
                  {/* Card Cover Image */}
                  <Link href={href} className="relative block aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                    {work.cover_image ? (
                      <Image
                        src={work.cover_image}
                        alt={work.title}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-108 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 bg-gradient-to-br from-slate-100 to-blue-50 dark:from-slate-800 dark:to-slate-900">
                        <FolderOpen className="w-12 h-12 opacity-30" />
                      </div>
                    )}

                    {/* Type Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-black shadow-xs">
                      <span>{badge.label}</span>
                    </div>

                    {work.featured && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500 text-slate-950 text-[10px] font-black shadow-xs uppercase">
                        <Sparkles className="w-3 h-3" />
                        <span>แนะนำ</span>
                      </div>
                    )}
                  </Link>

                  {/* Card Body */}
                  <div className="p-5 space-y-2.5">
                    {/* Metadata chips */}
                    <div className="flex items-center gap-2 flex-wrap text-[11px]">
                      {work.grade_level && (
                        <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 font-bold">
                          {work.grade_level}
                        </span>
                      )}
                      {work.subject && (
                        <span className="font-bold text-slate-500 dark:text-slate-400 line-clamp-1">
                          {work.subject}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      <Link href={href}>{work.title}</Link>
                    </h3>

                    {/* Description */}
                    {work.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-normal">
                        {work.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-5 py-3.5 bg-slate-50/60 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span>{work.view_count || 0}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="w-3.5 h-3.5 text-slate-400" />
                      <span>{work.download_count || 0}</span>
                    </span>
                  </div>

                  <Link
                    href={href}
                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 text-xs"
                  >
                    <span>อ่านต่อ</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* MAGAZINE / LIST VIEW */
        <div className="space-y-4">
          {filteredWorks.map((work) => {
            const badge = getTypeBadge(work.type);
            const href = getWorkHref(work);
            return (
              <div
                key={work.id}
                className="group p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-xl hover:border-blue-400 transition-all flex flex-col sm:flex-row items-start sm:items-center gap-6"
              >
                {/* Thumbnail */}
                <Link
                  href={href}
                  className="relative w-full sm:w-48 h-32 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0"
                >
                  {work.cover_image ? (
                    <Image
                      src={work.cover_image}
                      alt={work.title}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100 dark:bg-slate-800">
                      <FolderOpen className="w-8 h-8 opacity-30" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-bold">
                    {badge.label}
                  </div>
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    {work.grade_level && (
                      <span className="px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 font-bold text-[11px]">
                        {work.grade_level}
                      </span>
                    )}
                    {work.subject && (
                      <span className="text-slate-500 font-semibold text-[11px]">
                        {work.subject}
                      </span>
                    )}
                    {work.featured && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-extrabold text-[10px]">
                        ⭐ แนะนำ
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    <Link href={href}>{work.title}</Link>
                  </h3>

                  {work.description && (
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2 font-normal leading-relaxed">
                      {work.description}
                    </p>
                  )}

                  <div className="pt-2 flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{work.view_count || 0} เข้าชม</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" />
                      <span>{work.download_count || 0} ดาวน์โหลด</span>
                    </span>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="shrink-0 self-end sm:self-center">
                  <Link
                    href={href}
                    className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>เปิดอ่านสื่อ</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
