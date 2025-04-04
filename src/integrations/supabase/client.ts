
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qzqssxccbcozzemollyz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6cXNzeGNjYmNvenplbW9sbHl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MTgwMzQsImV4cCI6MjA1OTA5NDAzNH0.AmZK142CD1--8zLRYgZ0e7Q0Ii7lIaJau34pn9Lf_rI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

console.log("Initializing Supabase client with URL:", SUPABASE_URL);
console.log("Key starts with:", SUPABASE_PUBLISHABLE_KEY.substring(0, 10) + "...");

// Create the client in a safe way that works in both browser and server environments
const createSafeClient = () => {
  try {
    // Check if we're in a browser environment with XMLHttpRequest
    if (typeof window !== 'undefined' && 'XMLHttpRequest' in window) {
      return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
    } else {
      // In a non-browser environment or SSR context, create with fetch options
      return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
        auth: {
          persistSession: false,
        },
      });
    }
  } catch (error) {
    console.error("Error during Supabase client creation:", error);
    // Return a minimal client that won't throw errors
    return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
};

// Initialize the client
const supabaseClient = createSafeClient();

// Log successful initialization but don't test connection to avoid errors during SSR
console.log("Supabase client initialized");

// Export the client
export const supabase = supabaseClient;
