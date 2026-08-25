'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Save, 
  Globe, 
  UserCheck
} from 'lucide-react';
import { getSettings, saveSettings } from '@/services/settings';
import type { SiteSettings } from '@/types';
import { useToast } from '@/components/ui/toast';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setLoading(true);
    await saveSettings(settings);
    setLoading(false);
    toast.success('บันทึกการตั้งค่าสำเร็จ', 'ข้อมูลโปรไฟล์ครูคิง ภาพหน้าปก และการตั้งค่าถูกอัปเดตเรียบร้อย');
  };

  if (!settings) {
    return <div className="p-8 text-center text-slate-400 text-xs">กำลังโหลดการตั้งค่า...</div>;
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <SettingsIcon className="w-4 h-4" />
            <span>Site Configuration</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            ตั้งค่าเว็บไซต์ทั่วไป และโปรไฟล์ครูคิง (Settings)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            จัดการรูปโปรไฟล์ครูคิง รูปภาพแบนเนอร์หน้าปก สโลแกน และข้อมูลติดต่อ
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า'}</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* 1. Profile Teacher Kru King & Cover Banner Settings */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4 text-xs">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <UserCheck className="w-4 h-4 text-blue-500" />
            <span>ข้อมูลโปรไฟล์ครูคิง & ภาพแบนเนอร์หน้าแรก (Teacher & Banner Settings)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">ชื่อผู้สอน (Teacher Name)</label>
              <input
                type="text"
                value={settings.teacher_name || ''}
                onChange={(e) => setSettings({ ...settings, teacher_name: e.target.value })}
                placeholder="ครูคิง (Kru King)"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">ตำแหน่ง / สังกัดผู้สอน</label>
              <input
                type="text"
                value={settings.teacher_title || ''}
                onChange={(e) => setSettings({ ...settings, teacher_title: e.target.value })}
                placeholder="ครูผู้สอนกลุ่มสาระวิทยาศาสตร์และเทคโนโลยี • สังคมศึกษา"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">URL รูปโปรไฟล์ครูคิง (Teacher Avatar URL)</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={settings.teacher_avatar_url || ''}
                onChange={(e) => setSettings({ ...settings, teacher_avatar_url: e.target.value })}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <p className="text-[10px] text-slate-400">รูปภาพนี้จะแสดงในส่วน &quot;เกี่ยวกับผู้สอน: ครูคิง&quot; ที่หน้าแรกและหน้าเกี่ยวกับ</p>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">URL ภาพแบนเนอร์หน้าปกหน้าแรก (Hero Cover Banner URL)</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={settings.banner_cover_url || ''}
                onChange={(e) => setSettings({ ...settings, banner_cover_url: e.target.value })}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <p className="text-[10px] text-slate-400">รูปภาพนี้จะแสดงเป็นภาพแบนเนอร์ใหญ่ในส่วน Hero Banner บนสุดของหน้าแรก</p>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">คำแนะนำตัว / ปรัชญาการสอน (Teacher Bio)</label>
            <textarea
              rows={3}
              value={settings.teacher_bio || ''}
              onChange={(e) => setSettings({ ...settings, teacher_bio: e.target.value })}
              placeholder="มุ่งมั่นพัฒนาสื่อนวัตกรรมการจัดการเรียนรู้แบบ Active Learning 5E..."
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* 2. General & Brand Settings */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4 text-xs">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Globe className="w-4 h-4 text-blue-500" />
            <span>ข้อมูลพื้นฐานเว็บไซต์ (General & Brand)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">ชื่อเว็บไซต์ (Site Name) *</label>
              <input
                type="text"
                required
                value={settings.site_name}
                onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">ชื่อโรงเรียน / สังกัด</label>
              <input
                type="text"
                value={settings.school_name}
                onChange={(e) => setSettings({ ...settings, school_name: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">สโลแกน / คำขวัญ (Tagline)</label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
