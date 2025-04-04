

// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qzqssxccbcozzemollyz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6cXNzeGNjYmNvenplbW9sbHl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MTgwMzQsImV4cCI6MjA1OTA5NDAzNH0.AmZK142CD1--8zLRYgZ0e7Q0Ii7lIaJau34pn9Lf_rI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

console.log("Initializing Supabase client with URL:", SUPABASE_URL);
console.log("Key starts with:", SUPABASE_PUBLISHABLE_KEY.substring(0, 10) + "...");

try {
  const client = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  console.log("Supabase client initialized successfully");
  
  // Verify the client is working by making a simple request
  client.auth.getSession().then(() => {
    console.log("Supabase auth connection verified");
  }).catch(error => {
    console.error("Error verifying Supabase auth connection:", error);
  });
  
  export const supabase = client;
} catch (error) {
  console.error("Error initializing Supabase client:", error);
  // Create a fallback client to prevent app crashes
  export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
}

