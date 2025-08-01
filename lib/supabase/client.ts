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
      news_articles: {
        Row: {
          id: string
          title: string
          content: string
          excerpt: string | null
          thumbnail_url: string | null
          category: string
          is_published: boolean
          author: string | null
          created_at: string
          updated_at: string
          published_at: string | null
        }
        Insert: {
          id?: string
          title: string
          content: string
          excerpt?: string | null
          thumbnail_url?: string | null
          category: string
          is_published?: boolean
          author?: string | null
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          content?: string
          excerpt?: string | null
          thumbnail_url?: string | null
          category?: string
          is_published?: boolean
          author?: string | null
          updated_at?: string
          published_at?: string | null
        }
      }
      news_categories: {
        Row: {
          id: string
          name: string
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          color: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          color?: string
        }
      }
      features: {
        Row: {
          id: string
          title: string
          description: string | null
          content: string
          thumbnail_url: string | null
          demo_url: string | null
          github_url: string | null
          category: string
          author: string | null
          technologies: string[] | null
          is_published: boolean
          featured: boolean
          created_at: string
          updated_at: string
          published_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          content: string
          thumbnail_url?: string | null
          demo_url?: string | null
          github_url?: string | null
          category: string
          author?: string | null
          technologies?: string[] | null
          is_published?: boolean
          featured?: boolean
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          content?: string
          thumbnail_url?: string | null
          demo_url?: string | null
          github_url?: string | null
          category?: string
          author?: string | null
          technologies?: string[] | null
          is_published?: boolean
          featured?: boolean
          updated_at?: string
          published_at?: string | null
        }
      }
      features_categories: {
        Row: {
          id: string
          name: string
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          color: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          color?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          content: string
          thumbnail_url: string | null
          date: string
          time: string
          location: string
          category: string
          max_attendees: number | null
          current_attendees: number | null
          registration_url: string | null
          is_published: boolean
          featured: boolean
          created_at: string
          updated_at: string
          published_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          content: string
          thumbnail_url?: string | null
          date: string
          time: string
          location: string
          category: string
          max_attendees?: number | null
          current_attendees?: number | null
          registration_url?: string | null
          is_published?: boolean
          featured?: boolean
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          content?: string
          thumbnail_url?: string | null
          date?: string
          time?: string
          location?: string
          category?: string
          max_attendees?: number | null
          current_attendees?: number | null
          registration_url?: string | null
          is_published?: boolean
          featured?: boolean
          updated_at?: string
          published_at?: string | null
        }
      }
      events_categories: {
        Row: {
          id: string
          name: string
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          color: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          color?: string
        }
      }
    }
  }
}