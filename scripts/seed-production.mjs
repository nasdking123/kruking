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

async function seed() {
  console.log('--- Starting Complete Production Seed ---');

  // 1. Modules
  const modules = [
    { key: 'lesson_plans', name: 'แผนการจัดการเรียนรู้', description: 'คลังแผนการสอน 5E ตามมาตรฐาน ว 4.2', icon: 'BookOpen', enabled: true, sort_order: 1 },
    { key: 'worksheets', name: 'ใบงานและแบบฝึกหัด', description: 'คลังใบงานนักเรียนพร้อมเฉลยสำหรับครู', icon: 'FileText', enabled: true, sort_order: 2 },
    { key: 'games', name: 'เกมการเรียนรู้และ Coding', description: 'บอร์ดเกมและกิจกรรม Unplugged Coding', icon: 'Gamepad2', enabled: true, sort_order: 3 },
    { key: 'resources', name: 'สื่อการสอนและสไลด์', description: 'สื่อการสอนดิจิทัล สไลด์ PowerPoint และ Canva', icon: 'FolderOpen', enabled: true, sort_order: 4 },
    { key: 'teaching', name: 'โชว์เคสการสอน Active Learning', description: 'บันทึกการจัดกิจกรรมการเรียนรู้ในชั้นเรียน', icon: 'Layers', enabled: true, sort_order: 5 },
    { key: 'research', name: 'งานวิจัยในชั้นเรียน', description: 'คลังงานวิจัย CAR พัฒนานวัตกรรมผู้เรียน', icon: 'GraduationCap', enabled: true, sort_order: 6 },
    { key: 'innovation', name: 'นวัตกรรมการศึกษา', description: 'สิ่งประดิษฐ์และนวัตกรรมการเรียนรู้', icon: 'Sparkles', enabled: true, sort_order: 7 },
    { key: 'classroom', name: 'ห้องเรียนออนไลน์', description: 'ระบบห้องเรียนดิจิทัล วิดีโอบทเรียน และรหัส Join Code', icon: 'School', enabled: true, sort_order: 8 },
    { key: 'quiz', name: 'ระบบแบบทดสอบและประเมินผล', description: 'แบบทดสอบออนไลน์ จับเวลา ตรวจและเฉลยอัตโนมัติ', icon: 'CheckSquare', enabled: true, sort_order: 9 },
    { key: 'downloads', name: 'ศูนย์ดาวน์โหลดไฟล์', description: 'คลังไฟล์เอกสาร เทมเพลต และสื่อการสอน', icon: 'Download', enabled: true, sort_order: 10 },
  ];
  await adminClient.from('modules').upsert(modules, { onConflict: 'key' });
  console.log('✅ Modules ready');

  // 2. Categories
  const categories = [
    { name: 'วิทยาการคำนวณ ป.1', slug: 'cs-p1', description: 'พื้นฐานการแก้ปัญหาและการใช้อุปกรณ์เทคโนโลยีเบื้องต้น', icon: 'Laptop', sort_order: 1 },
    { name: 'วิทยาการคำนวณ ป.4', slug: 'cs-p4', description: 'การเขียนโปรแกรมแบบบล็อกและการใช้เหตุผลเชิงตรรกะ', icon: 'Code', sort_order: 2 },
    { name: 'วิทยาการคำนวณ ป.5', slug: 'cs-p5', description: 'การออกแบบอัลกอริทึมและการเขียนโปรแกรม Scratch', icon: 'Cpu', sort_order: 3 },
    { name: 'วิทยาการคำนวณ ป.6', slug: 'cs-p6', description: 'การใช้เหตุผลเชิงตรรกะและการตรวจหาข้อผิดพลาดของโปรแกรม', icon: 'FileCode', sort_order: 4 },
    { name: 'นวัตกรรมและสื่อ Unplugged', slug: 'unplugged-innovations', description: 'สื่อการสอนบอร์ดเกมและกิจกรรมโค้ดดิ้งไม่ใช้คอมพิวเตอร์', icon: 'Gamepad2', sort_order: 5 },
    { name: 'งานวิจัยในชั้นเรียน (CAR)', slug: 'action-research', description: 'งานวิจัยแก้ปัญหาผู้เรียนและการพัฒนาผลสัมฤทธิ์ทางการเรียน', icon: 'GraduationCap', sort_order: 6 },
    { name: 'แผนการจัดการเรียนรู้ 5E', slug: 'lesson-plans-5e', description: 'แผนการสอนตามมาตรฐาน ว 4.2 เน้น Active Learning', icon: 'BookOpen', sort_order: 7 },
    { name: 'เอกสารและเทมเพลต ว.PA', slug: 'pa-documents', description: 'แบบฟอร์ม ข้อตกลงการพัฒนางาน และรายงานผลการสอน', icon: 'Award', sort_order: 8 },
  ];
  await adminClient.from('categories').upsert(categories, { onConflict: 'slug' });
  console.log('✅ Categories ready');

  // 3. Homepage Sections
  const homepageSections = [
    { section_key: 'hero', title: 'ส่วนหัวเว็บไซต์ (Hero Banner)', subtitle: 'แบนเนอร์หลักและข้อความต้อนรับ', is_enabled: true, sort_order: 1 },
    { section_key: 'search', title: 'กล่องค้นหาด่วน (Quick Search Bar)', subtitle: 'ช่องค้นหาข้อมูลข้ามทุกโมดูล', is_enabled: true, sort_order: 2 },
    { section_key: 'categories', title: 'หมวดหมู่สื่อการเรียนรู้ (Categories Grid)', subtitle: 'ตารางเลือกหมวดหมู่สื่อการสอน', is_enabled: true, sort_order: 3 },
    { section_key: 'featured_works', title: 'ผลงานและสื่อนวัตกรรมเด่น (Featured Works)', subtitle: 'ผลงานยอดนิยมคัดสรร', is_enabled: true, sort_order: 4 },
    { section_key: 'latest_worksheets', title: 'ใบงานและแบบฝึกหัดล่าสุด (Latest Worksheets)', subtitle: 'รายการใบงานอัปเดตใหม่', is_enabled: true, sort_order: 5 },
    { section_key: 'latest_games', title: 'เกมการเรียนรู้และ Coding (Latest Games)', subtitle: 'เกมการศึกษาและ Unplugged Coding', is_enabled: true, sort_order: 6 },
    { section_key: 'ai_for_teachers', title: 'แบนเนอร์ผู้ช่วย AI สำหรับครู (AI Banner)', subtitle: 'เครื่องมือ AI ช่วยสอน', is_enabled: true, sort_order: 7 },
  ];
  await adminClient.from('homepage_sections').upsert(homepageSections, { onConflict: 'section_key' });
  console.log('✅ Homepage Sections ready');

  console.log('--- All Seed Completed Successfully ---');
}

seed();
