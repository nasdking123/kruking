'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Trophy, 
  Crown, 
  Filter, 
  Coins, 
  Loader2, 
  Users 
} from 'lucide-react';
import { StudentNavBar } from '@/components/public/student-nav-bar';
import { getRankingList, type RankingEntry } from '@/services/student-learning';

export default function StudentRankingPage() {
  const [loading, setLoading] = useState(true);
  const [rankings, setRankings] = useState<RankingEntry[]>([]);

  // Filters
  const [schoolFilter, setSchoolFilter] = useState('ALL');
  const [gradeFilter, setGradeFilter] = useState('ALL');
  const [roomFilter, setRoomFilter] = useState('ALL');

  useEffect(() => {
    let ignore = false;
    getRankingList({
      schoolName: schoolFilter,
      gradeLevel: gradeFilter,
      classroom: roomFilter,
    }).then((list) => {
      if (!ignore) {
        setRankings(list);
        setLoading(false);
      }
    });

    return () => {
      ignore = true;
    };
  }, [schoolFilter, gradeFilter, roomFilter]);

  const top1 = rankings[0];
  const top2 = rankings[1];
  const top3 = rankings[2];
  const restRankings = rankings.slice(3);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-16">
      <StudentNavBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
        {/* Header Hero */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-blue-950 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-blue-900/40">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md">
                <Trophy className="w-3.5 h-3.5" />
                <span>Leaderboard & Rankings</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold">
                การจัดอันดับผู้เรียน
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              ตารางจัดอันดับคะแนนและผู้เรียนยอดเยี่ยม
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-normal leading-relaxed">
              จัดอันดับตามคะแนนสะสมจริงจากการเรียน การส่งผลงาน และการแข่งขัน สามารถกรองดูอันดับรายห้อง รายชั้น หรือรายโรงเรียนได้
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Filter className="w-4 h-4 text-blue-600" />
            <span>ตัวกรองการจัดอันดับ (Ranking Filters):</span>
          </div>

          <div className="flex items-center gap-3 flex-wrap text-xs">
            {/* School Filter */}
            <select
              value={schoolFilter}
              onChange={(e) => setSchoolFilter(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold text-slate-900 dark:text-white"
            >
              <option value="ALL">🏫 โรงเรียนทั้งหมด</option>
              <option value="โรงเรียนวัดบางโฉลงใน">โรงเรียนวัดบางโฉลงใน</option>
              <option value="โรงเรียนสาธิตบางพลี">โรงเรียนสาธิตบางพลี</option>
            </select>

            {/* Grade Filter */}
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold text-slate-900 dark:text-white"
            >
              <option value="ALL">📚 ทุกระดับชั้น</option>
              <option value="ประถมศึกษาปีที่ 3">ประถมศึกษาปีที่ 3</option>
              <option value="ประถมศึกษาปีที่ 4">ประถมศึกษาปีที่ 4</option>
              <option value="ประถมศึกษาปีที่ 5">ประถมศึกษาปีที่ 5</option>
              <option value="ประถมศึกษาปีที่ 6">ประถมศึกษาปีที่ 6</option>
            </select>

            {/* Room Filter */}
            <select
              value={roomFilter}
              onChange={(e) => setRoomFilter(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold text-slate-900 dark:text-white"
            >
              <option value="ALL">🚪 ทุกห้องเรียน</option>
              <option value="ห้อง 1">ห้อง 1</option>
              <option value="ห้อง 2">ห้อง 2</option>
              <option value="ห้อง 3">ห้อง 3</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="text-xs text-slate-500 font-bold">กำลังคำนวณอันดับ Ranking จากฐานข้อมูล...</span>
          </div>
        ) : rankings.length === 0 ? (
          <div className="p-16 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 space-y-2">
            <Trophy className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              ไม่พบข้อมูลผู้เรียนตามเงื่อนไขตัวกรอง
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Top 3 Podium (แท่นรางวัล Top 3 🥇🥈🥉) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-8">
              
              {/* 2nd Place (Left) */}
              {top2 && (
                <div className="order-2 md:order-1 p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-md text-center space-y-3 relative">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-sm flex items-center justify-center mx-auto -mt-10 shadow-md border-2 border-slate-300">
                    🥈 2
                  </div>
                  <div className="relative w-20 h-20 mx-auto rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-slate-300">
                    <Image
                      src={top2.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=Student2'}
                      alt={top2.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-sm truncate">
                      {top2.name}
                    </h3>
                    <span className="text-[11px] text-slate-400 block">
                      {top2.gradeLevel} • {top2.classroom}
                    </span>
                    <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold block">
                      {top2.schoolName}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1 text-slate-700 dark:text-slate-300 font-black text-sm">
                    <Coins className="w-4 h-4 text-slate-400" />
                    <span>{top2.points.toLocaleString()} แต้ม</span>
                  </div>
                </div>
              )}

              {/* 1st Place (Center - Elevated) */}
              {top1 && (
                <div className="order-1 md:order-2 p-8 rounded-3xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 shadow-2xl text-center space-y-4 relative md:-translate-y-4 border-4 border-amber-300">
                  <div className="w-12 h-12 rounded-full bg-amber-900 text-amber-200 font-black text-base flex items-center justify-center mx-auto -mt-14 shadow-lg border-2 border-white">
                    🥇 1
                  </div>
                  <div className="relative w-24 h-24 mx-auto rounded-3xl overflow-hidden bg-white shadow-md border-4 border-amber-200">
                    <Image
                      src={top1.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=King1'}
                      alt={top1.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-slate-950 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                      <Crown className="w-3 h-3 text-amber-400" />
                      <span>อันดับ 1 ประจำสัปดาห์</span>
                    </div>
                    <h3 className="font-black text-slate-950 text-base sm:text-lg truncate mt-1">
                      {top1.name}
                    </h3>
                    <span className="text-xs text-amber-950 font-bold block">
                      {top1.gradeLevel} • {top1.classroom}
                    </span>
                    <span className="text-[11px] font-extrabold text-amber-900 block">
                      {top1.schoolName}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-amber-500/30 flex items-center justify-center gap-1.5 text-slate-950 font-black text-lg">
                    <Coins className="w-5 h-5 text-amber-900" />
                    <span>{top1.points.toLocaleString()} คะแนน</span>
                  </div>
                </div>
              )}

              {/* 3rd Place (Right) */}
              {top3 && (
                <div className="order-3 p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-amber-700/20 shadow-md text-center space-y-3 relative">
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-black text-sm flex items-center justify-center mx-auto -mt-10 shadow-md border-2 border-amber-600/40">
                    🥉 3
                  </div>
                  <div className="relative w-20 h-20 mx-auto rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-amber-700/30">
                    <Image
                      src={top3.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=Student3'}
                      alt={top3.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-sm truncate">
                      {top3.name}
                    </h3>
                    <span className="text-[11px] text-slate-400 block">
                      {top3.gradeLevel} • {top3.classroom}
                    </span>
                    <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold block">
                      {top3.schoolName}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1 text-amber-800 dark:text-amber-400 font-black text-sm">
                    <Coins className="w-4 h-4 text-amber-600" />
                    <span>{top3.points.toLocaleString()} แต้ม</span>
                  </div>
                </div>
              )}
            </div>

            {/* Rest of Leaderboard Table */}
            {restRankings.length > 0 && (
              <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-md overflow-hidden">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span>อันดับที่ 4 เป็นต้นไป</span>
                  </h3>
                  <span className="text-xs text-slate-400 font-bold">
                    {restRankings.length} คน
                  </span>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {restRankings.map((student) => (
                    <div
                      key={student.userId}
                      className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-black text-xs flex items-center justify-center shrink-0">
                          {student.rank}
                        </div>

                        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0">
                          <Image
                            src={student.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=User'}
                            alt={student.name}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>

                        <div className="min-w-0 space-y-0.5">
                          <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                            {student.name}
                          </h4>
                          <p className="text-[11px] text-slate-400 truncate">
                            {student.gradeLevel} • {student.classroom} • {student.schoolName}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-black text-slate-900 dark:text-white text-xs sm:text-sm font-mono block">
                          {student.points.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-400">คะแนนสะสม</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
