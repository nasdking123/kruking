import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { 
  Swords, 
  Trophy, 
  ChevronRight, 
  Coins, 
  ArrowLeft
} from 'lucide-react';
import { StudentNavBar } from '@/components/public/student-nav-bar';
import { getCompetitionDetail } from '@/services/competitions';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { competition } = await getCompetitionDetail(id);
  if (!competition) return { title: 'ไม่พบการแข่งขันนี้' };

  return {
    title: `${competition.title} | การแข่งขันนักเรียน`,
    description: competition.description || undefined,
  };
}

export default async function CompetitionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { competition, results } = await getCompetitionDetail(id);

  if (!competition) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-16">
      <StudentNavBar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-blue-600 transition-colors">หน้าแรก</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/competitions" className="hover:text-blue-600 transition-colors">ศูนย์การแข่งขัน</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 dark:text-white font-bold truncate max-w-xs">{competition.title}</span>
        </nav>

        {/* Competition Header Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-tr from-purple-950 via-slate-900 to-indigo-950 text-white shadow-xl space-y-4 border border-purple-900/40">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-purple-500 text-white text-xs font-bold">
              {competition.subject}
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black flex items-center gap-1">
              <Coins className="w-3.5 h-3.5" />
              <span>+{competition.pointsReward} แต้มโบนัส</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-bold">
              {competition.gradeLevel || 'ทุกระดับชั้น'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
            {competition.title}
          </h1>

          {competition.description && (
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              {competition.description}
            </p>
          )}
        </div>

        {/* Results Board */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>ผลการแข่งขันและตารางคะแนน (Results Leaderboard)</span>
            </h2>
            <span className="text-xs text-slate-400 font-bold">
              {results.length} ผู้เข้าร่วม
            </span>
          </div>

          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-md overflow-hidden">
            {results.length === 0 ? (
              <div className="p-16 text-center space-y-2">
                <Swords className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  กำลังอยู่ระหว่างการประมวลผลคะแนนการแข่งขัน
                </p>
                <p className="text-xs text-slate-400">
                  คุณครูกำลังตรวจผลงานและบันทึกคะแนนลงสู่ระบบ
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {results.map((res) => (
                  <div
                    key={res.id}
                    className="p-5 flex items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-2xl font-black text-sm flex items-center justify-center shrink-0 shadow-xs ${
                          res.rank === 1
                            ? 'bg-amber-400 text-slate-950 font-extrabold shadow-md'
                            : res.rank === 2
                            ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                            : res.rank === 3
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}
                      >
                        {res.rank === 1 ? '🥇 1' : res.rank === 2 ? '🥈 2' : res.rank === 3 ? '🥉 3' : `#${res.rank}`}
                      </div>

                      <div className="min-w-0 space-y-0.5">
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                          {res.studentName}
                        </h4>
                        <p className="text-xs text-slate-400 truncate">
                          {res.studentGrade} • {res.studentSchool}
                        </p>
                        {res.notes && (
                          <p className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
                            💬 {res.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-black text-slate-900 dark:text-white text-base font-mono block">
                        {res.score} คะแนน
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold">
                        ผ่านเกณฑ์การแข่งขัน
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Back Link */}
        <div>
          <Link
            href="/competitions"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับหน้ารวมการแข่งขัน</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
