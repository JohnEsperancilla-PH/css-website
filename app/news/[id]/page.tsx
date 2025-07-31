'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { NewsArticle } from '@/lib/types/news'
import { supabase } from '@/lib/supabase/client'
import { Calendar, Clock, User, ArrowLeft, Share2 } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Head from 'next/head'

export default function NewsArticlePage() {
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [loading, setLoading] = useState(true)
  const params = useParams()

  useEffect(() => {
    if (params.id) {
      fetchArticle(params.id as string)
    }
  }, [params.id])

  async function fetchArticle(id: string) {
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .eq('id', id)
        .eq('is_published', true)
        .single()

      if (error) throw error
      setArticle(data)
    } catch (error) {
      console.error('Error fetching article:', error)
    } finally {
      setLoading(false)
    }
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

  function shareArticle() {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.excerpt,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center py-8">Loading article...</div>
        </div>
      </div>
    )
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

  // Generate Open Graph metadata
  const ogTitle = article.title
  const ogDescription = article.excerpt || `Read the latest news: ${article.title}`
  const ogImage = article.thumbnail_url || '/og-image.png' // Fallback to default OG image
  const ogUrl = typeof window !== 'undefined' ? window.location.href : ''
  const siteName = 'CSS Website' // Replace with your actual site name

  return (
    <>
      <Head>
        {/* Basic Meta Tags */}
        <title>{ogTitle}</title>
        <meta name="description" content={ogDescription} />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={ogUrl} />
        <meta property="og:site_name" content={siteName} />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={ogTitle} />
        <meta name="twitter:description" content={ogDescription} />
        <meta name="twitter:image" content={ogImage} />
        
        {/* Additional Article Meta Tags */}
        <meta property="article:published_time" content={article.published_at || article.created_at} />
        <meta property="article:modified_time" content={article.updated_at} />
        {article.author && (
          <meta property="article:author" content={article.author} />
        )}
        <meta property="article:section" content={article.category} />
      </Head>

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
                <Button
                  variant="outline"
                  onClick={shareArticle}
                  className="flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share Article
                </Button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </>
  )
} 