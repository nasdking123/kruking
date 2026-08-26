'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  FolderOpen, 
  Trash2, 
  Save, 
  Loader2, 
  Edit, 
  ArrowUpRight, 
  FileText,
  Search
} from 'lucide-react';
import { 
  getCategoriesWithWorkCount, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  type CategoryWithCount 
} from '@/services/works';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Add form state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [sortOrder, setSortOrder] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Edit modal state
  const [editCategoryItem, setEditCategoryItem] = useState<CategoryWithCount | null>(null);
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editSortOrder, setEditSortOrder] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);

  const toast = useToast();

  const refreshData = async () => {
    setLoading(true);
    const data = await getCategoriesWithWorkCount();
    setCategories(data);
    setSortOrder(data.length + 1);
    setLoading(false);
  };

  useEffect(() => {
    let ignore = false;
    async function init() {
      const data = await getCategoriesWithWorkCount();
      if (!ignore) {
        setCategories(data);
        setSortOrder(data.length + 1);
        setLoading(false);
      }
    }
    init();
    return () => {
      ignore = true;
    };
  }, []);

  const handleNameChange = (val: string) => {
    setName(val);
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s\u0E00-\u0E7F-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(autoSlug);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;

    setSubmitting(true);
    const res = await createCategory({
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim() || undefined,
      sort_order: Number(sortOrder) || 1,
    });

    setSubmitting(false);

    if (!res.success) {
      toast.error('เพิ่มหมวดหมู่ไม่สำเร็จ', res.error || 'เกิดข้อผิดพลาดในการบันทึก');
      return;
    }

    toast.success('เพิ่มหมวดหมู่สำเร็จ', `เพิ่มหมวดหมู่ "${name}" เรียบร้อยแล้ว`);
    setName('');
    setSlug('');
    setDescription('');
    refreshData();
  };

  const openEditModal = (cat: CategoryWithCount) => {
    setEditCategoryItem(cat);
    setEditName(cat.name);
    setEditSlug(cat.slug);
    setEditDescription(cat.description || '');
    setEditSortOrder(cat.sort_order || 1);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCategoryItem || !editName.trim() || !editSlug.trim()) return;

    setSavingEdit(true);
    const res = await updateCategory(editCategoryItem.id, {
      name: editName.trim(),
      slug: editSlug.trim(),
      description: editDescription.trim() || undefined,
      sort_order: Number(editSortOrder) || 1,
    });

    setSavingEdit(false);

    if (!res.success) {
      toast.error('แก้ไขไม่สำเร็จ', res.error || 'เกิดข้อผิดพลาดในการบันทึก');
      return;
    }

    toast.success('แก้ไขสำเร็จ', `อัปเดตหมวดหมู่ "${editName}" เรียบร้อยแล้ว`);
    setIsEditModalOpen(false);
    refreshData();
  };

  const handleDelete = async (id: string, catName: string) => {
    if (confirm(`คุณต้องการลบหมวดหมู่ "${catName}" ใช่หรือไม่?`)) {
      const res = await deleteCategory(id);
      if (!res.success) {
        toast.error('ลบไม่สำเร็จ', res.error || 'เกิดข้อผิดพลาดในการลบหมวดหมู่');
        return;
      }
      toast.success('ลบสำเร็จ', `ลบหมวดหมู่ "${catName}" เรียบร้อยแล้ว`);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <FolderOpen className="w-4 h-4" />
            <span>Content Taxonomy & Categorization</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            จัดการหมวดหมู่สื่อการเรียนรู้ (Categories)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            สร้าง จัดระเบียบกลุ่มสาระการเรียนรู้ และคลิกเพื่อแยกดูผลงานในแต่ละหมวดหมู่ได้ทันที
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs font-bold text-blue-700 dark:text-blue-300">
            ทั้งหมด {categories.length} หมวดหมู่
          </div>
        </div>
      </div>

      {/* Main Grid: Form Left, Table Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 4 Cols: Add New Category Form */}
        <div className="lg:col-span-4 p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4 h-fit">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                เพิ่มหมวดหมู่ใหม่
              </h2>
              <p className="text-[11px] text-slate-400">
                ระบุชื่อและ Slug สำหรับจัดกลุ่มสื่อ
              </p>
            </div>
          </div>

          <form onSubmit={handleAddCategory} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                ชื่อหมวดหมู่ *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="เช่น วิทยาการคำนวณ ป.6"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                URL Slug * (ใช้อ้างอิงใน URL)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="cs-p6"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                ลำดับการแสดงผล (Sort Order)
              </label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                คำอธิบายหมวดหมู่
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="คำอธิบายสั้นๆ เกี่ยวกับสื่อการสอนในหมวดนี้..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !name.trim()}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>บันทึกหมวดหมู่ใหม่</span>
            </button>
          </form>
        </div>

        {/* Right 8 Cols: Categories Table with Direct View Links */}
        <div className="lg:col-span-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อหมวดหมู่, slug..."
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden">
            {loading ? (
              <div className="py-16 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span className="text-xs text-slate-400">กำลังโหลดรายการหมวดหมู่...</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-400">
                ไม่พบหมวดหมู่ที่ตรงกับการค้นหา
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-6 py-4">หมวดหมู่</th>
                      <th className="px-6 py-4">URL Slug</th>
                      <th className="px-6 py-4 text-center">จำนวนผลงาน</th>
                      <th className="px-6 py-4 text-right">การจัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filtered.map((cat) => (
                      <tr key={cat.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors group">
                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center shrink-0">
                              <FolderOpen className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="block">{cat.name}</span>
                              {cat.description && (
                                <span className="text-[11px] font-normal text-slate-400 line-clamp-1">
                                  {cat.description}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 font-mono text-slate-500">
                          <code className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px]">
                            {cat.slug}
                          </code>
                        </td>

                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[11px]">
                            <FileText className="w-3 h-3 text-slate-400" />
                            <span>{cat.workCount || 0} รายการ</span>
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Direct Navigation to Works filtered by this category */}
                            <Link
                              href={`/admin/works?category=${cat.slug || cat.id}`}
                              className="px-2.5 py-1 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 font-bold text-[11px] flex items-center gap-1 transition-colors"
                              title="เปิดดูผลงานทั้งหมดในหมวดนี้"
                            >
                              <span>ดูผลงาน</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </Link>

                            <button
                              type="button"
                              onClick={() => openEditModal(cat)}
                              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                              title="แก้ไข"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(cat.id, cat.name)}
                              className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
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
            )}
          </div>
        </div>
      </div>

      {/* Category Edit Modal */}
      {editCategoryItem && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`แก้ไขหมวดหมู่: ${editCategoryItem.name}`}
          description="ปรับปรุงชื่อหมวดหมู่ Slug และลำดับการแสดงผล"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                ชื่อหมวดหมู่ *
              </label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={editSlug}
                onChange={(e) => setEditSlug(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                ลำดับการแสดงผล (Sort Order)
              </label>
              <input
                type="number"
                value={editSortOrder}
                onChange={(e) => setEditSortOrder(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                คำอธิบาย
              </label>
              <textarea
                rows={3}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="pt-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={savingEdit}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                {savingEdit ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>บันทึกการแก้ไข</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
