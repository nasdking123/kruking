import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

export type WorkRow = Database['public']['Tables']['works']['Row'];
export type CategoryRow = Database['public']['Tables']['categories']['Row'];
export type TagRow = Database['public']['Tables']['tags']['Row'];

export interface WorkWithRelations extends WorkRow {
  category?: CategoryRow | null;
  tags?: TagRow[];
  details?: Record<string, unknown>;
}

export const INITIAL_CATEGORIES: CategoryRow[] = [
  { id: 'cat-1', name: 'วิทยาการคำนวณ', slug: 'computational-thinking', description: 'การคิดเชิงคำนวณและการแก้ปัญหา', icon: 'Code', module_key: 'resources', parent_id: null, sort_order: 1, created_at: '', updated_at: '' },
  { id: 'cat-2', name: 'ประถมศึกษาตอนต้น (ป.1 - ป.3)', slug: 'primary-lower', description: 'สำหรับนักเรียนระดับชั้น ป.1 - ป.3', icon: 'Smile', module_key: 'worksheets', parent_id: 'cat-1', sort_order: 1, created_at: '', updated_at: '' },
  { id: 'cat-3', name: 'ประถมศึกษาตอนปลาย (ป.4 - ป.6)', slug: 'primary-upper', description: 'สำหรับนักเรียนระดับชั้น ป.4 - ป.6', icon: 'Book', module_key: 'worksheets', parent_id: 'cat-1', sort_order: 2, created_at: '', updated_at: '' },
  { id: 'cat-4', name: 'มัธยมศึกษา (ม.1 - ม.3)', slug: 'secondary', description: 'สำหรับนักเรียนระดับชั้นมัธยมศึกษา', icon: 'Laptop', module_key: 'resources', parent_id: 'cat-1', sort_order: 3, created_at: '', updated_at: '' },
  { id: 'cat-5', name: 'Unplugged Coding', slug: 'unplugged-coding', description: 'การเรียนรู้การเขียนโค้ดโดยไม่ใช้คอมพิวเตอร์', icon: 'Puzzle', module_key: 'games', parent_id: null, sort_order: 2, created_at: '', updated_at: '' },
  { id: 'cat-6', name: 'นวัตกรรมการสอน', slug: 'innovative-teaching', description: 'Active Learning และโมเดลการสอน', icon: 'Lightbulb', module_key: 'innovation', parent_id: null, sort_order: 3, created_at: '', updated_at: '' },
  { id: 'cat-7', name: 'งานวิจัยในชั้นเรียน', slug: 'classroom-research', description: 'รายงานผลการจัดการเรียนรู้', icon: 'FileSearch', module_key: 'research', parent_id: null, sort_order: 4, created_at: '', updated_at: '' },
  { id: 'cat-8', name: 'AI & เทคโนโลยีการศึกษา', slug: 'ai-edtech', description: 'AI และเครื่องมือดิจิทัลสำหรับครู', icon: 'Cpu', module_key: 'ai_teacher', parent_id: null, sort_order: 5, created_at: '', updated_at: '' },
];

export const INITIAL_TAGS: TagRow[] = [
  { id: 't-1', name: 'วิทยาการคำนวณ', slug: 'cs', created_at: '' },
  { id: 't-2', name: 'Coding', slug: 'coding', created_at: '' },
  { id: 't-3', name: 'Unplugged', slug: 'unplugged', created_at: '' },
  { id: 't-4', name: 'ใบงานฟรี', slug: 'free-worksheet', created_at: '' },
  { id: 't-5', name: 'ป.1', slug: 'grade-1', created_at: '' },
  { id: 't-6', name: 'ป.2', slug: 'grade-2', created_at: '' },
  { id: 't-7', name: 'ป.3', slug: 'grade-3', created_at: '' },
  { id: 't-8', name: 'ป.4', slug: 'grade-4', created_at: '' },
  { id: 't-9', name: 'Active Learning', slug: 'active-learning', created_at: '' },
  { id: 't-10', name: 'บอร์ดเกม', slug: 'board-game', created_at: '' },
  { id: 't-11', name: 'แผนการสอน', slug: 'lesson-plan', created_at: '' },
  { id: 't-12', name: 'วิจัยชั้นเรียน', slug: 'action-research', created_at: '' },
  { id: 't-13', name: 'รางวัลครูดีเด่น', slug: 'teacher-award', created_at: '' },
  { id: 't-14', name: 'AI การศึกษา', slug: 'ai-education', created_at: '' },
  { id: 't-15', name: 'Scratch', slug: 'scratch', created_at: '' },
];

