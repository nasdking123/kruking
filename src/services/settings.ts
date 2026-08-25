import { createClient } from '@/lib/supabase/client';
import type { SiteSettings } from '@/types';
import type { Json } from '@/types/database';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  site_name: 'ห้องสื่อครูคิง',
  tagline: 'แหล่งรวมสื่อการเรียนรู้ นวัตกรรม และประสบการณ์การสอนครูคิง',
  logo_url: '/images/logo.png',
  favicon_url: '/favicon.ico',
  primary_color: '#2563eb',
  contact_email: 'kruking.admin@school.ac.th',
  contact_phone: '0643531267',
  school_name: 'โรงเรียนวัดบางโฉลงใน',
  teacher_name: 'ครูคิง (Kru King)',
  teacher_title: 'ครูผู้สอนกลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี • สังคมศึกษา',
  teacher_bio: 'มุ่งมั่นพัฒนาสื่อนวัตกรรมการจัดการเรียนรู้แบบ Active Learning 5E และการคิดเชิงคำนวณ เพื่อให้ผู้เรียนทุกคนสนุกและเกิดทักษะในชีวิตจริง',
  teacher_avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop',
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
    const supabase = createClient();
    const current = await getSettings();
    const updated = { ...current, ...settings };

    // Check if row exists
    const { data: existing } = await supabase
      .from('site_settings')
      .select('id')
      .eq('key', 'general')
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('site_settings')
        .update({ 
          value: updated as unknown as Json, 
          updated_at: new Date().toISOString() 
        })
        .eq('key', 'general');

      if (error) {
        console.error('Update settings error:', error);
        return { success: false, error: error.message };
      }
    } else {
      const { error } = await supabase
        .from('site_settings')
        .insert([{
          key: 'general',
          value: updated as unknown as Json,
          updated_at: new Date().toISOString()
        }]);

      if (error) {
        console.error('Insert settings error:', error);
        return { success: false, error: error.message };
      }
    }

    return { success: true };
  } catch (err) {
    console.error('Save settings exception:', err);
    return { success: false, error: String(err) };
  }
}
