import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log('Testing Supabase upsert...');
  
  // Create a fake large payload (~1MB)
  const fakeImage = 'data:image/jpeg;base64,' + 'A'.repeat(1024 * 1024);
  
  const { data, error } = await supabase.from('store_configs').upsert({ 
    id: 1, 
    config: { fakeImage, test: true } 
  });
  
  if (error) {
    console.error('ERROR from Supabase:', error);
  } else {
    console.log('SUCCESS!');
  }
}

test();
