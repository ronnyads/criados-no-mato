import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Verify existence of environment variables to fail fast
if (!supabaseUrl || !supabaseKey) {
  console.warn('Variáveis do Supabase ausentes no .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
