import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Sparkles, 
  BookOpen, 
  FileText, 
  Gamepad2, 
  ArrowRight, 
  Bot, 
  CheckCircle2, 
  UserCheck, 
  Trophy, 
  Mail, 
  Award, 
  GraduationCap, 
  Search, 
  Compass, 
  Layers, 
  Download,
  Flame,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { getWorks } from '@/services/works';
import { getHomepageSections } from '@/services/homepage';
import { getSettings } from '@/services/settings';
import { HomepageExplorer } from '@/components/public/homepage-explorer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const settings = await getSettings();
  const sections = await getHomepageSections();
  const enabledKeys = new Set(sections.filter((s) => s.is_enabled).map((s) => s.section_key));

  const allWorks = await getWorks();

  return (
    <div className="space-y-20 pb-24">
      {/* 1. HERO SECTION: ULTRA-MODERN GLASSMORPHISM & AMBIENT AURA */}
      {enabledKeys.has('hero') && (
        <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24 bg-gradient-to-b from-blue-50/80 via-indigo-50/20 to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 border-b border-slate-200/60 dark:border-slate-800/60">
          {/* Subtle Ambient Glowing Orbs */}
          <div className="absolute top-0 left-1/3 -translate-x-1/2 w-[550px] h-[550px] bg-blue-500/15 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-20 right-10 w-[450px] h-[450px] bg-indigo-500/15 dark:bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute inset-0 bg-dot-pattern opacity-60 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
              
              {/* Left Column: Headline, Search & Fast Actions (7 Cols) */}
              <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
                {/* Modern Pill Badge with Live Pulse */}
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white dark:bg-slate-900/90 border border-blue-200/80 dark:border-blue-800/80 shadow-sm shadow-blue-500/10 backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    ศูนย์รวมสื่อนวัตกรรม & ห้องเรียนดิจิทัล Active Learning
                  </span>
                </div>

                {/* Main Hero Headline */}
                <div className="space-y-3">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]">
                    {settings.site_name || 'ห้องสื่อครูคิง'}
                    <span className="block text-shimmer mt-2">
                      Modern Education Platform
                    </span>
                  </h1>
                  <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
                    {settings.tagline || 'แหล่งรวมสื่อการสอน แผนการจัดการเรียนรู้ 5E ใบงาน นวัตกรรมการสอน และเครื่องมือ AI เพื่อยกระดับห้องเรียน Active Learning'}
                  </p>
                </div>

                {/* Fast Search Input Bar */}
                <form action="/search" method="GET" className="max-w-xl mx-auto lg:mx-0">
                  <div className="relative flex items-center rounded-2xl bg-white dark:bg-slate-900/90 border-2 border-slate-200/90 dark:border-slate-800 shadow-lg shadow-blue-500/5 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/20 transition-all p-1.5">
                    <Search className="w-5 h-5 text-slate-400 ml-3.5 shrink-0" />
                    <input
                      type="text"
                      name="q"
                      placeholder="ค้นหาสื่อการสอน, แผน 5E, ใบงาน, เกม, หรือระดับชั้น..."
                      className="w-full px-3 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 bg-transparent focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/30 transition-all shrink-0 cursor-pointer"
                    >
                      ค้นหาทันที
                    </button>
                  </div>
                </form>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
                  <Link
                    href="/lesson-plans"
                    className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.03] active:scale-[0.98]"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>แผนการสอน 5E พร้อมใช้</span>
                  </Link>
                  <Link
                    href="/worksheets"
                    className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.03] active:scale-[0.98]"
                  >
                    <Download className="w-4 h-4" />
                    <span>คลังใบงานดาวน์โหลดฟรี</span>
                  </Link>
                  <Link
                    href="/classroom"
                    className="px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>ห้องเรียนออนไลน์</span>
                  </Link>
                </div>

                {/* Trust Badges / Quick Highlights */}
                <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-bold text-slate-500 dark:text-slate-400 border-t border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>ประวัติศาสตร์ & ต้านทุจริต</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>วิทยาการคำนวณ & Coding</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
                    <span>เกณฑ์รูบริกส์ประเมินครบชุด</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Visual Card with Floating Glassmorphic Badges (5 Cols) */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  
                  {/* Outer Ambient Glow Container */}
                  <div className="relative rounded-3xl p-2 bg-gradient-to-tr from-blue-500/20 via-indigo-500/20 to-purple-500/20 border border-white/60 dark:border-slate-700/60 shadow-2xl backdrop-blur-md">
                    
                    <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-950 group">
                      <Image
                        src={settings.banner_cover_url || "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop"}
                        alt="หน้าปกห้องสื่อครูคิง"
                        fill
                        priority
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                      
                      {/* Tag on Visual */}
                      <div className="absolute bottom-5 left-5 right-5 text-white space-y-1.5">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600/90 backdrop-blur-md text-[11px] font-black uppercase tracking-wider">
                          <Flame className="w-3.5 h-3.5 text-amber-300" />
                          <span>Active Learning 5E Showcase</span>
                        </div>
                        <h3 className="text-base font-extrabold leading-snug">
                          ห้องเรียนคุณภาพ สื่อทันสมัย เพื่อครูและนักเรียน
                        </h3>
                        <p className="text-[11px] text-slate-300">
                          {settings.school_name || 'โรงเรียนวัดบางโฉลงใน'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Floating Glass Badge 1: Top Right */}
                  <div className="absolute -top-5 -right-5 p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl flex items-center gap-3.5 hidden sm:flex animate-pulse duration-1000">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/30">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-slate-900 dark:text-white block">แผน 5E & รูบริกส์</span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        ตรงตัวชี้วัดหลักสูตร
                      </span>
                    </div>
                  </div>

                  {/* Floating Glass Badge 2: Bottom Left */}
                  <div className="absolute -bottom-5 -left-5 p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl flex items-center gap-3.5 hidden sm:flex">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-md shadow-purple-500/30">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-slate-900 dark:text-white block">AI Assistant สำหรับครู</span>
                      <span className="text-[10px] text-purple-600 dark:text-purple-400 font-extrabold">ช่วยเตรียมสอน & ข้อสอบ</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* 2. LEARNING TRACKS BENTO GRID: 4 CORE PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-2">
                <Compass className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Modern Learning Hub</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                เสาหลักนวัตกรรมการเรียนรู้และพัฒนาผู้เรียน
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              เข้าถึงเนื้อหาและเครื่องมือตามหมวดหมู่การใช้งาน
            </span>
          </div>

          {/* 4-Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Bento Card 1: Lesson Plans 5E */}
            <Link
              href="/lesson-plans"
              className="bento-card p-6 rounded-3xl bg-gradient-to-br from-blue-500/10 via-white to-blue-50/30 dark:from-blue-950/40 dark:via-slate-900 dark:to-slate-900 border border-blue-200/70 dark:border-blue-900/50 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    แผนการสอน 5E & ว.PA
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                    แผนการจัดการเรียนรู้ตามตัวชี้วัด ประวัติศาสตร์ ต้านทุจริต และวิทยาการคำนวณ พร้อมเกณฑ์ประเมิน
                  </p>
                </div>
              </div>
              <div className="pt-5 flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400">
                <span>เปิดดูแผนการสอน</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Bento Card 2: Interactive Online Classroom */}
            <Link
              href="/classroom"
              className="bento-card p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-white to-emerald-50/30 dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900 border border-emerald-200/70 dark:border-emerald-900/50 shadow-sm hover:shadow-xl hover:border-emerald-400 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    ห้องเรียนออนไลน์
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                    ระบบบทเรียนออนไลน์สำหรับนักเรียน บันทึกการเรียนรู้ ทำแบบทดสอบ และระบบจัดอันดับคะแนน
                  </p>
                </div>
              </div>
              <div className="pt-5 flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <span>เข้าสู่ห้องเรียน</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Bento Card 3: AI Assistant for Teachers */}
            <Link
              href="/ai"
              className="bento-card p-6 rounded-3xl bg-gradient-to-br from-purple-500/10 via-white to-purple-50/30 dark:from-purple-950/40 dark:via-slate-900 dark:to-slate-900 border border-purple-200/70 dark:border-purple-900/50 shadow-sm hover:shadow-xl hover:border-purple-400 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    AI ผู้ช่วยครูอัจฉริยะ
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                    เครื่องมือ AI ช่วยสร้างไอเดียการจัดการเรียนรู้ ออกแบบข้อสอบ รูบริกส์ และสื่อการสอนประหยัดเวลา
                  </p>
                </div>
              </div>
              <div className="pt-5 flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400">
                <span>ทดลองใช้งาน AI</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Bento Card 4: Learning Games & Unplugged */}
            <Link
              href="/games"
              className="bento-card p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-white to-amber-50/30 dark:from-amber-950/40 dark:via-slate-900 dark:to-slate-900 border border-amber-200/70 dark:border-amber-900/50 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    เกมการเรียนรู้ Active
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                    สื่อเกม Unplugged, Scratch, และสื่อจำลองการคิดเชิงคำนวณที่กระตุ้นการมีส่วนร่วมในห้องเรียน
                  </p>
                </div>
              </div>
              <div className="pt-5 flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                <span>เล่นเกมและดาวน์โหลด</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE ALL-IN-ONE RESOURCE EXPLORER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HomepageExplorer works={allWorks} />
      </section>

      {/* 4. MASTER TEACHER PROFILE & ACADEMIC CREDENTIALS BENTO (แนะนำครูคิง) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 text-white shadow-2xl relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            {/* Teacher Photo (4 Cols) */}
            <div className="md:col-span-4 flex flex-col items-center text-center space-y-3">
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl group">
                <Image
                  src={settings.teacher_avatar_url || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop"}
                  alt={settings.teacher_name || "ครูคิง"}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-xl bg-emerald-500 text-white text-[10px] font-black shadow-md flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>ครูผู้สอน</span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black text-white">
                  {settings.teacher_name || "ครูคิง (Kru King)"}
                </h3>
                <span className="text-xs text-blue-300 font-semibold block mt-0.5">
                  {settings.school_name || 'โรงเรียนวัดบางโฉลงใน'}
                </span>
              </div>
            </div>

            {/* Details & Experience (8 Cols) */}
            <div className="md:col-span-8 space-y-5 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-bold backdrop-blur-md">
                <GraduationCap className="w-4 h-4 text-amber-400" />
                <span>คุณครูผู้สร้างสรรค์สื่อนวัตกรรม & Active Learning</span>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-snug">
                  {settings.teacher_title || "ครูผู้สอนกลุ่มสาระวิทยาศาสตร์และเทคโนโลยี • สังคมศึกษา"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl font-normal">
                  {settings.teacher_bio || 'มุ่งมั่นพัฒนาการจัดการเรียนรู้แบบ Active Learning ด้วยกระบวนการคิดเชิงคำนวณ นวัตกรรม และสื่อการสอนที่ทันสมัย เพื่อส่งเสริมศักยภาพของผู้เรียนรอบด้าน'}
                </p>
              </div>

              {/* Achievement Badges */}
              <div className="flex flex-wrap gap-2.5 pt-1">
                <div className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/10 text-xs font-bold text-amber-300 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>ประสบการณ์การสอน 8+ ปี</span>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/10 text-xs font-bold text-emerald-300 flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>ประวัติศาสตร์ ป.6 & ป.3</span>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/10 text-xs font-bold text-blue-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span>ต้านทุจริตศึกษา ป.6</span>
                </div>
              </div>

              {/* Quick Profile Links */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/about"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>ดูประวัติ & ผลงานครูคิง</span>
                </Link>
                <Link
                  href="/certificates"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Trophy className="w-4 h-4" />
                  <span>เกียรติบัตร & รางวัล</span>
                </Link>
                <Link
                  href="/contact"
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-blue-300" />
                  <span>ติดต่องาน / สอบถาม</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. OUTSTANDING STUDENTS SHOWCASE (บอร์ดเกียรติยศนักเรียน) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-tr from-amber-500/10 via-slate-50 to-blue-50/20 dark:from-amber-950/20 dark:via-slate-900 dark:to-blue-950/20 border border-amber-200/60 dark:border-amber-900/40 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black mb-2 shadow-xs">
                <Trophy className="w-3.5 h-3.5" />
                <span>เกียรติยศนักเรียน (Student Hall of Fame)</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                🏆 ผู้เรียนดีเด่นและนักเรียนยอดเยี่ยม
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                นักเรียนที่มีผลการเรียนรู้ ส่งผลงานสม่ำเสมอ และมีคะแนนสะสมสูงสุดประจำภาคเรียน
              </p>
            </div>

            <Link
              href="/student/ranking"
              className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
            >
              <span>ดูกระดานจัดอันดับเต็ม (Leaderboard)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { rank: 1, name: 'ด.ช. ธนกฤต มั่งคั่ง', grade: 'ประถมศึกษาปีที่ 6', school: 'โรงเรียนวัดบางโฉลงใน', badge: '⭐ ผู้เรียนดีเด่น', seed: 'King1' },
              { rank: 2, name: 'ด.ญ. กานต์พิชชา รัตนคุณ', grade: 'ประถมศึกษาปีที่ 6', school: 'โรงเรียนวัดบางโฉลงใน', badge: '🎯 คะแนนสอบสูงสุด', seed: 'Student2' },
              { rank: 3, name: 'ด.ช. ภัทรพล เจริญสุข', grade: 'ประถมศึกษาปีที่ 6', school: 'โรงเรียนวัดบางโฉลงใน', badge: '🏆 นักพัฒนา Scratch', seed: 'Student3' },
            ].map((s) => (
              <div
                key={s.rank}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex items-center gap-4 hover:border-amber-400 transition-all"
              >
                <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 shrink-0">
                  <Image
                    src={`https://api.dicebear.com/7.x/bottts/svg?seed=${s.seed}`}
                    alt={s.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded font-extrabold text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                      อันดับ #{s.rank}
                    </span>
                    <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 truncate">
                      {s.badge}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                    {s.name}
                  </h3>

                  <p className="text-[10px] text-slate-400 truncate">
                    {s.grade} • {s.school}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
