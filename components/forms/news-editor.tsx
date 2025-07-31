'use client'

import { useState } from 'react'
import { Save, Image, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NewsArticle } from '@/lib/types/news'
import { supabase } from '@/lib/supabase/client'

interface NewsEditorProps {
  article?: NewsArticle
  onSave?: (article: NewsArticle) => void
}

const categories = [
  { value: 'announcement', label: 'Announcement' },
  { value: 'event', label: 'Event' },
  { value: 'update', label: 'Update' },
  { value: 'feature', label: 'Feature' },
  { value: 'news', label: 'News' }
]

export function NewsEditor({ article, onSave }: NewsEditorProps) {
  const [title, setTitle] = useState(article?.title || '')
  const [content, setContent] = useState(article?.content || '')
  const [excerpt, setExcerpt] = useState(article?.excerpt || '')
  const [thumbnailUrl, setThumbnailUrl] = useState(article?.thumbnail_url || '')
  const [category, setCategory] = useState(article?.category || 'announcement')
  const [author, setAuthor] = useState(article?.author || '')
  const [isPublished, setIsPublished] = useState(article?.is_published || false)
  const [isSaving, setIsSaving] = useState(false)

  async function handleSave() {
    if (!title.trim()) {
      alert('Please add a title for the article.')
      return
    }

    if (!content.trim()) {
      alert('Please add content to the article.')
      return
    }

    setIsSaving(true)
    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error('Supabase is not configured properly. Please check your environment variables.')
      }

      const articleData = {
        title: title.trim(),
        content: content.trim(),
        excerpt: excerpt.trim() || null,
        thumbnail_url: thumbnailUrl.trim() || null,
        category,
        author: author.trim() || null,
        is_published: isPublished,
        updated_at: new Date().toISOString()
      }

      let savedArticle: NewsArticle

      if (article?.id) {
        const { data, error } = await supabase
          .from('news_articles')
          .update(articleData)
          .eq('id', article.id)
          .select()
          .single()

        if (error) throw error
        savedArticle = data
      } else {
        const { data, error } = await supabase
          .from('news_articles')
          .insert({
            ...articleData,
            created_at: new Date().toISOString(),
            published_at: isPublished ? new Date().toISOString() : null
          })
          .select()
          .single()

        if (error) throw error
        savedArticle = data
      }

      onSave?.(savedArticle)
      alert('Article saved successfully!')
    } catch (error: unknown) {
      console.error('Error saving article:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      alert(`Failed to save article: ${errorMessage}`)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Article Header */}
      <div className="mb-10 p-8 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Article Title <span className="text-red-500">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your article title..."
              className={`text-2xl font-bold ${!title.trim() ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
            />
            {!title.trim() && (
              <p className="text-red-500 text-sm mt-1">Article title is required</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author (optional)
              </label>
              <Input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Enter author name..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thumbnail URL (optional)
            </label>
            <div className="flex gap-2">
              <Input
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="Enter image URL..."
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => setThumbnailUrl('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop')}
              >
                <Image className="w-4 h-4" />
                Sample
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt (optional)
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Add a brief excerpt or summary..."
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Content Editor */}
      <div className="mb-10 p-8 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Article Content <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article content here... You can use HTML tags for formatting."
              className={`w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y min-h-[400px] ${!content.trim() ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
            />
            {!content.trim() && (
              <p className="text-red-500 text-sm mt-1">Article content is required</p>
            )}
          </div>

          <div className="text-sm text-gray-600">
            <p className="mb-2">HTML formatting tips:</p>
            <ul className="space-y-1 text-xs">
              <li><code>&lt;p&gt;</code> - Paragraph</li>
              <li><code>&lt;h2&gt;</code> - Subheading</li>
              <li><code>&lt;strong&gt;</code> - Bold text</li>
              <li><code>&lt;em&gt;</code> - Italic text</li>
              <li><code>&lt;ul&gt;&lt;li&gt;</code> - Bullet points</li>
              <li><code>&lt;a href=&quot;...&quot;&gt;</code> - Links</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Preview */}
      {title && content && (
        <div className="mb-10 p-8 bg-white rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
          <div className="border rounded-lg p-6 bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
            {excerpt && (
              <p className="text-gray-600 italic mb-4">{excerpt}</p>
            )}
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      )}

      {/* Settings and Save */}
      <div className="p-8 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Publish immediately</span>
            </label>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {isPublished ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
              {isPublished ? 'Will be published' : 'Will be saved as draft'}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <span className={`flex items-center gap-2 ${title.trim() ? 'text-green-600' : 'text-red-600'}`}>
                  {title.trim() ? '✓' : '✗'} Title: {title.trim() ? 'Added' : 'Required'}
                </span>
                <span className={`flex items-center gap-2 ${content.trim() ? 'text-green-600' : 'text-red-600'}`}>
                  {content.trim() ? '✓' : '✗'} Content: {content.trim() ? 'Added' : 'Required'}
                </span>
              </div>
            </div>
            <Button
              onClick={handleSave}
              disabled={isSaving || !title.trim() || !content.trim()}
              size="lg"
              className="flex items-center gap-2 px-8 py-3"
            >
              <Save className="w-5 h-5" />
              {isSaving ? 'Saving...' : 'Save Article'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 