'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  GraduationCap,
  ChevronDown,
  Download,
  Lightbulb,
  CheckSquare,
  User
} from 'lucide-react';
import { ThemeToggle } from '@/components/common/theme-toggle';

export function PublicHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const resourcesRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (resourcesRef.current && !resourcesRef.current.contains(event.target as Node)) {
        setResourcesOpen(false);
      }
      if (aboutRef.current && !aboutRef.current.contains(event.target as Node)) {
        setAboutOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isResourcesActive = 
    pathname.startsWith('/resources') || 
    pathname.startsWith('/worksheets') || 
    pathname.startsWith('/games') || 
    pathname.startsWith('/lesson-plans') || 
    pathname.startsWith('/downloads');

  const isAboutActive = 
    pathname.startsWith('/about') || 
    pathname.startsWith('/certificates') || 
    pathname.startsWith('/innovation') ||
    pathname.startsWith('/portfolio');

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base sm:text-lg leading-tight tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors whitespace-nowrap">
              ห้องสื่อครูคิง
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
              Education Platform & CMS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-1.5">
          {/* 1. หน้าแรก */}
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              pathname === '/'
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            หน้าแรก
          </Link>

          {/* 2. ห้องเรียนออนไลน์ */}
          <Link
            href="/classroom"
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              pathname.startsWith('/classroom')
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <School className="w-3.5 h-3.5 text-blue-600" />
            <span>ห้องเรียนออนไลน์</span>
            <span className="px-1.5 py-0.2 rounded-md bg-blue-600 text-white text-[9px] font-bold">ใหม่</span>
          </Link>

          {/* 3. คลังสื่อการสอน (Dropdown) */}
          <div className="relative" ref={resourcesRef}>
            <button
              type="button"
              onClick={() => {
                setResourcesOpen(!resourcesOpen);
                setAboutOpen(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                isResourcesActive
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>คลังสื่อการสอน</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${resourcesOpen ? 'rotate-180 text-blue-600' : 'opacity-60'}`} />
            </button>

            {resourcesOpen && (
              <div className="absolute left-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 space-y-1">
                <Link
                  href="/resources"
                  onClick={() => setResourcesOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 transition-colors"
                >
                  <FolderOpen className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>สื่อการสอนทั้งหมด</span>
                </Link>
                <Link
                  href="/worksheets"
                  onClick={() => setResourcesOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 transition-colors"
                >
                  <FileText className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>ใบงาน & แบบฝึกหัด</span>
                </Link>
                <Link
                  href="/games"
                  onClick={() => setResourcesOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 transition-colors"
                >
                  <Gamepad2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>เกมการเรียนรู้</span>
                </Link>
                <Link
                  href="/lesson-plans"
                  onClick={() => setResourcesOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>แผนการจัดการเรียนรู้</span>
                </Link>
                <Link
                  href="/downloads"
                  onClick={() => setResourcesOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 transition-colors"
                >
                  <Download className="w-4 h-4 text-purple-500 shrink-0" />
                  <span>ศูนย์ดาวน์โหลดไฟล์</span>
                </Link>
              </div>
            )}
          </div>

          {/* 4. แบบทดสอบ */}
          <Link
            href="/quiz"
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              pathname.startsWith('/quiz')
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5 text-purple-600" />
            <span>แบบทดสอบ (Quiz)</span>
          </Link>

          {/* 5. ผลงาน & ครูคิง (Dropdown) */}
          <div className="relative" ref={aboutRef}>
            <button
              type="button"
              onClick={() => {
                setAboutOpen(!aboutOpen);
                setResourcesOpen(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                isAboutActive
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>ผลงาน & ครูคิง</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${aboutOpen ? 'rotate-180 text-blue-600' : 'opacity-60'}`} />
            </button>

            {aboutOpen && (
              <div className="absolute left-0 mt-2 w-52 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 space-y-1">
                <Link
                  href="/certificates"
                  onClick={() => setAboutOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 transition-colors"
                >
                  <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>เกียรติบัตร & รางวัล</span>
                </Link>
                <Link
                  href="/innovation"
                  onClick={() => setAboutOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 transition-colors"
                >
                  <Lightbulb className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>นวัตกรรม & ผลงาน</span>
                </Link>
                <Link
                  href="/about"
                  onClick={() => setAboutOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 transition-colors"
                >
                  <User className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>เกี่ยวกับครูคิง</span>
                </Link>
              </div>
            )}
          </div>

          {/* 6. AI ครู */}
          <Link
            href="/ai"
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              pathname.startsWith('/ai')
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
            <span>AI ครู</span>
            <span className="px-1.5 py-0.2 rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[9px] font-bold shadow-xs">AI</span>
          </Link>
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Search */}
          <Link
            href="/search"
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-500 text-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors whitespace-nowrap"
          >
            <Search className="w-3.5 h-3.5" />
            <span>ค้นหา...</span>
            <kbd className="px-1 py-0.5 text-[9px] bg-slate-200 dark:bg-slate-800 rounded font-mono text-slate-500">⌘K</kbd>
          </Link>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Student Portal Button */}
          <Link
            href="/student/dashboard"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-extrabold shadow-sm transition-all whitespace-nowrap cursor-pointer"
          >
            <GraduationCap className="w-4 h-4" />
            <span className="hidden sm:inline">ระบบนักเรียน</span>
            <span className="sm:hidden">นักเรียน</span>
          </Link>

          {/* Admin / Teacher Portal Button */}
          <Link
            href="/admin"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 text-xs font-bold shadow-xs transition-all whitespace-nowrap"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>ครูผู้สอน</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="เปิดเมนูนำทาง"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-3 animate-in fade-in">
          <div className="grid grid-cols-2 gap-2 pb-2">
            <Link
              href="/student/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex flex-col items-center justify-center gap-1.5"
            >
              <GraduationCap className="w-5 h-5" />
              <span>ระบบนักเรียน</span>
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold text-xs flex flex-col items-center justify-center gap-1.5"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>หลังบ้านครูคิง</span>
            </Link>
          </div>

          <div className="space-y-1 text-xs">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <BookOpen className="w-4 h-4 text-blue-500" />
              <span>หน้าแรก</span>
            </Link>
            <Link
              href="/classroom"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <div className="flex items-center gap-2.5">
                <School className="w-4 h-4 text-blue-600" />
                <span>ห้องเรียนออนไลน์</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-[10px]">ใหม่</span>
            </Link>
            <Link
              href="/resources"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <FolderOpen className="w-4 h-4 text-blue-500" />
              <span>สื่อการสอน</span>
            </Link>
            <Link
              href="/worksheets"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <FileText className="w-4 h-4 text-emerald-500" />
              <span>ใบงาน</span>
            </Link>
            <Link
              href="/games"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Gamepad2 className="w-4 h-4 text-amber-500" />
              <span>เกมการเรียนรู้</span>
            </Link>
            <Link
              href="/quiz"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <CheckSquare className="w-4 h-4 text-purple-500" />
              <span>แบบทดสอบ (Quiz)</span>
            </Link>
            <Link
              href="/certificates"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>เกียรติบัตร & ผลงาน</span>
            </Link>
            <Link
              href="/ai"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>AI ครูคิง</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-indigo-600 text-white text-[10px]">AI</span>
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <User className="w-4 h-4 text-slate-400" />
              <span>เกี่ยวกับครูคิง</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
