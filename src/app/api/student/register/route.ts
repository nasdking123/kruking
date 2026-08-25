import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, email, password, fullName, gradeLevel, studentNumber, classroomName, school } = body;

    const rawUser = (username || email || '').trim().toLowerCase();

    if (!rawUser || !password || !fullName) {
      return NextResponse.json(
        { success: false, error: 'กรุณากรอกชื่อ-นามสกุล ชื่อผู้ใช้ และรหัสผ่าน' },
        { status: 400 }
      );
    }

    // Clean username to alphanumeric and format internal auth email
    const cleanUsername = rawUser.includes('@') 
      ? rawUser 
      : `${rawUser.replace(/[^a-z0-9_.-]/g, '')}@student.kruking.ac.th`;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // 1. Create or get user in Supabase Auth
    const { data: userAuth, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: cleanUsername,
      password: password.trim(),
      email_confirm: true,
      user_metadata: {
        full_name: fullName.trim(),
        username: rawUser.replace('@student.kruking.ac.th', ''),
        role: 'student',
      },
    });

    if (authError) {
      // If already exists
      return NextResponse.json(
        { success: false, error: `ชื่อผู้ใช้นี้มีคนใช้แล้ว (${authError.message})` },
        { status: 400 }
      );
    }

    const userId = userAuth.user.id;

    // 2. Insert or update student profile
    const { error: profileError } = await supabaseAdmin.from('profiles').upsert({
      id: userId,
      email: cleanUsername,
      full_name: fullName.trim(),
      role: 'student',
      school: school?.trim() || 'โรงเรียนวัดบางโฉลงใน',
      social_links: {
        username: rawUser.replace('@student.kruking.ac.th', ''),
        grade_level: gradeLevel || 'ประถมศึกษาปีที่ 6',
        student_number: studentNumber || '-',
        classroom_name: classroomName || 'ห้อง 1',
      },
      is_active: true,
      updated_at: new Date().toISOString(),
    });

    if (profileError) {
      console.warn('Profile upsert warning:', profileError);
    }

    return NextResponse.json({
      success: true,
      data: {
        id: userId,
        username: rawUser.replace('@student.kruking.ac.th', ''),
        email: cleanUsername,
        full_name: fullName,
        role: 'student',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
