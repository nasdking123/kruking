'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Award, 
  CheckCircle2, 
  ExternalLink, 
  Loader2,
  Check,
  X
} from 'lucide-react';
import { 
  getPendingCertificates, 
  reviewCertificate, 
  type StudentCertificateItem 
} from '@/services/student-learning';
import { useToast } from '@/components/ui/toast';

export default function AdminCertificatesApprovalPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState<StudentCertificateItem[]>([]);
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  // Reject Modal
  const [selectedRejectCert, setSelectedRejectCert] = useState<StudentCertificateItem | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const refreshData = async () => {
    const data = await getPendingCertificates();
    setCertificates(data);
    setLoading(false);
  };

  useEffect(() => {
    let ignore = false;
    getPendingCertificates().then((data) => {
      if (!ignore) {
        setCertificates(data);
        setLoading(false);
      }
    });
    return () => {
      ignore = true;
    };
  }, []);

  const handleApprove = async (certId: string, certTitle: string) => {
    setReviewingId(certId);
    const res = await reviewCertificate(certId, 'approved');
    setReviewingId(null);

    if (res.success) {
      toast.success('อนุมัติเกียรติบัตรแล้ว!', `อนุมัติ "${certTitle}" เรียบร้อยแล้ว`);
      await refreshData();
    } else {
      toast.error('เกิดข้อผิดพลาด', res.error || 'ไม่สามารถอนุมัติได้');
    }
  };

  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRejectCert) return;

    setReviewingId(selectedRejectCert.id);
    const res = await reviewCertificate(selectedRejectCert.id, 'rejected', rejectReason);
    setReviewingId(null);
    setSelectedRejectCert(null);
    setRejectReason('');

    if (res.success) {
      toast.success('ปฏิเสธเกียรติบัตรแล้ว', 'บันทึกเหตุผลเรียบร้อย');
      await refreshData();
    } else {
      toast.error('เกิดข้อผิดพลาด', res.error || 'ไม่สามารถดำเนินการได้');
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Award className="w-7 h-7 text-amber-500" />
            <span>ระบบตรวจสอบและอนุมัติเกียรติบัตรนักเรียน (Certificates Approval)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            ตรวจสอบความถูกต้องของเกียรติบัตรที่นักเรียนยื่นส่งเข้าระบบ ก่อนนำไปแสดงใน Portfolio และหน้าเกียรติบัตรสาธารณะ
          </p>
        </div>
      </div>

      {/* Main List */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-md overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            <span className="text-xs text-slate-500 font-bold">กำลังโหลดรายการเกียรติบัตร...</span>
          </div>
        ) : certificates.length === 0 ? (
          <div className="p-16 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              ไม่มีเกียรติบัตรที่รอการตรวจสอบ
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {certificates.map((cert) => {
              const isPending = cert.status === 'pending';
              const isApproved = cert.status === 'approved';

              return (
                <div
                  key={cert.id}
                  className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Thumbnail */}
                    {cert.imageUrl ? (
                      <div className="relative w-28 h-20 rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 shrink-0">
                        <Image
                          src={cert.imageUrl}
                          alt={cert.title}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center shrink-0">
                        <Award className="w-7 h-7" />
                      </div>
                    )}

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {isPending ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-extrabold border border-amber-200">
                            🟡 รออนุมัติ
                          </span>
                        ) : isApproved ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold border border-emerald-200">
                            🟢 อนุมัติแล้ว
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[10px] font-extrabold border border-rose-200">
                            🔴 ปฏิเสธ
                          </span>
                        )}
                        <span className="text-xs font-bold text-slate-500">
                          ผู้ยื่น: <span className="text-slate-900 dark:text-white font-extrabold">{cert.studentName}</span>
                        </span>
                      </div>

                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {cert.title}
                      </h3>

                      <p className="text-xs text-slate-500">
                        หน่วยงาน: {cert.issuer} • ระดับ: {cert.competitionLevel} • รางวัล: {cert.awardTier} • วันที่: {cert.issueDate}
                      </p>

                      {cert.rejectReason && (
                        <p className="text-xs text-rose-600 dark:text-rose-400 font-bold mt-1">
                          เหตุผลที่ปฏิเสธ: {cert.rejectReason}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                    {cert.imageUrl && (
                      <a
                        href={cert.imageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-200"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>ดูรูปเต็ม</span>
                      </a>
                    )}

                    {isPending && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleApprove(cert.id, cert.title)}
                          disabled={reviewingId === cert.id}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <Check className="w-4 h-4" />
                          <span>อนุมัติ (Approve)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedRejectCert(cert);
                            setRejectReason('ภาพถ่ายไม่ชัดเจน หรือข้อมูลไม่ตรงกับเกณฑ์');
                          }}
                          className="px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 text-xs font-extrabold hover:bg-rose-100 flex items-center gap-1.5 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                          <span>ปฏิเสธ</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Reject Reason */}
      {selectedRejectCert && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleConfirmReject}
            className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 animate-in zoom-in-95"
          >
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              ระบุเหตุผลในการปฏิเสธเกียรติบัตร
            </h3>
            <p className="text-xs text-slate-500">
              {selectedRejectCert.title} ({selectedRejectCert.studentName})
            </p>

            <textarea
              rows={3}
              required
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="เช่น ภาพถ่ายไม่ชัดเจน, ไม่พบรายชื่อในการแข่งขัน..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedRejectCert(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
              >
                ยืนยันการปฏิเสธ
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
