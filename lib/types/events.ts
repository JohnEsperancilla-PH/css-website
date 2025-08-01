export interface Event {
  id: string
  title: string
  description?: string
  content: string
  thumbnail_url?: string
  date: string
  time: string
  location: string
  category: string
  max_attendees?: number
  current_attendees?: number
  registration_url?: string
  is_published: boolean
  featured: boolean
  created_at: string
  updated_at: string
  published_at?: string
}

export interface EventCategory {
  id: string
  name: string
  color: string
  created_at: string
}

export type EventInsert = Omit<Event, 'id' | 'created_at' | 'updated_at'>
export type EventUpdate = Partial<Omit<Event, 'id' | 'created_at'>> 