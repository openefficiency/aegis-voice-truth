// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gtqcsbmosnhiabvlwmik.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0cWNzYm1vc25oaWFidmx3bWlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNDcyNzEsImV4cCI6MjA2MzgyMzI3MX0.wOczJzZxE60nT6L9CsFW81k8rb7uiz-Pf_FOm9o-jEk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);