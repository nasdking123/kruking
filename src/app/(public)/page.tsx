import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  FolderOpen, 
  FileText, 
  School, 
  ArrowRight,
  Search,
  Bot
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
      {/* 1. HERO SECTION */}
      {enabledKeys.has('hero') && (
        <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-blue-50/70 via-transparent to-transparent dark:from-blue-950/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>แหล่งรวมสื่อการเรียนรู้ นวัตกรรม และประสบการณ์การสอนครูคิง</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                ห้องสื่อครูคิง
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:to-indigo-400 mt-2">
                  Education Platform & CMS
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
                ศูนย์รวมสื่อการเรียนรู้ ใบงาน เกม นวัตกรรม แผนการสอน ห้องเรียนออนไลน์ แบบทดสอบ และเครื่องมือ AI สำหรับครูยุคใหม่
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                <Link
                  href="/resources"
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/25 transition-all flex items-center gap-2"
                >
                  <FolderOpen className="w-4 h-4" />
                  <span>คลังสื่อการสอน</span>
                </Link>
                <Link
                  href="/worksheets"
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-emerald-500/25 transition-all flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>ใบงานดาวน์โหลดฟรี</span>
                </Link>
                <Link
                  href="/classroom"
                  className="px-6 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm transition-all flex items-center gap-2"
                >
                  <School className="w-4 h-4 text-blue-600" />
                  <span>ห้องเรียนออนไลน์</span>
                </Link>
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
            className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl hover:border-blue-500 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">
                  ค้นหาสื่อการสอน, ใบงาน, แผน, หรือข้อสอบ...
                </span>
                <p className="text-xs text-slate-400">ค้นหาได้ทุกระดับชั้นและกลุ่มสาระการเรียนรู้</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">
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
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
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
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-500/50 shadow-xs hover:shadow-md transition-all group text-center space-y-2"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
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
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                ผลงานและสื่อนวัตกรรมเด่น
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                ผลงานคัดสรรยอดนิยมที่ได้รับความสนใจสูงสุด
              </p>
            </div>
            <Link
              href="/portfolio"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
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
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                ใบงานและแบบฝึกหัดล่าสุด
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                ใบงานวิทยาการคำนวณและทักษะการคิด ดาวน์โหลดพร้อมเฉลย
              </p>
            </div>
            <Link
              href="/worksheets"
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
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
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                เกมการเรียนรู้และ Coding
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                เกมเสริมสร้างตรรกะและการคิดแก้ปัญหา ทั้ง Unplugged และ Digital
              </p>
            </div>
            <Link
              href="/games"
              className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
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
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-950 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 border border-indigo-500/20">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
                <Bot className="w-3.5 h-3.5" />
                <span>AI for Education</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold">
                เครื่องมือ AI อัจฉริยะสำหรับคุณครู
              </h3>
              <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed">
                ช่วยออกแบบแผนการสอน Active Learning, สร้างใบงานแบบฝึกหัด และคิดค้นข้อสอบประเมินผลได้ในไม่กี่วินาที
              </p>
            </div>

            <Link
              href="/ai"
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-indigo-50 text-slate-900 font-bold text-xs sm:text-sm shadow-md transition-colors flex items-center gap-2 shrink-0"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>เริ่มใช้งาน AI สำหรับครู</span>
            </Link>
          </div>
        </section>
      )}

      {/* 8. ABOUT TEACHER HIGHLIGHT */}
      {enabledKeys.has('about_teacher') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-1 flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-1 shadow-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=400&auto=format&fit=crop"
                    alt="ครูคิง"
                    className="w-full h-full object-cover rounded-[22px]"
                  />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-4">
                  ครูคิง
                </h3>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  กลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี
                </p>
              </div>

              <div className="md:col-span-2 space-y-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  มุ่งมั่นยกระดับการจัดการเรียนรู้ด้านเทคโนโลยีและ Coding
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  ยินดีต้อนรับทุกท่านสู่พื้นที่แบ่งปันสื่อการเรียนรู้ นวัตกรรม และแผนการสอนที่ผ่านการปฏิบัติจริงในห้องเรียน หวังเป็นอย่างยิ่งว่าสื่อเหล่านี้จะเป็นประโยชน์ต่อเพื่อนครูและนักเรียนทั่วประเทศครับ
                </p>
                <div className="pt-2">
                  <Link
                    href="/p/about"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <span>อ่านประวัติและผลงานฉบับเต็ม</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
