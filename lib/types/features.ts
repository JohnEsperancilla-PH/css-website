export interface Feature {
  id: string
  title: string
  description?: string
  content: string
  thumbnail_url?: string
  demo_url?: string
  github_url?: string
  category: string
  author?: string
  technologies?: string[]
  is_published: boolean
  featured: boolean
  created_at: string
  updated_at: string
  published_at?: string
}

export interface FeatureCategory {
  id: string
  name: string
  color: string
  created_at: string
}

export type FeatureInsert = Omit<Feature, 'id' | 'created_at' | 'updated_at'>
export type FeatureUpdate = Partial<Omit<Feature, 'id' | 'created_at'>> 