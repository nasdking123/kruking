import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load .env.local if present
let SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
let SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

try {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach((line) => {
      const [k, ...v] = line.split('=');
      if (k && v.length > 0) {
        const val = v.join('=').trim().replace(/^['"]|['"]$/g, '');
        if (k.trim() === 'NEXT_PUBLIC_SUPABASE_URL' && !SUPABASE_URL) SUPABASE_URL = val;
        if (k.trim() === 'SUPABASE_SERVICE_ROLE_KEY' && !SERVICE_KEY) SERVICE_KEY = val;
      }
    });
  }
} catch {
  // Ignore
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function seedStudentLearningSystem() {
  console.log('🚀 Starting Seed for "ระบบการเรียนรู้และผลงานนักเรียน"...');

  // 1. Seed Schools
  console.log('🏫 Seeding Schools...');
  const schoolsData = [
    { name: 'โรงเรียนวัดบางโฉลงใน', code: 'BCL01', province: 'สมุทรปราการ', status: 'active' },
    { name: 'โรงเรียนสาธิตบางพลี', code: 'STBP02', province: 'สมุทรปราการ', status: 'active' },
  ];

  for (const s of schoolsData) {
    await supabase.from('schools').upsert(s, { onConflict: 'name' });
  }

  // 2. Fetch or Create 10 Students in Profiles
  console.log('👥 Ensuring 10+ Students...');
  const mockStudents = [
    { id: '11111111-1111-4111-a111-111111111111', name: 'ด.ช. ธนกฤต มั่งคั่ง', grade: 'ประถมศึกษาปีที่ 6', room: 'ห้อง 1', num: '1', school: 'โรงเรียนวัดบางโฉลงใน' },
    { id: '22222222-2222-4222-a222-222222222222', name: 'ด.ญ. กานต์พิชชา รัตนคุณ', grade: 'ประถมศึกษาปีที่ 6', room: 'ห้อง 1', num: '2', school: 'โรงเรียนวัดบางโฉลงใน' },
    { id: '33333333-3333-4333-a333-333333333333', name: 'ด.ช. ภัทรพล เจริญสุข', grade: 'ประถมศึกษาปีที่ 6', room: 'ห้อง 1', num: '3', school: 'โรงเรียนวัดบางโฉลงใน' },
    { id: '44444444-4444-4444-a444-444444444444', name: 'ด.ญ. วรรณิสา สดใส', grade: 'ประถมศึกษาปีที่ 6', room: 'ห้อง 2', num: '4', school: 'โรงเรียนวัดบางโฉลงใน' },
    { id: '55555555-5555-4555-a555-555555555555', name: 'ด.ช. อานนท์ ยิ่งยืน', grade: 'ประถมศึกษาปีที่ 6', room: 'ห้อง 2', num: '5', school: 'โรงเรียนวัดบางโฉลงใน' },
    { id: '66666666-6666-4666-a666-666666666666', name: 'ด.ญ. ชลธิชา พัฒนาการ', grade: 'ประถมศึกษาปีที่ 3', room: 'ห้อง 1', num: '6', school: 'โรงเรียนวัดบางโฉลงใน' },
    { id: '77777777-7777-4777-a777-777777777777', name: 'ด.ช. ธีรภัทร ปัญญาดี', grade: 'ประถมศึกษาปีที่ 3', room: 'ห้อง 1', num: '7', school: 'โรงเรียนวัดบางโฉลงใน' },
    { id: '88888888-8888-4888-a888-888888888888', name: 'ด.ช. กฤษณะ โค้ดเก่ง', grade: 'ประถมศึกษาปีที่ 6', room: 'ห้อง 1', num: '8', school: 'โรงเรียนสาธิตบางพลี' },
    { id: '99999999-9999-4999-a999-999999999999', name: 'ด.ญ. ปรียาภา วิทยากุล', grade: 'ประถมศึกษาปีที่ 6', room: 'ห้อง 2', num: '9', school: 'โรงเรียนสาธิตบางพลี' },
    { id: 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa', name: 'ด.ช. พศิน นวัตกรรม', grade: 'ประถมศึกษาปีที่ 6', room: 'ห้อง 1', num: '10', school: 'โรงเรียนวัดบางโฉลงใน' },
  ];

  for (const s of mockStudents) {
    await supabase.from('profiles').upsert({
      id: s.id,
      email: `student_${s.num}@bcl.ac.th`,
      full_name: s.name,
      role: 'student',
      grade_level: s.grade,
      classroom: s.room,
      student_number: s.num,
      school_name: s.school,
      avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(s.name)}`,
      status: 'active',
    }, { onConflict: 'id' });
  }

  // 3. Seed Assignments
  console.log('📝 Seeding Assignments...');
  const { data: classrooms } = await supabase.from('classrooms').select('id, lessons(id, title)').limit(2);
  const classroomId = classrooms?.[0]?.id || null;
  const lessonId = classrooms?.[0]?.lessons?.[0]?.id || null;

  const assignmentsData = [
    {
      title: 'ส่งการบ้าน & ผลงานประจำบทเรียน เรื่อง ส่วนประกอบของ Scratch',
      instructions: 'ให้นักเรียนศึกษาส่วนประกอบของโปรแกรม Scratch และส่งภาพผลงาน หรือแชร์ลิงก์โปรเจกต์ Scratch',
      max_score: 20,
      classroom_id: classroomId,
      lesson_id: lessonId,
    },
    {
      title: 'การสร้างตัวละครและการเคลื่อนที่แบบวนซ้ำ (Loops)',
      instructions: 'สร้างสคริปต์ให้ตัวละครแมวเดินไป-กลับ พร้อมส่งเสียง Meow เมื่อแตะขอบจอ',
      max_score: 20,
      classroom_id: classroomId,
      lesson_id: lessonId,
    },
    {
      title: 'ใบงานการเขียนผังงาน (Flowchart) ในชีวิตประจำวัน',
      instructions: 'วาดผังงานการต้มบะหมี่กึ่งสำเร็จรูปและอัปโหลดภาพผลงาน',
      max_score: 20,
      classroom_id: classroomId,
      lesson_id: lessonId,
    },
    {
      title: 'โปรเจกต์เกมตอบคำถามประวัติศาสตร์สมัยรัตนโกสินทร์',
      instructions: 'สร้างเกมถาม-ตอบ 5 ข้อในโปรแกรม Scratch พร้อมนับคะแนน',
      max_score: 20,
      classroom_id: classroomId,
      lesson_id: lessonId,
    },
  ];

  for (const a of assignmentsData) {
    await supabase.from('assignments').insert(a);
  }

  // 4. Seed Submissions (10+ Submissions)
  console.log('📤 Seeding Submissions...');
  const submissionsData = [
    {
      user_id: mockStudents[0].id,
      student_name: mockStudents[0].name,
      submission_type: 'image',
      content_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
      notes: 'ผลงานจัดทำส่วนประกอบของโปรแกรม Scratch ป.6/1 ครบถ้วนครับ',
      score: 19,
      max_score: 20,
      status: 'passed',
      teacher_feedback: 'ยอดเยี่ยมมากครับ ชี้ตำแหน่งบล็อกคำสั่งถูกต้อง 100%',
      is_in_portfolio: true,
      classroom_id: classroomId,
      lesson_id: lessonId,
    },
    {
      user_id: mockStudents[1].id,
      student_name: mockStudents[1].name,
      submission_type: 'link',
      content_url: 'https://scratch.mit.edu/projects/101234567',
      notes: 'โปรเจกต์ Scratch แมวเดินวนรอบเวทีและเปลี่ยนชุดตัวละครค่ะ',
      score: 20,
      max_score: 20,
      status: 'passed',
      teacher_feedback: 'แอนิเมชันลื่นไหลและเลือกฉากหลังได้สวยงามมากค่ะ',
      is_in_portfolio: true,
      classroom_id: classroomId,
      lesson_id: lessonId,
    },
    {
      user_id: mockStudents[2].id,
      student_name: mockStudents[2].name,
      submission_type: 'link',
      content_url: 'https://scratch.mit.edu/projects/109876543',
      notes: 'เกมเขาวงกต Scratch 3.0 เก็บเหรียญ',
      score: 18,
      max_score: 20,
      status: 'graded',
      teacher_feedback: 'เกมสนุกดีครับ เพิ่มเสียง Effect ตอนชนะเกมจะสมบูรณ์แบบ',
      is_in_portfolio: true,
      classroom_id: classroomId,
      lesson_id: lessonId,
    },
    {
      user_id: mockStudents[3].id,
      student_name: mockStudents[3].name,
      submission_type: 'image',
      content_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
      notes: 'ผังงานลำดับขั้นตอนการแก้ปัญหาค่ะ',
      score: 18,
      max_score: 20,
      status: 'passed',
      teacher_feedback: 'ใช้สัญลักษณ์สากลได้ถูกต้อง',
      is_in_portfolio: true,
      classroom_id: classroomId,
      lesson_id: lessonId,
    },
    {
      user_id: mockStudents[4].id,
      student_name: mockStudents[4].name,
      submission_type: 'link',
      content_url: 'https://scratch.mit.edu/projects/112233445',
      notes: 'ส่งการบ้านบทที่ 1 ครับ',
      score: null,
      max_score: 20,
      status: 'pending',
      teacher_feedback: null,
      is_in_portfolio: false,
      classroom_id: classroomId,
      lesson_id: lessonId,
    },
  ];

  for (const sub of submissionsData) {
    await supabase.from('assignment_submissions').insert(sub);
  }

  // 5. Seed Point Transactions
  console.log('💰 Seeding Point Transactions...');
  for (const s of mockStudents) {
    const basePts = Math.floor(800 + Math.random() * 600);
    await supabase.from('point_transactions').insert([
      {
        user_id: s.id,
        amount: basePts,
        point_type: 'learning',
        description: 'คะแนนสะสมจากการเรียนจบ 5 บทเรียน และผ่านแบบทดสอบ',
      },
      {
        user_id: s.id,
        amount: 50,
        point_type: 'bonus',
        description: 'คะแนนโบนัสเข้าร่วมกิจกรรมสัปดาห์วิทยาศาสตร์และโค้ดดิ้ง',
      },
    ]);
  }

  // 6. Seed Certificates (Approved & Pending)
  console.log('🎖️ Seeding Certificates...');
  const certsData = [
    {
      user_id: mockStudents[0].id,
      student_name: mockStudents[0].name,
      title: 'รางวัลชนะเลิศ เหรียญทอง การแข่งขันสร้างเกมด้วย Scratch 3.0 ระดับเขตพื้นที่ฯ',
      issuer: 'สพป.สมุทรปราการ เขต 2',
      issue_date: '2026-08-15',
      image_url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=800&auto=format&fit=crop',
      competition_level: 'ระดับเขตพื้นที่การศึกษา',
      award_tier: 'เหรียญทอง',
      status: 'approved',
    },
    {
      user_id: mockStudents[1].id,
      student_name: mockStudents[1].name,
      title: 'รางวัลรองชนะเลิศอันดับ 1 การแข่งขันโครงงานวิทยาการคำนวณและ AI',
      issuer: 'โรงเรียนวัดบางโฉลงใน',
      issue_date: '2026-08-10',
      image_url: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=800&auto=format&fit=crop',
      competition_level: 'ระดับสถานศึกษา',
      award_tier: 'เหรียญเงิน',
      status: 'approved',
    },
    {
      user_id: mockStudents[2].id,
      student_name: mockStudents[2].name,
      title: 'ผ่านการอบรมหลักสูตร Coding for Kids ระดับเยาวชน',
      issuer: 'ศูนย์เทคโนโลยีสารสนเทศเพื่อการศึกษา',
      issue_date: '2026-08-20',
      image_url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=800&auto=format&fit=crop',
      competition_level: 'ระดับสถานศึกษา',
      award_tier: 'เกียรติบัตรเข้าร่วม',
      status: 'pending',
    },
  ];

  for (const c of certsData) {
    await supabase.from('student_certificates').insert(c);
  }

  // 7. Seed Awards & Badges
  console.log('🏆 Seeding Student Awards...');
  const awardsData = [
    { user_id: mockStudents[0].id, student_name: mockStudents[0].name, award_name: 'ผู้เรียนดีเด่นประจำเดือนสิงหาคม', award_type: 'outstanding', badge_icon: '⭐', description: 'ส่งการบ้านครบทุกบทเรียนและได้คะแนนเต็ม' },
    { user_id: mockStudents[1].id, student_name: mockStudents[1].name, award_name: 'คะแนนสอบสูงสุดวิชาวิทยาการคำนวณ', award_type: 'top_score', badge_icon: '🎯', description: 'ทำแบบทดสอบวัดผลสัมฤทธิ์ได้ 100%' },
    { user_id: mockStudents[2].id, student_name: mockStudents[2].name, award_name: 'นักพัฒนา Scratch ยอดเยี่ยม', award_type: 'winner', badge_icon: '🏆', description: 'สร้างสรรค์โปรเจกต์เกมได้อย่างโดดเด่น' },
  ];

  for (const aw of awardsData) {
    await supabase.from('student_awards').insert(aw);
  }

  // 8. Seed Competitions
  console.log('⚔️ Seeding Competitions...');
  const compsData = [
    {
      title: 'Bangchalong Scratch Coding Challenge 2026',
      description: 'ประลองทักษะการเขียนโค้ด Scratch สร้างเกมเพื่อการศึกษาและอนุรักษ์สิ่งแวดล้อม',
      subject: 'วิทยาการคำนวณ',
      grade_level: 'ประถมศึกษาปีที่ 6',
      points_reward: 100,
      status: 'active',
    },
    {
      title: 'ตอบปัญหาวิชาประวัติศาสตร์ไทยและบุคคลสำคัญ',
      description: 'แข่งขันทดสอบความรู้ประวัติศาสตร์สมัยรัตนโกสินทร์และพระมหากษัตริย์ไทย',
      subject: 'ประวัติศาสตร์',
      grade_level: 'ประถมศึกษาปีที่ 6',
      points_reward: 50,
      status: 'active',
    },
    {
      title: 'การออกแบบนวัตกรรม AI เพื่อโรงเรียนแห่งอนาคต',
      description: 'ประกวดไอเดียการประยุกต์ใช้ AI ในห้องเรียนวัดบางโฉลงใน',
      subject: 'นวัตกรรมและเทคโนโลยี',
      grade_level: 'ทุกระดับชั้น',
      points_reward: 80,
      status: 'active',
    },
  ];

  for (const comp of compsData) {
    const { data: createdComp } = await supabase.from('competitions').insert(comp).select().single();
    if (createdComp) {
      // Seed results for this competition
      await supabase.from('competition_results').upsert([
        { competition_id: createdComp.id, user_id: mockStudents[0].id, rank: 1, score: 98, notes: 'ชนะเลิศอันดับ 1 (ผลงานสมบูรณ์แบบ)' },
        { competition_id: createdComp.id, user_id: mockStudents[1].id, rank: 2, score: 95, notes: 'รองชนะเลิศอันดับ 1' },
        { competition_id: createdComp.id, user_id: mockStudents[2].id, rank: 3, score: 90, notes: 'รองชนะเลิศอันดับ 2' },
      ], { onConflict: 'competition_id,user_id' });
    }
  }

  console.log('✅ Seed for "ระบบการเรียนรู้และผลงานนักเรียน" completed successfully 100%!');
}

seedStudentLearningSystem().catch(console.error);
