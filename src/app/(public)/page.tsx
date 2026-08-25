import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Sparkles, 
  FolderOpen, 
  FileText, 
  ArrowRight, 
  Bot, 
  CheckCircle2, 
  BookOpen,
  Plus
} from 'lucide-react';
import { getWorks, getCategories } from '@/services/works';
import { getHomepageSections } from '@/services/homepage';
import { WorkCard } from '@/components/public/work-card';

export default async function HomePage() {
  const sections = await getHomepageSections();
  const enabledKeys = new Set(sections.filter((s) => s.is_enabled).map((s) => s.section_key));

  const allWorks = await getWorks();
  const categories = await getCategories();

  const featuredWorks = allWorks.filter((w) => w.featured).slice(0, 4);
  const worksheets = allWorks.filter((w) => w.type === 'worksheet').slice(0, 4);
  const lessonPlans = allWorks.filter((w) => w.type === 'lesson_plan').slice(0, 4);

  return (
    <div className="space-y-16 pb-20">
      {/* 1. HERO SECTION WITH RICH COVER VISUALS */}
      {enabledKeys.has('hero') && (
        <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-gradient-to-b from-blue-50/60 via-slate-50/40 to-white">
          {/* Ambient Glows */}
          <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-20 right-10 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Left Column: Headline & Action Buttons (7 Cols) */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-700 text-xs font-semibold shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>ประวัติศาสตร์ ป.6 & ป.3 • ต้านทุจริตศึกษา • วิทยาการคำนวณ</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
                  ห้องสื่อครูคิง
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 mt-2">
                    Education Platform & CMS
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
                  ศูนย์รวมแผนการจัดการเรียนรู้ Active Learning 5E สื่อการสอนคุณภาพสูง และใบงาน วิชาประวัติศาสตร์ (ป.6, ป.3), หลักสูตรต้านทุจริตศึกษา (ป.6) และวิทยาการคำนวณ พร้อมแบบทดสอบวัดผลสัมฤทธิ์และระบบ AI สำหรับครู
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                  <Link
                    href="/lesson-plans"
                    className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer hover:scale-105"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>แผนการสอน 5E</span>
                  </Link>
                  <Link
                    href="/worksheets"
                    className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/25 transition-all flex items-center gap-2 cursor-pointer hover:scale-105"
                  >
                    <FileText className="w-4 h-4" />
                    <span>ใบงานดาวน์โหลดฟรี</span>
                  </Link>
                  <Link
                    href="/resources"
                    className="px-6 py-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <FolderOpen className="w-4 h-4 text-blue-600" />
                    <span>สื่อการสอนทั้งหมด</span>
                  </Link>
                </div>

                {/* Live Highlights / Features List */}
                <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-slate-500 border-t border-slate-200/80">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>ประวัติศาสตร์ ป.6 & ป.3</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-500" />
                    <span>ต้านทุจริตศึกษา ป.6</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-500" />
                    <span>แผน 5E & รูบริกส์พร้อมใช้</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Cover Image with Floating Glass Cards (5 Cols) */}
              <div className="lg:col-span-5 relative">
                {/* Main Hero Card Container */}
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  {/* Backdrop Frame */}
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 aspect-[4/3] group">
                    <Image
                      src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop"
                      alt="ห้องสื่อครูคิง การจัดการเรียนรู้วิทยาการคำนวณและประวัติศาสตร์"
                      fill
                      priority
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                    
                    {/* Bottom Tag on Cover */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-600/90 text-[11px] font-bold tracking-wide backdrop-blur-xs">
                        Active Learning Showcase
                      </span>
                      <h3 className="text-sm sm:text-base font-bold mt-1.5 leading-snug">
                        ห้องเรียน Active Learning 5E ครูคิง
                      </h3>
                      <p className="text-[11px] text-slate-200 mt-0.5">
                        ประวัติศาสตร์ • ต้านทุจริตศึกษา • วิทยาการคำนวณ
                      </p>
                    </div>
                  </div>

                  {/* Floating Badge 1: Top Right */}
                  <div className="absolute -top-4 -right-4 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-100 shadow-xl flex items-center gap-3 animate-bounce duration-1000 hidden sm:flex">
                    <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">แผนการสอน 5E</span>
                      <span className="text-[10px] text-emerald-600 font-bold">พร้อมเกณฑ์รูบริกส์</span>
                    </div>
                  </div>

                  {/* Floating Badge 2: Bottom Left */}
                  <div className="absolute -bottom-4 -left-4 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-100 shadow-xl flex items-center gap-3 hidden sm:flex">
                    <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">ผู้ช่วย AI อัจฉริยะ</span>
                      <span className="text-[10px] text-purple-600 font-bold">สร้างแผน & ข้อสอบไว</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. CATEGORIES HORIZONTAL SCROLL / GRID */}
      {enabledKeys.has('categories') && categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                หมวดหมู่สื่อและกลุ่มสาระ
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                เลือกดูสื่อตามระดับชั้นและกลุ่มสาระการเรียนรู้
              </p>
            </div>
            <Link
              href="/resources"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>ดูทั้งหมด</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/resources?category=${cat.slug}`}
                className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5 transition-all text-center group flex flex-col items-center justify-center gap-2"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors flex items-center justify-center shadow-xs">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 3. FEATURED WORKS HIGHLIGHT */}
      {enabledKeys.has('featured') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[11px] font-bold mb-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>ผลงานคัดสรรพิเศษ</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                ผลงานและสื่อนวัตกรรมเด่น
              </h2>
            </div>
            <Link
              href="/resources"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>ดูคลังสื่อทั้งหมด</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {featuredWorks.length === 0 ? (
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 text-center space-y-2">
              <Sparkles className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-500 font-semibold">ยังไม่มีผลงานเด่นที่ปักหมุดไว้</p>
              <Link
                href="/admin/works/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>+ เพิ่มผลงานเด่นชิ้นแรก</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredWorks.map((work) => (
                <WorkCard key={work.id} work={work} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* 4. LESSON PLANS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              แผนการจัดการเรียนรู้ 5E ล่าสุด
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              แผนการสอนตามตัวชี้วัด ประวัติศาสตร์ ต้านทุจริต และวิทยาการคำนวณ
            </p>
          </div>
          <Link
            href="/lesson-plans"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>ดูแผนทั้งหมด ({allWorks.filter((w) => w.type === 'lesson_plan').length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {lessonPlans.length === 0 ? (
          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 text-center space-y-2">
            <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs text-slate-500 font-semibold">ยังไม่มีแผนการสอนในระบบ</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {lessonPlans.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        )}
      </section>

      {/* 5. WORKSHEETS SECTION */}
      {enabledKeys.has('worksheets') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                ใบงานและแบบฝึกหัดดาวน์โหลดฟรี
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                เอกสารประกอบการจัดกิจกรรมพร้อมเฉลยและเกณฑ์ประเมิน
              </p>
            </div>
            <Link
              href="/worksheets"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>ดูใบงานทั้งหมด ({allWorks.filter((w) => w.type === 'worksheet').length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {worksheets.length === 0 ? (
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 text-center space-y-2">
              <FileText className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-500 font-semibold">ยังไม่มีใบงานในระบบ</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {worksheets.map((work) => (
                <WorkCard key={work.id} work={work} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
