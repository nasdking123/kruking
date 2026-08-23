import { createClient } from '@/lib/supabase/client';
import type { SiteSettings } from '@/types';
import type { Json } from '@/types/database';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  site_name: 'ห้องสื่อครูคิง',
  tagline: 'แหล่งรวมสื่อการเรียนรู้ ผลงาน นวัตกรรม และประสบการณ์การสอน',
  logo_url: '/images/logo.png',
  favicon_url: '/favicon.ico',
  primary_color: '#2563eb',
  contact_email: 'kruking.teaching@gmail.com',
  contact_phone: '081-234-5678',
  school_name: 'โรงเรียนตัวอย่างวิทยา',
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
      .single();

    if (error || !data || !data.value) {
      return DEFAULT_SITE_SETTINGS;
    }
    return { ...DEFAULT_SITE_SETTINGS, ...(data.value as Record<string, unknown>) } as SiteSettings;
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function saveSettings(settings: Partial<SiteSettings>): Promise<boolean> {
  try {
    const supabase = createClient();
    const current = await getSettings();
    const updated = { ...current, ...settings };

    await supabase
      .from('site_settings')
      .upsert({ key: 'general', value: updated as unknown as Json, updated_at: new Date().toISOString() });

    return true;
  } catch {
    return true;
  }
}
