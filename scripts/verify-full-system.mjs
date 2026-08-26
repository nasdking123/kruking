import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import http from 'http';

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

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const adminClient = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function testRoute(port, path) {
  return new Promise((resolve) => {
    const options = {
      hostname: '127.0.0.1',
      port: port,
      path: path,
      method: 'GET',
      headers: {
        'User-Agent': 'FullSystemAudit/1.0',
      },
    };

    const req = http.request(options, (res) => {
      resolve({
        path,
        statusCode: res.statusCode,
        ok: res.statusCode >= 200 && res.statusCode < 400,
      });
    });

    req.on('error', (err) => {
      resolve({
        path,
        statusCode: 500,
        ok: false,
        error: err.message,
      });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ path, statusCode: 408, ok: false, error: 'Timeout' });
    });

    req.end();
  });
}

async function verifyFullSystem() {
  console.log('================================================================');
  console.log('  🔬 KRUKING PLATFORM - 100% PRODUCTION INTEGRITY AUDIT');
  console.log('  โรงเรียนวัดบางโฉลงใน • ครูจักรพงษ์ สำรองพันธ์');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  // 1. Check all database tables
  console.log('📦 [1/4] ตรวจสอบความสมบูรณ์ของตารางฐานข้อมูล Supabase...');
  const tables = [
    'profiles',
    'classrooms',
    'lessons',
    'classroom_members',
    'views',
    'quizzes',
    'quiz_questions',
    'quiz_choices',
    'quiz_attempts',
    'assignment_submissions',
    'works',
    'categories',
    'site_settings',
    'homepage_sections',
    'menus',
    'pages'
  ];

  for (const table of tables) {
    try {
      const { data, error } = await adminClient.from(table).select('*').limit(3);
      if (error) {
        // If assignment_submissions is not yet created in remote DB, let's catch it
        console.log(`  ⚠️ Table "${table}": ${error.message}`);
        failed++;
      } else {
        console.log(`  ✅ Table "${table}": OK (${data?.length || 0} sample rows)`);
        passed++;
      }
    } catch (e) {
      console.log(`  ❌ Table "${table}": Exception ${e.message}`);
      failed++;
    }
  }

  // 2. Audit Classrooms and Quizzes
  console.log('\n📚 [2/4] ตรวจสอบข้อมูลหลักสูตรและข้อสอบจริง...');
  const { data: classrooms } = await adminClient.from('classrooms').select('id, title, join_code, lessons(id, title)');
  console.log(`  ✅ ห้องเรียนออนไลน์ทั้งหมด: ${classrooms?.length || 0} ห้อง`);
  classrooms?.forEach(c => {
    console.log(`     - [${c.join_code}] ${c.title} (${c.lessons?.length || 0} บทเรียน)`);
  });

  const { data: quizzes } = await adminClient.from('quizzes').select('id, title, grade_level, questions:quiz_questions(id)');
  console.log(`  ✅ คลังแบบทดสอบทั้งหมด: ${quizzes?.length || 0} ชุด`);
  quizzes?.forEach(q => {
    console.log(`     - [${q.grade_level}] ${q.title} (${q.questions?.length || 0} ข้อ)`);
  });

  // 3. Audit Endpoints and Web Pages
  console.log('\n🌐 [3/4] ตรวจสอบหน้าเว็บไซต์และ API Endpoints ทั้งหมด (HTTP Probe)...');
  let targetPort = 3001;
  const probe = await testRoute(3001, '/');
  if (!probe.ok) targetPort = 3000;

  const routes = [
    '/',
    '/about',
    '/classroom',
    '/classroom/history-p6-classroom',
    '/classroom/anti-corruption-p6-classroom',
    '/quiz',
    '/worksheets',
    '/lesson-plans',
    '/games',
    '/downloads',
    '/ai',
    '/student/login',
    '/student/register',
    '/student/dashboard',
    '/admin/students',
    '/admin/classroom',
    '/admin/quizzes',
    '/admin/settings',
    '/robots.txt',
    '/sitemap.xml'
  ];

  for (const route of routes) {
    const res = await testRoute(targetPort, route);
    if (res.ok) {
      console.log(`  ✅ [${res.statusCode}] ${route}`);
      passed++;
    } else {
      console.log(`  ❌ [${res.statusCode}] ${route} (${res.error || 'Failed'})`);
      failed++;
    }
  }

  // 4. Audit Admin Credentials
  console.log('\n🔐 [4/4] ตรวจสอบบัญชีผู้ดูแลระบบ (Admin)...');
  const { data: users } = await adminClient.auth.admin.listUsers();
  const admin = users?.users?.find(u => u.email === 'nasdking123@school.ac.th');
  if (admin) {
    console.log(`  ✅ บัญชีแอดมินครูคิง: ${admin.email} (ID: ${admin.id}) พร้อมใช้งาน 100%`);
    passed++;
  } else {
    console.log('  ⚠️ ไม่พบบัญชีแอดมิน nasdking123@school.ac.th');
    failed++;
  }

  console.log('\n================================================================');
  console.log(`  🎉 AUDIT COMPLETED: ผ่าน ${passed} การตรวจสอบ, ไม่ผ่าน ${failed} รายการ`);
  console.log('================================================================\n');
}

verifyFullSystem().catch(console.error);
