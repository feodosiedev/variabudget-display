
// This file properly handles Supabase client creation in both browser and server environments
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qzqssxccbcozzemollyz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6cXNzeGNjYmNvenplbW9sbHl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MTgwMzQsImV4cCI6MjA1OTA5NDAzNH0.AmZK142CD1--8zLRYgZ0e7Q0Ii7lIaJau34pn9Lf_rI";

// Safely create client with environment detection
const createSupabaseClient = () => {
  try {
    // Check if window is defined - browser environment
    if (typeof window !== 'undefined') {
      return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
    } else {
      // Server environment - provide empty fetch options to avoid headers issues
      return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
        auth: {
          persistSession: false,
        },
      });
    }
  } catch (error) {
    console.error('Error creating Supabase client:', error);
    
    // Return a mock client for SSR that will be replaced on client-side
    // This prevents crashes during SSR but doesn't attempt to make actual requests
    return {
      from: () => ({ 
        select: () => ({ 
          eq: () => ({ 
            single: () => ({}), 
            data: null, 
            error: null 
          }) 
        })  
      }),
      // Add other commonly used methods as needed
      auth: { onAuthStateChange: () => ({ data: null, error: null, subscription: { unsubscribe: () => {} } }) },
    } as any;
  }
};

// Export the client
export const supabase = createSupabaseClient();
