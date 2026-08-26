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
  Loader2,
  Globe,
  Lock
} from 'lucide-react';
import { 
  getClassrooms, 
  createLessonForClassroom, 
  isClassroomPublic,
  updateClassroomAccessType,
  type ClassroomWithLessons 
} from '@/services/classroom';
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
  const [newCourseType, setNewCourseType] = useState<'public' | 'enrolled'>('public');
  const [newEstimatedHours, setNewEstimatedHours] = useState(6);
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

  // Change Course Access Type (Public / Enrolled)
  const handleToggleAccessType = async (courseType: 'public' | 'enrolled') => {
    if (!selectedClassroom) return;

    const res = await updateClassroomAccessType({
      classroomId: selectedClassroom.id,
      courseType,
      estimatedHours: selectedClassroom.estimated_hours || 6,
    });

    if (!res.success) {
      toast.error('ไม่สามารถเปลี่ยนประเภทคอร์สได้', res.error || 'เกิดข้อผิดพลาด');
      return;
    }

    toast.success(
      'เปลี่ยนประเภทคอร์สสำเร็จ!',
      courseType === 'public'
        ? 'วิชานี้เป็นคอร์สสาธารณะ (ทุกคนเข้าเรียนได้ ไม่ต้องล็อกอิน)'
        : 'วิชานี้เป็นคอร์สในชั้นเรียน (ต้องล็อกอิน เพื่อเก็บคะแนน ปพ.5)'
    );

    await refreshData();
  };

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

    const isPublic = newCourseType === 'public';

    const { data: created, error } = await supabase
      .from('classrooms')
      .insert({
        title: newTitle.trim(),
        slug,
        grade_level: newGrade,
        subject: newSubject,
        join_code: newJoinCode.trim().toUpperCase() || `CLS${Math.floor(100 + Math.random() * 900)}`,
        description: newDesc.trim() || null,
        cover_image: newCover.trim() || null,
        status: 'active',
        visibility: 'public',
        is_public: isPublic,
        course_type: newCourseType,
        estimated_hours: newEstimatedHours,
      })
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
    const result = await createLessonForClassroom({
      classroomId: selectedClassroom.id,
      title: lessonTitle.trim(),
      description: lessonDesc.trim() || undefined,
      videoUrl: lessonVideoUrl.trim() || undefined,
      content: lessonContent.trim() || undefined,
    });

    setSavingLesson(false);

    if (!result.success) {
      toast.error('ไม่สามารถเพิ่มบทเรียนได้', result.error || 'เกิดข้อผิดพลาดในการบันทึกบทเรียน');
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

  const isCurrentPublic = isClassroomPublic(selectedClassroom);

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <School className="w-7 h-7 text-blue-600" />
            <span>จัดการห้องเรียนออนไลน์ & Thai MOOC Courses</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            สร้างคอร์สเรียน กำหนดประเภทคอร์ส (เปิดเรียนฟรี หรือ คอร์สเก็บคะแนนในชั้นเรียน) และแปะคลิป YouTube
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddClass(true)}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>+ สร้างห้องเรียน / คอร์สใหม่</span>
        </button>
      </div>

      {/* 2. Modal: Create Classroom */}
      {showAddClass && (
        <form onSubmit={handleCreateClassroom} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-blue-500 shadow-xl space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <School className="w-4 h-4 text-blue-600" />
              <span>สร้างห้องเรียนออนไลน์ใหม่ (New Thai MOOC Course)</span>
            </h3>
            <button type="button" onClick={() => setShowAddClass(false)} className="text-xs text-slate-400 hover:text-slate-600">
              ยกเลิก
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                ชื่อวิชา / ห้องเรียน *
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="เช่น การสร้างเกมด้วย Scratch 3.0"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                ประเภทการเข้าเรียน (Access Type) *
              </label>
              <select
                value={newCourseType}
                onChange={(e) => setNewCourseType(e.target.value as 'public' | 'enrolled')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white"
              >
                <option value="public">🌐 คอร์สสาธารณะ (เปิดฟรี ไม่ต้องล็อกอิน)</option>
                <option value="enrolled">🔐 คอร์สในชั้นเรียน (ต้องล็อกอิน เพื่อเก็บคะแนน ปพ.5)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                กลุ่มสาระ / หมวดวิชา *
              </label>
              <input
                type="text"
                required
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="เช่น วิทยาการคำนวณ, ประวัติศาสตร์"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                ระดับชั้น *
              </label>
              <select
                value={newGrade}
                onChange={(e) => setNewGrade(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white"
              >
                <option value="ประถมศึกษาปีที่ 3">ประถมศึกษาปีที่ 3</option>
                <option value="ประถมศึกษาปีที่ 4">ประถมศึกษาปีที่ 4</option>
                <option value="ประถมศึกษาปีที่ 5">ประถมศึกษาปีที่ 5</option>
                <option value="ประถมศึกษาปีที่ 6">ประถมศึกษาปีที่ 6</option>
                <option value="มัธยมศึกษา">มัธยมศึกษา</option>
                <option value="ทุกระดับชั้น">ทุกระดับชั้น / บุคคลทั่วไป</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                รหัสเข้าห้องเรียน (Join Code)
              </label>
              <input
                type="text"
                value={newJoinCode}
                onChange={(e) => setNewJoinCode(e.target.value.toUpperCase())}
                placeholder="เช่น COM02, HIST602"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                ชั่วโมงการเรียนรู้โดยประมาณ (ชั่วโมง)
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={newEstimatedHours}
                onChange={(e) => setNewEstimatedHours(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              URL รูปภาพหน้าปกคอร์ส (Cover Image URL)
            </label>
            <input
              type="url"
              value={newCover}
              onChange={(e) => setNewCover(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              คำอธิบายรายวิชา (Course Description)
            </label>
            <textarea
              rows={2}
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="อธิบายเนื้อหาและวัตถุประสงค์ของรายวิชานี้..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddClass(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20"
            >
              บันทึกห้องเรียนใหม่
            </button>
          </div>
        </form>
      )}

      {/* 3. Classroom Selector Pills */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
          เลือกห้องเรียนที่ต้องการจัดการ (Select Classroom)
        </label>
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {classrooms.map((cls) => {
            const isSelected = selectedClassroom?.id === cls.id;
            const isPub = isClassroomPublic(cls);

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
                  <div className="flex items-center gap-1.5">
                    <span>{cls.title}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold ${isPub ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-white'}`}>
                      {isPub ? 'Open' : 'Enrolled'}
                    </span>
                  </div>
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
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Access Type Switch Buttons */}
                <div className="inline-flex items-center p-1 rounded-xl bg-black/40 border border-white/10 text-xs">
                  <button
                    type="button"
                    onClick={() => handleToggleAccessType('public')}
                    className={`px-3 py-1 rounded-lg font-bold text-xs transition-all flex items-center gap-1 cursor-pointer ${
                      isCurrentPublic
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>🌐 คอร์สสาธารณะ (เปิดฟรี)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleAccessType('enrolled')}
                    className={`px-3 py-1 rounded-lg font-bold text-xs transition-all flex items-center gap-1 cursor-pointer ${
                      !isCurrentPublic
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>🔐 คอร์สในชั้นเรียน (ล็อกอิน)</span>
                  </button>
                </div>

                <span className="px-2.5 py-0.5 rounded-md bg-white/10 text-xs font-semibold text-blue-200">
                  {selectedClassroom.grade_level}
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
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  URL คลิป YouTube (YouTube Link) *
                </label>
                <input
                  type="url"
                  required
                  value={lessonVideoUrl}
                  onChange={(e) => setLessonVideoUrl(e.target.value)}
                  placeholder="เช่น https://www.youtube.com/watch?v=xxxx หรือ https://youtu.be/xxxx"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  คำอธิบายบทเรียนย่อ (Description)
                </label>
                <textarea
                  rows={2}
                  value={lessonDesc}
                  onChange={(e) => setLessonDesc(e.target.value)}
                  placeholder="สรุปสาระสำคัญสั้นๆ ของคลิปนี้..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  เนื้อหาบทเรียนละเอียด / ใบความรู้ (Active Learning Notes)
                </label>
                <textarea
                  rows={4}
                  value={lessonContent}
                  onChange={(e) => setLessonContent(e.target.value)}
                  placeholder="ใส่เนื้อหาประกอบการสอน หรือข้อความทบทวน..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddLesson(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={savingLesson}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
                >
                  {savingLesson ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  <span>บันทึกบทเรียน YouTube</span>
                </button>
              </div>
            </form>
          )}

          {/* Lessons List for this classroom */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>สารบัญบทเรียนทั้งหมดในห้องนี้ ({selectedClassroom.lessons?.length || 0} บทเรียน)</span>
            </h3>

            {(!selectedClassroom.lessons || selectedClassroom.lessons.length === 0) ? (
              <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 space-y-3">
                <PlayCircle className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">ยังไม่มีคลิปบทเรียนในห้องนี้</p>
                <button
                  type="button"
                  onClick={() => setShowAddLesson(true)}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs hover:bg-blue-700"
                >
                  + แปะคลิป YouTube บทแรก
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedClassroom.lessons.map((lsn, index) => {
                  const thumb = getYouTubeThumbnail(lsn.video_url);

                  return (
                    <div
                      key={lsn.id}
                      className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-4">
                        {thumb ? (
                          <div className="relative w-28 h-18 rounded-2xl overflow-hidden bg-slate-950 shrink-0 border border-slate-200 dark:border-slate-800">
                            <Image
                              src={thumb}
                              alt={lsn.title}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                              <PlayCircle className="w-6 h-6 text-white" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                            {index + 1}
                          </div>
                        )}

                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                              บทที่ {lsn.sort_order || index + 1}
                            </span>
                            {lsn.video_url && (
                              <span className="text-[10px] text-rose-600 dark:text-rose-400 font-mono truncate max-w-xs">
                                {lsn.video_url}
                              </span>
                            )}
                          </div>

                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {lsn.title}
                          </h4>

                          {lsn.description && (
                            <p className="text-xs text-slate-500 line-clamp-1">
                              {lsn.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                        <Link
                          href={`/classroom/${selectedClassroom.slug}/lessons/${lsn.id}`}
                          target="_blank"
                          className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>ดูหน้านักเรียน</span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDeleteLesson(lsn.id, lsn.title)}
                          className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 text-rose-600 text-xs transition-colors cursor-pointer"
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
