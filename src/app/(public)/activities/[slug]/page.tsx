import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  ChevronRight, 
  Calendar, 
  Eye, 
  ArrowLeft, 
  Camera,
  MapPin,
  Users
} from 'lucide-react';
import { getWorkBySlug, trackWorkView } from '@/services/works';
import { formatDateThai } from '@/lib/utils';
import { ShareButtons } from '@/components/public/share-buttons';
import { Badge } from '@/components/ui/badge';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const work = await getWorkBySlug(slug);
  if (!work) return { title: 'ไม่พบกิจกรรมนี้' };

  return {
    title: `${work.title} | ภาพกิจกรรมครูคิง`,
    description: work.description || undefined,
  };
}

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = await getWorkBySlug(slug);

  if (!work) {
    notFound();
  }

  await trackWorkView(work.id);

  const photos = (work.details?.photos as string[]) || [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-blue-600 transition-colors">หน้าแรก</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/activities" className="hover:text-blue-600 transition-colors">ภาพกิจกรรม</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 dark:text-white font-medium truncate max-w-xs">{work.title}</span>
      </nav>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="danger">ภาพกิจกรรมการสอน</Badge>
          {work.grade_level && <Badge variant="outline">{work.grade_level}</Badge>}
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          {work.title}
        </h1>

        {work.description && (
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {work.description}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 pb-4 border-y border-slate-200 dark:border-slate-800 text-xs text-slate-500">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-pink-500" />
              <span>{work.details?.event_date ? `${work.details.event_date}` : formatDateThai(work.published_at || work.created_at)}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>{work.view_count} ครั้ง</span>
            </span>
          </div>

          <ShareButtons title={work.title} />
        </div>
      </div>

      {/* Event Details Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Boolean(work.details?.location) && (
          <div className="p-4 rounded-2xl bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-900/60 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-pink-100 dark:bg-pink-900/50 text-pink-600">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-500">สถานที่จัดกิจกรรม</div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">{`${work.details?.location}`}</div>
            </div>
          </div>
        )}

        {Boolean(work.details?.participant_count) && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-600">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-500">จำนวนผู้เข้าร่วม</div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">{`${work.details?.participant_count}`} คน</div>
            </div>
          </div>
        )}
      </div>

      {/* Main Cover Image */}
      {work.cover_image && (
        <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={work.cover_image}
            alt={work.title}
            className="w-full max-h-[450px] object-cover"
          />
        </div>
      )}

      {/* Content */}
      <article className="prose prose-slate dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed space-y-4">
        {work.content?.split('\n\n').map((para, idx) => {
          if (para.startsWith('# ')) {
            return <h1 key={idx} className="text-2xl font-bold mt-6 mb-2 text-slate-900 dark:text-white">{para.replace('# ', '')}</h1>;
          }
          if (para.startsWith('## ')) {
            return <h2 key={idx} className="text-xl font-bold mt-5 mb-2 text-slate-900 dark:text-white">{para.replace('## ', '')}</h2>;
          }
          return <p key={idx} className="text-slate-700 dark:text-slate-300">{para}</p>;
        })}
      </article>

      {/* Photo Gallery Grid */}
      {photos.length > 0 && (
        <div className="space-y-3 pt-6 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Camera className="w-4 h-4 text-pink-500" />
            <span>อัลบั้มภาพกิจกรรม ({photos.length} รูป)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((imgUrl, pIdx) => (
              <div key={pIdx} className="rounded-xl overflow-hidden shadow-xs aspect-4/3 bg-slate-100 dark:bg-slate-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgUrl}
                  alt={`กิจกรรม ${pIdx + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Back Button */}
      <div className="pt-4">
        <Link
          href="/activities"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับหน้ารวมภาพกิจกรรม</span>
        </Link>
      </div>
    </div>
  );
}
