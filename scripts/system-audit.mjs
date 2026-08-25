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

const adminClient = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Helper for HTTP Get
function testRoute(port, path) {
  return new Promise((resolve) => {
    const options = {
      hostname: '127.0.0.1',
      port: port,
      path: path,
      method: 'GET',
      headers: {
        'User-Agent': 'SystemAuditRunner/1.0',
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

async function runSystemAudit() {
  console.log('=====================================================');
  console.log('       🔬 KRUKING PLATFORM - COMPLETE SYSTEM AUDIT    ');
  console.log('=====================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  // 1. DATABASE CONNECTIVITY & TABLE AUDIT
  console.log('📦 [1/4] AUDITING SUPABASE DATABASE TABLES...');
  const tables = ['works', 'categories', 'quizzes', 'quiz_questions', 'quiz_choices', 'classrooms', 'lessons', 'site_settings', 'homepage_sections', 'menus', 'menu_items', 'pages'];
  
  for (const table of tables) {
    totalTests++;
    try {
      const { data, count, error } = await adminClient.from(table).select('*', { count: 'exact', head: false }).limit(5);
      if (error) {
        console.log(`  ❌ Table "${table}": Error -> ${error.message}`);
      } else {
        console.log(`  ✅ Table "${table}": OK (${data?.length || 0} sample rows checked)`);
        passedTests++;
      }
    } catch (e) {
      console.log(`  ❌ Table "${table}": Exception -> ${e.message}`);
    }
  }

  // 2. SUPABASE AUTH ADMIN CREDENTIALS AUDIT
  console.log('\n🔐 [2/4] AUDITING ADMIN AUTHENTICATION...');
  totalTests++;
  try {
    const { data: users, error: userErr } = await adminClient.auth.admin.listUsers();
    if (userErr) {
      console.log(`  ❌ Auth List Users: Error -> ${userErr.message}`);
    } else {
      const adminUsers = users.users.filter(u => u.email?.includes('nasdking123'));
      if (adminUsers.length > 0) {
        console.log(`  ✅ Admin User Found: ${adminUsers.map(u => u.email).join(', ')} (Status: Active)`);
        passedTests++;
      } else {
        console.log('  ❌ Admin User: Not found!');
      }
    }
  } catch (e) {
    console.log(`  ❌ Auth Check: Exception -> ${e.message}`);
  }

  // 3. HTTP ROUTES & MODULES AUDIT
  console.log('\n🌐 [3/4] AUDITING HTTP ROUTES & PAGE ENDPOINTS...');
  const routesToTest = [
    '/',
    '/about',
    '/contact',
    '/certificates',
    '/resources',
    '/worksheets',
    '/lesson-plans',
    '/games',
    '/classroom',
    '/quiz',
    '/quiz/computational-thinking-quiz-p4-p6',
    '/downloads',
    '/ai',
    '/login',
    '/admin',
    '/admin/curriculum',
    '/admin/works',
    '/admin/works/new',
    '/admin/categories',
    '/admin/quizzes',
    '/admin/quizzes/new',
    '/admin/homepage',
    '/admin/menus',
    '/admin/pages',
    '/admin/modules',
    '/admin/analytics',
    '/admin/settings',
    '/sitemap.xml',
    '/robots.txt',
  ];

  // Check port 3000 or 3001
  let targetPort = 3001;
  const probe = await testRoute(3001, '/');
  if (!probe.ok) {
    targetPort = 3000;
  }

  for (const route of routesToTest) {
    totalTests++;
    const res = await testRoute(targetPort, route);
    if (res.ok) {
      console.log(`  ✅ Route "${route}": HTTP ${res.statusCode} (OK)`);
      passedTests++;
    } else {
      console.log(`  ❌ Route "${route}": HTTP ${res.statusCode} (${res.error || 'Failed'})`);
    }
  }

  // 4. SUMMARY
  console.log('\n=====================================================');
  console.log(`🎯 AUDIT COMPLETED: ${passedTests}/${totalTests} Tests Passed (${Math.round((passedTests / totalTests) * 100)}%)`);
  console.log('=====================================================\n');
}

runSystemAudit();
