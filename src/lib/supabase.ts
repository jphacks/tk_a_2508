// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-url-polyfill/auto"; // ← RN必須

const url = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const anon = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, anon, {
  auth: {
    storage: AsyncStorage, // ← RNはこれが重要
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // ← RN/Expoではfalse
  },
});
