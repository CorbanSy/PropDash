//propdash-mvp\src\lib\supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ✅ Create a unique storage key per tab using a random ID
const tabId = `tab_${Math.random().toString(36).substring(2, 11)}`;

// ✅ Custom storage adapter that isolates each tab
const customStorage = {
  getItem: (key) => {
    return sessionStorage.getItem(`${tabId}_${key}`);
  },
  setItem: (key, value) => {
    sessionStorage.setItem(`${tabId}_${key}`, value);
  },
  removeItem: (key) => {
    sessionStorage.removeItem(`${tabId}_${key}`);
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: customStorage, // ✅ Use custom isolated storage
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    // ✅ CRITICAL: Disable storage listener to prevent cross-tab sync
    storageKey: tabId, // Unique storage key per tab
  },
  global: {
    headers: {
      'X-Tab-ID': tabId, // Optional: helps with debugging
    },
  },
});

// ✅ Disable BroadcastChannel syncing (prevents cross-tab auth state sync)
if (typeof BroadcastChannel !== 'undefined') {
  const originalBroadcastChannel = window.BroadcastChannel;
  window.BroadcastChannel = function(name) {
    // Only block Supabase auth channels
    if (name && name.includes('supabase_auth')) {
      console.log('🚫 Blocked Supabase BroadcastChannel to isolate tabs');
      return {
        postMessage: () => {},
        close: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
      };
    }
    return new originalBroadcastChannel(name);
  };
}

console.log(`🆔 Tab ID: ${tabId} - This tab has independent auth`);

if (typeof window !== "undefined") {
  window.supabase = supabase;
}