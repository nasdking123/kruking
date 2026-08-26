'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Coins, 
  TrendingUp, 
  Trophy, 
  BookOpen, 
  Loader2,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { StudentNavBar } from '@/components/public/student-nav-bar';
import { getPointBalanceAndHistory, type PointTransactionItem } from '@/services/student-learning';
import { createClient } from '@/lib/supabase/client';

export default function StudentPointsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [totalPoints, setTotalPoints] = useState(0);
  const [learningPoints, setLearningPoints] = useState(0);
  const [bonusPoints, setBonusPoints] = useState(0);
  const [transactions, setTransactions] = useState<PointTransactionItem[]>([]);

  useEffect(() => {
    let ignore = false;
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!ignore) {
        if (!user) {
          router.push('/student/login?redirectTo=/student/points');
          return;
        }
        getPointBalanceAndHistory(user.id).then((res) => {
          if (!ignore) {
            setTotalPoints(res.totalPoints);
            setLearningPoints(res.learningPoints);
            setBonusPoints(res.bonusPoints);
            setTransactions(res.transactions);
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
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          <span className="text-xs text-slate-500 font-bold">กำลังโหลดสมุดบัญชีคะแนนสะสม...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-16">
      <StudentNavBar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
        {/* Header Hero Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Total Card */}
          <div className="p-8 rounded-3xl bg-gradient-to-tr from-amber-600 via-orange-600 to-amber-700 text-white shadow-xl space-y-3 relative overflow-hidden">
            <Coins className="w-24 h-24 text-white/10 absolute -right-4 -bottom-4" />
            <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-xs inline-block">
              คะแนนสะสมทั้งหมด (Total Points)
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black tracking-tight">
                {totalPoints.toLocaleString()}
              </span>
              <span className="text-sm text-amber-100 font-bold">คะแนน</span>
            </div>
            <p className="text-xs text-amber-100 font-medium">
              คำนวณจากกิจกรรมการเรียน การส่งงาน และรางวัลการแข่งขันทั้งหมด
            </p>
          </div>

          {/* Learning Points Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-md space-y-2 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-extrabold">
                <BookOpen className="w-4 h-4" />
                <span>คะแนนจากการเรียนรู้ (Learning)</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {learningPoints.toLocaleString()}
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              คะแนนจากการดูคลิปบทเรียน, ทำแบบทดสอบ และส่งการบ้าน Scratch
            </p>
          </div>

          {/* Bonus Points Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-md space-y-2 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-xs font-extrabold">
                <Trophy className="w-4 h-4" />
                <span>คะแนนพิเศษ & การแข่งขัน (Bonus)</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {bonusPoints.toLocaleString()}
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              คะแนนจากรางวัลการแข่งขัน, ผู้เรียนดีเด่น และกิจกรรมพิเศษ
            </p>
          </div>
        </div>

        {/* Transactions Ledger */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              <span>ประวัติการทำรายการคะแนน (Point Ledger History)</span>
            </h2>
            <span className="text-xs text-slate-400">
              ทั้งหมด {transactions.length} รายการ
            </span>
          </div>

          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-md overflow-hidden">
            {transactions.length === 0 ? (
              <div className="p-16 text-center space-y-2">
                <Coins className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  ยังไม่มีประวัติคะแนนสะสม
                </p>
                <p className="text-xs text-slate-400">
                  เมื่อคุณส่งการบ้านหรือทำแบบทดสอบ คะแนนจะแสดงในตารางนี้ทันที
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                      <th className="py-4 px-6">วัน/เวลา</th>
                      <th className="py-4 px-6">ประเภท</th>
                      <th className="py-4 px-6">รายการ</th>
                      <th className="py-4 px-6 text-right">จำนวนคะแนน</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {transactions.map((tx) => {
                      const isPositive = tx.amount >= 0;
                      const formattedDate = new Date(tx.createdAt).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      });

                      return (
                        <tr
                          key={tx.id}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          <td className="py-4 px-6 font-mono text-slate-500 whitespace-nowrap">
                            {formattedDate}
                          </td>

                          <td className="py-4 px-6">
                            <span
                              className={`px-2.5 py-0.5 rounded-md font-bold text-[10px] ${
                                tx.pointType === 'assignment'
                                  ? 'bg-blue-50 dark:bg-blue-950 text-blue-600'
                                  : tx.pointType === 'quiz'
                                  ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600'
                                  : tx.pointType === 'competition'
                                  ? 'bg-purple-50 dark:bg-purple-950 text-purple-600'
                                  : tx.pointType === 'award'
                                  ? 'bg-amber-50 dark:bg-amber-950 text-amber-600'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                              }`}
                            >
                              {tx.pointType}
                            </span>
                          </td>

                          <td className="py-4 px-6 font-extrabold text-slate-900 dark:text-white max-w-sm">
                            {tx.description}
                          </td>

                          <td className="py-4 px-6 text-right font-black">
                            <span
                              className={`inline-flex items-center gap-1 font-mono text-sm ${
                                isPositive ? 'text-emerald-600' : 'text-rose-600'
                              }`}
                            >
                              {isPositive ? (
                                <>
                                  <ArrowUpRight className="w-4 h-4" />
                                  <span>+{tx.amount}</span>
                                </>
                              ) : (
                                <>
                                  <ArrowDownRight className="w-4 h-4" />
                                  <span>{tx.amount}</span>
                                </>
                              )}
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
    </div>
  );
}
