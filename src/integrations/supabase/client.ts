// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://bguyxwuvfsjjlikyfgjk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJndXl4d3V2ZnNqamxpa3lmZ2prIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0NTI1NTIsImV4cCI6MjA2NTAyODU1Mn0.PdGhVpvHFMCtY6W1jXfmdzJzTB8x5VKiF50QI-FJqxc";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);