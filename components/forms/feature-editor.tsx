'use client'

import { useState } from 'react'
import { Save, Image, Eye, EyeOff, ExternalLink, Github, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Feature } from '@/lib/types/features'
import { supabase } from '@/lib/supabase/client'

interface FeatureEditorProps {
  feature?: Feature
  onSave?: (feature: Feature) => void
}

const categories = [
  { value: 'project', label: 'Project' },
  { value: 'game', label: 'Game' },
  { value: 'web-app', label: 'Web App' },
  { value: 'mobile-app', label: 'Mobile App' },
  { value: 'ai-ml', label: 'AI/ML' },
  { value: 'research', label: 'Research' }
]

export function FeatureEditor({ feature, onSave }: FeatureEditorProps) {
  const [title, setTitle] = useState(feature?.title || '')
  const [description, setDescription] = useState(feature?.description || '')
  const [content, setContent] = useState(feature?.content || '')
  const [thumbnailUrl, setThumbnailUrl] = useState(feature?.thumbnail_url || '')
  const [demoUrl, setDemoUrl] = useState(feature?.demo_url || '')
  const [githubUrl, setGithubUrl] = useState(feature?.github_url || '')
  const [category, setCategory] = useState(feature?.category || 'project')
  const [author, setAuthor] = useState(feature?.author || '')
  const [technologies, setTechnologies] = useState(feature?.technologies?.join(', ') || '')
  const [isPublished, setIsPublished] = useState(feature?.is_published || false)
  const [isFeatured, setIsFeatured] = useState(feature?.featured || false)
  const [isSaving, setIsSaving] = useState(false)

  async function handleSave() {
    if (!title.trim()) {
      alert('Please add a title for the project.')
      return
    }

    if (!content.trim()) {
      alert('Please add content to the project.')
      return
    }

    setIsSaving(true)
    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error('Supabase is not configured properly. Please check your environment variables.')
      }

      const technologiesArray = technologies
        .split(',')
        .map(tech => tech.trim())
        .filter(tech => tech.length > 0)

      const featureData = {
        title: title.trim(),
        description: description.trim() || null,
        content: content.trim(),
        thumbnail_url: thumbnailUrl.trim() || null,
        demo_url: demoUrl.trim() || null,
        github_url: githubUrl.trim() || null,
        category,
        author: author.trim() || null,
        technologies: technologiesArray.length > 0 ? technologiesArray : null,
        is_published: isPublished,
        featured: isFeatured,
        updated_at: new Date().toISOString()
      }

      let savedFeature: Feature

      if (feature?.id) {
        const { data, error } = await supabase
          .from('features')
          .update(featureData)
          .eq('id', feature.id)
          .select()
          .single()

        if (error) throw error
        savedFeature = data
      } else {
        const { data, error } = await supabase
          .from('features')
          .insert({
            ...featureData,
            created_at: new Date().toISOString(),
            published_at: isPublished ? new Date().toISOString() : null
          })
          .select()
          .single()

        if (error) throw error
        savedFeature = data
      }

      onSave?.(savedFeature)
      alert('Project saved successfully!')
    } catch (error: unknown) {
      console.error('Error saving feature:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      alert(`Failed to save project: ${errorMessage}`)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Project Header */}
      <div className="mb-10 p-8 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Title <span className="text-red-500">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your project title..."
              className={`text-2xl font-bold ${!title.trim() ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
            />
            {!title.trim() && (
              <p className="text-red-500 text-sm mt-1">Project title is required</p>
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
              Technologies (comma-separated)
            </label>
            <Input
              value={technologies}
              onChange={(e) => setTechnologies(e.target.value)}
              placeholder="e.g., React, Node.js, Python, TensorFlow..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate multiple technologies with commas
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thumbnail URL (optional)
            </label>
            <div className="flex gap-2">
              <Input
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="Enter image URL (supports Imgur, Unsplash, etc.)..."
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => setThumbnailUrl('https://i.imgur.com/8tMUxPj.jpg')}
              >
                <Image className="w-4 h-4" aria-hidden="true" />
                Imgur Sample
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => setThumbnailUrl('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop')}
              >
                <Image className="w-4 h-4" aria-hidden="true" />
                Unsplash Sample
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Supports Imgur (i.imgur.com), Unsplash, and other image hosting services
            </p>
            
            {/* Thumbnail Preview */}
            {thumbnailUrl && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Thumbnail Preview:</p>
                <div className="relative w-full max-w-md">
                  <img
                    src={thumbnailUrl}
                    alt="Thumbnail preview"
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500">Image not found</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Demo URL (optional)
              </label>
              <div className="flex gap-2">
                <Input
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  placeholder="https://your-demo-url.com"
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => setDemoUrl('https://example.com')}
                >
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  Sample
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GitHub URL (optional)
              </label>
              <div className="flex gap-2">
                <Input
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username/repo"
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => setGithubUrl('https://github.com/username/project')}
                >
                  <Github className="w-4 h-4" aria-hidden="true" />
                  Sample
                </Button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a brief description of your project..."
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
              Project Content <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write about your project here... You can use HTML tags for formatting."
              className={`w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y min-h-[400px] ${!content.trim() ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
            />
            {!content.trim() && (
              <p className="text-red-500 text-sm mt-1">Project content is required</p>
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
            {description && (
              <p className="text-gray-600 italic mb-4">{description}</p>
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
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
              />
              <span className="text-sm text-gray-700">Mark as featured</span>
            </label>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {isPublished ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
              {isPublished ? 'Will be published' : 'Will be saved as draft'}
              {isFeatured && <Star className="w-4 h-4 text-yellow-600" />}
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
              {isSaving ? 'Saving...' : 'Save Project'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 