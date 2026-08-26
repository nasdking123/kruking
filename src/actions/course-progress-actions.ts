'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// 1. SECURE SERVER ACTION: Enroll into a Course
export async function enrollCourseAction(classroomId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('กรุณาเข้าสู่ระบบก่อนลงทะเบียนเรียน');

    const { data, error } = await supabase
      .from('course_enrollments')
      .upsert(
        {
          user_id: user.id,
          classroom_id: classroomId,
          status: 'active',
          last_accessed_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,classroom_id' }
      )
      .select()
      .single();

    if (error) return { success: false, error: error.message };

    revalidatePath('/classroom');
    revalidatePath('/student/dashboard');
    revalidatePath('/student/history');
    return { success: true, enrollment: data };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

// 2. SECURE SERVER ACTION: Toggle or Update Lesson Progress
export async function updateLessonProgressAction(params: {
  classroomId: string;
  lessonId: string;
  isCompleted: boolean;
  timeSpentSeconds?: number;
}) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('กรุณาเข้าสู่ระบบเพื่อบันทึกการเรียน');

    // 1. Ensure Enrollment exists
    await supabase.from('course_enrollments').upsert(
      {
        user_id: user.id,
        classroom_id: params.classroomId,
        status: 'active',
        last_accessed_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,classroom_id' }
    );

    // 2. Upsert Lesson Progress
    const { error: progError } = await supabase
      .from('lesson_progress')
      .upsert(
        {
          user_id: user.id,
          classroom_id: params.classroomId,
          lesson_id: params.lessonId,
          is_completed: params.isCompleted,
          completed_at: params.isCompleted ? new Date().toISOString() : null,
          time_spent_seconds: params.timeSpentSeconds || 0,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,lesson_id' }
      );

    if (progError) return { success: false, error: progError.message };

    // 3. Recalculate Course Progress %
    const { data: allLessons } = await supabase
      .from('lessons')
      .select('id')
      .eq('course_id', params.classroomId);

    const totalLessons = allLessons?.length || 1;

    const { count: completedCount } = await supabase
      .from('lesson_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('classroom_id', params.classroomId)
      .eq('is_completed', true);

    const progressPercentage = Math.min(100, Math.round(((completedCount || 0) / totalLessons) * 100));
    const isCourseCompleted = progressPercentage >= 100;

    await supabase
      .from('course_enrollments')
      .update({
        progress_percentage: progressPercentage,
        status: isCourseCompleted ? 'completed' : 'active',
        completed_at: isCourseCompleted ? new Date().toISOString() : null,
        last_accessed_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .eq('classroom_id', params.classroomId);

    // 4. If Course 100% Completed, Award Course Completion Bonus XP (Once only)
    if (isCourseCompleted) {
      const { data: existingTx } = await supabase
        .from('point_transactions')
        .select('id')
        .eq('user_id', user.id)
        .eq('source_id', params.classroomId)
        .eq('point_type', 'bonus')
        .maybeSingle();

      if (!existingTx) {
        await supabase.from('point_transactions').insert({
          user_id: user.id,
          amount: 50,
          point_type: 'bonus',
          source_id: params.classroomId,
          description: `สำเร็จหลักสูตรห้องเรียนออนไลน์ (ความก้าวหน้า 100%) (+50 คะแนน)`,
        });
      }
    }

    // 5. Also log into views table for backward compatibility
    if (params.isCompleted) {
      await supabase.from('views').insert({
        user_id: user.id,
        entity_id: params.lessonId,
        entity_type: 'lesson',
        action: 'complete',
      });
    }

    revalidatePath(`/classroom`);
    revalidatePath(`/student/dashboard`);
    revalidatePath(`/student/history`);
    revalidatePath(`/student/points`);

    return {
      success: true,
      progressPercentage,
      isCourseCompleted,
    };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}
