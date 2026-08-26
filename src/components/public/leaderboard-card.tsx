'use client';

import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Medal, 
  Sparkles, 
  Award, 
  GraduationCap, 
  Flame,
  CheckCircle2,
  Lock,
  Loader2
} from 'lucide-react';
import { getAllStudentsAnalytics, type StudentAnalyticsItem } from '@/services/student';

interface LeaderboardCardProps {
  currentUserId?: string;
}

export function LeaderboardCard({ currentUserId }: LeaderboardCardProps) {
  const [students, setStudents] = useState<StudentAnalyticsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    getAllStudentsAnalytics().then((data) => {
      if (!ignore) {
        // Sort by completed lessons * 10 + average_score
        const sorted = [...data].sort((a, b) => {
          const scoreA = (a.completed_lessons_count * 20) + (a.average_score || 0) + (a.attempts?.length || 0) * 5;
          const scoreB = (b.completed_lessons_count * 20) + (b.average_score || 0) + (b.attempts?.length || 0) * 5;
          return scoreB - scoreA;
        });
        setStudents(sorted);
        setLoading(false);
      }
    });

    return () => {
      ignore = true;
    };
  }, []);

  const currentStudent = students.find((s) => s.id === currentUserId);
  const completedLessons = currentStudent?.completed_lessons_count || 0;
  const attemptsCount = currentStudent?.attempts?.length || 0;
  const avgScore = currentStudent?.average_score || 0;
  const hasPerfectScore = (currentStudent?.attempts || []).some((a) => a.percentage === 100);

  const BADGES = [
    {
      id: 'b1',
      title: 'ผู้เริ่มต้นการเรียนรู้',
      desc: 'เรียนจบอย่างน้อย 1 บทเรียน',
      icon: <Sparkles className="w-5 h-5" />,
      color: 'from-amber-400 to-yellow-500',
      unlocked: completedLessons >= 1,
    },
    {
      id: 'b2',
      title: 'ยอดนักทดสอบ',
      desc: 'ทำแบบทดสอบอย่างน้อย 1 ชุด',
      icon: <Flame className="w-5 h-5" />,
      color: 'from-rose-500 to-orange-500',
      unlocked: attemptsCount >= 1,
    },
    {
      id: 'b3',
      title: 'อัจฉริยะเหรียญทอง',
      desc: 'ทำคะแนนสอบได้ 100% เต็ม',
      icon: <Medal className="w-5 h-5" />,
      color: 'from-yellow-400 to-amber-600',
      unlocked: hasPerfectScore,
    },
    {
      id: 'b4',
      title: 'ผู้พิชิตบทเรียน',
      desc: 'เรียนจบ 3 บทเรียนขึ้นไป',
      icon: <GraduationCap className="w-5 h-5" />,
      color: 'from-blue-500 to-indigo-600',
      unlocked: completedLessons >= 3,
    },
    {
      id: 'b5',
      title: 'เกียรตินิยมครูคิง',
      desc: 'คะแนนสอบเฉลี่ย 80% ขึ้นไป',
      icon: <Award className="w-5 h-5" />,
      color: 'from-emerald-400 to-teal-600',
      unlocked: avgScore >= 80 && attemptsCount >= 1,
    },
  ];

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400 flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
        <span className="text-xs">กำลังโหลดข้อมูลกระดานผู้นำ...</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Badges Collection (Left Column - 1 col) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Award className="w-5 h-5 text-amber-500" />
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
            เหรียญรางวัลของฉัน (My Badges)
          </h3>
        </div>

        <div className="space-y-2.5">
          {BADGES.map((b) => (
            <div
              key={b.id}
              className={`p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                b.unlocked
                  ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-800/60 shadow-2xs'
                  : 'bg-slate-50 dark:bg-slate-950/40 border-slate-100 dark:border-slate-800 opacity-60'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs ${
                  b.unlocked
                    ? `bg-gradient-to-tr ${b.color}`
                    : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                {b.unlocked ? b.icon : <Lock className="w-4 h-4 text-slate-500" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {b.title}
                  </h4>
                  {b.unlocked && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  )}
                </div>
                <p className="text-[10px] text-slate-500 truncate">
                  {b.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Top Leaderboard Table (Right Column - 2 cols) */}
      <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              กระดานผู้นำการเรียนรู้ (Learning Leaderboard)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            คำนวณจากบทเรียนที่จบ + คะแนนสอบ
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-3 text-center w-12">อันดับ</th>
                <th className="py-2.5 px-4">ชื่อนักเรียน</th>
                <th className="py-2.5 px-3 text-center">ระดับชั้น</th>
                <th className="py-2.5 px-3 text-center">เรียนจบ (บท)</th>
                <th className="py-2.5 px-3 text-center">คะแนนเฉลี่ย</th>
                <th className="py-2.5 px-3 text-right">แต้มสะสม</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {students.slice(0, 10).map((std, idx) => {
                const totalPoints = (std.completed_lessons_count * 20) + (std.average_score || 0) + (std.attempts?.length || 0) * 5;
                const isCurrent = std.id === currentUserId;

                return (
                  <tr
                    key={std.id}
                    className={`transition-colors ${
                      isCurrent
                        ? 'bg-blue-50/80 dark:bg-blue-950/40 font-bold'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-3 px-3 text-center font-extrabold">
                      {idx === 0 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-400 text-yellow-950 text-xs shadow-xs">🥇</span>
                      ) : idx === 1 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-300 text-slate-800 text-xs shadow-xs">🥈</span>
                      ) : idx === 2 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-600 text-white text-xs shadow-xs">🥉</span>
                      ) : (
                        <span className="text-slate-400">{idx + 1}</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                          {std.full_name?.charAt(0) || 'น'}
                        </div>
                        <div>
                          <div className="text-slate-900 dark:text-white truncate max-w-[140px] sm:max-w-[200px]">
                            {std.full_name} {isCurrent && '(คุณ)'}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-center text-slate-500">
                      {std.grade_level?.replace('ประถมศึกษาปีที่', 'ป.') || '-'}
                    </td>

                    <td className="py-3 px-3 text-center font-bold text-emerald-600">
                      {std.completed_lessons_count || 0}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                        std.average_score >= 80
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {std.average_score}%
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right font-extrabold text-blue-600 font-mono">
                      {totalPoints} pts
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