export const INITIAL_WORKS: WorkWithRelations[] = [
  // 1. Resource
  {
    id: 'w-1',
    title: 'สื่อการสอนสไลด์: พื้นฐานการคิดเชิงคำนวณ (Computational Thinking) 4 เสาหลัก',
    slug: 'computational-thinking-basics-slides',
    description: 'ชุดสไลด์ประกอบการสอนเรื่อง 4 เสาหลักการคิดเชิงคำนวณ: การแบ่งย่อยปัญหา การหารูปแบบ การคิดเชิงนามธรรม และการออกแบบอัลกอริทึม',
    content: `
# พื้นฐานการคิดเชิงคำนวณ (Computational Thinking)

การคิดเชิงคำนวณเป็นทักษะพื้นฐานสำคัญในศตวรรษที่ 21 ประกอบด้วย 4 เสาหลักสำคัญ:

1. **Decomposition (การแบ่งย่อยปัญหา):** การแตกปัญหาใหญ่ออกเป็นปัญหาย่อยๆ ที่จัดการได้ง่าย
2. **Pattern Recognition (การหารูปแบบ):** การมองหารูปแบบหรือความคล้ายคลึงกันในปัญหา
3. **Abstraction (การคิดเชิงนามธรรม):** การมุ่งเน้นเฉพาะข้อมูลสำคัญ และตัดรายละเอียดที่ไม่จำเป็นออก
4. **Algorithm Design (การออกแบบอัลกอริทึม):** การวางขั้นตอนวิธีในการแก้ปัญหาอย่างเป็นลำดับขั้นตอน

สามารถนำสไลด์นี้ไปใช้จัดกิจกรรมในห้องเรียนชั้น ป.4 - ม.3 ได้ทันที
    `,
    type: 'resource',
    category_id: 'cat-1',
    cover_image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop',
    author_id: null,
    grade_level: 'ประถมศึกษาปีที่ 4 - 6',
    subject: 'วิทยาการคำนวณ',
    featured: true,
    visibility: 'public',
    published: true,
    published_at: new Date().toISOString(),
    view_count: 1250,
    download_count: 380,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    category: INITIAL_CATEGORIES[0],
    tags: [INITIAL_TAGS[0], INITIAL_TAGS[8]],
    details: {
      resource_type: 'slide',
      file_url: 'https://example.com/files/ct-slides.pdf',
      preview_url: 'https://example.com/files/ct-slides-preview.jpg',
      file_size: 14500000,
    },
  },

  // 2. Worksheet
  {
    id: 'w-2',
    title: 'ใบงานจับคู่ขั้นตอนการแก้ปัญหาในชีวิตประจำวัน (ป.1)',
    slug: 'worksheet-daily-problem-solving-p1',
    description: 'ใบงานเสริมทักษะการจัดลำดับขั้นตอนการแต่งตัว การแปรงฟัน และการเตรียมตัวมาโรงเรียน พร้อมเฉลยละเอียดสำหรับครู',
    content: `
# ใบงาน: ลำดับขั้นตอนในชีวิตประจำวัน

ใบงานนี้ฝึกทักษะการจัดลำดับเหตุการณ์ (Algorithm) สำหรับน้องๆ ชั้น ป.1 ให้นักเรียนเรียงลำดับขั้นตอน 1, 2, 3, 4 จากภาพการ์ตูนน่ารัก

**สิ่งที่มีในชุดไฟล์:**
- ใบงานสำหรับนักเรียน (PDF ความละเอียดสูง)
- ใบเฉลยสำหรับครูผู้สอน
- คำถามต่อยอดสำหรับจัดกิจกรรมกลุ่ม
    `,
    type: 'worksheet',
    category_id: 'cat-2',
    cover_image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop',
    author_id: null,
    grade_level: 'ประถมศึกษาปีที่ 1',
    subject: 'วิทยาการคำนวณ',
    featured: true,
    visibility: 'public',
    published: true,
    published_at: new Date().toISOString(),
    view_count: 2420,
    download_count: 890,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    category: INITIAL_CATEGORIES[1],
    tags: [INITIAL_TAGS[0], INITIAL_TAGS[3], INITIAL_TAGS[4]],
    details: {
      pdf_url: 'https://example.com/files/worksheet-p1-algorithm.pdf',
      answer_key_url: 'https://example.com/files/worksheet-p1-answers.pdf',
      file_size: 3200000,
    },
  },

  // 3. Game
  {
    id: 'w-3',
    title: 'บอร์ดเกม Unplugged: เขาวงกตโค้ดดิ้งผจญภัย (Coding Maze Quest)',
    slug: 'unplugged-coding-maze-quest-game',
    description: 'เกมกระดานเสริมสร้างตรรกะและการเขียนคำสั่งทิศทาง (เดินหน้า, เลี้ยวซ้าย, เลี้ยวขวา, วนซ้ำ) โดยไม่ต้องใช้คอมพิวเตอร์',
    content: `
# บอร์ดเกม: เขาวงกตโค้ดดิ้งผจญภัย (Coding Maze Quest)

บอร์ดเกมนี้ออกแบบสำหรับนักเรียนระดับชั้น ป.1 - ป.4 เพื่อเรียนรู้แนวคิดการเขียนโปรแกรมแบบ Unplugged

## อุปกรณ์ในกล่อง
1. กระดานตารางเขาวงกต (Grid Board)
2. การ์ดคำสั่ง (เดินหน้า, เลี้ยวซ้าย, เลี้ยวขวา, กระโดด, Loop x2)
3. การ์ดสิ่งกีดขวางและไอเทม
4. เบี้ยตัวละคร 4 สี

## วิธีการเล่น
ให้นักเรียนวางแผนเส้นทางเพื่อพาตัวละครจากจุดเริ่มต้นไปยังเป้าหมาย โดยใช้การ์ดคำสั่งให้น้อยที่สุด
    `,
    type: 'game',
    category_id: 'cat-5',
    cover_image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=800&auto=format&fit=crop',
    author_id: null,
    grade_level: 'ประถมศึกษาปีที่ 1 - 4',
    subject: 'วิทยาการคำนวณ',
    featured: true,
    visibility: 'public',
    published: true,
    published_at: new Date().toISOString(),
    view_count: 1890,
    download_count: 420,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    category: INITIAL_CATEGORIES[4],
    tags: [INITIAL_TAGS[1], INITIAL_TAGS[2], INITIAL_TAGS[9]],
    details: {
      game_type: 'unplugged',
      how_to_play: 'วางแผนคำสั่งทิศทางเพื่อนำเบี้ยเข้าสู่เส้นชัย',
      rules: 'ห้ามชนสิ่งกีดขวาง หากวางการ์ดผิดต้อง Debug ใหม่',
      equipment: 'กระดานตาราง การ์ดคำสั่ง เบี้ยตัวละคร',
      game_url: '',
    },
  },

  // 4. Lesson Plan
  {
    id: 'w-4',
    title: 'แผนการจัดการเรียนรู้ Active Learning: การเขียนโปรแกรมแบบมีเงื่อนไขด้วย Scratch',
    slug: 'lesson-plan-scratch-conditions-p4',
    description: 'แผนการสอน 2 คาบเรียนบูรณาการกิจกรรมเกมและใบงาน มาตรฐาน ว 4.2 ตัวชี้วัด ป.4/2',
    content: `
# แผนการสอน: การเขียนโปรแกรมแบบมีเงื่อนไขด้วย Scratch

- **กลุ่มสาระการเรียนรู้:** วิทยาศาสตร์และเทคโนโลยี
- **ระดับชั้น:** ประถมศึกษาปีที่ 4
- **เวลา:** 2 ชั่วโมง (100 นาที)

## มาตรฐานและตัวชี้วัด
- **มาตรฐาน ว 4.2:** เข้าใจและใช้แนวคิดเชิงคำนวณในการแก้ปัญหาที่พบในชีวิตจริงอย่างเป็นขั้นตอน
- **ตัวชี้วัด ป.4/2:** ออกแบบ และเขียนโปรแกรมอย่างง่าย โดยใช้ซอฟต์แวร์หรือสื่อ และตรวจหาข้อผิดพลาด

## กิจกรรมการเรียนรู้ (5E Model)
1. **ขั้นสร้างความสนใจ (Engagement):** เปิดคลิปตัวอย่างเกมตรวจจับสิ่งกีดขวาง
2. **ขั้นสำรวจและค้นหา (Exploration):** ให้นักเรียนทดลองลากบล็อกคำสั่ง If...Then
3. **ขั้นอธิบาย (Explanation):** อภิปรายร่วมกันเกี่ยวกับเงื่อนไขจริงและเท็จ
4. **ขั้นขยายความรู้ (Elaboration):** นักเรียนสร้างเกมเก็บไอเทมตามเงื่อนไขของตนเอง
5. **ขั้นประเมินผล (Evaluation):** ตรวจผลงานผ่านแบบประเมิน Rubric
    `,
    type: 'lesson_plan',
    category_id: 'cat-1',
    cover_image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
    author_id: null,
    grade_level: 'ประถมศึกษาปีที่ 4',
    subject: 'วิทยาการคำนวณ',
    featured: true,
    visibility: 'public',
    published: true,
    published_at: new Date().toISOString(),
    view_count: 980,
    download_count: 310,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    category: INITIAL_CATEGORIES[0],
    tags: [INITIAL_TAGS[1], INITIAL_TAGS[10], INITIAL_TAGS[14]],
    details: {
      unit: 'หน่วยที่ 3 การเขียนโปรแกรมเบื้องต้น',
      standard: 'ว 4.2',
      indicator: 'ป.4/2',
      objective: 'นักเรียนสามารถใช้บล็อกคำสั่งแบบมีเงื่อนไข (If-Then) ใน Scratch ได้ถูกต้อง',
      doc_url: 'https://example.com/files/plan-p4-scratch.docx',
      pdf_url: 'https://example.com/files/plan-p4-scratch.pdf',
    },
  },

  // 5. Innovation
  {
    id: 'w-5',
    title: 'นวัตกรรมสื่อการสอน: กล่องเกมจำลองระบบเครือข่ายอินเทอร์เน็ต (Network Box Model)',
    slug: 'innovation-network-box-model',
    description: 'นวัตกรรมการเรียนรู้เรื่อง Packet Switching และ IP Address ผ่านโมเดลกล่องส่งจดหมายจำลอง',
    content: `
# นวัตกรรมการศึกษา: Network Box Model

นวัตกรรมนี้ได้รับรางวัลเหรียญทอง การประกวดนวัตกรรมครูผู้สอนระดับเขตพื้นที่การศึกษา

## ที่มาและความสำคัญ
นักเรียนส่วนใหญ่เข้าใจยากว่าข้อมูลในอินเทอร์เน็ตเดินทางอย่างไร จึงได้สร้างโมเดลกล่องจำลองการแตก Packet และการกำหนด Header เพื่อให้เห็นภาพจริงอย่างเป็นรูปธรรม
    `,
    type: 'innovation',
    category_id: 'cat-6',
    cover_image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop',
    author_id: null,
    grade_level: 'มัธยมศึกษาปีที่ 1 - 3',
    subject: 'วิทยาการคำนวณ',
    featured: true,
    visibility: 'public',
    published: true,
    published_at: new Date().toISOString(),
    view_count: 1430,
    download_count: 220,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    category: INITIAL_CATEGORIES[5],
    tags: [INITIAL_TAGS[8], INITIAL_TAGS[12]],
    details: {
      concept: 'การจำลอง Packet Switching ผ่านการส่งต่อสิ่งของในกล่อง',
      problem: 'นักเรียนไม่เห็นภาพการทำงานเชิงนามธรรมของเครือข่าย',
      award: 'รางวัลเหรียญทอง ระดับเขตพื้นที่การศึกษา',
    },
  },

  // 6. Research
  {
    id: 'w-6',
    title: 'รายงานวิจัยในชั้นเรียน: การพัฒนาทักษะการคิดเชิงคำนวณโดยใช้บอร์ดเกม Unplugged Coding สำหรับนักเรียนชั้น ป.2',
    slug: 'research-unplugged-coding-boardgame-p2',
    description: 'งานวิจัยเชิงปฏิบัติการในชั้นเรียน (Classroom Action Research: CAR) เพื่อยกระดับผลสัมฤทธิ์ทางการคิดเชิงคำนวณ',
    content: `
# บทคัดย่อ

การวิจัยครั้งนี้มีวัตถุประสงค์เพื่อ 1) พัฒนาชุดกิจกรรมบอร์ดเกม Unplugged Coding และ 2) เปรียบเทียบทักษะการคิดเชิงคำนวณของนักเรียนชั้นประถมศึกษาปีที่ 2 ก่อนและหลังการจัดกิจกรรม

**กลุ่มเป้าหมาย:** นักเรียนชั้น ป.2 จำนวน 30 คน  
**ผลการวิจัย:** พบว่านักเรียนมีคะแนนทักษะการคิดเชิงคำนวณหลังเรียนสูงกว่าก่อนเรียนอย่างมีนัยสำคัญทางสถิติที่ระดับ .01
    `,
    type: 'research',
    category_id: 'cat-7',
    cover_image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop',
    author_id: null,
    grade_level: 'ประถมศึกษาปีที่ 2',
    subject: 'วิทยาการคำนวณ',
    featured: true,
    visibility: 'public',
    published: true,
    published_at: new Date().toISOString(),
    view_count: 1120,
    download_count: 270,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    category: INITIAL_CATEGORIES[6],
    tags: [INITIAL_TAGS[2], INITIAL_TAGS[11]],
    details: {
      abstract: 'การวิจัยเพื่อศึกษาผลของการใช้บอร์ดเกม Unplugged Coding ต่อพัฒนาการคิดเชิงคำนวณของนักเรียนชั้น ป.2',
      methodology: 'วิจัยเชิงปฏิบัติการในชั้นเรียน (Classroom Action Research: 4 วงรอบ PAOR)',
      paper_pdf_url: 'https://example.com/files/car-research-p2.pdf',
    },
  },

  // 7. Teaching Showcase
  {
    id: 'w-7',
    title: 'บันทึกการสอน Active Learning: ภารกิจกู้วิกฤตหุ่นยนต์สำรวจอวกาศด้วย Micro:bit',
    slug: 'teaching-showcase-space-robot-microbit',
    description: 'โชว์เคสการจัดกิจกรรมบูรณาการ STEM + Coding ให้นักเรียนจำลองการเขียนโค้ดสั่งการยานสำรวจดาวอังคาร',
    content: `
# Teaching Showcase: Space Robot Challenge with Micro:bit

กิจกรรมการเรียนรู้แบบบูรณาการที่เชื่อมโยงวิทยาศาสตร์ ดาราศาสตร์ และการเขียนโปรแกรม Micro:bit

## ขั้นตอนการจัดกิจกรรม
1. ภารกิจจำลอง: ดาวอังคารเกิดพายุทราย ยานสำรวจต้องหลบสิ่งกีดขวาง
2. นักเรียนแบ่งกลุ่ม 4 คน: โปรแกรมเมอร์, วิศวกรฮาร์ดแวร์, นักวางแผนเส้นทาง, และผู้นำเสนอ
3. ทดสอบและ Debug โค้ดจริงบนสนามจำลอง
    `,
    type: 'teaching',
    category_id: 'cat-1',
    cover_image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=800&auto=format&fit=crop',
    author_id: null,
    grade_level: 'ประถมศึกษาปีที่ 5 - 6',
    subject: 'วิทยาการคำนวณ',
    featured: true,
    visibility: 'public',
    published: true,
    published_at: new Date().toISOString(),
    view_count: 1540,
    download_count: 180,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    category: INITIAL_CATEGORIES[0],
    tags: [INITIAL_TAGS[1], INITIAL_TAGS[8]],
    details: {
      pedagogy: 'STEM Education & Challenge-Based Learning',
      tools: 'BBC Micro:bit, เซนเซอร์ Ultrasonic, หุ่นยนต์ Maqueen',
    },
  },

  // 8. Award
  {
    id: 'w-8',
    title: 'รางวัลครูผู้สอนดีเด่นกลุ่มสาระวิทยาศาสตร์และเทคโนโลยี ระดับเขตพื้นที่การศึกษา',
    slug: 'award-outstanding-science-tech-teacher',
    description: 'รางวัลเชิดชูเกียรติการจัดการเรียนรู้ Active Learning และการประยุกต์ใช้นวัตกรรมการศึกษา ประจำปีการศึกษา 2568',
    content: `
# รางวัลครูผู้สอนดีเด่น

ได้รับมอบเกียรติบัตรและโล่รางวัลเชิดชูเกียรติ จากสำนักงานเขตพื้นที่การศึกษาประถมศึกษา ในฐานะครูผู้สร้างสรรค์นวัตกรรมการสอนยอดเยี่ยม
    `,
    type: 'award',
    category_id: 'cat-6',
    cover_image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?q=80&w=800&auto=format&fit=crop',
    author_id: null,
    grade_level: 'ทุกระดับชั้น',
    subject: 'วิทยาศาสตร์และเทคโนโลยี',
    featured: true,
    visibility: 'public',
    published: true,
    published_at: new Date().toISOString(),
    view_count: 890,
    download_count: 45,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    category: INITIAL_CATEGORIES[5],
    tags: [INITIAL_TAGS[12]],
    details: {
      award_level: 'ระดับเขตพื้นที่การศึกษา',
      issued_by: 'สำนักงานเขตพื้นที่การศึกษาประถมศึกษา',
      year: '2568',
      certificate_url: 'https://example.com/files/cert-outstanding-teacher.jpg',
    },
  },

  // 9. Activity
  {
    id: 'w-9',
    title: 'ภาพกิจกรรม: ค่ายเยาวชนนักประดิษฐ์ Coding & AI Junior Camp 2026',
    slug: 'activity-coding-ai-junior-camp-2026',
    description: 'ประมวลภาพบรรยากาศการจัดค่ายกิจกรรมโค้ดดิ้งและ AI สำหรับน้องๆ ประถมศึกษา สนุกสนานและได้ลงมือทำจริง',
    content: `
# ประมวลภาพกิจกรรม Coding & AI Junior Camp 2026

ค่ายกิจกรรม 2 วัน 1 คืน นักเรียนได้เรียนรู้การเขียนโค้ดเบื้องต้น การสร้างโมเดล AI รู้จำภาพอย่างง่าย และการแข่งขันประลองหุ่นยนต์
    `,
    type: 'activity',
    category_id: 'cat-8',
    cover_image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800&auto=format&fit=crop',
    author_id: null,
    grade_level: 'ประถมศึกษาปีที่ 4 - 6',
    subject: 'วิทยาการคำนวณ',
    featured: true,
    visibility: 'public',
    published: true,
    published_at: new Date().toISOString(),
    view_count: 1670,
    download_count: 60,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    category: INITIAL_CATEGORIES[7],
    tags: [INITIAL_TAGS[1], INITIAL_TAGS[13]],
    details: {
      event_date: '15-16 มกราคม 2569',
      location: 'ห้องปฏิบัติการคอมพิวเตอร์และห้องประชุมโรงเรียน',
      participant_count: 60,
      photos: [
        'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop',
      ],
    },
  },

  // 10. Article
  {
    id: 'w-10',
    title: 'บทความ: 5 เทคนิคการสอนวิทยาการคำนวณให้สนุกและเข้าใจง่าย โดยไม่ต้องมีคอมพิวเตอร์ครบเครื่อง',
    slug: 'article-5-tips-teaching-unplugged-computing',
    description: 'แชร์แนวคิดและเทคนิคการจัดการเรียนรู้แบบ Unplugged และการใช้สถานการณ์ปัญหาในชีวิตจริงช่วยสอน',
    content: `
# 5 เทคนิคการสอนวิทยาการคำนวณให้สนุกและเข้าใจง่าย

การสอนวิทยาการคำนวณไม่จำเป็นต้องพึ่งพาห้องคอมพิวเตอร์ราคาแพงเสมอไป นี่คือ 5 เทคนิคที่นำไปใช้ได้จริง:

1. **ใช้สถานการณ์ใกล้ตัว:** เชื่อมโยงอัลกอริทึมกับการชงโอวัลติน หรือการผูกเชือกรองเท้า
2. **เปลี่ยนบทบาทเป็นเกม:** ให้นักเรียนสวมบทบาทเป็นหุ่นยนต์และโปรแกรมเมอร์
3. **สร้างความผิดพลาดเป็นเรื่องปกติ (Debugging Mindset):** สอนให้เด็กๆ มองว่า Error คือโอกาสในการเรียนรู้
4. **ใช้สื่อการเรียนรู้แบบสัมผัสได้ (Tactile Media):** บอร์ดเกม บัตรภาพ ลูกเต๋า
5. **สรุปด้วยคำถามสะท้อนคิด (Reflection):** ชวนคิดว่าเรานำวิธีคิดนี้ไปใช้อะไรได้อีกในชีวิตประจำวัน
    `,
    type: 'article',
    category_id: 'cat-1',
    cover_image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800&auto=format&fit=crop',
    author_id: null,
    grade_level: 'คุณครูและผู้ปกครอง',
    subject: 'เทคนิคการสอน',
    featured: true,
    visibility: 'public',
    published: true,
    published_at: new Date().toISOString(),
    view_count: 3120,
    download_count: 510,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    category: INITIAL_CATEGORIES[0],
    tags: [INITIAL_TAGS[0], INITIAL_TAGS[2], INITIAL_TAGS[8]],
    details: {
      reading_time_mins: 4,
      author_role: 'ครูผู้สอนและวิทยากรอบรม',
    },
  },
];

