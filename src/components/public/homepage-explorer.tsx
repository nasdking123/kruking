'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  BookOpen, 
  FileText, 
  Gamepad2, 
  Lightbulb, 
  FolderOpen, 
  ArrowRight, 
  Search,
  Layers,
  GraduationCap
} from 'lucide-react';
import type { WorkWithRelations } from '@/services/works';
import { WorkCard } from './work-card';

interface HomepageExplorerProps {
  works: WorkWithRelations[];
}

const TABS = [
  { id: 'all', label: 'ทั้งหมด', icon: Layers, countLabel: 'รายการทั้งหมด' },
  { id: 'featured', label: '⭐ สื่อเด่นคัดสรร', icon: Sparkles, countLabel: 'แนะนำ' },
  { id: 'lesson_plan', label: '📝 แผนการสอน 5E', icon: BookOpen, countLabel: 'แผน 5E' },
  { id: 'worksheet', label: '📚 ใบงาน & แบบฝึก', icon: FileText, countLabel: 'ใบงาน' },
  { id: 'game', label: '🎮 เกมการเรียนรู้', icon: Gamepad2, countLabel: 'เกม' },
  { id: 'innovation', label: '💡 นวัตกรรม & สื่อ', icon: Lightbulb, countLabel: 'นวัตกรรม' },
];

const GRADES = ['ทั้งหมด', 'ป.1', 'ป.2', 'ป.3', 'ป.4', 'ป.5', 'ป.6'];

export function HomepageExplorer({ works }: HomepageExplorerProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('ทั้งหมด');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWorks = useMemo(() => {
    return works.filter((work) => {
      // Tab filtering
      if (activeTab === 'featured' && !work.featured) return false;
      if (activeTab === 'lesson_plan' && work.type !== 'lesson_plan') return false;
      if (activeTab === 'worksheet' && work.type !== 'worksheet') return false;
      if (activeTab === 'game' && work.type !== 'game') return false;
      if (activeTab === 'innovation' && !['innovation', 'teaching', 'resource', 'media'].includes(work.type)) return false;

      // Grade filtering
      if (selectedGrade !== 'ทั้งหมด') {
        const gradeMatch = work.grade_level?.includes(selectedGrade);
        if (!gradeMatch) return false;
      }

      // Search filtering
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = work.title?.toLowerCase().includes(q);
        const descMatch = work.description?.toLowerCase().includes(q);
        const subjectMatch = work.subject?.toLowerCase().includes(q);
        if (!titleMatch && !descMatch && !subjectMatch) return false;
      }

      return true;
    });
  }, [works, activeTab, selectedGrade, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Header & Search */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200/80 dark:border-blue-800/80 text-blue-700 dark:text-blue-300 text-xs font-bold mb-2">
            <FolderOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Interactive Learning Hub</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            คลังสื่อการสอนและนวัตกรรมการเรียนรู้
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            สลับหมวดหมู่และเลือกระดับชั้นเพื่อค้นหาสื่อการสอน แผน 5E และใบงานได้ทันที
          </p>
        </div>

        {/* Quick in-place search input */}
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่อสื่อ, สาระ, เรื่อง..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-xs transition-all"
          />
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:border-blue-300 hover:bg-slate-50 dark:hover:bg-slate-800/80'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-Filter: Grade Level Pills */}
      <div className="flex items-center gap-2 flex-wrap text-xs">
        <span className="text-slate-400 font-bold text-[11px] flex items-center gap-1 shrink-0 mr-1">
          <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
          ระดับชั้น:
        </span>
        {GRADES.map((grade) => (
          <button
            key={grade}
            onClick={() => setSelectedGrade(grade)}
            className={`px-3 py-1 rounded-xl font-bold text-[11px] transition-all cursor-pointer ${
              selectedGrade === grade
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800/70 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {grade}
          </button>
        ))}

        <div className="ml-auto text-slate-400 text-[11px] font-medium hidden sm:block">
          พบ <span className="font-bold text-blue-600 dark:text-blue-400">{filteredWorks.length}</span> รายการ
        </div>
      </div>

      {/* Grid of Results */}
      {filteredWorks.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 text-center space-y-3">
          <FolderOpen className="w-10 h-10 text-slate-400 mx-auto opacity-50" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
            ไม่พบสื่อการสอนตามเงื่อนไขที่เลือก
          </h3>
          <p className="text-xs text-slate-500">
            ลองปรับเปลี่ยนระดับชั้น หรือคำค้นหาใหม่อีกครั้ง
          </p>
          <button
            onClick={() => {
              setActiveTab('all');
              setSelectedGrade('ทั้งหมด');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold text-xs hover:bg-blue-100 transition-colors cursor-pointer"
          >
            ล้างตัวกรองทั้งหมด
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredWorks.slice(0, 8).map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>
      )}

      {/* Footer Link to view all */}
      {filteredWorks.length > 8 && (
        <div className="text-center pt-2">
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 text-slate-800 dark:text-slate-200 font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            <span>ดูสื่อการสอนทั้งหมดในคลัง ({works.length} รายการ)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
