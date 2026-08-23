'use client';

import React, { useState, useEffect } from 'react';
import { Search, Layers, BookOpen, FileText, Gamepad2, FolderOpen, Sparkles } from 'lucide-react';
import { getWorks, getCategories, type WorkWithRelations, type CategoryRow } from '@/services/works';
import { WorkCard } from '@/components/public/work-card';

const typeFilters = [
  { key: 'all', label: 'ทั้งหมด', icon: Layers },
  { key: 'resource', label: 'สื่อการสอน', icon: FolderOpen },
  { key: 'worksheet', label: 'ใบงาน', icon: FileText },
  { key: 'game', label: 'เกมการเรียนรู้', icon: Gamepad2 },
  { key: 'lesson_plan', label: 'แผนการสอน', icon: BookOpen },
  { key: 'innovation', label: 'นวัตกรรม', icon: Sparkles },
];

export default function SearchPage() {
  const [works, setWorks] = useState<WorkWithRelations[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    let ignore = false;
    getWorks().then((data) => {
      if (!ignore) setWorks(data);
    });
    getCategories().then((data) => {
      if (!ignore) setCategories(data);
    });
    return () => {
      ignore = true;
    };
  }, []);

  const filtered = works.filter((w) => {
    const matchSearch =
      searchQuery === '' ||
      w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.description && w.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (w.subject && w.subject.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchType = selectedType === 'all' || w.type === selectedType;
    const matchCategory = selectedCategory === '' || w.category?.slug === selectedCategory;

    return matchSearch && matchType && matchCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          ค้นหาสื่อและองค์ความรู้ทั้งหมด
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          ค้นหาครอบคลุมทุกโมดูล สื่อการสอน ใบงาน เกมการเรียนรู้ แผนการสอน และนวัตกรรม
        </p>
      </div>

      {/* Main Search Bar */}
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="พิมพ์คำค้นหา เช่น วิทยาการคำนวณ, Scratch, ใบงาน ป.1..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Type Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {typeFilters.map((t) => {
            const Icon = t.icon;
            const isSelected = selectedType === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setSelectedType(t.key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
        <span className="text-xs font-semibold text-slate-500">
          พบผลลัพธ์ทั้งหมด {filtered.length} รายการ
        </span>

        {/* Category filter dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
        >
          <option value="">ทุกหมวดหมู่</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Results Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <Search className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            ไม่พบข้อมูลที่ตรงกับคำค้นหา
          </h3>
          <p className="text-xs text-slate-500">
            ลองเปลี่ยนคำค้นหา หรือเลือกตัวกรองประเภทสื่ออื่น
          </p>
        </div>
      )}
    </div>
  );
}
