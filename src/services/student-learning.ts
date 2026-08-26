import { createClient } from '@/lib/supabase/client';

export interface StudentProfileData {
  id: string;
  fullName: string;
  nickname?: string | null;
  avatarUrl?: string | null;
  gradeLevel?: string | null;
  classroom?: string | null;
  studentNumber?: string | null;
  schoolName?: string | null;
  bio?: string | null;
  totalPoints?: number;
  totalLessonsCompleted?: number;
  totalSubmissions?: number;
  totalCertificates?: number;
  totalAwards?: number;
  currentRank?: number;
}

export interface PointTransactionItem {
  id: string;
  amount: number;
  pointType: 'learning' | 'bonus' | 'assignment' | 'quiz' | 'competition' | 'award' | 'adjustment';
  description: string;
  createdAt: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  lessonTitle: string;
  classroomTitle: string;
  submissionType: string;
  contentUrl: string | null;
  notes: string | null;
  score: number | null;
  maxScore: number;
  status: 'pending' | 'passed' | 'graded' | 'needs_revision';
  teacherFeedback: string | null;
  isInPortfolio: boolean;
  submittedAt: string;
}

export interface LearningHistoryRecord {
  id: string;
  date: string;
  title: string;
  category: 'บทเรียน' | 'การบ้าน' | 'แบบทดสอบ' | 'การแข่งขัน' | 'รางวัล';
  scoreDisplay?: string;
  statusText: string;
  statusType: 'success' | 'warning' | 'info';
}

export interface StudentCertificateItem {
  id: string;
  title: string;
  studentName: string;
  issuer: string;
  issueDate: string;
  imageUrl: string | null;
  competitionLevel?: string | null;
  awardTier?: string | null;
  status: 'pending' | 'approved' | 'rejected';
  rejectReason?: string | null;
  approvedAt?: string | null;
}

export interface StudentAwardItem {
  id: string;
  studentName: string;
  awardName: string;
  awardType: string;
  description: string | null;
  badgeIcon: string;
  issueDate: string;
}

export interface RankingEntry {
  rank: number;
  userId: string;
  name: string;
  nickname?: string;
  avatarUrl?: string;
  schoolName: string;
  gradeLevel: string;
  classroom: string;
  points: number;
  badgesCount: number;
  submissionsCount: number;
}

// 1. Get Student Profile with Aggregated Stats
export async function getStudentProfile(userId: string): Promise<StudentProfileData | null> {
  const supabase = createClient();
  
  // Profile
  const { data: rawProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (!rawProfile) return null;
  const profile = rawProfile as unknown as Record<string, unknown>;

  // Points
  const { data: pointsData } = await supabase
    .from('point_transactions')
    .select('amount')
    .eq('user_id', userId);

  const totalPoints = (pointsData || []).reduce((sum, p) => sum + Number(p.amount || 0), 0);

  // Submissions
  const { count: totalSubmissions } = await supabase
    .from('assignment_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  // Certificates
  const { count: totalCertificates } = await supabase
    .from('student_certificates')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'approved');

  // Awards
  const { count: totalAwards } = await supabase
    .from('student_awards')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  // Completed Lessons
  const { count: totalLessons } = await supabase
    .from('views')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('action', 'complete');

  return {
    id: profile.id as string,
    fullName: (profile.full_name as string) || 'นักเรียนยอดเยี่ยม',
    nickname: (profile.nickname as string) || null,
    avatarUrl: (profile.avatar_url as string) || null,
    gradeLevel: (profile.grade_level as string) || 'ประถมศึกษาปีที่ 6',
    classroom: (profile.classroom as string) || 'ห้อง 1',
    studentNumber: (profile.student_number as string) || '1',
    schoolName: (profile.school_name as string) || 'โรงเรียนวัดบางโฉลงใน',
    bio: (profile.bio as string) || null,
    totalPoints: totalPoints || 0,
    totalLessonsCompleted: totalLessons || 0,
    totalSubmissions: totalSubmissions || 0,
    totalCertificates: totalCertificates || 0,
    totalAwards: totalAwards || 0,
  };
}

// 2. Update Student Profile
export async function updateStudentProfile(userId: string, data: {
  fullName?: string;
  nickname?: string;
  avatarUrl?: string;
  gradeLevel?: string;
  classroom?: string;
  studentNumber?: string;
  schoolName?: string;
  bio?: string;
}) {
  const supabase = createClient();
  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: data.fullName,
      avatar_url: data.avatarUrl,
      grade_level: data.gradeLevel,
      classroom: data.classroom,
      student_number: data.studentNumber,
      school_name: data.schoolName,
      nickname: data.nickname,
      bio: data.bio,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}

// 3. Point Transactions & Ledger
export async function getPointBalanceAndHistory(userId: string): Promise<{
  totalPoints: number;
  learningPoints: number;
  bonusPoints: number;
  transactions: PointTransactionItem[];
}> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('point_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error || !data) {
    return { totalPoints: 0, learningPoints: 0, bonusPoints: 0, transactions: [] };
  }

  let learningPoints = 0;
  let bonusPoints = 0;

  const transactions: PointTransactionItem[] = data.map((t) => {
    const amt = Number(t.amount || 0);
    if (t.point_type === 'learning' || t.point_type === 'assignment' || t.point_type === 'quiz') {
      learningPoints += amt;
    } else {
      bonusPoints += amt;
    }

    return {
      id: t.id,
      amount: amt,
      pointType: t.point_type as PointTransactionItem['pointType'],
      description: t.description,
      createdAt: t.created_at,
    };
  });

  return {
    totalPoints: learningPoints + bonusPoints,
    learningPoints,
    bonusPoints,
    transactions,
  };
}

