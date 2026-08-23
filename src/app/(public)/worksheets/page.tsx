import React from 'react';
import { FileText } from 'lucide-react';
import { getWorksheets } from '@/services/worksheets';
import { WorkCard } from '@/components/public/work-card';

export default async function WorksheetsPage() {
  const worksheets = await getWorksheets();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-700 text-white shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs">
          <FileText className="w-3.5 h-3.5" />
          <span>Worksheets & Printable Exercises</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          คลังใบงานและแบบฝึกหัดดาวน์โหลดฟรี
        </h1>
        <p className="text-sm text-emerald-100 max-w-2xl leading-relaxed font-normal">
          ใบงานวิทยาการคำนวณและแบบฝึกหัด Active Learning ทุกระดับชั้น (ป.1 - ม.3) พร้อมไฟล์ PDF ความคมชัดสูงและเฉลยละเอียด
        </p>
      </div>

      {/* Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            ใบงานทั้งหมด ({worksheets.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {worksheets.map((ws) => (
            <WorkCard key={ws.id} work={ws} />
          ))}
        </div>
      </div>
    </div>
  );
}
