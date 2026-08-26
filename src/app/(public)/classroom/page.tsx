'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  School, 
  KeyRound, 
  BookOpen, 
  ArrowRight, 
  PlayCircle, 
  Loader2, 
  Search, 
  Award, 
  Clock, 
  Globe, 
  Lock, 
  GraduationCap
} from 'lucide-react';
import { 
  getClassrooms, 
  getClassroomByJoinCode, 
  isClassroomPublic, 
  type ClassroomWithLessons 
} from '@/services/classroom';
import { useToast } from '@/components/ui/toast';

export default function ThaiMOOCClassroomPage() {
  const [classrooms, setClassrooms] = useState<ClassroomWithLessons[]>([]);
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'PUBLIC' | 'ENROLLED'>('ALL');
  const [subjectFilter, setSubjectFilter] = useState('ALL');

  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    let ignore = false;
    getClassrooms().then((data) => {
      if (!ignore) {
        setClassrooms(data);
        setPageLoading(false);
      }
    });
    return () => {
      ignore = true;
    };
  }, []);

  const handleJoinByCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;

    setLoading(true);
    const found = await getClassroomByJoinCode(joinCode);
    setLoading(false);

    if (found) {
      toast.success('พบห้องเรียนแล้ว', `กำลังนำท่านเข้าสู่ห้องเรียน "${found.title}"`);
      router.push(`/classroom/${found.slug}`);
    } else {
      toast.error('ไม่พบห้องเรียน', 'กรุณาตรวจสอบรหัสเข้าห้องเรียน (Join Code) ให้ถูกต้อง');
    }
  };

  const filteredClassrooms = classrooms.filter((cls) => {
    const isPublic = isClassroomPublic(cls);
    const matchesSearch = 
      cls.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cls.description && cls.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (cls.subject && cls.subject.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = 
      filterType === 'ALL' ||
      (filterType === 'PUBLIC' && isPublic) ||
      (filterType === 'ENROLLED' && !isPublic);

    const matchesSubject = 
      subjectFilter === 'ALL' ||
      (cls.subject && cls.subject.includes(subjectFilter));

    return matchesSearch && matchesType && matchesSubject;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 animate-in fade-in">
      
      {/* 1. Thai MOOC Style Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 text-white p-8 sm:p-12 overflow-hidden shadow-2xl border border-blue-900/50">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold backdrop-blur-md">
            <School className="w-3.5 h-3.5" />
            <span>KRU KING MOOC • แพลตฟอร์มการเรียนรู้ออนไลน์ตลอดชีวิต</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            คลังรายวิชาออนไลน์ <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-amber-300">
              โรงเรียนวัดบางโฉลงใน
            </span>
          </h1>

          <p className="text-sm sm:text-base text-blue-200/90 leading-relaxed font-normal">
            เปิดโอกาสการเรียนรู้สำหรับนักเรียนและบุคคลทั่วไป มีทั้ง <strong>คอร์สเรียนฟรีไม่ต้องล็อกอิน (Open Access)</strong> และ <strong>คอร์สเก็บคะแนนในชั้นเรียน</strong> พร้อมวิดีโอ YouTube HD และเกียรติบัตรรับรอง
          </p>

          {/* Quick Stats Badges */}
          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-blue-200 border-t border-white/10 font-semibold">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-teal-400" />
              <span>{classrooms.length} รายวิชาคุณภาพ</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>เรียนรู้ได้ทุกที่ ทุกเวลา 24 ชม.</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-yellow-400" />
              <span>มีเกียรติบัตรออนไลน์ (E-Certificate)</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Join Code Quick Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              นักเรียนมีรหัสห้องเรียน (Join Code)?
            </h3>
            <p className="text-xs text-slate-400">
              กรอกรหัสวิชา เช่น <span className="font-mono font-bold text-slate-700 dark:text-slate-300">COM01</span>, <span className="font-mono font-bold text-slate-700 dark:text-slate-300">HIST601</span> หรือ <span className="font-mono font-bold text-slate-700 dark:text-slate-300">CODE406</span> เพื่อเข้าห้องเรียนทันที
            </p>
          </div>
        </div>

        <form onSubmit={handleJoinByCode} className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            placeholder="พิมพ์รหัส เช่น COM01"
            className="w-full md:w-48 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs tracking-wider uppercase text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-center font-bold"
          />
          <button
            type="submit"
            disabled={loading || !joinCode}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            {loading ? 'กำลังตรวจ...' : 'เข้าเรียนด้วยรหัส'}
          </button>
        </form>
      </div>

      {/* 3. Thai MOOC Filters & Search Bar */}
      <div className="space-y-4">
        {/* Search & Access Type Pills */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Access Type Filter (All / Public / Enrolled) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setFilterType('ALL')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                filterType === 'ALL'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
              }`}
            >
              🌟 คอร์สทั้งหมด ({classrooms.length})
            </button>

            <button
              type="button"
              onClick={() => setFilterType('PUBLIC')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                filterType === 'PUBLIC'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 hover:bg-slate-50'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>🌐 เรียนฟรี ไม่ต้องล็อกอิน (Open Access)</span>
            </button>

            <button
              type="button"
              onClick={() => setFilterType('ENROLLED')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                filterType === 'ENROLLED'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-indigo-600 dark:text-indigo-400 hover:bg-slate-50'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>🔐 คอร์สในห้องเรียน (ต้องล็อกอิน)</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาชื่อวิชา, เนื้อหา..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xs"
            />
          </div>
        </div>

        {/* Subject Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-bold whitespace-nowrap mr-1">หมวดวิชา:</span>
          {['ALL', 'วิทยาการคำนวณ', 'ประวัติศาสตร์', 'ต้านทุจริต'].map((subj) => (
            <button
              key={subj}
              type="button"
              onClick={() => setSubjectFilter(subj)}
              className={`px-3 py-1 rounded-xl font-semibold transition-all whitespace-nowrap cursor-pointer ${
                subjectFilter === subj
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {subj === 'ALL' ? 'ทุกหมวดสาระ' : subj}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Thai MOOC Course Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            <span>รายวิชาที่เปิดสอน ({filteredClassrooms.length} วิชา)</span>
          </h2>
          <span className="text-xs text-slate-400">
            แสดงผลตามตัวกรองปัจจุบัน
          </span>
        </div>

        {pageLoading ? (
          <div className="p-16 text-center text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-xs">กำลังโหลดคลังรายวิชา Thai MOOC...</span>
          </div>
        ) : filteredClassrooms.length === 0 ? (
          <div className="p-16 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 space-y-3">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">ไม่พบรายวิชาที่ตรงกับคำค้นหา</h3>
            <p className="text-xs text-slate-400">ลองเปลี่ยนคำค้นหา หรือเลือกตัวกรองเป็น &quot;คอร์สทั้งหมด&quot;</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredClassrooms.map((cls) => {
              const isPublic = isClassroomPublic(cls);
              const lessonCount = cls.lessons?.length || 0;
              const hours = cls.estimated_hours || 6;

              return (
                <div
                  key={cls.id}
                  className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    {/* Course Cover with Access Badge */}
                    <div className="relative aspect-16/9 bg-slate-950 overflow-hidden">
                      {cls.cover_image ? (
                        <Image
                          src={cls.cover_image}
                          alt={cls.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900 to-indigo-950 text-white">
                          <BookOpen className="w-12 h-12 opacity-30" />
                        </div>
                      )}

                      {/* Access Type Pill (Top Left) */}
                      <div className="absolute top-3 left-3">
                        {isPublic ? (
                          <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold shadow-md flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            <span>เรียนฟรี ไม่ต้องล็อกอิน</span>
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-[10px] font-extrabold shadow-md flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            <span>คอร์สในชั้นเรียน (ล็อกอิน)</span>
                          </span>
                        )}
                      </div>

                      {/* Grade Level (Top Right) */}
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                        {cls.grade_level || 'ทุกระดับชั้น'}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-5 sm:p-6 space-y-3">
                      <div>
                        <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                          {cls.subject || 'กลุ่มสาระการเรียนรู้'}
                        </span>
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                          {cls.title}
                        </h3>
                      </div>

                      {cls.description && (
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {cls.description}
                        </p>
                      )}

                      {/* Teacher & School Info */}
                      <div className="pt-2 text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-medium border-t border-slate-100 dark:border-slate-800">
                        <School className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">ครูจักรพงษ์ สำรองพันธ์ • รร.วัดบางโฉลงใน</span>
                      </div>

                      {/* Meta Tags: Hours & Lessons & Cert */}
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 font-semibold pt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-blue-500" />
                          <span>{hours} ชม.</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <PlayCircle className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{lessonCount} บทเรียน</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                          <Award className="w-3.5 h-3.5" />
                          <span>มีเกียรติบัตร</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="p-5 pt-0">
                    <Link
                      href={`/classroom/${cls.slug}`}
                      className="w-full py-2.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-blue-600 dark:hover:bg-blue-500 dark:hover:text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>เข้าสู่บทเรียน (Start Learning)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
