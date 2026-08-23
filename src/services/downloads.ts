import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

export type DownloadRow = Database['public']['Tables']['downloads']['Row'];

export const INITIAL_DOWNLOADS: DownloadRow[] = [
  {
    id: 'dl-1',
    title: 'ชุดเทมเพลตแผนการจัดการเรียนรู้ Active Learning 5E (.docx)',
    slug: 'active-learning-5e-lesson-plan-template-docx',
    description: 'เทมเพลตแผนการสอนตามมาตรฐาน ว 4.2 พร้อมโครงสร้างหัวข้อ จุดประสงค์การเรียนรู้ ขั้นตอน 5E และแบบประเมิน Rubrics สมบูรณ์แบบ',
    file_path: '/files/templates/template-5e-lesson-plan.docx',
    file_url: 'https://raw.githubusercontent.com/kruking/assets/main/template-5e-lesson-plan.docx',
    preview_url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800&auto=format&fit=crop',
    file_size: 2450000, // 2.45 MB
    file_type: 'docx',
    category_id: 'templates',
    grade_level: 'ทุกระดับชั้น',
    subject: 'วิทยาการคำนวณ',
    year: '2568',
    download_count: 1420,
    visibility: 'public',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'dl-2',
    title: 'ชุดสไลด์บรรยาย AI for Teachers: นำ Generative AI มาช่วยสอน (.pptx)',
    slug: 'ai-for-teachers-presentation-slides-pptx',
    description: 'สไลด์นำเสนอ 45 หน้า ออกแบบสวยงามพร้อม Prompt ตัวอย่างสำหรับครูผู้สอนเพื่อสร้างสื่อและแบบฝึกหัด',
    file_path: '/files/slides/ai-for-teachers-slides.pptx',
    file_url: 'https://raw.githubusercontent.com/kruking/assets/main/ai-for-teachers-slides.pptx',
    preview_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    file_size: 18500000, // 18.5 MB
    file_type: 'pptx',
    category_id: 'slides',
    grade_level: 'ระดับประถมศึกษาและมัธยมศึกษา',
    subject: 'เทคโนโลยีและ AI',
    year: '2568',
    download_count: 3280,
    visibility: 'public',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'dl-3',
    title: 'แบบประเมินผลสัมฤทธิ์ทางการเรียนและเกณฑ์รูบริกส์ (Rubric Score) Excel (.xlsx)',
    slug: 'rubric-assessment-grade-calculator-xlsx',
    description: 'ไฟล์ Excel คำนวณเกรดและตัดเกรดอัตโนมัติตามตัวชี้วัด พร้อมกราฟสรุปสถิติคะแนนห้องเรียน',
    file_path: '/files/assessment/grade-rubric-calculator.xlsx',
    file_url: 'https://raw.githubusercontent.com/kruking/assets/main/grade-rubric-calculator.xlsx',
    preview_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    file_size: 850000, // 850 KB
    file_type: 'xlsx',
    category_id: 'assessment',
    grade_level: 'ทุกระดับชั้น',
    subject: 'การวัดและประเมินผล',
    year: '2568',
    download_count: 2150,
    visibility: 'public',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'dl-4',
    title: 'แพ็กเกจชุดการ์ด Unplugged Coding: ภารกิจพิชิตเขาวงกต (.pdf & .zip)',
    slug: 'unplugged-coding-cards-maze-challenge-zip',
    description: 'รวมไฟล์การ์ดคำสั่งและแผนที่เขาวงกตความละเอียดสูง (300 DPI) พร้อมพิมพ์และเคลือบบัตรสำหรับกิจกรรมกลุ่ม',
    file_path: '/files/kits/unplugged-coding-cards.zip',
    file_url: 'https://raw.githubusercontent.com/kruking/assets/main/unplugged-coding-cards.zip',
    preview_url: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=800&auto=format&fit=crop',
    file_size: 45200000, // 45.2 MB
    file_type: 'zip',
    category_id: 'media_kits',
    grade_level: 'ประถมศึกษาปีที่ 1 - 3',
    subject: 'วิทยาการคำนวณ',
    year: '2568',
    download_count: 4890,
    visibility: 'public',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'dl-5',
    title: 'คู่มือการประเมินวิทยฐานะ ว.PA สำหรับครูผู้สอนกลุ่มสาระวิทยาศาสตร์และเทคโนโลยี (.pdf)',
    slug: 'pa-evaluation-guide-science-technology-pdf',
    description: 'รวมแนวทางการเขียนข้อตกลง PA และการจัดทำคลิปการสอน 8 ตัวชี้วัดให้ผ่านเกณฑ์การประเมินระดับชำนาญการพิเศษ',
    file_path: '/files/docs/pa-teacher-guide.pdf',
    file_url: 'https://raw.githubusercontent.com/kruking/assets/main/pa-teacher-guide.pdf',
    preview_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop',
    file_size: 5600000, // 5.6 MB
    file_type: 'pdf',
    category_id: 'official_docs',
    grade_level: 'สำหรับครูผู้สอน',
    subject: 'การพัฒนาวิชาชีพครู',
    year: '2568',
    download_count: 5120,
    visibility: 'public',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export async function getDownloads(options?: {
  fileType?: string;
  category?: string;
  query?: string;
}): Promise<DownloadRow[]> {
  try {
    const supabase = createClient();
    let q = supabase
      .from('downloads')
      .select('*')
      .eq('visibility', 'public')
      .order('created_at', { ascending: false });

    if (options?.fileType) {
      q = q.eq('file_type', options.fileType);
    }
    if (options?.category) {
      q = q.eq('category_id', options.category);
    }

    const { data, error } = await q;

    if (error || !data || data.length === 0) {
      let filtered = [...INITIAL_DOWNLOADS];
      if (options?.fileType) {
        filtered = filtered.filter((d) => d.file_type.toLowerCase() === options.fileType?.toLowerCase());
      }
      if (options?.category) {
        filtered = filtered.filter((d) => d.category_id === options.category);
      }
      if (options?.query) {
        const needle = options.query.toLowerCase();
        filtered = filtered.filter(
          (d) => d.title.toLowerCase().includes(needle) || d.description?.toLowerCase().includes(needle)
        );
      }
      return filtered;
    }

    return data as DownloadRow[];
  } catch {
    return INITIAL_DOWNLOADS;
  }
}

export async function getDownloadBySlug(slug: string): Promise<DownloadRow | null> {
  const all = await getDownloads();
  return all.find((d) => d.slug === slug || d.id === slug) || null;
}

export async function trackDownloadCount(id: string): Promise<void> {
  try {
    const supabase = createClient();
    const { data } = await supabase.from('downloads').select('download_count').eq('id', id).single();
    if (data) {
      await supabase
        .from('downloads')
        .update({ download_count: (data.download_count || 0) + 1 })
        .eq('id', id);
    }
  } catch {
    // fallback
  }
}
