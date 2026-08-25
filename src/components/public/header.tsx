'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BookOpen, 
  Menu as MenuIcon, 
  X, 
  Search, 
  Sparkles, 
  School, 
  LayoutDashboard,
  FileText,
  Gamepad2,
  FolderOpen,
  Trophy,
  GraduationCap
} from 'lucide-react';
import { ThemeToggle } from '@/components/common/theme-toggle';

const defaultNavLinks = [
  { title: 'หน้าแรก', href: '/' },
  { title: 'สื่อการสอน', href: '/resources', icon: FolderOpen },
  { title: 'ใบงาน', href: '/worksheets', icon: FileText },
  { title: 'เกมการเรียนรู้', href: '/games', icon: Gamepad2 },
  { title: 'แผนการสอน', href: '/lesson-plans', icon: BookOpen },
  { title: 'ห้องเรียน', href: '/classroom', icon: School, highlight: true },
  { title: 'เกียรติบัตร & ผลงาน', href: '/certificates', icon: Trophy },
  { title: 'AI ครู', href: '/ai', icon: Sparkles, badge: 'AI' },
  { title: 'เกี่ยวกับครูคิง', href: '/about' },
];

export function PublicHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-tight tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              ห้องสื่อครูคิง
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Education Platform & CMS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {defaultNavLinks.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                } ${item.highlight ? 'font-semibold text-indigo-600 dark:text-indigo-400' : ''}`}
              >
                {Icon && <Icon className="w-4 h-4 opacity-75" />}
                <span>{item.title}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-500 text-white rounded-md shadow-xs">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Search */}
          <Link
            href="/search"
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-500 text-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>ค้นหา...</span>
            <kbd className="px-1 py-0.5 text-[10px] bg-slate-200 dark:bg-slate-800 rounded font-mono text-slate-500">⌘K</kbd>
          </Link>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Student Portal Button */}
          <Link
            href="/student/dashboard"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ระบบนักเรียน</span>
            <span className="sm:hidden">นักเรียน</span>
          </Link>

          {/* Admin / Login Button */}
          <Link
            href="/admin"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 text-xs font-bold shadow-xs transition-colors"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>ครูผู้สอน</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="เปิดเมนูนำทาง"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-1">
          {defaultNavLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
                pathname === item.href
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{item.title}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-500 text-white rounded">
                    {item.badge}
                  </span>
                )}
              </div>
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>เข้าสู่ระบบหลังบ้าน (Admin)</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
