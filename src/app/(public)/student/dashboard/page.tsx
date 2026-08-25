'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  GraduationCap, 
  School, 
  CheckCircle2, 
  Trophy, 
  Clock, 
  KeyRound, 
  Plus, 
  LogOut, 
  CheckSquare, 
  PlayCircle, 
  ArrowRight,
  Loader2,
  Calendar
} from 'lucide-react';
import { 
  getStudentProfile, 
  getStudentEnrollments, 
  getStudentQuizAttempts, 
  getStudentLearningLogs,
  enrollClassroom,
  type StudentProfile,
  type StudentEnrollment,
  type StudentQuizAttempt,
  type StudentLearningLog
} from '@/services/student';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/toast';

export default function StudentDashboardPage() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'classrooms' | 'quizzes' | 'logs'>('classrooms');

  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [enrollments, setEnrollments] = useState<StudentEnrollment[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<StudentQuizAttempt[]>([]);
  const [learningLogs, setLearningLogs] = useState<StudentLearningLog[]>([]);

  // Join Code Modal
  const [joinCode, setJoinCode] = useState('');
  const [joining, setJoining] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function loadStudentData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        if (!ignore) {
          router.push('/student/login');
        }
        return;
      }

      const [p, enr, qz, logs] = await Promise.all([
        getStudentProfile(user.id),
        getStudentEnrollments(user.id),
        getStudentQuizAttempts(user.id),
        getStudentLearningLogs(user.id),
      ]);

      if (!ignore) {
        setProfile(p || {
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || 'นักเรียน',
          role: 'student',
          grade_level: 'ประถมศึกษาปีที่ 6',
          student_number: '-',
          classroom_name: 'ห้อง 1',
          school: 'โรงเรียนวัดเทพลีลา',
          created_at: user.created_at,
        });
        setEnrollments(enr);
        setQuizAttempts(qz);
        setLearningLogs(logs);
        setLoading(false);
      }
    }

    loadStudentData();
    return () => {
      ignore = true;
    };
  }, [router]);

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !joinCode.trim()) return;

    setJoining(true);
    const res = await enrollClassroom({
      userId: profile.id,
      joinCode: joinCode.trim().toUpperCase(),
    });
    setJoining(false);

    if (!res.success) {
      toast.error('เข้าร่วมไม่สำเร็จ', res.error || 'ไม่พบห้องเรียนที่ตรงกับรหัสดังกล่าว');
      return;
    }

    toast.success('สมัครเข้าห้องเรียนสำเร็จ', `เข้าร่วมห้องเรียน "${res.classroomTitle}" เรียบร้อยแล้ว`);
    setShowJoinModal(false);
    setJoinCode('');
    
    // Refresh enrollments
    const freshEnr = await getStudentEnrollments(profile.id);
    setEnrollments(freshEnr);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.info('ออกจากระบบแล้ว', 'กลับสู่หน้าหลัก');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <span className="text-xs text-slate-500 font-semibold">กำลังโหลดข้อมูลการเรียนของนักเรียน...</span>
      </div>
    );
  }

  const completedCount = learningLogs.filter((l) => l.action === 'complete').length;
  const avgScore = quizAttempts.length > 0
    ? Math.round(quizAttempts.reduce((sum, a) => sum + (a.percentage || 0), 0) / quizAttempts.length)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Student Header Profile Banner */}
      <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4 sm:gap-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white/20 border-2 border-white/30 backdrop-blur-xs flex items-center justify-center text-white shrink-0 shadow-lg">
            <GraduationCap className="w-9 h-9 sm:w-11 sm:h-11 text-blue-200" />
          </div>
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-blue-100 text-[11px] font-bold">
                {profile?.grade_level} {profile?.classroom_name}
              </span>
              {profile?.student_number && profile?.student_number !== '-' && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-bold">
                  เลขที่ {profile?.student_number}
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[11px] font-bold">
                {profile?.school}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold truncate">
              {profile?.full_name}
            </h1>
            <p className="text-xs text-blue-200 font-mono">
              {profile?.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setShowJoinModal(true)}
            className="px-4 py-2.5 rounded-xl bg-white text-blue-900 hover:bg-blue-50 text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-blue-600" />
            <span>+ สมัครเข้าห้องเรียนด้วยรหัส</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="ออกจากระบบ"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Join Code Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <form onSubmit={handleEnroll} className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-blue-600" />
                <span>สมัครเข้าห้องเรียน (Join Classroom)</span>
              </h3>
              <button type="button" onClick={() => setShowJoinModal(false)} className="text-xs text-slate-400 hover:text-slate-600">
                ยกเลิก
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                กรอกรหัสห้องเรียน (Join Code) เช่น COM01, HIST601, CODE406
              </label>
              <input
                type="text"
                required
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="กรอกรหัสห้องเรียน..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-mono uppercase tracking-wider text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                * ขอรหัสเข้าร่วมห้องเรียนได้จากครูคิงประจำวิชา
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowJoinModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ปิด
              </button>
              <button
                type="submit"
                disabled={joining || !joinCode}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                {joining ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                <span>สมัครเข้าห้องเรียนทันที</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center shrink-0">
            <School className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white block">
              {enrollments.length}
            </span>
            <span className="text-xs text-slate-500">ห้องเรียนที่สมัคร</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white block">
              {completedCount}
            </span>
            <span className="text-xs text-slate-500">บทเรียนที่เรียนจบ</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center shrink-0">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white block">
              {quizAttempts.length}
            </span>
            <span className="text-xs text-slate-500">แบบทดสอบที่ทำ</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white block">
              {avgScore}%
            </span>
            <span className="text-xs text-slate-500">คะแนนสอบเฉลี่ย</span>
          </div>
        </div>
      </div>

      {/* 4. Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('classrooms')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'classrooms'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <School className="w-4 h-4" />
          <span>ห้องเรียนของฉัน ({enrollments.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('quizzes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'quizzes'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>ผลคะแนนสอบ ({quizAttempts.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'logs'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Log ประวัติการเข้าเรียน</span>
        </button>
      </div>

      {/* 5. Tab Content */}
      {/* TAB 1: Enrolled Classrooms */}
      {activeTab === 'classrooms' && (
        <div className="space-y-4">
          {enrollments.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
              <School className="w-12 h-12 text-slate-300 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  ยังไม่ได้สมัครเข้าห้องเรียนใดๆ
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  กดปุ่มด้านล่างเพื่อกรอกรหัสห้องเรียน เช่น COM01 หรือ HIST601 หรือเลือกห้องเรียนจากรายการทั้งหมด
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(true)}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs hover:bg-blue-700"
                >
                  + กรอกรหัสห้องเรียน
                </button>
                <Link
                  href="/classroom"
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200"
                >
                  ดูห้องเรียนทั้งหมด
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((enr) => {
                const cls = enr.classroom;
                if (!cls) return null;

                return (
                  <div
                    key={enr.id}
                    className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-16/9 bg-slate-950 overflow-hidden">
                        {cls.cover_image ? (
                          <Image
                            src={cls.cover_image}
                            alt={cls.title}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-blue-500">
                            <School className="w-12 h-12 opacity-30" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-lg bg-blue-600 text-white text-[10px] font-bold">
                          {cls.grade_level || 'ทุกระดับชั้น'}
                        </div>
                        {cls.join_code && (
                          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-lg bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-mono font-bold">
                            Code: {cls.join_code}
                          </div>
                        )}
                      </div>

                      <div className="p-5 space-y-2">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                          {cls.title}
                        </h3>
                        {cls.description && (
                          <p className="text-xs text-slate-500 line-clamp-2">
                            {cls.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="px-5 py-3.5 bg-slate-50/60 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-semibold">
                        วิชา {cls.subject}
                      </span>
                      <Link
                        href={`/classroom/${cls.slug}`}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1"
                      >
                        <span>เข้าเรียน</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Quiz Results & Scores */}
      {activeTab === 'quizzes' && (
        <div className="space-y-4">
          {quizAttempts.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 space-y-3">
              <CheckSquare className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">ยังไม่มีประวัติการทำแบบทดสอบ</h3>
              <p className="text-xs text-slate-500">เลือกทำแบบทดสอบออนไลน์เพื่อวัดผลสัมฤทธิ์และสะสมคะแนน</p>
              <Link
                href="/quiz"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-xs hover:bg-purple-700"
              >
                <span>ไปที่ศูนย์แบบทดสอบ (Quiz Center)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {quizAttempts.map((att) => {
                const isPassed = att.percentage >= 60;

                return (
                  <div
                    key={att.id}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start sm:items-center gap-4 min-w-0">
                      <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-bold shrink-0 ${
                        isPassed
                          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-rose-50 dark:bg-rose-950 text-rose-600 border border-rose-200 dark:border-rose-800'
                      }`}>
                        <span className="text-lg leading-none">{att.score}</span>
                        <span className="text-[10px] opacity-70">/{att.total_score}</span>
                      </div>

                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            isPassed ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}>
                            {isPassed ? 'ผ่านเกณฑ์ ✅' : 'ควรปรับปรุง ⚠️'} ({att.percentage}%)
                          </span>
                          {att.grade_level && (
                            <span className="text-[10px] text-slate-400">
                              {att.grade_level}
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {att.quiz_title}
                        </h4>

                        <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{Math.round(att.time_spent_seconds / 60)} นาที</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(att.started_at).toLocaleDateString('th-TH')}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/quiz/${att.quiz_id}/play`}
                      className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950 text-slate-700 hover:text-purple-600 text-xs font-bold transition-colors shrink-0 flex items-center justify-center gap-1"
                    >
                      <span>ทำซ้ำอีกครั้ง</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Learning Activity Logs */}
      {activeTab === 'logs' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>บันทึกประวัติการเข้าเรียนและการดูคลิป (Learning Activity Logs)</span>
            </h3>
            <span className="text-xs text-slate-400 font-semibold">
              {learningLogs.length} รายการ
            </span>
          </div>

          {learningLogs.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">
              ยังไม่มีบันทึกประวัติการเข้าเรียน เมื่อท่านเข้าชมคลิปในห้องเรียน ระบบจะบันทึก Log อัตโนมัติ
            </p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {learningLogs.map((log) => (
                <div key={log.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      log.action === 'complete'
                        ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600'
                        : 'bg-blue-50 dark:bg-blue-950 text-blue-600'
                    }`}>
                      {log.action === 'complete' ? <CheckCircle2 className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                        {log.action === 'complete' ? 'เรียนจบบทเรียน' : 'เข้าชมคลิปวิดีโอการสอน'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Lesson ID: {log.lesson_id.slice(0, 8)}...
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-400 shrink-0 font-mono">
                    {new Date(log.created_at).toLocaleString('th-TH')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
