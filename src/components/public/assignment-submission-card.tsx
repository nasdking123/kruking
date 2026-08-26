'use client';

import React, { useState, useEffect } from 'react';
import { 
  Send, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Sparkles, 
  FileText, 
  Link as LinkIcon, 
  MessageSquare,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { submitAssignment, getStudentLessonSubmission, type AssignmentSubmissionRow } from '@/services/assignments';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/toast';

interface AssignmentSubmissionCardProps {
  lessonId: string;
  classroomId?: string | null;
  lessonTitle: string;
}

export function AssignmentSubmissionCard({ lessonId, classroomId, lessonTitle }: AssignmentSubmissionCardProps) {
  const toast = useToast();
  const [submission, setSubmission] = useState<AssignmentSubmissionRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string } | null>(null);

  const [submissionType, setSubmissionType] = useState<'link' | 'image' | 'text'>('link');
  const [contentUrl, setContentUrl] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    let ignore = false;
    async function loadData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        if (!ignore) setLoading(false);
        return;
      }

      if (!ignore) {
        setCurrentUser({
          id: user.id,
          name: user.user_metadata?.full_name || 'นักเรียน',
        });
      }

      const existing = await getStudentLessonSubmission(lessonId, user.id);
      if (!ignore) {
        if (existing) {
          setSubmission(existing);
          setSubmissionType(existing.submission_type);
          setContentUrl(existing.content_url || '');
          setNotes(existing.notes || '');
        }
        setLoading(false);
      }
    }

    loadData();
    return () => {
      ignore = true;
    };
  }, [lessonId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error('กรุณาเข้าสู่ระบบ', 'นักเรียนต้องเข้าสู่ระบบก่อนส่งการบ้าน');
      return;
    }

    if (submissionType !== 'text' && !contentUrl.trim()) {
      toast.error('กรุณาระบุลิงก์หรือรูปภาพ', 'โปรดวางลิงก์โปรเจกต์ Scratch หรือ URL รูปภาพ');
      return;
    }

    setSubmitting(true);
    const res = await submitAssignment({
      lessonId,
      classroomId,
      userId: currentUser.id,
      studentName: currentUser.name,
      submissionType,
      contentUrl: contentUrl.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    setSubmitting(false);

    if (!res.success || !res.data) {
      toast.error('ส่งงานไม่สำเร็จ', res.error || 'เกิดข้อผิดพลาดในการบันทึกการส่งงาน');
      return;
    }

    setSubmission(res.data);
    toast.success('ส่งการบ้านเรียบร้อย!', `คุณครูได้รับชิ้นงาน "${lessonTitle}" แล้ว`);
  };

  if (loading) {
    return (
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
        <span>กำลังโหลดข้อมูลการส่งงาน...</span>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 space-y-2 text-center">
        <AlertCircle className="w-6 h-6 text-amber-600 mx-auto" />
        <h4 className="text-sm font-bold text-amber-900 dark:text-amber-300">
          เข้าสู่ระบบนักเรียนเพื่อส่งการบ้าน
        </h4>
        <p className="text-xs text-amber-700 dark:text-amber-400">
          นักเรียนสามารถส่งภาพใบงาน หรือแปะลิงก์ผลงานโปรแกรม Scratch ให้ครูตรวจได้เมื่อเข้าสู่ระบบ
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-md space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
            <Send className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              ส่งการบ้าน & ผลงานประจำบทเรียน
            </h3>
            <p className="text-[11px] text-slate-400">
              {lessonTitle}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        {submission && (
          <div>
            {submission.status === 'graded' ? (
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>คะแนน: {submission.score} / {submission.max_score}</span>
              </span>
            ) : submission.status === 'needs_revision' ? (
              <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-xs">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>ส่งงานแก้ไข</span>
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center gap-1.5 shadow-xs">
                <Clock className="w-3.5 h-3.5" />
                <span>ส่งแล้ว (รอครูตรวจ)</span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Teacher Feedback Card if Graded */}
      {submission && submission.teacher_feedback && (
        <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1.5">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>ข้อเสนอแนะจากครูจักรพงษ์:</span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-200 pl-5 leading-relaxed">
            {submission.teacher_feedback}
          </p>
        </div>
      )}

      {/* Submission Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Selector */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setSubmissionType('link')}
            className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
              submissionType === 'link'
                ? 'bg-blue-50 dark:bg-blue-950/80 border-blue-500 text-blue-600 shadow-xs'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            <span>ลิงก์ Scratch / เว็บ</span>
          </button>

          <button
            type="button"
            onClick={() => setSubmissionType('image')}
            className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
              submissionType === 'image'
                ? 'bg-blue-50 dark:bg-blue-950/80 border-blue-500 text-blue-600 shadow-xs'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>รูปภาพผลงาน (URL)</span>
          </button>

          <button
            type="button"
            onClick={() => setSubmissionType('text')}
            className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
              submissionType === 'text'
                ? 'bg-blue-50 dark:bg-blue-950/80 border-blue-500 text-blue-600 shadow-xs'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>พิมพ์คำตอบในนี้</span>
          </button>
        </div>

        {/* Link / Image URL input */}
        {submissionType !== 'text' && (
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              {submissionType === 'link' ? 'วางลิงก์โปรเจกต์ Scratch หรือ Google Drive *' : 'วางลิงก์ URL รูปภาพผลงาน *'}
            </label>
            <input
              type="url"
              required
              value={contentUrl}
              onChange={(e) => setContentUrl(e.target.value)}
              placeholder={submissionType === 'link' ? 'เช่น https://scratch.mit.edu/projects/12345678' : 'เช่น https://image.url/mywork.jpg'}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        )}

        {/* Notes / Answer Textarea */}
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
            {submissionType === 'text' ? 'พิมพ์คำตอบและเนื้อหาการบ้าน *' : 'คำอธิบายเพิ่มเติม / ข้อความถึงครูคิง (ถ้ามี)'}
          </label>
          <textarea
            rows={3}
            required={submissionType === 'text'}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="เช่น หนูทำแบบฝึกหัดเสร็จแล้วค่ะ / โค้ดนี้ใช้ Loop ซ้อน If-Else ในการเช็คเงื่อนไขค่ะ"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-1">
          {submission && submission.content_url && (
            <a
              href={submission.content_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline font-bold"
            >
              <span>เปิดดูงานที่ส่งไว้</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="ml-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>กำลังส่งงาน...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{submission ? 'ส่งงานใหม่ / อัปเดตงาน' : 'ส่งการบ้านให้ครูตรวจ'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
