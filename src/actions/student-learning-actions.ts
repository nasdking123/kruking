'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { Json } from '@/types/database';

// Helper: Require Admin or Teacher session
async function requireTeacherOrAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('กรุณาเข้าสู่ระบบก่อนทำรายการ');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, is_active')
    .eq('id', user.id)
    .single();

  if (!profile || !profile.is_active || (profile.role !== 'admin' && profile.role !== 'teacher')) {
    throw new Error('คุณไม่มีสิทธิ์ในการดำเนินการนี้ (สิทธิ์เฉพาะครูผู้สอนหรือผู้ดูแลระบบ)');
  }

  return { supabase, user, profile };
}

// 1. SECURE SERVER ACTION: Grade Student Submission & Award Points
export async function gradeSubmissionAction(params: {
  submissionId: string;
  userId: string;
  score: number;
  maxScore: number;
  teacherFeedback: string;
  status: 'passed' | 'graded' | 'needs_revision';
  lessonTitle?: string;
}) {
  try {
    const { supabase, user } = await requireTeacherOrAdmin();

    // Input Validation
    const cleanScore = Math.max(0, Math.min(params.maxScore || 20, Number(params.score) || 0));
    const cleanFeedback = (params.teacherFeedback || '').trim();

    // 1. Update Submission Record
    const { error: subError } = await supabase
      .from('assignment_submissions')
      .update({
        score: cleanScore,
        teacher_feedback: cleanFeedback || null,
        status: params.status,
        graded_at: new Date().toISOString(),
      })
      .eq('id', params.submissionId);

    if (subError) {
      return { success: false, error: subError.message };
    }

    // 2. Award Points to Student Ledger (Prevent Duplicate for same submission)
    if (cleanScore > 0 && (params.status === 'passed' || params.status === 'graded')) {
      // Check if already awarded
      const { data: existingTx } = await supabase
        .from('point_transactions')
        .select('id')
        .eq('user_id', params.userId)
        .eq('source_id', params.submissionId)
        .eq('point_type', 'assignment')
        .maybeSingle();

      if (!existingTx) {
        await supabase.from('point_transactions').insert({
          user_id: params.userId,
          amount: cleanScore,
          point_type: 'assignment',
          source_id: params.submissionId,
          description: `คะแนนส่งการบ้านบทเรียน "${params.lessonTitle || 'บทเรียนออนไลน์'}" (+${cleanScore} คะแนน)`,
          created_by: user.id,
        });
      }
    }

    // 3. Insert In-App Notification to Student
    await supabase.from('notifications').insert({
      user_id: params.userId,
      title:
        params.status === 'needs_revision'
          ? '⚠️ คุณครูให้ส่งการบ้านแก้ไข'
          : `🎉 ตรวจการบ้านแล้ว: ได้รับ ${cleanScore}/${params.maxScore || 20} คะแนน`,
      message:
        params.status === 'needs_revision'
          ? `บทเรียน "${params.lessonTitle || 'บทเรียน'}" มีคำแนะนำจากครู: ${cleanFeedback || 'โปรดแก้ไขและส่งใหม่'}`
          : `บทเรียน "${params.lessonTitle || 'บทเรียน'}" ได้รับการตรวจและบันทึกคะแนนสะสมเรียบร้อยแล้ว`,
      type: params.status === 'needs_revision' ? 'revision_requested' : 'assignment_graded',
      link: '/student/history',
    });

    // 4. Record Audit Log
    await supabase.from('audit_logs').insert({
      actor_id: user.id,
      actor_name: user.user_metadata?.full_name || 'ครูผู้สอน',
      action: 'grade_submission',
      target_type: 'assignment_submission',
      target_id: params.submissionId,
      details: {
        score: cleanScore,
        maxScore: params.maxScore,
        status: params.status,
        studentId: params.userId,
      },
    });

    revalidatePath('/admin/submissions');
    revalidatePath('/student/portfolio');
    revalidatePath('/student/points');
    revalidatePath('/student/ranking');
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || 'เกิดข้อผิดพลาดในการบันทึกคะแนน' };
  }
}

