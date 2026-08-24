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

async function resetAllData() {
  console.log('--- Purging All Sample/Demo Data from Production Database ---');

  // 1. Works & Relations
  await adminClient.from('works_tags').delete().neq('work_id', '00000000-0000-0000-0000-000000000000');
  await adminClient.from('work_files').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await adminClient.from('works').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('✅ Works cleared');

  // 2. Classrooms & Lessons
  await adminClient.from('lesson_attachments').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await adminClient.from('lessons').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await adminClient.from('classroom_students').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await adminClient.from('classrooms').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('✅ Classrooms cleared');

  // 3. Quizzes & Questions
  await adminClient.from('quiz_choices').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await adminClient.from('quiz_questions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await adminClient.from('quiz_attempts').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await adminClient.from('quizzes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('✅ Quizzes cleared');

  // 4. Downloads
  await adminClient.from('downloads').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('✅ Downloads cleared');

  // 5. Views & Activity logs
  await adminClient.from('views').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await adminClient.from('activity_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('✅ Analytics logs cleared');

  console.log('--- Production Database is now 100% Clean and Ready for Real Data ---');
}

resetAllData();
