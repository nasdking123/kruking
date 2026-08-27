'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Save, 
  Sparkles, 
  FolderOpen, 
  FileText, 
  Gamepad2, 
  BookOpen, 
  GraduationCap, 
  Trophy, 
  Camera, 
  Newspaper,
  Presentation,
  UploadCloud,
  Loader2,
  Check,
  Video,
  Eye,
  ExternalLink,
  Trash2
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/toast';
import { getCategories, getWorkById, type CategoryRow } from '@/services/works';
import { saveWorkAction, deleteWorkAction } from '@/actions/work-actions';
import { parseDocumentUrl } from '@/lib/document-utils';
import { getYouTubeEmbedUrl } from '@/lib/youtube';

const DEFAULT_WORK_TYPES = [
  { value: 'resource', label: 'สื่อการสอน (Resource)', icon: FolderOpen },
  { value: 'worksheet', label: 'ใบงาน/แบบฝึกหัด (Worksheet)', icon: FileText },
  { value: 'game', label: 'เกมการศึกษา (Game & Unplugged)', icon: Gamepad2 },
  { value: 'lesson_plan', label: 'แผนการสอน 5E (Lesson Plan)', icon: BookOpen },
  { value: 'award', label: 'เกียรติบัตร / รางวัล (Certificate & Award)', icon: Trophy },
  { value: 'teaching', label: 'โชว์เคสการสอน (Teaching Showcase)', icon: Presentation },
  { value: 'research', label: 'งานวิจัยในชั้นเรียน (Research)', icon: GraduationCap },
  { value: 'innovation', label: 'นวัตกรรมการศึกษา (Innovation)', icon: Sparkles },
  { value: 'activity', label: 'ภาพกิจกรรม / อบรม (Activity & Training)', icon: Camera },
  { value: 'article', label: 'บทความวิชาการ (Article)', icon: Newspaper },
];

const DEFAULT_GRADE_LEVELS = [
  'ประถมศึกษาปีที่ 1',
  'ประถมศึกษาปีที่ 2',
  'ประถมศึกษาปีที่ 3',
  'ประถมศึกษาปีที่ 4',
  'ประถมศึกษาปีที่ 5',
  'ประถมศึกษาปีที่ 6',
  'มัธยมศึกษาปีที่ 1',
  'มัธยมศึกษาปีที่ 2',
  'มัธยมศึกษาปีที่ 3',
  'มัธยมศึกษาตอนปลาย',
  'สำหรับครูและบุคลากรทางการศึกษา',
  'ทุกระดับชั้น / ทั่วไป',
];

const SUGGESTED_SUBJECTS = [
  'วิทยาการคำนวณ',
  'วิทยาศาสตร์และเทคโนโลยี',
  'คณิตศาสตร์',
  'ภาษาไทย',
  'ภาษาอังกฤษ',
  'การงานอาชีพ',
  'ศิลปะ / ดนตรี',
  'กิจกรรมพัฒนาผู้เรียน / แนะแนว',
  'พัฒนาวิชาชีพครู / ว.PA'
];

