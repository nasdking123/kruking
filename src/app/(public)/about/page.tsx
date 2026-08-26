import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { 
  GraduationCap, 
  Award, 
  BookOpen, 
  Sparkles, 
  Mail, 
  CheckCircle2
} from 'lucide-react';
import { getPageBySlug } from '@/services/pages';
import { formatDateThai } from '@/lib/utils';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('about');
  return {
    title: page?.seo_title || page?.title || 'เกี่ยวกับครูคิง (About Teacher) | ครูผู้สอนวิทยาการคำนวณและเทคโนโลยี',
    description: page?.seo_description || page?.excerpt || 'ประวัติ ผลงาน นวัตกรรมการศึกษา Active Learning และประสบการณ์การจัดการเรียนรู้วิทยาการคำนวณของครูคิง',
  };
}

export default async function AboutPage() {
  const page = await getPageBySlug('about');

  const title = page?.title || 'ยินดีต้อนรับสู่ห้องสื่อ ครูจักรพงษ์ สำรองพันธ์ (ครูคิง)';
  const excerpt = page?.excerpt || 'ครูผู้มุ่งมั่นพัฒนาการศึกษาสมัยใหม่ มุ่งเน้นการจัดกิจกรรมการเรียนรู้แบบ Active Learning พัฒนาทักษะการคิดเชิงคำนวณ (Computational Thinking) และถ่ายทอดองค์ความรู้ด้านเทคโนโลยีดิจิทัลสู่ผู้เรียน';
  const coverImage = page?.cover_image || 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop';
  const content = page?.content || '';

  const skills = [
    'การจัดการเรียนรู้ Active Learning 5E',
    'การสอน Coding & Scratch ขั้นสูง',
    'Unplugged Coding & บอร์ดเกมการศึกษา',
    'การประยุกต์ใช้ AI ในการสร้างสื่อและแผนการสอน',
    'การออกแบบสื่อการสอนดิจิทัล & แคนวา (Canva)',
    'การทำผลงานวิทยฐานะ ว.PA',
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-in fade-in">
      {/* 1. Hero Profile Banner */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-blue-50 via-white to-indigo-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/30 border border-slate-200/80 dark:border-slate-800/80 shadow-sm relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Avatar / Portrait */}
          <div className="md:col-span-4 flex justify-center">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 bg-slate-100">
              <Image
                src={coverImage}
                alt={title}
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>

          {/* Intro Text */}
          <div className="md:col-span-8 space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ครูผู้สอนกลุ่มสาระวิทยาศาสตร์และเทคโนโลยี • โรงเรียนวัดบางโฉลงใน</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {title}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {excerpt}
            </p>

            {/* Quick Badges */}
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <Link
                href="/contact"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
              >
                <Mail className="w-4 h-4" />
                <span>ติดต่อสอบถาม</span>
              </Link>
              <Link
                href="/portfolio"
                className="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
              >
                <Award className="w-4 h-4 text-amber-500" />
                <span>ชมผลงานและรางวัล</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Dynamic Content Body (From Admin Page Editor) */}
      {content && (
        <section className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              <span>ข้อมูลประวัติ ผลงาน และวิสัยทัศน์</span>
            </h2>
            {page?.updated_at && (
              <span className="text-xs text-slate-400">
                อัปเดตล่าสุด: {formatDateThai(page.updated_at)}
              </span>
            )}
          </div>

          <article className="prose prose-slate dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed space-y-4">
            {content.split('\n\n').map((para, idx) => {
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
        </section>
      )}

      {/* 3. Skill & Competency Tags */}
      <section className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-600" />
          <span>ทักษะและความเชี่ยวชาญเฉพาะด้าน</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
          {skills.map((skill, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 shadow-xs flex items-center gap-2.5 text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{skill}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
