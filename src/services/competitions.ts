import { createClient } from '@/lib/supabase/client';
import { awardPoints } from './student-learning';

export interface CompetitionItem {
  id: string;
  title: string;
  description: string | null;
  subject: string;
  gradeLevel: string | null;
  pointsReward: number;
  status: 'draft' | 'active' | 'completed';
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  resultsCount?: number;
}

export interface CompetitionResultItem {
  id: string;
  competitionId: string;
  userId: string;
  studentName: string;
  studentSchool?: string;
  studentGrade?: string;
  rank: number;
  score: number;
  notes: string | null;
  createdAt: string;
}

// 1. Get Competitions
export async function getCompetitions(): Promise<CompetitionItem[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('competitions')
    .select('*')
    .order('created_at', { ascending: false });

  if (!data) return [];
  return data.map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    subject: c.subject,
    gradeLevel: c.grade_level,
    pointsReward: Number(c.points_reward || 50),
    status: c.status,
    startDate: c.start_date,
    endDate: c.end_date,
    createdAt: c.created_at,
  }));
}

// 2. Get Competition Detail with Results
export async function getCompetitionDetail(competitionId: string): Promise<{
  competition: CompetitionItem | null;
  results: CompetitionResultItem[];
}> {
  const supabase = createClient();
  const { data: comp } = await supabase
    .from('competitions')
    .select('*')
    .eq('id', competitionId)
    .single();

  if (!comp) return { competition: null, results: [] };

  const { data: results } = await supabase
    .from('competition_results')
    .select('*')
    .eq('competition_id', competitionId)
    .order('rank', { ascending: true });

  // Get student names
  const userIds = (results || []).map((r) => r.user_id);
  const { data: rawProfiles } = await supabase
    .from('profiles')
    .select('id, full_name, school_name, grade_level')
    .in('id', userIds);

  const profiles = (rawProfiles || []) as unknown as Array<Record<string, unknown>>;
  const profileMap: Record<string, { name: string; school: string; grade: string }> = {};
  profiles.forEach((p) => {
    profileMap[p.id as string] = {
      name: (p.full_name as string) || 'นักเรียน',
      school: (p.school_name as string) || 'โรงเรียนวัดบางโฉลงใน',
      grade: (p.grade_level as string) || 'ประถมศึกษาปีที่ 6',
    };
  });

  const parsedResults: CompetitionResultItem[] = (results || []).map((r) => ({
    id: r.id,
    competitionId: r.competition_id,
    userId: r.user_id,
    studentName: profileMap[r.user_id]?.name || 'นักเรียน',
    studentSchool: profileMap[r.user_id]?.school || 'โรงเรียนวัดบางโฉลงใน',
    studentGrade: profileMap[r.user_id]?.grade || 'ประถมศึกษาปีที่ 6',
    rank: r.rank,
    score: Number(r.score || 0),
    notes: r.notes,
    createdAt: r.created_at,
  }));

  return {
    competition: {
      id: comp.id,
      title: comp.title,
      description: comp.description,
      subject: comp.subject,
      gradeLevel: comp.grade_level,
      pointsReward: Number(comp.points_reward || 50),
      status: comp.status,
      startDate: comp.start_date,
      endDate: comp.end_date,
      createdAt: comp.created_at,
    },
    results: parsedResults,
  };
}

// 3. Create Competition
export async function createCompetition(params: {
  title: string;
  description?: string;
  subject: string;
  gradeLevel?: string;
  pointsReward?: number;
  startDate?: string;
  endDate?: string;
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('competitions')
    .insert({
      title: params.title,
      description: params.description || null,
      subject: params.subject,
      grade_level: params.gradeLevel || 'ประถมศึกษาปีที่ 6',
      points_reward: params.pointsReward || 50,
      status: 'active',
      start_date: params.startDate || new Date().toISOString(),
      end_date: params.endDate || null,
    })
    .select()
    .single();

  return { success: !error, competition: data, error: error?.message };
}

// 4. Record Result & Award Bonus Points
export async function recordCompetitionResult(params: {
  competitionId: string;
  userId: string;
  rank: number;
  score: number;
  notes?: string;
  pointsReward: number;
  competitionTitle: string;
}) {
  const supabase = createClient();
  const { error } = await supabase
    .from('competition_results')
    .upsert({
      competition_id: params.competitionId,
      user_id: params.userId,
      rank: params.rank,
      score: params.score,
      notes: params.notes || null,
    });

  if (error) {
    return { success: false, error: error.message };
  }

  // Award competition bonus points
  if (params.pointsReward > 0) {
    await awardPoints({
      userId: params.userId,
      amount: params.pointsReward,
      pointType: 'competition',
      sourceId: params.competitionId,
      description: `รางวัลอันดับที่ ${params.rank} การแข่งขัน "${params.competitionTitle}" (+${params.pointsReward} คะแนน)`,
    });
  }

  return { success: true };
}
