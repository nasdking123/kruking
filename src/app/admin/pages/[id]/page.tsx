'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Save, 
  Globe, 
  Trash2,
  ExternalLink,
  Eye,
  Edit,
  Loader2,
  FileCode,
  Sparkles
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
  const [fetching, setFetching] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
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
    let ignore = false;
    if (pageId) {
      getPageById(pageId).then((data) => {
        if (!ignore && data) {
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
          setFetching(false);
        }
      });
    }
    return () => {
      ignore = true;
    };
  }, [pageId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug) {
      toast.error('ข้อมูลไม่ครบถ้วน', 'จำเป็นต้องระบุชื่อหน้าและ Slug');
      return;
    }

    setLoading(true);
    const res = await savePage(formData as Partial<PageRow>);
    setLoading(false);

    if (!res.success) {
      toast.error('บันทึกไม่สำเร็จ', res.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      return;
    }

    toast.success('บันทึกการแก้ไขสำเร็จ', `อัปเดตหน้า "${formData.title}" เรียบร้อยแล้ว (อัปเดตหน้าบ้านเรียลไทม์ทันที)`);
    router.push('/admin/pages');
    router.refresh();
  };

  const handleDelete = async () => {
    if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบหน้า "${formData.title}"?`)) {
      const res = await deletePage(pageId);
      if (!res.success) {
        toast.error('ลบไม่สำเร็จ', res.error || 'เกิดข้อผิดพลาด');
        return;
      }
      toast.success('ลบหน้าสำเร็จ', 'ลบหน้าเว็บออกจากระบบเรียบร้อย');
      router.push('/admin/pages');
    }
  };

  if (fetching) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="text-xs text-slate-400 font-bold">กำลังโหลดข้อมูลหน้าเว็บ...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto p-4 sm:p-8 animate-in fade-in">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/pages"
            className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
              <FileCode className="w-3.5 h-3.5" />
              <span>Page Editor (Live Sync)</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              แก้ไขหน้าเว็บ: {formData.title || 'กำลังโหลด...'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {formData.slug && (
            <Link
              href={`/p/${formData.slug}`}
              target="_blank"
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
              <span>เปิดดูหน้าจริง</span>
            </Link>
          )}

          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {previewMode ? <Edit className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-emerald-600" />}
            <span>{previewMode ? 'กลับไปแก้ไข' : 'ดูตัวอย่างสด'}</span>
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="p-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 text-xs font-bold transition-colors cursor-pointer"
            title="ลบหน้านี้"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>บันทึกการแก้ไข (Real-time)</span>
          </button>
        </div>
      </div>

      {previewMode ? (
        /* Live Preview Mode */
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-6">
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>โหมดดูตัวอย่างก่อนแสดงผลจริง (Live Preview)</span>
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {formData.title}
          </h1>
          {formData.excerpt && (
            <p className="text-base text-slate-600 dark:text-slate-300">{formData.excerpt}</p>
          )}

          {formData.cover_image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={formData.cover_image}
              alt={formData.title}
              className="w-full max-h-80 object-cover rounded-2xl border border-slate-200 dark:border-slate-800"
            />
          )}

          <article className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed space-y-4">
            {formData.content?.split('\n\n').map((para, idx) => {
              if (para.startsWith('# ')) {
                return <h1 key={idx} className="text-2xl font-bold text-slate-900 dark:text-white">{para.replace('# ', '')}</h1>;
              }
              if (para.startsWith('## ')) {
                return <h2 key={idx} className="text-xl font-bold text-slate-900 dark:text-white">{para.replace('## ', '')}</h2>;
              }
              return <p key={idx} className="text-slate-700 dark:text-slate-300">{para}</p>;
            })}
          </article>
        </div>
      ) : (
        /* Edit Form Fields */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Content Form */}
          <div className="lg:col-span-2 space-y-5">
            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-900 dark:text-white text-xs">
                  ชื่อหน้า (Page Title) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="เช่น ประวัติและวิสัยทัศน์..."
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Slug (URL Address) *
                </label>
                <div className="flex items-center">
                  <span className="px-3.5 py-2.5 rounded-l-2xl bg-slate-100 dark:bg-slate-800 border border-r-0 border-slate-200 dark:border-slate-800 text-slate-500 font-mono text-xs">
                    /p/
                  </span>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-r-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  คำอธิบายย่อ (Excerpt)
                </label>
                <textarea
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="สรุปเนื้อหาสั้นๆ 1-2 ประโยค เพื่อนำไปแสดงในหัวข้อหน้าเว็บ..."
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-900 dark:text-white">
                    เนื้อหาหน้าเว็บ (รองรับ Markdown) *
                  </label>
                  <span className="text-[10px] text-slate-400"># หัวข้อ, ## หัวข้อย่อย, - รายการ</span>
                </div>
                <textarea
                  rows={14}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="พิมพ์เนื้อหาที่ต้องการนำเสนอ เช่น # หัวข้อใหญ่..."
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs leading-relaxed text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Right 1 Col: Settings & SEO */}
          <div className="space-y-5">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4 text-xs">
              <h2 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                การเผยแพร่ & รูปภาพ
              </h2>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  สถานะการแสดงผล
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="published">เผยแพร่ทันที (Published)</option>
                  <option value="draft">แบบร่าง (Draft - ยังไม่แสดง)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  รูปภาพหน้าปก (Cover Image URL)
                </label>
                <input
                  type="url"
                  value={formData.cover_image}
                  onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4 text-xs">
              <div className="flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <h2 className="font-bold text-slate-900 dark:text-white">
                  การตั้งค่า SEO & Search
                </h2>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  SEO Title
                </label>
                <input
                  type="text"
                  value={formData.seo_title}
                  onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                  placeholder="ชื่อที่จะแสดงบน Google Search..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  SEO Description
                </label>
                <textarea
                  rows={3}
                  value={formData.seo_description}
                  onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                  placeholder="คำอธิบายสำหรับ Search Engine และเวลาแชร์ลงโซเชียล..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
