import React from 'react';
import { GraduationCap } from 'lucide-react';
import { getResearch } from '@/services/research';
import { WorkCard } from '@/components/public/work-card';

export default async function ResearchPage() {
  const researches = await getResearch();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-tr from-violet-700 via-purple-700 to-indigo-800 text-white shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Classroom Action Research (CAR)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          งานวิจัยในชั้นเรียนและวิชาการ
        </h1>
        <p className="text-sm text-violet-100 max-w-2xl leading-relaxed font-normal">
          รายงานผลการวิจัยเชิงปฏิบัติการในชั้นเรียน นวัตกรรมการแก้ปัญหาการเรียนรู้ และงานวิจัยทางการศึกษาวิทยาการคำนวณ
        </p>
      </div>

      {/* Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            งานวิจัยทั้งหมด ({researches.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {researches.map((r) => (
            <WorkCard key={r.id} work={r} />
          ))}
        </div>
      </div>
    </div>
  );
}
