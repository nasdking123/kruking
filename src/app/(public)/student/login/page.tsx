'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  LogIn, 
  GraduationCap, 
  Mail, 
  Lock, 
  ArrowRight,
  Loader2
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/toast';

export default function StudentLoginPage() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('กรุณากรอกข้อมูล', 'โปรดกรอกอีเมลและรหัสผ่าน');
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    setLoading(false);

    if (error) {
      toast.error('เข้าสู่ระบบไม่สำเร็จ', 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      return;
    }

    toast.success('เข้าสู่ระบบสำเร็จ', 'กำลังนำท่านเข้าสู่แดชบอร์ดนักเรียน');
    router.push('/student/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold">
            <GraduationCap className="w-4 h-4" />
            <span>Student Portal Login</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            เข้าสู่ระบบนักเรียน
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            เข้าสู่ห้องเรียนออนไลน์ ดูประวัติคะแนนสอบ และบันทึกการเรียน
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xl space-y-5">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-blue-600" />
              <span>อีเมล หรือ ชื่อผู้ใช้ *</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@school.ac.th"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-blue-600" />
              <span>รหัสผ่าน *</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>กำลังเข้าสู่ระบบ...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>เข้าสู่ระบบนักเรียน</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="pt-3 text-center border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div>
              <span className="text-xs text-slate-500">ยังไม่มีบัญชีนักเรียน? </span>
              <Link
                href="/student/register"
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                สมัครสมาชิกที่นี่
              </Link>
            </div>
            <div>
              <Link
                href="/login"
                className="text-[11px] text-slate-400 hover:text-slate-600"
              >
                เข้าสู่ระบบสำหรับครูและผู้ดูแลระบบ (Admin Login) →
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
