'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Globe,
  Menu as MenuIcon,
  FileCode,
  Layers,
  FolderOpen,
  Trophy,
  School,
  CheckSquare,
  BarChart3,
  Download,
  Bot,
  Settings,
  ChevronDown,
  ChevronRight,
  PlusCircle,
  ExternalLink,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/toast';

interface NavGroup {
  label: string;
  items: {
    title: string;
    href: string;
    icon: React.ElementType;
    badge?: string;
  }[];
}

const adminNavGroups: NavGroup[] = [
  {
    label: 'การจัดการเนื้อหา & สื่อ',
    items: [
      { title: 'ภาพรวมระบบ (Overview)', href: '/admin', icon: LayoutDashboard },
      { title: 'จัดการเนื้อหาทั้งหมด (Works)', href: '/admin/works', icon: Trophy },
      { title: 'เพิ่มเนื้อหาใหม่ (Add Work)', href: '/admin/works/new', icon: PlusCircle, badge: 'ใหม่' },
      { title: 'หมวดหมู่สื่อ (Categories)', href: '/admin/categories', icon: FolderOpen },
    ],
  },
  {
    label: 'เว็บไซต์ & โครงสร้าง CMS',
    items: [
      { title: 'หน้าแรก (Homepage Builder)', href: '/admin/homepage', icon: Globe },
      { title: 'จัดการเมนู (Menu Builder)', href: '/admin/menus', icon: MenuIcon },
      { title: 'จัดการหน้าเพจ (Pages CMS)', href: '/admin/pages', icon: FileCode },
      { title: 'โมดูลระบบ (Modules)', href: '/admin/modules', icon: Layers },
    ],
  },
  {
    label: 'การเรียนรู้ & เครื่องมือ AI',
    items: [
      { title: 'ห้องเรียนออนไลน์ (Classroom)', href: '/classroom', icon: School },
      { title: 'ระบบแบบทดสอบ (Quiz)', href: '/quiz', icon: CheckSquare },
      { title: 'ศูนย์ดาวน์โหลด (Downloads)', href: '/downloads', icon: Download },
      { title: 'ผู้ช่วย AI สำหรับครู (AI Tools)', href: '/ai', icon: Bot, badge: 'AI' },
    ],
  },
  {
    label: 'สถิติ & การตั้งค่าระบบ',
    items: [
      { title: 'สถิติการใช้งาน (Analytics)', href: '/admin/analytics', icon: BarChart3 },
      { title: 'ตั้งค่าเว็บไซต์ (Settings)', href: '/admin/settings', icon: Settings },
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
  const router = useRouter();
  const toast = useToast();
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (label: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

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
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-950 text-slate-200 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm text-white block leading-tight">
                ห้องสื่อครูคิง
              </span>
              <span className="text-[10px] text-blue-400 font-semibold tracking-wider uppercase">
                Admin Control Panel
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {adminNavGroups.map((group) => {
            const isCollapsed = collapsedGroups[group.label];
            return (
              <div key={group.label} className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => toggleGroup(group.label)}
                  className="w-full flex items-center justify-between px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider hover:text-slate-200"
                >
                  <span>{group.label}</span>
                  {isCollapsed ? (
                    <ChevronRight className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>

                {!isCollapsed && (
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const isActive = pathname === item.href;
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={onClose}
                          className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                            isActive
                              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                              : 'text-slate-400 hover:text-white hover:bg-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <Icon className="w-4 h-4 shrink-0 opacity-80" />
                            <span className="truncate">{item.title}</span>
                          </div>
                          {item.badge && (
                            <span className="px-1.5 py-0.5 text-[9px] font-bold bg-blue-500/30 text-blue-300 rounded border border-blue-400/30">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer info, View site & Logout */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-800"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
            <span>ดูหน้าเว็บไซต์จริง (Public Site)</span>
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            className="w-full py-2 px-3 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-rose-900/60 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>ออกจากระบบ (Logout)</span>
          </button>

          <p className="text-[10px] text-center text-slate-500 pt-1">
            ระบบจัดการเนื้อหาเวอร์ชัน 1.0 (Production)
          </p>
        </div>
      </aside>
    </>
  );
}
