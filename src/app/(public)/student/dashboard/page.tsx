'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  School, 
  CheckCircle2, 
  Trophy, 
  KeyRound, 
  Plus, 
  LogOut, 
  CheckSquare, 
  PlayCircle, 
  ArrowRight,
  Loader2,
  Award,
  Send,
  ExternalLink,
  MessageSquare
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
import { getStudentAllSubmissions, type AssignmentSubmissionRow } from '@/services/assignments';
import { LeaderboardCard } from '@/components/public/leaderboard-card';
import { CertificateModal } from '@/components/public/certificate-modal';
import { generateCertificateCode, getThaiCertificateDate, type CertificateData } from '@/services/certificate';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/toast';

export default function StudentDashboardPage() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'classrooms' | 'quizzes' | 'homework' | 'leaderboard' | 'logs'>('classrooms');

  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [enrollments, setEnrollments] = useState<StudentEnrollment[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<StudentQuizAttempt[]>([]);
  const [learningLogs, setLearningLogs] = useState<StudentLearningLog[]>([]);
  const [homeworkList, setHomeworkList] = useState<AssignmentSubmissionRow[]>([]);

  // Join Code Modal
  const [joinCode, setJoinCode] = useState('');
  const [joining, setJoining] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  // Certificate Modal
  const [selectedCert, setSelectedCert] = useState<CertificateData | null>(null);

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

      const [p, enr, qz, logs, hw] = await Promise.all([
        getStudentProfile(user.id),
        getStudentEnrollments(user.id),
        getStudentQuizAttempts(user.id),
        getStudentLearningLogs(user.id),
        getStudentAllSubmissions(user.id),
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
          school: 'โรงเรียนวัดบางโฉลงใน',
          created_at: user.created_at,
        });
        setEnrollments(enr);
        setQuizAttempts(qz);
        setLearningLogs(logs);
        setHomeworkList(hw);
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
      toast.error('ไม่สามารถสมัครได้', res.error || 'รหัสห้องเรียนไม่ถูกต้อง');
      return;
    }

    toast.success('สมัครเข้าเรียนสำเร็จ!', `เข้าสู่ห้องเรียน "${res.classroomTitle}" เรียบร้อย`);
    setShowJoinModal(false);
    setJoinCode('');

    // Refresh enrollments
    const newEnrollments = await getStudentEnrollments(profile.id);
    setEnrollments(newEnrollments);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success('ออกจากระบบแล้ว', 'ขอบคุณที่เข้ามาเรียนรู้กับครูคิงครับ');
    router.push('/');
  };

  const openCertificate = (title: string, percentage?: number) => {
    if (!profile) return;
    setSelectedCert({
      certificateNo: generateCertificateCode('KCL-CERT'),
      studentName: profile.full_name,
      gradeLevel: profile.grade_level,
      schoolName: profile.school || 'โรงเรียนวัดบางโฉลงใน',
      title,
      percentage,
      issueDate: getThaiCertificateDate(),
      teacherName: 'ครูจักรพงษ์ สำรองพันธ์',
      teacherTitle: 'ครูผู้สอนกลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี',
    });
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-xs text-slate-500 font-bold">กำลังโหลดข้อมูลแดชบอร์ดนักเรียน...</span>
        </div>
      </div>
    );
  }

  const completedCount = learningLogs.filter((l) => l.action === 'complete').length;
  const avgScore = quizAttempts.length > 0
    ? Math.round(quizAttempts.reduce((acc, q) => acc + q.percentage, 0) / quizAttempts.length)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* 1. Top Profile Hero Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl font-black text-amber-400 shadow-inner">
            {profile?.full_name?.charAt(0) || 'น'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                {profile?.full_name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-extrabold uppercase">
                นักเรียน
              </span>
            </div>
            <p className="text-xs text-blue-200 mt-1">
              {profile?.grade_level} • {profile?.classroom_name} {profile?.student_number !== '-' && `เลขที่ ${profile?.student_number}`} • {profile?.school || 'โรงเรียนวัดบางโฉลงใน'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 relative z-10">
          <button
            type="button"
            onClick={() => setShowJoinModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>สมัครเข้าห้องเรียนด้วยรหัส</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold backdrop-blur-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ออกจากระบบ</span>
          </button>
        </div>
      </div>

      {/* 2. Stat Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center shrink-0">
            <School className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 dark:text-white block">
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
            <span className="text-2xl font-black text-slate-900 dark:text-white block">
              {completedCount}
            </span>
            <span className="text-xs text-slate-500">บทเรียนที่เรียนจบ</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 dark:text-white block">
              {avgScore}%
            </span>
            <span className="text-xs text-slate-500">คะแนนสอบเฉลี่ย</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center shrink-0">
            <Send className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 dark:text-white block">
              {homeworkList.length}
            </span>
            <span className="text-xs text-slate-500">การบ้านที่ส่ง</span>
          </div>
        </div>
      </div>

      {/* 3. Tab Bar Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('classrooms')}
          className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'classrooms'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          🏫 ห้องเรียนของฉัน ({enrollments.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('quizzes')}
          className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'quizzes'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          📝 ผลคะแนนสอบ ({quizAttempts.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('homework')}
          className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'homework'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          📤 การบ้านที่ส่ง ({homeworkList.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('leaderboard')}
          className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'leaderboard'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          🏆 กระดานผู้นำ & เหรียญรางวัล
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'logs'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          📜 Log การเข้าเรียน ({learningLogs.length})
        </button>
      </div>

      {/* 4. Tab 1: Enrolled Classrooms */}
      {activeTab === 'classrooms' && (
        <div className="space-y-4">
          {enrollments.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
              <School className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                ยังไม่ได้สมัครเข้าห้องเรียนใด
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                กดปุ่ม &quot;สมัครเข้าห้องเรียนด้วยรหัส&quot; ด้านบน แล้วพิมพ์รหัสวิชา (เช่น COM01, HIST601) เพื่อเริ่มเรียนได้ทันที
              </p>
              <button
                type="button"
                onClick={() => setShowJoinModal(true)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs hover:bg-blue-700"
              >
                + สมัครเข้าห้องเรียนตอนนี้
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((enr) => {
                const cls = enr.classroom;
                if (!cls) return null;

                return (
                  <div
                    key={enr.id}
                    className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all flex flex-col overflow-hidden group"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                      <Image
                        src={cls.cover_image || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop'}
                        alt={cls.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                        {cls.grade_level || 'ทุกระดับชั้น'}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <span className="text-[10px] font-bold text-blue-600 uppercase">
                          {cls.subject || 'กลุ่มสาระการเรียนรู้'}
                        </span>
                        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mt-1 group-hover:text-blue-600 transition-colors">
                          {cls.title}
                        </h3>
                        {cls.description && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                            {cls.description}
                          </p>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => openCertificate(`ผ่านการเรียนรู้หลักสูตร "${cls.title}"`)}
                          className="text-[11px] font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>เกียรติบัตร</span>
                        </button>

                        <Link
                          href={`/classroom/${cls.slug}`}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
                        >
                          <span>เข้าเรียน</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 5. Tab 2: Quiz Scores */}
      {activeTab === 'quizzes' && (
        <div className="space-y-4">
          {quizAttempts.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 space-y-3">
              <CheckSquare className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">ยังไม่มีประวัติการทำแบบทดสอบ</h3>
              <p className="text-xs text-slate-500">ไปที่ศูนย์แบบทดสอบเพื่อฝึกทำข้อสอบเก็บคะแนนได้ทันที</p>
              <Link href="/quiz" className="inline-flex px-5 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-xs">
                ไปที่ศูนย์แบบทดสอบ
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {quizAttempts.map((att) => (
                <div
                  key={att.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {att.quiz_title}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                        att.percentage >= 60
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        {att.percentage >= 60 ? 'ผ่านเกณฑ์ ✅' : 'ไม่ผ่านเกณฑ์ ⚠️'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 flex items-center gap-3">
                      <span>{att.grade_level || 'ทุกระดับชั้น'}</span>
                      <span>•</span>
                      <span>วันที่ทำ: {new Date(att.started_at).toLocaleDateString('th-TH')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-lg font-black text-blue-600 block">
                        {att.score} / {att.total_score} ({att.percentage}%)
                      </span>
                    </div>

                    {att.percentage >= 60 && (
                      <button
                        type="button"
                        onClick={() => openCertificate(`ผ่านการทดสอบวัดผลสัมฤทธิ์ "${att.quiz_title}"`, att.percentage)}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>เกียรติบัตร</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. Tab 3: Homework Submissions */}
      {activeTab === 'homework' && (
        <div className="space-y-4">
          {homeworkList.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 space-y-3">
              <Send className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">ยังไม่มีรายการส่งการบ้าน</h3>
              <p className="text-xs text-slate-500">นักเรียนสามารถส่งภาพใบงาน หรือลิงก์ Scratch ในแต่ละบทเรียนได้</p>
            </div>
          ) : (
            <div className="space-y-3">
              {homeworkList.map((hw) => (
                <div
                  key={hw.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                        ชิ้นงานประจำบทเรียน
                      </span>
                      {hw.status === 'graded' ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold">
                          ตรวจแล้ว (คะแนน: {hw.score}/{hw.max_score})
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 text-xs font-bold">
                          รอครูตรวจ
                        </span>
                      )}
                    </div>

                    {hw.teacher_feedback && (
                      <p className="text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-1 font-semibold">
                        <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                        <span>ข้อเสนอแนะครู: &quot;{hw.teacher_feedback}&quot;</span>
                      </p>
                    )}

                    <div className="text-[10px] text-slate-400">
                      ส่งเมื่อ: {new Date(hw.submitted_at).toLocaleString('th-TH')}
                    </div>
                  </div>

                  {hw.content_url && (
                    <a
                      href={hw.content_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 flex items-center gap-1 shrink-0"
                    >
                      <span>เปิดดูชิ้นงานที่ส่ง</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 7. Tab 4: Leaderboard & Badges */}
      {activeTab === 'leaderboard' && (
        <LeaderboardCard currentUserId={profile?.id} />
      )}

      {/* 8. Tab 5: Activity Learning Logs */}
      {activeTab === 'logs' && (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-100 dark:border-slate-800 text-slate-500 font-bold">
                <tr>
                  <th className="px-6 py-3.5">ประเภทกิจกรรม</th>
                  <th className="px-6 py-3.5">รหัสบทเรียน</th>
                  <th className="px-6 py-3.5 text-right">วันที่และเวลา</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {learningLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="px-6 py-3.5 font-bold">
                      {log.action === 'complete' ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-600">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>เรียนจบและบันทึกความก้าวหน้า</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-blue-600">
                          <PlayCircle className="w-3.5 h-3.5" />
                          <span>เปิดดูคลิปวิดีโอบทเรียน</span>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-slate-500 font-mono">
                      {log.lesson_id}
                    </td>
                    <td className="px-6 py-3.5 text-right text-slate-400 font-mono">
                      {new Date(log.created_at).toLocaleString('th-TH')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Join Code Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                สมัครเข้าห้องเรียนด้วยรหัส
              </h3>
              <p className="text-xs text-slate-500">
                กรอกรหัสเข้าห้องเรียนที่ได้รับจากครูจักรพงษ์ เช่น COM01 หรือ HIST601
              </p>
            </div>

            <form onSubmit={handleEnroll} className="space-y-4">
              <div>
                <input
                  type="text"
                  required
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="พิมพ์รหัส เช่น COM01"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-center font-mono text-base font-extrabold uppercase tracking-widest text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={joining}
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {joining ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>ยืนยันการสมัคร</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {selectedCert && (
        <CertificateModal
          isOpen={!!selectedCert}
          onClose={() => setSelectedCert(null)}
          data={selectedCert}
        />
      )}
    </div>
  );
}
