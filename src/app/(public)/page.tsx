import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Sparkles, 
  FolderOpen, 
  FileText, 
  School, 
  ArrowRight, 
  Search, 
  Bot, 
  CheckCircle2, 
  BookOpen 
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
  const games = allWorks.filter((w) => w.type === 'game').slice(0, 3);

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
                  <span>แหล่งรวมสื่อการเรียนรู้ นวัตกรรม และประสบการณ์การสอนครูคิง</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
                  ห้องสื่อครูคิง
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 mt-2">
                    Education Platform & CMS
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
                  ศูนย์รวมสื่อการเรียนรู้วิทยาการคำนวณ ใบงาน เกม นวัตกรรม แผนการสอน 5E ห้องเรียนออนไลน์ แบบทดสอบประเมินผล และผู้ช่วย AI สำหรับครูยุคใหม่
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                  <Link
                    href="/resources"
                    className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer hover:scale-105"
                  >
                    <FolderOpen className="w-4 h-4" />
                    <span>คลังสื่อการสอน</span>
                  </Link>
                  <Link
                    href="/worksheets"
                    className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/25 transition-all flex items-center gap-2 cursor-pointer hover:scale-105"
                  >
                    <FileText className="w-4 h-4" />
                    <span>ใบงานดาวน์โหลดฟรี</span>
                  </Link>
                  <Link
                    href="/classroom"
                    className="px-6 py-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <School className="w-4 h-4 text-blue-600" />
                    <span>ห้องเรียนออนไลน์</span>
                  </Link>
                </div>

                {/* Live Highlights / Features List */}
                <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-slate-500 border-t border-slate-200/80">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>สื่อตามหลักสูตร ว 4.2</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-500" />
                    <span>ดาวน์โหลด Word & PDF ฟรี</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-500" />
                    <span>AI ช่วยออกแบบการสอน</span>
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
                      alt="ห้องสื่อครูคิง การจัดการเรียนรู้วิทยาการคำนวณ"
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
                        ห้องเรียนวิทยาการคำนวณและโค้ดดิ้งเชิงรุก
                      </h3>
                      <p className="text-[11px] text-slate-200 mt-0.5">
                        พัฒนาสมรรถนะการคิดแก้ปัญหาและการคิดเชิงคำนวณ
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
                  <div className="absolute -bottom-5 -left-5 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-100 shadow-xl flex items-center gap-3 hidden sm:flex">
                    <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">ผู้ช่วย AI อัจฉริยะ</span>
                      <span className="text-[10px] text-purple-600 font-bold">4 เครื่องมือครูไทย</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* 2. SEARCH BAR QUICK TRIGGER */}
      {enabledKeys.has('search') && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
          <Link
            href="/search"
            className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xl hover:border-blue-500 transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm sm:text-base font-bold text-slate-800">
                  ค้นหาสื่อการสอน, ใบงาน, แผน, หรือข้อสอบ...
                </span>
                <p className="text-xs text-slate-400">ค้นหาได้ทุกระดับชั้นและกลุ่มสาระการเรียนรู้</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-semibold text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <span>ค้นหา</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </section>
      )}

      {/* 3. CATEGORIES SECTION */}
      {enabledKeys.has('categories') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-2xl font-bold text-slate-900">
              หมวดหมู่สื่อการเรียนรู้
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              เลือกศึกษาและดาวน์โหลดสื่อตามระดับชั้นและหัวข้อการเรียนรู้
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.slice(0, 8).map((cat) => (
              <Link
                key={cat.id}
                href={`/resources?category=${cat.slug}`}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-500 shadow-xs hover:shadow-md transition-all group text-center space-y-2 cursor-pointer"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 4. FEATURED WORKS */}
      {enabledKeys.has('featured_works') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                ผลงานและสื่อนวัตกรรมเด่น
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                ผลงานคัดสรรยอดนิยมที่ได้รับความสนใจสูงสุด
              </p>
            </div>
            <Link
              href="/portfolio"
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>ดูทั้งหมด</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredWorks.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        </section>
      )}

      {/* 5. LATEST WORKSHEETS */}
      {enabledKeys.has('latest_worksheets') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                ใบงานและแบบฝึกหัดล่าสุด
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                ใบงานวิทยาการคำนวณและทักษะการคิด ดาวน์โหลดพร้อมเฉลย
              </p>
            </div>
            <Link
              href="/worksheets"
              className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>ดูใบงานทั้งหมด</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {worksheets.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        </section>
      )}

      {/* 6. LATEST GAMES */}
      {enabledKeys.has('latest_games') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                เกมการเรียนรู้และ Coding
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                เกมเสริมสร้างตรรกะและการคิดแก้ปัญหา ทั้ง Unplugged และ Digital
              </p>
            </div>
            <Link
              href="/games"
              className="text-xs font-bold text-purple-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>ดูเกมทั้งหมด</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {games.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        </section>
      )}

      {/* 7. AI FOR TEACHERS CTA BANNER */}
      {enabledKeys.has('ai_for_teachers') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs">
                <Bot className="w-3.5 h-3.5" />
                <span>AI for Education</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold">
                เครื่องมือ AI อัจฉริยะสำหรับคุณครู
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                ช่วยออกแบบแผนการสอน 5E, สร้างข้อสอบพร้อมเฉลย และคิดกิจกรรม Active Learning ได้ในไม่กี่วินาที
              </p>
            </div>

            <Link
              href="/ai"
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-blue-50 text-blue-700 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer hover:scale-105"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>เริ่มใช้งาน AI สำหรับครู</span>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
