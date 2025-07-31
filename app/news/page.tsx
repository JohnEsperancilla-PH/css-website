import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { NewsArticle } from '@/lib/types/news'
import { createClient } from '@/lib/supabase/server'
import { Calendar, Search, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Latest News & Updates',
  description: 'Stay up to date with the latest news, announcements, and updates from our team.',
  openGraph: {
    title: 'Latest News & Updates',
    description: 'Stay up to date with the latest news, announcements, and updates from our team.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Latest News & Updates',
      },
    ],
    type: 'website',
    siteName: 'Computer Science Society - USLS',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Latest News & Updates',
    description: 'Stay up to date with the latest news, announcements, and updates from our team.',
    images: ['/og-image.png'],
  },
}

export default async function NewsPage() {
  const supabase = createClient()
  let articles: NewsArticle[] = []

  try {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false })

    if (error) throw error
    articles = data || []
  } catch (error) {
    console.error('Error fetching articles:', error)
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  function getCategoryColor(category: string) {
    const colors = {
      'announcement': 'bg-blue-100 text-blue-800',
      'event': 'bg-green-100 text-green-800',
      'update': 'bg-purple-100 text-purple-800',
      'feature': 'bg-orange-100 text-orange-800',
      'news': 'bg-red-100 text-red-800',
      'default': 'bg-gray-100 text-gray-800'
    }
    return colors[category as keyof typeof colors] || colors.default
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Latest News & Updates
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay up to date with the latest news, announcements, and updates from our team.
          </p>
        </div>

        {/* Articles Grid */}
        {articles.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600">
              No articles have been published yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <article key={article.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                {/* Thumbnail */}
                {article.thumbnail_url && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={article.thumbnail_url}
                      alt={article.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  {/* Meta */}
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className={`${getCategoryColor(article.category)} text-xs`}>
                      {article.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {formatDate(article.published_at || article.created_at)}
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {article.title}
                  </h2>

                  {/* Excerpt */}
                  {article.excerpt && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                  )}

                  {/* Read More */}
                  <Link href={`/news/${article.id}`}>
                    <Button variant="ghost" className="p-0 h-auto text-blue-600 hover:text-blue-700">
                      Read More
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 