// 4. Award Points (System / Admin)
export async function awardPoints(params: {
  userId: string;
  amount: number;
  pointType: 'learning' | 'bonus' | 'assignment' | 'quiz' | 'competition' | 'award' | 'adjustment';
  sourceId?: string;
  description: string;
  createdBy?: string;
}) {
  const supabase = createClient();
  const { error } = await supabase
    .from('point_transactions')
    .insert({
      user_id: params.userId,
      amount: params.amount,
      point_type: params.pointType,
      source_id: params.sourceId || null,
      description: params.description,
      created_by: params.createdBy || null,
    });

  return { success: !error, error: error?.message };
}

// 5. Portfolio Items
export async function getStudentPortfolio(userId: string): Promise<PortfolioItem[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('assignment_submissions')
    .select('*, lessons(title), classrooms(title)')
    .eq('user_id', userId)
    .order('submitted_at', { ascending: false });

  if (!data) return [];

  return data.map((sub: Record<string, unknown>) => ({
    id: sub.id as string,
    title: (sub.notes as string) || 'ผลงานประจำบทเรียน',
    lessonTitle: (sub.lessons as { title?: string })?.title || 'บทเรียนออนไลน์',
    classroomTitle: (sub.classrooms as { title?: string })?.title || 'ห้องเรียนครูคิง',
    submissionType: (sub.submission_type as string) || 'link',
    contentUrl: (sub.content_url as string) || null,
    notes: (sub.notes as string) || null,
    score: sub.score !== null && sub.score !== undefined ? Number(sub.score) : null,
    maxScore: Number(sub.max_score || 20),
    status: (sub.status as PortfolioItem['status']) || 'pending',
    teacherFeedback: (sub.teacher_feedback as string) || null,
    isInPortfolio: sub.is_in_portfolio !== false,
    submittedAt: sub.submitted_at as string,
  }));
}

export async function toggleSubmissionPortfolio(submissionId: string, isInPortfolio: boolean) {
  const supabase = createClient();
  const { error } = await supabase
    .from('assignment_submissions')
    .update({ is_in_portfolio: isInPortfolio })
    .eq('id', submissionId);

  return { success: !error, error: error?.message };
}

