import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Calendar, User, ArrowLeft, Share2 } from 'lucide-react';
import { getPageBySlug } from '@/services/pages';
import { formatDateThai } from '@/lib/utils';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) return { title: 'ไม่พบหน้านี้' };

  return {
    title: page.seo_title || page.title,
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

  if (!page) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-blue-600 transition-colors">หน้าแรก</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 dark:text-white font-medium truncate max-w-xs">{page.title}</span>
      </nav>

      {/* Header Info */}
      <div className="space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          {page.title}
        </h1>

        {page.excerpt && (
          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
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
              <span>ครูคิง</span>
            </span>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>แชร์หน้านี้</span>
          </button>
        </div>
      </div>

      {/* Cover Image if any */}
      {page.cover_image && (
        <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={page.cover_image}
            alt={page.title}
            className="w-full max-h-96 object-cover"
          />
        </div>
      )}

      {/* Markdown Content */}
      <article className="prose prose-slate dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed space-y-4">
        {page.content?.split('\n\n').map((para, idx) => {
          if (para.startsWith('# ')) {
            return <h1 key={idx} className="text-2xl font-bold mt-6 mb-2 text-slate-900 dark:text-white">{para.replace('# ', '')}</h1>;
          }
          if (para.startsWith('## ')) {
            return <h2 key={idx} className="text-xl font-bold mt-5 mb-2 text-slate-900 dark:text-white">{para.replace('## ', '')}</h2>;
          }
          if (para.startsWith('- ')) {
            return (
              <ul key={idx} className="list-disc pl-5 space-y-1">
                {para.split('\n').map((li, lIdx) => (
                  <li key={lIdx}>{li.replace('- ', '')}</li>
                ))}
              </ul>
            );
          }
          return <p key={idx} className="text-slate-700 dark:text-slate-300">{para}</p>;
        })}
      </article>

      {/* Footer Back Button */}
      <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับหน้าแรก</span>
        </Link>
      </div>
    </div>
  );
}
