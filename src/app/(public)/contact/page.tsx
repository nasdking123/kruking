import React from 'react';
import type { Metadata } from 'next';
import { Mail, Phone, CheckCircle, Clock } from 'lucide-react';
import { getPageBySlug } from '@/services/pages';
import ContactFormClient from './contact-form';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('contact');
  return {
    title: page?.seo_title || page?.title || 'ติดต่อสอบถาม (Contact Us) | ห้องสื่อครูคิง',
    description: page?.seo_description || page?.excerpt || 'มีข้อสงสัยเกี่ยวกับสื่อการสอน ขอไฟล์ต้นฉบับ หรือสนใจอบรมเชิงปฏิบัติการ ติดต่อครูคิงได้เลยครับ',
  };
}

export default async function ContactPage() {
  const page = await getPageBySlug('contact');

  const title = page?.title || 'ติดต่อสอบถาม (Contact Us)';
  const excerpt = page?.excerpt || 'มีข้อสงสัยเกี่ยวกับสื่อการสอน ขอไฟล์ต้นฉบับ หรือสนใจอบรมเชิงปฏิบัติการ ติดต่อได้เลยครับ';
  const content = page?.content || '';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-in fade-in">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          {excerpt}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 5 Cols: Contact Details & Dynamic Content */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-blue-600 text-white shadow-lg space-y-6">
            <div>
              <span className="text-xs font-semibold text-blue-200 uppercase tracking-wider block">
                ช่องทางการติดต่อโดยตรง
              </span>
              <h2 className="text-xl font-bold mt-1">ห้องสื่อครูจักรพงษ์ สำรองพันธ์</h2>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-blue-200 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-blue-200">อีเมลติดต่อ</span>
                  <span className="font-semibold text-sm">kruking.teaching@gmail.com</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-blue-200 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-blue-200">เบอร์โทรศัพท์</span>
                  <span className="font-semibold text-sm">081-234-5678</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-blue-200 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-blue-200">เวลาทำการตอบข้อความ</span>
                  <span className="font-semibold text-sm">จันทร์ - ศุกร์ (08:30 - 17:00 น.)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Content if provided in Page Editor */}
          {content && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-3 text-xs">
              <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                รายละเอียดและข้อมูลเพิ่มเติม
              </h3>
              <div className="prose prose-slate dark:prose-invert text-xs space-y-2 text-slate-600 dark:text-slate-300">
                {content.split('\n\n').map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </div>
          )}

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              บริการและเรื่องที่ให้คำปรึกษา
            </h3>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>ขอคำแนะนำแผนการสอน 5E & ว.PA</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>การจัดกิจกรรม Unplugged Coding</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>วิทยากรบรรยายการใช้ AI สำหรับครู</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right 7 Cols: Contact Form Client */}
        <div className="lg:col-span-7">
          <ContactFormClient />
        </div>
      </div>
    </div>
  );
}