export default function EditWorkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const toast = useToast();

  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  
  // Type selection & custom type
  const [type, setType] = useState('resource');
  const [customType, setCustomType] = useState('');
  const [isCustomType, setIsCustomType] = useState(false);

  // Category selection & quick new category
  const [categoryId, setCategoryId] = useState('');
  const [showNewCatInput, setShowNewCatInput] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [savingCat, setSavingCat] = useState(false);

  // Grade level selection & custom grade
  const [gradeLevel, setGradeLevel] = useState('ประถมศึกษาปีที่ 6');
  const [customGrade, setCustomGrade] = useState('');
  const [isCustomGrade, setIsCustomGrade] = useState(false);

  // Subject
  const [subject, setSubject] = useState('วิทยาการคำนวณ');

  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [featured, setFeatured] = useState(false);

  useEffect(() => {
    async function loadData() {
      setFetching(true);
      try {
        const [cats, work] = await Promise.all([
          getCategories(),
          getWorkById(id),
        ]);

        setCategories(cats);

        if (work) {
          setTitle(work.title || '');
          setSlug(work.slug || '');
          
          const standardType = DEFAULT_WORK_TYPES.find((t) => t.value === work.type);
          if (standardType) {
            setType(work.type);
            setIsCustomType(false);
          } else {
            setType('resource');
            setCustomType(work.type || '');
            setIsCustomType(true);
          }

          setCategoryId(work.category_id || (cats.length > 0 ? cats[0].id : ''));
          
          if (DEFAULT_GRADE_LEVELS.includes(work.grade_level || '')) {
            setGradeLevel(work.grade_level || 'ประถมศึกษาปีที่ 6');
            setIsCustomGrade(false);
          } else if (work.grade_level) {
            setGradeLevel('ประถมศึกษาปีที่ 6');
            setCustomGrade(work.grade_level);
            setIsCustomGrade(true);
          }

          setSubject(work.subject || 'วิทยาการคำนวณ');
          setDescription(work.description || '');
          setContent(work.content || '');
          setCoverImage(work.cover_image || '');
          setFileUrl(work.details?.file_url ? String(work.details.file_url) : '');
          setYoutubeUrl(work.details?.youtube_url ? String(work.details.youtube_url) : '');
          setFeatured(Boolean(work.featured));
        } else {
          toast.error('ไม่พบข้อมูลผลงานนี้', 'อาจถูกลบหรือไม่มีอยู่ในระบบ');
          router.push('/admin/works');
        }
      } catch (err) {
        console.error('Load work error:', err);
      } finally {
        setFetching(false);
      }
    }

    loadData();
  }, [id, router, toast]);

  // Quick Add New Category Inline
  const handleCreateNewCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setSavingCat(true);
    try {
      const supabase = createClient();
      const catSlug = newCatName
        .toLowerCase()
        .trim()
        .replace(/[^\w\s\u0E00-\u0E7F-]/g, '')
        .replace(/[\s_-]+/g, '-') || `cat-${Date.now()}`;

      const newCategoryObj = {
        name: newCatName.trim(),
        slug: catSlug,
        sort_order: categories.length + 1,
      };

      const { data, error } = await supabase
        .from('categories')
        .insert([newCategoryObj])
        .select()
        .single();

      if (error) {
        console.error('Category insert error:', error);
      }

      const createdCat: CategoryRow = data || {
        id: `cat-${Date.now()}`,
        name: newCatName.trim(),
        slug: catSlug,
        description: null,
        icon: 'FolderOpen',
        module_key: 'resources',
        parent_id: null,
        sort_order: categories.length + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setCategories((prev) => [...prev, createdCat]);
      setCategoryId(createdCat.id);
      setNewCatName('');
      setShowNewCatInput(false);
      toast.success('เพิ่มหมวดหมู่ใหม่สำเร็จ', `หมวดหมู่ "${createdCat.name}" พร้อมใช้งานทันที`);
    } catch {
      toast.error('ไม่สามารถบันทึกหมวดหมู่ได้', 'โปรดลองอีกครั้ง');
    } finally {
      setSavingCat(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      toast.error('กรุณากรอกข้อมูลให้ครบถ้วน', 'ชื่อหัวข้อและ URL Slug จำเป็นต้องระบุ');
      return;
    }

    setLoading(true);
    try {
      const finalType = isCustomType && customType.trim() ? customType.trim() : type;
      const finalGrade = isCustomGrade && customGrade.trim() ? customGrade.trim() : gradeLevel;

      const res = await saveWorkAction({
        id,
        title: title.trim(),
        slug: slug.trim(),
        type: finalType,
        category_id: categoryId || null,
        grade_level: finalGrade,
        subject: subject || 'ทั่วไป',
        description: description.trim() || null,
        content: content || '',
        cover_image: coverImage || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop',
        file_url: fileUrl || null,
        youtube_url: youtubeUrl || null,
        featured,
      });

      if (!res.success) {
        toast.error('เกิดข้อผิดพลาดในการบันทึก', res.error || 'โปรดลองอีกครั้ง');
        setLoading(false);
        return;
      }

      toast.success(
        'อัปเดตสื่อการสอนสำเร็จ',
        'การแก้ไขข้อมูลและไฟล์ของคุณถูกบันทึกและแสดงผลทันที'
      );

      router.push('/admin/works');
      router.refresh();
    } catch (err: unknown) {
      console.error('Save error:', err);
      toast.error('เกิดข้อผิดพลาด', (err as Error).message || 'โปรดลองอีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`ยืนยันการลบผลงาน "${title}" หรือไม่?`)) return;
    setLoading(true);
    try {
      await deleteWorkAction(id);
      toast.success('ลบผลงานเรียบร้อยแล้ว');
      router.push('/admin/works');
      router.refresh();
    } catch {
      toast.error('เกิดข้อผิดพลาดในการลบ');
    } finally {
      setLoading(false);
    }
  };

  // Real-time document embed preview
  const docInfo = parseDocumentUrl(fileUrl);
  const ytEmbedUrl = getYouTubeEmbedUrl(youtubeUrl);

  if (fetching) {
    return (
      <div className="min-h-[450px] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="text-xs text-slate-500 font-semibold">กำลังโหลดข้อมูลผลงาน...</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 sm:p-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/works"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              แก้ไขสื่อการสอน / ผลงาน (Edit Work)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              แก้ไขเนื้อหา แนบไฟล์ PDF หรือวิดีโอ YouTube พร้อมพรีวิวแบบเรียลไทม์
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="p-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-rose-600 text-xs font-bold transition-colors cursor-pointer"
            title="ลบผลงานนี้"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !title.trim()}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>บันทึกการแก้ไข</span>
          </button>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Main Form Inputs */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Title & Slug */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                ชื่อผลงาน / หัวข้อสื่อการเรียนรู้ *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="เช่น รู้จักสัญลักษณ์ Flowchart..."
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                URL Slug (สำหรับเปิดดูบนหน้าเว็บ) *
              </label>
              <div className="flex items-center">
                <span className="px-3 py-2.5 bg-slate-100 dark:bg-slate-800 border border-r-0 border-slate-200 dark:border-slate-800 rounded-l-xl text-xs font-mono text-slate-500">
                  /
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="รู้จักสัญลักษณ์-flowchart"
                  required
                  className="w-full px-4 py-2.5 rounded-r-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                คำอธิบายโดยย่อ (Excerpt)
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="อธิบายจุดเด่น วัตถุประสงค์ หรือประโยชน์ของสื่อชิ้นนี้สั้นๆ..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 2. REAL-TIME PDF & YOUTUBE ATTACHMENT BOXES */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <UploadCloud className="w-4 h-4 text-blue-500" />
                <span>ไฟล์แนบและสื่อประกอบ (PDF & YouTube Live Preview)</span>
              </h3>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                แสดงผลพรีวิวเรียลไทม์
              </span>
            </div>

            {/* 2.1 Google Drive / PDF Link Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-500" />
                <span>ลิงก์ Google Drive PDF / ไฟล์ PDF ดาวน์โหลด</span>
              </label>
              <input
                type="text"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/... หรือ https://.../file.pdf"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-[10px] text-slate-400">
                รองรับลิงก์แชร์จาก Google Drive, Canva, OneDrive หรือ Direct PDF URL
              </p>

              {/* LIVE PDF PREVIEW BOX */}
              {docInfo && docInfo.isEmbeddable && docInfo.embedUrl && (
                <div className="mt-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-blue-200/80 dark:border-blue-900/60 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      <span>ตัวอย่างหน้าเอกสาร PDF (Real-time Preview)</span>
                    </span>
                    <a
                      href={docInfo.viewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <span>เปิดลิงก์</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="w-full h-80 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white shadow-inner">
                    <iframe
                      src={docInfo.embedUrl}
                      title="PDF Preview"
                      className="w-full h-full border-0"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 2.2 YouTube Video Link Input */}
            <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Video className="w-4 h-4 text-rose-500" />
                <span>ลิงก์วิดีโอ YouTube ประกอบการสอน</span>
              </label>
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... หรือ https://youtu.be/..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />

              {/* LIVE YOUTUBE PREVIEW BOX */}
              {ytEmbedUrl && (
                <div className="mt-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-rose-200/80 dark:border-rose-900/60 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      <span>ตัวอย่างวิดีโอ YouTube (Real-time Preview)</span>
                    </span>
                  </div>
                  <div className="w-full max-w-lg aspect-video rounded-xl overflow-hidden border border-slate-800 shadow-md bg-black mx-auto">
                    <iframe
                      src={ytEmbedUrl}
                      title="YouTube Preview"
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3. Rich Markdown Content */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                เนื้อหาฉบับเต็มและคู่มือ (Markdown / ตาราง / รูบริกส์)
              </label>
              <span className="text-[11px] text-slate-400">
                รองรับหัวข้อ ตาราง (|...|) และรายการ
              </span>
            </div>
            <textarea
              rows={14}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="## รายละเอียดและขั้นตอนการจัดกิจกรรม&#10;&#10;| จุดประสงค์ | วิธีวัดผล |&#10;|---|---|&#10;| ความเข้าใจ | แบบทดสอบ |"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Right 4 Cols: Meta & Dynamic Settings */}
        <div className="lg:col-span-4 space-y-6">
          {/* Box 1: Type, Category, Grade, Subject */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-5">
            {/* 1.1 Type */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  ประเภทของผลงาน (Type) *
                </label>
                <button
                  type="button"
                  onClick={() => setIsCustomType(!isCustomType)}
                  className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
                >
                  {isCustomType ? 'เลือกจากรายการ' : '+ กำหนดเอง'}
                </button>
              </div>

              {!isCustomType ? (
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {DEFAULT_WORK_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value)}
                  placeholder="พิมพ์ประเภทที่ต้องการ..."
                  className="w-full px-4 py-2.5 rounded-xl border border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-950/50 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>

            {/* 1.2 Category (With Instant Inline Add Modal) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  หมวดหมู่หลัก (Category)
                </label>
                <button
                  type="button"
                  onClick={() => setShowNewCatInput(!showNewCatInput)}
                  className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
                >
                  {showNewCatInput ? 'ยกเลิก' : '+ เพิ่มหมวดหมู่ใหม่'}
                </button>
              </div>

              {showNewCatInput ? (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
                  <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 block">
                    สร้างหมวดหมู่ใหม่ในฐานข้อมูล
                  </span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      placeholder="เช่น อบรมวิชาชีพครู 2568..."
                      className="flex-1 px-3 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={handleCreateNewCategory}
                      disabled={savingCat || !newCatName.trim()}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-1 cursor-pointer"
                    >
                      {savingCat ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                      <span>เพิ่ม</span>
                    </button>
                  </div>
                </div>
              ) : (
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* 1.3 Grade Level */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  ระดับชั้นผู้เรียน
                </label>
                <button
                  type="button"
                  onClick={() => setIsCustomGrade(!isCustomGrade)}
                  className="text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-0.5"
                >
                  {isCustomGrade ? 'เลือกจากรายการ' : '+ กำหนดเอง'}
                </button>
              </div>

              {!isCustomGrade ? (
                <select
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {DEFAULT_GRADE_LEVELS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={customGrade}
                  onChange={(e) => setCustomGrade(e.target.value)}
                  placeholder="เช่น อนุบาล 3, บุคคลทั่วไป..."
                  className="w-full px-4 py-2.5 rounded-xl border border-purple-300 dark:border-purple-700 bg-purple-50/50 dark:bg-purple-950/50 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              )}
            </div>

            {/* 1.4 Subject & Quick Chips */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                กลุ่มสาระการเรียนรู้ / วิชา
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="เช่น วิทยาการคำนวณ"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              />
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_SUBJECTS.map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setSubject(sub)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-colors cursor-pointer ${
                      subject === sub
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Box 2: Cover Image & Feature Toggle */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                URL รูปภาพหน้าปก (Cover Image)
              </label>
              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {coverImage && (
                <div className="mt-2 rounded-xl overflow-hidden aspect-16/9 border border-slate-200 dark:border-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  ปักหมุดผลงานเด่น (Featured)
                </span>
                <span className="text-[11px] text-slate-400">
                  แสดงในส่วนไฮไลต์หน้าแรก
                </span>
              </div>
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Save Action Button */}
          <button
            type="submit"
            disabled={loading || !title.trim()}
            className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>บันทึกการแก้ไขทันที</span>
          </button>
        </div>
      </form>
    </div>
  );
}
