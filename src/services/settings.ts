import { createClient } from '@/lib/supabase/client';
import type { SiteSettings } from '@/types';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  site_name: 'ห้องสื่อครูคิง',
  tagline: 'แหล่งรวมสื่อการเรียนรู้ นวัตกรรม และประสบการณ์การสอนครูคิง',
  logo_url: '/images/logo.png',
  favicon_url: '/favicon.ico',
  primary_color: '#2563eb',
  contact_email: 'kruking.admin@school.ac.th',
  contact_phone: '0643531267',
  school_name: 'โรงเรียนวัดบางโฉลงใน',
  teacher_name: 'ครูจักรพงษ์ สำรองพันธ์ (ครูคิง)',
  teacher_title: 'ครูผู้สอนกลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี • สังคมศึกษา',
  teacher_bio: 'มุ่งมั่นพัฒนาสื่อนวัตกรรมการจัดการเรียนรู้แบบ Active Learning 5E และการคิดเชิงคำนวณ เพื่อให้ผู้เรียนทุกคนสนุกและเกิดทักษะในชีวิตจริง',
  teacher_avatar_url: '/images/logo.png',
  banner_cover_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop',
  social_links: {
    facebook: 'https://facebook.com/kruking',
    youtube: 'https://youtube.com/@kruking',
    line: '@kruking',
    tiktok: '@kruking',
    twitter: '',
  },
  footer_text: '© 2026 ห้องสื่อครูคิง. All rights reserved. มุ่งมั่นพัฒนาการศึกษาไทยด้วยเทคโนโลยีและนวัตกรรมการเรียนรู้',
};

export async function getSettings(): Promise<SiteSettings> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'general')
      .maybeSingle();

    if (error || !data || !data.value) {
      return DEFAULT_SITE_SETTINGS;
    }
    return { ...DEFAULT_SITE_SETTINGS, ...(data.value as Record<string, unknown>) } as SiteSettings;
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function saveSettings(settings: Partial<SiteSettings>): Promise<{ success: boolean; error?: string }> {
  try {
    // Attempt save via server API route
    if (typeof window !== 'undefined') {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });
      const json = await res.json();
      if (json.success) {
        return { success: true };
      }
      if (json.error) {
        console.warn('API route failed, trying fallback client update:', json.error);
      }
    }

    // Direct Supabase fallback
    const supabase = createClient();
    const current = await getSettings();
    const updated = { ...current, ...settings };

    const { error } = await supabase
      .from('site_settings')
      .update({
        value: updated,
        updated_at: new Date().toISOString(),
      })
      .eq('key', 'general');

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Save settings exception:', err);
    return { success: false, error: String(err) };
  }
}
