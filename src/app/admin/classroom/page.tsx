'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  School, 
  Plus, 
  Trash2, 
  PlayCircle, 
  BookOpen, 
  ExternalLink,
  KeyRound,
  Loader2
} from 'lucide-react';
import { getClassrooms, type ClassroomWithLessons } from '@/services/classroom';
import { YouTubePlayer } from '@/components/common/youtube-player';
import { getYouTubeThumbnail } from '@/lib/youtube';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/toast';

export default function AdminClassroomManagerPage() {
  const toast = useToast();
  const [classrooms, setClassrooms] = useState<ClassroomWithLessons[]>([]);
  const [selectedClassroomId, setSelectedClassroomId] = useState<string | null>(null);

  // New Classroom Form Modal
  const [showAddClass, setShowAddClass] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newGrade, setNewGrade] = useState('ประถมศึกษาปีที่ 6');
  const [newSubject, setNewSubject] = useState('ประวัติศาสตร์');
  const [newJoinCode, setNewJoinCode] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCover, setNewCover] = useState('https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop');

  // New Lesson Form Modal
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDesc, setLessonDesc] = useState('');
  const [lessonVideoUrl, setLessonVideoUrl] = useState('');
  const [lessonContent, setLessonContent] = useState('');
  const [savingLesson, setSavingLesson] = useState(false);

  useEffect(() => {
    let ignore = false;
    getClassrooms().then((data) => {
      if (!ignore) {
        setClassrooms(data);
        if (data.length > 0) {
          setSelectedClassroomId((prev) => prev || data[0].id);
        }
      }
    });
    return () => {
      ignore = true;
    };
  }, []);

  const refreshData = async () => {
    const data = await getClassrooms();
    setClassrooms(data);
    if (data.length > 0 && !selectedClassroomId) {
      setSelectedClassroomId(data[0].id);
    }
  };

  const selectedClassroom = classrooms.find((c) => c.id === selectedClassroomId) || classrooms[0] || null;

  // Create Classroom
  const handleCreateClassroom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const supabase = createClient();
    const slug = newTitle
      .toLowerCase()
      .trim()
      .replace(/[^\w\s\u0E00-\u0E7F-]/g, '')
      .replace(/[\s_-]+/g, '-') || `class-${Date.now()}`;

    const { data: created, error } = await supabase
      .from('classrooms')
      .insert([{
        title: newTitle.trim(),
        slug,
        grade_level: newGrade,
        subject: newSubject,
        join_code: newJoinCode.trim().toUpperCase() || `CLS${Math.floor(100 + Math.random() * 900)}`,
        description: newDesc.trim() || null,
        cover_image: newCover.trim() || null,
        status: 'active',
        visibility: 'public'
      }])
      .select()
      .single();

    if (error) {
      toast.error('ไม่สามารถสร้างห้องเรียนได้', error.message);
      return;
    }

    toast.success('สร้างห้องเรียนสำเร็จ', `สร้างห้อง "${created.title}" เรียบร้อย`);
    setShowAddClass(false);
    setNewTitle('');
    setNewDesc('');
    setNewJoinCode('');
    setSelectedClassroomId(created.id);
    await refreshData();
  };

  // Create Lesson with YouTube Link
  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassroom || !lessonTitle.trim()) return;

    setSavingLesson(true);
    const supabase = createClient();

    const { error } = await supabase
      .from('lessons')
      .insert([{
        classroom_id: selectedClassroom.id,
        title: lessonTitle.trim(),
        description: lessonDesc.trim() || null,
        video_url: lessonVideoUrl.trim() || null,
        content: lessonContent.trim() || null,
        sort_order: (selectedClassroom.lessons?.length || 0) + 1,
        duration_minutes: 15,
        is_published: true,
      }]);

    setSavingLesson(false);

    if (error) {
      toast.error('ไม่สามารถเพิ่มบทเรียนได้', error.message);
      return;
    }

    toast.success('เพิ่มบทเรียน YouTube สำเร็จ', `เพิ่มบทเรียน "${lessonTitle}" เรียบร้อย`);
    setShowAddLesson(false);
    setLessonTitle('');
    setLessonDesc('');
    setLessonVideoUrl('');
    setLessonContent('');
    await refreshData();
  };

  // Delete Lesson
  const handleDeleteLesson = async (lessonId: string, lsnTitle: string) => {
    if (!confirm(`คุณต้องการลบบทเรียน "${lsnTitle}" ใช่หรือไม่?`)) return;

    const supabase = createClient();
    const { error } = await supabase.from('lessons').delete().eq('id', lessonId);
    if (error) {
      toast.error('ไม่สามารถลบบทเรียนได้', error.message);
    } else {
      toast.success('ลบบทเรียนสำเร็จ', `ลบ "${lsnTitle}" เรียบร้อย`);
      await refreshData();
    }
  };

  // Delete Classroom
  const handleDeleteClassroom = async (classId: string, classTitle: string) => {
    if (!confirm(`คุณต้องการลบห้องเรียน "${classTitle}" และบทเรียนทั้งหมดในห้องนี้ใช่หรือไม่?`)) return;

    const supabase = createClient();
    const { error } = await supabase.from('classrooms').delete().eq('id', classId);
    if (error) {
      toast.error('ไม่สามารถลบห้องเรียนได้', error.message);
    } else {
      toast.success('ลบห้องเรียนสำเร็จ', `ลบ "${classTitle}" เรียบร้อย`);
      setSelectedClassroomId(null);
      await refreshData();
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <School className="w-7 h-7 text-blue-600" />
            <span>จัดการห้องเรียนออนไลน์ & คลิปบทเรียน YouTube</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            สร้างห้องเรียน เพิ่มสารบัญบทเรียน และแปะคลิปวิดีโอจาก YouTube ให้นักเรียนเข้าเรียนออนไลน์ได้ทันที
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddClass(true)}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>+ สร้างห้องเรียนใหม่</span>
        </button>
      </div>

      {/* 2. Modal: Create Classroom */}
      {showAddClass && (
        <form onSubmit={handleCreateClassroom} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-blue-500 shadow-xl space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <School className="w-4 h-4 text-blue-600" />
              <span>สร้างห้องเรียนออนไลน์ใหม่</span>
            </h3>
            <button type="button" onClick={() => setShowAddClass(false)} className="text-xs text-slate-400 hover:text-slate-600">
              ยกเลิก
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">ชื่อวิชา / ห้องเรียน *</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="เช่น ประวัติศาสตร์ ป.6 หรือ โค้ดดิ้งสร้างสรรค์..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">ระดับชั้น</label>
              <input
                type="text"
                value={newGrade}
                onChange={(e) => setNewGrade(e.target.value)}
                placeholder="เช่น ประถมศึกษาปีที่ 6"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">กลุ่มสาระการเรียนรู้</label>
              <input
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="เช่น สังคมศึกษา, วิทยาศาสตร์และเทคโนโลยี..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">รหัสเข้าร่วมห้องเรียน (Join Code)</label>
              <input
                type="text"
                value={newJoinCode}
                onChange={(e) => setNewJoinCode(e.target.value.toUpperCase())}
                placeholder="เช่น HIST601 (ไม่ใส่ระบบจะสุ่มให้อัตโนมัติ)"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono uppercase text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">URL ภาพหน้าปกห้องเรียน</label>
            <input
              type="text"
              value={newCover}
              onChange={(e) => setNewCover(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">คำอธิบายห้องเรียน</label>
            <textarea
              rows={2}
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="สรุปเนื้อหาและวัตถุประสงค์ของห้องเรียนนี้..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setShowAddClass(false)} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
              ยกเลิก
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-xs cursor-pointer">
              บันทึกสร้างห้องเรียน
            </button>
          </div>
        </form>
      )}

      {/* 3. Classrooms List Pills */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
          เลือกห้องเรียนที่ต้องการจัดการ (Select Classroom)
        </label>
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {classrooms.map((cls) => {
            const isSelected = selectedClassroom?.id === cls.id;
            return (
              <button
                key={cls.id}
                type="button"
                onClick={() => setSelectedClassroomId(cls.id)}
                className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2.5 whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 scale-[1.02]'
                    : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <School className="w-4 h-4" />
                <div className="text-left">
                  <div>{cls.title}</div>
                  <div className={`text-[10px] font-medium ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                    {cls.grade_level} • {cls.lessons?.length || 0} บทเรียน
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Selected Classroom Dashboard & Lessons Manager */}
      {selectedClassroom && (
        <div className="space-y-6">
          {/* Classroom Header Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-md bg-white/10 text-xs font-semibold text-blue-200">
                  {selectedClassroom.grade_level}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-blue-500/30 text-xs font-semibold">
                  {selectedClassroom.subject}
                </span>
                {selectedClassroom.join_code && (
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-400/20 text-amber-300 text-xs font-mono font-bold flex items-center gap-1">
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Join Code: {selectedClassroom.join_code}</span>
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold">
                {selectedClassroom.title}
              </h2>
              <p className="text-xs text-slate-300 max-w-2xl font-normal">
                {selectedClassroom.description}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/classroom/${selectedClassroom.slug}`}
                target="_blank"
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold backdrop-blur-xs transition-colors flex items-center gap-1.5"
              >
                <ExternalLink className="w-4 h-4" />
                <span>ดูหน้านักเรียน</span>
              </Link>
              <button
                type="button"
                onClick={() => setShowAddLesson(true)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ แปะคลิป/เพิ่มบทเรียน</span>
              </button>
              <button
                type="button"
                onClick={() => handleDeleteClassroom(selectedClassroom.id, selectedClassroom.title)}
                className="p-2.5 rounded-xl bg-rose-600/30 hover:bg-rose-600 text-rose-200 hover:text-white transition-colors cursor-pointer"
                title="ลบห้องเรียนนี้"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal: Add YouTube Lesson */}
          {showAddLesson && (
            <form onSubmit={handleCreateLesson} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-blue-500 shadow-xl space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-rose-600" />
                  <span>เพิ่มบทเรียนใหม่และแปะคลิป YouTube (Add YouTube Lesson)</span>
                </h3>
                <button type="button" onClick={() => setShowAddLesson(false)} className="text-xs text-slate-400 hover:text-slate-600">
                  ยกเลิก
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  ชื่อบทเรียน (Lesson Title) *
                </label>
                <input
                  type="text"
                  required
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  placeholder={`เช่น บทที่ ${(selectedClassroom.lessons?.length || 0) + 1}: การสถาปนากรุงรัตนโกสินทร์...`}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  ลิงก์คลิปวิดีโอจาก YouTube (YouTube Video URL) 🎬
                </label>
                <input
                  type="text"
                  value={lessonVideoUrl}
                  onChange={(e) => setLessonVideoUrl(e.target.value)}
                  placeholder="เช่น https://www.youtube.com/watch?v=... หรือ https://youtu.be/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  * รองรับทุกลิงก์ YouTube ทั้งแบบ watch?v=, youtu.be, shorts หรือโค้ด iframe
                </p>

                {/* Live YouTube Preview in Modal */}
                {lessonVideoUrl && (
                  <div className="mt-3 max-w-md">
                    <span className="text-[11px] font-bold text-slate-500 block mb-1">
                      ตัวอย่างคลิปวิดีโอ (Live YouTube Preview):
                    </span>
                    <YouTubePlayer url={lessonVideoUrl} title="Live Preview" />
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  คำอธิบายสรุปบทเรียนย่อ
                </label>
                <input
                  type="text"
                  value={lessonDesc}
                  onChange={(e) => setLessonDesc(e.target.value)}
                  placeholder="สรุปเนื้อหาสำคัญหรือผลการเรียนรู้ที่คาดหวังในคลิปนี้..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  เนื้อหาบทเรียน / บันทึกการสอน (Content Notes)
                </label>
                <textarea
                  rows={4}
                  value={lessonContent}
                  onChange={(e) => setLessonContent(e.target.value)}
                  placeholder="พิมพ์เนื้อหาการสอน ข้อควรจำ หรือขั้นตอนกิจกรรม (รองรับ Markdown)..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddLesson(false)} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={savingLesson}
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  {savingLesson ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
                  <span>บันทึกบทเรียน YouTube</span>
                </button>
              </div>
            </form>
          )}

          {/* Lessons List in Classroom */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>รายการบทเรียนทั้งหมด ({selectedClassroom.lessons?.length || 0} บทเรียน)</span>
              </h3>
            </div>

            {(!selectedClassroom.lessons || selectedClassroom.lessons.length === 0) ? (
              <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-center space-y-3">
                <PlayCircle className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-500 font-semibold">ยังไม่มีบทเรียนในห้องนี้</p>
                <button
                  type="button"
                  onClick={() => setShowAddLesson(true)}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs hover:bg-blue-700"
                >
                  + เพิ่มคลิปบทเรียนแรก
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedClassroom.lessons.map((lsn, idx) => {
                  const ytThumb = getYouTubeThumbnail(lsn.video_url);

                  return (
                    <div
                      key={lsn.id}
                      className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start sm:items-center gap-4 min-w-0">
                        {ytThumb ? (
                          <div className="relative w-28 h-18 rounded-2xl overflow-hidden bg-slate-950 shrink-0 border border-slate-200 dark:border-slate-800">
                            <Image
                              src={ytThumb}
                              alt={lsn.title}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                              <PlayCircle className="w-6 h-6 text-white drop-shadow-md" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shrink-0 text-sm">
                            {idx + 1}
                          </div>
                        )}

                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                              บทที่ {lsn.sort_order || idx + 1}
                            </span>
                            {lsn.video_url && (
                              <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1">
                                <PlayCircle className="w-3 h-3" />
                                <span>YouTube Linked</span>
                              </span>
                            )}
                          </div>

                          <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {lsn.title}
                          </h4>

                          {lsn.video_url && (
                            <p className="text-[11px] text-slate-400 font-mono truncate max-w-md">
                              {lsn.video_url}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          href={`/classroom/${selectedClassroom.slug}/lessons/${lsn.id}`}
                          target="_blank"
                          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-600 hover:text-blue-600 transition-colors"
                          title="ดูคลิปบทเรียน"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDeleteLesson(lsn.id, lsn.title)}
                          className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                          title="ลบบทเรียนนี้"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
