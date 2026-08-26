'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileCode, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Globe
} from 'lucide-react';
import { getPages, deletePage, type PageRow } from '@/services/pages';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { formatDateThai } from '@/lib/utils';

export default function AdminPagesListPage() {
  const [pages, setPages] = useState<PageRow[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const toast = useToast();

  const loadPages = async () => {
    const data = await getPages();
    setPages(data);
  };

  useEffect(() => {
    let ignore = false;
    getPages().then((data) => {
      if (!ignore) {
        setPages(data);
      }
    });
    return () => {
      ignore = true;
    };
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบหน้า "${title}"?`)) {
      const res = await deletePage(id);
      if (!res.success) {
        toast.error('ลบไม่สำเร็จ', res.error || 'เกิดข้อผิดพลาดในการลบหน้าเว็บ');
        return;
      }
      toast.success('ลบหน้าเว็บสำเร็จ', `หน้า "${title}" ถูกลบเรียบร้อยแล้ว`);
      loadPages();
    }
  };

  const filtered = pages.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <FileCode className="w-4 h-4" />
            <span>Page Builder</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            จัดการหน้าเว็บ (Dynamic Pages)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            สร้างหน้าเนื้อหาใหม่ เช่น หน้าแนะนำตัว นโยบาย หรือหน้าข้อมูลพิเศษโดยไม่ต้องเขียนโค้ด
          </p>
        </div>

        <Link
          href="/admin/pages/new"
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>สร้างหน้าใหม่</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ค้นหาชื่อหน้าเว็บ หรือ Slug..."
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Pages Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-6 py-3.5">ชื่อหน้า / Slug</th>
                <th className="px-6 py-3.5">เทมเพลต</th>
                <th className="px-6 py-3.5">สถานะ</th>
                <th className="px-6 py-3.5">วันที่สร้าง</th>
                <th className="px-6 py-3.5 text-right">การกระทำ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
              {filtered.map((page) => (
                <tr key={page.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="space-y-0.5">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {page.title}
                      </span>
                      <div className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
                        <Globe className="w-3 h-3 text-slate-400" />
                        <span>/p/{page.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline">{page.template}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={page.status === 'published' ? 'success' : 'warning'}>
                      {page.status === 'published' ? 'เผยแพร่แล้ว' : 'ฉบับร่าง'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-[11px]">
                    {formatDateThai(page.created_at)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/p/${page.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                        title="ดูหน้าจริง"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/admin/pages/${page.id}`}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-blue-600 dark:text-blue-400"
                        title="แก้ไข"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(page.id, page.title)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950 text-rose-600"
                        title="ลบ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
