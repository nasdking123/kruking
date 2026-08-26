'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Clock, 
  HelpCircle, 
  Trash2, 
  ExternalLink,
  Users,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  Loader2
} from 'lucide-react';
import { 
  getQuizzes, 
  getQuizAttemptsForAdmin, 
  type QuizWithQuestions, 
  type AdminQuizAttemptItem 
} from '@/services/quiz';
import { useToast } from '@/components/ui/toast';

export default function AdminQuizzesPage() {
  const [quizzes, setQuizzes] = useState<QuizWithQuestions[]>([]);
  const [attempts, setAttempts] = useState<AdminQuizAttemptItem[]>([]);
  const [activeTab, setActiveTab] = useState<'quizzes' | 'results'>('quizzes');
  const [selectedQuizFilter, setSelectedQuizFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    let ignore = false;
    async function init() {
      const [qList, aList] = await Promise.all([
        getQuizzes(),
        getQuizAttemptsForAdmin()
      ]);
      if (!ignore) {
        setQuizzes(qList);
        setAttempts(aList);
        setLoading(false);
      }
    }
    init();
    return () => {
      ignore = true;
    };
  }, []);

  const handleDelete = (id: string, title: string) => {
    if (confirm(`คุณต้องการลบแบบทดสอบ "${title}" ใช่หรือไม่?`)) {
      setQuizzes((prev) => prev.filter((q) => q.id !== id));
      toast.success('ลบสำเร็จ', `ลบแบบทดสอบ "${title}" เรียบร้อยแล้ว`);
    }
  };

  const filteredQuizzes = quizzes.filter((q) => 
    q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (q.description && q.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredAttempts = attempts.filter((att) => {
    const matchesQuiz = selectedQuizFilter === 'ALL' || att.quizId === selectedQuizFilter;
    const matchesSearch = 
      att.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      att.studentSchool.toLowerCase().includes(searchQuery.toLowerCase()) ||
      att.quizTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesQuiz && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckSquare className="w-4 h-4" />
            <span>Online Assessment & Examination Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            จัดการแบบทดสอบออนไลน์ & รายงานคะแนนสอบ
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            สร้างข้อสอบ, กำหนดรหัสผ่านเข้าห้องสอบ (Passcode), และดูรายงานคะแนนนักเรียนแบบ Real-time
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/quizzes/new"
            className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ สร้างแบบทดสอบใหม่</span>
          </Link>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/60 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('quizzes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'quizzes'
              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          📝 ชุดแบบทดสอบ ({quizzes.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('results')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'results'
              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>ผลคะแนนและประวัติผู้เข้าสอบ ({attempts.length} ครั้ง)</span>
        </button>
      </div>

      {/* TAB 1: Quizzes List */}
      {activeTab === 'quizzes' && (
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาชื่อแบบทดสอบ..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Quizzes Table */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden">
            {loading ? (
              <div className="py-16 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                <span className="text-xs text-slate-400">กำลังโหลดรายการแบบทดสอบ...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-6 py-4">ชื่อชุดแบบทดสอบ</th>
                      <th className="px-6 py-4">รหัสผ่าน (Passcode)</th>
                      <th className="px-6 py-4">ระดับชั้น / วิชา</th>
                      <th className="px-6 py-4">จำนวนข้อ</th>
                      <th className="px-6 py-4">เวลา</th>
                      <th className="px-6 py-4 text-center">ผู้ทำข้อสอบ</th>
                      <th className="px-6 py-4 text-right">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredQuizzes.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                          ไม่พบรายการแบบทดสอบในระบบ
                        </td>
                      </tr>
                    ) : (
                      filteredQuizzes.map((quiz) => (
                        <tr key={quiz.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-900 dark:text-white max-w-sm">
                            <div className="truncate font-extrabold">{quiz.title}</div>
                            <span className="text-[10px] text-slate-400 font-mono">/quiz/{quiz.slug || quiz.id}</span>
                          </td>

                          <td className="px-6 py-4">
                            {quiz.access_code ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-mono font-bold text-[11px] border border-amber-200 dark:border-amber-900">
                                <Lock className="w-3 h-3 text-amber-600" />
                                <span>{quiz.access_code}</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-slate-400 text-[11px]">
                                <Unlock className="w-3 h-3" />
                                <span>เปิดเสรี</span>
                              </span>
                            )}
                          </td>

                          <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                            <div>{quiz.grade_level || 'ทุกระดับชั้น'}</div>
                            <span className="text-[10px] text-emerald-600 font-semibold">{quiz.subject}</span>
                          </td>

                          <td className="px-6 py-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                            <span className="flex items-center gap-1">
                              <HelpCircle className="w-3.5 h-3.5 text-emerald-500" />
                              <span>{quiz.questions?.length || 0} ข้อ</span>
                            </span>
                          </td>

                          <td className="px-6 py-4 font-mono text-slate-700 dark:text-slate-300">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-blue-500" />
                              <span>{quiz.time_limit} นาที</span>
                            </span>
                          </td>

                          <td className="px-6 py-4 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedQuizFilter(quiz.id);
                                setActiveTab('results');
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 font-bold text-[11px] transition-colors cursor-pointer"
                              title="คลิกเพื่อดูคะแนนนักเรียนชุดนี้"
                            >
                              <Users className="w-3 h-3" />
                              <span>{quiz.attemptsCount || 0} คน</span>
                            </button>
                          </td>

                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/quiz/${quiz.slug || quiz.id}`}
                                target="_blank"
                                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-emerald-600 transition-colors"
                                title="ทดสอบทำข้อสอบ"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Link>
                              <button
                                type="button"
                                onClick={() => handleDelete(quiz.id, quiz.title)}
                                className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                                title="ลบ"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Student Results & Logs */}
      {activeTab === 'results' && (
        <div className="space-y-4">
          {/* Filter Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาชื่อนักเรียน, โรงเรียน, หรือข้อสอบ..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Quiz Selector */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-400 font-bold hidden sm:inline">ชุดข้อสอบ:</span>
              <select
                value={selectedQuizFilter}
                onChange={(e) => setSelectedQuizFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ALL">แบบทดสอบทั้งหมด ({quizzes.length})</option>
                {quizzes.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Attempts Table */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden">
            {loading ? (
              <div className="py-16 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                <span className="text-xs text-slate-400">กำลังโหลดรายงานผลคะแนน...</span>
              </div>
            ) : filteredAttempts.length === 0 ? (
              <div className="py-16 text-center text-xs text-slate-400 space-y-2">
                <CheckSquare className="w-10 h-10 text-slate-300 mx-auto" />
                <p>ยังไม่มีประวัติการทำข้อสอบตามเงื่อนไขที่เลือก</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-6 py-4">นักเรียน</th>
                      <th className="px-6 py-4">ชั้น / ห้อง / โรงเรียน</th>
                      <th className="px-6 py-4">ชุดแบบทดสอบ</th>
                      <th className="px-6 py-4 text-center">คะแนน</th>
                      <th className="px-6 py-4 text-center">ร้อยละ (%)</th>
                      <th className="px-6 py-4 text-center">ผลการประเมิน</th>
                      <th className="px-6 py-4">เวลาที่ใช้</th>
                      <th className="px-6 py-4 text-right">วันที่ส่ง</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredAttempts.map((att) => {
                      const minutes = Math.floor(att.timeSpentSeconds / 60);
                      const seconds = att.timeSpentSeconds % 60;
                      const formattedDate = new Date(att.submittedAt).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      });

                      return (
                        <tr key={att.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="px-6 py-4 font-extrabold text-slate-900 dark:text-white">
                            {att.studentName}
                          </td>

                          <td className="px-6 py-4 text-slate-500">
                            <div>{att.studentGrade} • {att.studentRoom}</div>
                            <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold">{att.studentSchool}</span>
                          </td>

                          <td className="px-6 py-4 max-w-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                            {att.quizTitle}
                          </td>

                          <td className="px-6 py-4 text-center font-mono font-black text-sm text-slate-900 dark:text-white">
                            {att.score} / {att.totalScore}
                          </td>

                          <td className="px-6 py-4 text-center font-mono font-bold">
                            <span className={`px-2.5 py-1 rounded-lg text-xs ${
                              att.percentage >= 80
                                ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600'
                                : att.percentage >= 60
                                ? 'bg-blue-50 dark:bg-blue-950 text-blue-600'
                                : 'bg-rose-50 dark:bg-rose-950 text-rose-600'
                            }`}>
                              {att.percentage}%
                            </span>
                          </td>

                          <td className="px-6 py-4 text-center">
                            {att.passed ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>ผ่านเกณฑ์</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold text-[10px]">
                                <XCircle className="w-3 h-3" />
                                <span>ไม่ผ่าน</span>
                              </span>
                            )}
                          </td>

                          <td className="px-6 py-4 font-mono text-slate-500">
                            {minutes > 0 ? `${minutes}น. ` : ''}{seconds}วิ.
                          </td>

                          <td className="px-6 py-4 text-right font-mono text-slate-400 whitespace-nowrap">
                            {formattedDate}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
