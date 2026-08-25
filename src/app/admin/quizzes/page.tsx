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
  ExternalLink 
} from 'lucide-react';
import { getQuizzes, type QuizWithQuestions } from '@/services/quiz';
import { useToast } from '@/components/ui/toast';

export default function AdminQuizzesPage() {
  const [quizzes, setQuizzes] = useState<QuizWithQuestions[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const toast = useToast();

  useEffect(() => {
    async function load() {
      const data = await getQuizzes();
      setQuizzes(data);
    }
    load();
  }, []);

  const filteredQuizzes = quizzes.filter((q) => 
    q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (q.description && q.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDelete = (id: string, title: string) => {
    if (confirm(`คุณต้องการลบแบบทดสอบ "${title}" ใช่หรือไม่?`)) {
      setQuizzes(quizzes.filter((q) => q.id !== id));
      toast.success('ลบสำเร็จ', `ลบแบบทดสอบ "${title}" เรียบร้อยแล้ว`);
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-emerald-600" />
            <span>จัดการแบบทดสอบออนไลน์ (Quiz Manager)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            สร้าง จัดการข้อสอบ ปรับเวลาทำข้อสอบ และดูสถิติการประเมินผลผู้เรียน
          </p>
        </div>

        <Link
          href="/admin/quizzes/new"
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 w-fit cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ สร้างแบบทดสอบใหม่</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex items-center justify-between">
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
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800/80 text-slate-500">
            <tr>
              <th className="px-6 py-4 font-bold">ชื่อชุดแบบทดสอบ</th>
              <th className="px-6 py-4 font-bold">ระดับชั้น / วิชา</th>
              <th className="px-6 py-4 font-bold">จำนวนข้อ</th>
              <th className="px-6 py-4 font-bold">เวลาทำข้อสอบ</th>
              <th className="px-6 py-4 font-bold text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredQuizzes.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                  ไม่พบรายการแบบทดสอบในระบบ
                </td>
              </tr>
            ) : (
              filteredQuizzes.map((quiz) => (
                <tr key={quiz.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white max-w-sm">
                    <div className="truncate">{quiz.title}</div>
                    <span className="text-[10px] text-slate-400 font-mono">/quiz/{quiz.slug || quiz.id}</span>
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
    </div>
  );
}
