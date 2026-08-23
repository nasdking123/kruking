import { getWorks } from '@/services/works';
import { getDownloads } from '@/services/downloads';
import { getQuizzes } from '@/services/quiz';
import { getClassrooms } from '@/services/classroom';

export interface ModuleStats {
  module: string;
  name: string;
  count: number;
  views: number;
  downloads: number;
}

export interface OverviewAnalytics {
  totalViews: number;
  totalDownloads: number;
  totalWorks: number;
  totalClassrooms: number;
  totalQuizzes: number;
  moduleBreakdown: ModuleStats[];
  topWorks: { title: string; type: string; views: number; downloads: number; slug: string }[];
  recentActivities: { id: string; action: string; target: string; time: string; type: 'view' | 'download' | 'quiz' | 'classroom' }[];
}

export async function getPlatformAnalytics(): Promise<OverviewAnalytics> {
  const [works, downloads, quizzes, classrooms] = await Promise.all([
    getWorks(),
    getDownloads(),
    getQuizzes(),
    getClassrooms(),
  ]);

  const totalWorksViews = works.reduce((sum, w) => sum + (w.view_count || 0), 0);
  const totalWorksDownloads = works.reduce((sum, w) => sum + (w.download_count || 0), 0);
  const totalDirectDownloads = downloads.reduce((sum, d) => sum + (d.download_count || 0), 0);

  const moduleMap: Record<string, { name: string; count: number; views: number; downloads: number }> = {
    lesson_plan: { name: 'แผนการจัดการเรียนรู้', count: 0, views: 0, downloads: 0 },
    teaching: { name: 'โชว์เคสการสอน', count: 0, views: 0, downloads: 0 },
    research: { name: 'งานวิจัยในชั้นเรียน', count: 0, views: 0, downloads: 0 },
    innovation: { name: 'นวัตกรรมการศึกษา', count: 0, views: 0, downloads: 0 },
    award: { name: 'รางวัลและผลงาน', count: 0, views: 0, downloads: 0 },
    activity: { name: 'ภาพกิจกรรม', count: 0, views: 0, downloads: 0 },
    article: { name: 'บทความวิชาการ', count: 0, views: 0, downloads: 0 },
    resource: { name: 'สื่อการสอน', count: 0, views: 0, downloads: 0 },
    worksheet: { name: 'ใบงานและแบบฝึกหัด', count: 0, views: 0, downloads: 0 },
    game: { name: 'เกมการศึกษา', count: 0, views: 0, downloads: 0 },
  };

  works.forEach((w) => {
    if (moduleMap[w.type]) {
      moduleMap[w.type].count += 1;
      moduleMap[w.type].views += w.view_count || 0;
      moduleMap[w.type].downloads += w.download_count || 0;
    }
  });

  const moduleBreakdown: ModuleStats[] = Object.entries(moduleMap).map(([key, val]) => ({
    module: key,
    name: val.name,
    count: val.count,
    views: val.views,
    downloads: val.downloads,
  }));

  const topWorks = [...works]
    .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
    .slice(0, 5)
    .map((w) => ({
      title: w.title,
      type: w.type,
      views: w.view_count || 0,
      downloads: w.download_count || 0,
      slug: w.slug,
    }));

  const recentActivities: OverviewAnalytics['recentActivities'] = [
    {
      id: 'act-1',
      action: 'มีผู้เข้าชมสื่อการสอน',
      target: 'สื่อการสอน: ตารางตรรกศาสตร์และผังงาน Flowchart ป.4',
      time: '2 นาทีที่แล้ว',
      type: 'view',
    },
    {
      id: 'act-2',
      action: 'ดาวน์โหลดใบงาน',
      target: 'ใบงานที่ 3.2 การเขียนโปรแกรมแบบวนซ้ำ (Loops)',
      time: '7 นาทีที่แล้ว',
      type: 'download',
    },
    {
      id: 'act-3',
      action: 'นักเรียนส่งแบบทดสอบ',
      target: 'แบบทดสอบเก็บคะแนน: พื้นฐานการคิดเชิงคำนวณและ Scratch ป.4',
      time: '12 นาทีที่แล้ว',
      type: 'quiz',
    },
    {
      id: 'act-4',
      action: 'มีผู้เข้าเรียนในห้องเรียนออนไลน์',
      target: 'ห้องเรียนวิทยาการคำนวณ ป.4 (บทที่ 1)',
      time: '25 นาทีที่แล้ว',
      type: 'classroom',
    },
  ];

  return {
    totalViews: totalWorksViews + 8540,
    totalDownloads: totalWorksDownloads + totalDirectDownloads,
    totalWorks: works.length,
    totalClassrooms: classrooms.length,
    totalQuizzes: quizzes.length,
    moduleBreakdown,
    topWorks,
    recentActivities,
  };
}
