'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, User, BookOpen, ArrowRight, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/toast';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/admin';
  const toast = useToast();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameOrEmail.trim() || !password.trim()) {
      toast.error('กรุณากรอกข้อมูลให้ครบถ้วน', 'โปรดระบุชื่อผู้ใช้และรหัสผ่าน');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      
      // If user enters "nasdking123" without domain, map to email
      let emailToAuth = usernameOrEmail.trim();
      if (!emailToAuth.includes('@')) {
        emailToAuth = `${emailToAuth}@school.ac.th`;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailToAuth,
        password: password.trim(),
      });

      if (error) {
        // Try fallback email nasdking123@gmail.com
        if (!usernameOrEmail.includes('@')) {
          const { data: data2, error: error2 } = await supabase.auth.signInWithPassword({
            email: `${usernameOrEmail.trim()}@gmail.com`,
            password: password.trim(),
          });
          if (!error2 && data2.session) {
            toast.success('เข้าสู่ระบบสำเร็จ', 'ยินดีต้อนรับเข้าสู่ระบบจัดการหลังบ้าน');
            router.push(redirectTo);
            router.refresh();
            return;
          }
        }
        toast.error('เข้าสู่ระบบไม่สำเร็จ', error.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      } else if (data.session) {
        toast.success('เข้าสู่ระบบสำเร็จ', 'ยินดีต้อนรับเข้าสู่ระบบจัดการหลังบ้าน');
        router.push(redirectTo);
        router.refresh();
      }
    } catch {
      toast.error('เกิดข้อผิดพลาด', 'โปรดตรวจสอบชื่อผู้ใช้และรหัสผ่านอีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-blue-500/30">
          <BookOpen className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          เข้าสู่ระบบผู้ดูแลหลังบ้าน
        </h1>
        <p className="text-xs text-slate-500">
          ระบบจัดการเว็บไซต์ &quot;ห้องสื่อครูคิง&quot; (Admin Control Panel)
        </p>
      </div>

      {/* Login Card */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xl space-y-6">
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              ชื่อผู้ใช้งาน หรือ อีเมล (Username / Email) *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="nasdking123"
                required
                autoComplete="username"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              รหัสผ่าน (Password) *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                autoComplete="current-password"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !usernameOrEmail.trim() || !password.trim()}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>กำลังตรวจสอบความถูกต้อง...</span>
              </>
            ) : (
              <>
                <span>เข้าสู่ระบบ (Sign In)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Back to Home Link */}
      <div className="text-center">
        <Link
          href="/"
          className="text-xs text-slate-500 hover:text-blue-600 transition-colors"
        >
          ← กลับสู่หน้าหลักเว็บไซต์
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Suspense fallback={
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <span>กำลังโหลดหน้าเข้าสู่ระบบ...</span>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
