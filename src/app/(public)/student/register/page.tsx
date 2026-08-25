'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  UserPlus, 
  GraduationCap, 
  User, 
  Lock, 
  School, 
  Hash, 
  ArrowRight,
  Loader2,
  KeyRound
} from 'lucide-react';
import { registerStudent } from '@/services/student';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/toast';

export default function StudentRegisterPage() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState('');
  const [gradeLevel, setGradeLevel] = useState('ประถมศึกษาปีที่ 6');
  const [classroomName, setClassroomName] = useState('ห้อง 1');
  const [studentNumber, setStudentNumber] = useState('');
  const [school, setSchool] = useState('โรงเรียนวัดบางโฉลงใน');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !username || !password) {
      toast.error('กรุณากรอกข้อมูล', 'โปรดกรอกชื่อ-นามสกุล ชื่อผู้ใช้ และรหัสผ่าน');
      return;
    }

    setLoading(true);
    const res = await registerStudent({
      fullName,
      username: username.trim().toLowerCase(),
      password,
      gradeLevel,
      studentNumber,
      classroomName,
      school,
    });

    if (!res.success) {
      setLoading(false);
      toast.error('สมัครไม่สำเร็จ', res.error || 'เกิดข้อผิดพลาดในการลงทะเบียน');
      return;
    }

    // Auto sign-in with formatted username
    const formattedEmail = username.includes('@') 
      ? username.trim().toLowerCase() 
      : `${username.trim().toLowerCase().replace(/[^a-z0-9_.-]/g, '')}@student.kruking.ac.th`;

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: formattedEmail,
      password,
    });

    setLoading(false);

    if (signInError) {
      toast.success('สมัครสมาชิกสำเร็จ', 'กรุณาเข้าสู่ระบบด้วยชื่อผู้ใช้และรหัสผ่าน');
      router.push('/student/login');
    } else {
      toast.success('ยินดีต้อนรับ!', `ยินดีต้อนรับ ${fullName} เข้าสู่ระบบนักเรียน`);
      router.push('/student/dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold shadow-xs">
            <GraduationCap className="w-4 h-4" />
            <span>Student Registration Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            สมัครสมาชิกนักเรียนเข้าใช้งาน
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            ลงทะเบียนง่ายๆ ไม่ต้องใช้อีเมล เพื่อเข้าเรียนออนไลน์และทำแบบทดสอบ
          </p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleRegister} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xl space-y-5">
          {/* Full Name */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>ชื่อ - นามสกุล (นักเรียน) *</span>
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="เช่น ด.ช.สมชาย ใจดี หรือ ด.ญ.วิภาวรรณ สดใส"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Grade & Room & Number */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                ระดับชั้น
              </label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="ประถมศึกษาปีที่ 3">ป.3</option>
                <option value="ประถมศึกษาปีที่ 4">ป.4</option>
                <option value="ประถมศึกษาปีที่ 5">ป.5</option>
                <option value="ประถมศึกษาปีที่ 6">ป.6</option>
                <option value="มัธยมศึกษาปีที่ 1">ม.1</option>
                <option value="มัธยมศึกษาปีที่ 2">ม.2</option>
                <option value="มัธยมศึกษาปีที่ 3">ม.3</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                ห้อง
              </label>
              <input
                type="text"
                value={classroomName}
                onChange={(e) => setClassroomName(e.target.value)}
                placeholder="เช่น ห้อง 1"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-blue-600" />
                <span>เลขที่</span>
              </label>
              <input
                type="text"
                value={studentNumber}
                onChange={(e) => setStudentNumber(e.target.value)}
                placeholder="เช่น 15"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* School */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1">
              <School className="w-3.5 h-3.5 text-blue-600" />
              <span>โรงเรียน</span>
            </label>
            <input
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="เช่น โรงเรียนวัดบางโฉลงใน"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Username (NO EMAIL REQUIRED) */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
              <span>ชื่อผู้ใช้สำหรับล็อกอิน (Username / รหัสนักเรียน) *</span>
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
              placeholder="เช่น student01, king601 หรือ เลขประจำตัวนักเรียน"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              * ใช้ภาษาอังกฤษหรือตัวเลข สำหรับใช้ล็อกอินเข้าสู่ระบบในครั้งถัดไป
            </p>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-blue-600" />
              <span>รหัสผ่าน (อย่างน้อย 6 ตัวอักษร) *</span>
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>กำลังลงทะเบียนนักเรียน...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>สมัครสมาชิกนักเรียน</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="pt-2 text-center border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500">มีชื่อผู้ใช้นักเรียนอยู่แล้ว? </span>
            <Link
              href="/student/login"
              className="text-xs font-bold text-emerald-600 hover:underline"
            >
              เข้าสู่ระบบที่นี่
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
