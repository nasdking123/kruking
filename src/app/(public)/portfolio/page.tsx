import React from 'react';
import { Trophy } from 'lucide-react';
import { getWorks } from '@/services/works';
import { WorkCard } from '@/components/public/work-card';

export default async function PortfolioPage() {
  const works = await getWorks();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-tr from-blue-700 via-indigo-700 to-violet-800 text-white shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs">
          <Trophy className="w-3.5 h-3.5" />
          <span>Teacher Portfolio & Academic Showcase</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          ผลงานและนวัตกรรมครูคิง
        </h1>
        <p className="text-sm text-blue-100 max-w-2xl leading-relaxed font-normal">
          รวบรวมผลงานทางวิชาการ สื่อการสอนยอดเยี่ยม นวัตกรรม Active Learning และเกียรติประวัติการจัดการศึกษา
        </p>
      </div>

      {/* Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            ผลงานทั้งหมด ({works.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {works.map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>
      </div>
    </div>
  );
}
