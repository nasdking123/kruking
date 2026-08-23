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
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('=== Checking Supabase Connection ===');
console.log('URL:', supabaseUrl);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Missing credentials in .env.local');
  process.exit(1);
}

const client = createClient(supabaseUrl, supabaseAnonKey);

async function checkConnection() {
  try {
    console.log('Testing query to categories table...');
    const { data: catData, error: catError } = await client.from('categories').select('*').limit(5);

    if (catError) {
      console.log('❌ Categories query error:', catError.message, `(Code: ${catError.code})`);
    } else {
      console.log('✅ Categories table queried successfully! Found', catData?.length, 'rows.');
    }

    console.log('Testing query to works table...');
    const { data: worksData, error: worksError } = await client.from('works').select('*').limit(5);

    if (worksError) {
      console.log('❌ Works query error:', worksError.message, `(Code: ${worksError.code})`);
    } else {
      console.log('✅ Works table queried successfully! Found', worksData?.length, 'rows.');
    }

    console.log('Testing query to modules table...');
    const { data: modData, error: modError } = await client.from('modules').select('*').limit(5);

    if (modError) {
      console.log('❌ Modules query error:', modError.message, `(Code: ${modError.code})`);
    } else {
      console.log('✅ Modules table queried successfully! Found', modData?.length, 'rows.');
    }

  } catch (err) {
    console.error('Connection failed with exception:', err);
  }
}

checkConnection();
