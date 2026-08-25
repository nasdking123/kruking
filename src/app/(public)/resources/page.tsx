import React from 'react';
import { FolderOpen } from 'lucide-react';
import { getResources } from '@/services/resources';
import { WorkCard } from '@/components/public/work-card';

export default async function ResourcesPage() {
  const resources = await getResources();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-700 to-slate-900 text-white shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs">
          <FolderOpen className="w-3.5 h-3.5" />
          <span>Teaching Materials & Media</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          สื่อและนวัตกรรมการเรียนรู้ (Resources)
        </h1>
        <p className="text-sm text-blue-100 max-w-2xl leading-relaxed font-normal">
          คลังสื่อประกอบการสอน สไลด์บรรยาย Infographic และสื่อมัลติมีเดีย วิชาประวัติศาสตร์ (ป.6, ป.3), หลักสูตรต้านทุจริตศึกษา (ป.6) และวิทยาการคำนวณ
        </p>
      </div>

      {/* Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            สื่อการสอนทั้งหมด ({resources.length})
          </h2>
        </div>

        {resources.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-slate-50 dark:bg-slate-900 rounded-3xl">
            ยังไม่มีสื่อการสอนในระบบ
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {resources.map((r) => (
              <WorkCard key={r.id} work={r} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
