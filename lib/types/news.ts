export interface NewsArticle {
  id: string
  title: string
  content: string
  excerpt?: string
  thumbnail_url?: string
  category: string
  is_published: boolean
  author?: string
  created_at: string
  updated_at: string
  published_at?: string
}

export interface NewsCategory {
  id: string
  name: string
  color: string
  created_at: string
}

export type NewsArticleInsert = Omit<NewsArticle, 'id' | 'created_at' | 'updated_at'>
export type NewsArticleUpdate = Partial<Omit<NewsArticle, 'id' | 'created_at'>> 