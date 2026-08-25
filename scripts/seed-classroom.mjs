import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...vals] = line.split('=');
  if (key && vals.length) {
    env[key.trim()] = vals.join('=').trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

const adminClient = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function seedClassroom() {
  console.log('🚀 SEEDING ONLINE CLASSROOM WITH YOUTUBE LESSONS...\n');

  const classroomsData = [
    {
      title: 'วิชาประวัติศาสตร์ ชั้นประถมศึกษาปีที่ 6',
      slug: 'history-p6-classroom',
      description: 'ห้องเรียนออนไลน์ประวัติศาสตร์ ป.6 เรียนรู้พัฒนาการอาณาจักรรัตนโกสินทร์ ภูมิปัญญาไทย และบุคคลสำคัญของชาติผ่านคลิปวิดีโอและใบงาน',
      cover_image: 'https://images.unsplash.com/photo-1599707303398-5440f0475c17?q=80&w=1200&auto=format&fit=crop',
      grade_level: 'ประถมศึกษาปีที่ 6',
      subject: 'ประวัติศาสตร์',
      join_code: 'HIST601',
      status: 'active',
      visibility: 'public',
      courses: [
        {
          title: 'หน่วยที่ 1: พัฒนาการแห่งอาณาจักรรัตนโกสินทร์',
          description: 'ศึกษาการสถาปนากรุงรัตนโกสินทร์ ลำดับเหตุการณ์สำคัญ และพระราชกรณียกิจ',
          sort_order: 1,
          lessons: [
            {
              title: 'บทที่ 1: การสถาปนากรุงรัตนโกสินทร์และพระปรีชาสามารถของรัชกาลที่ 1',
              description: 'เรียนรู้เบื้องหลังการย้ายราชธานี และการฟื้นฟูพระพุทธศาสนา ศิลปวัฒนธรรมในยุครัตนโกสินทร์ตอนต้น',
              video_url: 'https://www.youtube.com/watch?v=J---aiyznGQ', // High quality Thai History lesson
              sort_order: 1,
              content: `## สาระสำคัญของบทเรียน\n\nการสถาปนากรุงรัตนโกสินทร์เมื่อปี พ.ศ. 2325 โดยพระบาทสมเด็จพระพุทธยอดฟ้าจุฬาโลกมหาราช (รัชกาลที่ 1) มีสาเหตุหลักทางยุทธศาสตร์คือการย้ายราชธานีข้ามฝั่งแม่น้ำเจ้าพระยามายังฝั่งตะวันออก ซึ่งมีชัยภูมิที่ป้องกันข้าศึกได้ดีกว่า\n\n### สิ่งที่นักเรียนจะได้เรียนรู้:\n- เหตุผลทางภูมิศาสตร์และยุทธศาสตร์ในการย้ายราชธานี\n- การสร้างพระบรมมหาราชวังและวัดพระศรีรัตนศาสดาราม (วัดพระแก้ว)\n- การฟื้นฟูขนบธรรมเนียมราชประเพณีและกฎหมายตราสามดวง`,
            },
            {
              title: 'บทที่ 2: การปฏิรูปประเทศให้ทันสมัยในยุครัตนโกสินทร์ (รัชกาลที่ 4 - 5)',
              description: 'ศึกษาการเปิดรับวิทยาการตะวันตก สนธิสัญญาเบาว์ริง และการเลิกทาสในรัชกาลที่ 5',
              video_url: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
              sort_order: 2,
              content: `## การปฏิรูปประเทศสู่ความทันสมัย\n\nในรัชสมัยพระบาทสมเด็จพระจุลจอมเกล้าเจ้าอยู่หัว (รัชกาลที่ 5) สยามเผชิญกับภัยคุกคามจากลัทธิล่าอาณานิคมของชาติตะวันตก จึงมีการปฏิรูประบบราชการ การเลิกทาสและเลิกไพร่ การสร้างระบบรถไฟ ไปรษณีย์ และการศึกษาแผนใหม่`,
            }
          ]
        }
      ]
    },
    {
      title: 'หลักสูตรต้านทุจริตศึกษา ชั้นประถมศึกษาปีที่ 6',
      slug: 'anti-corruption-p6-classroom',
      description: 'ห้องเรียนเสริมสร้างคุณธรรม จริยธรรม และการแยกแยะผลประโยชน์ส่วนตนกับผลประโยชน์ส่วนรวมเพื่อสร้างสังคมสุจริต',
      cover_image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1200&auto=format&fit=crop',
      grade_level: 'ประถมศึกษาปีที่ 6',
      subject: 'ต้านทุจริตศึกษา',
      join_code: 'ANTI601',
      status: 'active',
      visibility: 'public',
      courses: [
        {
          title: 'หน่วยที่ 1: การคิดแยกแยะประโยชน์ส่วนตนและประโยชน์ส่วนรวม',
          description: 'เข้าใจความหมายของผลประโยชน์ทับซ้อน (Conflict of Interest) และความละอายต่อการทุจริต',
          sort_order: 1,
          lessons: [
            {
              title: 'บทที่ 1: ผลประโยชน์ทับซ้อนคืออะไร? วิเคราะห์กรณีศึกษาในชีวิตประจำวัน',
              description: 'ทำความเข้าใจความแตกต่างระหว่างสิทธิส่วนตัวกับทรัพย์สินส่วนรวมในโรงเรียนและชุมชน',
              video_url: 'https://www.youtube.com/watch?v=kYIP3ZgI5xM',
              sort_order: 1,
              content: `## ผลประโยชน์ทับซ้อน (Conflict of Interest)\n\nหมายถึง สถานการณ์ที่บุคคลมีผลประโยชน์ส่วนตนเข้ามาขัดแย้งกับการปฏิบัติหน้าที่เพื่อส่วนรวม ซึ่งอาจส่งผลให้การตัดสินใจไม่เป็นกลางหรือขาดความถูกต้อง\n\n### ตัวอย่างในชีวิตประจำวันของนักเรียน:\n1. การนำอุปกรณ์ของโรงเรียนไปใช้ประโยชน์ส่วนตัวที่บ้าน\n2. การเข้าคิวซื้ออาหารและการเคารพสิทธิของผู้อื่น\n3. การไม่ลอกการบ้านหรือข้อสอบของเพื่อน`,
            },
            {
              title: 'บทที่ 2: STRONG: โมเดลจิตพอเพียงต้านทุจริต',
              description: 'เรียนรู้ความหมายของตัวอักษร S-T-R-O-N-G และการนำไปใช้ในชีวิตจริง',
              video_url: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
              sort_order: 2,
              content: `## ความหมายของ STRONG MODEL\n\n- **S (Sufficient):** ความพอเพียง ไม่โลภ\n- **T (Transparent):** ความโปร่งใส ตรวจสอบได้\n- **R (Realize):** ความตระหนักรู้ต่อผลกระทบของการทุจริต\n- **O (Onward):** การมุ่งมั่นพัฒนาตนเองให้เป็นคนดี\n- **N (Knowledge):** ความรู้เท่าทันต่อรูปแบบการทุจริต\n- **G (Generosity):** ความเอื้ออาทรและจิตสาธารณะ`,
            }
          ]
        }
      ]
    },
    {
      title: 'วิทยาการคำนวณและโค้ดดิ้ง (Computing Science & Coding)',
      slug: 'cs-coding-classroom',
      description: 'ห้องเรียนการคิดเชิงคำนวณ การเขียนโปรแกรมแบบบล็อก Scratch และการพัฒนาตรรกะแก้ปัญหาอย่างสร้างสรรค์',
      cover_image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop',
      grade_level: 'ประถมศึกษาปีที่ 4 - 6',
      subject: 'วิทยาการคำนวณ',
      join_code: 'CODE406',
      status: 'active',
      visibility: 'public',
      courses: [
        {
          title: 'หน่วยที่ 1: Computational Thinking & Scratch Programming',
          description: 'ฝึกฝนทักษะการคิดเชิงคำนวณ 4 ด้าน และสร้างเกมแรกด้วย Scratch',
          sort_order: 1,
          lessons: [
            {
              title: 'บทที่ 1: การคิดเชิงคำนวณ (Computational Thinking) 4 เสาหลัก',
              description: 'Decomposition, Pattern Recognition, Abstraction และ Algorithm Design',
              video_url: 'https://www.youtube.com/watch?v=mUXo-S7gkds',
              sort_order: 1,
              content: `## 4 องค์ประกอบสำคัญของการคิดเชิงคำนวณ\n\n1. **Decomposition (การแยกส่วนประกอบ):** การแบ่งปัญหาใหญ่ออกเป็นปัญหาย่อยๆ ที่จัดการได้ง่าย\n2. **Pattern Recognition (การหารูปแบบ):** การมองหารูปแบบหรือความคล้ายคลึงของสิ่งต่างๆ\n3. **Abstraction (การคิดเชิงนามธรรม):** การมุ่งเน้นเฉพาะสาระสำคัญและตัดรายละเอียดที่ไม่จำเป็นออก\n4. **Algorithm Design (การออกแบบขั้นตอนวิธี):** การลำดับขั้นตอนแก้ปัญหาอย่างเป็นขั้นตอนและชัดเจน`,
            },
            {
              title: 'บทที่ 2: เริ่มต้นเขียนโปรแกรมสร้างสรรค์ด้วย Scratch 3.0',
              description: 'เรียนรู้เวที (Stage), ตัวละคร (Sprite), บล็อกคำสั่งเหตุการณ์ และการวนซ้ำ (Loops)',
              video_url: 'https://www.youtube.com/watch?v=VIpmkeqJhmQ',
              sort_order: 2,
              content: `## การใช้งานเครื่องมือพื้นฐานใน Scratch\n\n- **Events Block (สีเหลือง):** เช่น 'When Green Flag Clicked' ใช้เริ่มการทำงาน\n- **Motion Block (สีน้ำเงิน):** ควบคุมการเคลื่อนที่และพิกัด X, Y บนเวที\n- **Control Block (สีส้ม):** การควบคุมทิศทางเงื่อนไข (if-then) และการวนซ้ำ (forever / repeat)`,
            }
          ]
        }
      ]
    }
  ];

  for (const cData of classroomsData) {
    const { courses, ...cls } = cData;
    
    // 1. Upsert Classroom
    const { data: createdCls, error: errCls } = await adminClient
      .from('classrooms')
      .upsert([cls], { onConflict: 'slug' })
      .select()
      .single();

    if (errCls) {
      console.error(`❌ Error creating classroom "${cls.title}":`, errCls.message);
      continue;
    }

    console.log(`✅ Classroom: "${createdCls.title}" (ID: ${createdCls.id})`);

    // 2. Upsert Courses & Lessons
    for (const courseItem of courses) {
      const { lessons, ...course } = courseItem;
      const coursePayload = {
        ...course,
        classroom_id: createdCls.id,
        published: true,
      };

      const { data: createdCourse, error: errCourse } = await adminClient
        .from('courses')
        .insert([coursePayload])
        .select()
        .single();

      if (errCourse) {
        console.error(`  ❌ Error course "${course.title}":`, errCourse.message);
        continue;
      }

      console.log(`  📂 Course: "${createdCourse.title}"`);

      // 3. Upsert Lessons
      for (const lsn of lessons) {
        const lessonPayload = {
          ...lsn,
          course_id: createdCourse.id,
          published: true,
        };

        const { data: createdLesson, error: errLsn } = await adminClient
          .from('lessons')
          .insert([lessonPayload])
          .select()
          .single();

        if (errLsn) {
          console.error(`    ❌ Error lesson "${lsn.title}":`, errLsn.message);
        } else {
          console.log(`    🎬 Lesson: "${createdLesson.title}" (YouTube: ${createdLesson.video_url})`);
        }
      }
    }
  }

  console.log('\n🎉 ALL CLASSROOMS & YOUTUBE LESSONS SEEDED SUCCESSFULLY!\n');
}

seedClassroom();
