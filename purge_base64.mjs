import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('Missng Supabase env variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function purgeDb() {
  console.log('Fetching configs...');
  const { data, error } = await supabase.from('store_configs').select('config').eq('id', 1).single();
  
  if (error) {
    console.error('Error fetching data:', error);
    return;
  }
  
  let config = data.config || {};
  let modified = false;

  // Purge base64 strings
  for (const key in config) {
    if (typeof config[key] === 'string' && config[key].startsWith('data:image/')) {
        config[key] = null;
        modified = true;
    }
  }

  if (config.products && Array.isArray(config.products)) {
    config.products = config.products.map(p => {
        if (typeof p.image === 'string' && p.image.startsWith('data:image/')) {
            modified = true;
            return { ...p, image: null };
        }
        return p;
    });
  }

  if (modified) {
      console.log('Base64 images found. Purging...');
      const { error: updateError } = await supabase.from('store_configs').update({ config }).eq('id', 1);
      if (updateError) {
          console.error('Failed to update db:', updateError);
      } else {
          console.log('Successfully purged massive base64 strings from store_configs.');
      }
  } else {
      console.log('No base64 images found in DB.');
  }
}

purgeDb();
