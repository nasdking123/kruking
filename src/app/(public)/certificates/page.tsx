'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Trophy, 
  Award, 
  Calendar, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles,
  Plus
} from 'lucide-react';
import { getWorks, type WorkRow } from '@/services/works';

const CATEGORY_TABS = [
  { key: 'all', label: 'ทั้งหมด' },
  { key: 'award', label: '🏆 รางวัล & เชิดชูเกียรติ' },
  { key: 'training', label: '📜 เกียรติบัตรการอบรม' },
  { key: 'speaker', label: '🎤 วิทยากร & กรรมการ' },
  { key: 'innovation', label: '💡 นวัตกรรมการสอน' },
];

export default function CertificatesPage() {
  const [works, setWorks] = useState<WorkRow[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function load() {
      const all = await getWorks();
      const filtered = all.filter((w) => w.type === 'award' || w.type === 'innovation' || w.type === 'activity');
      setWorks(filtered);
    }
    load();
  }, []);

  const filteredItems = works.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'award') return matchesSearch && item.type === 'award';
    if (activeTab === 'innovation') return matchesSearch && item.type === 'innovation';
    return matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* 1. Header Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-amber-600 via-amber-700 to-yellow-600 text-white shadow-xl space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs">
          <Trophy className="w-3.5 h-3.5" />
          <span>Certificates, Training & Professional Development</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          รวมผลงาน เกียรติบัตร และการอบรมครูคิง
        </h1>

        <p className="text-xs sm:text-sm text-amber-100 max-w-2xl leading-relaxed font-normal">
          คลังประมวลผลงาน เกียรติบัตรเชิดชูเกียรติ ประวัติการผ่านการอบรมเชิงปฏิบัติการพัฒนาวิชาชีพครู และรางวัลดีเด่นด้านการจัดการเรียนรู้วิทยาการคำนวณ
        </p>

        <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-amber-200">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>ผ่านการรับรองจากหน่วยงานต้นสังกัด</span>
          </span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>อัปเดตต่อเนื่อง</span>
          </span>
        </div>
      </div>

      {/* 2. Search & Tab Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่อเกียรติบัตร / รางวัล..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* 3. Certificate Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-50 border border-slate-200/80 text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 mx-auto flex items-center justify-center shadow-inner">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">ยังไม่มีรายการเกียรติบัตรในระบบ</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            คุณครูสามารถเพิ่มเกียรติบัตร รางวัล และประวัติการอบรมได้ผ่านระบบจัดการหลังบ้าน (Admin CMS)
          </p>
          <Link
            href="/admin/works/new"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition-colors shadow-md shadow-amber-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>+ เพิ่มเกียรติบัตร/รางวัลใหม่</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all group"
            >
              <div>
                {/* Certificate Preview Frame */}
                <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
                  {item.cover_image ? (
                    <Image
                      src={item.cover_image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-amber-500 bg-amber-50">
                      <Trophy className="w-12 h-12 opacity-40" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-amber-500/95 backdrop-blur-xs text-white text-[10px] font-bold shadow-md flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    <span>เกียรติบัตรรับรอง</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                    <span>ปีการศึกษา 2568</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-amber-600 transition-colors">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Footer Action */}
              <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] font-bold text-slate-500">
                  {item.grade_level || 'ทุกระดับชั้น'}
                </span>
                <Link
                  href={`/awards/${item.slug}`}
                  className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                >
                  <span>ดูรายละเอียด</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
