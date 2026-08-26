'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  ExternalLink,
  FolderOpen,
  X,
  Loader2
} from 'lucide-react';
import { getWorks, getCategories, type WorkWithRelations, type CategoryRow } from '@/services/works';
import { useToast } from '@/components/ui/toast';

const TYPE_FILTERS = [
  { value: 'all', label: 'ทุกประเภท' },
  { value: 'resource', label: 'สื่อการสอน' },
  { value: 'worksheet', label: 'ใบงาน' },
  { value: 'game', label: 'เกม' },
  { value: 'lesson_plan', label: 'แผนการสอน' },
  { value: 'teaching', label: 'โชว์เคสการสอน' },
  { value: 'research', label: 'งานวิจัย' },
  { value: 'innovation', label: 'นวัตกรรม' },
  { value: 'award', label: 'รางวัล' },
  { value: 'activity', label: 'กิจกรรม' },
  { value: 'article', label: 'บทความ' },
];

function AdminWorksContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialType = searchParams.get('type') || 'all';

  const [works, setWorks] = useState<WorkWithRelations[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState(initialType);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [wList, cList] = await Promise.all([
        getWorks(),
        getCategories()
      ]);
      setWorks(wList);
      setCategories(cList);
      setLoading(false);
    }
    loadData();
  }, []);

  const filteredWorks = works.filter((work) => {
    const matchesSearch =
      work.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (work.description && work.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType =
      selectedType === 'all' ||
      work.type === selectedType ||
      (selectedType === 'resources' && work.type === 'resource') ||
      (selectedType === 'worksheets' && work.type === 'worksheet') ||
      (selectedType === 'games' && work.type === 'game') ||
      (selectedType === 'lesson-plans' && work.type === 'lesson_plan');

    const matchesCategory =
      selectedCategory === 'all' ||
      work.category_id === selectedCategory ||
      work.category?.slug === selectedCategory ||
      work.category?.name === selectedCategory ||
      work.type === selectedCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  const handleDelete = (id: string, title: string) => {
    if (confirm(`คุณต้องการลบ "${title}" ใช่หรือไม่?`)) {
      setWorks((prev) => prev.filter((w) => w.id !== id));
      toast.success('ลบข้อมูลสำเร็จ', `ลบผลงาน "${title}" เรียบร้อยแล้ว`);
    }
  };

  const getTypeLabel = (type: string) => {
    const target = TYPE_FILTERS.find((t) => t.value === type);
    return target ? target.label : type;
  };

  const activeCategoryObj = categories.find(
    (c) => c.slug === selectedCategory || c.id === selectedCategory
  );

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <FolderOpen className="w-4 h-4" />
            <span>Content Library & Media Repository</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            จัดการคลังผลงานและสื่อการสอน (Works Manager)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            บริหารจัดการสื่อการสอน ใบงาน แผนการจัดการเรียนรู้ นวัตกรรม และงานวิจัยทั้งหมดในระบบ
          </p>
        </div>

        <Link
          href="/admin/works/new"
          className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 w-fit cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ เพิ่มเนื้อหาใหม่</span>
        </Link>
      </div>

      {/* Active Category Filter Tag Banner (if filtered by category from another page) */}
      {selectedCategory !== 'all' && (
        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-blue-800 dark:text-blue-200">
            <FolderOpen className="w-4 h-4 text-blue-600 shrink-0" />
            <span>กำลังกรองผลงานเฉพาะหมวดหมู่: <strong className="font-extrabold">{activeCategoryObj?.name || selectedCategory}</strong></span>
          </div>
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className="px-3 py-1 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-xs hover:bg-slate-100 flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>ล้างตัวกรองหมวดหมู่</span>
          </button>
        </div>
      )}

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่อผลงาน, คำอธิบาย..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filters Row */}
        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          {/* Category Select */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-bold hidden sm:inline">หมวดหมู่:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">ทุกหมวดหมู่ ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Type Select */}
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {TYPE_FILTERS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Works Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-xs text-slate-400">กำลังโหลดรายการผลงาน...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-6 py-4">ชื่อผลงาน / หัวข้อ</th>
                  <th className="px-6 py-4">ประเภท</th>
                  <th className="px-6 py-4">หมวดหมู่</th>
                  <th className="px-6 py-4">ระดับชั้น</th>
                  <th className="px-6 py-4 font-mono">ยอดเข้าชม</th>
                  <th className="px-6 py-4 font-mono">ดาวน์โหลด</th>
                  <th className="px-6 py-4 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredWorks.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                      ไม่พบรายการผลงานที่ตรงกับเงื่อนไขการค้นหา
                    </td>
                  </tr>
                ) : (
                  filteredWorks.map((work) => (
                    <tr key={work.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2 max-w-sm truncate">
                          {work.featured && (
                            <span className="px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-bold shrink-0">
                              เด่น
                            </span>
                          )}
                          <span className="truncate">{work.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold text-[11px]">
                          {getTypeLabel(work.type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-medium">
                        {work.category?.name || '-'}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                        {work.grade_level || '-'}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-mono">
                        {(work.view_count || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-mono">
                        {(work.download_count || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/${work.type === 'lesson_plan' ? 'lesson-plans' : work.type === 'worksheet' ? 'worksheets' : work.type === 'game' ? 'games' : 'resources'}/${work.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-blue-600 transition-colors"
                            title="ดูบนหน้าเว็บ"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(work.id, work.title)}
                            className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="ลบ"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminWorksPage() {
  return (
    <Suspense fallback={
      <div className="p-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
        <span>กำลังโหลดข้อมูลผลงาน...</span>
      </div>
    }>
      <AdminWorksContent />
    </Suspense>
  );
}
