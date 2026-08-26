'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  CheckSquare, 
  Search, 
  ExternalLink, 
  Loader2,
  Save
} from 'lucide-react';
import { 
  getAllSubmissions, 
  gradeStudentSubmission, 
  type SubmissionGradingItem 
} from '@/services/assignments-module';
import { useToast } from '@/components/ui/toast';

export default function AdminSubmissionsPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<SubmissionGradingItem[]>([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected Submission for Grading Modal
  const [selectedSub, setSelectedSub] = useState<SubmissionGradingItem | null>(null);
  const [scoreInput, setScoreInput] = useState(18);
  const [feedbackInput, setFeedbackInput] = useState('');
  const [statusInput, setStatusInput] = useState<'passed' | 'graded' | 'needs_revision'>('passed');
  const [savingGrade, setSavingGrade] = useState(false);

  const refreshData = async () => {
    const data = await getAllSubmissions({ status: statusFilter });
    setSubmissions(data);
    setLoading(false);
  };

  useEffect(() => {
    let ignore = false;
    getAllSubmissions({ status: statusFilter }).then((data) => {
      if (!ignore) {
        setSubmissions(data);
        setLoading(false);
      }
    });

    return () => {
      ignore = true;
    };
  }, [statusFilter]);

  const openGradingModal = (sub: SubmissionGradingItem) => {
    setSelectedSub(sub);
    setScoreInput(sub.score ?? sub.maxScore);
    setFeedbackInput(sub.teacherFeedback || 'ผลงานยอดเยี่ยม มีความคิดสร้างสรรค์ดีมากครับ');
    setStatusInput(sub.status === 'needs_revision' ? 'needs_revision' : 'passed');
  };

  const handleSaveGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;

    setSavingGrade(true);
    const res = await gradeStudentSubmission({
      submissionId: selectedSub.id,
      userId: selectedSub.userId,
      score: scoreInput,
      teacherFeedback: feedbackInput,
      status: statusInput,
      lessonTitle: selectedSub.lessonTitle,
    });
    setSavingGrade(false);

    if (res.success) {
      toast.success(
        'บันทึกคะแนนสำเร็จ!',
        `ให้คะแนน ${selectedSub.studentName} (${scoreInput}/${selectedSub.maxScore}) และเพิ่มแต้มสะสมเรียบร้อย`
      );
      setSelectedSub(null);
      await refreshData();
    } else {
      toast.error('ไม่สามารถบันทึกได้', res.error || 'เกิดข้อผิดพลาด');
    }
  };

  const filtered = submissions.filter((s) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      s.studentName.toLowerCase().includes(term) ||
      (s.lessonTitle && s.lessonTitle.toLowerCase().includes(term)) ||
      (s.studentSchool && s.studentSchool.toLowerCase().includes(term))
    );
  });

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <CheckSquare className="w-7 h-7 text-blue-600" />
            <span>ตรวจการบ้านและผลงานนักเรียน (Submissions & Grading)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            ตรวจผลงาน Scratch ใบงาน และชิ้นงานที่นักเรียนส่ง พร้อมให้คะแนนและบันทึกแต้มสะสมลงบัญชีอัตโนมัติ
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="font-bold text-slate-400 mr-1">สถานะ:</span>
          {[
            { key: 'ALL', label: 'ทั้งหมด' },
            { key: 'pending', label: '🟡 รอตรวจ' },
            { key: 'passed', label: '🟢 ผ่าน' },
            { key: 'graded', label: '🔵 ตรวจแล้ว' },
            { key: 'needs_revision', label: '🔴 ให้แก้ไข' },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setStatusFilter(item.key)}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === item.key
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาชื่อนักเรียน, บทเรียน, โรงเรียน..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Submissions Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-md overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="text-xs text-slate-500 font-bold">กำลังโหลดรายการการบ้าน...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center space-y-2">
            <CheckSquare className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              ไม่พบรายการการบ้านตามเงื่อนไขที่เลือก
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">นักเรียน</th>
                  <th className="py-4 px-6">ชั้น/ห้อง/โรงเรียน</th>
                  <th className="py-4 px-6">งาน/บทเรียน</th>
                  <th className="py-4 px-6">วันที่ส่ง</th>
                  <th className="py-4 px-6 text-center">คะแนน</th>
                  <th className="py-4 px-6 text-center">สถานะ</th>
                  <th className="py-4 px-6 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {filtered.map((sub) => {
                  const isGraded = sub.status === 'graded' || sub.status === 'passed';
                  const formattedDate = new Date(sub.submittedAt).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  });

                  return (
                    <tr
                      key={sub.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-4 px-6 font-extrabold text-slate-900 dark:text-white">
                        {sub.studentName}
                      </td>

                      <td className="py-4 px-6 text-slate-500">
                        <div>{sub.studentGrade} • {sub.studentRoom} (เลขที่ {sub.studentNumber})</div>
                        <div className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold">{sub.studentSchool}</div>
                      </td>

                      <td className="py-4 px-6 max-w-xs">
                        <div className="font-bold text-slate-900 dark:text-white truncate">{sub.lessonTitle}</div>
                        {sub.notes && <div className="text-[11px] text-slate-400 truncate">{sub.notes}</div>}
                      </td>

                      <td className="py-4 px-6 font-mono text-slate-400 whitespace-nowrap">
                        {formattedDate}
                      </td>

                      <td className="py-4 px-6 text-center font-bold">
                        {isGraded ? (
                          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">
                            {sub.score}/{sub.maxScore}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-center">
                        {sub.status === 'passed' ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 text-[10px] font-extrabold border border-emerald-200 dark:border-emerald-800">
                            🟢 ผ่าน
                          </span>
                        ) : sub.status === 'graded' ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 text-[10px] font-extrabold border border-blue-200 dark:border-blue-800">
                            🔵 ตรวจแล้ว
                          </span>
                        ) : sub.status === 'needs_revision' ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-600 text-[10px] font-extrabold border border-rose-200 dark:border-rose-800">
                            🔴 ให้แก้ไข
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-600 text-[10px] font-extrabold border border-amber-200 dark:border-amber-800">
                            🟡 รอตรวจ
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <button
                          type="button"
                          onClick={() => openGradingModal(sub)}
                          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] shadow-xs transition-colors cursor-pointer"
                        >
                          ตรวจงาน / ให้คะแนน
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Grading & Feedback */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleSaveGrade}
            className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[11px] font-bold text-blue-600 block">
                  {selectedSub.classroomTitle} • {selectedSub.lessonTitle}
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  ตรวจผลงาน: {selectedSub.studentName} ({selectedSub.studentGrade} • {selectedSub.studentRoom})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSub(null)}
                className="text-xs text-slate-400 hover:text-slate-600 p-2"
              >
                ปิดหน้าต่าง ✕
              </button>
            </div>

            {/* Submission Preview Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                สิ่งที่นักเรียนส่งมา:
              </span>

              {selectedSub.contentUrl && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono text-blue-600 dark:text-blue-400 truncate max-w-md">
                      {selectedSub.contentUrl}
                    </span>
                    <a
                      href={selectedSub.contentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1 rounded-lg bg-blue-600 text-white font-bold text-[10px] flex items-center gap-1 shadow-xs shrink-0"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>เปิดดูผลงานเต็ม</span>
                    </a>
                  </div>

                  {selectedSub.contentUrl.match(/\.(jpeg|jpg|gif|png|webp)/i) && (
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <Image
                        src={selectedSub.contentUrl}
                        alt="Student work preview"
                        fill
                        unoptimized
                        className="object-contain"
                      />
                    </div>
                  )}
                </div>
              )}

              {selectedSub.notes && (
                <div className="text-xs text-slate-700 dark:text-slate-300 italic bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  &ldquo;{selectedSub.notes}&rdquo;
                </div>
              )}
            </div>

            {/* Form Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  ให้คะแนน (เต็ม {selectedSub.maxScore} คะแนน) *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  max={selectedSub.maxScore}
                  value={scoreInput}
                  onChange={(e) => setScoreInput(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-black font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  ผลการประเมิน / สถานะ *
                </label>
                <select
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value as 'passed' | 'graded' | 'needs_revision')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value="passed">🟢 ผ่านการประเมิน (Passed)</option>
                  <option value="graded">🔵 ตรวจแล้ว (Graded)</option>
                  <option value="needs_revision">🔴 ให้ส่งแก้ไขใหม่ (Needs Revision)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  ข้อเสนอแนะและคำติชมจากคุณครู (Teacher Feedback)
                </label>
                <textarea
                  rows={3}
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  placeholder="เขียนคำชม ข้อสังเกต หรือจุดที่ควรพัฒนา..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedSub(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={savingGrade}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-md flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {savingGrade ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>บันทึกคะแนนและส่งผล</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
