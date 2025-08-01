'use client'

import { useState, useEffect } from 'react'
import { Plus, Code, BarChart3, Eye, Edit, Trash2, ArrowLeft, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Feature } from '@/lib/types/features'
import { supabase } from '@/lib/supabase/client'
import { UserMenu } from '@/components/auth/user-menu'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function FeaturesDashboard() {
  const [features, setFeatures] = useState<Feature[]>([])

  useEffect(() => {
    fetchFeatures()
  }, [])

  async function fetchFeatures() {
    try {
      const { data, error } = await supabase
        .from('features')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setFeatures(data || [])
    } catch (error) {
      console.error('Error fetching features:', error)
    }
  }

  async function toggleFeatureStatus(featureId: string, isPublished: boolean) {
    try {
      const updateData: {
        is_published: boolean
        updated_at: string
        published_at?: string
      } = {
        is_published: !isPublished,
        updated_at: new Date().toISOString()
      }

      if (!isPublished) {
        updateData.published_at = new Date().toISOString()
      }

      const { error } = await supabase
        .from('features')
        .update(updateData)
        .eq('id', featureId)

      if (error) throw error
      fetchFeatures()
    } catch (error) {
      console.error('Error toggling feature status:', error)
      alert('Failed to update feature status')
    }
  }

  async function toggleFeaturedStatus(featureId: string, isFeatured: boolean) {
    try {
      const { error } = await supabase
        .from('features')
        .update({
          featured: !isFeatured,
          updated_at: new Date().toISOString()
        })
        .eq('id', featureId)

      if (error) throw error
      fetchFeatures()
    } catch (error) {
      console.error('Error toggling featured status:', error)
      alert('Failed to update featured status')
    }
  }

  async function deleteFeature(featureId: string) {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('features')
        .delete()
        .eq('id', featureId)

      if (error) throw error
      fetchFeatures()
    } catch (error) {
      console.error('Error deleting feature:', error)
      alert('Failed to delete project')
    }
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

  const publishedFeatures = features.filter(f => f.is_published)
  const draftFeatures = features.filter(f => !f.is_published)
  const featuredFeatures = features.filter(f => f.featured)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-semibold text-gray-900">Features Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Features Dashboard</h2>
              <p className="text-gray-600">Manage student projects and showcase their creations</p>
            </div>
            <Link href="/admin/features/new">
              <Button size="lg" className="flex items-center gap-2 px-6 py-3">
                <Plus className="w-5 h-5" />
                Create Project
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium text-gray-600">Total Projects</CardTitle>
                  <CardDescription className="text-3xl font-bold text-gray-900">{features.length}</CardDescription>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Code className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium text-gray-600">Published</CardTitle>
                  <CardDescription className="text-3xl font-bold text-gray-900">{publishedFeatures.length}</CardDescription>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <Eye className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium text-gray-600">Drafts</CardTitle>
                  <CardDescription className="text-3xl font-bold text-gray-900">{draftFeatures.length}</CardDescription>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <BarChart3 className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium text-gray-600">Featured</CardTitle>
                  <CardDescription className="text-3xl font-bold text-gray-900">{featuredFeatures.length}</CardDescription>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Star className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Features List */}
        {features.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <Code className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects yet</h3>
              <p className="text-gray-600 mb-6">Get started by creating your first student project showcase.</p>
              <Link href="/admin/features/new">
                <Button size="lg" className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Create Your First Project
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>All Projects</CardTitle>
              <CardDescription>Manage and monitor student projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Project</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Author</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Featured</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Created</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {features.map((feature) => (
                      <tr key={feature.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium text-gray-900">{feature.title}</div>
                            {feature.description && (
                              <div className="text-sm text-gray-500 line-clamp-1">{feature.description}</div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={`${getCategoryColor(feature.category)} text-xs`}>
                            {feature.category}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {feature.author || 'Anonymous'}
                        </td>
                        <td className="py-4 px-4">
                          <Badge 
                            variant={feature.is_published ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {feature.is_published ? 'Published' : 'Draft'}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <Badge 
                            variant={feature.featured ? "default" : "outline"}
                            className={`text-xs ${feature.featured ? 'bg-yellow-100 text-yellow-800' : ''}`}
                          >
                            {feature.featured ? 'Featured' : 'Regular'}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {formatDate(feature.created_at)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleFeatureStatus(feature.id, feature.is_published)}
                            >
                              {feature.is_published ? <Eye className="w-4 h-4" /> : <BarChart3 className="w-4 h-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleFeaturedStatus(feature.id, feature.featured)}
                            >
                              <Star className={`w-4 h-4 ${feature.featured ? 'text-yellow-600' : 'text-gray-400'}`} />
                            </Button>
                            <Link href={`/admin/features/${feature.id}/edit`}>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteFeature(feature.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
} 