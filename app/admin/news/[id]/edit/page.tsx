'use client'

import { useState, useEffect } from 'react'
import { NewsEditor } from '@/components/forms/news-editor'
import { NewsArticle } from '@/lib/types/news'
import { supabase } from '@/lib/supabase/client'
import { UserMenu } from '@/components/auth/user-menu'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

export default function EditArticlePage() {
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [loading, setLoading] = useState(true)
  const [savedArticle, setSavedArticle] = useState<NewsArticle | null>(null)
  const params = useParams()
  const router = useRouter()

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
        .single()

      if (error) throw error
      setArticle(data)
    } catch (error) {
      console.error('Error fetching article:', error)
      alert('Failed to load article')
    } finally {
      setLoading(false)
    }
  }

  function handleSave(updatedArticle: NewsArticle) {
    setSavedArticle(updatedArticle)
    setArticle(updatedArticle)
    // Optionally redirect to the news dashboard after a short delay
    setTimeout(() => {
      router.push('/admin/news')
    }, 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-600" />
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
                         <p className="text-gray-600 mb-6">The article you&apos;re trying to edit doesn&apos;t exist or has been removed.</p>
            <Link href="/admin/news">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to News Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <Link href="/admin/news">
                  <Button variant="ghost" className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to News Dashboard
                  </Button>
                </Link>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Article</h1>
              <p className="text-lg text-gray-600">Update your news article or announcement</p>
            </div>
            <UserMenu />
          </div>
        </div>

        {/* Success Message */}
        {savedArticle && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <p className="font-medium">Article updated successfully!</p>
            </div>
            <p className="text-green-700 text-sm mt-1">
              Redirecting to news dashboard...
            </p>
          </div>
        )}

        {/* News Editor */}
        <NewsEditor article={article} onSave={handleSave} />
      </div>
    </div>
  )
} 