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

async function seedQuizzes() {
  console.log('--- Seeding Comprehensive Online Quizzes into Supabase ---');

  // Quiz 1: Computational Thinking
  const quiz1 = {
    title: 'แบบทดสอบ: 4 เสาหลักการคิดเชิงคำนวณ (Computational Thinking)',
    slug: 'computational-thinking-quiz-p4-p6',
    description: 'ทดสอบความเข้าใจเกี่ยวกับ Decomposition, Pattern Recognition, Abstraction และ Algorithm Design ตามมาตรฐาน ว 4.2',
    grade_level: 'ประถมศึกษาปีที่ 4 - 6',
    subject: 'วิทยาการคำนวณ',
    time_limit: 10,
    attempt_limit: 3,
    shuffle_questions: true,
    shuffle_choices: true,
    published: true,
    visibility: 'public',
  };

  const { data: q1Data, error: q1Err } = await adminClient.from('quizzes').upsert([quiz1], { onConflict: 'slug' }).select().single();
  if (q1Err) console.error('Quiz 1 Insert Error:', q1Err);

  if (q1Data) {
    const q1Id = q1Data.id;

    // Clear old questions
    await adminClient.from('quiz_questions').delete().eq('quiz_id', q1Id);

    // Question 1.1
    const { data: q1_1 } = await adminClient.from('quiz_questions').insert([{
      quiz_id: q1Id,
      question: 'ข้อใดคือความหมายที่ถูกต้องที่สุดของ Decomposition (การแบ่งย่อยปัญหา)?',
      explanation: 'Decomposition คือการแตกปัญหาใหญ่หรือระบบที่ซับซ้อนออกเป็นส่วนย่อยๆ เพื่อให้วิเคราะห์และจัดการได้ง่ายขึ้น',
      points: 1,
      sort_order: 1,
    }]).select().single();

    if (q1_1) {
      await adminClient.from('quiz_choices').insert([
        { question_id: q1_1.id, choice_text: 'การแตกปัญหาใหญ่หรือสิ่งซับซ้อนออกเป็นส่วนย่อยๆ เพื่อจัดการได้ง่ายขึ้น', is_correct: true, sort_order: 1 },
        { question_id: q1_1.id, choice_text: 'การมองหารูปแบบความเหมือนและความต่างของปัญหา', is_correct: false, sort_order: 2 },
        { question_id: q1_1.id, choice_text: 'การตัดรายละเอียดที่ไม่จำเป็นออกแล้วมุ่งเน้นเฉพาะสาระสำคัญ', is_correct: false, sort_order: 3 },
        { question_id: q1_1.id, choice_text: 'การเขียนโปรแกรมคอมพิวเตอร์ด้วยภาษา Scratch', is_correct: false, sort_order: 4 },
      ]);
    }

    // Question 1.2
    const { data: q1_2 } = await adminClient.from('quiz_questions').insert([{
      quiz_id: q1Id,
      question: 'การวาดแผนที่เส้นทางจากโรงเรียนกลับบ้าน โดยแสดงเฉพาะจุดสังเกตสำคัญและถนนหลัก จัดเป็นทักษะข้อใด?',
      explanation: 'Abstraction (การคิดเชิงนามธรรม) คือการคัดเลือกเฉพาะข้อมูลและจุดสำคัญที่จำเป็นต่อการแก้ปัญหา และตัดรายละเอียดที่ไม่จำเป็นออก',
      points: 1,
      sort_order: 2,
    }]).select().single();

    if (q1_2) {
      await adminClient.from('quiz_choices').insert([
        { question_id: q1_2.id, choice_text: 'Abstraction (การคิดเชิงนามธรรม)', is_correct: true, sort_order: 1 },
        { question_id: q1_2.id, choice_text: 'Decomposition (การแบ่งย่อยปัญหา)', is_correct: false, sort_order: 2 },
        { question_id: q1_2.id, choice_text: 'Pattern Recognition (การหารูปแบบ)', is_correct: false, sort_order: 3 },
        { question_id: q1_2.id, choice_text: 'Bug Fixing (การตรวจหาข้อผิดพลาด)', is_correct: false, sort_order: 4 },
      ]);
    }

    // Question 1.3
    const { data: q1_3 } = await adminClient.from('quiz_questions').insert([{
      quiz_id: q1Id,
      question: 'ข้อใดคือขั้นตอนวิธี (Algorithm Design) ในการแก้ปัญหา?',
      explanation: 'Algorithm Design คือการวางลำดับขั้นตอนในการแก้ปัญหาอย่างชัดเจน เป็นลำดับขั้นตั้งแต่ต้นจนจบ',
      points: 1,
      sort_order: 3,
    }]).select().single();

    if (q1_3) {
      await adminClient.from('quiz_choices').insert([
        { question_id: q1_3.id, choice_text: 'การกำหนดลำดับขั้นตอนการทำงานอย่างชัดเจนเป็นขั้นเป็นตอน 1, 2, 3...', is_correct: true, sort_order: 1 },
        { question_id: q1_3.id, choice_text: 'การซื้อคอมพิวเตอร์เครื่องใหม่ที่มีประสิทธิภาพสูง', is_correct: false, sort_order: 2 },
        { question_id: q1_3.id, choice_text: 'การจดจำข้อสอบเก่าเพื่อนำมาตอบคำถาม', is_correct: false, sort_order: 3 },
        { question_id: q1_3.id, choice_text: 'การสุ่มคำตอบจนกว่าจะได้ผลลัพธ์ที่ถูกต้อง', is_correct: false, sort_order: 4 },
      ]);
    }

    // Question 1.4
    const { data: q1_4 } = await adminClient.from('quiz_questions').insert([{
      quiz_id: q1Id,
      question: 'นักเรียนสังเกตเห็นว่าทุกเช้าวันจันทร์การจราจรหน้าโรงเรียนจะติดขัดเป็นพิเศษ ทักษะนี้ตรงกับข้อใด?',
      explanation: 'Pattern Recognition คือการสังเกตรูปแบบ แนวโน้ม หรือความถี่ที่เกิดขึ้นซ้ำๆ ของเหตุการณ์',
      points: 1,
      sort_order: 4,
    }]).select().single();

    if (q1_4) {
      await adminClient.from('quiz_choices').insert([
        { question_id: q1_4.id, choice_text: 'Pattern Recognition (การหารูปแบบ/แนวโน้ม)', is_correct: true, sort_order: 1 },
        { question_id: q1_4.id, choice_text: 'Decomposition (การแบ่งย่อยปัญหา)', is_correct: false, sort_order: 2 },
        { question_id: q1_4.id, choice_text: 'Abstraction (การคิดเชิงนามธรรม)', is_correct: false, sort_order: 3 },
        { question_id: q1_4.id, choice_text: 'Binary Search (การค้นหาข้อมูล)', is_correct: false, sort_order: 4 },
      ]);
    }

    // Question 1.5
    const { data: q1_5 } = await adminClient.from('quiz_questions').insert([{
      quiz_id: q1Id,
      question: 'ข้อใดไม่ใช่ประโยชน์ของการนำการคิดเชิงคำนวณไปใช้ในชีวิตประจำวัน?',
      explanation: 'การคิดเชิงคำนวณช่วยให้มนุษย์คิดอย่างเป็นระบบและแก้ปัญหาได้ดีขึ้น ไม่ได้มีวัตถุประสงค์เพื่อให้มนุษย์ทำงานแทนหุ่นยนต์',
      points: 1,
      sort_order: 5,
    }]).select().single();

    if (q1_5) {
      await adminClient.from('quiz_choices').insert([
        { question_id: q1_5.id, choice_text: 'ช่วยให้มนุษย์เปลี่ยนไปทำงานเหมือนหุ่นยนต์โดยไม่ต้องใช้ความคิดสร้างสรรค์', is_correct: true, sort_order: 1 },
        { question_id: q1_5.id, choice_text: 'ช่วยวางแผนและจัดลำดับความสำคัญของงานได้อย่างมีประสิทธิภาพ', is_correct: false, sort_order: 2 },
        { question_id: q1_5.id, choice_text: 'ช่วยแก้ปัญหาซับซ้อนได้อย่างเป็นเหตุเป็นผล', is_correct: false, sort_order: 3 },
        { question_id: q1_5.id, choice_text: 'ช่วยออกแบบขั้นตอนการทำงานที่ผู้อื่นสามารถนำไปปฏิบัติตามได้', is_correct: false, sort_order: 4 },
      ]);
    }
  }

  // Quiz 2: Scratch Coding & Logic
  const quiz2 = {
    title: 'แบบทดสอบ: พื้นฐานการเขียนโปรแกรม Scratch และการใช้เหตุผลเชิงตรรกะ',
    slug: 'scratch-coding-logic-quiz-p4-p6',
    description: 'ทดสอบความรู้เกี่ยวกับบล็อกคำสั่ง Scratch การทำงานแบบวนซ้ำ (Loop) เงื่อนไข (If-Else) และพิกัดฉาก X, Y',
    grade_level: 'ประถมศึกษาปีที่ 4 - 6',
    subject: 'วิทยาการคำนวณ',
    time_limit: 15,
    attempt_limit: 2,
    shuffle_questions: true,
    shuffle_choices: true,
    published: true,
    visibility: 'public',
  };

  const { data: q2Data } = await adminClient.from('quizzes').upsert([quiz2], { onConflict: 'slug' }).select().single();
  if (q2Data) {
    const q2Id = q2Data.id;

    // Clear old questions
    await adminClient.from('quiz_questions').delete().eq('quiz_id', q2Id);

    // Question 2.1
    const { data: q2_1 } = await adminClient.from('quiz_questions').insert([{
      quiz_id: q2Id,
      question: 'ในโปรแกรม Scratch หากต้องการให้ตัวละครเดินไปข้างหน้าไม่สิ้นสุด ควรใช้บล็อกคำสั่งใด?',
      explanation: 'บล็อก "forever" (วนซ้ำตลอดไป) ร่วมกับ "move 10 steps" จะสั่งให้ตัวละครเคลื่อนที่ไปเรื่อยๆ จนกว่าจะกดหยุดโปรแกรม',
      points: 1,
      sort_order: 1,
    }]).select().single();

    if (q2_1) {
      await adminClient.from('quiz_choices').insert([
        { question_id: q2_1.id, choice_text: 'บล็อก "forever" ครอบคำสั่ง "move 10 steps"', is_correct: true, sort_order: 1 },
        { question_id: q2_1.id, choice_text: 'บล็อก "repeat 10"', is_correct: false, sort_order: 2 },
        { question_id: q2_1.id, choice_text: 'บล็อก "if on edge, bounce"', is_correct: false, sort_order: 3 },
        { question_id: q2_1.id, choice_text: 'บล็อก "wait 1 seconds"', is_correct: false, sort_order: 4 },
      ]);
    }

    // Question 2.2
    const { data: q2_2 } = await adminClient.from('quiz_questions').insert([{
      quiz_id: q2Id,
      question: 'ตำแหน่งกึ่งกลางหน้าจอเวที (Stage) ของโปรแกรม Scratch มีค่าพิกัดเท่ากับเท่าใด?',
      explanation: 'จุดกึ่งกลางของเวทีใน Scratch มีพิกัดเป็น (x: 0, y: 0)',
      points: 1,
      sort_order: 2,
    }]).select().single();

    if (q2_2) {
      await adminClient.from('quiz_choices').insert([
        { question_id: q2_2.id, choice_text: 'x: 0, y: 0', is_correct: true, sort_order: 1 },
        { question_id: q2_2.id, choice_text: 'x: 100, y: 100', is_correct: false, sort_order: 2 },
        { question_id: q2_2.id, choice_text: 'x: -240, y: -180', is_correct: false, sort_order: 3 },
        { question_id: q2_2.id, choice_text: 'x: 240, y: 180', is_correct: false, sort_order: 4 },
      ]);
    }

    // Question 2.3
    const { data: q2_3 } = await adminClient.from('quiz_questions').insert([{
      quiz_id: q2Id,
      question: 'บล็อกคำสั่งใดใช้ตรวจสอบว่าตัวละครสัมผัสกับเมาส์หรือตัวละครอื่นหรือไม่?',
      explanation: 'บล็อกในกลุ่ม Sensing (ตรวจจับ) เช่น "touching mouse-pointer?" หรือ "touching Sprite2?" ใช้ตรวจสอบการชน/สัมผัส',
      points: 1,
      sort_order: 3,
    }]).select().single();

    if (q2_3) {
      await adminClient.from('quiz_choices').insert([
        { question_id: q2_3.id, choice_text: 'บล็อกในกลุ่ม Sensing (ตรวจจับ) เช่น "touching ... ?"', is_correct: true, sort_order: 1 },
        { question_id: q2_3.id, choice_text: 'บล็อกในกลุ่ม Motion (การเคลื่อนที่)', is_correct: false, sort_order: 2 },
        { question_id: q2_3.id, choice_text: 'บล็อกในกลุ่ม Looks (รูปลักษณ์)', is_correct: false, sort_order: 3 },
        { question_id: q2_3.id, choice_text: 'บล็อกในกลุ่ม Sound (เสียง)', is_correct: false, sort_order: 4 },
      ]);
    }
  }

  console.log('✅ Online Quizzes & Questions Seeded Successfully!');
}

seedQuizzes();
