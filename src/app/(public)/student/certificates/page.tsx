'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Award, 
  Plus, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { StudentNavBar } from '@/components/public/student-nav-bar';
import { 
  getStudentCertificates, 
  submitStudentCertificate, 
  type StudentCertificateItem 
} from '@/services/student-learning';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/toast';

export default function StudentCertificatesPage() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [studentName, setStudentName] = useState('นักเรียน');
  const [certificates, setCertificates] = useState<StudentCertificateItem[]>([]);

  // Submit Modal
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [certTitle, setCertTitle] = useState('');
  const [issuer, setIssuer] = useState('โรงเรียนวัดบางโฉลงใน');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [imageUrl, setImageUrl] = useState('');
  const [competitionLevel, setCompetitionLevel] = useState('ระดับสถานศึกษา');
  const [awardTier, setAwardTier] = useState('เหรียญทอง');

  const refreshData = async (uid: string) => {
    const data = await getStudentCertificates(uid);
    setCertificates(data);
  };

  useEffect(() => {
    let ignore = false;
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!ignore) {
        if (!user) {
          router.push('/student/login?redirectTo=/student/certificates');
          return;
        }
        setUserId(user.id);
        setStudentName(user.user_metadata?.full_name || 'นักเรียน');
        refreshData(user.id).then(() => {
          if (!ignore) setLoading(false);
        });
      }
    });

    return () => {
      ignore = true;
    };
  }, [router]);

  const handleSubmitCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !certTitle.trim()) return;

    setSubmitting(true);
    const res = await submitStudentCertificate({
      userId,
      studentName,
      title: certTitle.trim(),
      issuer: issuer.trim(),
      issueDate,
      imageUrl: imageUrl.trim() || undefined,
      competitionLevel,
      awardTier,
    });
    setSubmitting(false);

    if (res.success) {
      toast.success('ส่งเกียรติบัตรสำเร็จ!', 'เกียรติบัตรของคุณอยู่ระหว่างรอคุณครูตรวจสอบและอนุมัติ');
      setShowSubmitModal(false);
      setCertTitle('');
      setImageUrl('');
      await refreshData(userId);
    } else {
      toast.error('ไม่สามารถส่งเกียรติบัตรได้', res.error || 'เกิดข้อผิดพลาด');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-xs text-slate-500 font-bold">กำลังโหลดคลังเกียรติบัตร...</span>
        </div>
      </div>
    );
  }

  const approvedCerts = certificates.filter((c) => c.status === 'approved');
  const pendingCerts = certificates.filter((c) => c.status === 'pending');
  const rejectedCerts = certificates.filter((c) => c.status === 'rejected');

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-16">
      <StudentNavBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
        {/* Header */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-700 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 backdrop-blur-xs">
                <Award className="w-3.5 h-3.5" />
                <span>คลังเกียรติบัตรดิจิทัล (E-Certificates)</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-xs">
                {approvedCerts.length} ได้รับการอนุมัติแล้ว
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              My Verified Certificates & Honours
            </h1>
            <p className="text-xs sm:text-sm text-amber-100 max-w-2xl font-normal leading-relaxed">
              รวบรวมเกียรติบัตรและรางวัลจากการแข่งขันต่างๆ ของนักเรียน คุณสามารถยื่นส่งเกียรติบัตรใหม่เพื่อให้คุณครูตรวจสอบและอนุมัติเข้าสู่ระบบได้
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowSubmitModal(true)}
            className="px-5 py-3 rounded-2xl bg-white text-amber-800 hover:bg-amber-50 text-xs font-black shadow-lg shadow-black/15 transition-all flex items-center gap-2 shrink-0 self-start md:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-600" />
            <span>+ ส่งเกียรติบัตรใหม่เข้าระบบ</span>
          </button>
        </div>

        {/* Modal: Submit New Certificate */}
        {showSubmitModal && (
          <form
            onSubmit={handleSubmitCertificate}
            className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-amber-500 shadow-2xl space-y-4 animate-in fade-in"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                <span>ส่งเกียรติบัตรใหม่เพื่อรอการอนุมัติ (Submit Certificate for Approval)</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                ยกเลิก
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  ชื่อเกียรติบัตร / รายการแข่งขัน *
                </label>
                <input
                  type="text"
                  required
                  value={certTitle}
                  onChange={(e) => setCertTitle(e.target.value)}
                  placeholder="เช่น รางวัลชนะเลิศ การแข่งขันสร้างเกม Scratch ระดับเขตพื้นที่ฯ"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  หน่วยงานที่ออกเกียรติบัตร *
                </label>
                <input
                  type="text"
                  required
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  placeholder="เช่น โรงเรียนวัดบางโฉลงใน, สพป.สมุทรปราการ เขต 2"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  วันที่ได้รับเกียรติบัตร
                </label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  ระดับการแข่งขัน
                </label>
                <select
                  value={competitionLevel}
                  onChange={(e) => setCompetitionLevel(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value="ระดับสถานศึกษา">ระดับสถานศึกษา / โรงเรียน</option>
                  <option value="ระดับกลุ่มโรงเรียน">ระดับกลุ่มโรงเรียน / อำเภอ</option>
                  <option value="ระดับเขตพื้นที่การศึกษา">ระดับเขตพื้นที่การศึกษา (สพป.)</option>
                  <option value="ระดับชาติ">ระดับชาติ / ประเทศ</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  รางวัลที่ได้รับ
                </label>
                <select
                  value={awardTier}
                  onChange={(e) => setAwardTier(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value="เหรียญทอง">เหรียญทอง (Gold)</option>
                  <option value="เหรียญเงิน">เหรียญเงิน (Silver)</option>
                  <option value="เหรียญทองแดง">เหรียญทองแดง (Bronze)</option>
                  <option value="รางวัลชนะเลิศ">รางวัลชนะเลิศ</option>
                  <option value="เกียรติบัตรเข้าร่วม">เกียรติบัตรเข้าร่วมการแข่งขัน</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  URL ภาพถ่ายเกียรติบัตร (Image URL)
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... หรือ ลิงก์รูปภาพเกียรติบัตร"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                <span>ส่งเกียรติบัตรเพื่อรออนุมัติ</span>
              </button>
            </div>
          </form>
        )}

        {/* Section 1: Approved Certificates */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              เกียรติบัตรที่ได้รับการอนุมัติแล้ว ({approvedCerts.length})
            </h2>
          </div>

          {approvedCerts.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 space-y-2">
              <Award className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                ยังไม่มีเกียรติบัตรที่ได้รับการอนุมัติ
              </p>
              <p className="text-xs text-slate-400">
                เมื่อคุณส่งเกียรติบัตรและคุณครูกด Approve จะปรากฏในส่วนนี้ทันที
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {approvedCerts.map((cert) => (
                <div
                  key={cert.id}
                  className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/3] bg-slate-950 border-b border-slate-100 dark:border-slate-800">
                    {cert.imageUrl ? (
                      <Image
                        src={cert.imageUrl}
                        alt={cert.title}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-tr from-amber-700 to-amber-900 text-white text-center space-y-2">
                        <Award className="w-12 h-12 text-amber-300" />
                        <span className="font-extrabold text-xs">{cert.awardTier}</span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-xl bg-emerald-600 text-white text-[10px] font-extrabold shadow-md flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>อนุมัติแล้ว</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] text-amber-600 font-bold">
                        <span>{cert.competitionLevel}</span>
                        <span>•</span>
                        <span>{cert.awardTier}</span>
                      </div>

                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white line-clamp-2 mt-1">
                        {cert.title}
                      </h3>

                      <p className="text-xs text-slate-500 mt-1">
                        ออกโดย: {cert.issuer}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>วันที่: {cert.issueDate}</span>
                      {cert.imageUrl && (
                        <a
                          href={cert.imageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 font-bold flex items-center gap-1 hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>ดูรูปเต็ม</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Pending Review Certificates */}
        {pendingCerts.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                เกียรติบัตรที่อยู่ระหว่างรอการอนุมัติ ({pendingCerts.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingCerts.map((cert) => (
                <div
                  key={cert.id}
                  className="p-5 rounded-3xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <span className="px-2 py-0.5 rounded-md bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 text-[10px] font-bold">
                      สถานะ: รอคุณครูตรวจ
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {cert.title}
                    </h4>
                    <p className="text-xs text-slate-500">
                      หน่วยงาน: {cert.issuer} • ยื่นเมื่อ {cert.issueDate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Rejected with Reason */}
        {rejectedCerts.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-500" />
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                เกียรติบัตรที่ไม่ผ่านการอนุมัติ ({rejectedCerts.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rejectedCerts.map((cert) => (
                <div
                  key={cert.id}
                  className="p-5 rounded-3xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <span className="px-2 py-0.5 rounded-md bg-rose-200 dark:bg-rose-800 text-rose-800 dark:text-rose-200 text-[10px] font-bold">
                      สถานะ: ไม่ผ่านการอนุมัติ
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {cert.title}
                    </h4>
                    {cert.rejectReason && (
                      <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                        เหตุผล: {cert.rejectReason}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
