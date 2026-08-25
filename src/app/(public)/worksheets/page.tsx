import React from 'react';
import { FileText } from 'lucide-react';
import { getWorksheets } from '@/services/worksheets';
import { WorkCard } from '@/components/public/work-card';

export default async function WorksheetsPage() {
  const worksheets = await getWorksheets();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-700 to-slate-900 text-white shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs">
          <FileText className="w-3.5 h-3.5" />
          <span>Printable Worksheets & Handouts</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          คลังใบงานและแบบฝึกหัด (Worksheets)
        </h1>
        <p className="text-sm text-emerald-100 max-w-2xl leading-relaxed font-normal">
          ใบงานแบบฝึกทักษะคุณภาพสูง วิชาประวัติศาสตร์ (ป.6, ป.3), ต้านทุจริตศึกษา (ป.6) และวิทยาการคำนวณ พร้อมแบบเฉลยและเกณฑ์การให้คะแนน
        </p>
      </div>

      {/* Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            ใบงานทั้งหมด ({worksheets.length})
          </h2>
        </div>

        {worksheets.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-slate-50 dark:bg-slate-900 rounded-3xl">
            ยังไม่มีใบงานในระบบ
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {worksheets.map((w) => (
              <WorkCard key={w.id} work={w} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
