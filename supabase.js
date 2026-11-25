import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const chave = process.env.EXPO_PUBLIC_SUPABASE_KEY;

// Se o .env não existir, o app não quebra: só não salva no histórico
export const supabase =
  url && chave
    ? createClient(url, chave, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;