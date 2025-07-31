'use client'

import { useState } from 'react'
import { NewsEditor } from '@/components/forms/news-editor'
import { NewsArticle } from '@/lib/types/news'
import { EnvironmentStatus } from '@/components/forms/environment-status'
import { UserMenu } from '@/components/auth/user-menu'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function NewArticlePage() {
  const [savedArticle, setSavedArticle] = useState<NewsArticle | null>(null)
  const router = useRouter()

  function handleSave(article: NewsArticle) {
    setSavedArticle(article)
    // Optionally redirect to the news dashboard after a short delay
    setTimeout(() => {
      router.push('/admin/news')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Environment Status */}
        <EnvironmentStatus />
        
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
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Article</h1>
              <p className="text-lg text-gray-600">Write and publish a new news article or announcement</p>
            </div>
            <UserMenu />
          </div>
        </div>

        {/* Success Message */}
        {savedArticle && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <p className="font-medium">Article saved successfully!</p>
            </div>
            <p className="text-green-700 text-sm mt-1">
              Redirecting to news dashboard...
            </p>
          </div>
        )}

        {/* News Editor */}
        <NewsEditor onSave={handleSave} />
      </div>
    </div>
  )
} 