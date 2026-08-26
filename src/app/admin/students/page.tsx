'use client';

import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  School, 
  Search, 
  CheckCircle2, 
  CheckSquare, 
  User, 
  Eye, 
  Loader2,
  Filter,
  Download,
  FileText
} from 'lucide-react';
import { getAllStudentsAnalytics, type StudentAnalyticsItem, type StudentEnrollment, type StudentQuizAttempt } from '@/services/student';
import { exportStudentsToExcel } from '@/services/export-excel';
import { AssignmentGradingModal } from '@/components/admin/assignment-grading-modal';

export default function AdminStudentsAnalyticsPage() {
  const [students, setStudents] = useState<StudentAnalyticsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('ALL');
  const [selectedStudent, setSelectedStudent] = useState<StudentAnalyticsItem | null>(null);
  const [showGradingModal, setShowGradingModal] = useState(false);

  useEffect(() => {
    let ignore = false;
    getAllStudentsAnalytics().then((data) => {
      if (!ignore) {
        setStudents(data);
        setLoading(false);
      }
    });
    return () => {
      ignore = true;
    };
  }, []);

  const filteredStudents = students.filter((std) => {
    const matchesSearch = 
      std.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      std.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (std.school && std.school.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesGrade = gradeFilter === 'ALL' || (std.grade_level && std.grade_level.includes(gradeFilter));

    return matchesSearch && matchesGrade;
  });

  const handleExport = () => {
    exportStudentsToExcel(filteredStudents, 'kruking_gradebook_p6_p3');
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* 1. Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <GraduationCap className="w-7 h-7 text-blue-600" />
            <span>ระบบข้อมูลนักเรียน & รายงานผลการเรียน (Student Analytics Hub)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            ดูรายชื่อนักเรียนที่สมัครเข้าใช้งาน, ห้องเรียนที่สมัครเข้าเรียน, Log การดูคลิป และตารางคะแนนสอบรายบุคคล
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setShowGradingModal(true)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>ตรวจการบ้านนักเรียน</span>
          </button>

          <button
            type="button"
            onClick={handleExport}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>ส่งออก Excel (.csv)</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center shrink-0">
            <User className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white block">
              {students.length}
            </span>
            <span className="text-xs text-slate-500">นักเรียนทั้งหมด</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
            <School className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white block">
              {students.reduce((acc, s) => acc + (s.enrollments?.length || 0), 0)}
            </span>
            <span className="text-xs text-slate-500">ยอดการสมัครเข้าห้องเรียน</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center shrink-0">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white block">
              {students.reduce((acc, s) => acc + (s.attempts?.length || 0), 0)}
            </span>
            <span className="text-xs text-slate-500">ครั้งที่ทำแบบทดสอบ</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white block">
              {students.reduce((acc, s) => acc + (s.completed_lessons_count || 0), 0)}
            </span>
            <span className="text-xs text-slate-500">บทเรียนที่เรียนจบ</span>
          </div>
        </div>
      </div>

      {/* 3. Search and Filters */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาชื่อนักเรียน, Username, โรงเรียน..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="ALL">ทุกระดับชั้น</option>
            <option value="ป.6">ประถมศึกษาปีที่ 6</option>
            <option value="ป.3">ประถมศึกษาปีที่ 3</option>
            <option value="ป.4">ประถมศึกษาปีที่ 4</option>
            <option value="ป.5">ประถมศึกษาปีที่ 5</option>
            <option value="มัธยม">มัธยมศึกษา</option>
          </select>
        </div>
      </div>

      {/* 4. Students Table */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <span className="text-xs">กำลังโหลดรายชื่อนักเรียนและข้อมูลคะแนน...</span>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 space-y-2">
          <User className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-900 dark:text-white">ไม่พบข้อมูลนักเรียน</p>
          <p className="text-xs text-slate-500">ยังไม่มีนักเรียนลงทะเบียน หรือไม่มีข้อมูลที่ตรงกับคำค้นหา</p>
        </div>
      ) : (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-100 dark:border-slate-800 text-slate-500 font-bold">
                <tr>
                  <th className="px-6 py-4">ชื่อ - นามสกุล</th>
                  <th className="px-4 py-4">ระดับชั้น/ห้อง/เลขที่</th>
                  <th className="px-4 py-4">โรงเรียน</th>
                  <th className="px-4 py-4 text-center">ห้องเรียนที่สมัคร</th>
                  <th className="px-4 py-4 text-center">บทเรียนที่เรียนจบ</th>
                  <th className="px-4 py-4 text-center">คะแนนสอบเฉลี่ย</th>
                  <th className="px-6 py-4 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredStudents.map((std) => (
                  <tr key={std.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                          {std.full_name?.charAt(0) || 'น'}
                        </div>
                        <div>
                          <div>{std.full_name}</div>
                          <div className="text-[10px] text-slate-400 font-mono font-normal">
                            @{std.email.replace('@student.kruking.ac.th', '')}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                        {std.grade_level} {std.classroom_name && `(${std.classroom_name})`} {std.student_number !== '-' && `เลขที่ ${std.student_number}`}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-slate-600 dark:text-slate-400">
                      {std.school || '-'}
                    </td>

                    <td className="px-4 py-4 text-center font-bold text-blue-600">
                      {std.enrollments?.length || 0} วิชา
                    </td>

                    <td className="px-4 py-4 text-center font-bold text-emerald-600">
                      {std.completed_lessons_count || 0} บท
                    </td>

                    <td className="px-4 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full font-bold text-xs ${
                        std.average_score >= 60
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {std.average_score}% ({std.attempts?.length || 0} ชุด)
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedStudent(std)}
                        className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 text-blue-600 text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>ดูประวัติ & คะแนน</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Student Drill-down Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  สมุดรายงานผลการเรียน: {selectedStudent.full_name}
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedStudent.grade_level} • {selectedStudent.school}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>

            {/* Enrolled Classrooms */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <School className="w-4 h-4 text-blue-600" />
                <span>ห้องเรียนที่สมัครเข้าเรียน ({selectedStudent.enrollments?.length || 0})</span>
              </h4>
              {selectedStudent.enrollments?.length === 0 ? (
                <p className="text-xs text-slate-400 py-2">ยังไม่ได้สมัครเข้าห้องเรียนใด</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedStudent.enrollments?.map((enr: StudentEnrollment) => (
                    <div key={enr.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs">
                      <div className="font-bold text-slate-900 dark:text-white truncate">
                        {enr.classroom?.title || 'ห้องเรียน'}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {enr.classroom?.subject} • เข้าเรียนเมื่อ {new Date(enr.joined_at).toLocaleDateString('th-TH')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quiz Attempts Scores */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-amber-500" />
                <span>ประวัติคะแนนสอบข้อสอบทั้งหมด ({selectedStudent.attempts?.length || 0})</span>
              </h4>
              {selectedStudent.attempts?.length === 0 ? (
                <p className="text-xs text-slate-400 py-2">ยังไม่มีประวัติการทำแบบทดสอบ</p>
              ) : (
                <div className="space-y-2">
                  {selectedStudent.attempts?.map((att: StudentQuizAttempt) => (
                    <div key={att.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          {att.quiz_title || 'แบบทดสอบ'}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(att.started_at).toLocaleString('th-TH')}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-extrabold text-sm text-blue-600 block">
                          {att.score} / {att.total_score} ({att.percentage}%)
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600">
                          {att.percentage >= 60 ? 'ผ่านเกณฑ์ ✅' : 'ไม่ผ่าน ⚠️'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Teacher Assignment Grading Modal */}
      <AssignmentGradingModal
        isOpen={showGradingModal}
        onClose={() => setShowGradingModal(false)}
      />
    </div>
  );
}
