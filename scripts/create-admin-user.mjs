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

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing supabaseUrl or serviceRoleKey');
  process.exit(1);
}

const adminClient = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createAdmin() {
  const email = 'kruking.admin@school.ac.th';
  const password = 'KruKingSecure2026!';

  console.log(`Creating Admin User: ${email}...`);

  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: 'ครูคิง ผู้ดูแลระบบ',
      role: 'super_admin',
    },
  });

  if (error) {
    if (error.message.includes('already exists') || error.message.includes('already registered')) {
      console.log('User already exists, updating password...');
      // Find and update password
      const { data: usersData } = await adminClient.auth.admin.listUsers();
      const existingUser = usersData.users.find(u => u.email === email);
      if (existingUser) {
        await adminClient.auth.admin.updateUserById(existingUser.id, {
          password,
          email_confirm: true,
        });
        console.log('✅ Password updated successfully!');
      }
    } else {
      console.error('❌ Error creating user:', error.message);
    }
  } else {
    console.log('✅ Admin user created successfully with ID:', data.user.id);
  }
}

createAdmin();
