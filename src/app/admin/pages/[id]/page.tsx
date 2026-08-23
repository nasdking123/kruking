'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Save, 
  Globe, 
  Trash2,
  ExternalLink
} from 'lucide-react';
import { getPageById, savePage, deletePage } from '@/services/pages';
import type { PageRow } from '@/services/pages';
import { useToast } from '@/components/ui/toast';

export default function AdminEditPage() {
  const params = useParams();
  const pageId = params.id as string;
  const router = useRouter();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image: '',
    template: 'default',
    status: 'published',
    visibility: 'public',
    seo_title: '',
    seo_description: '',
  });

  useEffect(() => {
    if (pageId) {
      getPageById(pageId).then((data) => {
        if (data) {
          setFormData({
            id: data.id,
            title: data.title || '',
            slug: data.slug || '',
            excerpt: data.excerpt || '',
            content: data.content || '',
            cover_image: data.cover_image || '',
            template: data.template || 'default',
            status: data.status || 'published',
            visibility: data.visibility || 'public',
            seo_title: data.seo_title || '',
            seo_description: data.seo_description || '',
          });
        }
      });
    }
  }, [pageId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug) {
      toast.error('ข้อมูลไม่ครบถ้วน', 'จำเป็นต้องระบุชื่อหน้าและ Slug');
      return;
    }

    setLoading(true);
    await savePage(formData as Partial<PageRow>);
    toast.success('บันทึกการแก้ไขสำเร็จ', `อัปเดตหน้า "${formData.title}" เรียบร้อยแล้ว`);
    router.push('/admin/pages');
  };

  const handleDelete = async () => {
    if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบหน้า "${formData.title}"?`)) {
      await deletePage(pageId);
      toast.success('ลบหน้าสำเร็จ', 'ลบหน้าเว็บออกจากระบบเรียบร้อย');
      router.push('/admin/pages');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Top action bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/pages"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              แก้ไขหน้าเว็บ: {formData.title || 'กำลังโหลด...'}
            </h1>
            <p className="text-xs text-slate-500">
              ID: <span className="font-mono">{pageId}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {formData.slug && (
            <Link
              href={`/p/${formData.slug}`}
              target="_blank"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title="ดูหน้าจริงบนเว็บไซต์"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          )}

          <button
            type="button"
            onClick={handleDelete}
            className="p-2 rounded-xl border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/60 text-rose-600 transition-colors"
            title="ลบหน้านี้"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}</span>
          </button>
        </div>
      </div>

      {/* Main Form Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-900 dark:text-white text-xs">
                ชื่อหน้า (Page Title) *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Slug (URL Address) *
              </label>
              <div className="flex items-center">
                <span className="px-3 py-2 rounded-l-xl bg-slate-100 dark:bg-slate-800 border border-r-0 border-slate-200 dark:border-slate-800 text-slate-500 font-mono text-xs">
                  /p/
                </span>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="flex-1 px-3.5 py-2 rounded-r-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                คำโปรย / ข้อมูลย่อ (Excerpt)
              </label>
              <textarea
                rows={2}
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                เนื้อหาหน้าเว็บ (Content / Markdown) *
              </label>
              <textarea
                rows={12}
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs leading-relaxed text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Settings & SEO */}
        <div className="space-y-5">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 dark:text-white">
              ตั้งค่าหน้าเว็บ (Settings)
            </h3>

            <div className="space-y-1">
              <label className="text-slate-600 dark:text-slate-400 font-semibold">เทมเพลต (Template)</label>
              <select
                value={formData.template}
                onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="default">Default (มาตรฐาน)</option>
                <option value="landing">Landing Page (หน้าแรก)</option>
                <option value="article">Article (บทความ)</option>
                <option value="portfolio">Portfolio (ผลงาน)</option>
                <option value="resource">Resource (สื่อการสอน)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-600 dark:text-slate-400 font-semibold">สถานะการเผยแพร่</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="published">เผยแพร่ (Published)</option>
                <option value="draft">ฉบับร่าง (Draft)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-600 dark:text-slate-400 font-semibold">รูปภาพหน้าปก (Cover Image URL)</label>
              <input
                type="url"
                value={formData.cover_image}
                onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-blue-500" />
              <span>การตั้งค่า SEO & Social</span>
            </h3>

            <div className="space-y-1">
              <label className="text-slate-600 dark:text-slate-400 font-semibold">SEO Title</label>
              <input
                type="text"
                value={formData.seo_title}
                onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-600 dark:text-slate-400 font-semibold">SEO Description</label>
              <textarea
                rows={3}
                value={formData.seo_description}
                onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
