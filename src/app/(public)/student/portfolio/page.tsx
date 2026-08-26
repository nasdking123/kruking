'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FolderHeart, 
  Eye, 
  EyeOff, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Loader2,
  Sparkles
} from 'lucide-react';
import { StudentNavBar } from '@/components/public/student-nav-bar';
import { getStudentPortfolio, toggleSubmissionPortfolio, type PortfolioItem } from '@/services/student-learning';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/toast';

export default function StudentPortfolioPage() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!ignore) {
        if (!user) {
          router.push('/student/login?redirectTo=/student/portfolio');
          return;
        }
        getStudentPortfolio(user.id).then((data) => {
          if (!ignore) {
            setItems(data);
            setLoading(false);
          }
        });
      }
    });

    return () => {
      ignore = true;
    };
  }, [router]);

  const handleToggleVisibility = async (submissionId: string, currentState: boolean) => {
    setTogglingId(submissionId);
    const nextState = !currentState;
    const res = await toggleSubmissionPortfolio(submissionId, nextState);
    setTogglingId(null);

    if (res.success) {
      setItems((prev) =>
        prev.map((it) => (it.id === submissionId ? { ...it, isInPortfolio: nextState } : it))
      );
      toast.success(
        nextState ? 'แสดงใน Portfolio แล้ว' : 'ซ่อนจาก Portfolio แล้ว',
        nextState ? 'ผลงานนี้จะแสดงในแกลเลอรีของคุณ' : 'ผลงานนี้ถูกซ่อนไว้เฉพาะคุณครู'
      );
    } else {
      toast.error('ไม่สามารถอัปเดตได้', res.error || 'เกิดข้อผิดพลาด');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-xs text-slate-500 font-bold">กำลังโหลดแฟ้มสะสมผลงาน (Portfolio)...</span>
        </div>
      </div>
    );
  }

  const visibleItems = items.filter((it) => it.isInPortfolio);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-16">
      <StudentNavBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
        {/* Header Hero */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold flex items-center gap-1.5">
                <FolderHeart className="w-3.5 h-3.5" />
                <span>แฟ้มสะสมผลงานดิจิทัล</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                {visibleItems.length} ผลงานที่เปิดแสดง
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              My Creative Portfolio & Student Showcase
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-normal leading-relaxed">
              รวมชิ้นงานการบ้าน โปรเจกต์ Scratch และผลงานสร้างสรรค์ที่คุณส่งในแต่ละบทเรียน คุณสามารถเลือกเปิด/ปิดการแสดงผลต่อสาธารณะได้
            </p>
          </div>

          <Link
            href="/classroom"
            className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 shrink-0 self-start md:self-auto cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>+ สร้างผลงานจากบทเรียนใหม่</span>
          </Link>
        </div>

        {/* Gallery Grid */}
        {items.length === 0 ? (
          <div className="p-16 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center mx-auto">
              <FolderHeart className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                ยังไม่มีผลงานในแฟ้มสะสมงาน
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                เมื่อคุณส่งการบ้านหรือโปรเจกต์ในห้องเรียนออนไลน์ ชิ้นงานจะมารวบรวมไว้ที่หน้านี้โดยอัตโนมัติ
              </p>
            </div>
            <Link
              href="/classroom"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <span>ไปที่คลังบทเรียน</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => {
              const isGraded = item.status === 'graded' || item.status === 'passed';
              const isImage = item.contentUrl && (item.contentUrl.startsWith('http') && (item.contentUrl.match(/\.(jpeg|jpg|gif|png|webp)/i) || item.contentUrl.includes('images.unsplash.com')));

              return (
                <div
                  key={item.id}
                  className={`rounded-3xl bg-white dark:bg-slate-900 border transition-all flex flex-col justify-between overflow-hidden group shadow-xs hover:shadow-md ${
                    item.isInPortfolio
                      ? 'border-slate-200/80 dark:border-slate-800/80 hover:border-blue-400'
                      : 'border-dashed border-slate-300 dark:border-slate-800 opacity-60 bg-slate-50/50'
                  }`}
                >
                  {/* Media Cover / Scratch Preview */}
                  <div className="relative aspect-video bg-slate-950 overflow-hidden border-b border-slate-100 dark:border-slate-800">
                    {isImage ? (
                      <Image
                        src={item.contentUrl!}
                        alt={item.title}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : item.contentUrl?.includes('scratch.mit.edu') ? (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-tr from-amber-600 to-orange-500 text-white text-center space-y-1">
                        <span className="text-2xl">🐱</span>
                        <span className="font-black text-xs">Scratch 3.0 Project</span>
                        <span className="text-[10px] text-amber-100 font-mono truncate max-w-full px-2">
                          {item.contentUrl}
                        </span>
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-slate-900 text-slate-300 text-center space-y-1">
                        <FolderHeart className="w-8 h-8 text-blue-400" />
                        <span className="font-bold text-xs">ผลงานส่งทางออนไลน์</span>
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      {isGraded ? (
                        <span className="px-2.5 py-1 rounded-xl bg-emerald-500 text-white text-[10px] font-extrabold shadow-md flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>ผ่านการตรวจ ({item.score}/{item.maxScore})</span>
                        </span>
                      ) : item.status === 'needs_revision' ? (
                        <span className="px-2.5 py-1 rounded-xl bg-rose-500 text-white text-[10px] font-extrabold shadow-md flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>ให้แก้ไข</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-xl bg-amber-500 text-white text-[10px] font-extrabold shadow-md flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>รอคุณครูตรวจ</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[10px] text-blue-600 dark:text-blue-400 font-bold">
                        <span>{item.classroomTitle}</span>
                        <span>•</span>
                        <span>{item.lessonTitle}</span>
                      </div>

                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white line-clamp-1">
                        {item.title}
                      </h3>

                      {item.notes && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {item.notes}
                        </p>
                      )}

                      {item.teacherFeedback && (
                        <div className="p-3 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-200 mt-2">
                          <span className="font-bold block text-[10px] text-blue-600 dark:text-blue-400">
                            👨‍🏫 ข้อเสนอแนะจากคุณครู:
                          </span>
                          <p className="mt-0.5">{item.teacherFeedback}</p>
                        </div>
                      )}
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                      {item.contentUrl ? (
                        <a
                          href={item.contentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 hover:underline"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>เปิดดูชิ้นงาน</span>
                        </a>
                      ) : <div />}

                      <button
                        type="button"
                        onClick={() => handleToggleVisibility(item.id, item.isInPortfolio)}
                        disabled={togglingId === item.id}
                        className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all flex items-center gap-1.5 cursor-pointer ${
                          item.isInPortfolio
                            ? 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300'
                            : 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                        }`}
                      >
                        {item.isInPortfolio ? (
                          <>
                            <Eye className="w-3.5 h-3.5 text-emerald-500" />
                            <span>แสดงใน Portfolio</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                            <span>ซ่อนอยู่ (คลิกเพื่อแสดง)</span>
                          </>
                        )}
                      </button>
                    </div>
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
