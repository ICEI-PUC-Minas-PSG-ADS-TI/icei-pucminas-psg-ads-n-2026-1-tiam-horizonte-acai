import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://anywbzflyrldirhsthjz.supabase.co'
const supabaseKey = 'sb_publishable_XDhdlKxi6QtwtzqCBdeddQ_KN92LSTD'

export const supabase = createClient(supabaseUrl, supabaseKey)