export async function getWorks(options?: {
  type?: string;
  categorySlug?: string;
  gradeLevel?: string;
  search?: string;
  limit?: number;
  featuredOnly?: boolean;
}): Promise<WorkWithRelations[]> {
  try {
    const supabase = createClient();
    let query = supabase
      .from('works')
      .select('*')
      .eq('published', true)
      .eq('visibility', 'public')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (options?.type) {
      query = query.eq('type', options.type);
    }
    if (options?.featuredOnly) {
      query = query.eq('featured', true);
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      let filtered = [...INITIAL_WORKS];
      if (options?.type) {
        filtered = filtered.filter((w) => w.type === options.type);
      }
      if (options?.categorySlug) {
        filtered = filtered.filter((w) => w.category?.slug === options.categorySlug);
      }
      if (options?.gradeLevel) {
        filtered = filtered.filter((w) => w.grade_level?.includes(options.gradeLevel || ''));
      }
      if (options?.featuredOnly) {
        filtered = filtered.filter((w) => w.featured);
      }
      if (options?.search) {
        const q = options.search.toLowerCase();
        filtered = filtered.filter(
          (w) =>
            w.title.toLowerCase().includes(q) ||
            (w.description && w.description.toLowerCase().includes(q)) ||
            (w.subject && w.subject.toLowerCase().includes(q))
        );
      }
      if (options?.limit) {
        filtered = filtered.slice(0, options.limit);
      }
      return filtered;
    }

    return data as unknown as WorkWithRelations[];
  } catch {
    return INITIAL_WORKS;
  }
}

export async function getWorkBySlug(slug: string): Promise<WorkWithRelations | null> {
  const works = await getWorks();
  return works.find((w) => w.slug === slug) || null;
}

export async function getCategories(): Promise<CategoryRow[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return INITIAL_CATEGORIES;
    }
    return data as CategoryRow[];
  } catch {
    return INITIAL_CATEGORIES;
  }
}

export async function getTags(): Promise<TagRow[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('tags').select('*');
    if (error || !data || data.length === 0) {
      return INITIAL_TAGS;
    }
    return data as TagRow[];
  } catch {
    return INITIAL_TAGS;
  }
}

export async function trackWorkView(id: string): Promise<void> {
  try {
    const supabase = createClient();
    await supabase.from('views').insert([
      {
        entity_type: 'work',
        entity_id: id,
        created_at: new Date().toISOString(),
      },
    ]);
  } catch {
    // silently catch
  }
}
