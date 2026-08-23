import React from 'react';
import { Newspaper } from 'lucide-react';
import { getArticles } from '@/services/articles';
import { WorkCard } from '@/components/public/work-card';

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-tr from-slate-900 via-blue-950 to-indigo-950 text-white shadow-xl space-y-3 border border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold backdrop-blur-xs">
          <Newspaper className="w-3.5 h-3.5" />
          <span>Articles, Tutorials & Teaching Insights</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          บทความและคลังความรู้สำหรับครู
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed font-normal">
          บทความวิชาการ เทคนิคการสอน Active Learning ทิปส์การประยุกต์ใช้ AI ในห้องเรียน และประสบการณ์การจัดการศึกษา
        </p>
      </div>

      {/* Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            บทความทั้งหมด ({articles.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {articles.map((art) => (
            <WorkCard key={art.id} work={art} />
          ))}
        </div>
      </div>
    </div>
  );
}
