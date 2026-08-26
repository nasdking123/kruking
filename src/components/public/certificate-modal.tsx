'use client';

import React, { useRef } from 'react';
import { 
  Award, 
  Printer, 
  X, 
  Sparkles, 
  CheckCircle2, 
  School
} from 'lucide-react';
import type { CertificateData } from '@/services/certificate';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CertificateData;
}

export function CertificateModal({ isOpen, onClose, data }: CertificateModalProps) {
  const certificateRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col my-auto">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-2 text-amber-600 font-extrabold text-sm sm:text-base">
            <Award className="w-5 h-5 text-amber-500" />
            <span>เกียรติบัตรออนไลน์ (E-Certificate)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>พิมพ์ / บันทึก PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-800"
              aria-label="ปิดหน้าต่าง"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Preview Container */}
        <div className="p-4 sm:p-8 flex items-center justify-center overflow-x-auto bg-slate-100 dark:bg-slate-950">
          <div 
            ref={certificateRef}
            className="w-full max-w-[780px] aspect-[1.414/1] bg-white text-slate-900 p-8 sm:p-12 rounded-2xl shadow-xl relative border-[12px] border-double border-amber-600/80 flex flex-col justify-between select-none overflow-hidden"
            style={{
              backgroundImage: 'radial-gradient(circle at center, rgba(254, 243, 199, 0.25) 0%, rgba(255, 255, 255, 1) 70%)'
            }}
          >
            {/* Corner Decorative Ornaments */}
            <div className="absolute top-2 left-2 text-amber-500 font-serif text-lg leading-none opacity-80">❖</div>
            <div className="absolute top-2 right-2 text-amber-500 font-serif text-lg leading-none opacity-80">❖</div>
            <div className="absolute bottom-2 left-2 text-amber-500 font-serif text-lg leading-none opacity-80">❖</div>
            <div className="absolute bottom-2 right-2 text-amber-500 font-serif text-lg leading-none opacity-80">❖</div>

            {/* Inner Border */}
            <div className="absolute inset-3 border border-amber-400/40 rounded-lg pointer-events-none" />

            {/* 1. Header & School Info */}
            <div className="text-center space-y-1 relative z-10">
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-white flex items-center justify-center shadow-md mb-2">
                <School className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-extrabold text-amber-900 tracking-wider">
                {data.schoolName || 'โรงเรียนวัดบางโฉลงใน'}
              </h4>
              <p className="text-[11px] text-slate-500 font-medium">
                สำนักงานเขตพื้นที่การศึกษาประถมศึกษาสมุทรปราการ เขต 2
              </p>
              <h2 className="text-xl sm:text-2xl font-black text-amber-700 tracking-wide pt-1">
                เกียรติบัตรฉบับนี้ให้ไว้เพื่อแสดงว่า
              </h2>
            </div>

            {/* 2. Recipient Name */}
            <div className="text-center space-y-2 my-auto relative z-10">
              <div className="text-2xl sm:text-3xl font-black text-slate-900 border-b-2 border-amber-400/60 pb-2 inline-block px-8">
                {data.studentName}
              </div>
              {data.gradeLevel && (
                <div className="text-xs font-semibold text-slate-600">
                  {data.gradeLevel}
                </div>
              )}
              <p className="text-xs sm:text-sm text-slate-700 font-medium max-w-lg mx-auto leading-relaxed pt-1">
                {data.title}
              </p>
              {data.percentage !== undefined && (
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-xs">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>ผลการประเมิน: {data.percentage}% (ผ่านเกณฑ์มาตรฐานดีเยี่ยม)</span>
                </div>
              )}
            </div>

            {/* 3. Footer & Signatures */}
            <div className="flex items-end justify-between pt-4 relative z-10 border-t border-amber-200/60">
              {/* Certificate No & Date */}
              <div className="text-left text-[10px] text-slate-500 space-y-0.5 font-mono">
                <div>เลขที่: <span className="font-bold text-slate-700">{data.certificateNo}</span></div>
                <div>ให้ไว้ ณ วันที่: <span className="font-sans font-medium text-slate-700">{data.issueDate}</span></div>
              </div>

              {/* Gold Ribbon Badge */}
              <div className="w-14 h-14 rounded-full bg-gradient-to-b from-yellow-400 via-amber-500 to-amber-600 text-white flex flex-col items-center justify-center shadow-lg border-2 border-white text-center">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-[8px] font-black uppercase tracking-tighter">EXCELLENCE</span>
              </div>

              {/* Teacher Signature */}
              <div className="text-center space-y-1">
                <div className="font-serif italic text-base font-bold text-slate-800 border-b border-slate-400 px-4 pb-0.5">
                  {data.teacherName}
                </div>
                <div className="text-[10px] font-bold text-slate-700">
                  ({data.teacherName})
                </div>
                <div className="text-[9px] text-slate-500">
                  {data.teacherTitle}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            * เกียรติบัตรนี้ออกโดยระบบอัตโนมัติของห้องสื่อครูคิง โรงเรียนวัดบางโฉลงใน
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold shadow-md shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>พิมพ์เกียรติบัตร (Print / PDF)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
