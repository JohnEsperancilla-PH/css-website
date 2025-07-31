import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { NewsArticle } from '@/lib/types/news'
import { createClient } from '@/lib/supabase/server'
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Metadata } from 'next'
import { ShareButton } from './share-button'

interface NewsArticlePageProps {
  params: Promise<{ id: string }>
}

// Generate metadata for the page
export async function generateMetadata({ params }: NewsArticlePageProps): Promise<Metadata> {
  const supabase = createClient()
  const { id } = await params
  
  try {
    const { data: article } = await supabase
      .from('news_articles')
      .select('*')
      .eq('id', id)
      .eq('is_published', true)
      .single()

    if (!article) {
      return {
        title: 'Article Not Found',
        description: 'The article you are looking for does not exist.',
      }
    }

    const ogImage = article.thumbnail_url || '/og-image.png'
    const siteName = 'Computer Science Society - USLS'

    return {
      title: article.title,
      description: article.excerpt || `${article.title}`,
      openGraph: {
        title: article.title,
        description: article.excerpt || `${article.title}`,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: article.title,
          },
        ],
        type: 'article',
        siteName: siteName,
        publishedTime: article.published_at || article.created_at,
        modifiedTime: article.updated_at,
        authors: article.author ? [article.author] : undefined,
        section: article.category,
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: article.excerpt || `${article.title}`,
        images: [ogImage],
      },
      other: {
        'article:published_time': article.published_at || article.created_at,
        'article:modified_time': article.updated_at,
        ...(article.author && { 'article:author': article.author }),
        'article:section': article.category,
      },
    }
  } catch {
    return {
      title: 'Article Not Found',
      description: 'The article you are looking for does not exist.',
    }
  }
}

export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
  const supabase = createClient()
  const { id } = await params
  let article: NewsArticle | null = null

  try {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .eq('id', id)
      .eq('is_published', true)
      .single()

    if (error) throw error
    article = data
  } catch {
    console.error('Error fetching article')
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  function getCategoryColor(category: string) {
    const colors = {
      'announcement': 'bg-blue-100 text-blue-800',
      'event': 'bg-green-100 text-green-800',
      'update': 'bg-purple-100 text-purple-800',
      'feature': 'bg-orange-100 text-orange-800',
      'default': 'bg-gray-100 text-gray-800'
    }
    return colors[category as keyof typeof colors] || colors.default
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-6">The article you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            <Link href="/news">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to News
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/news">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to News
            </Button>
          </Link>
        </div>

        {/* Article Header */}
        <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Thumbnail */}
          {article.thumbnail_url && (
            <div className="aspect-video overflow-hidden">
              <img
                src={article.thumbnail_url}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="p-8">
            {/* Meta Information */}
            <div className="flex items-center gap-4 mb-6">
              <Badge className={`${getCategoryColor(article.category)}`}>
                {article.category}
              </Badge>
              {article.author && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <User className="w-4 h-4" />
                  {article.author}
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {article.title}
            </h1>

            {/* Date and Time */}
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(article.published_at || article.created_at)}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {new Date(article.published_at || article.created_at).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>

            {/* Excerpt */}
            {article.excerpt && (
              <div className="mb-8 p-4 bg-gray-50 rounded-lg border-l-4 border-primary">
                <p className="text-lg text-gray-700 italic">
                  {article.excerpt}
                </p>
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div 
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>

            {/* Share Button */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <ShareButton title={article.title} excerpt={article.excerpt} />
            </div>
          </div>
        </article>
      </div>
    </div>
  )
} 