import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://vrzrkmqoxrillmiglagd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyenJrbXFveHJpbGxtaWdsYWdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwNTY1NDksImV4cCI6MjA1NzYzMjU0OX0.IZdWt-P8xs0HALBjbWc9IrvTzTyLSUehHNTCMP-xRRM";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
