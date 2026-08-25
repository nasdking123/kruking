import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { SiteSettings } from '@/types';
import type { Json } from '@/types/database';

export const dynamic = 'force-dynamic';

function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function GET() {
  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'general')
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json({ success: false, error: error?.message });
    }

    return NextResponse.json({ success: true, data: data.value });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const settings: Partial<SiteSettings> = body.settings || body;

    const supabase = getAdminClient();

    // Get current settings
    const { data: currentRecord } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'general')
      .maybeSingle();

    const current = (currentRecord?.value || {}) as Record<string, unknown>;
    const updated = { ...current, ...settings };

    // Update settings in database
    const { error } = await supabase
      .from('site_settings')
      .upsert({
        key: 'general',
        value: updated as unknown as Json,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'key' });

    if (error) {
      console.error('API Settings upsert error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error('API Settings exception:', err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
