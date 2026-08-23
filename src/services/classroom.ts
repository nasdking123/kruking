import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

export type ClassroomRow = Database['public']['Tables']['classrooms']['Row'];
export type LessonRow = Database['public']['Tables']['lessons']['Row'];

export interface ClassroomWithLessons extends ClassroomRow {
  lessons?: LessonRow[];
}

export const INITIAL_CLASSROOMS: ClassroomWithLessons[] = [
  {
    id: 'cls-1',
    title: 'ห้องเรียนวิทยาการคำนวณ ป.4: เริ่มต้นคิดอย่างเป็นระบบและการเขียนโปรแกรม',
    slug: 'cs-grade-4-active-coding',
    description: 'หลักสูตรการเรียนรู้วิทยาการคำนวณชั้น ป.4 เน้นการคิดเชิงคำนวณ การแก้ปัญหา และการสร้างเกมด้วย Scratch',
    cover_image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop',
    grade_level: 'ประถมศึกษาปีที่ 4',
    subject: 'วิทยาการคำนวณ',
    teacher_id: null,
    status: 'active',
    visibility: 'public',
    join_code: 'CS401',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    lessons: [
      {
        id: 'lsn-101',
        classroom_id: 'cls-1',
        title: 'บทที่ 1: ตะลุย 4 เสาหลักการคิดเชิงคำนวณ',
        description: 'ทำความเข้าใจ Decomposition, Pattern Recognition, Abstraction และ Algorithm ผ่านสถานการณ์จริง',
        content: `
# ยินดีต้อนรับสู่บทที่ 1: 4 เสาหลักการคิดเชิงคำนวณ

ในบทเรียนนี้ นักเรียนจะได้เรียนรู้ว่า **การคิดเชิงคำนวณ (Computational Thinking)** คืออะไร และทำไมจึงเป็นทักษะสำคัญสำหรับยุคดิจิทัล

## วัตถุประสงค์การเรียนรู้
1. อธิบายความหมายของ 4 เสาหลักการคิดเชิงคำนวณได้
2. ยกตัวอย่างการแก้ปัญหาในชีวิตประจำวันด้วยการคิดเชิงคำนวณได้

## ภารกิจประจำบทเรียน
- รับชมวิดีโอด้านบนและบันทึกสรุปความรู้ลงในสมุด
- ดาวน์โหลดใบงานที่ 1.1 ด้านล่างและทำแบบฝึกหัดให้เรียบร้อย
        `,
        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration_minutes: 25,
        sort_order: 1,
        is_published: true,
        resources: [
          { name: 'ใบงานที่ 1.1 การคิดเชิงคำนวณ.pdf', url: '/files/ws-1-1.pdf' },
          { name: 'สไลด์ประกอบการสอน บทที่ 1.pdf', url: '/files/slide-ch1.pdf' },
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'lsn-102',
        classroom_id: 'cls-1',
        title: 'บทที่ 2: ผจญภัยเขียนโค้ดบล็อกแรกด้วย Scratch',
        description: 'ทำความรู้จักหน้าต่างโปรแกรม Scratch ตัวละคร ฉากหลัง และการสั่งให้ตัวละครเคลื่อนที่',
        content: `
# บทที่ 2: เริ่มต้นเขียนโปรแกรมด้วย Scratch

Scratch คือเครื่องมือเขียนโปรแกรมแบบบล็อกคำสั่ง (Block-based Programming) ที่พัฒนาโดย MIT

## หัวข้อที่เรียนรู้
- ส่วนประกอบของโปรแกรม Scratch
- การเปลี่ยนตัวละคร (Sprite) และฉากหลัง (Backdrop)
- กลุ่มบล็อก Motion และ Looks
        `,
        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration_minutes: 30,
        sort_order: 2,
        is_published: true,
        resources: [
          { name: 'ใบงานที่ 1.2 แนะนำ Scratch.pdf', url: '/files/ws-1-2.pdf' },
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'lsn-103',
        classroom_id: 'cls-1',
        title: 'บทที่ 3: เงื่อนไขและการตัดสินใจ (If-Else) ใน Scratch',
        description: 'เรียนรู้การใช้บล็อก If...Then และการตรวจจับเซนเซอร์การชนของตัวละครเพื่อสร้างเกม',
        content: `
# บทที่ 3: การทำงานแบบมีเงื่อนไข

การตัดสินใจในชีวิตประจำวัน เช่น *ถ้าฝนตก ฉันจะพกร่ม* ในภาษาคอมพิวเตอร์เราเรียกว่า **Condition**
        `,
        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration_minutes: 35,
        sort_order: 3,
        is_published: true,
        resources: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
  },
  {
    id: 'cls-2',
    title: 'ห้องเรียน Coding & Micro:bit ป.5 - ป.6: นักประดิษฐ์สมองกล',
    slug: 'coding-microbit-inventor-p5-p6',
    description: 'เรียนรู้การเขียนโปรแกรมควบคุมบอร์ด Micro:bit การต่อเซนเซอร์ และการสร้างสิ่งประดิษฐ์อัจฉริยะ',
    cover_image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop',
    grade_level: 'ประถมศึกษาปีที่ 5 - 6',
    subject: 'วิทยาการคำนวณและ STEM',
    teacher_id: null,
    status: 'active',
    visibility: 'public',
    join_code: 'MB502',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    lessons: [
      {
        id: 'lsn-201',
        classroom_id: 'cls-2',
        title: 'บทที่ 1: รู้จักบอร์ด Micro:bit และ MakeCode Editor',
        description: 'สำรวจเซนเซอร์บนบอร์ด จอ LED 5x5 และปุ่มกด A/B',
        content: '# บอร์ด Micro:bit และการเขียนโปรแกรม MakeCode',
        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration_minutes: 30,
        sort_order: 1,
        is_published: true,
        resources: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
  },
];

export async function getClassrooms(): Promise<ClassroomWithLessons[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('classrooms')
      .select('*')
      .eq('status', 'active')
      .eq('visibility', 'public')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return INITIAL_CLASSROOMS;
    }
    return data as unknown as ClassroomWithLessons[];
  } catch {
    return INITIAL_CLASSROOMS;
  }
}

export async function getClassroomBySlug(slug: string): Promise<ClassroomWithLessons | null> {
  const all = await getClassrooms();
  return all.find((c) => c.slug === slug) || null;
}

export async function getClassroomByJoinCode(code: string): Promise<ClassroomWithLessons | null> {
  const all = await getClassrooms();
  return all.find((c) => c.join_code?.toUpperCase() === code.trim().toUpperCase()) || null;
}

export async function getLessonById(classroomId: string, lessonId: string): Promise<LessonRow | null> {
  const classroom = await getClassroomBySlug(classroomId) || INITIAL_CLASSROOMS.find((c) => c.id === classroomId);
  return classroom?.lessons?.find((l) => l.id === lessonId) || null;
}
