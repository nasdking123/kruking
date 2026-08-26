'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  History, 
  CheckCircle2, 
  Loader2, 
  ArrowRight 
} from 'lucide-react';
import { StudentNavBar } from '@/components/public/student-nav-bar';
import { getStudentLearningHistory, type LearningHistoryRecord } from '@/services/student-learning';
import { createClient } from '@/lib/supabase/client';

export default function StudentHistoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<LearningHistoryRecord[]>([]);

  useEffect(() => {
    let ignore = false;
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!ignore) {
        if (!user) {
          router.push('/student/login?redirectTo=/student/history');
          return;
        }
        getStudentLearningHistory(user.id).then((data) => {
          if (!ignore) {
            setHistory(data);
            setLoading(false);
          }
        });
      }
    });

    return () => {
      ignore = true;
    };
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-xs text-slate-500 font-bold">กำลังโหลดประวัติการเรียนรู้...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-16">
      <StudentNavBar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
              <History className="w-7 h-7 text-blue-600" />
              <span>ประวัติการเรียนรู้ (Learning History)</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              บันทึกไทม์ไลน์การเข้าเรียนคลิปวิดีโอ การส่งงาน และผลการประเมินกิจกรรมทั้งหมดของคุณ
            </p>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 text-xs font-extrabold flex items-center gap-1.5 border border-blue-200 dark:border-blue-800 self-start sm:self-auto">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>ทั้งหมด {history.length} กิจกรรมที่บันทึก</span>
          </div>
        </div>

        {/* History Table Card */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-md overflow-hidden">
          {history.length === 0 ? (
            <div className="p-16 text-center space-y-3">
              <History className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                ยังไม่มีบันทึกประวัติการเรียน
              </p>
              <p className="text-xs text-slate-400">
                เมื่อคุณเข้าดูคลิปในห้องเรียนออนไลน์หรือส่งการบ้าน ระบบจะบันทึก Log ให้อัตโนมัติ
              </p>
              <Link
                href="/classroom"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
              >
                <span>เข้าห้องเรียนออนไลน์</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                    <th className="py-4 px-6">วันที่บันทึก</th>
                    <th className="py-4 px-6">ประเภท</th>
                    <th className="py-4 px-6">ชื่อบทเรียน / กิจกรรม</th>
                    <th className="py-4 px-6 text-center">คะแนน</th>
                    <th className="py-4 px-6 text-right">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {history.map((record) => {
                    const formattedDate = new Date(record.date).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <tr
                        key={record.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-4 px-6 font-mono text-slate-500 whitespace-nowrap">
                          {formattedDate}
                        </td>

                        <td className="py-4 px-6">
                          <span
                            className={`px-2.5 py-0.5 rounded-md font-bold text-[10px] ${
                              record.category === 'บทเรียน'
                                ? 'bg-blue-50 dark:bg-blue-950 text-blue-600'
                                : record.category === 'การบ้าน'
                                ? 'bg-purple-50 dark:bg-purple-950 text-purple-600'
                                : 'bg-amber-50 dark:bg-amber-950 text-amber-600'
                            }`}
                          >
                            {record.category}
                          </span>
                        </td>

                        <td className="py-4 px-6 font-extrabold text-slate-900 dark:text-white max-w-xs truncate">
                          {record.title}
                        </td>

                        <td className="py-4 px-6 text-center font-bold">
                          {record.scoreDisplay ? (
                            <span className="font-mono text-blue-600 dark:text-blue-400">
                              {record.scoreDisplay}
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>

                        <td className="py-4 px-6 text-right font-bold">
                          <span
                            className={`px-3 py-1 rounded-xl text-[11px] inline-block ${
                              record.statusType === 'success'
                                ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200 dark:border-emerald-800'
                                : record.statusType === 'warning'
                                ? 'bg-rose-50 dark:bg-rose-950 text-rose-600 border border-rose-200 dark:border-rose-800'
                                : 'bg-amber-50 dark:bg-amber-950 text-amber-600 border border-amber-200 dark:border-amber-800'
                            }`}
                          >
                            {record.statusText}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
