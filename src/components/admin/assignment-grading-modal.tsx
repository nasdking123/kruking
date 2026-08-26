'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  ExternalLink, 
  MessageSquare, 
  X, 
  Loader2,
  FileText,
  AlertCircle
} from 'lucide-react';
import { 
  getAllAssignmentSubmissions, 
  gradeAssignmentSubmission, 
  type AssignmentSubmissionRow 
} from '@/services/assignments';
import { useToast } from '@/components/ui/toast';

interface AssignmentGradingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AssignmentGradingModal({ isOpen, onClose }: AssignmentGradingModalProps) {
  const toast = useToast();
  const [submissions, setSubmissions] = useState<Array<AssignmentSubmissionRow & { lesson_title?: string; classroom_title?: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState<(AssignmentSubmissionRow & { lesson_title?: string; classroom_title?: string }) | null>(null);

  const [score, setScore] = useState(10);
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    let ignore = false;
    getAllAssignmentSubmissions().then((data) => {
      if (!ignore) {
        setSubmissions(data);
        setLoading(false);
      }
    });

    return () => {
      ignore = true;
    };
  }, [isOpen]);

  const handleSelect = (sub: AssignmentSubmissionRow & { lesson_title?: string; classroom_title?: string }) => {
    setSelectedSub(sub);
    setScore(sub.score ?? 10);
    setFeedback(sub.teacher_feedback || '');
  };

  const handleSaveGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;

    setSaving(true);
    const res = await gradeAssignmentSubmission({
      submissionId: selectedSub.id,
      score: Number(score),
      feedback: feedback.trim() || undefined,
      status: 'graded',
    });

    setSaving(false);

    if (!res.success) {
      toast.error('ไม่สามารถบันทึกคะแนนได้', res.error || 'เกิดข้อผิดพลาด');
      return;
    }

    toast.success('บันทึกคะแนนสำเร็จ', `ให้คะแนน ${selectedSub.student_name} เรียบร้อยแล้ว`);
    
    // Update local state
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === selectedSub.id
          ? { ...s, score: Number(score), teacher_feedback: feedback, status: 'graded' }
          : s
      )
    );
    setSelectedSub(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                ระบบตรวจการบ้านและให้คะแนนนักเรียน
              </h3>
              <p className="text-xs text-slate-400">
                รายการชิ้นงานและการบ้านที่นักเรียนส่งเข้ามาทั้งหมด ({submissions.length} รายการ)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <span className="text-xs">กำลังโหลดรายการการบ้าน...</span>
            </div>
          ) : submissions.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <AlertCircle className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">ยังไม่มีการบ้านที่ส่งเข้ามา</p>
              <p className="text-xs">เมื่อนักเรียนส่งงานในบทเรียน รายการจะปรากฏในหน้านี้</p>
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-300 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {sub.student_name}
                      </span>
                      {sub.status === 'graded' ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                          ตรวจแล้ว ({sub.score}/{sub.max_score})
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                          รอตรวจ
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500">
                      บทเรียน: <span className="font-semibold text-slate-700 dark:text-slate-300">{sub.lesson_title}</span>
                    </p>

                    {sub.notes && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                        &quot;{sub.notes}&quot;
                      </p>
                    )}

                    <div className="text-[10px] text-slate-400">
                      ส่งเมื่อ: {new Date(sub.submitted_at).toLocaleString('th-TH')}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {sub.content_url && (
                      <a
                        href={sub.content_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 flex items-center gap-1"
                      >
                        <span>เปิดดูงาน</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => handleSelect(sub)}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                    >
                      {sub.status === 'graded' ? 'แก้ไขคะแนน' : 'ตรวจและให้คะแนน'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Grading Form Modal */}
        {selectedSub && (
          <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 animate-in slide-in-from-bottom-2 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                ตรวจงาน: {selectedSub.student_name} ({selectedSub.lesson_title})
              </h4>
              <button
                type="button"
                onClick={() => setSelectedSub(null)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                ยกเลิก
              </button>
            </div>

            <form onSubmit={handleSaveGrade} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    คะแนนที่ได้ (เต็ม 10) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    required
                    value={score}
                    onChange={(e) => setScore(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>คำชม / ข้อเสนอแนะจากครูจักรพงษ์</span>
                  </label>
                  <input
                    type="text"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="เช่น ทำได้ยอดเยี่ยมมากครับ โค้ดมีการใช้ลูปซ้ำได้อย่างถูกต้อง!"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>บันทึกคะแนนและส่งคอมเมนต์</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
