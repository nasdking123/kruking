'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, Search, ExternalLink, LogOut } from 'lucide-react';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/toast';

export function AdminHeader({
  onToggleSidebar,
}: {
  onToggleSidebar: () => void;
}) {
  const router = useRouter();
  const toast = useToast();

  const handleSignOut = async () => {
    if (confirm('คุณต้องการออกจากระบบจัดการหลังบ้านใช่หรือไม่?')) {
      const supabase = createClient();
      await supabase.auth.signOut();
      toast.success('ออกจากระบบเรียบร้อย', 'กลับสู่หน้าเข้าสู่ระบบ');
      router.push('/login');
      router.refresh();
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="เปิดเมนูนำทาง"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Admin Search */}
        <div className="relative hidden sm:block w-64 md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาข้อมูลหลังบ้าน..."
            className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
        >
          <span>ดูหน้าเว็บจริง</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </Link>

        <ThemeToggle />

        {/* Logout Button */}
        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-300 text-xs font-bold transition-colors cursor-pointer border border-rose-200/60 dark:border-rose-900"
          title="ออกจากระบบ"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">ออกจากระบบ</span>
        </button>
      </div>
    </header>
  );
}
