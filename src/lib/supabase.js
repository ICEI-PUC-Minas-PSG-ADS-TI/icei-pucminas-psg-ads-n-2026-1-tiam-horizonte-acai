import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
<<<<<<< HEAD
import { Platform } from 'react-native'
=======
>>>>>>> parent of 15dfcc4 (apagando uma pasta duplicada)

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

<<<<<<< HEAD
const storage = Platform.OS === 'web'
  ? {
      getItem: (key) => Promise.resolve(typeof window !== 'undefined' ? window.localStorage.getItem(key) : null),
      setItem: (key, value) => Promise.resolve(typeof window !== 'undefined' ? window.localStorage.setItem(key, value) : null),
      removeItem: (key) => Promise.resolve(typeof window !== 'undefined' ? window.localStorage.removeItem(key) : null),
    }
  : AsyncStorage

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
=======
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
>>>>>>> parent of 15dfcc4 (apagando uma pasta duplicada)
  },
})