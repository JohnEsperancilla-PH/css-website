import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      forms: {
        Row: {
          id: string
          title: string
          description: string | null
          questions: unknown[]
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          questions: unknown[]
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          questions?: unknown[]
          is_active?: boolean
          updated_at?: string
        }
      }
      form_responses: {
        Row: {
          id: string
          form_id: string
          responses: unknown[]
          submitted_at: string
          ip_address: string | null
        }
        Insert: {
          id?: string
          form_id: string
          responses: unknown[]
          submitted_at?: string
          ip_address?: string | null
        }
        Update: {
          id?: string
          form_id?: string
          responses?: unknown[]
          ip_address?: string | null
        }
      }
    }
  }
}