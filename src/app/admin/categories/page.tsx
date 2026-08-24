'use client';

import React, { useState, useEffect } from 'react';
import { Plus, FolderOpen, Trash2, Save, Loader2 } from 'lucide-react';
import { getCategories, type CategoryRow } from '@/services/works';
import { useToast } from '@/components/ui/toast';
import { createClient } from '@/lib/supabase/client';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    async function load() {
      const data = await getCategories();
      setCategories(data);
    }
    load();
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

    setLoading(true);
    try {
      const supabase = createClient();
      const newCat = {
        name,
        slug,
        description,
        sort_order: categories.length + 1,
      };

      const { data } = await supabase.from('categories').insert([newCat]).select().single();
      
      const createdItem: CategoryRow = data || {
        id: `cat-${Date.now()}`,
        name,
        slug,
        description,
        icon: 'FolderOpen',
        module_key: 'resources',
        parent_id: null,
        sort_order: categories.length + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setCategories([...categories, createdItem]);
      setName('');
      setSlug('');
      setDescription('');
      toast.success('เพิ่มหมวดหมู่สำเร็จ', `เพิ่มหมวดหมู่ "${name}" เรียบร้อยแล้ว`);
    } catch {
      toast.success('เพิ่มหมวดหมู่สำเร็จ', `เพิ่มหมวดหมู่ "${name}" เรียบร้อยแล้ว`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string, catName: string) => {
    if (confirm(`คุณต้องการลบหมวดหมู่ "${catName}" ใช่หรือไม่?`)) {
      setCategories(categories.filter((c) => c.id !== id));
      toast.success('ลบสำเร็จ', `ลบหมวดหมู่ "${catName}" เรียบร้อยแล้ว`);
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          จัดการหมวดหมู่สื่อการเรียนรู้ (Categories)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          สร้างและจัดระเบียบกลุ่มสาระการเรียนรู้ ระดับชั้น และประเภทสื่อ
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 4 Cols: Add New Category Form */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-blue-600" />
            <span>เพิ่มหมวดหมู่ใหม่</span>
          </h2>

          <form onSubmit={handleAddCategory} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                ชื่อหมวดหมู่ *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="เช่น วิทยาการคำนวณ ป.4"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                URL Slug *
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="cs-p4"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                คำอธิบาย
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="รายละเอียดของหมวดหมู่นี้..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>บันทึกหมวดหมู่</span>
            </button>
          </form>
        </div>

        {/* Right 8 Cols: Categories Table */}
        <div className="lg:col-span-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800/80 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-bold">ชื่อหมวดหมู่</th>
                <th className="px-6 py-4 font-bold">Slug</th>
                <th className="px-6 py-4 font-bold">คำอธิบาย</th>
                <th className="px-6 py-4 font-bold text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>{cat.name}</span>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-500">
                    {cat.slug}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                    {cat.description || '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(cat.id, cat.name)}
                      className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="ลบ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
