import React from 'react';
import { Trophy, Calendar, Award, Building, ExternalLink } from 'lucide-react';
import { getAwards } from '@/services/awards';
import { Badge } from '@/components/ui/badge';

export default async function AwardsPage() {
  const awards = await getAwards();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-tr from-amber-600 via-yellow-600 to-amber-700 text-white shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs">
          <Trophy className="w-3.5 h-3.5" />
          <span>Awards, Honors & Certificates</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          รางวัลและความภาคภูมิใจ
        </h1>
        <p className="text-sm text-amber-100 max-w-2xl leading-relaxed font-normal">
          ประมวลรางวัลเชิดชูเกียรติ เกียรติบัตร และผลงานดีเด่นด้านการจัดการเรียนรู้วิทยาการคำนวณและนวัตกรรมการศึกษา
        </p>
      </div>

      {/* Awards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {awards.map((a) => (
          <div
            key={a.id}
            className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div>
              {/* Cover/Certificate preview */}
              <div className="relative aspect-16/10 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                {a.cover_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={a.cover_image}
                    alt={a.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-amber-500">
                    <Trophy className="w-12 h-12 opacity-30" />
                  </div>
                )}
                {Boolean(a.details?.award_level) && (
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-amber-500 text-white text-[11px] font-bold shadow-md flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    <span>{`${a.details?.award_level}`}</span>
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  <span>ปีการศึกษา {a.details?.year ? `${a.details.year}` : '2568'}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {a.title}
                </h3>

                {a.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {a.description}
                  </p>
                )}

                {Boolean(a.details?.issued_by) && (
                  <div className="pt-2 flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>หน่วยงานที่มอบ: {`${a.details?.issued_by}`}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50/60 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <Badge variant="warning">เกียรติบัตรรับรอง</Badge>
              {Boolean(a.details?.certificate_url) && (
                <a
                  href={`${a.details?.certificate_url}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                >
                  <span>ดูเกียรติบัตร</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
