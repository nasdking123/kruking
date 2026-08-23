import React from 'react';
import { Camera } from 'lucide-react';
import { getActivities } from '@/services/activities';
import { WorkCard } from '@/components/public/work-card';

export default async function ActivitiesPage() {
  const activities = await getActivities();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-tr from-pink-600 via-rose-600 to-red-700 text-white shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs">
          <Camera className="w-3.5 h-3.5" />
          <span>Activity Photo Logs & Workshops</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          ภาพกิจกรรมและค่ายการเรียนรู้
        </h1>
        <p className="text-sm text-pink-100 max-w-2xl leading-relaxed font-normal">
          ประมวลภาพกิจกรรมการเรียนการสอน ค่าย Coding & AI อบรมเชิงปฏิบัติการ และงานวิทยากรบรรยาย
        </p>
      </div>

      {/* Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            กิจกรรมทั้งหมด ({activities.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {activities.map((act) => (
            <WorkCard key={act.id} work={act} />
          ))}
        </div>
      </div>
    </div>
  );
}
