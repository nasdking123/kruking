import React from 'react';
import { Sparkles } from 'lucide-react';
import { getInnovations } from '@/services/innovations';
import { WorkCard } from '@/components/public/work-card';

export default async function InnovationPage() {
  const innovations = await getInnovations();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-tr from-amber-600 via-orange-600 to-rose-700 text-white shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Educational Innovations & Teaching Kits</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          นวัตกรรมการจัดการเรียนรู้
        </h1>
        <p className="text-sm text-amber-100 max-w-2xl leading-relaxed font-normal">
          รวมสิ่งประดิษฐ์ สื่อนวัตกรรม Active Learning โมเดลการสอน และเครื่องมือดิจิทัลที่ผ่านการพัฒนาและคว้ารางวัลชนะเลิศ
        </p>
      </div>

      {/* Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            นวัตกรรมทั้งหมด ({innovations.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {innovations.map((inv) => (
            <WorkCard key={inv.id} work={inv} />
          ))}
        </div>
      </div>
    </div>
  );
}
