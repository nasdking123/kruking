import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, lessonId, action } = body;

    if (!userId || !lessonId) {
      return NextResponse.json(
        { success: false, error: 'Missing userId or lessonId' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const entityType = action === 'complete' ? 'lesson_complete' : 'lesson_view';

    // Insert view/completion log
    const { error } = await supabase.from('views').insert([
      {
        entity_type: entityType,
        entity_id: lessonId,
        user_id: userId,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
