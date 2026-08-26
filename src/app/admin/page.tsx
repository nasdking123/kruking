import React from 'react';
import Link from 'next/link';
import {
  FolderOpen,
  FileText,
  School,
  CheckSquare,
  Eye,
  ArrowUpRight,
  Sparkles,
  Plus,
  Clock,
  Award,
  GraduationCap,
  ChevronRight
} from 'lucide-react';
import { getPlatformAnalytics } from '@/services/analytics';
import { createClient } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const analytics = await getPlatformAnalytics();
  const supabase = createClient();

  // 1. Live counts for pending queues
  const [
    { count: pendingSubmissionsCount },
    { count: pendingCertsCount },
    { count: totalStudentsCount },
    { data: recentSubmissions },
    { data: recentCerts }
  ] = await Promise.all([
    supabase
      .from('assignment_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending'),
    supabase
      .from('student_certificates')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending'),
    supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'student'),
    supabase
      .from('assignment_submissions')
      .select('id, student_name, submitted_at, notes, lessons(title)')
      .eq('status', 'pending')
      .order('submitted_at', { ascending: false })
      .limit(5),
    supabase
      .from('student_certificates')
      .select('id, student_name, title, issuer, created_at')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(5)
  ]);

  const stats = [
    { 
      label: 'การบ้านรอตรวจ (Pending)', 
      count: `${pendingSubmissionsCount || 0} ชิ้น`, 
      icon: CheckSquare, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900', 
      href: '/admin/submissions',
      badge: (pendingSubmissionsCount || 0) > 0 ? 'รอดำเนินการ' : undefined
    },
    { 
      label: 'เกียรติบัตรที่รอนุมัติ', 
      count: `${pendingCertsCount || 0} ฉบับ`, 
      icon: Award, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-900', 
      href: '/admin/certificates',
      badge: (pendingCertsCount || 0) > 0 ? 'รอตรวจ' : undefined
    },
    { 
      label: 'นักเรียนในระบบ (Students)', 
      count: `${totalStudentsCount || 0} คน`, 
      icon: GraduationCap, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50 dark:bg-blue-950/50', 
      href: '/admin/students' 
    },
    { 
      label: 'ห้องเรียน MOOC (Courses)', 
      count: `${analytics.totalClassrooms} ห้องเรียน`, 
      icon: School, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50 dark:bg-emerald-950/50', 
      href: '/admin/classroom' 
    },
    { 
      label: 'คลังสื่อ & แผนการสอน', 
      count: `${analytics.totalWorks} รายการ`, 
      icon: FolderOpen, 
      color: 'text-sky-600', 
      bg: 'bg-sky-50 dark:bg-sky-950/50', 
      href: '/admin/works' 
    },
    { 
      label: 'ยอดดาวน์โหลดทั้งหมด', 
      count: `${analytics.totalDownloads.toLocaleString()} ครั้ง`, 
      icon: FileText, 
      color: 'text-cyan-600', 
      bg: 'bg-cyan-50 dark:bg-cyan-950/50', 
      href: '/downloads' 
    },
    { 
      label: 'ยอดผู้เข้าชมระบบ (Views)', 
      count: `${analytics.totalViews.toLocaleString()} ครั้ง`, 
      icon: Eye, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50 dark:bg-indigo-950/50', 
      href: '/admin/analytics' 
    },
    { 
      label: 'ชุดข้อสอบ (Quizzes)', 
      count: `${analytics.totalQuizzes} ชุด`, 
      icon: CheckSquare, 
      color: 'text-rose-600', 
      bg: 'bg-rose-50 dark:bg-rose-950/50', 
      href: '/admin/quizzes' 
    },
  ];

  return (
    <div className="space-y-8 p-6 sm:p-10 max-w-7xl mx-auto animate-in fade-in">
      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-200 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>ระบบจัดการเนื้อหา & การเรียนรู้ออนไลน์ (LMS & CMS)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">แผงควบคุมหลัก • ครูจักรพงษ์</h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
            ตรวจการบ้านนักเรียน, อนุมัติเกียรติบัตร, บริหารห้องเรียนออนไลน์ และจัดการสื่อการสอนได้ครบจบในที่เดียว
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/submissions"
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-md shadow-amber-400/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <CheckSquare className="w-4 h-4" />
            <span>ตรวจการบ้าน ({pendingSubmissionsCount || 0})</span>
          </Link>
          <Link
            href="/admin/certificates"
            className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold backdrop-blur-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Award className="w-4 h-4" />
            <span>อนุมัติเกียรติบัตร ({pendingCertsCount || 0})</span>
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
              className={`p-5 rounded-3xl bg-white dark:bg-slate-900 border shadow-xs hover:shadow-md transition-all group ${
                item.badge ? 'border-amber-300 dark:border-amber-800 ring-2 ring-amber-400/20' : 'border-slate-200/80 dark:border-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-xl ${item.bg}`}>
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                {item.badge ? (
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-extrabold text-[10px]">
                    {item.badge}
                  </span>
                ) : (
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                )}
              </div>
              <div className="mt-4">
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">
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

      {/* Actionable Queues: Pending Homework & Certificates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Queue 1: Pending Submissions */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  การบ้านที่รอการตรวจ ({pendingSubmissionsCount || 0})
                </h2>
                <p className="text-[11px] text-slate-400">
                  นักเรียนที่ส่งผลงานล่าสุดและรอให้คะแนน
                </p>
              </div>
            </div>
            <Link
              href="/admin/submissions"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>ดูทั้งหมด</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {(!recentSubmissions || recentSubmissions.length === 0) ? (
              <div className="py-8 text-center text-xs text-slate-400">
                🎉 ไม่มีงานการบ้านค้างตรวจในขณะนี้
              </div>
            ) : (
              recentSubmissions.map((sub: Record<string, unknown>) => (
                <Link
                  key={sub.id as string}
                  href="/admin/submissions"
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between hover:border-amber-400 transition-colors group"
                >
                  <div className="min-w-0 space-y-0.5">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {sub.student_name as string}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {(sub.lessons as { title?: string })?.title || 'บทเรียนออนไลน์'}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-amber-600 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                    ตรวจงาน →
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Queue 2: Pending Certificates */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  เกียรติบัตรที่รอนุมัติ ({pendingCertsCount || 0})
                </h2>
                <p className="text-[11px] text-slate-400">
                  เกียรติบัตรที่นักเรียนยื่นขอการรับรอง
                </p>
              </div>
            </div>
            <Link
              href="/admin/certificates"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>ดูทั้งหมด</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {(!recentCerts || recentCerts.length === 0) ? (
              <div className="py-8 text-center text-xs text-slate-400">
                🎉 ไม่มีเกียรติบัตรค้างอนุมัติในขณะนี้
              </div>
            ) : (
              recentCerts.map((cert) => (
                <Link
                  key={cert.id}
                  href="/admin/certificates"
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between hover:border-purple-400 transition-colors group"
                >
                  <div className="min-w-0 space-y-0.5">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {cert.student_name}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {cert.title}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-purple-600 px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    อนุมัติ →
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Shortcuts Bar */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 space-y-3">
        <h3 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          ทางลัดการจัดการด่วน (Quick Management Tools)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold">
          <Link
            href="/admin/submissions"
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:border-amber-400 shadow-xs flex items-center justify-between text-slate-800 dark:text-slate-200 transition-colors"
          >
            <span>📝 ตรวจการบ้าน</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
          <Link
            href="/admin/certificates"
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:border-purple-400 shadow-xs flex items-center justify-between text-slate-800 dark:text-slate-200 transition-colors"
          >
            <span>🎖️ อนุมัติเกียรติบัตร</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
          <Link
            href="/admin/competitions"
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:border-blue-400 shadow-xs flex items-center justify-between text-slate-800 dark:text-slate-200 transition-colors"
          >
            <span>⚔️ จัดการการแข่งขัน</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
          <Link
            href="/admin/works/new"
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:border-emerald-400 shadow-xs flex items-center justify-between text-slate-800 dark:text-slate-200 transition-colors"
          >
            <span>+ เพิ่มสื่อ/แผนการสอน</span>
            <Plus className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>
      </div>
    </div>
  );
}