// 6. Learning History Records
export async function getStudentLearningHistory(userId: string): Promise<LearningHistoryRecord[]> {
  const supabase = createClient();
  const history: LearningHistoryRecord[] = [];

  // Lessons completed
  const { data: views } = await supabase
    .from('views')
    .select('created_at, lessons(title)')
    .eq('user_id', userId)
    .eq('action', 'complete')
    .order('created_at', { ascending: false });

  (views || []).forEach((v: Record<string, unknown>, idx: number) => {
    history.push({
      id: `lesson-${idx}`,
      date: (v.created_at as string) || new Date().toISOString(),
      title: (v.lessons as { title?: string })?.title || 'บทเรียนออนไลน์',
      category: 'บทเรียน',
      statusText: 'เรียนจบแล้ว ✅',
      statusType: 'success',
    });
  });

  // Assignments
  const { data: subs } = await supabase
    .from('assignment_submissions')
    .select('id, submitted_at, notes, score, max_score, status, lessons(title)')
    .eq('user_id', userId)
    .order('submitted_at', { ascending: false });

  (subs || []).forEach((s: Record<string, unknown>) => {
    const isGraded = s.status === 'graded' || s.status === 'passed';
    history.push({
      id: s.id as string,
      date: s.submitted_at as string,
      title: (s.lessons as { title?: string })?.title || 'การบ้านประจำบทเรียน',
      category: 'การบ้าน',
      scoreDisplay: isGraded ? `${s.score}/${s.max_score}` : 'รอตรวจ',
      statusText: isGraded ? 'ผ่านการประเมิน 🟢' : s.status === 'needs_revision' ? 'ให้แก้ไข 🔴' : 'รอตรวจ 🟡',
      statusType: isGraded ? 'success' : s.status === 'needs_revision' ? 'warning' : 'info',
    });
  });

  // Sort descending by date
  return history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// 7. Student Certificates
export async function getStudentCertificates(userId: string): Promise<StudentCertificateItem[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('student_certificates')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (!data) return [];

  return data.map((c) => ({
    id: c.id,
    title: c.title,
    studentName: c.student_name,
    issuer: c.issuer,
    issueDate: c.issue_date,
    imageUrl: c.image_url,
    competitionLevel: c.competition_level,
    awardTier: c.award_tier,
    status: c.status,
    rejectReason: c.reject_reason,
    approvedAt: c.approved_at,
  }));
}

export async function submitStudentCertificate(params: {
  userId: string;
  studentName: string;
  title: string;
  issuer: string;
  issueDate: string;
  imageUrl?: string;
  competitionLevel?: string;
  awardTier?: string;
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('student_certificates')
    .insert({
      user_id: params.userId,
      student_name: params.studentName,
      title: params.title,
      issuer: params.issuer || 'โรงเรียนวัดบางโฉลงใน',
      issue_date: params.issueDate || new Date().toISOString().split('T')[0],
      image_url: params.imageUrl || null,
      competition_level: params.competitionLevel || 'ระดับสถานศึกษา',
      award_tier: params.awardTier || 'เหรียญทอง',
      status: 'pending',
    })
    .select()
    .single();

  return { success: !error, certificate: data, error: error?.message };
}

// 8. Admin Certificate Approval
export async function getPendingCertificates(): Promise<StudentCertificateItem[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('student_certificates')
    .select('*')
    .order('created_at', { ascending: false });

  if (!data) return [];
  return data.map((c) => ({
    id: c.id,
    title: c.title,
    studentName: c.student_name,
    issuer: c.issuer,
    issueDate: c.issue_date,
    imageUrl: c.image_url,
    competitionLevel: c.competition_level,
    awardTier: c.award_tier,
    status: c.status,
    rejectReason: c.reject_reason,
    approvedAt: c.approved_at,
  }));
}

export async function reviewCertificate(certificateId: string, status: 'approved' | 'rejected', rejectReason?: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from('student_certificates')
    .update({
      status,
      reject_reason: rejectReason || null,
      approved_at: status === 'approved' ? new Date().toISOString() : null,
    })
    .eq('id', certificateId);

  return { success: !error, error: error?.message };
}

// 9. Student Awards
export async function getStudentAwards(userId: string): Promise<StudentAwardItem[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('student_awards')
    .select('*')
    .eq('user_id', userId)
    .order('issue_date', { ascending: false });

  if (!data) return [];
  return data.map((a) => ({
    id: a.id,
    studentName: a.student_name,
    awardName: a.award_name,
    awardType: a.award_type,
    description: a.description,
    badgeIcon: a.badge_icon || '🏆',
    issueDate: a.issue_date,
  }));
}

export async function createStudentAward(params: {
  userId: string;
  studentName: string;
  awardName: string;
  awardType: 'winner' | 'runner_up' | 'outstanding' | 'top_score' | 'consistent' | 'gold' | 'silver' | 'bronze';
  description?: string;
  badgeIcon?: string;
}) {
  const supabase = createClient();
  const { error } = await supabase
    .from('student_awards')
    .insert({
      user_id: params.userId,
      student_name: params.studentName,
      award_name: params.awardName,
      award_type: params.awardType,
      description: params.description || null,
      badge_icon: params.badgeIcon || '🏆',
    });

  return { success: !error, error: error?.message };
}

// 10. Multi-Level Ranking Generator
export async function getRankingList(filter?: {
  schoolName?: string;
  gradeLevel?: string;
  classroom?: string;
}): Promise<RankingEntry[]> {
  const supabase = createClient();
  
  let query = supabase.from('profiles').select('*').eq('role', 'student');
  if (filter?.schoolName && filter.schoolName !== 'ALL') query = query.eq('school_name', filter.schoolName);
  if (filter?.gradeLevel && filter.gradeLevel !== 'ALL') query = query.eq('grade_level', filter.gradeLevel);
  if (filter?.classroom && filter.classroom !== 'ALL') query = query.eq('classroom', filter.classroom);

  const { data: rawStudents } = await query;
  if (!rawStudents || rawStudents.length === 0) return [];

  const students = rawStudents as unknown as Array<Record<string, unknown>>;

  // Get point totals for these students
  const { data: pointTxs } = await supabase.from('point_transactions').select('user_id, amount');
  const pointsMap: Record<string, number> = {};
  (pointTxs || []).forEach((p) => {
    pointsMap[p.user_id] = (pointsMap[p.user_id] || 0) + Number(p.amount || 0);
  });

  const rankings: RankingEntry[] = students.map((s) => ({
    rank: 1,
    userId: s.id as string,
    name: (s.full_name as string) || 'นักเรียน',
    avatarUrl: (s.avatar_url as string) || undefined,
    schoolName: (s.school_name as string) || 'โรงเรียนวัดบางโฉลงใน',
    gradeLevel: (s.grade_level as string) || 'ประถมศึกษาปีที่ 6',
    classroom: (s.classroom as string) || 'ห้อง 1',
    points: pointsMap[s.id as string] || 100,
    badgesCount: 3,
    submissionsCount: 4,
  }));

  // Sort descending by points
  rankings.sort((a, b) => b.points - a.points);
  rankings.forEach((r, idx) => {
    r.rank = idx + 1;
  });

  return rankings;
}

// 11. Outstanding Students Getter
export async function getOutstandingStudents(): Promise<RankingEntry[]> {
  const allRankings = await getRankingList();
  return allRankings.slice(0, 6); // Top 6 outstanding students
}

// 12. Module Settings
export interface StudentModuleSettings {
  showRanking: boolean;
  showOutstandingStudents: boolean;
  showPoints: boolean;
  showPortfolio: boolean;
  showSchoolName: boolean;
}

export async function getStudentModuleSettings(): Promise<StudentModuleSettings> {
  const supabase = createClient();
  const { data } = await supabase
    .from('module_settings')
    .select('value')
    .eq('key', 'student_learning_settings')
    .single();

  const defaultSettings: StudentModuleSettings = {
    showRanking: true,
    showOutstandingStudents: true,
    showPoints: true,
    showPortfolio: true,
    showSchoolName: true,
  };

  if (!data || !data.value) return defaultSettings;
  return { ...defaultSettings, ...(data.value as Partial<StudentModuleSettings>) };
}

export async function updateStudentModuleSettings(settings: Partial<StudentModuleSettings>) {
  const supabase = createClient();
  const current = await getStudentModuleSettings();
  const updated = { ...current, ...settings };

  const { error } = await supabase
    .from('module_settings')
    .upsert({
      key: 'student_learning_settings',
      value: updated,
      updated_at: new Date().toISOString(),
    });

  return { success: !error, error: error?.message };
}
