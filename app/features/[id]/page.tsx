import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Feature } from '@/lib/types/features'
import { createClient } from '@/lib/supabase/server'
import { Calendar, Clock, User, ArrowLeft, ExternalLink, Github, Star } from 'lucide-react'
import Link from 'next/link'
import { Metadata } from 'next'
import { ShareButton } from './share-button'

interface FeaturePageProps {
  params: Promise<{ id: string }>
}

// Generate metadata for the page
export async function generateMetadata({ params }: FeaturePageProps): Promise<Metadata> {
  const supabase = createClient()
  const { id } = await params
  
  try {
    const { data: feature } = await supabase
      .from('features')
      .select('*')
      .eq('id', id)
      .eq('is_published', true)
      .single()

    if (!feature) {
      return {
        title: 'Project Not Found',
        description: 'The project you are looking for does not exist.',
      }
    }

    const ogImage = feature.thumbnail_url || '/og-image.png'
    const siteName = 'Computer Science Society - USLS'

    return {
      title: feature.title,
      description: feature.description || `${feature.title} - Student Project`,
      openGraph: {
        title: feature.title,
        description: feature.description || `${feature.title} - Student Project`,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: feature.title,
          },
        ],
        type: 'article',
        siteName: siteName,
        publishedTime: feature.published_at || feature.created_at,
        modifiedTime: feature.updated_at,
        authors: feature.author ? [feature.author] : undefined,
        section: feature.category,
      },
      twitter: {
        card: 'summary_large_image',
        title: feature.title,
        description: feature.description || `${feature.title} - Student Project`,
        images: [ogImage],
      },
      other: {
        'article:published_time': feature.published_at || feature.created_at,
        'article:modified_time': feature.updated_at,
        ...(feature.author && { 'article:author': feature.author }),
        'article:section': feature.category,
      },
    }
  } catch {
    return {
      title: 'Project Not Found',
      description: 'The project you are looking for does not exist.',
    }
  }
}

export default async function FeaturePage({ params }: FeaturePageProps) {
  const supabase = createClient()
  const { id } = await params
  let feature: Feature | null = null

  try {
    const { data, error } = await supabase
      .from('features')
      .select('*')
      .eq('id', id)
      .eq('is_published', true)
      .single()

    if (error) throw error
    feature = data
  } catch {
    console.error('Error fetching feature')
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
      'project': 'bg-blue-100 text-blue-800',
      'game': 'bg-green-100 text-green-800',
      'web-app': 'bg-purple-100 text-purple-800',
      'mobile-app': 'bg-orange-100 text-orange-800',
      'ai-ml': 'bg-red-100 text-red-800',
      'research': 'bg-gray-100 text-gray-800',
      'default': 'bg-gray-100 text-gray-800'
    }
    return colors[category as keyof typeof colors] || colors.default
  }

  if (!feature) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
            <p className="text-gray-600 mb-6">The project you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            <Link href="/features">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Projects
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
          <Link href="/features">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
            </Button>
          </Link>
        </div>

        {/* Feature Header */}
        <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Thumbnail */}
          {feature.thumbnail_url && (
            <div className="aspect-video overflow-hidden">
              <img
                src={feature.thumbnail_url}
                alt={feature.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Feature Content */}
          <div className="p-8">
            {/* Meta Information */}
            <div className="flex items-center gap-4 mb-6">
              <Badge className={`${getCategoryColor(feature.category)}`}>
                {feature.category}
              </Badge>
              {feature.featured && (
                <Badge className="bg-yellow-100 text-yellow-800">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
              {feature.author && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <User className="w-4 h-4" />
                  {feature.author}
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {feature.title}
            </h1>

            {/* Date and Time */}
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(feature.published_at || feature.created_at)}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {new Date(feature.published_at || feature.created_at).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>

            {/* Description */}
            {feature.description && (
              <div className="mb-8 p-4 bg-gray-50 rounded-lg border-l-4 border-primary">
                <p className="text-lg text-gray-700 italic">
                  {feature.description}
                </p>
              </div>
            )}

            {/* Technologies */}
            {feature.technologies && feature.technologies.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {feature.technologies.map((tech, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* External Links */}
            {(feature.demo_url || feature.github_url) && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Links</h3>
                <div className="flex gap-3">
                  {feature.demo_url && (
                    <a href={feature.demo_url} target="_blank" rel="noopener noreferrer">
                      <Button className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Live Demo
                      </Button>
                    </a>
                  )}
                  {feature.github_url && (
                    <a href={feature.github_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="flex items-center gap-2">
                        <Github className="w-4 h-4" />
                        View Code
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div 
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: feature.content }}
              />
            </div>

            {/* Share Button */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <ShareButton title={feature.title} description={feature.description} />
            </div>
          </div>
        </article>
      </div>
    </div>
  )
} 