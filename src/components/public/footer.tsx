import React from 'react';
import Link from 'next/link';
import { BookOpen, Heart, Mail, Phone, ExternalLink } from 'lucide-react';

export function PublicFooter() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-base">
                ห้องสื่อครูคิง
              </span>
            </div>
            <p className="text-xs leading-relaxed">
              แหล่งรวมสื่อการเรียนรู้ นวัตกรรมการจัดการเรียนรู้ Active Learning แผนการสอน และคลังข้อสอบวิทยาการคำนวณ
            </p>
            <div className="pt-2 text-xs space-y-1">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-500" />
                <span>kruking.teaching@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-500" />
                <span>081-234-5678</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">สื่อการเรียนรู้</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/resources" className="hover:text-blue-600 transition-colors">สื่อการสอนทั้งหมด</Link></li>
              <li><Link href="/worksheets" className="hover:text-blue-600 transition-colors">ใบงานและแบบฝึกหัด</Link></li>
              <li><Link href="/games" className="hover:text-blue-600 transition-colors">เกมการเรียนรู้ / Unplugged</Link></li>
              <li><Link href="/lesson-plans" className="hover:text-blue-600 transition-colors">แผนการจัดการเรียนรู้</Link></li>
              <li><Link href="/downloads" className="hover:text-blue-600 transition-colors">ศูนย์ดาวน์โหลดไฟล์</Link></li>
            </ul>
          </div>

          {/* Platform Modules */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">ระบบการเรียนรู้ & AI</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/classroom" className="hover:text-blue-600 transition-colors">ห้องเรียนออนไลน์</Link></li>
              <li><Link href="/quizzes" className="hover:text-blue-600 transition-colors">คลังแบบทดสอบ</Link></li>
              <li><Link href="/ai" className="hover:text-blue-600 transition-colors">AI สำหรับครู (AI Tools)</Link></li>
              <li><Link href="/research" className="hover:text-blue-600 transition-colors">งานวิจัยในชั้นเรียน</Link></li>
              <li><Link href="/innovation" className="hover:text-blue-600 transition-colors">นวัตกรรมการสอน</Link></li>
            </ul>
          </div>

          {/* Info & Admin */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">ผู้ดูแลระบบ & เกี่ยวกับเรา</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/about" className="hover:text-blue-600 transition-colors">เกี่ยวกับครูคิง (Portfolio)</Link></li>
              <li><Link href="/awards" className="hover:text-blue-600 transition-colors">รางวัลและความภาคภูมิใจ</Link></li>
              <li><Link href="/contact" className="hover:text-blue-600 transition-colors">ติดต่อสอบถาม</Link></li>
              <li className="pt-2">
                <Link href="/admin" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
                  <span>เข้าสู่ระบบหลังบ้าน (Admin CMS)</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 ห้องสื่อครูคิง. ออกแบบและพัฒนาเพื่อส่งเสริมการศึกษาไทย</p>
          <div className="flex items-center gap-1 text-slate-500">
            <span>สร้างด้วย</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">ครูจักรพงษ์ สำรองพันธ์ โรงเรียนวัดบางโฉลงใน</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
