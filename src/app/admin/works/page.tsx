'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  ExternalLink
} from 'lucide-react';
import { getWorks, type WorkRow } from '@/services/works';
import { useToast } from '@/components/ui/toast';

const TYPE_FILTERS = [
  { value: 'all', label: 'ทั้งหมด' },
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

export default function AdminWorksPage() {
  const [works, setWorks] = useState<WorkRow[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const toast = useToast();

  useEffect(() => {
    async function loadWorks() {
      const data = await getWorks();
      setWorks(data);
    }
    loadWorks();
  }, []);

  const filteredWorks = works.filter((work) => {
    const matchesSearch = work.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (work.description && work.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === 'all' || work.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleDelete = (id: string, title: string) => {
    if (confirm(`คุณต้องการลบ "${title}" ใช่หรือไม่?`)) {
      setWorks(works.filter((w) => w.id !== id));
      toast.success('ลบข้อมูลสำเร็จ', `ลบผลงาน "${title}" เรียบร้อยแล้ว`);
    }
  };

  const getTypeLabel = (type: string) => {
    const target = TYPE_FILTERS.find((t) => t.value === type);
    return target ? target.label : type;
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            จัดการคลังผลงานและสื่อการสอน (Works Manager)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            บริหารจัดการสื่อการสอน ใบงาน แผนการจัดการเรียนรู้ นวัตกรรม และงานวิจัยทั้งหมดในระบบ
          </p>
        </div>

        <Link
          href="/admin/works/new"
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 w-fit cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>เพิ่มเนื้อหาใหม่</span>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่อผลงาน..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Type Select */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {TYPE_FILTERS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Works Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800/80 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-bold">ชื่อผลงาน / หัวข้อ</th>
                <th className="px-6 py-4 font-bold">ประเภท</th>
                <th className="px-6 py-4 font-bold">ระดับชั้น</th>
                <th className="px-6 py-4 font-bold">ยอดเข้าชม</th>
                <th className="px-6 py-4 font-bold">ยอดดาวน์โหลด</th>
                <th className="px-6 py-4 font-bold text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredWorks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    ไม่พบรายการผลงานที่ตรงกับเงื่อนไข
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
                      <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-semibold text-[11px]">
                        {getTypeLabel(work.type)}
                      </span>
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
      </div>
    </div>
  );
}
