'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  User, 
  FolderHeart, 
  History, 
  Award, 
  Coins, 
  Trophy, 
  Swords 
} from 'lucide-react';

export function StudentNavBar() {
  const pathname = usePathname();

  const links = [
    { href: '/student/dashboard', label: 'แดชบอร์ด', icon: LayoutDashboard },
    { href: '/student/profile', label: 'โปรไฟล์', icon: User },
    { href: '/student/portfolio', label: 'ผลงาน (Portfolio)', icon: FolderHeart },
    { href: '/student/history', label: 'ประวัติการเรียน', icon: History },
    { href: '/student/certificates', label: 'เกียรติบัตร', icon: Award },
    { href: '/student/points', label: 'คะแนนสะสม', icon: Coins },
    { href: '/student/ranking', label: 'การจัดอันดับ', icon: Trophy },
    { href: '/competitions', label: 'การแข่งขัน', icon: Swords },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800/80 sticky top-16 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 scrollbar-none">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== '/student/dashboard' && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-[1.02]'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
