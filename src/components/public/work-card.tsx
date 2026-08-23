import React from 'react';
import Link from 'next/link';
import { 
  Eye, 
  Download, 
  BookOpen, 
  FileText, 
  Gamepad2, 
  FolderOpen, 
  Sparkles,
  Trophy,
  ArrowRight
} from 'lucide-react';
import type { WorkWithRelations } from '@/services/works';

interface WorkCardProps {
  work: WorkWithRelations;
}

const typeIcons: Record<string, React.ElementType> = {
  resource: FolderOpen,
  worksheet: FileText,
  game: Gamepad2,
  lesson_plan: BookOpen,
  innovation: Sparkles,
  award: Trophy,
};

const typeLabels: Record<string, string> = {
  resource: 'สื่อการสอน',
  worksheet: 'ใบงาน',
  game: 'เกมการเรียนรู้',
  lesson_plan: 'แผนการสอน',
  innovation: 'นวัตกรรม',
  award: 'รางวัล',
  article: 'บทความ',
  teaching: 'การสอน',
};

export function WorkCard({ work }: WorkCardProps) {
  const Icon = typeIcons[work.type] || FolderOpen;
  const typeLabel = typeLabels[work.type] || work.type;

  let href = `/portfolio/${work.slug}`;
  if (work.type === 'resource') href = `/resources/${work.slug}`;
  if (work.type === 'worksheet') href = `/worksheets/${work.slug}`;
  if (work.type === 'game') href = `/games/${work.slug}`;

  return (
    <div className="group flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200 overflow-hidden">
      <div>
        {/* Cover Image Area */}
        <Link href={href} className="relative block aspect-16/10 overflow-hidden bg-slate-100 dark:bg-slate-800">
          {work.cover_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={work.cover_image}
              alt={work.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <Icon className="w-10 h-10 opacity-40" />
            </div>
          )}

          {/* Type Badge Floating */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold shadow-xs">
            <Icon className="w-3.5 h-3.5 text-blue-400" />
            <span>{typeLabel}</span>
          </div>

          {work.featured && (
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-extrabold tracking-wide uppercase shadow-xs">
              แนะนำ
            </div>
          )}
        </Link>

        {/* Content Body */}
        <div className="p-5 space-y-2.5">
          {/* Metadata pill row */}
          <div className="flex items-center gap-2 flex-wrap text-[11px] text-slate-500 dark:text-slate-400">
            {work.grade_level && (
              <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 font-semibold">
                {work.grade_level}
              </span>
            )}
            {work.subject && (
              <span className="font-medium text-slate-600 dark:text-slate-300">
                {work.subject}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            <Link href={href}>{work.title}</Link>
          </h3>

          {/* Description */}
          {work.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-normal">
              {work.description}
            </p>
          )}
        </div>
      </div>

      {/* Footer Stats & CTA */}
      <div className="px-5 py-3.5 bg-slate-50/60 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            <span>{work.view_count}</span>
          </span>
          <span className="flex items-center gap-1">
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>{work.download_count}</span>
          </span>
        </div>

        <Link
          href={href}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform"
        >
          <span>ดูรายละเอียด</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
