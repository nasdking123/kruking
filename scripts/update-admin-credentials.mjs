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

async function updateAdmin() {
  console.log('--- Setting Up Admin Credentials: user "nasdking123" with password "kingmilk.123" ---');

  const email = 'nasdking123@school.ac.th';
  const password = 'kingmilk.123';

  // 1. Check if user already exists
  const { data: usersData } = await adminClient.auth.admin.listUsers();
  const existing = usersData?.users?.find(u => u.email === email);

  if (existing) {
    const { error: updateError } = await adminClient.auth.admin.updateUserById(existing.id, {
      password: password,
      user_metadata: { username: 'nasdking123', full_name: 'ครูคิง (nasdking123)' },
      email_confirm: true,
    });
    if (updateError) console.error('Update error:', updateError);
    else console.log(`✅ Updated existing admin user ${email} password to ${password}`);
  } else {
    const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: { username: 'nasdking123', full_name: 'ครูคิง (nasdking123)' },
    });
    if (createError) console.error('Create error:', createError);
    else console.log(`✅ Created admin user ${email} (${newUser.user.id})`);
  }

  // Also create a backup user with email nasdking123@gmail.com for maximum flexibility
  const email2 = 'nasdking123@gmail.com';
  const existing2 = usersData?.users?.find(u => u.email === email2);
  if (existing2) {
    await adminClient.auth.admin.updateUserById(existing2.id, {
      password: password,
      user_metadata: { username: 'nasdking123' },
      email_confirm: true,
    });
  } else {
    await adminClient.auth.admin.createUser({
      email: email2,
      password: password,
      email_confirm: true,
      user_metadata: { username: 'nasdking123' },
    });
  }
  console.log(`✅ Credentials ready for username "nasdking123" / password "${password}"`);
}

updateAdmin();