// 2. SECURE SERVER ACTION: Review Student Certificate (Approve / Reject)
export async function reviewCertificateAction(params: {
  certificateId: string;
  status: 'approved' | 'rejected';
  rejectReason?: string;
}) {
  try {
    const { supabase, user } = await requireTeacherOrAdmin();

    const { data: cert, error } = await supabase
      .from('student_certificates')
      .update({
        status: params.status,
        reject_reason: params.status === 'rejected' ? (params.rejectReason || 'เอกสารไม่ตรงตามเกณฑ์').trim() : null,
        approved_at: params.status === 'approved' ? new Date().toISOString() : null,
      })
      .eq('id', params.certificateId)
      .select()
      .single();

    if (error) return { success: false, error: error.message };

    // 1. Insert In-App Notification to Student
    if (cert) {
      await supabase.from('notifications').insert({
        user_id: cert.user_id,
        title:
          params.status === 'approved'
            ? '🎖️ เกียรติบัตรของคุณได้รับการอนุมัติแล้ว!'
            : '❌ เกียรติบัตรไม่ผ่านการอนุมัติ',
        message:
          params.status === 'approved'
            ? `เกียรติบัตร "${cert.title}" ได้รับการรับรองและออก QR Code ตรวจสอบเรียบร้อยแล้ว`
            : `เกียรติบัตร "${cert.title}" มีข้อผิดพลาด: ${params.rejectReason || 'เอกสารไม่ตรงตามเกณฑ์'}`,
        type: params.status === 'approved' ? 'certificate_approved' : 'certificate_rejected',
        link: params.status === 'approved' ? `/verify-cert/${cert.id}` : '/student/certificates',
      });
    }

    // 2. Record Audit Log
    await supabase.from('audit_logs').insert({
      actor_id: user.id,
      actor_name: user.user_metadata?.full_name || 'ครูผู้สอน',
      action: 'review_certificate',
      target_type: 'student_certificate',
      target_id: params.certificateId,
      details: {
        status: params.status,
        rejectReason: params.rejectReason,
      },
    });

    revalidatePath('/admin/certificates');
    revalidatePath('/student/certificates');
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

// 3. SECURE SERVER ACTION: Record Competition Result & Award Bonus Points
export async function recordCompetitionResultAction(params: {
  competitionId: string;
  userId: string;
  rank: number;
  score: number;
  notes?: string;
  pointsReward: number;
  competitionTitle: string;
}) {
  try {
    const { supabase, user } = await requireTeacherOrAdmin();

    const { error: resError } = await supabase
      .from('competition_results')
      .upsert(
        {
          competition_id: params.competitionId,
          user_id: params.userId,
          rank: Number(params.rank) || 1,
          score: Number(params.score) || 0,
          notes: (params.notes || '').trim() || null,
        },
        { onConflict: 'competition_id,user_id' }
      );

    if (resError) return { success: false, error: resError.message };

    // Award Competition Bonus Points safely
    if (params.pointsReward > 0) {
      const { data: existingTx } = await supabase
        .from('point_transactions')
        .select('id')
        .eq('user_id', params.userId)
        .eq('source_id', params.competitionId)
        .eq('point_type', 'competition')
        .maybeSingle();

      if (!existingTx) {
        await supabase.from('point_transactions').insert({
          user_id: params.userId,
          amount: params.pointsReward,
          point_type: 'competition',
          source_id: params.competitionId,
          description: `รางวัลอันดับที่ ${params.rank} การแข่งขัน "${params.competitionTitle}" (+${params.pointsReward} คะแนน)`,
          created_by: user.id,
        });

        // Notification
        await supabase.from('notifications').insert({
          user_id: params.userId,
          title: `🏆 บันทึกผลการแข่งขัน: อันดับที่ ${params.rank}`,
          message: `คุณได้รับรางวัลอันดับที่ ${params.rank} จากการแข่งขัน "${params.competitionTitle}" รับโบนัส +${params.pointsReward} คะแนน`,
          type: 'points_awarded',
          link: '/student/points',
        });
      }
    }

    // Audit Log
    await supabase.from('audit_logs').insert({
      actor_id: user.id,
      actor_name: user.user_metadata?.full_name || 'ครูผู้สอน',
      action: 'record_competition_result',
      target_type: 'competitions',
      target_id: params.competitionId,
      details: {
        rank: params.rank,
        score: params.score,
        pointsReward: params.pointsReward,
        userId: params.userId,
      },
    });

    revalidatePath('/admin/competitions');
    revalidatePath('/competitions');
    revalidatePath(`/competitions/${params.competitionId}`);
    revalidatePath('/student/points');
    revalidatePath('/student/ranking');
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

// 4. SECURE SERVER ACTION: Toggle Portfolio Visibility (Student Owner Only)
export async function togglePortfolioVisibilityAction(submissionId: string, isInPortfolio: boolean) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('กรุณาเข้าสู่ระบบก่อนทำรายการ');

    const { error } = await supabase
      .from('assignment_submissions')
      .update({ is_in_portfolio: isInPortfolio })
      .eq('id', submissionId)
      .eq('user_id', user.id); // Strict ownership check

    if (error) return { success: false, error: error.message };

    revalidatePath('/student/portfolio');
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

// 5. SECURE SERVER ACTION: Update Student Profile (Student Owner Only)
export async function updateStudentProfileAction(data: {
  fullName?: string;
  nickname?: string;
  avatarUrl?: string;
  gradeLevel?: string;
  classroom?: string;
  studentNumber?: string;
  schoolName?: string;
  bio?: string;
}) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('กรุณาเข้าสู่ระบบก่อนทำรายการ');

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: data.fullName?.trim(),
        nickname: data.nickname?.trim() || null,
        avatar_url: data.avatarUrl || null,
        grade_level: data.gradeLevel || null,
        classroom: data.classroom || null,
        student_number: data.studentNumber || null,
        school_name: data.schoolName || null,
        bio: data.bio?.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id); // Strict ownership check

    if (error) return { success: false, error: error.message };

    revalidatePath('/student/profile');
    revalidatePath('/student/ranking');
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

// 6. SECURE SERVER ACTION: Submit or Re-submit Assignment with Revision Tracking
export async function submitAssignmentAction(params: {
  lessonId: string;
  classroomId?: string | null;
  submissionType: 'link' | 'image' | 'text';
  contentUrl?: string;
  notes?: string;
}) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('กรุณาเข้าสู่ระบบก่อนส่งการบ้าน');

    const cleanContentUrl = (params.contentUrl || '').trim();
    const cleanNotes = (params.notes || '').trim();

    if (params.submissionType !== 'text' && !cleanContentUrl) {
      throw new Error('กรุณาระบุลิงก์หรือ URL รูปภาพผลงาน');
    }

    const { data: existingSub } = await supabase
      .from('assignment_submissions')
      .select('*')
      .eq('user_id', user.id)
      .eq('lesson_id', params.lessonId)
      .maybeSingle();

    if (!existingSub) {
      // First-time submission
      const { data, error } = await supabase
        .from('assignment_submissions')
        .insert({
          user_id: user.id,
          student_name: user.user_metadata?.full_name || 'นักเรียน',
          lesson_id: params.lessonId,
          classroom_id: params.classroomId || null,
          submission_type: params.submissionType,
          content_url: cleanContentUrl || null,
          notes: cleanNotes || null,
          status: 'pending',
          revision_count: 1,
          submitted_revisions: [],
          is_in_portfolio: true,
          submitted_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) return { success: false, error: error.message };

      revalidatePath('/admin/submissions');
      revalidatePath('/student/portfolio');
      revalidatePath('/student/history');
      return { success: true, submission: data, isRevision: false };
    }

    // Re-submission / Revision
    const oldRevisions = (existingSub.submitted_revisions as Array<Record<string, unknown>>) || [];
    const newRevisionHistory = [
      ...oldRevisions,
      {
        revision: existingSub.revision_count || 1,
        submission_type: existingSub.submission_type,
        content_url: existingSub.content_url,
        notes: existingSub.notes,
        submitted_at: existingSub.submitted_at,
        previous_feedback: existingSub.teacher_feedback,
      },
    ];

    const nextRevisionCount = (existingSub.revision_count || 1) + 1;

    const { data: updated, error: updateError } = await supabase
      .from('assignment_submissions')
      .update({
        submission_type: params.submissionType,
        content_url: cleanContentUrl || null,
        notes: cleanNotes || null,
        status: 'pending', // Set back to pending for teacher re-review
        revision_count: nextRevisionCount,
        submitted_revisions: newRevisionHistory as unknown as Json,
        submitted_at: new Date().toISOString(),
      })
      .eq('id', existingSub.id)
      .select()
      .single();

    if (updateError) return { success: false, error: updateError.message };

    revalidatePath('/admin/submissions');
    revalidatePath('/student/portfolio');
    revalidatePath('/student/history');
    return { success: true, submission: updated, isRevision: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}
