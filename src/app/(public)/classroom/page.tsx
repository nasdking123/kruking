'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { School, KeyRound, BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react';
import { getClassrooms, getClassroomByJoinCode, type ClassroomWithLessons } from '@/services/classroom';
import { useToast } from '@/components/ui/toast';

export default function ClassroomPortalPage() {
  const [classrooms, setClassrooms] = useState<ClassroomWithLessons[]>([]);
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    let ignore = false;
    getClassrooms().then((data) => {
      if (!ignore) setClassrooms(data);
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-tr from-blue-700 via-indigo-800 to-slate-900 text-white shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs">
          <School className="w-3.5 h-3.5" />
          <span>Kru King Online Classroom Portal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
          ห้องเรียนออนไลน์ครูคิง
        </h1>
        <p className="text-sm sm:text-base text-blue-100 max-w-2xl leading-relaxed font-normal">
          พื้นที่เรียนรู้วิทยาการคำนวณและเทคโนโลยีแบบ Active Learning เข้าถึงบทเรียน วิดีโอ ใบงาน และแบบทดสอบได้ทุกที่ทุกเวลา
        </p>
      </div>

      {/* Join Code Quick Card */}
      <div className="max-w-xl mx-auto p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-md space-y-3">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
          <KeyRound className="w-4 h-4" />
          <span>เข้าร่วมห้องเรียนด้วยรหัส (Join with Code)</span>
        </div>
        <form onSubmit={handleJoinByCode} className="flex gap-2">
          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            placeholder="กรอกรหัส เช่น CS401 หรือ MB502..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-sm tracking-wider uppercase text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading || !joinCode}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            {loading ? 'กำลังตรวจ...' : 'เข้าสู่ห้องเรียน'}
          </button>
        </form>
        <p className="text-[11px] text-slate-400">
          * รับรหัสเข้าร่วมห้องเรียนจากครูผู้สอนประจำวิชา
        </p>
      </div>

      {/* Classroom Directory */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              รายวิชาที่เปิดสอน
            </h2>
            <p className="text-xs text-slate-500">
              เลือกห้องเรียนเพื่อเข้าสู่เนื้อหาบทเรียนและสื่อการเรียนรู้
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {classrooms.map((cls) => (
            <div
              key={cls.id}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Cover */}
                <div className="relative aspect-16/9 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  {cls.cover_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cls.cover_image}
                      alt={cls.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-blue-500">
                      <School className="w-16 h-16 opacity-30" />
                    </div>
                  )}

                  <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-blue-600 text-white text-[11px] font-bold shadow-md">
                    {cls.grade_level || 'ทุกระดับชั้น'}
                  </div>

                  {cls.join_code && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-mono font-bold">
                      Code: {cls.join_code}
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                    {cls.title}
                  </h3>

                  {cls.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {cls.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 pt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                      <span>{cls.lessons?.length || 0} บทเรียน</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>เปิดรับนักเรียน</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="px-6 py-4 bg-slate-50/60 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">
                  วิชา {cls.subject}
                </span>
                <Link
                  href={`/classroom/${cls.slug}`}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <span>เข้าสู่ห้องเรียน</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
