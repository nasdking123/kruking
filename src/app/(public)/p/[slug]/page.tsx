import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Calendar, User, ArrowLeft, Globe, Sparkles } from 'lucide-react';
import { getPageBySlug } from '@/services/pages';
import { formatDateThai } from '@/lib/utils';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) return { title: 'ไม่พบหน้านี้' };

  return {
    title: `${page.seo_title || page.title} | ครูจักรพงษ์ สำรองพันธ์`,
    description: page.seo_description || page.excerpt || undefined,
    openGraph: {
      title: page.seo_title || page.title,
      description: page.seo_description || page.excerpt || undefined,
      images: page.og_image ? [{ url: page.og_image }] : undefined,
    },
  };
}

export default async function DynamicPublicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page || page.status === 'draft') {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-blue-600 transition-colors">หน้าแรก</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 dark:text-white font-medium truncate max-w-xs">{page.title}</span>
      </nav>

      {/* Header Info */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold">
          <Globe className="w-3.5 h-3.5" />
          <span>หน้าข้อมูลพิเศษ (Dynamic Page)</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          {page.title}
        </h1>

        {page.excerpt && (
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {page.excerpt}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 pb-4 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              <span>{formatDateThai(page.created_at)}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-500" />
              <span>ครูจักรพงษ์ สำรองพันธ์</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-[11px] text-slate-500">
              /p/{page.slug}
            </span>
          </div>
        </div>
      </div>

      {/* Cover Image if any */}
      {page.cover_image && (
        <div className="rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={page.cover_image}
            alt={page.title}
            className="w-full max-h-[420px] object-cover"
          />
        </div>
      )}

      {/* Content Area */}
      <article className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-5 text-sm sm:text-base leading-relaxed">
        {page.content?.split('\n\n').map((para, idx) => {
          const trimmed = para.trim();
          if (!trimmed) return null;

          if (trimmed.startsWith('# ')) {
            return (
              <h1 key={idx} className="text-2xl sm:text-3xl font-extrabold mt-6 mb-3 text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                {trimmed.replace('# ', '')}
              </h1>
            );
          }
          if (trimmed.startsWith('## ')) {
            return (
              <h2 key={idx} className="text-xl sm:text-2xl font-bold mt-5 mb-2 text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span>{trimmed.replace('## ', '')}</span>
              </h2>
            );
          }
          if (trimmed.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-lg font-bold mt-4 mb-2 text-slate-900 dark:text-white">
                {trimmed.replace('### ', '')}
              </h3>
            );
          }
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const listItems = trimmed.split('\n');
            return (
              <ul key={idx} className="list-disc pl-6 space-y-1.5 text-slate-700 dark:text-slate-300">
                {listItems.map((li, liIdx) => (
                  <li key={liIdx} className="leading-relaxed">
                    {li.replace(/^[-*]\s+/, '')}
                  </li>
                ))}
              </ul>
            );
          }
          return (
            <p key={idx} className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {trimmed}
            </p>
          );
        })}
      </article>

      {/* Footer Navigation */}
      <div className="pt-6 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับหน้าแรก</span>
        </Link>
      </div>
    </div>
  );
}
