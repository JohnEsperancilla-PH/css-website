'use client'

import { useState, useEffect } from 'react'
import { Plus, FileText, Eye, Edit, Trash2, Globe, Calendar, User, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { NewsArticle } from '@/lib/types/news'
import { supabase } from '@/lib/supabase/client'
import { UserMenu } from '@/components/auth/user-menu'
import Link from 'next/link'

export default function NewsAdminDashboard() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArticles()
  }, [])

  async function fetchArticles() {
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setArticles(data || [])
    } catch (error) {
      console.error('Error fetching articles:', error)
    } finally {
      setLoading(false)
    }
  }

  async function toggleArticleStatus(articleId: string, isPublished: boolean) {
    try {
      const updateData = {
        is_published: !isPublished,
        updated_at: new Date().toISOString()
      }
      
      if (!isPublished) {
        updateData.published_at = new Date().toISOString()
      }

      const { error } = await supabase
        .from('news_articles')
        .update(updateData)
        .eq('id', articleId)

      if (error) throw error
      
      setArticles(prev => 
        prev.map(article => 
          article.id === articleId 
            ? { 
                ...article, 
                is_published: !isPublished,
                published_at: !isPublished ? new Date().toISOString() : article.published_at
              } 
            : article
        )
      )
    } catch (error) {
      console.error('Error updating article status:', error)
      alert('Failed to update article status')
    }
  }

  async function deleteArticle(articleId: string) {
    if (!confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('news_articles')
        .delete()
        .eq('id', articleId)

      if (error) throw error
      
      setArticles(prev => prev.filter(article => article.id !== articleId))
      alert('Article deleted successfully')
    } catch (error) {
      console.error('Error deleting article:', error)
      alert('Failed to delete article')
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString()
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

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-8">Loading articles...</div>
      </div>
    )
  }

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
              <h1 className="text-xl font-semibold text-gray-900">News Management</h1>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">News Dashboard</h2>
              <p className="text-gray-600">Manage your news articles and announcements</p>
            </div>
            <Link href="/admin/news/new">
              <Button size="lg" className="flex items-center gap-2 px-6 py-3">
                <Plus className="w-5 h-5" />
                Create Article
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
                  <CardTitle className="text-sm font-medium text-gray-600">Total Articles</CardTitle>
                  <CardDescription className="text-3xl font-bold text-gray-900">{articles.length}</CardDescription>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium text-gray-600">Published</CardTitle>
                  <CardDescription className="text-3xl font-bold text-gray-900">
                    {articles.filter(a => a.is_published).length}
                  </CardDescription>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <Globe className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium text-gray-600">Drafts</CardTitle>
                  <CardDescription className="text-3xl font-bold text-gray-900">
                    {articles.filter(a => !a.is_published).length}
                  </CardDescription>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Eye className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
                  <CardDescription className="text-3xl font-bold text-gray-900">
                    {articles.filter(a => {
                      const articleDate = new Date(a.created_at)
                      const now = new Date()
                      return articleDate.getMonth() === now.getMonth() && 
                             articleDate.getFullYear() === now.getFullYear()
                    }).length}
                  </CardDescription>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <Calendar className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Articles List */}
        {articles.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No articles yet</h3>
              <p className="text-gray-600 mb-6 text-lg">Get started by creating your first news article.</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>All Articles</CardTitle>
              <CardDescription>Manage and monitor your news articles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Article
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {articles.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{article.title}</div>
                          {article.excerpt && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {article.excerpt}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={`${getCategoryColor(article.category)} text-xs`}>
                          {article.category}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          article.is_published 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {article.is_published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {article.author || 'Anonymous'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(article.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link href={`/news/${article.id}`}>
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </Link>
                          <Link href={`/admin/news/${article.id}/edit`}>
                            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleArticleStatus(article.id, article.is_published)}
                            className="text-purple-600 hover:text-purple-700"
                          >
                            {article.is_published ? 'Unpublish' : 'Publish'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteArticle(article.id)}
                            className="text-red-600 hover:text-red-700"
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