'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Settings as SettingsIcon, 
  Save, 
  Globe, 
  UserCheck, 
  Loader2,
  ImageIcon,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { getSettings, saveSettings } from '@/services/settings';
import type { SiteSettings } from '@/types';
import { useToast } from '@/components/ui/toast';

const SAMPLE_BANNERS = [
  { label: 'ห้องเรียน Active Learning', url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop' },
  { label: 'เทคโนโลยีและการศึกษา', url: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=1200&auto=format&fit=crop' },
  { label: 'ห้องเรียนวิทยาการคำนวณ', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop' },
  { label: 'ประวัติศาสตร์และวัฒนธรรม', url: 'https://images.unsplash.com/photo-1599707303398-5440f0475c17?q=80&w=1200&auto=format&fit=crop' }
];

export default function AdminSettingsPage() {
  const router = useRouter();
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
    const result = await saveSettings(settings);
    setLoading(false);

    if (result.success) {
      toast.success('บันทึกการตั้งค่าสำเร็จ', 'ข้อมูลโปรไฟล์ครูคิง ภาพหน้าปก และการตั้งค่าถูกบันทึกลงฐานข้อมูลเรียบร้อย');
      router.refresh();
    } else {
      toast.error('ไม่สามารถบันทึกได้', result.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  if (!settings) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
        <span>กำลังโหลดการตั้งค่าระบบ...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-5xl mx-auto p-6 sm:p-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <SettingsIcon className="w-4 h-4" />
            <span>Site Configuration & Theme</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            ตั้งค่าเว็บไซต์ และรูปภาพหน้าปก/โปรไฟล์ครูคิง
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            กำหนดรูปโปรไฟล์ครูคิง รูปแบนเนอร์หน้าแรก สโลแกน และข้อมูลสังกัดโรงเรียน
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer w-fit"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{loading ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่าทั้งหมด'}</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* 1. Hero Banner Cover Setting with Live Preview */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-blue-600" />
              <span>1. ภาพหน้าปก / แบนเนอร์หลักหน้าแรก (Hero Cover Banner)</span>
            </h2>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>แสดงผลบนหน้าแรก</span>
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Input & Presets (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  URL ภาพหน้าปกแบนเนอร์ (Banner Cover Image URL) *
                </label>
                <input
                  type="text"
                  required
                  value={settings.banner_cover_url || ''}
                  onChange={(e) => setSettings({ ...settings, banner_cover_url: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  วางลิงก์รูปภาพ (URL) จากอินเทอร์เน็ต, Unsplash, Google Drive, Imgur หรือคลาวด์ใดก็ได้
                </p>
              </div>

              {/* Sample Presets */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>หรือคลิกเลือกภาพตัวอย่างสำเร็จรูป:</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_BANNERS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setSettings({ ...settings, banner_cover_url: preset.url })}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Live Preview Box (5 cols) */}
            <div className="lg:col-span-5 space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                ตัวอย่างการแสดงผลภาพหน้าปก (Live Preview):
              </span>
              <div className="relative aspect-16/10 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-800 bg-slate-900 shadow-md">
                {settings.banner_cover_url ? (
                  <Image
                    src={settings.banner_cover_url}
                    alt="Preview Banner"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                    ยังไม่มีภาพหน้าปก
                  </div>
                )}
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] backdrop-blur-xs font-semibold">
                  Hero Cover Preview
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Teacher Kru King Profile Settings with Live Preview */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>2. ข้อมูลโปรไฟล์และรูปภาพครูคิง (Teacher Kru King Profile)</span>
            </h2>
            <span className="text-[11px] text-blue-600 font-semibold">
              แสดงในการ์ดหน้าแรก & หน้าเกี่ยวกับ
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Inputs (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    ชื่อผู้สอน (Teacher Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.teacher_name || ''}
                    onChange={(e) => setSettings({ ...settings, teacher_name: e.target.value })}
                    placeholder="ครูคิง (Kru King)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    ตำแหน่ง / สังกัดผู้สอน
                  </label>
                  <input
                    type="text"
                    value={settings.teacher_title || ''}
                    onChange={(e) => setSettings({ ...settings, teacher_title: e.target.value })}
                    placeholder="ครูผู้สอนกลุ่มสาระวิทยาศาสตร์และเทคโนโลยี • สังคมศึกษา"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  URL รูปโปรไฟล์ครูคิง (Teacher Avatar URL)
                </label>
                <input
                  type="text"
                  value={settings.teacher_avatar_url || ''}
                  onChange={(e) => setSettings({ ...settings, teacher_avatar_url: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  คำแนะนำตัว / ปรัชญาการสอน (Teacher Bio)
                </label>
                <textarea
                  rows={3}
                  value={settings.teacher_bio || ''}
                  onChange={(e) => setSettings({ ...settings, teacher_bio: e.target.value })}
                  placeholder="มุ่งมั่นพัฒนาสื่อนวัตกรรมการจัดการเรียนรู้แบบ Active Learning 5E..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Right: Avatar Preview (4 cols) */}
            <div className="lg:col-span-4 flex flex-col items-center text-center space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                รูปโปรไฟล์ครูคิง:
              </span>
              <div className="relative w-32 h-32 rounded-3xl overflow-hidden border-4 border-blue-500/30 bg-slate-900 shadow-lg">
                {settings.teacher_avatar_url ? (
                  <Image
                    src={settings.teacher_avatar_url}
                    alt="Teacher Avatar Preview"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                    ไม่มีรูปภาพ
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-400">Avatar Preview</span>
            </div>
          </div>
        </div>

        {/* 3. General Site Settings */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4 text-xs">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Globe className="w-4 h-4 text-blue-500" />
            <span>3. ข้อมูลพื้นฐานเว็บไซต์ & สังกัดโรงเรียน</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">ชื่อเว็บไซต์ (Site Name) *</label>
              <input
                type="text"
                required
                value={settings.site_name}
                onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">ชื่อโรงเรียน / สังกัด</label>
              <input
                type="text"
                value={settings.school_name}
                onChange={(e) => setSettings({ ...settings, school_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">สโลแกน / คำขวัญ (Tagline)</label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>บันทึกการตั้งค่าทั้งหมด</span>
          </button>
        </div>
      </div>
    </form>
  );
}
