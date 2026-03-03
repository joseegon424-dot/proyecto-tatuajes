import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Robust initialization to prevent client-side exceptions if ENV vars are missing
const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isConfigured
    ? createClient(supabaseUrl!, supabaseAnonKey!)
    : new Proxy({} as any, {
        get: (target, prop) => {
            // Return a dummy function that returns a chainable dummy to avoid crashes like supabase.from().select()
            return () => ({
                select: () => ({
                    order: () => ({
                        limit: () => Promise.resolve({ data: [], error: null }),
                        then: (cb: any) => Promise.resolve({ data: [], error: null }).then(cb)
                    }),
                    then: (cb: any) => Promise.resolve({ data: [], error: null }).then(cb)
                }),
                insert: () => Promise.resolve({ data: null, error: null }),
                update: () => Promise.resolve({ data: null, error: null }),
                delete: () => Promise.resolve({ data: null, error: null }),
            });
        }
    });
