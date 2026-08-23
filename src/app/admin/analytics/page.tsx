import React from 'react';
import { 
  BarChart3, 
  Eye, 
  Download, 
  BookOpen, 
  School, 
  CheckSquare, 
  TrendingUp, 
  Clock 
} from 'lucide-react';
import { getPlatformAnalytics } from '@/services/analytics';

export default async function AnalyticsDashboardPage() {
  const analytics = await getPlatformAnalytics();

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              สถิติและการใช้งานแพลตฟอร์ม (Platform Analytics)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            รายงานสถิติการเข้าชม การดาวน์โหลดใบงาน สื่อการสอน และกิจกรรมการเรียนรู้แบบ Real-time
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>ระบบบันทึกสถิติอัตโนมัติ</span>
          </span>
        </div>
      </div>

      {/* Top 5 Key Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>ยอดผู้เข้าชมทั้งหมด</span>
            <Eye className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {analytics.totalViews.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+14.2% จากสัปดาห์ก่อน</span>
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>ยอดดาวน์โหลดไฟล์</span>
            <Download className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {analytics.totalDownloads.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400">
            เอกสาร สื่อ และใบงาน
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>ผลงานและสื่อเผยแพร่</span>
            <BookOpen className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {analytics.totalWorks} รายการ
          </div>
          <span className="text-[11px] text-slate-400">
            ครอบคลุม 10 หมวดหมู่
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>ห้องเรียนออนไลน์</span>
            <School className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {analytics.totalClassrooms} ห้องเรียน
          </div>
          <span className="text-[11px] text-slate-400">
            เปิดสอนวิทยาการคำนวณ
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-2 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>ชุดแบบทดสอบ</span>
            <CheckSquare className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {analytics.totalQuizzes} ชุด
          </div>
          <span className="text-[11px] text-slate-400">
            พร้อมระบบเฉลยอัตโนมัติ
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Module Breakdown (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            สถิติแยกตามหมวดหมู่เนื้อหา (Module Breakdown)
          </h2>

          <div className="space-y-3">
            {analytics.moduleBreakdown.map((mod) => (
              <div
                key={mod.module}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between gap-4 text-xs"
              >
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 dark:text-white truncate">
                    {mod.name}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    จำนวน {mod.count} รายการ
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right shrink-0">
                  <div>
                    <span className="font-bold text-blue-600 block">{mod.views.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-400">ครั้งที่ชม</span>
                  </div>
                  <div>
                    <span className="font-bold text-emerald-600 block">{mod.downloads.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-400">ดาวน์โหลด</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Top Works & Recent Activity (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Top Works */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              ผลงานยอดนิยมสูงสุด (Top Content)
            </h2>

            <div className="space-y-3">
              {analytics.topWorks.map((work, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                      {work.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-400 shrink-0">
                    <Eye className="w-3.5 h-3.5 text-blue-500" />
                    <span>{work.views.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Visitor Activity */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>กิจกรรมล่าสุดบนเว็บไซต์</span>
            </h2>

            <div className="space-y-3 text-xs">
              {analytics.recentActivities.map((act) => (
                <div key={act.id} className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {act.action}: <span className="text-slate-500 font-normal">{act.target}</span>
                    </p>
                    <span className="text-[10px] text-slate-400">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
