import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  Award, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  ArrowLeft
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `ตรวจสอบเกียรติบัตรออนไลน์ รหัส ${id.slice(0, 8).toUpperCase()} | KruKing`,
    description: 'ระบบตรวจสอบความถูกต้องของเกียรติบัตรออนไลน์ โรงเรียนวัดบางโฉลงใน',
  };
}

export default async function CertificatePublicVerificationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createClient();

  // Search in student_certificates or classroom certificates
  const { data: cert } = await supabase
    .from('student_certificates')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!cert) {
    // If not found, display clear not found verification box
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto shadow-md">
            <Award className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            ไม่พบข้อมูลเกียรติบัตรฉบับนี้
          </h2>

          <p className="text-xs text-slate-500 leading-relaxed">
            รหัสเกียรติบัตร <code className="font-mono text-slate-800 dark:text-slate-200 font-bold">{id}</code> ไม่ตรงกับฐานข้อมูลที่ได้รับการอนุมัติในระบบ
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold transition-all hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับหน้าหลัก</span>
          </Link>
        </div>
      </div>
    );
  }

  const isApproved = cert.status === 'approved';
  const formattedDate = new Date(cert.issue_date || cert.created_at).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8 animate-in fade-in">
      {/* Header Badge */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold shadow-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>ระบบตรวจสอบเกียรติบัตรอย่างเป็นทางการ (Official Verification)</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          ผลการตรวจสอบความถูกต้องของเกียรติบัตร
        </h1>
        <p className="text-xs text-slate-500 font-mono">
          Certificate ID: {cert.id}
        </p>
      </div>

      {/* Verification Card */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xl overflow-hidden">
        {/* Status Strip */}
        <div className={`p-4 text-center font-extrabold text-xs flex items-center justify-center gap-2 ${
          isApproved 
            ? 'bg-emerald-500 text-white shadow-xs' 
            : 'bg-amber-500 text-slate-950 shadow-xs'
        }`}>
          {isApproved ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>เกียรติบัตรฉบับนี้เป็นของแท้ และได้รับการรับรองจากครูผู้สอน/สถานศึกษาแล้ว 100%</span>
            </>
          ) : (
            <>
              <Calendar className="w-4 h-4" />
              <span>เกียรติบัตรนี้อยู่ระหว่างการตรวจสอบและรอการอนุมัติ (Pending Verification)</span>
            </>
          )}
        </div>

        <div className="p-6 sm:p-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Left: Info details */}
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  ชื่อผู้ได้รับเกียรติบัตร
                </span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white block mt-0.5">
                  {cert.student_name}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  ผลงาน / รางวัล / รายวิชา
                </span>
                <span className="text-sm sm:text-base font-bold text-blue-600 dark:text-blue-400 block mt-0.5">
                  {cert.title}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    หน่วยงานที่ออกให้
                  </span>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block mt-0.5">
                    {cert.issuer || 'โรงเรียนวัดบางโฉลงใน'}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    วันที่ออกเกียรติบัตร
                  </span>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block mt-0.5">
                    {formattedDate}
                  </span>
                </div>
              </div>

              {cert.award_tier && (
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    ระดับรางวัล
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-extrabold text-xs mt-1">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>{cert.award_tier} ({cert.competition_level || 'ระดับสถานศึกษา'})</span>
                  </span>
                </div>
              )}
            </div>

            {/* Right: Certificate Image or Seal */}
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60 text-center space-y-3">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-white flex items-center justify-center shadow-lg">
                <Award className="w-10 h-10" />
              </div>

              <div className="space-y-0.5">
                <span className="text-xs font-black text-slate-900 dark:text-white block">
                  ครูจักรพงษ์ สำรองพันธ์ (ครูคิง)
                </span>
                <span className="text-[10px] text-slate-500 block">
                  โรงเรียนวัดบางโฉลงใน สพป.สมุทรปราการ เขต 2
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <Link
              href="/student/certificates"
              className="text-xs text-slate-500 hover:text-blue-600 font-bold flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>ดูคลังเกียรติบัตรทั้งหมด</span>
            </Link>

            <Link
              href="/"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              หน้าแรก KruKing Platform
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
