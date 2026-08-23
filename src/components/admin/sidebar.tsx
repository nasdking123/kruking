'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Globe,
  Menu as MenuIcon,
  FileCode,
  Layers,
  FolderOpen,
  FileText,
  Gamepad2,
  BookOpen,
  GraduationCap,
  Sparkles,
  Trophy,
  Camera,
  Newspaper,
  Presentation,
  School,
  CheckSquare,
  BarChart3,
  Download,
  Image as ImageIcon,
  Bot,
  Sliders,
  Activity,
  Tags,
  Users,
  Settings,
  ChevronDown,
  ChevronRight,
  LogOut,
  ExternalLink
} from 'lucide-react';

interface NavGroup {
  label: string;
  items: {
    title: string;
    href: string;
    icon: React.ElementType;
  }[];
}

const adminNavGroups: NavGroup[] = [
  {
    label: 'เว็บไซต์ & โครงสร้าง',
    items: [
      { title: 'หน้าแรก (Homepage)', href: '/admin/homepage', icon: Globe },
      { title: 'จัดการเมนู (Menus)', href: '/admin/menus', icon: MenuIcon },
      { title: 'จัดการหน้า (Pages)', href: '/admin/pages', icon: FileCode },
      { title: 'โมดูลระบบ (Modules)', href: '/admin/modules', icon: Layers },
    ],
  },
  {
    label: 'คลังเนื้อหา & สื่อ',
    items: [
      { title: 'ผลงานครู (Works)', href: '/admin/works', icon: Trophy },
      { title: 'สื่อการสอน (Resources)', href: '/admin/resources', icon: FolderOpen },
      { title: 'ใบงาน (Worksheets)', href: '/admin/worksheets', icon: FileText },
      { title: 'เกม (Games)', href: '/admin/games', icon: Gamepad2 },
      { title: 'แผนการสอน (Lesson Plans)', href: '/admin/lesson-plans', icon: BookOpen },
      { title: 'การจัดการเรียนรู้ (Showcase)', href: '/admin/teaching', icon: Presentation },
      { title: 'งานวิจัย (Research)', href: '/admin/research', icon: GraduationCap },
      { title: 'นวัตกรรม (Innovation)', href: '/admin/innovations', icon: Sparkles },
      { title: 'รางวัล (Awards)', href: '/admin/awards', icon: Trophy },
      { title: 'กิจกรรม (Activities)', href: '/admin/activities', icon: Camera },
      { title: 'บทความ (Articles)', href: '/admin/articles', icon: Newspaper },
    ],
  },
  {
    label: 'การเรียนรู้ & ห้องเรียน',
    items: [
      { title: 'ห้องเรียนออนไลน์ (Classroom)', href: '/admin/classrooms', icon: School },
      { title: 'แบบทดสอบ (Quizzes)', href: '/admin/quizzes', icon: CheckSquare },
      { title: 'ผลคะแนน (Scores)', href: '/admin/scores', icon: BarChart3 },
    ],
  },
  {
    label: 'ดาวน์โหลด & มีเดีย',
    items: [
      { title: 'ศูนย์ดาวน์โหลด', href: '/admin/downloads', icon: Download },
      { title: 'Media Library', href: '/admin/media', icon: ImageIcon },
    ],
  },
  {
    label: 'AI สำหรับครู',
    items: [
      { title: 'AI Tools', href: '/admin/ai/tools', icon: Bot },
      { title: 'AI Settings', href: '/admin/ai/settings', icon: Sliders },
      { title: 'AI Usage Logs', href: '/admin/ai/logs', icon: Activity },
    ],
  },
  {
    label: 'ระบบ & ความปลอดภัย',
    items: [
      { title: 'หมวดหมู่ (Categories)', href: '/admin/categories', icon: FolderOpen },
      { title: 'แท็ก (Tags)', href: '/admin/tags', icon: Tags },
      { title: 'ผู้ใช้งาน (Users)', href: '/admin/users', icon: Users },
      { title: 'สถิติการใช้งาน (Analytics)', href: '/admin/analytics', icon: BarChart3 },
      { title: 'ตั้งค่าระบบ (Settings)', href: '/admin/settings', icon: Settings },
    ],
  },
];

export function AdminSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (label: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
              <LayoutDashboard className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-white">ห้องสื่อครูคิง</span>
              <span className="text-[10px] text-blue-400 font-medium tracking-wider uppercase">
                Admin Panel (CMS)
              </span>
            </div>
          </Link>
          <Link
            href="/"
            target="_blank"
            title="ดูเว็บไซต์หน้าบ้าน"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 scrollbar-thin">
          {/* Main Dashboard Link */}
          <div>
            <Link
              href="/admin"
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                pathname === '/admin'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>ภาพรวมระบบ (Dashboard)</span>
            </Link>
          </div>

          {adminNavGroups.map((group) => {
            const isCollapsed = collapsedGroups[group.label];
            return (
              <div key={group.label} className="space-y-1">
                <button
                  type="button"
                  onClick={() => toggleGroup(group.label)}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider hover:text-slate-200 transition-colors"
                >
                  <span>{group.label}</span>
                  {isCollapsed ? (
                    <ChevronRight className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>

                {!isCollapsed && (
                  <div className="space-y-0.5 pt-1">
                    {group.items.map((item) => {
                      const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={onClose}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                            isActive
                              ? 'bg-blue-600/90 text-white font-semibold'
                              : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                          }`}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          <span className="truncate">{item.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer User Info */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-xs">
              KK
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">ครูคิง (Super Admin)</p>
              <p className="text-[10px] text-slate-400 truncate">kruking@school.ac.th</p>
            </div>
          </div>
          <Link
            href="/"
            title="ออกจากระบบ"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </aside>
    </>
  );
}
