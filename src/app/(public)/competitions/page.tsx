'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Swords, 
  ArrowRight, 
  Coins, 
  Loader2
} from 'lucide-react';
import { StudentNavBar } from '@/components/public/student-nav-bar';
import { getCompetitions, type CompetitionItem } from '@/services/competitions';

export default function CompetitionsHubPage() {
  const [loading, setLoading] = useState(true);
  const [competitions, setCompetitions] = useState<CompetitionItem[]>([]);

  useEffect(() => {
    getCompetitions().then((data) => {
      setCompetitions(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-16">
      <StudentNavBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
        {/* Hero Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-purple-900/30">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold flex items-center gap-1.5 border border-purple-500/30">
                <Swords className="w-3.5 h-3.5" />
                <span>ศูนย์การแข่งขันวิชาการและทักษะโค้ดดิ้ง</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold">
                {competitions.length} รายการแข่งขัน
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              Student Competitions & Coding Challenges
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-normal leading-relaxed">
              ร่วมประลองทักษะการเขียนโปรแกรม Scratch วิทยาการคำนวณ และประวัติศาสตร์ เพื่อชิงรางวัลเกียรติบัตรและคะแนนสะสมพิเศษ (Bonus Points)
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            <span className="text-xs text-slate-500 font-bold">กำลังโหลดรายการการแข่งขัน...</span>
          </div>
        ) : competitions.length === 0 ? (
          <div className="p-16 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 space-y-2">
            <Swords className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              ยังไม่มีรายการแข่งขันที่เปิดรับในขณะนี้
            </p>
            <p className="text-xs text-slate-400">
              โปรดติดตามประกาศการแข่งขันใหม่จากคุณครูเร็วๆ นี้
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {competitions.map((comp) => (
              <div
                key={comp.id}
                className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:border-purple-400 hover:shadow-lg transition-all flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[10px] font-extrabold">
                      {comp.subject}
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-extrabold flex items-center gap-1">
                      <Coins className="w-3 h-3" />
                      <span>+{comp.pointsReward} แต้มโบนัส</span>
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                    {comp.title}
                  </h3>

                  {comp.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {comp.description}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                  <span className="text-[11px] text-slate-400 font-medium">
                    {comp.gradeLevel || 'ทุกระดับชั้น'}
                  </span>

                  <Link
                    href={`/competitions/${comp.id}`}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>ดูผลและรายละเอียด</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
