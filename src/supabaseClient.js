import { createClient } from '@supabase/supabase-js';

// --- GANTI DENGAN KREDENSIAL SUPABASE ANDA ---
const supabaseUrl = 'https://rdygqogilqkhgsmrpcov.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkeWdxb2dpbHFraGdzbXJwY292Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NDgxNzgsImV4cCI6MjA3NTMyNDE3OH0.JG6hAUJfailORCoa4mvWm9fdZvI6ycaBoBioMp_o1BE'; 
// ---------------------------------------------

// Ekspor klien supabase agar bisa digunakan di komponen lain
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
