import React from 'react';
import { Gamepad2 } from 'lucide-react';
import { getGames } from '@/services/games';
import { WorkCard } from '@/components/public/work-card';

export default async function GamesPage() {
  const games = await getGames();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-tr from-purple-700 via-indigo-700 to-pink-700 text-white shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs">
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>Educational Games & Unplugged Coding</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          เกมการเรียนรู้และ Coding เสริมทักษะ
        </h1>
        <p className="text-sm text-purple-100 max-w-2xl leading-relaxed font-normal">
          รวมเกมกระดาน Unplugged Coding บอร์ดเกมการศึกษา และเกมดิจิทัล ฝึกกระบวนการคิดเชิงคำนวณและการแก้ปัญหาอย่างสนุกสนาน
        </p>
      </div>

      {/* Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            เกมทั้งหมด ({games.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {games.map((g) => (
            <WorkCard key={g.id} work={g} />
          ))}
        </div>
      </div>
    </div>
  );
}
