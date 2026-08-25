import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, joinCode } = body;

    if (!userId || !joinCode) {
      return NextResponse.json(
        { success: false, error: 'ข้อมูลไม่ครบถ้วน (ต้องระบุรหัสเข้าห้องเรียน)' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // 1. Find classroom by join_code
    const { data: classroom, error: errClass } = await supabase
      .from('classrooms')
      .select('id, title, grade_level, subject')
      .eq('join_code', joinCode.trim().toUpperCase())
      .maybeSingle();

    if (errClass || !classroom) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบห้องเรียนที่ตรงกับรหัสนี้ กรุณาตรวจสอบรหัสใหม่อีกครั้ง' },
        { status: 404 }
      );
    }

    // 2. Check if already enrolled
    const { data: existing } = await supabase
      .from('classroom_members')
      .select('id')
      .eq('classroom_id', classroom.id)
      .eq('user_id', userId)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({
        success: true,
        alreadyEnrolled: true,
        classroomTitle: classroom.title,
        message: 'ท่านได้สมัครเข้าห้องเรียนนี้ไว้แล้ว',
      });
    }

    // 3. Insert into classroom_members
    const { error: errInsert } = await supabase.from('classroom_members').insert([
      {
        classroom_id: classroom.id,
        user_id: userId,
        role: 'student',
        joined_at: new Date().toISOString(),
      },
    ]);

    if (errInsert) {
      return NextResponse.json(
        { success: false, error: errInsert.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      classroomTitle: classroom.title,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
