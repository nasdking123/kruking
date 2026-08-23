import React from 'react';
import Link from 'next/link';
import {
  FolderOpen,
  FileText,
  Gamepad2,
  BookOpen,
  School,
  CheckSquare,
  Download,
  Users,
  Eye,
  ArrowUpRight,
  Sparkles,
  Layers,
  Database,
  ShieldCheck,
  Plus
} from 'lucide-react';

const stats = [
  { label: 'สื่อการสอน (Resources)', count: '24', icon: FolderOpen, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/50', href: '/admin/resources' },
  { label: 'ใบงาน (Worksheets)', count: '48', icon: FileText, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/50', href: '/admin/worksheets' },
  { label: 'เกม & Unplugged', count: '12', icon: Gamepad2, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/50', href: '/admin/games' },
  { label: 'แผนการสอน (Plans)', count: '18', icon: BookOpen, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/50', href: '/admin/lesson-plans' },
  { label: 'ห้องเรียน (Classrooms)', count: '6', icon: School, color: 'text-sky-500', bg: 'bg-sky-50 dark:bg-sky-950/50', href: '/admin/classrooms' },
  { label: 'แบบทดสอบ (Quizzes)', count: '15', icon: CheckSquare, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-950/50', href: '/admin/quizzes' },
  { label: 'ยอดดาวน์โหลด (Downloads)', count: '1,420', icon: Download, color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-950/50', href: '/admin/downloads' },
  { label: 'ยอดผู้เข้าชม (Views)', count: '8,950', icon: Eye, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-950/50', href: '/admin/analytics' },
];

const moduleStatuses = [
  { key: 'resources', name: 'สื่อการสอน', status: 'เปิดใช้งาน', isEnabled: true },
  { key: 'worksheets', name: 'ใบงาน', status: 'เปิดใช้งาน', isEnabled: true },
  { key: 'games', name: 'เกมการเรียนรู้', status: 'เปิดใช้งาน', isEnabled: true },
  { key: 'lesson_plans', name: 'แผนการจัดการเรียนรู้', status: 'เปิดใช้งาน', isEnabled: true },
  { key: 'classroom', name: 'ห้องเรียนออนไลน์', status: 'เปิดใช้งาน', isEnabled: true },
  { key: 'quiz', name: 'แบบทดสอบ', status: 'เปิดใช้งาน', isEnabled: true },
  { key: 'ai_teacher', name: 'AI สำหรับครู', status: 'เปิดใช้งาน', isEnabled: true },
  { key: 'downloads', name: 'ศูนย์ดาวน์โหลด', status: 'เปิดใช้งาน', isEnabled: true },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-200 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>ระบบจัดการเนื้อหา (CMS) • Phase 1 Foundation</span>
          </div>
          <h1 className="text-2xl font-bold">สวัสดีครับ ครูคิง</h1>
          <p className="text-sm text-blue-100">
            ยินดีต้อนรับสู่ระบบจัดการเว็บไซต์ห้องสื่อครูคิง ตรวจสอบและบริหารจัดการทุกโมดูลได้จากที่นี่
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/modules"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs border border-white/20 transition-colors flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4" />
            <span>จัดการโมดูล</span>
          </Link>
          <Link
            href="/admin/works/new"
            className="px-4 py-2 rounded-xl bg-white hover:bg-blue-50 text-blue-700 text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มเนื้อหาใหม่</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-xl ${item.bg}`}>
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
              </div>
              <div className="mt-4">
                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                  {item.count}
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium truncate">
                  {item.label}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Two Column Section: System Status & Module Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Module Status List */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                สถานะโมดูลระบบ (Module Registry)
              </h2>
              <p className="text-xs text-slate-500">
                ควบคุมการแสดงผลบนหน้าบ้านและระบบเมนู
              </p>
            </div>
            <Link
              href="/admin/modules"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              จัดการทั้งหมด
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {moduleStatuses.map((mod) => (
              <div
                key={mod.key}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50"
              >
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {mod.name}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  {mod.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* System & Architecture Info */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            ความพร้อมของระบบ (Phase 1)
          </h2>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-1">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-blue-500" />
                  <span>Database & Schema</span>
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Ready</span>
              </div>
              <p className="text-slate-500 text-[11px]">38 Tables + RLS Policies</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-1">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Role & Auth Guard</span>
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Active</span>
              </div>
              <p className="text-slate-500 text-[11px]">Middleware Session Handler</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-1">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-purple-500" />
                  <span>Super Admin Profile</span>
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">ครูคิง</span>
              </div>
              <p className="text-slate-500 text-[11px]">Full System Access Granted</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
