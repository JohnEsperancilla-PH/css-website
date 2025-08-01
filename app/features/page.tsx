import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Feature } from '@/lib/types/features'
import { createClient } from '@/lib/supabase/server'
import { Calendar, Search, ArrowRight, ExternalLink, Github } from 'lucide-react'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Student Creations & Projects',
  description: 'Explore amazing projects, games, and innovations created by Computer Science students.',
  openGraph: {
    title: 'Student Creations & Projects',
    description: 'Explore amazing projects, games, and innovations created by Computer Science students.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Student Creations & Projects',
      },
    ],
    type: 'website',
    siteName: 'Computer Science Society - USLS',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Student Creations & Projects',
    description: 'Explore amazing projects, games, and innovations created by Computer Science students.',
    images: ['/og-image.png'],
  },
}

export default async function FeaturesPage() {
  const supabase = createClient()
  let features: Feature[] = []

  try {
    const { data, error } = await supabase
      .from('features')
      .select('*')
      .eq('is_published', true)
      .order('featured', { ascending: false })
      .order('published_at', { ascending: false })

    if (error) throw error
    features = data || []
  } catch (error) {
    console.error('Error fetching features:', error)
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

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Student Creations & Projects
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore amazing projects, games, and innovations created by Computer Science students.
          </p>
        </div>

        {/* Features Grid */}
        {features.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600">
              No student projects have been published yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <article key={feature.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                {/* Thumbnail */}
                {feature.thumbnail_url && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={feature.thumbnail_url}
                      alt={feature.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  {/* Meta */}
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className={`${getCategoryColor(feature.category)} text-xs`}>
                      {feature.category}
                    </Badge>
                    {feature.featured && (
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                        Featured
                      </Badge>
                    )}
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {formatDate(feature.published_at || feature.created_at)}
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {feature.title}
                  </h2>

                  {/* Description */}
                  {feature.description && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {feature.description}
                    </p>
                  )}

                  {/* Technologies */}
                  {feature.technologies && feature.technologies.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {feature.technologies.slice(0, 3).map((tech, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {tech}
                          </span>
                        ))}
                        {feature.technologies.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{feature.technologies.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Author */}
                  {feature.author && (
                    <p className="text-sm text-gray-500 mb-4">
                      by {feature.author}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <Link href={`/features/${feature.id}`}>
                      <Button variant="ghost" className="p-0 h-auto text-blue-600 hover:text-blue-700">
                        View Details
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                    
                    {feature.demo_url && (
                      <a href={feature.demo_url} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="sm" className="p-0 h-auto text-green-600 hover:text-green-700">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </a>
                    )}
                    
                    {feature.github_url && (
                      <a href={feature.github_url} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="sm" className="p-0 h-auto text-gray-600 hover:text-gray-700">
                          <Github className="w-4 h-4" />
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 