'use client'

import { useState, useEffect } from 'react'
import { Plus, FileText, BarChart3, Eye, Edit, Trash2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Form } from '@/lib/types/forms'
import { supabase } from '@/lib/supabase/client'
import { UserMenu } from '@/components/auth/user-menu'
import { QRCodeGenerator } from '@/components/forms/qr-code-generator'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function FormsDashboard() {
  const [forms, setForms] = useState<Form[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchForms()
  }, [])

  async function fetchForms() {
    try {
      const { data, error } = await supabase
        .from('forms')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setForms(data || [])
    } catch (error) {
      console.error('Error fetching forms:', error)
    } finally {
      setLoading(false)
    }
  }

  async function toggleFormStatus(formId: string, isActive: boolean) {
    try {
      const { error } = await supabase
        .from('forms')
        .update({ is_active: !isActive, updated_at: new Date().toISOString() })
        .eq('id', formId)

      if (error) throw error
      
      setForms(prev => 
        prev.map(form => 
          form.id === formId ? { ...form, is_active: !isActive } : form
        )
      )
    } catch (error) {
      console.error('Error updating form status:', error)
      alert('Failed to update form status')
    }
  }

  async function deleteForm(formId: string) {
    if (!confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('forms')
        .delete()
        .eq('id', formId)

      if (error) throw error
      
      setForms(prev => prev.filter(form => form.id !== formId))
      alert('Form deleted successfully')
    } catch (error) {
      console.error('Error deleting form:', error)
      alert('Failed to delete form')
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="text-center py-8">Loading forms...</div>
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
              <h1 className="text-xl font-semibold text-gray-900">Forms Management</h1>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Forms Dashboard</h2>
              <p className="text-gray-600">Manage your forms and view responses</p>
            </div>
            <Link href="/admin/forms/new">
              <Button size="lg" className="flex items-center gap-2 px-6 py-3">
                <Plus className="w-5 h-5" />
                Create Form
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium text-gray-600">Total Forms</CardTitle>
                  <CardDescription className="text-3xl font-bold text-gray-900">{forms.length}</CardDescription>
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
                  <CardTitle className="text-sm font-medium text-gray-600">Active Forms</CardTitle>
                  <CardDescription className="text-3xl font-bold text-gray-900">
                    {forms.filter(f => f.is_active).length}
                  </CardDescription>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <BarChart3 className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium text-gray-600">Draft Forms</CardTitle>
                  <CardDescription className="text-3xl font-bold text-gray-900">
                    {forms.filter(f => !f.is_active).length}
                  </CardDescription>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Eye className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Forms List */}
        {forms.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No forms yet</h3>
              <p className="text-gray-600 mb-6 text-lg">Get started by creating your first form.</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>All Forms</CardTitle>
              <CardDescription>Manage and monitor your forms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Form
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Questions
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
                    {forms.map((form) => (
                      <tr key={form.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{form.title}</div>
                            {form.description && (
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {form.description}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={form.is_active ? "default" : "secondary"}>
                            {form.is_active ? 'Active' : 'Draft'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {form.questions.length}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(form.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex flex-wrap items-center gap-2">
                            <QRCodeGenerator 
                              formId={form.id} 
                              formTitle={form.title}
                            />
                            <Link href={`/forms/${form.id}`}>
                              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            </Link>
                            <Link href={`/admin/forms/${form.id}/edit`}>
                              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                            </Link>
                            <Link href={`/admin/forms/${form.id}/responses`}>
                              <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                                <BarChart3 className="w-4 h-4 mr-1" />
                                Responses
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleFormStatus(form.id, form.is_active)}
                              className="text-purple-600 hover:text-purple-700"
                            >
                              {form.is_active ? 'Deactivate' : 'Activate'}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteForm(form.id)}
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